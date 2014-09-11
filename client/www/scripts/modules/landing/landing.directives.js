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
      controller: function($scope, $attrs, LandingService, $log, $location){
        $scope.list = $scope.suiteIA.apps;
        $scope.selected = $scope.suiteIA.selectedApp;
      },
      link: function(scope, el, attrs){
        scope.$watch('suiteIA.apps', function(newVal, oldVal){
          scope.list = newVal;
        }, true);

        scope.$watch('suiteIA.selectedApp', function(newVal){
          scope.selected = newVal;
        }, true);
      }
    }
  }
]);
