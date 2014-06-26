// Copyright StrongLoop 2014
(function($) {
  $.fn.drags = function(opt) {

    opt = $.extend({handle:"",cursor:"move"}, opt);

    if(opt.handle === "") {
      var $el = this;
    } else {
      var $el = this.find(opt.handle);
    }

    return $el.css('cursor', opt.cursor).on("mousedown", function(e) {


      // make sure it is the left button before doing anything
      if (e.which === 1) {
        if(opt.handle === "") {
          var $drag = $(this).addClass('draggable');
        } else {
          var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
        }
        var originalY = $drag.offset().top;
        console.log('original y: ' + originalY);
        var z_idx = $drag.css('z-index'),
          drg_h = $drag.outerHeight(),
          drg_w = $drag.outerWidth(),
          pos_y = originalY,
          pos_x = $drag.offset().left + drg_w - e.pageX;
        $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
          var currX = e.pageX + pos_x - drg_w;
          $('.draggable').offset({
            top:originalY,
            left:currX
          }).on("mouseup", function() {
              $(this).removeClass('draggable').css('z-index', z_idx);
              console.log('mouseup y: ' + originalY);

          });
          console.log('Current Canvas X: ' + currX);
          jQuery('#CoordinateInstrumentationContainer #CanvasX').text(currX);
          var sideWidth = jQuery('[data-id="MainSidebarContainer"]').outerWidth();
          jQuery('#CoordinateInstrumentationContainer #SidebarWidth').text(sideWidth);
        });




        e.preventDefault(); // disable selection
      }



    }).on("mouseup", function() {
        if(opt.handle === "") {
          $(this).removeClass('draggable');
        } else {
          $(this).removeClass('active-handle').parent().removeClass('draggable');
        }
      });

  }
})(jQuery);

var app = angular.module('app', [
  'ui.router',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'angular-growl',
  'lbServices',
  'slServices',
  'Profile',
  'Canvas',
  'IA',
  'UI',
  'Common',
  'Property',
  'Auth',
  'Model',
  'UIForm',
  'Datasource',
  'ui.bootstrap',
  'ui.utils',
  'checklist-model',
  'ngGrid'
]);
app.config(['growlProvider', function(growlProvider) {
  growlProvider.globalTimeToLive(1800);
}]);
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
//      state('studio', {
//        url: '/studio',
//        template: '<div sl-ia-main-content></div>',
//        controller: 'IDEController'
//      }).
      state('studio', {
        url: '/studio',
        template: '<div sl-ia-main-content></div>'
      }).
      state('datasource', {
        url: '/datasource',
        controller: 'DatasourceMainController',
        templateUrl: './scripts/modules/datasource/templates/datasource.main.html'
      }).
      state('uiform', {
        url: '/uiform',
        controller: 'UIFormMainController',
        templateUrl: './scripts/modules/uiform/templates/uiform.main.html'
      }).
      state('profile', {
        url: '/profile',
        controller: 'ProfileMainController',
        templateUrl: './scripts/modules/profile/templates/profile.main.html'
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

// global autofocus
app.factory('Focus', [
  '$rootScope', '$timeout', (function($rootScope, $timeout) {
    return function(name) {
      return $timeout(function() {
        return $rootScope.$broadcast('focusOn', name);
      });
    };
  })
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
