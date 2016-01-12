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
        $scope.currentMenu = {};
      }],
      link: function(scope, el, attrs) {

        scope.$watch('menu', function(newMenu, oldVal) {
          scope.currentMenu = newMenu;
        });
        scope.$watch('context.currentInstanceId', function(newInstanceId, oldInstanceId) {
          if (scope.currentMenu && scope.currentMenu.items) {
            scope.currentMenu.items.map(function(item) {
              if (item.id === scope.context.currentInstanceId) {
                // bingo its active
                item.isActive = true;
              }
              else {
                item.isActive = false;
              }
            });
          }
        });

      }
    }
  }
]);
