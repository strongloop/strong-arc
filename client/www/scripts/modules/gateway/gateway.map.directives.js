/*
 *
 *
 *   GATEWAY MAP DIRECTIVES
 *
 * */
Gateway.directive('slGatewayMapForm', [
  'GatewayServices',
  '$log',
  'growl',
  '$state',
  function(GatewayServices,$log,growl,$state) {
    return {
      restrict: 'E',
      scope: {
        map: '=',
        context: '=',
        hidebuttons: '='
      },
      templateUrl: './scripts/modules/gateway/templates/gateway.map.form.html',
      controller: ['$scope',
        function($scope) {

          $scope.isMapDirty = false;
          $scope.originalMap = {};

          $scope.setMapPipelineId = function(map, pipeId) {
            if (map && pipeId) {
              map.pipelineId = pipeId;
            }
          };

          $scope.$watch('map.pipelineId', function(newVal, oldVal) {
            $log.debug('the pipeline id has changed');
          });

          function refreshMaps() {
            $scope.context.gatewayMaps = GatewayServices.getGatewayMaps()
              .then(function(maps) {

                $scope.context.gatewayMaps = maps;

              });
          }

          $scope.init = function() {
            var xps = $scope.context.currentPipelines;
            $scope.originalMap = angular.copy($scope.map);
          };
          $scope.init();

          $scope.saveCurrentGatewayMap = function(map) {
            if (map.name && map.endpoint) {
              if (map.pipelineId && map.pipelineId.id) {
                map.pipelineId = map.pipelineId.id;
              }

              if ($scope.isMapDirty) {
                if (confirm('do you want to make this change')) {
                  GatewayServices.saveGatewayMap(map)
                    .$promise
                    .then(function(map) {
                      growl.addSuccessMessage('Gateway Map Saved');
                      //resetCurrentPolicy();

                    });
                }
              }
              else {
                GatewayServices.saveGatewayMap(map)
                  .$promise
                  .then(function(map) {
                    growl.addSuccessMessage('Gateway Map Saved');
                    //resetCurrentPolicy();

                  });
              }
            }
          };
        }
      ]
    }
  }
]);
Gateway.directive('slGatewayMapListScopeDisplay', [
  function() {
    return {
      restrict: 'E',
      scope: {
        scopes: '='
      },
      templateUrl: './scripts/modules/gateway/templates/gateway.map.list.scopes.html',
      controller: [
        '$scope',
        'GatewayServices',
        function($scope, GatewayServices) {



        }
      ]
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
        'GatewayServices',
        function($scope, GatewayServices) {



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
