// Copyright StrongLoop 2014
Profile.directive('lbProfileMainDirective', [
  '$templateCache',
  function ($templateCache) {

    return {
      templateUrl: 'profile.main.html'
    };
  }
]);

Profile.directive('lbLogoutNavItem', [
  'ProfileService',
  '$location',
  'NavigationService',
  function (ProfileService, $location, NavigationService) {
    return{
      template: '<li ng-show="isUserAuth()"><a href="#" ng-click="logout()">logout</a></li>',
      link: function(scope,element, attribs) {
        scope.logout = function () {
          ProfileService.logCurrentUserOut(function() {
            NavigationService.postLogoutNav();
          });
        };
        scope.isUserAuth = function () {
          return ProfileService.getCurrentUserId();
        };
      },
      replace: true
    };
  }
]);
Profile.directive('lbLoginNavItem', [
  'ProfileService',
  '$location',
  'NavigationService',
  function (ProfileService) {
    return{
      template: '<li ng-hide="isUserAuth()"><a ui-sref="login">login</a></li>',
      link: function(scope,element, attribs) {
        scope.isUserAuth = function () {
          return ProfileService.getCurrentUserId();
        };
      },
      replace: true
    };
  }
]);
Profile.directive('lbRegisterNavItem', [
  'ProfileService',
  '$location',
  'NavigationService',
  function (ProfileService, $location, NavigationService) {
    return{
      template: '<li ng-hide="isUserAuth()"><a ui-sref="register">register</a></li>',
      link: function(scope,element, attribs) {
        scope.isUserAuth = function () {
          return ProfileService.getCurrentUserId();
        };
      },
      replace: true
    };
  }
]);
Profile.directive('lbGreetingNavItem', [
  'ProfileService',
  '$location',
  'NavigationService',
  function (ProfileService, $location, NavigationService) {
    return{
      template: '<li ng-show="isUserAuth()"><a>Hi {{ currentUser.firstName }}</a></li>',
      link: function(scope,element, attribs) {
        scope.currentUser = {};
        var isAuthUser = ProfileService.getCurrentUserId();
        if (isAuthUser) {
          scope.currentUser = ProfileService.getCurrentUser();
        }

        scope.isUserAuth = function () {
          return isAuthUser;
        };
      },
      replace: true
    };
  }
]);

