// Copyright StrongLoop 2014
Landing.controller('LandingController', [
  '$scope',
  'LandingService',
  function ($scope, LandingService) {

    $scope.suiteIA.pageId = 'landing';

    LandingService.getApps()
      .then(function (data) {
        $scope.apps = data;
      });
  }
]);

