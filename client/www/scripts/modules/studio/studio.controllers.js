// Copyright StrongLoop 2014
Studio.controller('StudioMainController', [
  '$scope',
  'StudioUserService',
  '$location', function($scope, StudioUserService){

    $scope.suiteIA = {
      apps: []
    };

    $scope.isAuthUser = function(){
      return StudioUserService.isAuthUser();
    };
}]);


Studio.controller('HomeMainController',[
  '$scope',
  '$location',
  function($scope, $location){
    var viewModel = {};
    viewModel.message = 'StrongLoop Studio';
    $scope.viewModel = viewModel;


  }
]);
/*
*
* */
Studio.controller('GlobalNavController',[
  '$scope',
  'StudioUserService',
  '$location',
  function($scope, StudioUserService, $location) {
    $scope.isAuthUser = function(){
      return StudioUserService.getCurrentUserId();
    };
  }
]);



