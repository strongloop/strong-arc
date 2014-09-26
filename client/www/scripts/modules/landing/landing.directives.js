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
      controller: function($scope, $attrs, $log){
        $scope.list = $scope.suiteIA.apps;
        $scope.selected = $scope.suiteIA.selectedApp;

        $scope.isMenuVisible = function(){
          return $scope.isAuthUser() && $scope.suiteIA.selectedApp;
        };

      },
      link: function(scope, el, attrs){
        scope.$watch('suiteIA.apps', function(newVal, oldVal){
          scope.list = newVal;
        }, true);

        scope.$watch('suiteIA.selectedApp', function(newVal){
          scope.selected = newVal;
        }, true);

        scope.$watch('suiteIA.pageId', function(newVal){

          //clear previous page's value
          delete scope.suiteIA.selectedApp;

          //set the selected app for the page based on its pageId
          //if there's an app for it
          scope.suiteIA.apps.forEach(function(app, i){
            if (app.id === scope.suiteIA.pageId) {
                scope.suiteIA.selectedApp = app;
            }
          });

        });
      }
    }
  }
]);
