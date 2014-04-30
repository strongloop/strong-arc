// Copyright StrongLoop 2014
var app = angular.module('app', [
  'ui.router',
  'ngResource',
  'ngSanitize',
  'lbServices',
  'Profile',
  'Api',
  'Auth',
  'Model',
  'Datasource',
  'ui.bootstrap',
  'ui.utils',
  'checklist-model',
  'ngGrid'
]);
app.config([
  '$httpProvider',
  function ($httpProvider) {
    $httpProvider.interceptors.push('requestInterceptor');
  }
]);
app.config([
  '$stateProvider',
  '$urlRouterProvider',

  function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider.
      state('home', {
        url: '/',
        controller: 'HomeMainController',
        templateUrl: './scripts/modules/app/templates/home.main.html'
      }).
      state('api', {
        url: '/api',
        controller: 'ApiMainController',
        templateUrl: './scripts/modules/api/templates/api.main.html'
      }).
      state('datasource', {
        url: '/datasource',
        controller: 'DatasourceMainController',
        templateUrl: './scripts/modules/datasource/templates/datasource.main.html'
      }).
      state('model', {
        url: '/model',
        controller: 'ModelMainController',
        templateUrl: './scripts/modules/model/templates/model.main.html'
      }).
      state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: './scripts/modules/profile/templates/login.html'
      }).
      state('register', {
        url: '/register',
        controller: 'RegisterController',
        templateUrl: './scripts/modules/profile/templates/register.html'
      });

  }
]);
app.factory('requestInterceptor', [
  '$q',
  '$rootScope',
  '$location',
  function ($q, $rootScope, $location) {
    return {
      'request': function (config) {
        if (window.localStorage.getItem('accessToken')) {
          config.headers.authorization = window.localStorage.getItem('accessToken');
        }
        return config || $q.when(config);
      },
      responseError: function(rejection) {
        console.log('intercepted rejection of ', rejection.config.url, rejection.status);
        if (rejection.status == 401) {
          //AppAuth.currentUser = null;
          // save the current location so that login can redirect back
          $location.nextAfterLogin = $location.path();
          $location.path('/login');
        }
        return $q.reject(rejection);
      }
    };
  }
]);











app.controller('MainNavController',[
  '$scope',
  '$location',
  function($scope, $location){

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

  }
]);
