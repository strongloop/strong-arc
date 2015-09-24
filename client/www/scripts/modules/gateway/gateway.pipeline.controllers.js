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
  function($scope, $log, GatewayServices, $timeout, $modal) {
    function resetCurrentPipeline() {
      $scope.pipelineCtx.currentPipeline = {};
    }
    function refreshPipelines() {
      $scope.pipelineCtx.pipelines = GatewayServices.getPipelines()
        .then(function(lbs) {
          $scope.pipelineCtx.pipelines = lbs;
          setScrollView();
        });
    }
    $scope.showPolicyDetails = function(policy) {

    };

    //$scope.showAddNewPipelineForm = function() {
    //  $scope.pipelineCtx.isShowNewPipelineForm = true;
    //};

    //
    //$scope.contextModal = {
    //  templateUrl: './scripts/modules/gateway/templates/add.pipeline.policy.html',
    //  position: 'bottom',
    //  name: 'testValue',
    //  value: 100
    //};
    //$scope.policyDetailModal = {
    //  templateUrl: './scripts/modules/gateway/templates/pipeline.policy.detail.html',
    //  position: 'bottom',
    //  name: 'pipelinePolicyDetail',
    //  value: 100
    //};

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

    function setScrollView(){
      $timeout(function(){
        window.setScrollView('.sidebar-layout-main-container');
        window.setScrollView('[data-id="GatewayMainContainer"]');
      }, 0);
    }
    //
    //$scope.addPipelinePolicy = function() {
    //  //var newPolicy = {
    //  //  name:$scope.pipelineCtx.newPolicyName,
    //  //  type:type
    //  //};
    //  if ($scope.pipelineCtx.newPolicy) {
    //    if (!$scope.pipelineCtx.currentPipeline.policies) {
    //      $scope.pipelineCtx.currentPipeline.policies = [];
    //    }
    //    $scope.pipelineCtx.currentPipeline.policies.push($scope.pipelineCtx.newPolicy);
    //    GatewayServices.savePipeline($scope.pipelineCtx.currentPipeline)
    //      .$promise
    //      .then(function(pipeline) {
    //        $scope.pipelineCtx.newPolicy = {};
    //        refreshPipelines();
    //      });
    //  }
    //
    //};

    //$scope.pipelineCtx.init = function() {
    //  $scope.pipelineCtx.currentPipeline = {};
    //  $scope.pipelineCtx.pipelines = GatewayServices.getPipelines()
    //    .then(function(hosts) {
    //      $scope.pipelineCtx.pipelines = hosts;
    //    });
    //};
    //$scope.pipelineCtx.pipelines = GatewayServices.getPipelines()
    //  .then(function(hosts) {
    //    $scope.pipelineCtx.pipelines = hosts;
    //  });
    $scope.confirmDeletePipeline = function(pipeline) {
      var modalDlg = $modal.open({
        templateUrl: './scripts/modules/gateway/templates/confirm.pipeline.delete.html',
        size: 'md',
        scope: $scope,
        controller: function($scope, $modalInstance, title) {
          $scope.isModal = true;
          $scope.title = title;
          $scope.pipeline = pipeline;
          $scope.close = function() {
            $modalInstance.dismiss();
          };

          $scope._deletePipeline = function(pipeline){
            $scope.deletePipeline(pipeline);
            $scope.close();
          }
        },
        resolve: {
          title: function() {
            return 'Confirm Delete Pipeline';
          }
        }
      });
    };

    $scope.deletePipeline = function(pipeline){
      GatewayServices.deletePipeline(pipeline.id)
        .then(function(response) {
          $scope.refreshPipelines();
        });
    };

    $scope.editPipeline = function(pipeline) {
      $scope.gatewayCtx.currentView = GATEWAY_CONST.PIPELINE_TYPE;
      $scope.gatewayCtx.currentInstanceId = pipeline.id;
      $scope.pipelineCtx.currentPipeline = pipeline;
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


        GatewayServices.savePipeline($scope.pipelineCtx.currentPipeline)
          .$promise
          .then(function(response) {
            $scope.pipelineCtx.currentPipeline = {};
            resetCurrentPipeline();
            refreshPipelines();
          });
      }
      else {
        $log.debug('invalid Pipeline attempt save');
      }
    };


    $scope.showEditPipelineForm = function(pipeline) {
      var modalDlg = $modal.open({
        templateUrl: './scripts/modules/gateway/templates/add.pipeline.modal.html',
        size: 'lg',
        scope: $scope,
        controller: function($scope, $modalInstance, title) {
          $scope.pipelineCtx.currentPipeline = pipeline;
          $scope.title = title;
          $scope.close = function() {
            $modalInstance.dismiss();
          };

          /**
           * save new pipeline
           * @param pipeline
           */
          $scope.saveNewPipeline = function(pipeline){
            GatewayServices.savePipeline(pipeline)
              .$promise
              .then(function(data) {
                $scope.pipelineCtx.newPipeline = {};
                refreshPipelines();
              });

            /**
             * refresh the user's pipelines list in nav
             */
            function refreshPipelines() {
              $scope.pipelineCtx.pipelines = GatewayServices.getPipelines()
                .then(function(data) {
                  $scope.pipelineCtx.pipelines = data;
                });
            }
          };
        },
        resolve: {
          title: function() {
            return 'Example Modal Dialog';
          }
        }
      });
    };
  }
]);
