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
          var idx = _.findIndex($scope.pipeline.policies, { id: policy.id });

          $scope.pipeline.policies.splice(idx, 1);
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
        $scope.policyDetails.templateUrl = './scripts/modules/gateway/templates/policy.details.html';
        $scope.policyDetails.placement = 'bottom';

        $scope.setupHidePopover = function($event){
          slPopoverService.setupPopover($scope, $event);
        };

        //setup handler to hide when viewport is scrolled
        //$scope.setupHidePopover = function($event) {
        //  var $trigger = angular.element($event.target).closest('a');
        //  var $viewport = angular.element($event.target).closest('.viewport');
        //
        //  $timeout(function(){
        //    $trigger.trigger('show');
        //  });
        //
        //  //close previous popover if open
        //  if ( $('.popover').hasClass('in') ){
        //    $timeout(function() {
        //      $scope.hideCurrentPopover();
        //    });
        //  }
        //
        //  $scope.hideCurrentPopover = function(){
        //    //look for any open popover on page
        //    var hasOpenPopover = !!$('.popover').siblings('a').not($trigger).length;
        //
        //    if ( hasOpenPopover ) {
        //      //hide previously opened popover(s)
        //      $('.popover').siblings('a').not($trigger).trigger('hide');
        //    } else {
        //      //hide the current popover
        //      $trigger.trigger('hide');
        //    }
        //  };
        //
        //  //hide on viewport scroll
        //  $viewport.on('scroll', function(e){
        //    $scope.hideCurrentPopover();
        //  });
        //
        //  $scope.onClickHidePopover = function(e){
        //    $timeout(function(){
        //      $scope.hideCurrentPopover();
        //    });
        //  };
        //};
      }
    }
  }
]);
