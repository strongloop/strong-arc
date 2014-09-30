// Copyright StrongLoop 2014
Landing.controller('LandingController', [
  '$scope',
  'LandingService',
  function ($scope, LandingService) {

    LandingService.getApps()
      .then(function (data) {
        $scope.apps = data;
      });
  }
]);

