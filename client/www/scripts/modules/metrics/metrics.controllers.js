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

    /*
    * Query filter helpers
    *
    * */
    // test for existing timestamp on given server stub
    function doesTimeStampExist() {
      if (!$scope.lastTimeStamp) {
        return false;
      }
      if (!$scope.lastTimeStamp[$scope.currentPMServerName]) {
        return false;
      }
      if (!$scope.lastTimeStamp[$scope.currentPMServerName][$scope.currentProcessId]) {
        return false;
      }
      return true;
    }
    // get last query time if it exists
    function getQueryDate() {
      if(!doesTimeStampExist()) {
        return;
      }
      return $scope.lastTimeStamp[$scope.currentPMServerName][$scope.currentProcessId];
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

    /*
    *
    * Trim metrics arrays to keep data point count under control
    *
    * */
    function ensureThrottledMetric(metricStub, newMetric) {
      if (!Array.isArray(metricStub)) {
        metricStub = [];
      }
      metricStub.push(newMetric);
      var cLength = metricStub.length;
      // check if current count is higher than the threshold
      if (cLength > $scope.maxDataPointThrottle) {
        var cutoffPoint = (cLength - $scope.maxDataPointThrottle);
        // if so then slice the array
        metricStub = metricStub.slice(cutoffPoint);
      }
      return metricStub;
    }

     /*
    *
    * PROCESS THE RAW METRICS OFF THE TICK
    *
    * - could be an initial dump of server memory
    * - or just a 15 second update
    *
    * */
    function processMetricsTick(metrics) {
      var mStub;  // placeholder for unique server/service metrics 'bucket'

      //iterate over the returned results to normalize the data
      metrics.map(function(metric) {
        var processedMetric = {
          timeStamp: metric.timeStamp,
          processId: metric.processId,
          cpu: {
            total:metric.gauges[METRICS_CONST.CPU_TOTAL],
            system:metric.gauges[METRICS_CONST.CPU_SYSTEM],
            user:metric.gauges[METRICS_CONST.CPU_USER]
          },
          heap: {
            total:metric.gauges[METRICS_CONST.HEAP_TOTAL],
            used:metric.gauges[METRICS_CONST.HEAP_USED]
          },
          loop: {
            minimum:metric.gauges[METRICS_CONST.LOOP_MIN],
            maximum:metric.gauges[METRICS_CONST.LOOP_MAX],
            average:metric.gauges[METRICS_CONST.LOOP_AVG]
          },
          loopCount: {
            count:metric.counters[METRICS_CONST.LOOP_COUNT]
          },
          http: {
            minimum:metric.gauges[METRICS_CONST.HTTP_MIN],
            maximum:metric.gauges[METRICS_CONST.HTTP_MAX],
            average:metric.gauges[METRICS_CONST.HTTP_AVG]
          },
          httpCount: {
            count:metric.counters[METRICS_CONST.HTTP_COUNT]
          },
          /*
          *
          * TIERS
          *
          * */
          mongodb: {
            minimum:metric.gauges[METRICS_CONST.MONGO_MIN],
            maximum:metric.gauges[METRICS_CONST.MONGO_MAX],
            average:metric.gauges[METRICS_CONST.MONGO_AVG]
          },
          mysql: {
            minimum:metric.gauges[METRICS_CONST.MYSQL_MIN],
            maximum:metric.gauges[METRICS_CONST.MYSQL_MAX],
            average:metric.gauges[METRICS_CONST.MYSQL_AVG]
          },
          redis: {
            minimum:metric.gauges[METRICS_CONST.REDIS_MIN],
            maximum:metric.gauges[METRICS_CONST.REDIS_MAX],
            average:metric.gauges[METRICS_CONST.REDIS_AVG]
          },
          dao: { // dao
            minimum:metric.gauges[METRICS_CONST.DAO_MIN],
            maximum:metric.gauges[METRICS_CONST.DAO_MAX],
            average:metric.gauges[METRICS_CONST.DAO_AVG]
          },
          leveldown: { // leveldown
            minimum:metric.gauges[METRICS_CONST.LEVELDOWN_MIN],
            maximum:metric.gauges[METRICS_CONST.LEVELDOWN_MAX],
            average:metric.gauges[METRICS_CONST.LEVELDOWN_AVG]
          },
          postgres: { // postgres
            minimum:metric.gauges[METRICS_CONST.POSTGRES_MIN],
            maximum:metric.gauges[METRICS_CONST.POSTGRES_MAX],
            average:metric.gauges[METRICS_CONST.POSTGRES_AVG]
          },
          oracle: { // oracle
            minimum:metric.gauges[METRICS_CONST.ORACLE_MIN],
            maximum:metric.gauges[METRICS_CONST.ORACLE_MAX],
            average:metric.gauges[METRICS_CONST.ORACLE_AVG]
          },
          riak: { // riak
            minimum:metric.gauges[METRICS_CONST.RIAK_MIN],
            maximum:metric.gauges[METRICS_CONST.RIAK_MAX],
            average:metric.gauges[METRICS_CONST.RIAK_AVG]
          },
          memcached: {
            minimum:metric.gauges[METRICS_CONST.MEMCACHED_MIN],
            maximum:metric.gauges[METRICS_CONST.MEMCACHED_MAX],
            average:metric.gauges[METRICS_CONST.MEMCACHED_AVG]
          },
          counters: {
            memcached:metric.counters[METRICS_CONST.MEMCACHED_COUNT],
            redis:metric.counters[METRICS_CONST.REDIS_COUNT],
            mysql:metric.counters[METRICS_CONST.MYSQL_COUNT],
            mongodb:metric.counters[METRICS_CONST.MONGO_COUNT],
            dao:metric.counters[METRICS_CONST.DAO_COUNT],
            leveldown:metric.counters[METRICS_CONST.LEVELDOWN_COUNT],
            postgres:metric.counters[METRICS_CONST.POSTGRES_COUNT],
            riak:metric.counters[METRICS_CONST.RIAK_COUNT],
            oracle:metric.counters[METRICS_CONST.ORACLE_COUNT],
            loop:metric.counters[METRICS_CONST.LOOP_COUNT],
            http:metric.counters[METRICS_CONST.HTTP_COUNT]
          }
        };

        /*
        *
        *   build the unique metric stub instance
        *   - unique server/port/processId object instance
        *   - track individual metrics as timestamped arrays off
        *   this object
        *   - eg: mStub['loop']['average'].push(newMetric);
        *
        * */
        $scope.currentProcessId = metric.processId;

        // check if the host and port have a metrics stub
        if (!$scope.currentMetrics[$scope.currentPMServerName]) {
          $scope.currentMetrics[$scope.currentPMServerName] = {};
        }
        if (!$scope.currentMetrics[$scope.currentPMServerName][$scope.currentProcessId]) {
          $scope.currentMetrics[$scope.currentPMServerName][$scope.currentProcessId] = {};
        }
        // short reference to unique metric 'stub' instance
        $scope.currentStub = $scope.currentMetrics[$scope.currentPMServerName][$scope.currentProcessId];

        /*
        * metrics type/name/group
        *
        *
        *
        * for each 'data' i.e metric group eg cpu
        *
        * iterate over the metrics collection
        *
        *
        * set each metric group
        *
        *
        * */

        $scope.chartData.map(function(chart) {
          /*
          * data.name
          * data.displayName
          * data.metrics []
          *
          * */
          // each metric collection ex chart
          if (!$scope.currentStub[chart.name]) {
            $scope.currentStub[chart.name] = {};
          }

          chart.metrics.map(function(metric) {
            if (!processedMetric[chart.name][metric.name]){
              //$log.warn('no metric: ' + chart.name + ':' + metric.name);
              return;

            }
            var yVal = processedMetric[chart.name][metric.name];
            if (yVal !== undefined) {
              $scope.currentStub[chart.name][METRICS_CONST[metric.constant]] =
                ensureThrottledMetric($scope.currentStub[chart.name][METRICS_CONST[metric.constant]],
                  {x: new Date(processedMetric.timeStamp), y: yVal});
            }
          });
        });

        // last timestamp used for next query filter
        if (!$scope.lastTimeStamp[$scope.currentPMServerName]) {
          $scope.lastTimeStamp[$scope.currentPMServerName] = {};
        }

        $scope.lastTimeStamp[$scope.currentPMServerName][$scope.currentProcessId] = processedMetric.timeStamp;
      });

      if ($scope.currentStub) {
        ChartConfigService.clearChartMemory();

        if (!$scope.isBackground) {
          renderTheCharts();
        }
      }

      // data point count
      $scope.dataPointCount = $scope.currentStub.cpu[METRICS_CONST.CPU_TOTAL].length;
    }

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

              processMetricsTick(metricsToRender);
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
