// Copyright StrongLoop 2014
Studio.directive('greetingMain', [
  function() {
    return {
      templateUrl: './scripts/modules/studio/templates/home.main.html'
    }
  }
]);


Studio.directive('slAppChooser', [
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

