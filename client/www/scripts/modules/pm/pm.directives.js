// Copyright StrongLoop 2014
PM.directive('slPmAppControls', [
  function() {
    return {
      templateUrl: './scripts/modules/pm/templates/pm.app.controls.html'
    }
  }
]);
PM.directive('slPmAppControllerMenu', [
  function() {
    return {
      templateUrl: './scripts/modules/pm/templates/pm.app.controller.menu.html',
      link: function(scope, el, attrs) {

      }
    }
  }
]);
