/**
 * GATEWAY GLOBAL DIRECTIVES
 */
Gateway.directive('slGatewayMainNav', [
  'GatewayServices',
  '$rootScope',
  '$http',
  '$log',
  function(GatewayServices, $rootScope, $http, $log) {
    return {
      replace: true,
      link: function(scope,  el, attrs) {

        scope.svgIcons = [];

        $http({
          method: 'GET',
          url: './scripts/modules/ui/templates/ui.icons.svg.html'
        })
        .success(function(data) {
            scope.svgIcons = data;
          })
        .error(function(error) {
            $log.warn('bad get icon svg files: ' + JSON.stringify(error));
          });

        scope.$watch('gatewayMapCtx.gatewayMaps', function(newVal, oldVal) {
          if (newVal && newVal.map) {

              React.renderComponent(GatewayMainNav({scope:scope, rootScope:$rootScope}), el[0]);

          }
        }, true);
        scope.$watch('pipelineCtx.pipelines', function(newVal, oldVal) {
          if (newVal && newVal.map) {
              React.renderComponent(GatewayMainNav({scope:scope, rootScope:$rootScope}), el[0]);

          }
        }, true);

        scope.$watch('policyCtx.policies', function(newVal, oldVal) {
          if (newVal && newVal.map) {
              React.renderComponent(GatewayMainNav({scope:scope, rootScope:$rootScope}), el[0]);

          }
        }, true);


      }
    }
  }
]);
