// Copyright StrongLoop 2014
Landing.controller('LandingController', [
  '$scope',
  'LandingService',
  function ($scope, LandingService) {
    $scope.suiteIA.selectedApp =  {
      id: 'none',
      name: 'Select Module'
    };

    LandingService.getApps()
      .then(function (data) {
        $scope.apps = data;
      });
  }
]);

