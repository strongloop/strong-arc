Metrics.directive('slMetricsTitle', [
  function() {
    return {
      templateUrl: './scripts/modules/metrics/templates/metrics.title.html'
    }
  }
]);
Metrics.directive('slMetricsInstrumentation', [
  function() {
    return {
      link: function(scope, el, attrs) {

        window.setUI();

        scope.$watch('sysTime', function(newVal) {
          React.renderComponent(MetricsUpdateCounter({scope:scope}), el[0]);
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

