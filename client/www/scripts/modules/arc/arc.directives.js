// Copyright StrongLoop 2014
Arc.directive('greetingMain', [
  function() {
    return {
      templateUrl: './scripts/modules/arc/templates/home.main.html'
    }
  }
]);


Arc.directive('slAppChooser', [
  function() {
    return {
      replace:true,
      link:function(scope, el, attrs) {
        scope.$watch('wsComps', function(apps) {
          React.renderComponent(AppSelection({scope:scope}), el[0]);
        }, true);
      }
    }
  }
]);

