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
  '$modal',
  'growl',
  function($scope, $log, GatewayServices, $timeout, $state, $modal, growl) {
    $log.debug('Policy Controller');

    $scope.policyCtx.isShowAuthPolicyForm = false;
    $scope.policyCtx.isShowRateLimitPolicyForm = false;
    $scope.policyCtx.isShowProxyPolicyForm = false;
    $scope.isShowAddPolicyRow = false;

    $scope.policyCtx.init = function() {

      $scope.policyCtx.policies = GatewayServices.getPolicies()
        .then(function(policies) {
          $scope.policyCtx.policies = policies;
        });

    };
    function resetCurrentPolicy() {
      $scope.policyCtx.currentPolicy = {};
    }



    $scope.confirmDeletePolicy = function(policy) {
      var modalDlg = $modal.open({
        templateUrl: './scripts/modules/gateway/templates/confirm.policy.delete.html',
        size: 'md',
        scope: $scope,
        controller: function($scope, $modalInstance, title) {
          $scope.isModal = true;
          $scope.title = title;
          $scope.policy = policy;
          $scope.close = function() {
            $modalInstance.dismiss();
          };

          $scope._deletePolicy = function(policy){
            $scope.deletePolicy(policy);
            $scope.close();
          }
        },
        resolve: {
          title: function() {
            return 'Confirm Delete Policy';
          }
        }
      });
    };

    $scope.deletePolicy = function(policy){
      GatewayServices.deletePolicy(policy.id)
        .then(function(response) {
          $scope.refreshPolicies();
        });
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
      $scope.gatewayCtx.currentView = GATEWAY_CONST.POLICY_TYPE;
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
        case GATEWAY_CONST.POLICY_AUTH_TYPE:
          //erase proxy and ratelimit data

          break;
        case GATEWAY_CONST.POLICY_RATELIMIT_TYPE:

          break;
        case GATEWAY_CONST.POLICY_PROXY_TYPE:

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
          policy.name = policy.type + '-' + Math.floor((Math.random() * 10000) + 1);
        }

        if (policy.isPolicyNameDirty) {
          GatewayServices.renamePolicy(policy, policy.name, policy.oldName)
          .then(function(policy) {
              policy = GatewayServices.savePolicy(policy)
                .$promise
                .then(function(response) {
                  resetCurrentPolicy();
                  refreshPolicies();
                  turnOffOtherPolicyEdits();
                });
            })
        }
        else {
          policy = GatewayServices.savePolicy(policy)
            .$promise
            .then(function(response) {
              resetCurrentPolicy();
              refreshPolicies();
              turnOffOtherPolicyEdits();
            });

        }

      }
      else {
        $log.debug('invalid Policy attempt save');
      }
    };


  }
]);
