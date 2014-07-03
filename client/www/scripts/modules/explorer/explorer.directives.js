// Copyright StrongLoop 2014
Explorer.directive('slExplorerView', [
  function() {
    return {
      replace:true,
      link: function(scope, el, attrs) {
//        jQuery('[data-id="ExplorerContainer"]').drags();
        scope.$watch('explorerResources', function(models) {
          React.renderComponent(ExplorerMain({scope:scope}), el[0]);
        }, true);
        scope.$watch('activeModelInstance', function(instance) {
          React.renderComponent(ExplorerMain({scope:scope}), el[0]);
        }, true);
        scope.$watch('mainNavModels', function(instance) {
          React.renderComponent(ExplorerMain({scope:scope}), el[0]);
        }, true);
        scope.$watch('currentExplorerApiResponse', function(response) {
          React.renderComponent(ExplorerMain({scope:scope}), el[0]);
        }, true);

      }
    }
  }
]);
