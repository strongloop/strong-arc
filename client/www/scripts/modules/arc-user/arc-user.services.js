ArcUser.service('ArcUserService', [
  'User',
  '$q',
  '$cookieStore',
  function (User, $q, $cookieStore) {
    var svc = this;

    svc.getCurrentUserId = function () {
      return $cookieStore.get('currentUserId');
    };

    svc.buildLoginRequest = function(data) {
      var result = {
        password: data.password
      };

      if (/@/.test(data.nameOrEmail)) {
        result.email = data.nameOrEmail;
      } else {
        result.username = data.nameOrEmail;
      }

      return result;
    };

    svc.loginRequest = function(config) {
      var deferred = $q.defer();
      var request = svc.buildLoginRequest(config);
      User.login(request,
        function (response) {
          //save user properties and auth token
          svc.saveUserData(response);
          svc.saveAuthTokenData(response);
          deferred.resolve(response);
        },
        function (response) {
          var authFailMsg = 'Authentication attempt failed.  Please confirm your email and password and try again.';
          deferred.reject(response);
        }
      );
      return deferred.promise;
    };
    // better but still need a more robust implementation
    svc.saveAuthTokenData = function(data) {

      $cookieStore.put('currentUserId', data.userId);
      $cookieStore.put('accessToken', data.id);

    };
    svc.saveUserData = function(data) {
      var deferred = $q.defer();
      svc.getCurrentUser()
         .then(
          function(response) {
            $cookieStore.put('currentUserEmail', data.currentUserEmail);
            $cookieStore.put('currentUsername', data.currentUsername);
            deferred.resolve(response);
          });
      return deferred.promise;
    };
    svc.isAuthUser = function() {
      if (svc.getCurrentUserId()){
        return true;
      }
      return false;
    };
    svc.logCurrentUserOut = function (cb) {
      $cookieStore.remove('currentUserId');
      $cookieStore.remove('accessToken');
      $cookieStore.remove('currentUserEmail');
      $cookieStore.remove('currentUsername');
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
