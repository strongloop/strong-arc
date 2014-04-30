// Copyright StrongLoop 2014
Api.controller('ApiMainController', [
  '$scope',
  'ApiService',
  'ProfileService',
  function($scope, ApiService, ProfileService) {
    console.log('Api Main Controller');

    $scope.isAllowNewApi = function() {
      var retVar = ProfileService.isAuthUser();
     // $scope.isNewApiButtunDisabled = retVar;
      return retVar;
    };

    $scope.isNewApiButtonDisabled = function() {
      if (ProfileService.isAuthUser()){
        return false;
      }
      return 'disabled';
    };

    $scope.currentApi = {};
    $scope.apis = ApiService.getAllApis();
    $scope.isShowApiForm = false;
    $scope.isHideNewApiButton = false;

    $scope.addNewApi = function() {
      $scope.isShowApiForm = true;
      $scope.isHideNewApiButton = true;
    };
    $scope.saveApi = function(apiObj) {
      var x = apiObj;
      var nameString = window.S(x.display).collapseWhitespace().s;
      nameString = window.S(nameString).camelize().s;
      apiObj.name = nameString;
      apiObj.apiKey = ProfileService.getCurrentUserId();
      apiObj.userId = ProfileService.getCurrentUserId();
      console.log(JSON.stringify(apiObj));
      //return ApiService.createApi(apiObj);
    };
    $scope.closeApiForm = function() {
      $scope.isShowApiForm = false;
      $scope.isHideNewApiButton = false;
    };
  }
]);
