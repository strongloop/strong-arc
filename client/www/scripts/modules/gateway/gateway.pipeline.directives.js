/*
 *
 * PIPELINE DIRECTIVES
 *
 *
 * */
Gateway.directive('slPipelineMainView', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/pipeline.main.html',
      link: function(scope, el, attrs) {

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
        hidebuttons: '='
      },
      controller: function($scope, GatewayServices) {
        $scope.availablePolicies = [];
        $scope.showAddPolicyMenu = false;

        getPolicies();

        $scope.addNewPolicyToPipeline = function(policy, toggler){
          $scope.pipeline.policies = $scope.pipeline.policies || [];
          $scope.pipeline.policies.push(policy);
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
      templateUrl: './scripts/modules/gateway/templates/pipeline.list.html'
    }
  }
]);
