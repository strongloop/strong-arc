Metrics.controller('MetricsMainController', [
  '$scope',
  '$state',
  '$log',
  'growl',
  '$interval',
  '$timeout',
  'MetricsService',
  'PMPidService',
  'PMHostService',
  'ChartConfigService',
  'ArcNavigationService',
  function($scope, $state, $log, growl, $interval, $timeout, MetricsService,
      PMPidService, PMHostService, ChartConfigService, ArcNavigationService) {

    $scope.selectedPMHost = {};

    $scope.isToggleHostChange = false;
    $scope.updateHost = function(host) {
      $scope.selectedPMHost = host;
      $scope.currentServerConfig = host;
      $scope.isToggleHostChange = !$scope.isToggleHostChange;
    };

    $scope.isDisplayChartValid = false; // control display of charts (transition between data sets)
    $scope.currentServerConfig = PMHostService.getLatestPMServer(function(host) {
      $scope.currentServerConfig = host;
      $scope.selectedPMHost = host;
    });

    $scope.isCollapsed = true;  // settings
    $scope.maxInitDataPointThreshold = MetricsService.getMaxInitDataPointThreshold();  // limit on the initial data load
    $scope.maxDataPointThrottle = MetricsService.getMaxDataPointThrottle();  // max number of current data points
    $scope.metricsUpdateInterval = MetricsService.getMetricsUpdateInterval();
    $scope.currentPMServerName = ''; // hybrid host / port as unique id metric branch
    $scope.currentWorkerId;
    $scope.currentProcessId;
    $scope.activeProcess = null;
    $scope.isTimerRunning = false;
    $scope.isBackground = false;
    $scope.isMetricsLoaded = false;
    $scope.dataPointCount = 0;
    $scope.lastGoodTS; // fallback
    $scope.breakLoop = false;
    $scope.currentStub; // temporary dataset to drive the current context
    $scope.lastTimeStamp = {}; // object collection of metrics servers and the last metrics received
    $scope.currentMetrics = []; // the root
    $scope.sysTime = {
      ticker:0
    };
    var ONE_SECOND = 1000; // counter timer between metrics requested
    var updateInterval = null;
    var activeProcess = null;

    $scope.chartData = [];

    $scope.updateHost = function(host) {
      $scope.host = host;
      $scope.selectedPMHost = host;
      $scope.currentServerConfig = host;
      $scope.isToggleHostChange = !$scope.isToggleHostChange;
    };

    $scope.updateProcesses = function(processes) {
      $scope.processes = processes;
      if (processes.map && processes.length > 0) {
        $scope.updateProcessSelection([processes[0]]);
      }
    };

    $scope.updateProcessSelection = function(selection) {
      if (selection.length) {
        selection[0].isActive = true;
        $scope.activeProcess = selection[0];
      }
    };

    // get last query time if it exists
    function getQueryDate() {
      var timestamp = Date.now() - (
        $scope.metricsUpdateInterval * ONE_SECOND *
        $scope.maxDataPointThrottle
      );

      return new Date(timestamp);
    }

    // metric filter
    function getMetricFilter() {
      var filter = {where:{
        processId: $scope.currentProcessId,
        workerId: $scope.currentWorkerId
      }};
      var queryDate = getQueryDate();
      if (queryDate) {
        filter.where.timeStamp = { gt: queryDate};
      }
      return filter;
    }
    function getMetrics() {
      if ($scope.isTimerRunning){
        getChartData(getMetricFilter());
      }
    }

    $scope.showMetrics = function(){
      return $scope.isMetricsLoaded;
    };


    function renderTheCharts() {
      $scope.readyCharts = true;

      $timeout(function() {
        // assign scope chart model variable data here
        $scope.chartData.map(function(chart) {
          var data = $scope.currentStub[chart.name];
          $scope[chart.chartConfig] = ChartConfigService.getChartOptions(chart.chartOptions);
          $scope[chart.chartModel] = ChartConfigService.getChartMetricsData(chart, data);
        });

        $scope.readyCharts = false;
      }, 0);
    }

    /*
     *
     * Raw data request
     *
     * - filter config
     * - server config
     *
     *
     * Request the data for a period of time based ona
     * - workerId
     * - processId
     *
     *
     * raw request may return too many records so a throttle
     * check is made before passing off to the metrics data
     * processor
     *
     * */
    function getChartData(filter) {
      if ($scope.isValidProcess()) {

        MetricsService.getMetricsSnapShot($scope.currentServerConfig, filter)
          .then(function(rawMetrics) {

            var metricsToRender = rawMetrics;

            // reset everything to 0 until timestamp issue is fixed
            if (rawMetrics && rawMetrics.length) {
              $scope.lastGoodTS = rawMetrics[rawMetrics.length -1].timeStamp;
              $scope.breakLoop = false;

              $scope.isMetricsLoaded = true;

              var rawMetricsCount = rawMetrics.length;
              if (rawMetricsCount > $scope.maxInitDataPointThreshold) {
                var startPoint = ((rawMetricsCount - 1) - $scope.maxInitDataPointThreshold);
                metricsToRender = rawMetrics.slice(startPoint);
              }

              MetricsService.processMetricsTick(metricsToRender, $scope);

              if ($scope.currentStub) {
                ChartConfigService.clearChartMemory();

                if (!$scope.isBackground) {
                  renderTheCharts();
                }
              }
            }
            else {
              $log.warn('getMetricsSnapShot returned no metrics ');
              var pmTimestamp = $scope.lastTimeStamp[$scope.currentPMServerName];

              if (pmTimestamp === undefined) {
                pmTimestamp = [];
                $scope.lastTimeStamp[$scope.currentPMServerName] = pmTimestamp;
              }

              pmTimestamp[$scope.currentProcessId] = $scope.lastGoodTS;

              if (!$scope.breakLoop) {
                getMetrics();
                $scope.breakLoop = true;
              }

              return;
            }
          });

      } else {
        $log.warn('no metrics');
      }
    }

    $scope.getChartOptions = function(configRef) {
      return $scope[configRef];
    };

    $scope.getChartModel = function(modelRef) {
      return $scope[modelRef];
    };

    $scope.showChart = function(chart, modelRef) {
      if ($scope.readyCharts) {
        return true;
      }

      var data = $scope[modelRef];

      if (data) {
        return data.some(function(x) {
          return x.values && x.values.length > 0;
        });
      }

      return false;
    };

    /*
    *
    *
    * check if current view is valid - is there a processId and a workerId
    *
    *
    * */
    $scope.isValidProcess = function() {
      if (($scope.currentProcessId && $scope.currentProcessId > -1) &&
          ($scope.currentWorkerId > -1)) {
        return true;
      }
      return false;
    };

    $scope.resetCharts = function() {
      if ($scope.isValidProcess()) {
        $scope.restartTicker();
        getMetrics();
      }
    };

    /*
     *
     * CHART CONTROLS - ACTIVE INDICATOR CIRCLE
     *
     * */
    $scope.getChartControlItemColor = function(item) {
      var x  = item;
      var styleString = '';
      if (item.active) {
        styleString = ('border: 1px solid ' + item.color + ';' +
                       'background-color: ' + item.color);
        return styleString;
      } else {
        styleString = 'border:1px solid #aaaaaa;background-color: #555555;';
        return styleString;
      }
    };

    /*
     *
     * HTML
     *
     * CHART CONTROL
     *
     *
     * */
    $scope.toggleChartMetric = function(chartMetric) {
      ChartConfigService.toggleMetricStatus(chartMetric);
      renderTheCharts();
    };
    $scope.startTicker = function() {
      $scope.sysTime.ticker = $scope.metricsUpdateInterval;
      $scope.startTimer();
    };
    $scope.restartTicker = function() {
      $scope.sysTime.ticker = $scope.metricsUpdateInterval;
      $scope.startTimer();
    };
    $scope.startTimer = function() {
      // cancel the previous interval if it wasn't cleaned up
      $scope.stopTimer();

      updateInterval = $interval(function() {
        $scope.sysTime.ticker--;

        if ($scope.sysTime.ticker < 1) {
          $scope.sysTime.ticker = $scope.metricsUpdateInterval;
          getMetrics();
        }
      }, ONE_SECOND);

      $scope.isTimerRunning = true;
    };
    $scope.stopTimer = function() {
      if (updateInterval !== null) {
        $interval.cancel(updateInterval);
        updateInterval = null;
        $scope.isTimerRunning = false;
      }
    };
    $scope.sleepUpdates = function() {
      $scope.isBackground = true;
    };
    $scope.wakeUpdates = function() {
      $scope.isBackground = false;
      renderTheCharts();
    };

    // Prevent the metrics updating if the window isn't visisble.
    ArcNavigationService.visibilityChange($scope.sleepUpdates.bind($scope),
                                          $scope.wakeUpdates.bind($scope));
    /*
     *
     *  WATCHES
     *
     * */
    $scope.$watch('activeProcess', function(newVal) {

      $scope.cpuChartModel = [];
      $scope.loopChartModel = [];
      $scope.heapChartModel = [];


      if (newVal && newVal.id) {
        $scope.currentWorkerId = newVal.workerId;
        $scope.currentProcessId = newVal.id;
        $scope.currentPMServerName = $scope.currentServerConfig.host + ':' + $scope.currentServerConfig.port;
        $scope.isDisplayChartValid = true;
        $scope.resetCharts();
      } else {
        $scope.stopTimer();
      }
    });
    $scope.$watch('processes', function(newVal) {
      if (newVal && newVal.length < 1) {
        $scope.isDisplayChartValid = false;
      }
    });
    $scope.$watch('maxInitDataPointThreshold', function(newVal) {
      if (newVal) {
        $scope.maxInitDataPointThreshold = MetricsService.setMaxInitDataPointThreshold(parseInt(newVal));
      }
    });
    $scope.$watch('maxDataPointThrottle', function(newVal) {
      if (newVal) {
        $scope.maxDataPointThrottle = MetricsService.setMaxDataPointThrottle(parseInt(newVal));
      }
    });
    $scope.$watch('metricsUpdateInterval', function(newVal) {
      if (newVal) {
        $scope.metricsUpdateInterval = MetricsService.setMetricsUpdateInterval(parseInt(newVal));
      }
    });
    $scope.$watch('currentServerConfig', function(newVal, oldVal) {

      // do a quick metrics request and clear the data
      $scope.currentWorkerId = '';
      $scope.currentProcessId = '';
      $scope.init();

    }, true);

    $scope.init = function() {

      // check if user has a valid metrics license
      MetricsService.validateLicense()
        .then(function(isValid) {
          if (!isValid) {
            $log.warn('metrics license is not valid');
            return; // was having some trouble with this return - hence the else clause
          }
          else {
            $scope.chartData = ChartConfigService.initChartConfigData()
              .then(function(response) {
                $scope.chartData = response;
              }); // replace with dynamic config
            if ($scope.isValidProcess()) {
              $scope.currentMetrics = [];
              getMetrics();
              $scope.startTicker();
            }
            else {
              $scope.stopTimer();
            }
          }
        })
        .catch(function(error) {
            $log.warn('exception validating metrics license (controller)');
        });

    };
    $scope.init();
  }
]);
