// Copyright StrongLoop 2014
app.controller('HomeMainController',[
  '$scope',
  '$location',
  function($scope, $location){
    var viewModel = {};
    viewModel.message = 'StrongLoop API Studio';
    $scope.viewModel = viewModel;
  }
]);
app.controller('MainNavController',[
  '$scope',
  'ProfileService',
  '$location',
  function($scope, ProfileService, $location) {
    $scope.isAuthUser = function(){
      return ProfileService.getCurrentUserId();
    };
  }
]);
