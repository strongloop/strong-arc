// Copyright StrongLoop 2014
dnd.controller('HomeMainController',[
  '$scope',
  '$location',
  function($scope, $location){
    var viewModel = {};
    viewModel.message = 'StrongLoop API Studio';
    $scope.viewModel = viewModel;
  }
]);
dnd.controller('MainNavController',[
  '$scope',
  'ProfileService',
  '$location',
  function($scope, ProfileService, $location) {
    $scope.isAuthUser = function(){
      return ProfileService.getCurrentUserId();
    };
  }
]);
dnd.controller('DragDropCtrl', function($scope) {
  $scope.handleDrop = function() {
    console.log('Item has been dropped');
  }
});
