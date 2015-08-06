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
      link: function(scope, el, attrs) {

        scope.$watch('menu', function(newMenu, oldVal) {
          if (newMenu && newMenu.type === scope.context.currentView) {
            if (newMenu.items && newMenu.items.map) {
              // check if any children are active
              newMenu.items.map(function(item) {
                if (item.id === scope.context.currentInstanceId) {
                  // bingo its active
                  item.isActive = true;
                }
                else {
                  item.isActive = false;
                }
              });

            }
          }
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
