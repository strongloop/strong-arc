/**
 *
 * Copyright StrongLoop 2014
 *
 * User: seanbrookes
 * Date: 2014-01-13
 * Time: 4:50 PM
 *
 */
var Profile = angular.module('Profile', []).
  run(function ($http, $templateCache) {
    /*
     *
     * pre load the module templates
     *
     * */
    /*
     *
     * Login Main Template
     *
     * */
    $http.get('./scripts/modules/profile/templates/profile.main.html').
      success(function (res) {
        $templateCache.put('login.html', res);
      }
    );


  }
);
