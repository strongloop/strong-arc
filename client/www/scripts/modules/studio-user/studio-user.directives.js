// Copyright StrongLoop 2014
StudioUser.directive('slUserLoginView', [
  'StudioUserService',
  function(StudioUserService) {

    return {
      controller: function ($scope, $location, StudioUserService) {

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
        $scope.clearLoginErrorMessage = function() {
          $scope.loginErrorMessage = '';
        };

        $scope.loginRequest = function (formConfig) {
          $scope.loginResult = StudioUserService.loginRequest(formConfig).
            then(function(response) {
              $location.path('/landing');
            }).catch(function(response) {
              $scope.loginErrorMessage = 'Authentication attempt failed. Please check your username (email) and password and try again';
              $scope.resetCredentials();
            }
          );

        };
      },
      link: function(scope, el, attrs) {

        scope.$watch('credentials', function() {
          React.renderComponent(LoginFormView({scope:scope}), el[0]);
        });
        scope.$watch('loginError', function() {
          React.renderComponent(LoginFormView({scope:scope}), el[0]);
        });
      }
    }
  }
]);
StudioUser.directive('slUserLogoutNavItem', [
  'StudioUserService',
  '$location',
  'StudioNavigationService',
  function (StudioUserService, $location, StudioNavigationService) {
    return{
      template: '<li ng-show="isUserAuth()"><a href="#" ng-click="logout()">logout</a></li>',
      link: function(scope,element, attribs) {
        scope.logout = function () {
          StudioUserService.logCurrentUserOut(function() {
            StudioNavigationService.postLogoutNav();
          });
        };
        scope.isUserAuth = function () {
          return StudioUserService.getCurrentUserId();
        };
      },
      replace: true
    };
  }
]);
StudioUser.directive('lbLoginNavItem', [
  'StudioUserService',
  function (StudioUserService) {
    return{
      template: '<li ng-hide="isUserAuth()"><a ui-sref="login" title="login">login</a></li>',
      link: function(scope,element, attribs) {
        scope.isUserAuth = function () {
          return StudioUserService.getCurrentUserId();
        };
      },
      replace: true
    };
  }
]);
StudioUser.directive('lbRegisterNavItem', [
  'StudioUserService',
  function (StudioUserService, $location, NavigationService) {
    return{
      template: '<li ng-hide="isUserAuth()"><a href="https://strongloop.com/register/" target="_blank">register</a></li>',
      link: function(scope,element, attribs) {
        scope.isUserAuth = function () {
          return StudioUserService.getCurrentUserId();
        };
      },
      replace: true
    };
  }
]);
StudioUser.directive('lbGreetingNavItem', [
  'StudioUserService',
  function (StudioUserService) {
    return{
      template: '<li ng-show="isUserAuth()"><a href="#profile" us-sref="profile">Hi {{ currentUser.firstName }}</a></li>',
      link: function(scope,element, attribs) {
        scope.currentUser = {};
        var isAuthUser = StudioUserService.getCurrentUserId();
        if (isAuthUser) {
          scope.currentUser = StudioUserService.getCurrentUser();
        }

        scope.isUserAuth = function () {
          return isAuthUser;
        };
      },
      replace: true
    };
  }
]);

