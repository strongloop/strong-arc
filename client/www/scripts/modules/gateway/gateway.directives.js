
/*
*
*   POLICY
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
          function refreshPolicies() {
            $scope.policyCtx.policies = GatewayServices.getPolicies()
              .then(function(policies) {

                $scope.policyCtx.policies = policies;

              });
          }

          $scope.saveNewPolicy = function(policy) {
            $scope.close();
            if (policy.name && policy.type) {

              GatewayServices.savePolicy(policy)
                .$promise
                .then(function(policy) {
                  $state.go('policy');
                  //resetCurrentPolicy();
                  refreshPolicies();
                });

            }
          };

          $scope.saveCurrentPolicy = function(policy) {
            if (policy.name && policy.type) {
              $log.debug('update this policy: '  + policy.name);



              GatewayServices.savePolicy(policy)
                .$promise
                .then(function(policy) {
                  growl.addSuccessMessage('Policy Saved');
                  //resetCurrentPolicy();

                });

            }
          };
        }
      ],
      link: function(scope, el, attrs) {

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

/*
*
* PIPELINE
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
      controller: function($scope) {

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
/*
*
*
*   GATEWAY MAP
*
* */
Gateway.directive('slGatewayMapForm', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/gateway.map.form.html'
    }
  }
]);
Gateway.directive('slGatewayMapList', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/gateway.map.list.html',
      controller: [
        '$scope',
        function($scope) {
          $scope.saveGatewayMap = function(gatewayMap) {
            $scope.gatewayMapCtx.currentGatewayMap = gatewayMap;
            $scope.saveCurrentGatewayMap();
          }
        }
      ]
    }
  }
]);
Gateway.directive('slGatewayMapMainView', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/gateway.map.main.html',
      link: function(scope, el, attrs) {

      }
    }
  }
]);
Gateway.directive('slGatewayMainNav', [
  'GatewayServices',
  '$timeout',
  function(GatewayServices, $timeout) {
    return {
      replace: true,
      link: function(scope, el, attrs) {

        function processActiveNavState() {
          // models
          var openModelNames = IAService.getOpenModelNames();
          var openDatasourceNames = scope.currentOpenDatasourceNames;
          var currActiveModelInstanceName = '';

          if (scope.activeInstance && scope.activeInstance.name) {


            if (scope.activeInstance.type === CONST.MODEL_TYPE) {
              currActiveModelInstanceName = scope.activeInstance.name;
            }

          }
          for (var x = 0;x < scope.mainNavModels.length;x++){
            var localInstance = scope.mainNavModels[x];
            localInstance.isActive = false;
            localInstance.isOpen = false;
            localInstance.isSelected = false;

            for (var i = 0;i < openModelNames.length;i++) {
              if (openModelNames[i] === localInstance.name) {
                localInstance.isOpen = true;
                break;
              }
            }
            if (currActiveModelInstanceName === localInstance.name) {
              localInstance.isActive = true;
            }
            for (var k = 0;k < scope.currentSelectedCollection.length;k++) {
              if (scope.currentSelectedCollection[k] === localInstance.name) {
                localInstance.isSelected = true;
                break;
              }
            }
          }
          // datasources
          var openDatasourceNames = scope.currentOpenDatasourceNames;
          var currActiveDatasourceInstanceName = '';
          if (scope.activeInstance && (scope.activeInstance.type === CONST.DATASOURCE_TYPE)) {
            currActiveDatasourceInstanceName = scope.activeInstance.name;
          }

          if (scope.mainNavDatasources.length){

            var discoverableDatasources = DataSourceService.getDiscoverableDatasourceConnectors();

            for (var h = 0;h < scope.mainNavDatasources.length;h++){
              var localDSInstance = scope.mainNavDatasources[h];
              localDSInstance.isActive = false;
              localDSInstance.isOpen = false;
              localDSInstance.isSelected = false;
              localDSInstance.isDiscoverable = false;

              // is it discoverable
              // if (localDSInstance.children && localDSInstance.children.connector) {
              if (localDSInstance && localDSInstance.definition.connector) {
                for (var w = 0;w < discoverableDatasources.length;w++) {
                  if (localDSInstance.definition.connector === discoverableDatasources[w]) {
                    localDSInstance.isDiscoverable = true;
                    break;
                  }
                }
              }

              // is it open
              for (var r = 0;r < openDatasourceNames.length;r++) {
                if (openDatasourceNames[r] === localDSInstance.name) {
                  localDSInstance.isOpen = true;
                  break;
                }
              }
              // is it active
              if (currActiveDatasourceInstanceName === localDSInstance.name) {
                localDSInstance.isActive = true;
              }
              // is it selected
              for (var w = 0;w < scope.currentSelectedCollection.length;w++) {
                if (scope.currentSelectedCollection[w] === localDSInstance.name) {
                  localDSInstance.isSelected = true;
                  break;
                }
              }
            }
          }
        }
        scope.$watch('gatewayMapCtx.gatewayMaps', function(newVal, oldVal) {
          if (newVal && newVal.map) {
            $timeout(function() {
              React.renderComponent(GatewayMainNav({scope:scope}), el[0]);
            }, 140);
          }
        }, true);
        scope.$watch('pipelineCtx.pipelines', function(newVal, oldVal) {
          if (newVal && newVal.map) {
            $timeout(function() {
              React.renderComponent(GatewayMainNav({scope:scope}), el[0]);
            }, 140);
          }
        }, true);

        scope.$watch('policyCtx.policies', function(newVal, oldVal) {
          if (newVal && newVal.map) {
            $timeout(function() {
              React.renderComponent(GatewayMainNav({scope:scope}), el[0]);
            }, 140);
          }
        }, true);


      }
    }
  }
]);
