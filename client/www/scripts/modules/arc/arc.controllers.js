// Copyright StrongLoop 2014
Arc.controller('ArcMainController', [
  '$scope',
  'ArcUserService',
  '$location', function($scope, ArcUserService){

    $scope.suiteIA = {
      apps: []
    };

    $scope.isAuthUser = function(){
      return ArcUserService.isAuthUser();
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



