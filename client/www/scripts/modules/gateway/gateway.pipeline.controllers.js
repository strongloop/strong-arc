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


        $scope.pipelineCtx.currentPipeline = GatewayServices.savePipeline($scope.pipelineCtx.currentPipeline)
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



  }
]);
