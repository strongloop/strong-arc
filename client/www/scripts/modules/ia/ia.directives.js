// Copyright StrongLoop 2014

IA.directive('slIaMainNav', [
  'ModelService',
  'DatasourceService',
  'IAService',
  function(ModelService, DatasourceService, IAService) {
    return {
      controller: function($scope, $location) {


        //$scope.clearModelPreview();
      },
      link: function(scope, el, attrs) {

        var renderComp = function() {
          React.renderComponent(IAMainNavContainer({scope:scope}), el[0]);
        };
        scope.$watch('mainNavModels', function(mainNavModels) {
          if (!mainNavModels.$promise) {

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
