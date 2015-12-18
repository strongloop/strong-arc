Metrics.service('MetricsService', [
  '$http',
  '$log',
  'PMServiceMetric',
  'LicensesService',
  function($http, $log, PMServiceMetric, LicensesService) {
    var svc = this;

    var currentService = {};
    var maxInitDataPointThreshold = 100;
    var maxDataPointThrottle = 100;
    var metricsUpdateInterval = 15;

    /*
    *
    * Trim metrics arrays to keep data point count under control
    *
    * */
    function ensureThrottledMetric(metricStub, newMetric, maxDataPoint) {
      if (!Array.isArray(metricStub)) {
        metricStub = [];
      }

      metricStub.push(newMetric);
      var cLength = metricStub.length;
      // check if current count is higher than the threshold
      if (cLength > maxDataPoint) {
        var cutoffPoint = (cLength - $scope.maxDataPointThrottle);
        // if so then slice the array
        metricStub = metricStub.slice(cutoffPoint);
      }
      return metricStub;
    }


    /*
     * PROCESS THE RAW METRICS OFF THE TICK
     *
     * - could be an initial dump of server memory
     * - or just a 15 second update
     *
     */
    svc.processMetricsTick = function(metrics, $scope) {
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
              return;
            }

            var yVal = processedMetric[chart.name][metric.name];
            if (yVal !== undefined) {
              $scope.currentStub[chart.name][METRICS_CONST[metric.constant]] =
              ensureThrottledMetric(
                $scope.currentStub[chart.name][METRICS_CONST[metric.constant]],
                {x: new Date(processedMetric.timeStamp), y: yVal},
                $scope.maxDataPointThrottle
              );
            }
          });
        });

        // last timestamp used for next query filter
        if (!$scope.lastTimeStamp[$scope.currentPMServerName]) {
          $scope.lastTimeStamp[$scope.currentPMServerName] = {};
        }

        $scope.lastTimeStamp[$scope.currentPMServerName][$scope.currentProcessId] = processedMetric.timeStamp;
      });

      // data point count
      $scope.dataPointCount = $scope.currentStub.cpu[METRICS_CONST.CPU_TOTAL].length;
    }

    svc.getCurrentService = function() {
      return currentService;
    };

    svc.setCurrentService = function(svc) {
      if (!svc.name || !svc.id) {
        $log.warn('attempt to set current metric service with invalid obj');
        return;
      }

      return currentService = svc;
    };

    svc.getMetricsUpdateInterval = function() {
      var interval = JSON.parse(
        window.localStorage.getItem('metricsUpdateInterval')
      );

      if (!interval) {
        interval = metricsUpdateInterval;
      }

      return metricsUpdateInterval = interval;
    };

    svc.setMetricsUpdateInterval = function(interval) {
      if (interval && Number.isInteger(interval)) {
        metricsUpdateInterval = interval;
        window.localStorage.setItem(
          'metricsUpdateInterval', JSON.stringify(metricsUpdateInterval)
        );
      }

      return metricsUpdateInterval;
    };

    svc.getMaxInitDataPointThreshold = function() {
      var threshold = JSON.parse(
        window.localStorage.getItem('maxInitDataPointThreshold')
      );

      if (!threshold) {
        threshold = maxInitDataPointThreshold;
      }

      return maxInitDataPointThreshold = threshold;
    };

    svc.setMaxInitDataPointThreshold = function(threshold) {
      if (threshold && Number.isInteger(threshold)) {
        maxInitDataPointThreshold = threshold;
        window.localStorage.setItem(
          'maxInitDataPointThreshold', JSON.stringify(maxInitDataPointThreshold)
        );
      }

      return maxInitDataPointThreshold;
    };

    svc.getMaxDataPointThrottle = function() {
      var threshold = JSON.parse(
        window.localStorage.getItem('maxDataPointThrottle')
      );

      if (!threshold) {
        threshold = maxDataPointThrottle;
      }

      return maxDataPointThrottle = threshold;
    };

    svc.setMaxDataPointThrottle = function(threshold) {
      if (threshold && Number.isInteger(threshold)) {
        maxDataPointThrottle = threshold;
        window.localStorage.setItem(
          'maxDataPointThrottle', JSON.stringify(maxDataPointThrottle)
        );
      }

      return maxDataPointThrottle;
    };

    svc.getMetricsSnapShot = function(server, filter) {
      return PMServiceMetric.find(server, filter)
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.error('bad get metrics snapshot');
        });
    };

    svc.validateLicense = function() {
      return LicensesService.validateModuleLicense('Metrics', 'agent')
        .then(function(response) {
            return response;
          })
        .catch(function(error) {
            $log.warn('exception validating metrics license');
            return false;
          });
    };

    return svc;
  }
]);

