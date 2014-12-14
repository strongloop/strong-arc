Metrics.service('MetricsService', [
  '$http',
  '$log',
  'PMServiceMetric',
  function($http, $log, PMServiceMetric) {
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
    // test server config host value
    function checkServerConfigHost(methodName, config) {
      if (typeof config.host === 'object') {
        $log.error('found it S[' + methodName + ']');
      }
      return config;
    }
    svc.getMetricsSnapShot = function(server, filter) {
      checkServerConfigHost('getMetricsSnapShot', server)
      return PMServiceMetric.find(server, filter)
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.error('bad get metrics snapshot');
        });
    };

    return svc;
  }
]);
Metrics.service('ChartConfigService', [
  function() {
    var svc = this;
    var METRIC_CONST = {
      HEAP_CHART_NAME: 'heap',
      CPU_CHART_NAME: 'cpu',
      LOOP_CHART_NAME: 'loop'
    };
    function isMetricActive(chartMetricName) {
      var chartName = chartMetricName.split('.')[0];
      var metricsCount = viewChartConfig[chartName].metrics.length;

      for (var i = 0;i < metricsCount;i++) {
        if (viewChartConfig[chartName].metrics[i].name === chartMetricName) {
          return viewChartConfig[chartName].metrics[i].active;
        }
      }

    }

    var metricColors = {
      cpu: {
        total: '#ff7f0e',
        system: '#2ca02c',
        user: '#7777ff'
      },
      loop: {
        minimum: '#2ca02c',
        maximum: '#7777ff',
        average: '#A7D6B0',
        count: '#7777ff'
      },
      heap: {
        total: '#ff7f0e',
        used: '#7777ff'
      }
    };
    svc.getChartDataConfig = function(chartType, metrics) {
      var returnArray = [];
      switch(chartType) {

        case 'cpu':
          if (isMetricActive('cpu.total')){
            returnArray.push({
              values: metrics.total,      //values - represents the array of {x,y} data points
              key: 'CPU Total', //key  - the name of the series.
              color: metricColors.cpu.total  //color - optional: choose your own line color.
            });
          }
          if (isMetricActive('cpu.user')){
            returnArray.push({
              values: metrics.user,      //values - represents the array of {x,y} data points
              key: 'CPU User', //key  - the name of the series.
              color: metricColors.cpu.user  //color - optional: choose your own line color.
            });
          }
          if (isMetricActive('cpu.system')){
            returnArray.push({
              values: metrics.system,
              key: 'CPU System',
              color: metricColors.cpu.system,
              area: true      //area - set to true if you want this line to turn into a filled area chart.
            });
          }
          break;

        case 'loop':
          if (isMetricActive('loop.average')){
            returnArray.push({
              values: metrics.average,      //values - represents the array of {x,y} data points
              key: 'Loop Average', //key  - the name of the series.
              color: metricColors.loop.average,  //color - optional: choose your own line color.
              area: true      //area - set to true if you want this line to turn into a filled area chart.
            });
          }
          if (isMetricActive('loop.minimum')){
            returnArray.push({
              values: metrics.minimum,
              key: 'Loop Minimum',
              color: metricColors.loop.minimum
            });
          }
          if (isMetricActive('loop.maximum')){
            returnArray.push({
              values: metrics.maximum,
              key: 'Loop Maximum',
              color: metricColors.loop.maximum
            });
          }
          break;

        case 'heap':
          if (isMetricActive('heap.used')){
            returnArray.push({
              values: metrics.used,      //values - represents the array of {x,y} data points
              key: 'Heap Used', //key  - the name of the series.
              color: metricColors.heap.used,  //color - optional: choose your own line color.
              area: true      //area - set to true if you want this line to turn into a filled area chart.
            });
          }
          if (isMetricActive('heap.total')){
            returnArray.push({
              values: metrics.total,
              key: 'Heap Total',
              color: metricColors.heap.total
            });
          }
          break;

        default:


      }

      return returnArray;

    };
    svc.getChartOptions = function(chartName) {

      var chartOptions = {};

      var defaultOptions = {
        chart: {
          type: 'lineChart',
          height: 250,
          margin : {
            top: 40,
            right: 20,
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
          }
        },
        title: {
          enable: true,
          text: 'gobbledygook'
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

      switch(chartName) {


        case METRIC_CONST.HEAP_CHART_NAME: {
          chartOptions = defaultOptions;
          chartOptions.title = {
            text: 'Heap'
          };
          chartOptions.chart.yAxis.axisLabel = 'MB';

          break;
        }

        case METRIC_CONST.CPU_CHART_NAME: {
          chartOptions = defaultOptions;
          chartOptions.title = {
            text: 'CPU'
          };
          chartOptions.chart.yAxis.axisLabel = '%';

          break;
        }
        case METRIC_CONST.LOOP_CHART_NAME: {
          chartOptions = defaultOptions;
          chartOptions.title = {
            text: 'Loop'
          };
          chartOptions.chart.yAxis.axisLabel = 'ms';

          break;
        }
        default: {
          break;
        }
      }

      return chartOptions;
    };

    svc.getChartConfigs = function() {
      return viewChartConfig;
    };

    var viewChartConfig = {
      cpu: {
        display: 'CPU',
        active: true,
        metrics: [
          {
            name: 'cpu.user',
            display: 'User',
            active: true,
            color: '#7777ff'
          },
          {
            name: 'cpu.system',
            display: 'System',
            color: '#2ca02c',
            active: true
          },
          {
            name: 'cpu.total',
            display: 'Total',
            color: '#ff7f0e',
            active: true
          }
        ]
      },
      loop: {
        display: 'Loop',
        active: true,
        metrics: [
          {
            name: 'loop.count',
            display: 'Count',
            active: true,
            color: '#23f532'
          },
          {
            name:'loop.average',
            display: 'Average',
            active: true,
            color: '#A7D6B0'
          },
          {
            name:'loop.mimimum',
            display: 'Minimum',
            color: '#2ca02c',
            active: true
          },
          {
            name: 'loop.maximum',
            display: 'Maximum',
            color: '#7777ff',
            active: true
          }
        ]
      },
      heap: {
        display: 'Heap',
        status: 'off',
        metrics: [
          {
            name: 'heap.used',
            display: 'Used',
            active: true,
            color: '#7777ff'
          },
          {
            name: 'heap.total',
            display: 'Total',
            color: '#ff7f0e',
            active: true
          }
        ]
      }
    };
    return svc;
  }
]);


