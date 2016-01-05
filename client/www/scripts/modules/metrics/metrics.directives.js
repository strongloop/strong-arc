Metrics.directive('slMetricsVisualTicker', [
  function() {
    return {
      restrict: 'E',
      scope: {
        tickerSize: '=',
        tickerValue: '='
      },
      template: ('<div class="metrics-visual-ticker-container">' +
        '<ul class="metric-timer-list">' +
        '<li ng-repeat="tick in ticks">' +
        '<i class="{{getTickClass(tick)}}"></i>' +
        '</li>' +
        '</ul>' +
        '</div>'),
      link: function(scope, el, attrs) {
        scope.ticks = [];

        scope.getTickClass = function(tickVal) {
          return 'refresh-icon ' +
            (tickVal < scope.tickerValue ? 'on' : 'off');
        };

        scope.$watch('tickerSize', function(tickerSize) {
          scope.ticks = [];
          for (var i = 0; i < tickerSize; ++i) {
            scope.ticks.push(i);
          }
        });
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
