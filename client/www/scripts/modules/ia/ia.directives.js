// Copyright StrongLoop 2014
IA.directive('slIaMainNav', [
  'ModelService',
  'DatasourceService',
  'IAService',
  '$timeout',
  function(ModelService, DatasourceService, IAService, $timeout) {
    return {
      replace: true,
      link: function(scope, el, attrs) {

        function processActiveNavState() {
          // models
          var openModelNames = scope.currentOpenModelNames;
          var currActiveModelInstanceName = scope.activeModelInstance.name;

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
            for (var k = 0;k < scope.currentModelSelections.length;k++) {
              if (scope.currentModelSelections[k] === localInstance.name) {
                localInstance.isSelected = true;
                break;
              }
            }
          }
          // datasources
          var openDatasourceNames = scope.currentOpenDatasourceNames;
          var currActiveDatasourceInstanceName = scope.activeDatasourceInstance.name;
          if (scope.mainNavDatasources.length){

            var discoverableDatasources = DatasourceService.getDiscoverableDatasourceConnectors();

            for (var h = 0;h < scope.mainNavDatasources.length;h++){
              var localDSInstance = scope.mainNavDatasources[h];
              localDSInstance.isActive = false;
              localDSInstance.isOpen = false;
              localDSInstance.isSelected = false;
              localDSInstance.isDiscoverable = false;

              // is it discoverable
              if (localDSInstance.children && localDSInstance.children.connector) {
                for (var w = 0;w < discoverableDatasources.length;w++) {
                  if (localDSInstance.children.connector === discoverableDatasources[w]) {
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
              for (var w = 0;w < scope.currentDatasourceSelections.length;w++) {
                if (scope.currentDatasourceSelections[w] === localDSInstance.name) {
                  localDSInstance.isSelected = true;
                  break;
                }
              }
            }
          }
        }

        var renderComp = function() {
          $timeout(function() {

          //  if (!scope.mainNavDatasources.$promise) {
              React.renderComponent(IAMainNavContainer({scope:scope}), el[0]);
          //  }

          }, 140);


        };
        scope.$watch('currentModelSelections', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        }, true);
        scope.$watch('currentOpenModelNames', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        }, true);
        scope.$watch('activeModelInstance', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        }, true);
        scope.$watch('currentDatasourceSelections', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        }, true);
        scope.$watch('currentOpenDatasourceNames', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        }, true);
        scope.$watch('activeDatasourceInstance', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        }, true);
        scope.$watch('mainNavModels', function(mainNavModels) {
          if (!mainNavModels.$promise) {
            processActiveNavState();
            renderComp();
          }
        }, true);
        scope.$watch('mainNavDatasources', function(mainNavDatasources) {
          if (!mainNavDatasources.$promise) {
            processActiveNavState();
            renderComp();
          }
        }, true);

      }
    }
  }
]);
/*
*
*   Main Search
*
* */
IA.directive('slIaMainSearch', [
  function() {
    return  {
      templateUrl: './scripts/modules/ia/templates/ia.main.search.html'
    }
  }
]);
/*
*
*   Main Controls
*
* */
IA.directive('slIaMainControls', [
  '$timeout',
  function($timeout) {
    return  {
      replace: true,
      link: function(scope, el, attrs) {

        scope.$watch('activeModelInstance', function(instance) {
          $timeout(function() {
            React.renderComponent(IAMainControls({scope:scope}), el[0]);
          }, 200);

        });

      }
    }
  }
]);
/*
 *
 *   IA Main Content
 *
 * */
IA.directive('slIaMainContent', [
  function() {
    return {
      templateUrl: './scripts/modules/ia/templates/ia.main.content.html',
      link: function(scope, el, attrs) {

        setUI();
      }
    }
  }
]);
