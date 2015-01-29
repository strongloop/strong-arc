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
          setScrollView('[data-id="metrics-main-content-container"]');
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

      }
    }
  }

]);

