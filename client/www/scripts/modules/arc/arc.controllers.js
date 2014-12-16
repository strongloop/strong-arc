// Copyright StrongLoop 2014
Arc.controller('ArcMainController', [
  '$scope',
  'ArcUserService',
  '$log',
  '$rootScope',
  function($scope, ArcUserService, $log, $rootScope){

    $scope.suiteIA = {
      apps: []
    };

    $scope.isAuthUser = function(){
      return ArcUserService.isAuthUser();
    };

    $scope.pageClick = function($event){
      $rootScope.$broadcast('pageClick', $event);
    };
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



