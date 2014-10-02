// Copyright StrongLoop 2014
Landing.directive('slLandingApp', [
  function () {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/landing/templates/landing.app.html'
    };
  }
]);


Landing.directive('slAppSelector', [
  function(){
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/landing/templates/landing.app.selector.html',
      controller: function($scope, $attrs, $log, $rootScope, $location, LandingService){

        $scope.list = $scope.suiteIA.apps;
        $scope.selected = $scope.suiteIA.selectedApp;

        LandingService.getApps()
          .then(function(data){
            $scope.suiteIA.apps = data;
            //todo if we have multiple pages w/in an app
            //we need to parse out just the base route like /studio/foo -> 'studio'
            $scope.suiteIA.appId = $location.path().replace(/^\//, '');
          });


        $scope.isMenuVisible = function(){
          return $scope.isAuthUser() && $scope.suiteIA.selectedApp;
        };

        //update page id when changing states
        $rootScope.$on('$stateChangeStart',
          function(event, toState, toParams, fromState, fromParams){
            $scope.suiteIA.appId = toState.name;
          });
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
