// Copyright StrongLoop 2014
Arc.controller('ArcMainController', [
  '$scope',
  'ArcUserService',
  '$log',
  '$rootScope',
  'LandingService',
  function($scope, ArcUserService, $log, $rootScope, LandingService){

    $scope.suiteIA = {
      apps: []
    };

    //set help id for app modules
    $scope.$watch('suiteIA.appId', function(newVal){
      if ( !newVal ) return;
      $rootScope.helpId = newVal;
    });

    $scope.isAuthUser = function(){
      return ArcUserService.isAuthUser();
    };

    $scope.pageClick = function($event){
      $rootScope.$broadcast('pageClick', $event);
    };

    $scope.supportAppController = false;

    LandingService.getApps().$promise
      .then(function(response) {
        var buildApp = response.results.filter(function(d) {
          return d.id === 'build-deploy';
        });

        if (buildApp.length) {
          $scope.supportAppController = buildApp[0].supportsCurrentProject;
        }
      });
}]);


Arc.controller('HomeMainController',[
  '$scope',
  '$location',
  function($scope, $location){
    var viewModel = {};
    viewModel.message = 'StrongLoop Arc';
    $scope.viewModel = viewModel;


  }
]);
/*
*
* */
Arc.controller('GlobalNavController',[
  '$scope',
  'ArcUserService',
  '$location',
  function($scope, ArcUserService, $location) {
    $scope.isAuthUser = function(){
      return ArcUserService.getCurrentUserId();
    };
  }
]);
