
Gateway.controller('GatewayMapMainController', [
  '$scope',
  '$log',
  'GatewayServices',
  function($scope, $log, GatewayServices) {
    $log.debug('GatewayMap Controller');

    $scope.gatewayMapCtx.init = function() {




    };
    $scope.mapPipelineDetailModal = {
      templateUrl: './scripts/modules/gateway/templates/map.pipeline.detail.html',
      position: 'bottom',
      name: 'mapPipelineDetailModal',
      value: 100
    };

    $scope.toggleShowPipelineDetails = function(gatewayMap) {
      gatewayMap.showPipelineDetails = !gatewayMap.showPipelineDetails
    };
    // nav branch clicked
    $scope.navTreeBranchClicked = function(type) {
      $log.debug('tree branch clicked');
      // $scope.clearSelectedInstances();
    };
    // nav tree item clicked
    $scope.navTreeItemClicked = function(type, targetId, multiSelect) {
      $log.debug('tree item clicked');
      // $scope.openSelectedInstance(targetId, type);
    };

    $scope.clearGatewayMapForm = function() {
      //resetCurrentGatewayMap();
      $scope.gatewayMapCtx.isShowNewGatewayMapForm = false;
    };


    $scope.deleteGatewayMap = function(gatewayMap) {
      if (confirm('delete Gateway Map?')) {
        GatewayServices.deleteGatewayMap(gatewayMap.id)
          .then(function(response) {
            $scope.refreshMappings();
          });
      }
    };

    $scope.editGatewayMap = function(map) {
      $scope.gatewayMapCtx.currentGatewayMap = map;
      $scope.gatewayCtx.currentView = GATEWAY_CONST.MAPPING_TYPE;
      $scope.gatewayCtx.currentInstanceId = map.id;

    };





    $scope.gatewayMapCtx.init();
  }
]);
