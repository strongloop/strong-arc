// Copyright StrongLoop 2014
Canvas.controller('CanvasMainController', [
  '$scope',
  'ModelService',
  function($scope, ModelService) {

    $scope.models = [];
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
