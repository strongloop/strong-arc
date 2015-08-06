/**
 * GATEWAY GLOBAL DIRECTIVES
 */
Gateway.directive('slGatewayNav', [
  'GatewayServices',
  '$rootScope',
  '$http',
  '$log',
  function(GatewayServices, $rootScope, $http, $log) {
    return {
      replace: true,
      templateUrl: './scripts/modules/gateway/templates/gateway.nav.html'
    }
  }
]);
Gateway.directive('slGatewayNavMenu', [
  'GatewayServices',
  '$rootScope',
  '$http',
  '$log',
  function(GatewayServices, $rootScope, $http, $log) {
    return {
      replace: true,
      scope: {
        menu: '=',
        setNav: '&',
        showModal: '&',
        cloneMethod: '&',
        deleteMethod: '&',
        context: '='
      },
      templateUrl: './scripts/modules/gateway/templates/gateway.nav.menu.html',
      controller: [ '$scope', function($scope) {
        //$scope.setMainNav = function(view, id) {
        //  $log.debug('set main nav in directive controller');
        //}
      }],
      link: function(scope, el, attrs) {

        scope.$watch('gatewayCtx.currentView', function(newVal, oldVal) {
          $log.debug('View Change');
        });
        scope.$watch('gatewayCtx.currentInstanceId', function(newVal, oldVal) {
          $log.debug('View Change');
        });

      }
    }
  }
]);
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
