// Copyright StrongLoop 2014
ArcUser.directive('slUserLoginView', [
  '$stateParams',
  '$state',
  'ArcUserService',
  function($stateParams, $state, ArcUserService) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/arc-user/templates/login.form.html',
      scope: {
        referrer: '@'
      },
      controller: function ($scope, $location, ArcUserService) {
        $scope.loginErrorMessage = '';
        $scope.credentials = {
          nameOrEmail: '',
          password: ''
        };
        $scope.resetCredentials = function() {
          $scope.credentials = {
            nameOrEmail: '',
            password: ''
          };
        };

        $scope.handleChange = function(){
          $scope.clearLoginErrorMessage();
        };

        $scope.clearLoginErrorMessage = function() {
          $scope.loginErrorMessage = '';
        };

        $scope.loginRequest = function (){
          ArcUserService.loginRequest($scope.credentials)
            .then(function(response) {
              var referrer = $scope.referrer;

              if ( referrer ) {
                $state.go(referrer);
              } else {
                $state.go('home');
              }
            }).catch(function(response) {
              $scope.loginErrorMessage = 'Authentication attempt failed. Please check your username (email) and password and try again';
              $scope.resetCredentials();
            }
          );
        };
      }
    }
  }
]);
ArcUser.directive('slUserLogoutNavItem', [
  'ArcUserService',
  '$location',
  'ArcNavigationService',
  function (ArcUserService, $location, ArcNavigationService) {
    return{
      template: '<li ng-show="isUserAuth()"><a id="arc-user-logout-btn" data-id="StudioLogoutLink" href="#" ng-click="logout()">logout</a></li>',
      link: function(scope,element, attribs) {
        scope.logout = function () {
          ArcUserService.logCurrentUserOut(function() {
            ArcNavigationService.postLogoutNav();
          });
        };
        scope.isUserAuth = function () {
          return ArcUserService.getCurrentUserId();
        };
      },
      replace: true
    };
  }
]);
ArcUser.directive('lbLoginNavItem', [
  'ArcUserService',
  function (ArcUserService) {
    return{
      template: '<li ng-hide="isUserAuth()"><a ui-sref="login" title="login">login</a></li>',
      link: function(scope,element, attribs) {
        scope.isUserAuth = function () {
          return ArcUserService.getCurrentUserId();
        };
      },
      replace: true
    };
  }
]);
ArcUser.directive('lbRegisterNavItem', [
  'ArcUserService',
  function (ArcUserService, $location, NavigationService) {
    return{
      template: '<li ng-hide="isUserAuth()"><a href="https://strongloop.com/register/" target="_blank">register</a></li>',
      link: function(scope,element, attribs) {
        scope.isUserAuth = function () {
          return ArcUserService.getCurrentUserId();
        };
      },
      replace: true
    };
  }
]);
ArcUser.directive('lbGreetingNavItem', [
  'ArcUserService',
  function (ArcUserService) {
    return{
      template: '<li ng-show="isUserAuth()"><a href="#profile" us-sref="profile">Hi {{ currentUser.firstName }}</a></li>',
      link: function(scope,element, attribs) {
        scope.currentUser = {};
        var isAuthUser = ArcUserService.getCurrentUserId();
        if (isAuthUser) {
          scope.currentUser = ArcUserService.getCurrentUser();
        }

        scope.isUserAuth = function () {
          return isAuthUser;
        };
      },
      replace: true
    };
  }
]);
