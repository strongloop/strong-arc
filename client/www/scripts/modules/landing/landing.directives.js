// Copyright StrongLoop 2014
Landing.directive('slLandingApp', [
  function () {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/landing/templates/_landing.app.html',
      scope: {
        app: '='
      },
      link: 'scope'
    };
  }
]);
