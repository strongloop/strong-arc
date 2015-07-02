ArcUser.service('ArcUserService', [
  'User',
  'Subscription',
  '$q',
  '$log',
  '$cookieStore',
  function (User, Subscription, $q, $log, $cookieStore) {
    var svc = this;

    svc.getCurrentUserId = function () {
      return $cookieStore.get('currentUserId');
    };

    svc.getCurrentUsername = function () {
      return $cookieStore.get('currentUsername');
    };

    svc.getCurrentUserEmail = function () {
      return $cookieStore.get('currentUserEmail');
    };

    svc.getAccessToken = function(){
      return $cookieStore.get('accessToken');
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
      Subscription.login({include: 'user'}, request,
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

      $cookieStore.put('currentUserEmail', data.user.email);
      $cookieStore.put('currentUsername', data.user.displayName);

    };
    svc.isAuthUser = function() {
      if (svc.getCurrentUserId()){
        return true;
      }
      return false;
    };
    svc.logCurrentUserOut = function (cb) {
      var logoutObj = User.logout();
      logoutObj.$promise.
        then(function(result) {
          if (cb) {
            cb();
          }
        }).catch(function(err){
          $log.log(err);
          cb();
        })
        .finally(function(){
          $cookieStore.remove('currentUserId');
          $cookieStore.remove('accessToken');
          $cookieStore.remove('currentUserEmail');
          $cookieStore.remove('currentUsername');
        });
    };
    svc.getCurrentUser = function() {
      return User.findById({id:svc.getCurrentUserId()});
    };

    return svc;

  }
]);
