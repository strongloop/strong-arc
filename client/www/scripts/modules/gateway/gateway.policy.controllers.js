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
  function($scope, $log, GatewayServices, $timeout, $state) {
    $log.debug('Policy Controller');

    $scope.policyCtx.currentPolicy = {};

    $scope.inputTags = [];

    $scope.inputTags.push({name: 'test tag'});

    $scope.addTag = function() {
      if ($scope.tagText.length === 0) {
        return;
      }
      $scope.inputTags.push({name: $scope.tagText});
      $scope.tagText = '';
    };
    $scope.deleteTag = function(key) {
      if (($scope.inputTags.length > 0) &&
        ($scope.tagText.length === 0) &&
        (key === undefined)) {
          $scope.inputTags.pop();

      }
      else if (key !== undefined) {
        $scope.inputTags.splice(key, 1);
      }
    };

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


    $scope.saveNewPolicy = function() {
      $scope.close();
      if ($scope.policyCtx.currentPolicy.name && $scope.policyCtx.currentPolicy.type) {
        $log.debug('save this new policy: '  + $scope.policyCtx.currentPolicy.name);

        // validate by type
        switch($scope.policyCtx.currentPolicy.type.id) {

          case 'auth':

            // do nothing (future check for provider)

            break;

          case 'proxy':
            // make sure there is an endpoint

            break;

          case 'ratelimit':

            // make sure there is a limit and an interval
            break;

          default:

        }

        GatewayServices.savePolicy($scope.policyCtx.currentPolicy)
          .$promise
          .then(function(policy) {
           // $timeout(function() {
              $state.go('policy');

            //},25);
          });

      }
    };
    $scope.$watch('policyCtx.currentPolicy.type', function(newVal, oldVal) {
      if (newVal) {
        $log.debug('it changed: ' + newVal);

        switch (newVal) {
          case 'ratelimit' :

              $scope.policyCtx.isShowAuthPolicyForm = false;
              $scope.policyCtx.isShowRateLimitPolicyForm = true;
              $scope.policyCtx.isShowProxyPolicyForm = false;

            break;

          case 'auth' :

              $scope.policyCtx.isShowAuthPolicyForm = true;
              $scope.policyCtx.isShowRateLimitPolicyForm = false;
              $scope.policyCtx.isShowProxyPolicyForm = false;


            break;

          case 'proxy' :


            $scope.policyCtx.isShowAuthPolicyForm = false;
            $scope.policyCtx.isShowRateLimitPolicyForm = false;
            $scope.policyCtx.isShowProxyPolicyForm = true;


            break;

          default :
            $scope.policyCtx.isShowAuthPolicyForm = false;
            $scope.policyCtx.isShowRateLimitPolicyForm = false;
            $scope.policyCtx.isShowProxyPolicyForm = false;



        }
      }

    }, true);
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
          if (policy.policyScopes && policy.policyScopes.map) {
            for (var i = 0;i < policy.policyScopes.length;i++) {
              policy.data.push({
                name: 'scope: ' + (i + 1).toString(),
                value: policy.policyScopes[i].name
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
    $scope.removePolicyScope = function(policy, scope) {
      if (policy.policyScopes && policy.policyScopes.map) {
        for (var i = 0;i < policy.policyScopes.length; i++) {
          if (policy.policyScopes[i].name === scope.name) {
            policy.policyScopes.splice(i, 1);
          }
        }
      }
      $scope.savePolicy(policy);
    };
    $scope.addPolicyScope = function(item) {

      if (item && item.name) {

        // check to see if item is already there

        if ($scope.policyCtx.currentPolicy) {
          var isUnique = true;
          if ($scope.policyCtx.currentPolicy.policyScopes && $scope.policyCtx.currentPolicy.policyScopes.map) {

            $scope.policyCtx.currentPolicy.policyScopes.map(function(scope) {
              if (scope.name === item.name) {
                isUnique = false;
              }
            });
            if (isUnique) {
              $scope.policyCtx.currentPolicy.policyScopes.push(item);
            }
          }
          else {
            $scope.policyCtx.currentPolicy.policyScopes = [item];
          }

          if (isUnique) {
            // save new policy scope
            $scope.policyScopeCtx.savePolicyScope(item);

          }
          // reset value
          $scope.policyCtx.currentPolicy.currentPolicyScope = null;
        }


      }



    };
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
    /*
     *
     * Save Edit (inline)
     *
     * */
    //$scope.savePolicy = function(policy) {
    //  if (policy.type) {
    //
    //    if (!policy.name) {
    //      policy.name = policy.type + '-' + Math.floor((Math.random() * 10000) + 1);
    //    }
    //
    //    GatewayServices.savePolicy(policy)
    //      .$promise
    //      .then(function(response) {
    //        policy = response;
    //        policy.editMode = false;
    //      });
    //
    //
    //
    //  }
    //  else {
    //    $log.debug('invalid Policy attempt save - no type');
    //  }
    //};



  }
]);
