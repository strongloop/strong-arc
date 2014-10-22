// Application Constants
var CONST = {
  NEW_MODEL_PRE_ID: 'sl.temp.new-model',
  NEW_MODEL_NAME: 'newModel',
  NEW_MODEL_FACET_NAME: 'common',
  NEW_MODEL_BASE: 'Model',
  NEW_DATASOURCE_PRE_ID: 'sl.temp.new-datasource',
  NEW_DATASOURCE_NAME: 'newDatasource',
  NEW_DATASOURCE_FACET_NAME: 'server',
  DATASOURCE_TYPE: 'datasource',
  DEFAULT_DATASOURCE: 'none',
  DEFAULT_DATASOURCE_BASE_MODEL: 'PersistedModel',
  MODEL_TYPE: 'model',
  APP_FACET: 'server',
  APP_RUNNING_CHECK_INTERVAL:  18000
};

var Studio = angular.module('Studio', [
  'ui.router',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'angularSpinner',
  'ngCookies',
  'angular-growl',
  'lbServices',
  'oldServices',
  'Composer',
  'Profiler',
  'StudioUser',
  'IA',
  'Common',
  'Property',
  'Discovery',
  'Model',
  'Landing',
  'UI',
  'Datasource',
  'Explorer',
  'ui.bootstrap',
  'ui.utils',
  'checklist-model',
  'ngGrid'
]);

Studio.value('CONST', CONST);

Studio.config([
  '$stateProvider',
  '$urlRouterProvider',

  function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: './scripts/modules/landing/templates/landing.main.html',
        controller: 'LandingController'
      })
      .state('profiler', {
        url: '/profiler',
        templateUrl: './scripts/modules/profiler/templates/profiler.main.html',
        controller: 'ProfilerMainController'
      })
      .state('composer', {
        url: '/composer',
        templateUrl: './scripts/modules/composer/templates/composer.main.html',
        controller: 'ComposerMainController',
        resolve: {
          // Wait for all metadata requests to finish
          'studioMetadataResults': [
            'modelPropertyTypes',
            'connectorMetadata',
            '$q',
            function waitForAllStudioMetadata(modelPropertyTypes,
                                              connectorMetadata,
                                              $q) {
              return $q.all([
                connectorMetadata.$promise,
                modelPropertyTypes.$promise
              ]);
            }
          ]
        }
      })
      .state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: './scripts/modules/studio-user/templates/login.html'
      })
      .state('register', {
        url: '/register',
        controller: 'RegisterController',
        templateUrl: './scripts/modules/studio-user/templates/register.html'
      });

  }
]);

Studio.run([
    '$location',
    '$state',
    '$rootScope',
    'StudioUserService',
    function($location, $state, $rootScope, StudioUserService){

      // Redirect to login if route requires auth and you're not logged in
      $rootScope.$on('$stateChangeStart', function (event, next) {

        if ( !StudioUserService.isAuthUser() && next.url !== '/login' ) {
          event.preventDefault(); //prevent current page from loading
          $state.go('login');
        }
      });
    }
  ]);

Studio.config([
  '$httpProvider',
  function ($httpProvider) {
    $httpProvider.interceptors.push('composerRequestInterceptor');
  }
]);

Studio.factory('composerRequestInterceptor', [
  '$q',
  '$location',
  '$cookieStore',
  function ($q, $location, $cookieStore) {
    return {
      'request': function (config) {
        var at = $cookieStore.get('accessToken');
        if (at) {
          config.headers.authorization = at;
        }
        else {
          // allow users to get to home view
          // any other navigation requires login
          if ($location.path() !== '/') {
            $location.path('/login');
          }
        }
        return config || $q.when(config);
      },
      responseError: function (rejection) {
        if (rejection.status == 401) {
          $location.path('/login');
        }
        return $q.reject(rejection);
      }
    };
  }
]);

