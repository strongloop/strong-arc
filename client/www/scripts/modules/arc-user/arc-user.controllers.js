// Copyright StrongLoop 2014
ArcUser.controller('LoginController', [
  '$scope',
  '$location',
  'ArcUserService',
  '$stateParams',
  function ($scope, $location, ArcUserService, $stateParams) {
    $scope.referrer = null;

    if ( $stateParams.ref ) {
      $scope.referrer = $stateParams.ref;
    }
  }
]);

