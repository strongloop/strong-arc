Metrics.controller('MetricsMainController', [
  '$scope',
  '$state',
  '$log',
  'growl',
  '$interval',
  'MetricsService',
  'PMPidService',
  'PMHostService',
  'ChartConfigService',
  function($scope, $state, $log, growl, $interval, MetricsService, PMPidService, PMHostService, ChartConfigService) {

    $scope.isDisplayChartValid = false; // control display of charts (transition between data sets)
    $scope.currentServerConfig = PMHostService.getLastPMServer();
    $scope.isCollapsed = true;  // settings
    $scope.maxInitDataPointThreshold = MetricsService.getMaxInitDataPointThreshold();  // limit on the initial data load
    $scope.maxDataPointThrottle = MetricsService.getMaxDataPointThrottle();  // max number of current data points
    $scope.metricsUpdateInterval = MetricsService.getMetricsUpdateInterval();
    $scope.currentPMServerName = ''; // hybrid host / port as unique id metric branch
    $scope.currentWorkerId;
    $scope.currentProcessId;
    $scope.activeProcess = null;
    $scope.isTimerRunning = false;
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

    $scope.chartData = [];


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
          //$log.debug('data name: ' + data.displayName);

          // each metric collection ex chart
          if (!$scope.currentStub[chart.name]) {
            $scope.currentStub[chart.name] = {};
          }

          chart.metrics.map(function(metric) {
            var yVal = processedMetric[chart.name][metric.name];
           // $log.debug();
            if (yVal !== undefined) {
              $scope.currentStub[chart.name][METRICS_CONST[metric.constant]] =
                ensureThrottledMetric($scope.currentStub[chart.name][METRICS_CONST[metric.constant]],
                  {x: new Date(processedMetric.timeStamp), y: yVal});
            }
            else {
             // $log.debug('|     ' + data.name + ':' + metric.name + '  YVAL: ' + yVal)
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

        renderTheCharts();


      }

      // data point count
      $scope.dataPointCount = $scope.currentStub['cpu'][METRICS_CONST.CPU_TOTAL].length;




    }

    function renderTheCharts() {
      // assign scope chart model variable data here
      $scope.chartData.map(function(chart) {
        var data = $scope.currentStub[chart.name];
        $scope[chart.chartConfig] = ChartConfigService.getChartOptions(chart.chartOptions);
        $scope[chart.chartModel] = ChartConfigService.getChartMetricsData(chart, data);

      });

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
        $scope.currentServerConfig = PMHostService.getLastPMServer();
        // fetch promise
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
              $scope.lastTimeStamp[$scope.currentPMServerName][$scope.currentProcessId] = $scope.lastGoodTS;
              if (!$scope.breakLoop) {
                getMetrics();
                $scope.breakLoop = true;
              }
              if ($state.includes('metrics')){
                growl.addWarnMessage('No metrics available. Your license may be invalid or not present. Please contact sales@strongloop.com for a valid license.', {ttl: 10000});
              }
              return;
            }
          });
      }
      else {
        $log.warn('no metrics');
      }
    }




    $scope.getChartOptions = function(configRef) {

      return $scope[configRef];

    };
    $scope.getChartModel = function(modelRef) {
      return $scope[modelRef];

    };


    /*
    *
    *
    * check if current view is valid - is there a processId and a workerId
    *
    *
    * */
    $scope.isValidProcess = function() {
      if (($scope.currentProcessId && $scope.currentProcessId > -1) && ($scope.currentWorkerId > -1)) {
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
        styleString = 'border:1px solid  '+ item.color + ';background-color: '+ item.color;
        return styleString;
      }
      else {
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
      if (!$scope.isTimerRunning) {
        if (!$scope.isTimerRunning) {
          $scope.isTimerRunning = true;
        }
        $interval(function() {
          $scope.sysTime.ticker--;
          if($scope.sysTime.ticker < 1) {
            $scope.sysTime.ticker = $scope.metricsUpdateInterval;
            getMetrics();
          }
        }, ONE_SECOND);
      }
    };


    /*
     *
     *  WATCHES
     *
     * */
    $scope.$watch('activeProcess', function(newVal) {

      $scope.cpuChartModel = [];
      $scope.loopChartModel = [];
      $scope.heapChartModel = [];

      $scope.currentServerConfig = PMHostService.getLastPMServer();
      if (newVal && newVal.id) {
        $log.info('arc metric: active process changed');
        $scope.currentWorkerId = newVal.workerId;
        $scope.currentProcessId = newVal.id;
        $scope.currentPMServerName = $scope.currentServerConfig.host + ':' + $scope.currentServerConfig.port;
        $scope.isDisplayChartValid = true;
        $scope.resetCharts();
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
    $scope.init = function() {
      $scope.chartData = ChartConfigService.initChartConfigData()
        .then(function(response) {
          $scope.chartData = response;
        }); // replace with dynamic config
      if ($scope.isValidProcess()) {
        $scope.currentMetrics = [];
        getMetrics();
        $scope.startTicker();

      }
    };
    $scope.init();
  }
]);
