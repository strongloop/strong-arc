/*
 *
 * PIPELINE DIRECTIVES
 *
 *
 * */
Gateway.directive('slPipelineMainView', [
  '$log',
  'GatewayServices',
  function($log, GatewayServices) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/pipeline.main.html',
      link: function(scope, el, attrs) {
        var pipelineId = scope.pipelineCtx.currentInstanceId;
        $log.log(pipelineId);

        if (pipelineId && scope.gatewayCtx.isShowPipelineView) {
          GatewayServices.getPipelineById(pipelineId)
            .then(function(data){
              //add rendered policies
              data.renderPolicies = [];
              data.policyIds.map(function(policyId){
                var policy = scope.getPipelineRenderPolicy(policyId);
                data.renderPolicies.push(policy);
              });

              scope.pipelineCtx.currentPipeline = data;
            });
        }
      }
    }
  }
]);
Gateway.directive('slPipelineForm', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/pipeline.form.html',
      scope: {
        pipeline: '=',
        context: '=',
        hidebuttons: '=',
        isModal: '='
      },
      controller: function($scope, GatewayServices) {
        $scope.availablePolicies = [];
        $scope.showAddPolicyMenu = false;

        getPolicies();

        function getPipelineRenderPolicy(policyId) {
          return _.findWhere($scope.context.policies, { id: policyId });
        }

        $scope.addNewPolicyToPipeline = function(policy, toggler){
          $scope.pipeline.policyIds = $scope.pipeline.policyIds || [];
          $scope.pipeline.policyIds.push(policy.id);
          $scope.pipeline.renderPolicies = $scope.pipeline.policyIds.map(function(policyId){
            return getPipelineRenderPolicy(policyId);
          });

          $scope.showAddPolicyMenu = false;
        };


        $scope.toggleShowAddPolicyMenu = function(){
          $scope.showAddPolicyMenu = !$scope.showAddPolicyMenu;
        };

        $scope.deletePolicy = function(policy){
          var idx = $scope.pipeline.policyIds.indexOf(policy.id);
          var renderIdx = _.findWhere($scope.pipeline.renderPolicies, { id: policy.id });

          $scope.pipeline.policyIds.splice(idx, 1);
          $scope.pipeline.renderPolicies.splice(renderIdx, 1);
        };

        $scope.savePipeline = function(pipeline){
          GatewayServices.savePipeline($scope.pipeline)
            .$promise
            .then(function(data) {
              $scope.pipeline = {};
              //refreshPipelines();
            });
        };

        //helper functions
        function getPolicies(){
          GatewayServices.getPolicies()
            .then(function(data){
              $scope.availablePolicies = data;
            });
        }
      }
    }
  }
]);
Gateway.directive('slPipelineList', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/pipeline.list.html',
      controller: function($scope, $timeout, $log, slPopoverService){
        $scope.policyDetails = {};
        $scope.policyDetails.templateUrl = './scripts/modules/gateway/templates/pipeline.policy.detail.html';
        $scope.policyDetails.placement = 'bottom';

        $scope.setupHidePopover = function($event){
          slPopoverService.setupScrollingPopover($scope, $event);
        };
      }
    }
  }
]);
