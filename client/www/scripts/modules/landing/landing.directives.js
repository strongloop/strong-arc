// Copyright StrongLoop 2014
Landing.directive('slLandingApp', [
  '$log',
  function ($log) {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/landing/templates/landing.app.html'
    };
  }
]);

// Copyright StrongLoop 2014
Landing.directive('slLandingAppPlaceholder', [
  function () {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/landing/templates/landing.app.placeholder.html'
    };
  }
]);


Landing.directive('slAppSelector', ['$log',
  function($log){
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/landing/templates/landing.app.selector.html',
      controller: function($scope, $attrs, $log, $rootScope, $location, LandingService){

        $scope.list = $scope.suiteIA.apps;
        $scope.selected = $scope.suiteIA.selectedApp;

        LandingService.getApps()
          .$promise
          .then(function(data){
            $scope.suiteIA.apps = data.results.filter(function(app) {
              return !app.disabled && app.supportsCurrentProject;
            });

            //todo if we have multiple pages w/in an app
            //we need to parse out just the base route like /arc/foo -> 'arc'
            $scope.suiteIA.appId = $location.path().replace(/^\//, '');
          });


        $scope.isMenuVisible = function(){
          return $scope.isAuthUser() && ( $scope.suiteIA.selectedApp || $location.path().indexOf('/licenses') === 0 );
        };

        function getDTName(studioName) {
          var retVal = 'profiles';
          if (studioName === 'metrics') {
            retVal = 'timeline';
          }
          return retVal;
        }

        //update page id when changing states
        $rootScope.$on('$stateChangeStart',
          function(event, toState, toParams, fromState, fromParams){
            var isValidApp = $scope.suiteIA.apps.filter(function(app){
              return app.id == toState.name;
            }).length;

            $scope.suiteIA.appId = !!isValidApp ? toState.name : null;

            var dtName = getDTName(toState.name);
            window.localStorage.setItem('lastActiveDTPanel', dtName);
          });

        $scope.getSref = function(app) {
          return app.supportsCurrentProject ? app.id : false;
        }
      },
      link: function(scope, el, attrs){
        scope.$watch('suiteIA.apps', function(newVal, oldVal){
          scope.list = newVal;
        }, true);

        scope.$watch('suiteIA.selectedApp', function(newVal){
          scope.selected = newVal;
        }, true);

        scope.$watch('suiteIA.appId', function(newVal){

          //clear previous page's value
          delete scope.suiteIA.selectedApp;

          //set the selected app for the page based on its pageId
          //if there's an app for it
          scope.suiteIA.apps.forEach(function(app, i){
            if (app.id === scope.suiteIA.appId) {
                scope.suiteIA.selectedApp = app;
            }
          });

        });
      }
    }
  }
]);
