/**
 * GATEWAY GLOBAL DIRECTIVES
 */
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
