// Copyright StrongLoop 2014
// reference https://github.com/goodeggs/ng-focus-on
Common.directive('focusOn', function() {
  return function(scope, elem, attr) {
    return scope.$on('focusOn', function(e, name) {
      if (name === attr.focusOn) {
        return elem[0].select();
      }
    });
  };
});
Common.directive('loadingIndicator', [
  function() {
    return {
      template: '<img src="./images/mf_progress_radar.gif" /><p>discovering schema...</p>'
    }
  }
]);
