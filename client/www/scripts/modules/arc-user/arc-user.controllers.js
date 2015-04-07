// Copyright StrongLoop 2014
ArcUser.controller('LoginController', [
  '$scope',
  '$location',
  'ArcUserService',
  'referrer',
  function ($scope, $location, ArcUserService, referrer) {
    $scope.referrer = referrer;
  }
]);

