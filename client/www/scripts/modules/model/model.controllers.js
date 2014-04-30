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
        console.log('whew');

        var core = result[0];

        var log = [];
        var models = [];
        angular.forEach(core, function(value, key){
          this.push(key + ': ' + value);
          models.push({name:key,props:value});
        }, log);




        $scope.models = models;


      });

//
//
//
//    var promise = ModelService.getAllModels();
//
//    promise.
//
//    ModelService.getAllModels({},function(response) {
//      console.log('yay');
//        $scope.models = response;
//      },
//      function(response){
//        console.log('bad get modesl');
//      }
//    );

//    promise.then(function(data) {
//        console.log('|  -  | model servjce response: ' + data);
//        $scope.models = data;
//      }
//    );

//      $scope.models = ModelService.getAllModels(
//        function(response) {
//          $scope.models = response.data;
//        },
//        function(response) {
//          console.log('bad get modeldefs');
//        }
//      );




//      $scope.myModels = log;
//      $scope.modelNames = models;
//    });
  }
]);
