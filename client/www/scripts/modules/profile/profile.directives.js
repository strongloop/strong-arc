/**
 *
 * Copyright StrongLoop 2014
 *
 * User: seanbrookes
 * Date: 2014-01-13
 * Time: 4:50 PM
 *
 */
Profile.directive('lbProfileMainDirective', [
  '$templateCache',
  function ($templateCache) {

    return {
      templateUrl: 'profile.main.html'
    };
  }
]);

Profile.directive('lbLogout', [
  'ProfileService',
  '$location',
  'NavigationService',
  function (ProfileService, $location, NavigationService) {
    return{
      template: '<a href="#" ng-click="logout()" ng-show="isUserAuth()">logout</a>',
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
//Profile.directive('lbRegister', [
//  'ProfileService',
//  '$location',
//  'NavigationService',
//  function (ProfileService, $location, NavigationService) {
//    return{
//      template: '<a href="#" ng-click="logout()" ng-show="isUserAuth()">logout</a>',
//      link: function(scope,element, attribs) {
//        scope.logout = function () {
//          ProfileService.logCurrentUserOut(function() {
//            NavigationService.postLogoutNav();
//          });
//        };
//        scope.isUserAuth = function () {
//          return ProfileService.getCurrentUserId();
//        };
//      },
//      replace: true
//    };
//  }
//]);
