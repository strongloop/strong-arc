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

    svc.getMetricsSnapShot = function(server, filter) {

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
  '$timeout',
  '$http',
  '$q',
  '$log',
  function($timeout, $http, $q, $log) {
    var svc = this;
    var currentChartConfigData = [];
    function isMetricActive(chartMetric) {
      var chartName = chartMetric.name;

      var isActive = true;

      loop1:
      for (var i = 0;i < currentChartConfigData.length;i++) {

        var chart = currentChartConfigData[i];

        loop2:
        for (var k = 0;k < chart.metrics.length;k++) {
          var metric = chart.metrics[k];
          // must be correct type of port (tcp4 or tcp6)
          if (METRICS_CONST[metric.constant] === chartMetric) {

              isActive = metric.active;

              break loop1;
          }
        }
      }

      return isActive; //  temporary

    }
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

    svc.getChartMetricsData = function(chart, metrics) {
      var returnArray = [];

      switch(chart.name) {

        case 'cpu':
          if (isMetricActive(METRICS_CONST.CPU_TOTAL)){
            returnArray.push({
              values: metrics[METRICS_CONST.CPU_TOTAL],      //values - represents the array of {x,y} data points
              key: 'Total', //key  - the name of the series.
              color: svc.getMetricColor(METRICS_CONST.CPU_TOTAL)  //color - optional: choose your own line color.
            });
          }
          if (isMetricActive(METRICS_CONST.CPU_USER)){
            returnArray.push({
              values: metrics[METRICS_CONST.CPU_USER],      //values - represents the array of {x,y} data points
              key: 'User', //key  - the name of the series.
              color:  svc.getMetricColor(METRICS_CONST.CPU_USER)  //color - optional: choose your own line color.
            });
          }
          if (isMetricActive(METRICS_CONST.CPU_SYSTEM)){
            returnArray.push({
              values: metrics[METRICS_CONST.CPU_SYSTEM],
              key: 'System',
              color:  svc.getMetricColor(METRICS_CONST.CPU_SYSTEM)
            });
          }
          break;

        case 'loop':
          if (isMetricActive(METRICS_CONST.LOOP_AVG)){
            returnArray.push({
              values: metrics[METRICS_CONST.LOOP_AVG],      //values - represents the array of {x,y} data points
              key: 'Avg', //key  - the name of the series.
              color: svc.getMetricColor(METRICS_CONST.LOOP_AVG)  //color - optional: choose your own line color.
            });
          }
          if (isMetricActive(METRICS_CONST.LOOP_MIN)){
            returnArray.push({
              values: metrics[METRICS_CONST.LOOP_MIN],
              key: 'Min',
              color: svc.getMetricColor(METRICS_CONST.LOOP_MIN)
            });
          }
          if (isMetricActive(METRICS_CONST.LOOP_MAX)){
            returnArray.push({
              values: metrics[METRICS_CONST.LOOP_MAX],
              key: 'Max',
              color: svc.getMetricColor(METRICS_CONST.LOOP_MAX)
            });
          }
          break;

        case 'loopCount':
          if (isMetricActive(METRICS_CONST.LOOP_COUNT)){
            returnArray.push({
              values: metrics[METRICS_CONST.LOOP_COUNT],      //values - represents the array of {x,y} data points
              key: 'Count', //key  - the name of the series.
              color: svc.getMetricColor(METRICS_CONST.LOOP_COUNT)  //color - optional: choose your own line color.
            });
          }
          break;

        case 'counters':
          if (isMetricActive(METRICS_CONST.MEMCACHED_COUNT)){
            if (metrics[METRICS_CONST.MEMCACHED_COUNT]) {
              returnArray.push({
                values: metrics[METRICS_CONST.MEMCACHED_COUNT],      //values - represents the array of {x,y} data points
                key: 'Memcached', //key  - the name of the series.
                color: svc.getMetricColor(METRICS_CONST.MEMCACHED_COUNT)  //color - optional: choose your own line color.
              });
            }
          }
          if (isMetricActive(METRICS_CONST.LOOP_COUNT)){
            if (metrics[METRICS_CONST.LOOP_COUNT]) {
              returnArray.push({
                values: metrics[METRICS_CONST.LOOP_COUNT],      //values - represents the array of {x,y} data points
                key: 'Loop', //key  - the name of the series.
                color: svc.getMetricColor(METRICS_CONST.LOOP_COUNT)  //color - optional: choose your own line color.
              });
            }
          }
          if (isMetricActive(METRICS_CONST.MONGO_COUNT)){
            if (metrics[METRICS_CONST.MONGO_COUNT]) {
              returnArray.push({
                values: metrics[METRICS_CONST.MONGO_COUNT],      //values - represents the array of {x,y} data points
                key: 'MongoDB', //key  - the name of the series.
                color: svc.getMetricColor(METRICS_CONST.MONGO_COUNT)  //color - optional: choose your own line color.
              });
            }
          }
          if (isMetricActive(METRICS_CONST.HTTP_COUNT)){
            if (metrics[METRICS_CONST.HTTP_COUNT]) {
              returnArray.push({
                values: metrics[METRICS_CONST.HTTP_COUNT],      //values - represents the array of {x,y} data points
                key: 'HTTP', //key  - the name of the series.
                color: svc.getMetricColor(METRICS_CONST.HTTP_COUNT)  //color - optional: choose your own line color.
              });
            }
          }
          if (isMetricActive(METRICS_CONST.MYSQL_COUNT)){
            if (metrics[METRICS_CONST.MYSQL_COUNT]) {
              returnArray.push({
                values: metrics[METRICS_CONST.MYSQL_COUNT],      //values - represents the array of {x,y} data points
                key: 'MySQL', //key  - the name of the series.
                color: svc.getMetricColor(METRICS_CONST.MYSQL_COUNT)  //color - optional: choose your own line color.
              });
            }
          }
          if (isMetricActive(METRICS_CONST.REDIS_COUNT)){
            if (metrics[METRICS_CONST.REDIS_COUNT]) {
              returnArray.push({
                values: metrics[METRICS_CONST.REDIS_COUNT],      //values - represents the array of {x,y} data points
                key: 'Redis', //key  - the name of the series.
                color: svc.getMetricColor(METRICS_CONST.REDIS_COUNT)  //color - optional: choose your own line color.
              });
            }
          }

          break;

        case 'http':
          if (isMetricActive(METRICS_CONST.HTTP_AVG)){
            returnArray.push({
              values: metrics[METRICS_CONST.HTTP_AVG],      //values - represents the array of {x,y} data points
              key: 'Avg', //key  - the name of the series.
              color: svc.getMetricColor(METRICS_CONST.HTTP_AVG)  //color - optional: choose your own line color.
            });
          }
          if (isMetricActive(METRICS_CONST.HTTP_MIN)){
            returnArray.push({
              values: metrics[METRICS_CONST.HTTP_MIN],
              key: 'Min',
              color: svc.getMetricColor(METRICS_CONST.HTTP_MIN)
            });
          }
          if (isMetricActive(METRICS_CONST.HTTP_MAX)){
            returnArray.push({
              values: metrics[METRICS_CONST.HTTP_MAX],
              key: 'Max',
              color: svc.getMetricColor(METRICS_CONST.HTTP_MAX)
            });
          }
          break;

        case 'httpCount':
          if (isMetricActive(METRICS_CONST.HTTP_COUNT)){
            returnArray.push({
              values: metrics[METRICS_CONST.HTTP_COUNT],      //values - represents the array of {x,y} data points
              key: 'Count', //key  - the name of the series.
              color: svc.getMetricColor(METRICS_CONST.HTTP_COUNT)  //color - optional: choose your own line color.
            });
          }
          break;

        case 'mongodb':
          if (isMetricActive(METRICS_CONST.MONGO_AVG)){
            returnArray.push({
              values: metrics[METRICS_CONST.MONGO_AVG],      //values - represents the array of {x,y} data points
              key: 'Avg', //key  - the name of the series.
              color: svc.getMetricColor(METRICS_CONST.MONGO_AVG)  //color - optional: choose your own line color.
            });
          }
          if (isMetricActive(METRICS_CONST.MONGO_MIN)){
            returnArray.push({
              values: metrics[METRICS_CONST.MONGO_MIN],
              key: 'Min',
              color:  svc.getMetricColor(METRICS_CONST.MONGO_MIN)
            });
          }
          if (isMetricActive(METRICS_CONST.MONGO_MAX)){
            returnArray.push({
              values: metrics[METRICS_CONST.MONGO_MAX],
              key: 'Max',
              color: svc.getMetricColor(METRICS_CONST.MONGO_MAX)
            });
          }
          break;

        case 'memcached':
          if (isMetricActive(METRICS_CONST.MEMCACHED_AVG)){
            returnArray.push({
              values: metrics[METRICS_CONST.MEMCACHED_AVG],      //values - represents the array of {x,y} data points
              key: 'Avg', //key  - the name of the series.
              color: svc.getMetricColor(METRICS_CONST.MEMCACHED_AVG)  //color - optional: choose your own line color.
            });
          }
          if (isMetricActive(METRICS_CONST.MEMCACHED_MIN)){
            returnArray.push({
              values: metrics[METRICS_CONST.MEMCACHED_MIN],
              key: 'Min',
              color: svc.getMetricColor(METRICS_CONST.MEMCACHED_MIN)
            });
          }
          if (isMetricActive(METRICS_CONST.MEMCACHED_MAX)){
            returnArray.push({
              values: metrics[METRICS_CONST.MEMCACHED_MAX],
              key: 'Max',
              color: svc.getMetricColor(METRICS_CONST.MEMCACHED_MAX)
            });
          }
          break;

        case 'mysql':
          if (isMetricActive(METRICS_CONST.MYSQL_AVG)){
            if (metrics[METRICS_CONST.MYSQL_AVG]) {
              returnArray.push({
                values: metrics[METRICS_CONST.MYSQL_AVG],      //values - represents the array of {x,y} data points
                key: 'Avg', //key  - the name of the series.
                color: svc.getMetricColor(METRICS_CONST.MYSQL_AVG)  //color - optional: choose your own line color.
              });
            }
          }
          if (isMetricActive(METRICS_CONST.MYSQL_MIN)){
            if (metrics[METRICS_CONST.MYSQL_MIN]) {
              returnArray.push({
                values: metrics[METRICS_CONST.MYSQL_MIN],
                key: 'Min',
                color: svc.getMetricColor(METRICS_CONST.MYSQL_MIN)
              });
            }
          }
          if (isMetricActive(METRICS_CONST.MYSQL_MAX)){
            if (metrics[METRICS_CONST.MYSQL_MAX]) {
              returnArray.push({
                values: metrics[METRICS_CONST.MYSQL_MAX],
                key: 'Max',
                color: svc.getMetricColor(METRICS_CONST.MYSQL_MAX)
              });
            }
          }
          break;

        case 'redis':
          if (isMetricActive(METRICS_CONST.REDIS_AVG)){
            returnArray.push({
              values: metrics[METRICS_CONST.REDIS_AVG],      //values - represents the array of {x,y} data points
              key: 'Avg', //key  - the name of the series.
              color: svc.getMetricColor(METRICS_CONST.REDIS_AVG)  //color - optional: choose your own line color.
            });
          }
          if (isMetricActive(METRICS_CONST.REDIS_MIN)){
            returnArray.push({
              values: metrics[METRICS_CONST.REDIS_MIN],
              key: 'Min',
              color: svc.getMetricColor(METRICS_CONST.REDIS_MIN)
            });
          }
          if (isMetricActive(METRICS_CONST.REDIS_MAX)){
            returnArray.push({
              values: metrics[METRICS_CONST.REDIS_MAX],
              key: 'Max',
              color: svc.getMetricColor(METRICS_CONST.REDIS_MAX)
            });
          }
          break;

        case 'heap':
          if (isMetricActive(METRICS_CONST.HEAP_USED)){
            returnArray.push({
              values: metrics[METRICS_CONST.HEAP_USED],      //values - represents the array of {x,y} data points
              key: 'Used', //key  - the name of the series.
              color: svc.getMetricColor(METRICS_CONST.HEAP_USED),  //color - optional: choose your own line color.
              area: true      //area - set to true if you want this line to turn into a filled area chart.
            });
          }
          if (isMetricActive(METRICS_CONST.HEAP_TOTAL)){
            returnArray.push({
              values: metrics[METRICS_CONST.HEAP_TOTAL],
              key: 'Total',
              color: svc.getMetricColor(METRICS_CONST.HEAP_TOTAL)
            });
          }
          break;

        default:

      }

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
          }
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


