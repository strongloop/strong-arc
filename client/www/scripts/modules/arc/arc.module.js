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
  NON_ARC_MODULES: ['home', 'login', 'register'],
  NON_ARC_MODULES_WITH_HELP_ID: ['licenses']
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
  'Tracing',
  'TracingViz',
  'ArcUser',
  'IA',
  'PM',
  'Common',
  'Property',
  'Discovery',
  'Explorer',
  'Model',
  'Landing',
  'Licenses',
  'Styleguide',
  'BuildDeploy',
  'Metrics',
  'ApiAnalytics',
  'Manager',
  'UI',
  'Datasource',
  'ui.bootstrap',
  'ui.utils',
  'ui.slider',
  'checklist-model',
  'ngGrid',
  //'angularFileUpload',
  'ngFileUpload',
  'segmentio',
  'angularMoment'
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
      .state('api-analytics', {
        url: '/api-analytics',
        templateUrl: './scripts/modules/api-analytics/templates/api.analytics.main.html',
        controller: 'ApiAnalyticsController'
      })
      .state('process-manager', {
        url: '/process-manager',
        templateUrl: './scripts/modules/manager/templates/manager.main.html',
        controller: 'ManagerMainController'
      })
      .state('tracing', {
        url: '/tracing',
        templateUrl: './scripts/modules/tracing/templates/tracing.main.html',
        controller: 'TracingMainController'
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
      .state('login-redirect', {
        url: '/login?ref',
        controller: 'LoginController',
        templateUrl: './scripts/modules/arc-user/templates/login.html',
        resolve: {
          referrer: ['$stateParams', function($stateParams){
            return $stateParams.ref;
          }]
        }
      })
      .state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: './scripts/modules/arc-user/templates/login.html',
        resolve: {
          referrer: ['$stateParams', function($stateParams){
            return $stateParams.ref;
          }]
        }
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
      })
      .state('licenses', {
        url: '/licenses',
        controller: 'LicensesMainController',
        templateUrl: './scripts/modules/licenses/templates/licenses.main.html'
      });
  }
]);

Arc.run([
    '$location',
    '$state',
    '$rootScope',
    '$log',
    '$q',
    '$http',
    'ArcUserService',
    'LicensesService',
    'segmentio',
    function($location, $state, $rootScope, $log, $q, $http, ArcUserService, LicensesService, segmentio){
      // finish initialization of segment.io analytics.js
      if (window.analytics && window.analytics.load) {
        window.analytics.load(CONST.SEGMENTIO_WRITE_KEY);
        window.analytics.page();
      }

      $rootScope.$on('$stateChangeSuccess', function(){
        $rootScope.$emit('dismissMessage');
      });

      // Redirect to login if route requires auth and you're not logged in
      $rootScope.$on('$stateChangeStart', function (event, next) {
        function isAppModule(url){
          return LicensesService.getArcFeatures()
            .then(function(arcFeatures){
              return _.contains(arcFeatures, url.substr(1)); //remove '/' off page url
            });
        }

        function handleStateChange(){
          if ( !ArcUserService.isAuthUser() ) {
            if ( next.url.indexOf('/login') === -1 ) {
              event.preventDefault(); //prevent current page from loading
              $state.go('login-redirect', { ref: next.name });
            }
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
        }

        //set help id if page isn't an arc module
        if (_.contains(CONST.NON_ARC_MODULES_WITH_HELP_ID, next.name ) ) {
          $rootScope.helpId = next.name;
        } else {
          $rootScope.helpId = null;
        }

        isAppModule(next.url)
          .then(function(isApp){
            if ( isApp ) {
              return LicensesService.validateLicenses(next.url)
                .then(handleStateChange);
              //.catch(logoutWithMessage);
            }

            handleStateChange();
          });
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
  '$log',
  '$cookieStore',
  function ($q, $location, $log, $cookieStore) {
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
          if (
            isLocal(config.url, $location.host()) ||
            config.url.indexOf('auth2.strongloop.com/api') > -1
          ) {
            config.headers.authorization = at;
          } else {
            delete config.headers.authorization;
          }
        }
        else {
          // allow users to get to home view
          // any other navigation requires login
          if ($location.path() !== '/') {
            //$location.path('/login');
          }
        }
        return config || $q.when(config);
      },
      responseError: function (rejection) {
        if (rejection.status == 401) {
          //$location.path('/login');
        }
        return $q.reject(rejection);
      }
    };
  }
]);
