// Copyright StrongLoop 2014
Demo.controller('DemoMainController', [
  '$scope',
  '$stateParams',
  '$http',
  function($scope, $stateParams, $http) {
    console.log('Demo Main Controller');
    $scope.modelRef = $stateParams.modelName;
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

        }).
        error(function(response) {
          console.log('bad demo rest call: ' + response);
        });
    }
  }
]);
