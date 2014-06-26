// Copyright StrongLoop 2014
Explorer.directive('slExplorerView', [
  function() {
    return {
      replace:true,
      link: function(scope, el, attrs) {

        scope.$watch('explorerResources', function(models) {
          React.renderComponent(ExplorerMain({scope:scope}), el[0]);
        }, true);
      }
    }
  }
]);
