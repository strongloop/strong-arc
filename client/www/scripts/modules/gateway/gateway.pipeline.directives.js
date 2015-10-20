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
              scope.pipelineCtx.currentPipeline = data;
            });
        }
      }
    }
  }
]);
Gateway.directive('slPipelineForm', ['$modal',
  function($modal) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/pipeline.form.html',
      scope: {
        pipeline: '=',
        context: '=',
        hidebuttons: '=',
        isModal: '='
      },
      controller: [
        '$scope',
        'GatewayServices',
        function($scope, GatewayServices) {
          $scope.availablePolicies = [];
          $scope.showAddPolicyMenu = false;
          $scope.isPipelineDirty = false;
          $scope.isPipelineNameDirty = false;
          $scope.GATEWAY_CONST = GATEWAY_CONST;

          function getPipelineRenderPolicy(policyId) {
            return _.findWhere($scope.context.policies, { id: policyId });
          }

          $scope.addNewPolicyToPipeline = function(policy, toggler){
            $scope.pipeline.policyIds = $scope.pipeline.policyIds || [];
            $scope.pipeline.policyIds.push(policy.id);
            if (!$scope.pipeline.policies) {
              $scope.pipeline.policies = [];
            }
            $scope.pipeline.policies.push(policy);
            $scope.showAddPolicyMenu = false;
          };


          $scope.toggleShowAddPolicyMenu = function(){
            $scope.showAddPolicyMenu = !$scope.showAddPolicyMenu;
          };

          $scope.deletePolicy = function(policy){
            var idx = $scope.pipeline.policyIds.indexOf(policy.id);
            var renderIdx = _.findWhere($scope.pipeline.policies, { id: policy.id });

            $scope.pipeline.policyIds.splice(idx, 1);
            $scope.pipeline.policies.splice(renderIdx, 1);
          };

          $scope.confirmSavePipeline = function(pipeline){
            var modalDlg = $modal.open({
              templateUrl: './scripts/modules/gateway/templates/confirm.pipeline.save.html',
              size: 'md',
              scope: $scope,
              controller: function($scope, $modalInstance, title) {
                $scope.isModal = true;
                $scope.title = title;
                $scope.close = function() {
                  $modalInstance.dismiss();
                };

                $scope._savePipeline = function(pipeline){
                  $scope.saveCurrentPipeline(pipeline);
                  $scope.close();
                }
              },
              resolve: {
                title: function() {
                  return 'Confirm Pipeline Edit';
                }
              }
            });
          };

          $scope.saveCurrentPipeline = function(pipeline){
            //handle rename
            if ($scope.context.originalInstance.name && ($scope.context.originalInstance.name !== pipeline.name)) {
              GatewayServices.renamePipeline(pipeline, pipeline.name, pipeline.oldName)
                .$promise
                .then(function(policy) {
                  GatewayServices.savePipeline(pipeline)
                    .$promise
                    .then(function(data) {
                      $scope.pipeline = data;
                      $scope.$parent.refreshPipelines();
                    });
                });
            }
            else {
              //save new pipeline
              GatewayServices.savePipeline(pipeline)
                .$promise
                .then(function(data) {
                  $scope.pipeline = data;
                  $scope.$parent.refreshPipelines();
                });

            }
          };


          $scope.clearPipelineForm = function() {
            GatewayServices.getPipelineById($scope.pipeline.id)
              .then(function(data){
                $scope.pipeline = data;
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
      ],
      link: function(scope, el, attrs) {
        /*
         *
         * Dirty check
         *
         * */
        scope.$watch('pipeline', function(newVal, oldVal) {
          scope.isPipelineDirty = false;
          scope.isRename = false;
          if (newVal.id && oldVal.id) {

            if (newVal !== oldVal) {
              if (!angular.equals(scope.context.originalInstance, newVal)) {
                scope.isPipelineDirty = true;

              }
            }
            if (newVal.name !== scope.context.originalInstance.name) {
              newVal.oldName = scope.context.originalInstance.name;
              scope.isPipelineNameDirty = true;
            }
          }

        }, true);
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
