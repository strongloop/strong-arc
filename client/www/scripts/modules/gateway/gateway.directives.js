Gateway.directive('slExternalEndpointForm', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/external.endpoint.form.html'
    }
  }
]);
Gateway.directive('slExternalEndpointList', [
  'GatewayServices',
  function(GatewayServices) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/external.endpoint.list.html',
      controller: [
        '$scope',
        function($scope) {

        }
      ]
    }
  }
]);
Gateway.directive('slExternalEndpointMain', [
  'GatewayServices',
  function(GatewayServices) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/external.endpoint.main.html',
      controller: [
        '$scope',
        function($scope) {

        }
      ]
    }
  }
]);
Gateway.directive('slInternalEndpointForm', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/internal.endpoint.form.html'
    }
  }
]);
Gateway.directive('slInternalEndpointList', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/internal.endpoint.list.html',
      controller: [
        '$scope',
        function($scope) {
          $scope.saveInternalEndpoint = function(internalEndpoint) {
            $scope.internalEndpointCtx.currentInternalEndpoint = internalEndpoint;
            $scope.saveCurrentInternalEndpoint();
          }
        }
      ]
    }
  }
]);
Gateway.directive('slPhaseForm', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/phase.form.html'
    }
  }
]);
Gateway.directive('slPhaseList', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/phase.list.html',
      controller: [
        '$scope',
        function($scope) {
          $scope.savePhase = function(phase) {
            $scope.phaseCtx.currentPhase = phase;
            $scope.saveCurrentPhase();
          }
        }
      ]
    }
  }
]);
/*
*
*   POLICY
*
* */
Gateway.directive('slPolicyForm', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/policy.form.html',
      link: function(scope, el, attrs) {

        scope.$watch('policyCtx.currentPolicyType', function(newVal, oldVal) {
          if (newVal && newVal.name) {

            switch(newVal.id) {

              case 'auth': {
                //show auth view
                $log.debug('show policy view: ' + newVal.name);
                break;

              }
              case 'log': {
                //show log view
                $log.debug('show policy view: ' + newVal.name);
                break;
              }
              case 'ratelimit': {
                //show ratelimit view
                $log.debug('show policy view: ' + newVal.name);
                break;
              }
              case 'proxy': {
                //show proxy view
                $log.debug('show policy view: ' + newVal.name);
                break;
              }
              default:

            }

          }
        });
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
      templateUrl: './scripts/modules/gateway/templates/policy.list.html',
      controller: [
        '$scope',
        function($scope) {

        }
      ]
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
/*
*
*   POLICY SCOPE
*
*   - should really be called endpoint groups(scope)
*
* */
Gateway.directive('slPolicyScopeForm', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/policy.scope.form.html'
    }
  }
]);

Gateway.directive('slPolicyScopeList', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/policy.scope.list.html',
      controller: [
        '$scope',
        function($scope) {

        }
      ]
    }
  }
]);
Gateway.directive('slPolicyScopeMainView', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/policy.scope.main.html',
      link: function(scope, el, attrs) {

      }
    }
  }
]);

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
        scope.$watch('gatewayMapCtx.pipelines', function(newVal, oldVal) {
          if (newVal && newVal.map) {
            $timeout(function() {
              React.renderComponent(GatewayMainNav({scope:scope}), el[0]);
            }, 140);
          }
        }, true);

        scope.$watch('gatewayMapCtx.policies', function(newVal, oldVal) {
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
