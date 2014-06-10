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
        }

        var renderComp = function() {

          console.log('||||   RENDER COMPONENT');
          $timeout(function() {

            React.renderComponent(IAMainNavContainer({scope:scope}), el[0]);
          }, 100);


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
 *   IA Main Content
 *
 * */
IA.directive('slIaMainContent', [
  function() {
    return {
      templateUrl: './scripts/modules/ia/templates/ia.main.html',
      link: function(scope, el, attrs) {

      }
    }
  }
]);
