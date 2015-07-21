
/*
 *
 *   POLICY DIRECTIVES
 *
 * */
Gateway.directive('slPolicyForm', [
  'GatewayServices',
  '$log',
  'growl',
  '$state',
  function(GatewayServices, $log, growl, $state) {
    return {
      restrict: 'E',
      scope: {
        policy: '=',
        context: '=',
        hidebuttons: '='
      },
      templateUrl: './scripts/modules/gateway/templates/policy.form.html',
      controller: ['$scope',
        function($scope) {

          $scope.isPolicyDirty = false;
          $scope.originalPolicy = {};

          function refreshPolicies() {
            $scope.policyCtx.policies = GatewayServices.getPolicies()
              .then(function(policies) {

                $scope.policyCtx.policies = policies;

              });
          }

          $scope.init = function() {
            $scope.originalPolicy = angular.copy($scope.policy);
          };
          $scope.init();

          $scope._saveNewPolicy = function(policy){
            $scope.saveNewPolicy({ policy: policy });
          };

          //$scope.saveNewPolicy = function(policy) {
          //  $scope.close();
          //  if (policy.name && policy.type) {
          //
          //    GatewayServices.savePolicy(policy)
          //      .$promise
          //      .then(function(policy) {
          //        $state.go('policy');
          //        //resetCurrentPolicy();
          //        refreshPolicies();
          //      });
          //
          //  }
          //};
          $scope.saveCurrentPolicy = function(policy) {
            if (policy.name && policy.type) {

              if ($scope.isPolicyDirty) {
                if (confirm('do you want to make this change')) {
                  GatewayServices.savePolicy(policy)
                    .$promise
                    .then(function(policy) {
                      growl.addSuccessMessage('Policy Saved');
                      //resetCurrentPolicy();

                    });
                }
              }
              else {
                GatewayServices.savePolicy(policy)
                  .$promise
                  .then(function(policy) {
                    growl.addSuccessMessage('Policy Saved');
                    //resetCurrentPolicy();

                  });
              }





            }
          };
        }
      ],
      link: function(scope, el, attrs) {


        /*
         *
         * Dirty check
         *
         * */
        scope.$watch('policy', function(newVal, oldVal) {
          scope.isPolicyDirty = false;
          if (newVal.id && oldVal.id) {

            if (newVal !== oldVal) {
              if (!angular.equals(scope.originalPolicy, newVal)) {
                scope.isPolicyDirty = true;

              }
            }
          }

        }, true);
        scope.$watch('context.policyTypes', function(newVal, oldVal) {
          $log.debug('| policy types')
        });
        scope.$watch('policy.type', function(newVal, oldVal) {
          if (newVal) {
            $log.debug('it changed: ' + newVal);

            switch (newVal) {
              case 'ratelimiting' :

                scope.context.isShowAuthPolicyForm = false;
                scope.context.isShowRateLimitPolicyForm = true;
                scope.context.isShowProxyPolicyForm = false;

                break;

              case 'auth' :

                scope.context.isShowAuthPolicyForm = true;
                scope.context.isShowRateLimitPolicyForm = false;
                scope.context.isShowProxyPolicyForm = false;


                break;

              case 'reverseproxy' :


                scope.context.isShowAuthPolicyForm = false;
                scope.context.isShowRateLimitPolicyForm = false;
                scope.context.isShowProxyPolicyForm = true;


                break;

              default :
                scope.context.isShowAuthPolicyForm = false;
                scope.context.isShowRateLimitPolicyForm = false;
                scope.context.isShowProxyPolicyForm = false;



            }
          }

        }, true);
      }
    }
  }
]);
Gateway.directive('slPolicyAuthForm', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/policy.auth.form.html'
    }
  }
]);
Gateway.directive('slPolicyProxyForm', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/policy.proxy.html'
    }
  }
]);
Gateway.directive('slPolicyRateLimitForm', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/policy.ratelimit.html'
    }
  }
]);

Gateway.directive('slPolicyList', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/policy.list.html'
    }
  }
]);
Gateway.directive('slPolicyMainView', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/policy.main.html',
      link: function(scope, el, attrs) {

      }
    }
  }
]);
Gateway.directive('slPolicyScopeEditor', [ '$log', function($log) {
  return {
    restrict: 'E',
    templateUrl: './scripts/modules/gateway/templates/policy.scope.editor.html',
    controller:['$scope', function($scope) {

      if ($scope.context) {
        $scope.context.newPolicyScope = '';

      }

      $scope.addPolicyScope = function() {
        if (!$scope.context.newPolicyScope || $scope.context.newPolicyScope.length === 0) {
          return;
        }
        if (!$scope.policy.scopes) {
          $scope.policy.scopes = [];
        }
        $scope.policy.scopes.push($scope.context.newPolicyScope);
        $scope.context.newPolicyScope = '';
      };
      $scope.deletePolicyScope = function(key) {
        if (!$scope.policy.scopes) {
          $scope.policy.scopes = [];
        }
        if (($scope.policy.scopes.length > 0) &&
          ($scope.context.newPolicyScope.length === 0) &&
          (key === undefined)) {
          $scope.policy.scopes.pop();

        }
        else if (key !== undefined) {
          $scope.policy.scopes.splice(key, 1);
        }
      };

    }],
    link: function(scope, el, attrs) {

    }
  }
}]);
Gateway.directive('slPolicyScopeInput', [ '$log', function($log) {
  return {
    restrict: 'A',
    link: function(scope, el, attrs) {
      scope.inputWidth = 20;

      // watch for changes in text field
      scope.$watch(attrs.ngModel, function(value) {
        if (value != undefined) {
          var tempEl = $('<span>' + value + '</span>').appendTo('body');
          scope.inputWidth = tempEl.width() + 5;
          tempEl.remove();

        }
      });

      el.bind('keydown', function(e) {
        if (e.which === 9) {
          e.preventDefault();
        }
        if (e.which === 8) {
          scope.$apply(attrs.deletePolicyScope);
        }
      });
      el.bind('keyup', function(e) {
        var key = e.which;

        if ((key === 9) || (key == 13)) {
          e.preventDefault();
          scope.$apply(attrs.newPolicyScope);
        }
      });
    }
  }
}]);
