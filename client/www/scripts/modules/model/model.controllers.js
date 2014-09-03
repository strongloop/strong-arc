// Copyright StrongLoop 2014
/*
*
*   Model Editor Main Controller
*
* */
Model.controller('ModelEditorMainController', [
  '$scope',
  'ModelService',
  'IAService',
  function($scope, ModelService, IAService) {

    $scope.activeModel = {
      name: IAService.getActiveModelInstance().name
    };
  }
]);
Model.controller('ModelMainController', [
  '$scope',
  'ModelService',
  function($scope, ModelService) {

    $scope.models = []; // placeholder for returned promise
    $scope.models = ModelService.getAllModelInstances(); // service wrapper call
    $scope.models.$promise.
      then(function (result) {
        var ctx = [];
        var models = []; // temp array to build nav collection
        angular.forEach(result[0], function(value, key){
          this.push(key + ': ' + value);
          models.push({name:key,props:value}); // add named object to array
        }, ctx);
        $scope.models = models; // assign to scope variable for rendering
      }
    );
  }
]);
Model.controller('ModelInstanceController', [
  '$scope',
  '$state',
  '$stateParams',
  'ModelService',
  function($scope, $state, $stateParams, ModelService) {

    var modelName = $stateParams.name;

    $scope.currModelName = {name:modelName};
    $scope.currModel = {};
    $scope.currModel.name = $scope.currModelName;

    $scope.isCollapsed = false;
    $scope.isThisCollapsed = true;

    $scope.isPropertyViewActive = true;

    $scope.togglePropertyView = function() {
      $scope.isPropertyViewActive = !$scope.isPropertyViewActive;
    };
    $scope.updatePropertyDoc = function(a) {
    };

    var models = ModelService.getAllModelInstances();
    models.$promise.
      then(function (result) {
        var core = result[0];
        var log = [];
        var models = [];
        angular.forEach(core, function(value, key){
         // this.push(key + ': ' + value);
          if (key === modelName){
            $scope.currModel = value;
            $scope.currModel.name = modelName;

            return;
          }

        }, log);


      });

  }
]);
