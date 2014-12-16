Metrics.directive('slMetricsVisualTicker', [
  function() {
    return {
      replace:true,
      link: function(scope, el, attrs) {
        scope.$watch('sysTime', function(newVal) {
          React.renderComponent(MetricsVisualTicker({scope:scope}), el[0]);
        }, true);
      }
    }
  }
]);
Metrics.directive('slMetricsSettings', [
  function() {
    return {
      templateUrl: './scripts/modules/metrics/templates/metrics.settings.html'
    }
  }
]);
Metrics.directive('slMetricsChartContainer', [
  function() {
    return {
      templateUrl: './scripts/modules/metrics/templates/metrics.chart.container.html',
      link: function(scope, el, attrs) {
        scope.$watch('cpuChartModel', function() {
          setScrollView('.metrics-chart-view-container');
        });
      }
    }
  }
]);
Metrics.directive('slMetricsChartControls', [
  'MetricsService',
  'ChartConfigService',
  function(MetricsService, ChartConfigService) {
    return {
      templateUrl: './scripts/modules/metrics/templates/metrics.chart.controls.html',
      link: function(scope, el, attrs) {
        /*
         *
         * HTML
         *
         * CHART CONTROL
         *
         *
         * */
        scope.toggleChartMetric = function(chartMetricName) {

          var chartName = chartMetricName.split('.')[0];
          var chartConfigs = ChartConfigService.getChartConfigs();
          chartConfigs[chartName].metrics.map(function(metric) {
            if (metric.name === chartMetricName) {
              metric.active = !metric.active;
              scope.reRenderChart(chartName);
            }
          });
        }

        /*
         *
         * CHART CONTROLS - ACTIVE INDICATOR CIRCLE
         *
         * */
        scope.getChartControlItemColor = function(item) {
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
        * chart controls
        *
        * */
        scope.viewCharts = ChartConfigService.getChartConfigs();

      }
    }
  }

]);

