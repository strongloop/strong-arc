/*
 *
 * POLICY SCOPE
 *
 * */
Gateway.controller('PolicyScopeMainController', [
  '$scope',
  '$log',
  'GatewayServices',
  function($scope, $log, GatewayServices) {
    $log.debug('PolicyScope Controller');

    $scope.init = function() {

      //GatewayServices.getRawEndpointList()
      //  .then(function(endpoints) {
      //    $scope.policyScopeCtx.currentRawEndpoints = endpoints;
      //  });
      //GatewayServices.getPolicyScopes()
      //  .then(function(scopes) {
      //    $scope.policyScopeCtx.currentPolicyScopes = scopes;
      //  });
    }();
    function resetCurrentPolicyScope() {
      $scope.policyScopeCtx.currentPolicyScope = {};
    }
    function refreshPolicyScopes() {
      $scope.policyScopeCtx.policyScopes = GatewayServices.getPolicyScopes()
        .then(function(lbs) {
          $scope.policyScopeCtx.policyScopes = lbs;
        });
    }
    $scope.policyScopeCtx.policyScopes = GatewayServices.getPolicyScopes()
      .then(function(hosts) {
        $scope.policyScopeCtx.policyScopes = hosts;
      });


    $scope.editPolicyScope = function(policyScope) {
      policyScope.editMode = true;
    };
    $scope.cancelEditPolicyScope = function(policyScope) {
      policyScope.editMode = false;
    };
    function turnOffOtherPolicyScopeEdits() {
      if ($scope.policyCtx.policies.map) {
        $scope.policyCtx.policies.map(function(policy) {
          policy.editMode = false;
        });
        resetCurrentPolicyScope();

      }
    }
    $scope.policyScopeCtx.savePolicyScope = function(policyScope) {
      $scope.policyScopeCtx.currentPolicyScope = policyScope;
      $scope.saveCurrentPolicyScope();
    };
    $scope.saveCurrentPolicyScope = function() {
      if (!$scope.policyScopeCtx.currentPolicyScope) {
        $scope.policyScopeCtx.currentPolicyScope = {};
      }
      if ($scope.policyScopeCtx.currentPolicyScope.name) {
        $scope.policyScopeCtx.currentPolicyScope.editMode = false;
        $scope.policyScopeCtx.currentPolicyScope = GatewayServices.savePolicyScope($scope.policyScopeCtx.currentPolicyScope)
          .$promise
          .then(function(response) {
            $scope.policyScopeCtx.currentPolicyScope = {};
            resetCurrentPolicyScope();
            refreshPolicyScopes();
            turnOffOtherPolicyScopeEdits();
          });
      }
      else {
        $log.debug('invalid PolicyScope attempt save');
      }
    };



  }
]);
