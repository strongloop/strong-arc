var Composer = angular.module('Composer', []);

Composer.config(['growlProvider', function (growlProvider) {
  growlProvider.globalTimeToLive(1800);
}]);
Composer.config([
  '$httpProvider',
  function ($httpProvider) {
    $httpProvider.interceptors.push('requestInterceptor');
  }
]);
Composer.factory('requestInterceptor', [
  '$q',
  '$rootScope',
  '$location',
  '$cookieStore',
  function ($q, $rootScope) {
    return {
      'request': function (config) {
        return config || $q.when(config);
      },
      responseError: function (rejection) {
        if ((rejection.status > 499) || (rejection.status === 422)) {
          var error = rejection.data && rejection.data.error;
          if (!error) {
            error = { message: rejection.data };
          }

          $rootScope.$broadcast('GlobalExceptionEvent', {
              requestUrl: rejection.config && rejection.config.url,
              message: error && error.message,
              details: error && error.details,
              name: error && error.name,
              stack: error && error.stack,
              code: error && error.code,
              status: rejection.status || 'unknown',
            }
          );
        }
        return $q.reject(rejection);
      }
    };
  }
]);

// Get project name from package.json
Composer.run(['$rootScope', '$log', 'PackageDefinition', function ($rootScope, $log, PackageDefinition) {
  var pkg = PackageDefinition.findOne();
  return pkg.$promise
    .then(function () {
      $rootScope.projectName = pkg.name;
    })
    .catch(function (err) {
      $log.warn('Cannot get project\'s package definition.', err);
    });
}]);
