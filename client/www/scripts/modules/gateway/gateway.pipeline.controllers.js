/*
 *
 *   PIPELINE
 *
 * */
Gateway.controller('PipelineMainController', [
  '$scope',
  '$log',
  'GatewayServices',
  '$timeout',
  '$modal',
  function($scope, $log, GatewayServices, $timeout) {
    $log.debug('Pipeline Controller');

    //$scope.isShowMapPipelineInput = false;
    function resetCurrentPipeline() {
      $scope.pipelineCtx.currentPipeline = {};
    }
    function refreshPipelines() {
      $scope.pipelineCtx.pipelines = GatewayServices.getPipelines()
        .then(function(lbs) {
          $scope.pipelineCtx.pipelines = lbs;
        });
    }
    $scope.showPolicyDetails = function(policy) {

    };
    //$scope.showAddNewPipelineForm = function() {
    //  $scope.pipelineCtx.isShowNewPipelineForm = true;
    //};
    $scope.clearPipelineForm = function() {
      resetCurrentPipeline();
      $scope.pipelineCtx.isShowNewPipelineForm = false;
    };

    $scope.contextModal = {
      templateUrl: './scripts/modules/gateway/templates/add.pipeline.policy.html',
      position: 'bottom',
      name: 'testValue',
      value: 100
    };
    $scope.policyDetailModal = {
      templateUrl: './scripts/modules/gateway/templates/pipeline.policy.detail.html',
      position: 'bottom',
      name: 'pipelinePolicyDetail',
      value: 100
    };
    $scope.items = [{
      name: 'item 1'
    }, {
      name: 'item 2'
    }, {
      name: 'item 3'
    }, {
      name: 'item 4'
    }, {
      name: 'item 5'
    }, {
      name: 'item 6'
    }, {
      name: 'item 7'
    }, {
      name: 'item 8'
    }]

    $scope.sortableOptions = {
      containment: '#sortable-container'
    };
    $scope.dragControlListeners = {
      accept: function (sourceItemHandleScope, destSortableScope) {return true},//override to determine drag is allowed or not. default is true.
      itemMoved: function (event) {},//Do what you want
      orderChanged: function(event) {},//Do what you want
    };
    $scope.setupHidePopover = function($event, pipeline) {
      var element = angular.element($event.target);
      $scope.pipelineCtx.currentPipeline = pipeline;
      $scope.hidePopover = function() {
        $timeout(function() {
          element.triggerHandler('click');
        });
      };
    };

    $scope.removePipelinePolicy = function(pipeline, policy) {
      if (confirm('remove policy?')) {
        if (pipeline.policies && pipeline.policies.map) {
          for (var i = 0;i < pipeline.policies.length; i++) {
            if (pipeline.policies[i].id === policy.id) {
              pipeline.policies.splice(i, 1);
            }
          }
        }
        $scope.pipelineCtx.currentPipeline = pipeline;
        $scope.saveCurrentPipeline();

      }
    };
    $scope.addPipelinePolicy = function() {
      //var newPolicy = {
      //  name:$scope.pipelineCtx.newPolicyName,
      //  type:type
      //};
      if ($scope.pipelineCtx.newPolicy) {
        if (!$scope.pipelineCtx.currentPipeline.policies) {
          $scope.pipelineCtx.currentPipeline.policies = [];
        }
        $scope.pipelineCtx.currentPipeline.policies.push($scope.pipelineCtx.newPolicy);
        GatewayServices.savePipeline($scope.pipelineCtx.currentPipeline)
          .$promise
          .then(function(pipeline) {
            $scope.pipelineCtx.newPolicy = {};
            refreshPipelines();
          });
      }

    };

    $scope.pipelineCtx.init = function() {
      $scope.pipelineCtx.currentPipeline = {};
      $scope.pipelineCtx.pipelines = GatewayServices.getPipelines()
        .then(function(hosts) {
          $scope.pipelineCtx.pipelines = hosts;
        });
    };
    $scope.pipelineCtx.pipelines = GatewayServices.getPipelines()
      .then(function(hosts) {
        $scope.pipelineCtx.pipelines = hosts;
      });
    $scope.deletePipeline = function(pipeline) {
      if (confirm('delete Pipeline?')) {
        GatewayServices.deletePipeline(pipeline.id)
          .then(function(response) {
            refreshPipelines();
          });
      }
    };

    $scope.editPipeline = function(pipeline) {
      pipeline.editMode = true;
    };
    $scope.cancelEditPipeline = function(pipeline) {
      pipeline.editMode = false;
    };
    $scope.isProxyPipeline = function() {
      var retVal = true;

      if ($scope.pipelineCtx.currentPipeline.id) {
        if ($scope.pipelineCtx.policies) {
          retVal = false;
          $scope.pipelineCtx.policies.map(function(policy) {
            if (policy.id === 'proxy') {
              retVal = true;
              return retVal;
            }
          });
        }
        else {
          // there is a real pipeline but it has no policies
          retVal = false;
        }
      }

      return retVal;
    };
    $scope.saveCurrentPipeline = function() {

      if ($scope.pipelineCtx.currentPipeline.name) {
        if ($scope.pipelineCtx.isProxyPipeline && $scope.pipelineCtx.currentInternalEndpoint) {
          // add a new proxy policy to this pipeline
          var newPolicy = {
            type:'proxy',
            endpoint:$scope.pipelineCtx.currentInternalEndpoint,
            data:[{name:'endpoint',value:$scope.pipelineCtx.currentInternalEndpoint}]
          };
          $scope.pipelineCtx.currentPipeline.defaultEndpoint = newPolicy.endpoint;
          // create policy instance (save to db)
          newPolicy = GatewayServices.savePolicy(newPolicy)
            .$promise
            .then(function(response) {
              newPolicy = response;
              // need to take into account ordering
              if (!$scope.pipelineCtx.currentPipeline.policies) {
                $scope.pipelineCtx.currentPipeline.policies = [];
              }
              $scope.pipelineCtx.currentPipeline.policies.push(newPolicy);
              $scope.pipelineCtx.currentPipeline = GatewayServices.savePipeline($scope.pipelineCtx.currentPipeline)
                .$promise
                .then(function(response) {
                  $scope.pipelineCtx.currentPipeline = {};
                  resetCurrentPipeline();
                  refreshPipelines();
                });
            });
          // then add to pipeline
          // then create pipeline
          //$scope.pipelineCtx.currentPipeline
        }
        else {
          $scope.pipelineCtx.currentPipeline = GatewayServices.savePipeline($scope.pipelineCtx.currentPipeline)
            .$promise
            .then(function(response) {
              $scope.pipelineCtx.currentPipeline = {};
              resetCurrentPipeline();
              refreshPipelines();
            });
        }

      }
      else {
        $log.debug('invalid Pipeline attempt save');
      }
    };



  }
]);
