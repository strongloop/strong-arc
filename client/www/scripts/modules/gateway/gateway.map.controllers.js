
Gateway.controller('GatewayMapMainController', [
  '$scope',
  '$log',
  'GatewayServices',
  function($scope, $log, GatewayServices) {
    $log.debug('GatewayMap Controller');
    function getPipelineRenderPolicy(policyId) {
      for (var i = 0;i  < $scope.policyCtx.policies.length;i++) {
        var item = $scope.policyCtx.policies[i];
        if (item.id === policyId) {
          return item;
          break;
        }
      }
    }
    function inflatePipelinePolicies(pipeline) {
      pipeline.policies = [];
      pipeline.policyIds.map(function(policyId) {
        var inflatedPolicy = getPipelineRenderPolicy(policyId);
        pipeline.policies.push(inflatedPolicy);
      });
      return pipeline;
    }


    function getPipelineDetail(argId) {
      for (var i = 0;i < $scope.gatewayMapCtx.currentPipelines.length;i++) {
        var cPipeline = $scope.gatewayMapCtx.currentPipelines[i];
        if (cPipeline.id === argId) {
          var retVal = inflatePipelinePolicies(cPipeline);
          return retVal;
        }
      }
    }
    //$scope.$watch('gatewayMapCtx.currentGatewayMap', function(newVal) {
    //  if (newVal && newVal.pipelineId) {
    //    $scope.gatewayMapCtx.currentGatewayMap.pipeline = getPipelineDetail(newVal.pipelineId);
    //  }
    //}, true);
    $scope.gatewayMapCtx.init = function() {


      $scope.policyCtx.policies = GatewayServices.getPolicies()
        .then(function(policies) {
          $scope.policyCtx.policies = policies;
          GatewayServices.getPipelines()
            .then(function(pipelines) {
              //$scope.pipelineCtx.pipelines = pipelines;
              $scope.gatewayMapCtx.gatewayMaps = GatewayServices.getGatewayMaps()
                .then(function(maps) {
                  $log.debug('|  refresh maps: ' + maps.length);
                  maps.map(function(map) {
                    var detail = getPipelineDetail(map.pipelineId);
                    if (detail && detail.policies) {
                      detail.policies.map(function(policy) {
                        if (policy && (policy.type === 'reverseproxy') && policy.targetURL) {
                          map.targetURL = policy.targetURL;
                        }
                        if (policy && (policy.type === 'auth') && policy.scopes) {
                          map.scopes = policy.scopes || [];
                        }

                      });
                    }
                    map.pipeline = detail;
                  });
                  $scope.gatewayMapCtx.gatewayMaps = maps;


                  $scope.latestPolicies = GatewayServices.getPolicies()
                    .then(function(policies) {
                      $scope.latestPolicies = policies;
                    });






                });

            });
        });

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
      resetCurrentGatewayMap();
      $scope.gatewayMapCtx.isShowNewGatewayMapForm = false;
    };

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




    $scope.gatewayMapCtx.init();
  }
]);
