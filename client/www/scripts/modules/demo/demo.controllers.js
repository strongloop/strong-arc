// Copyright StrongLoop 2014
Demo.controller('DemoMainController', [
  '$scope',
  '$stateParams',
  '$http',
  'ModelService',
  function($scope, $stateParams, $http, ModelService) {
    console.log('Demo Main Controller');
    $scope.modelRef = $stateParams.modelName;
    $scope.curFormData = {};

    if ($scope.modelRef) {
      console.log('DEMO THIS MODEL: ' + $scope.modelRef);
    }
    $scope.demoModelChanged = function(name) {
      console.log('change the model: ' + name);
      $scope.modelRef = name;
    };

    $scope.demoRestApiRequest = function(requestObj) {
      console.log('demo rest request:  ' + JSON.stringify(requestObj));
      var config = {
        method: requestObj.method,
        url: requestObj.path + requestObj.endPoint + 's'
      };
      if (requestObj.id) {


          config.url = config.url + '/' + requestObj.id;


      }
      if (requestObj.data) {
        config.data = requestObj.data;
      }



      $http(config).
        success( function(response) {
          console.log('good demo rest call: ' + response);
          $scope.loadModelData($scope.modelRef);
          $scope.curFormData = {};

        }).
        error(function(response) {
          console.log('bad demo rest call: ' + response);
        });
    };
    $scope.loadModelData = function(modelRef) {
      var config = {
        method: 'GET',
        url: '/api/' + modelRef +'s'
      };
//          if (isPayloadTypeRequest(requestObj)) {
//            config.data = requestObj.data;
//          }



      $http(config).
        success( function(response) {
          $scope.colDefs = [];
          $scope.modelData = response;

          if (response.length > 0) {
            var defRow = response[0];
            angular.forEach(defRow, function(value, key){
              $scope.colDefs.push({field:key,displayName:key});
            });
            $scope.colDefs.push({field: '', cellTemplate: '<button class="btn btn-sm btn-default" ng-click="demoEdit(row)">Edit</button>'});
            $scope.colDefs.push({field: '', cellTemplate: '<button class="btn btn-sm btn-default" ng-click="demoDelete(row)">Delete</button>'});
          }

        }).
        error(function(response) {
          console.warn('bad demo rest get request ');

        });
      };

  }
]);
