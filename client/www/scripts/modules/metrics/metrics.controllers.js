Metrics.controller('MetricsMainController', [
  '$scope',
  '$log',
  'growl',
  '$interval',
  'MetricsService',
  'CommonPidService',
  'CommonPMService',
  'ChartConfigService',
  function($scope, $log, growl, $interval, MetricsService, CommonPidService, CommonPMService, ChartConfigService) {

    $scope.isDisplayChartValid = false; // control display of charts (transition between data sets)
    $scope.currentServerConfig = CommonPMService.getLastPMServer();
    $scope.isCollapsed = true;  // settings
    $scope.maxInitDataPointThreshold = MetricsService.getMaxInitDataPointThreshold();  // limit on the initial data load
    $scope.maxDataPointThrottle = MetricsService.getMaxDataPointThrottle();  // max number of current data points
    $scope.metricsUpdateInterval = MetricsService.getMetricsUpdateInterval();
    $scope.currentPMServerName = ''; // hybrid host / port as unique id metric branch
    $scope.currentWorkerId;
    $scope.currentProcessId;
    $scope.activeProcess = null;
    $scope.isTimerRunning = false;
    $scope.dataPointCount = 0;
    $scope.lastTimeStamp = {}; // object collection of metrics servers and the last metrics received
    $scope.currentMetrics = []; // the root
    $scope.sysTime = {
      ticker:0
    };
    var ONE_SECOND = 1000; // counter timer between metrics requestsd

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


    /*
    *
    * Trim metrics arrays to keep data point count under control
    *
    * */
    function ensureThrottledMetric(metricStub, newMetric) {
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
      if (!metrics || !metrics.length) {
        $log.debug('processMetricsTick called with no metrics');
        return;
      }

      //iterate over the returned results to normalize the data
      metrics.map(function(metric) {
        var processedMetric = {
          timeStamp: metric.timeStamp,
          processId: metric.processId,
          cpu: {
            total:metric.gauges['cpu.total'],
            system:metric.gauges['cpu.system'],
            user:metric.gauges['cpu.user']
          },
          heap: {
            total:metric.gauges['heap.total'],
            used:metric.gauges['heap.used']
          },
          loop: {
            minimum:metric.gauges['loop.minimum'],
            maximum:metric.gauges['loop.maximum'],
            average:metric.gauges['loop.average'],
            count:metric.gauges['loop.count']
          }
        };


        /*
        *
        *   build the unique metric stub instance
        *   - unique server/port/processId object instance
        *   - track individual metrics as timestamped arrays off
        *   this object
        *   - eg: mStub.loopMetrics.average.push(newMetric);
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
        mStub = $scope.currentMetrics[$scope.currentPMServerName][$scope.currentProcessId];

        // each metric collection ex chart
        if (!mStub.loopMetrics) {
          mStub.loopMetrics = {
            average: [],
            minimum: [],
            maximum: []
          };
        }
        if (!mStub.cpuMetrics) {
          mStub.cpuMetrics = {
            total: [],
            user: [],
            system: []
          };
        }
        if (!mStub.heapMetrics) {
          mStub.heapMetrics = {
            total: [],
            used: []
          };
        }

        // add metric values to chart data
        mStub.loopMetrics.average =
          ensureThrottledMetric(mStub.loopMetrics.average,
            {x: new Date(processedMetric.timeStamp), y: processedMetric.loop.average});
        mStub.loopMetrics.minimum =
          ensureThrottledMetric(mStub.loopMetrics.minimum,
            {x: new Date(processedMetric.timeStamp), y: processedMetric.loop.minimum});
        mStub.loopMetrics.maximum =
          ensureThrottledMetric(mStub.loopMetrics.maximum,
            {x: new Date(processedMetric.timeStamp), y: processedMetric.loop.maximum});
        mStub.cpuMetrics.total =
          ensureThrottledMetric(mStub.cpuMetrics.total,
            {x: new Date(processedMetric.timeStamp), y: processedMetric.cpu.total});
        mStub.cpuMetrics.user =
          ensureThrottledMetric(mStub.cpuMetrics.user,
            {x: new Date(processedMetric.timeStamp), y: processedMetric.cpu.user});
        mStub.cpuMetrics.system =
          ensureThrottledMetric(mStub.cpuMetrics.system,
            {x: new Date(processedMetric.timeStamp), y: processedMetric.cpu.system});
        mStub.heapMetrics.total =
          ensureThrottledMetric(mStub.heapMetrics.total,
            {x: new Date(processedMetric.timeStamp), y: processedMetric.heap.total});
        mStub.heapMetrics.used =
          ensureThrottledMetric(mStub.heapMetrics.used,
            {x: new Date(processedMetric.timeStamp), y: processedMetric.heap.used});

        // last timestamp used for next query filter
        if (!$scope.lastTimeStamp[$scope.currentPMServerName]) {
          $scope.lastTimeStamp[$scope.currentPMServerName] = {};
        }
        $scope.lastTimeStamp[$scope.currentPMServerName][$scope.currentProcessId] = processedMetric.timeStamp;


      });
      if (mStub) {

        // set the consumable for the chart renderers
        // make it async to try and lighten things up a little
        $scope.cpuChartModel = ChartConfigService.getChartDataConfig('cpu', mStub.cpuMetrics);
        $scope.loopChartModel = ChartConfigService.getChartDataConfig('loop', mStub.loopMetrics);
        $scope.heapChartModel = ChartConfigService.getChartDataConfig('heap', mStub.heapMetrics);

        // data point count
        $scope.dataPointCount = mStub.cpuMetrics.total.length;
      }


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
        // fetch promise
        MetricsService.getMetricsSnapShot($scope.currentServerConfig, filter)
          .then(function(rawMetrics) {

            var metricsToRender = rawMetrics;

            // reset everything to 0 until timestamp issue is fixed
            if (rawMetrics.map) {
              var rawMetricsCount = rawMetrics.length;
              if (rawMetricsCount > $scope.maxInitDataPointThreshold) {

                var startPoint = ((rawMetricsCount - 1) - $scope.maxInitDataPointThreshold);

                metricsToRender = rawMetrics.slice(startPoint);

              }
              processMetricsTick(metricsToRender);

            }
          });
      }
      else {
        $log.warn('no metrics');
      }
    }

    // set chart options
    $scope.heapChartOptions = ChartConfigService.getChartOptions('heap');
    $scope.cpuChartOptions = ChartConfigService.getChartOptions('cpu');
    $scope.loopChartOptions = ChartConfigService.getChartOptions('loop');

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
    $scope.reRenderChart = function(chartName) {
      // trigger rernder of chart
      $scope.resetCharts();
    };
    $scope.resetCharts = function() {
      if ($scope.isValidProcess()) {
        $scope.restartTicker();
        getMetrics();
      }
    };
    $scope.startMetrics = function() {
      if ($scope.isValidProcess()) {
        $scope.currentMetrics = [];
        getMetrics();
        $scope.startTicker();

      }
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
      if (newVal && newVal.id) {
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

    $scope.startMetrics();
  }
]);
