// Copyright StrongLoop 2014
BuildDeploy.directive('slBuildDeploy', [
  function () {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/build-deploy/templates/build-deploy.form.html'
    };
  }
]);
