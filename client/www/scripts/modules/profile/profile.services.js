/**
 *
 * Copyright StrongLoop 2014
 *
 * User: seanbrookes
 * Date: 2014-01-13
 * Time: 4:50 PM
 *
 */
/**
 *
 * Profile Service
 *
 * */
Profile.service('ProfileService', [
  'User',
  function (User) {
    var svc = {};

    svc.getCurrentUserId = function () {
      return window.localStorage.getItem('currentUserId');
    };

    svc.isAuthUser = function() {
      if (svc.getCurrentUserId()){
        return true;
      }
      return false;
    };

    svc.logCurrentUserOut = function (cb) {
      window.localStorage.removeItem('currentUserId');
      window.localStorage.removeItem('accessToken');
      var logoutObj = User.logout();
      logoutObj.$promise.
        then(function(result) {
          if (cb) {
            cb();
          }
        });
    };

    return svc;

  }
]);






