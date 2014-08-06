// Copyright StrongLoop 2014
Explorer.directive('slExplorerView', [
  function() {
    return {
      replace:true,
      link: function(scope, el, attrs) {

//        jQuery('[data-id="InstanceSliderBtn"]').click(function() {
//          scope.toggleInstanceContainer();
//        });
        function renderComp() {
          React.renderComponent(ExplorerMain({scope:scope}), el[0]);
        }

//        jQuery('[data-id="ExplorerContainer"]').drags();
        scope.$watch('explorerResources', function(models) {
          renderComp();
        }, true);
        scope.$watch('activeModelInstance', function(instance) {
          renderComp();
        }, true);
        scope.$watch('mainNavModels', function(instance) {
          renderComp();
        }, true);
        scope.$watch('latestExplorerEndPointResponses', function(response) {
          renderComp();
        }, true);
        scope.$watch('explorerDataModelChanged', function(response) {
          renderComp();
        }, true);




      }
    }
  }
]);
