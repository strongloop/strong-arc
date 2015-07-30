/**
 * GATEWAY GLOBAL DIRECTIVES
 */
Gateway.directive('slGatewayMainNav', [
  'GatewayServices',
  '$rootScope',
  '$timeout',
  '$log',
  function(GatewayServices, $rootScope, $timeout, $log) {
    return {
      replace: true,
      link: function(scope,  el, attrs) {

        scope.$watch('gatewayMapCtx.gatewayMaps', function(newVal, oldVal) {
          if (newVal && newVal.map) {

            $log.debug('scope.$apply 1: ' + scope.$apply);
              React.renderComponent(GatewayMainNav({scope:scope, rootScope:$rootScope}), el[0]);

          }
        }, true);
        scope.$watch('pipelineCtx.pipelines', function(newVal, oldVal) {
          if (newVal && newVal.map) {
            $log.debug('scope.$apply 2: ' + scope.$apply);

              React.renderComponent(GatewayMainNav({scope:scope, rootScope:$rootScope}), el[0]);

          }
        }, true);

        scope.$watch('policyCtx.policies', function(newVal, oldVal) {
          if (newVal && newVal.map) {
            $log.debug('scope.$apply 3: ' + scope.$apply);

              React.renderComponent(GatewayMainNav({scope:scope, rootScope:$rootScope}), el[0]);

          }
        }, true);


      }
    }
  }
]);
