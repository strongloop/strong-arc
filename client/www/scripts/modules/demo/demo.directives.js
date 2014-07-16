// Copyright StrongLoop 2014
Demo.directive('slDemoMainNav', [
  function() {
    return {
      link: function(scope, el, attrs) {
        scope.$watch('demoAppRenderTrigger', function() {
          React.renderComponent(IAMainModelNav({scope:scope}));
        });
      }
    }
  }
]);

