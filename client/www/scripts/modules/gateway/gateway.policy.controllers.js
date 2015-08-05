/*
 *
 *   POLICY
 *
 * */
Gateway.controller('PolicyMainController', [
  '$scope',
  '$log',
  'GatewayServices',
  '$timeout',
  '$state',
  'growl',
  function($scope, $log, GatewayServices, $timeout, $state, growl) {
    $log.debug('Policy Controller');

    $scope.policyCtx.isShowAuthPolicyForm = false;
    $scope.policyCtx.isShowRateLimitPolicyForm = false;
    $scope.policyCtx.isShowProxyPolicyForm = false;
    $scope.isShowAddPolicyRow = false;
    $scope.showAddPolicyRow = function() {
      turnOffOtherPolicyEdits();
      $scope.isShowAddPolicyRow = true;
    };
    $scope.clearAddPolicyRow = function() {
      $scope.isShowAddPolicyRow = false;
      $scope.policyCtx.currentPolicy = {};
    };
    $scope.isPolicyEditMode = function(policy) {

    };
    $scope.policyCtx.init = function() {

      $scope.policyCtx.policies = GatewayServices.getPolicies()
        .then(function(policies) {
          $scope.policyCtx.policies = policies;
        });

    };
    function resetCurrentPolicy() {
      $scope.policyCtx.currentPolicy = {};
    }
    function refreshPolicies() {
      $scope.policyCtx.policies = GatewayServices.getPolicies()
        .then(function(policies) {

            $scope.policyCtx.policies = policies;

        });
    }


    $scope.deletePolicy = function(policy) {
      if (confirm('delete Policy?')) {
        GatewayServices.deletePolicy(policy.id)
          .then(function(response) {
            refreshPolicies();
          });
      }
    };



    function inflateProperties(policy) {

      if (policy.data) {
        policy.data.map(function(datum) {
          policy[datum.name] = datum.value;
        });
      }
      return policy;
    }

    $scope.editPolicy = function(policy) {
      policy = inflateProperties(policy);
      $scope.policyCtx.currentPolicy = policy;
      $scope.gatewayCtx.currentView = 'policy';
      $scope.gatewayCtx.currentInstanceId = policy.id;

    };
    $scope.cancelEditPolicy = function(policy) {
      $scope.policyCtx.currentPolicy = {};
      policy.editMode = false;
    };



    $scope.isCurrentPolicyType = function(type) {

      if ($scope.policyCtx.currentPolicy.type && ($scope.policyCtx.currentPolicy.type.id === type)) {
        return true;
      }
      return false;
    };
    function scrubNonTypeData(policy) {
      switch (policy.type) {
        case 'auth':
          //erase proxy and ratelimit data

          break;
        case 'ratelimiting':

          break;
        case 'reverseproxy' :

          break;

        default:
      }
      return policy;
    }

    /*
     *
     * Save New (isolated form)
     *
     * */
    $scope.savePolicy = function(policy) {
      //if (policy) {
      //  $scope.policyCtx.currentPolicy = policy;
      //}
      if (policy.type) {

        policy = scrubNonTypeData(policy);

        if (!policy.name) {
          policy = policy.type + '-' + Math.floor((Math.random() * 10000) + 1);
        }

        policy = GatewayServices.savePolicy(policy)
          .$promise
          .then(function(response) {
            resetCurrentPolicy();
            refreshPolicies();
            turnOffOtherPolicyEdits();
          });

      }
      else {
        $log.debug('invalid Policy attempt save');
      }
    };


  }
]);
