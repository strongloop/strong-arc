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
        if (rejection && rejection.data && rejection.data.error && rejection.data.error.message) {
          if ((rejection.status > 499) || (rejection.status === 422)) {

            $rootScope.$broadcast('GlobalExceptionEvent', {
                requestUrl: rejection.config.url,
                message: rejection.data.error.message,
                details: rejection.data.error.details,
                name: rejection.data.error.name,
                stack: rejection.data.error.stack,
                code: rejection.data.error.code,
                status: rejection.status
              }
            );
          }
        }
        else if (rejection.data.error.message) {
          $rootScope.$broadcast('GlobalExceptionEvent', {
              message: rejection.data.error.message,
              status: 'unknown'
            }
          );
        }
        else {
          $rootScope.$broadcast('GlobalExceptionEvent', {
              message: 'poorly formed payload',
              status: 'unknown'
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
