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
    function turnOffOtherPolicyEdits() {
      if ($scope.policyCtx.policies.map) {
        $scope.policyCtx.policies.map(function(policy) {
          policy.editMode = false;
        });
        resetCurrentPolicy();

      }
    }
    $scope.editPolicy = function(policy) {
      turnOffOtherPolicyEdits();
      policy = inflateProperties(policy);
      $scope.policyCtx.currentPolicy = policy;
      policy.editMode = true;
    };
    $scope.cancelEditPolicy = function(policy) {
      $scope.policyCtx.currentPolicy = {};
      policy.editMode = false;
    };


    $scope.saveCurrentPolicy = function() {
      if ($scope.policyCtx.currentPolicy.name && $scope.policyCtx.currentPolicy.type) {
        $log.debug('update this policy: '  + $scope.policyCtx.currentPolicy.name);



        GatewayServices.savePolicy($scope.policyCtx.currentPolicy)
          .$promise
          .then(function(policy) {
            growl.addSuccessMessage('Policy Saved');
            resetCurrentPolicy();

          });

      }
    };
    $scope.saveNewPolicy = function() {
      $scope.close();
      if ($scope.policyCtx.newPolicy.name && $scope.policyCtx.newPolicy.type) {

        GatewayServices.savePolicy($scope.policyCtx.newPolicy)
          .$promise
          .then(function(policy) {
              $state.go('policy');
            resetCurrentPolicy();
          });

      }
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
          policy.data = [{
            name:'provider',
            value:policy.provider
          }];
          if (policy.scopes && policy.scopes.map) {
            for (var i = 0;i < policy.scopes.length;i++) {
              policy.data.push({
                name: 'scope: ' + (i + 1).toString(),
                value: policy.scopes[i].name
              });
            }
          }
          break;
        case 'ratelimit':
          policy.data = [
            {
              name: 'limit',
              value:policy.limit
            },
            {
              name: 'interval',
              value: policy.interval
            }
          ];
          break;
        case 'proxy' :
          policy.data = [{
            name:'endpoint',
            value:policy.endpoint
          }];
          break;

        default:
      }
      delete policy.provider;
      delete policy.limit;
      delete policy.interval;
      delete policy.endpoint;
      return policy;
    }

    /*
     *
     * Save New (isolated form)
     *
     * */
    $scope.savePolicy = function(policy) {
      if (policy) {
        $scope.policyCtx.currentPolicy = policy;
      }
      if ($scope.policyCtx.currentPolicy.type) {

        $scope.policyCtx.currentPolicy = scrubNonTypeData($scope.policyCtx.currentPolicy);

        if (!$scope.policyCtx.currentPolicy.name) {
          $scope.policyCtx.currentPolicy.name = $scope.policyCtx.currentPolicy.type + '-' + Math.floor((Math.random() * 10000) + 1);
        }
        $scope.policyCtx.currentPolicy.editMode = false;
        $scope.policyCtx.currentPolicy.currentPolicyScope = null;
        $scope.policyCtx.currentPolicy = GatewayServices.savePolicy($scope.policyCtx.currentPolicy)
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
