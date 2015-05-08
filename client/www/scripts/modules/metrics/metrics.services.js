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
      var interval = JSON.parse(window.localStorage.getItem('metricsUpdateInterval'));
      if (!interval) {
        interval = metricsUpdateInterval;
      }
      return metricsUpdateInterval = interval;
    };
    svc.setMetricsUpdateInterval = function(interval) {
      if (interval && Number.isInteger(interval)) {
        metricsUpdateInterval = interval;
        window.localStorage.setItem('metricsUpdateInterval', JSON.stringify(metricsUpdateInterval));
      }
      return metricsUpdateInterval;
    };
    svc.getMaxInitDataPointThreshold = function() {
      var threshold = JSON.parse(window.localStorage.getItem('maxInitDataPointThreshold'));
      if (!threshold) {
        threshold = maxInitDataPointThreshold;
      }
      return maxInitDataPointThreshold = threshold;
    };
    svc.setMaxInitDataPointThreshold = function(threshold) {
      if (threshold && Number.isInteger(threshold)) {
        maxInitDataPointThreshold = threshold;
        window.localStorage.setItem('maxInitDataPointThreshold', JSON.stringify(maxInitDataPointThreshold));
      }
      return maxInitDataPointThreshold;
    };
    svc.getMaxDataPointThrottle = function() {
      var threshold = JSON.parse(window.localStorage.getItem('maxDataPointThrottle'));
      if (!threshold) {
        threshold = maxDataPointThrottle;
      }
      return maxDataPointThrottle = threshold;
    };
    svc.setMaxDataPointThrottle = function(threshold) {
      if (threshold && Number.isInteger(threshold)) {
        maxDataPointThrottle = threshold;
        window.localStorage.setItem('maxDataPointThrottle', JSON.stringify(maxDataPointThrottle));
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
      for (var i = 0;i < currentChartConfigData.length;i++) {

        var chart = currentChartConfigData[i];

        loop2:
        for (var k = 0;k < chart.metrics.length;k++) {
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

      for (var i = 0;i <  metricsData.length;i++) {
        var metrics = metricsData[i].metrics;
        for (var k = 0;k < metrics.length;k++) {
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
          margin : {
            top: 40,
            right: 60,
            bottom: 40,
            left: 105
          },
          x: function(d){ return d.x; },
          y: function(d){ return d.y; },
          useInteractiveGuideline: true,
          transitionDuration: 100,
          xAxis: {
            axisLabel: 'timestamp',
            tickFormat: function(d) {

              return d3.time.format('%I:%M:%S')(new Date(d));
            }
          },
          yAxis: {
            tickFormat: function(d){
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
            'margin': '10px 13px 0px 7px'
          }
        },
        caption: {
          enable: false,
          html: '',
          css: {
            'text-align': 'justify',
            'margin': '10px 13px 0px 7px'
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
