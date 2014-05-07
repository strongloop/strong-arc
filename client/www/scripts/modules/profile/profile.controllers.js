// Copyright StrongLoop 2014
/**
 *
 * Profile Controller
 *
 * */
Profile.controller('ProfileMainController', [
  '$rootScope',
  '$scope',
  'User',
  function ($rootScope, ProfileService, $scope, User) {

    $scope.viewTitle = 'Profile';

  }
]);
Profile.controller('LoginController', [
  '$scope',
  '$location',
  'User',
  function ($scope, $location, User) {

    $scope.credentials = {
      email: 'foo@bar.com',
      password: 'password'
    };
    // TODO move to Profile Service
    $scope.login = function () {

      $scope.loginResult = User.login($scope.credentials,
        function () {

          // TODO make a more robust API call here
          window.localStorage.setItem('currentUserId', $scope.loginResult.userId);
          window.localStorage.setItem('accessToken', $scope.loginResult.id);
          $location.path('/home');

          //$location.path('/');
        },
        function (res) {
          $scope.loginError = res.data.error;
        }
      );
    };
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
