// Copyright StrongLoop 2014
IA.directive('slIaMainNav', [
  'ModelService',
  'DatasourceService',
  'IAService',
  '$timeout',
  function(ModelService, DatasourceService, IAService, $timeout) {
    return {
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
          for (var h = 0;h < scope.mainNavDatasources.length;h++){
            var localDSInstance = scope.mainNavDatasources[h];
            localDSInstance.isActive = false;
            localDSInstance.isOpen = false;
            localDSInstance.isSelected = false;

            for (var r = 0;r < openDatasourceNames.length;r++) {
              if (openDatasourceNames[r] === localDSInstance.name) {
                localDSInstance.isOpen = true;
                break;
              }
            }
            if (currActiveDatasourceInstanceName === localDSInstance.name) {
              localDSInstance.isActive = true;
            }
            for (var w = 0;w < scope.currentDatasourceSelections.length;w++) {
              if (scope.currentDatasourceSelections[w] === localDSInstance.name) {
                localDSInstance.isSelected = true;
                break;
              }
            }


          }
        }

        var renderComp = function() {

          console.log('||||   RENDER COMPONENT');
          $timeout(function() {

            React.renderComponent(IAMainNavContainer({scope:scope}), el[0]);
          }, 140);


        };
        scope.$watch('currentModelSelections', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        });
        scope.$watch('currentOpenModelNames', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        });
        scope.$watch('activeModelInstance', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        });
        scope.$watch('currentDatasourceSelections', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        });
        scope.$watch('currentOpenDatasourceNames', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        });
        scope.$watch('activeDatasourceInstance', function(newVal, oldVal) {
          processActiveNavState();
          renderComp();
        });
        scope.$watch('mainNavModels', function(mainNavModels) {
          if (!mainNavModels.$promise) {
            processActiveNavState();
            renderComp();
          }
        });
        scope.$watch('mainNavDatasources', function(mainNavDatasources) {
          if (!mainNavDatasources.$promise) {
            renderComp();
          }
        });

      }
    }
  }
]);
/*
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
 *   IA Main Content
 *
 * */
IA.directive('slIaMainContent', [
  function() {
    return {
      templateUrl: './scripts/modules/ia/templates/ia.main.content.html',
      link: function(scope, el, attrs) {

      }
    }
  }
]);
