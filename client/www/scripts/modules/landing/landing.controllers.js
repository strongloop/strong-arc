// Copyright StrongLoop 2014
Landing.controller('LandingController', [
  '$scope',
  'LandingService',
  '$q',
  function ($scope, LandingService, $q) {
    $q.all([
      LandingService.getApps().$promise,
      LandingService.getCurrentProject().$promise
    ]).then(function(resolved) {
      var apps = resolved[0].results;
      var project = resolved[1];
      $scope.project = project;
      $scope.apps = apps.filter(function(app){
        return !app.disabled;
      });
    });
  }
]);
