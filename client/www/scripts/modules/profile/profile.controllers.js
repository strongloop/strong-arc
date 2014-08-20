// Copyright StrongLoop 2014
/**
 *
 * Profile Controller
 *
 * */
Profile.controller('ProfileMainController', [
  '$rootScope',
  '$scope',
  'ProfileService',
  function ($rootScope, ProfileService, $scope, ProfileService) {

    $scope.viewTitle = 'Profile';

  }
]);
Profile.controller('LoginController', [
  '$scope',
  '$location',
  'ProfileService',
  function ($scope, $location, ProfileService) {

  }
]);
Profile.controller('RegisterController', [
  '$scope',
  '$location',
  'User',
  function ($scope, $location, User) {

    $scope.registration = {};

    $scope.register = function () {
      $scope.user = User.save($scope.registration,
        function () {
          $location.path('/login');
        },
        function (res) {
          $scope.registerError = res.data.error;
        }
      );
    };
  }
]);
