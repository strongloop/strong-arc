// Copyright StrongLoop 2014
ArcUser.directive('slUserLoginView', [
  'ArcUserService',
  function(ArcUserService) {

    return {
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
        $scope.clearLoginErrorMessage = function() {
          $scope.loginErrorMessage = '';
        };

        $scope.loginRequest = function (formConfig) {
          $scope.loginResult = ArcUserService.loginRequest(formConfig).
            then(function(response) {
              $location.path('/');
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
ArcUser.directive('slUserLogoutNavItem', [
  'ArcUserService',
  '$location',
  'ArcNavigationService',
  function (ArcUserService, $location, ArcNavigationService) {
    return{
      template: '<li ng-show="isUserAuth()"><a data-id="StudioLogoutLink" href="#" ng-click="logout()">logout</a></li>',
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

