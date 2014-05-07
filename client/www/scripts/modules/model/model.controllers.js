// Copyright StrongLoop 2014
Model.controller('ModelMainController', [
  '$scope',
  'ModelService',
  function($scope, ModelService) {
    console.log('Model Main Controller');

   // $scope.models = ModelService.getAllModels();
    $scope.models = [];


    $scope.models = ModelService.getAllModels({});
    $scope.models.$promise.
      then(function (result) {

        var core = result[0];

        var log = [];
        var models = [];
        angular.forEach(core, function(value, key){
          this.push(key + ': ' + value);
          models.push({name:key,props:value});
        }, log);
        $scope.models = models;


      });


  }
]);