Metrics.service('ChartConfigService', [
  '$timeout',
  '$http',
  '$q',
  '$log',
  function($timeout, $http, $q, $log) {
    var svc = this;
    var currentChartConfigData = [];

    svc.clearChartMemory = function() {
      // a bit of a hack to solve a memory leak in nvd3 when
      // updated multiple charts at the same time
      if (window.nv && window.nv.graphs) {
        window.nv.graphs = [];
      }
    };

    svc.toggleMetricStatus = function(chartMetric) {
      // find metric in the current chart config data
      loop1:
      for (var i = 0; i < currentChartConfigData.length; i++) {
        var chart = currentChartConfigData[i];

        loop2:
        for (var k = 0; k < chart.metrics.length; k++) {
          var metric = chart.metrics[k];

          if (metric.constant === chartMetric.constant) {
            // toggle its value
            chartMetric.active = metric.active = !metric.active;

            break loop1;
          }
        }

      }

      return;
    };

    svc.getCurrentChartUIConfig = function() {
      return currentChartConfigData;
    };

    svc.setCurrentChartUIConfig = function(config) {
      currentChartConfigData = config
      return currentChartConfigData;
    };

    svc.getChartConfigData = function() {
      if (currentChartConfigData && currentChartConfigData.length > 0) {
        //caller is expecting a chainable promise instead of an array
        var def = $q.defer();
        var data = { data: { charts: currentChartConfigData }};

        def.resolve(data);

        return def.promise;
      }

      return $http.get('./scripts/modules/metrics/metrics-config.json')
        .success(function(charts) {
          return charts;
        })
        .error(function(error) {
          $log.warn('bad get chart config: ' + error.message);
        });
    };

    svc.initChartConfigData = function() {
      return svc.getChartConfigData()
        .then(function(chartData) {
          currentChartConfigData = chartData.data.charts;
          return currentChartConfigData;
        });
    };

    svc.getMetricColor = function(metricRef) {
      var metricsData = currentChartConfigData;

      for (var i = 0; i < metricsData.length; i++) {
        var metrics = metricsData[i].metrics;

        for (var k = 0; k < metrics.length; k++) {
          if (metricRef === METRICS_CONST[metrics[k].constant]) {
            return metrics[k].color;
          }
        }
      }

      return '#123456';  // this should not happen but not the end of the world
    };

    svc.getMetricData = function(metrics, metricRef) {
      if (metricRef in metrics) {
        return metrics[metricRef];
      }

      return [];
    };

    svc.getChartMetricsData = function(chart, metrics) {
      var returnArray = [];

      currentChartConfigData.map(function(configChart) {
        if (configChart.name === chart.name) {
          configChart.metrics.map(function(metric) {
            if (metric.active) {
              //returnArray.push(metric);
              returnArray.push({
                values: svc.getMetricData(metrics, METRICS_CONST[metric.constant]),      //values - represents the array of {x,y} data points
                key: metric.key, //key  - the name of the series.
                color: svc.getMetricColor(METRICS_CONST[metric.constant])  //color - optional: choose your own line color.
              });
            }
          });
        }
      });

      return returnArray;
    };

    svc.getChartOptions = function(chartOptions) {
      var defaultOptions = {
        chart: {
          type: 'lineChart',
          height: 250,
          noData: 'pending data',
          margin: {
            top: 40,
            right: 60,
            bottom: 40,
            left: 105
          },
          x: function(d) { return d.x; },
          y: function(d) { return d.y; },
          useInteractiveGuideline: true,
          transitionDuration: 100,
          xAxis: {
            axisLabel: 'timestamp',
            tickFormat: function(d) {

              return d3.time.format('%I:%M:%S')(new Date(d));
            }
          },
          yAxis: {
            tickFormat: function(d) {
              return d3.format('.02f')(d);
            },
            axisLabelDistance: 0
          },
          showLegend: false
        },
        title: {
          enable: true,
          text: ''
        },
        subtitle: {
          enable: true,
          text: '',
          css: {
            'text-align': 'center',
            margin: '10px 13px 0px 7px'
          }
        },
        caption: {
          enable: false,
          html: '',
          css: {
            'text-align': 'justify',
            margin: '10px 13px 0px 7px'
          }
        }
      };

      var returnOptions = defaultOptions;
      if (chartOptions) {
        // merge returnOptions with chartOptions
        angular.extend(returnOptions, chartOptions);
      }

      return returnOptions;
    };

    return svc;
  }
]);
