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
    svc.getCurrentUser = function() {
      return User.findById({id:svc.getCurrentUserId()});
    };

    return svc;

  }
]);
Profile.service('UserPreferenceService', [
  function() {

    var svc = {};
    svc.getAllUserPreferences = function() {
      var prefs = window.localStorage.getItem('UserPreferences');
      if(prefs) {
        return JSON.parse(prefs);
      }
      return null;
    };
    svc.getUserPref = function(prefRef) {
      var prefs = svc.getAllUserPreferences();
      if (prefs[prefRef]){
        return prefs[prefRef];
      }
      return null;
    };
    svc.saveBulkUserPrefs = function(prefsObj){
      if (prefsObj) {
        window.localStorage.setItem('UserPreferences', JSON.stringify(prefsObj));
      }

    };
    svc.setUserPref = function(userPrefName, userPrefVal) {
      if (userPrefName && userPrefVal) {
        var prefs = svc.getAllUserPreferences();
        // walk down the path to make sure the property references are valid
        var isNew = true;
        for (var i = 0; i < prefs.length;i++) {
          if (prefs[i].name === userPrefName) {
            prefs[i].value = userPrefVal;
            isNew = false;
            break;
          }
        }
        if (isNew) {
          prefs.push({
            name:userPrefName,
            value:userPrefVal
          });
        }
        window.localStorage.setItem('UserPreferences', JSON.stringify(prefs));
      }
      return svc.getAllUserPreferences();
    };
    return svc;
  }
]);






