// Application Constants
var CONST = {
  NEW_MODEL_PRE_ID: 'sl.temp.new-model',
  NEW_MODEL_NAME: 'newModel',
  NEW_MODEL_FACET_NAME: 'common',
  NEW_MODEL_BASE: 'PersistedModel',
  NEW_DATASOURCE_PRE_ID: 'sl.temp.new-datasource',
  NEW_DATASOURCE_NAME: 'newDatasource',
  NEW_DATASOURCE_FACET_NAME: 'server',
  DATASOURCE_TYPE: 'datasource',
  DEFAULT_DATASOURCE: 'db',
  NULL_DATASOURCE: 'none',
  DEFAULT_DATASOURCE_BASE_MODEL: 'PersistedModel',
  MODEL_TYPE: 'model',
  APP_FACET: 'server',
  APP_RUNNING_CHECK_INTERVAL:  18000,
  SEGMENTIO_WRITE_KEY: '8ImiW2DX0W',
  NON_ARC_MODULES: ['home', 'login', 'register']
};

var Arc = angular.module('Arc', [
  'ui.router',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'nvd3',
  'angularSpinner',
  'ngCookies',
  'angular-growl',
  'lbServices',
  'ArcServices',
  'BuildDeployAPI',
  'ArcUserAuthFactory',
  'Composer',
  'Profiler',
  'ArcUser',
  'IA',
  'PM',
  'Common',
  'Property',
  'Discovery',
  'Explorer',
  'Model',
  'Landing',
  'Styleguide',
  'BuildDeploy',
  'Metrics',
  'Manager',
  'UI',
  'Datasource',
  'ui.bootstrap',
  'ui.utils',
  'ui.slider',
  'checklist-model',
  'ngGrid',
  'angularFileUpload',
  'segmentio'
]);

Arc.value('CONST', CONST);

Arc.config([
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
      .state('metrics', {
        url: '/metrics',
        templateUrl: './scripts/modules/metrics/templates/metrics.main.html',
        controller: 'MetricsMainController'
      })
      .state('process-manager', {
        url: '/process-manager',
        templateUrl: './scripts/modules/manager/templates/manager.main.html',
        controller: 'ManagerMainController'
      })
      .state('composer', {
        url: '/composer',
        templateUrl: './scripts/modules/composer/templates/composer.main.html',
        controller: 'ComposerMainController',
        resolve: {
          // Wait for all metadata requests to finish
          'ArcMetadataResults': [
            'modelPropertyTypes',
            'connectorMetadata',
            '$q',
            function waitForAllArcMetadata(modelPropertyTypes,
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
      .state('build-deploy', {
        url: '/build-deploy',
        templateUrl: './scripts/modules/build-deploy/templates/build-deploy.main.html',
        controller: 'BuildDeployController'
      })
      .state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: './scripts/modules/arc-user/templates/login.html'
      })
      .state('register', {
        url: '/register',
        controller: 'RegisterController',
        templateUrl: './scripts/modules/arc-user/templates/register.html'
      })
      .state('styleguide', {
        url: '/styleguide',
        controller: 'StyleguideController',
        templateUrl: './scripts/modules/styleguide/templates/styleguide.main.html'
      });

  }
]);

Arc.run([
    '$location',
    '$state',
    '$rootScope',
    'ArcUserService',
    'segmentio',
    function($location, $state, $rootScope, ArcUserService, segmentio){
      // finish initialization of segment.io analytics.js
      if (window.analytics && window.analytics.load) {
        window.analytics.load(CONST.SEGMENTIO_WRITE_KEY);
        window.analytics.page();
      }

      // Redirect to login if route requires auth and you're not logged in
      $rootScope.$on('$stateChangeStart', function (event, next) {

        if ( !ArcUserService.isAuthUser() && next.url !== '/login' ) {
          event.preventDefault(); //prevent current page from loading
          $state.go('login');
        } else {
          //fire off segment.io identify from cookie values
          segmentio.identify(ArcUserService.getCurrentUserId(), {
            name : ArcUserService.getCurrentUsername(),
            email : ArcUserService.getCurrentUserEmail()
          });
          //fire off segment.io event on module invocation and ignore home, login, register
          if (!_.contains(CONST.NON_ARC_MODULES, next.name)) {
            segmentio.track(next.name);
          }
        }
      });


    }
  ]);

Arc.config([
  '$httpProvider',
  function ($httpProvider) {
    $httpProvider.interceptors.push('arcRequestInterceptor');
  }
]);

Arc.factory('arcRequestInterceptor', [
  '$q',
  '$location',
  '$cookieStore',
  function ($q, $location, $cookieStore) {
    function isLocal(url, host){
      var isLocal = false;

      if ( url.indexOf('./') === 0 || url.indexOf('/') === 0 ) {
        isLocal = true;
      } else if ( url.indexOf(host) > -1 ) {
        isLocal = true;
      }

      return isLocal;
    }

    return {
      'request': function (config) {
        var at = $cookieStore.get('accessToken');
        if (at) {
          if ( isLocal(config.url, $location.host()) ) {
            config.headers.authorization = at;
          } else {
            delete config.headers.authorization;
          }
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

