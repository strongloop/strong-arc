// Copyright StrongLoop 2014
Explorer.service('ExplorerService', [
  '$resource',
  '$http',
  function($resource, $http) {
    var svc = {};

    svc.getExplorerResources = function() {

//      return [];
//      return $resource('http://0.0.0.0:4000/api/swagger/resources', {}, {
//        get:    {method: 'GET'}
//      });

      var promise = $http.get('http://0.0.0.0:4000/api/swagger/resources').then(function (response) {
        // The then function here is an opportunity to modify the response
        console.log(response);
        // The return value gets picked up by the then in the controller.
        return response.data;
      });
      // Return the promise to the controller
      return promise;

    };

    return svc;
  }
]);
