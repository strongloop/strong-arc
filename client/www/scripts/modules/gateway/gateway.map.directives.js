/*
 *
 *
 *   GATEWAY MAP DIRECTIVES
 *
 * */
Gateway.directive('slGatewayMapForm', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/gateway.map.form.html'
    }
  }
]);
Gateway.directive('slGatewayMapList', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/gateway.map.list.html',
      controller: [
        '$scope',
        function($scope) {
          $scope.saveGatewayMap = function(gatewayMap) {
            $scope.gatewayMapCtx.currentGatewayMap = gatewayMap;
            $scope.saveCurrentGatewayMap();
          }
        }
      ]
    }
  }
]);
Gateway.directive('slGatewayMapMainView', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/gateway.map.main.html',
      link: function(scope, el, attrs) {

      }
    }
  }
]);
