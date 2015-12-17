Metrics.directive('slMetricsVisualTicker', [
  function() {
    return {
      replace: true,
      template: ('<ul class="metric-timer-list">' +
        '<li ng-repeat="tick in ticks">' +
        '<i class="{{getTickClass(tick)}}"></i>' +
        '</li>' +
        '</ul>'),
      link: function(scope, el, attrs) {
        var tickCount = 16;
        scope.ticks = [];

        for (var i = 0; i < tickCount; ++i) {
          scope.ticks.push(i);
        }

        scope.getTickClass = function(tickVal) {
          return 'refresh-icon ' +
            (tickVal < scope.sysTime.ticker ? 'on' : 'off');
        };
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
