// Copyright StrongLoop 2014
Model.controller('ModelMainController', [
  '$scope',
  'ModelService',
  function($scope, ModelService) {
    console.log('Model Main Controller');

    $scope.models = []; // placeholder for returned promise
    $scope.models = ModelService.getAllModels(); // service wrapper call
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
    console.log('Model Instance Controller');

    var modelName = $stateParams.name;

    $scope.currModelName = {name:modelName};
    $scope.currModel = {};
    $scope.currModel.name = $scope.currModelName;

    $scope.isCollapsed = true;
    $scope.isThisCollapsed = true;

    $scope.isPropertyViewActive = true;

    $scope.togglePropertyView = function() {
      $scope.isPropertyViewActive = !$scope.isPropertyViewActive;
    };

    var models = ModelService.getAllModels();
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
//            if (!$scope.currModel.properties) {
//              $scope.currModel.properties = [];
//            }
            return;
          }

        }, log);
        //$scope.models = models;


      });

  }
]);
