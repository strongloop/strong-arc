
Gateway.controller('GatewayMapMainController', [
  '$scope',
  '$log',
  'GatewayServices',
  function($scope, $log, GatewayServices) {
    $log.debug('GatewayMap Controller');

    $scope.gatewayMapCtx.init = function() {
      //$scope.gatewayMapCtx = {
      //  currentGatewayMap: {},
      //  gatewayMaps: [],
      //  currentPipelines: [],
      //  currentPolicyScopes: [],
      //  currentRawEndpoints: []
      //
      //};

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
    //$scope.showAddNewGatewayMapForm = function() {
    //  $scope.gatewayMapCtx.isShowNewGatewayMapForm = !$scope.gatewayMapCtx.isShowNewGatewayMapForm;
    //};
    $scope.clearGatewayMapForm = function() {
      resetCurrentGatewayMap();
      $scope.gatewayMapCtx.isShowNewGatewayMapForm = false;
    };
    //$scope.showAddPipelinePolicy = function() {
    //  $log.debug('show pipeline policy component');
    //};
    function resetCurrentGatewayMap() {
      $scope.gatewayMapCtx.currentGatewayMap = {};
    }
    function refreshGatewayMaps() {
      $scope.gatewayMapCtx.gatewayMaps = GatewayServices.getGatewayMaps()
        .then(function(maps) {
          $scope.gatewayMapCtx.gatewayMaps = maps;
        });
    }

    $scope.deleteGatewayMap = function(gatewayMap) {
      if (confirm('delete Gateway Map?')) {
        GatewayServices.deleteGatewayMap(gatewayMap.id)
          .then(function(response) {
            refreshGatewayMaps();
          });
      }
    };


    $scope.editGatewayMap = function(gatewayMap) {
      gatewayMap.editMode = true;
    };
    $scope.cancelEditGatewayMap = function(gatewayMap) {
      gatewayMap.editMode = false;
    };
    $scope.saveCurrentGatewayMap = function() {
      if ($scope.gatewayMapCtx.currentGatewayMap.name && $scope.gatewayMapCtx.currentGatewayMap.endpoint) {
        $scope.gatewayMapCtx.currentGatewayMap.showPipelineDetails = false;
        $scope.gatewayMapCtx.currentGatewayMap = GatewayServices.saveGatewayMap($scope.gatewayMapCtx.currentGatewayMap)
          .$promise
          .then(function(response) {
            $scope.gatewayMapCtx.currentGatewayMap = {};
            resetCurrentGatewayMap();
            refreshGatewayMaps();
          });
      }
      else {
        $log.debug('invalid GatewayMap attempt save');
      }
    };



  }
]);
