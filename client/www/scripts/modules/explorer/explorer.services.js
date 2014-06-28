// Copyright StrongLoop 2014
Explorer.service('ExplorerService', [
  '$resource',
  '$http',
  '$q',
  function($resource, $http, $q) {
    var svc = {};






    var resourceUrls = [
      "http://0.0.0.0:3003/api/swagger/users",
      "http://0.0.0.0:3003/api/swagger/accessTokens",
      "http://0.0.0.0:3003/api/swagger/applications",
      "http://0.0.0.0:3003/api/swagger/push",
      "http://0.0.0.0:3003/api/swagger/installations",
      "http://0.0.0.0:3003/api/swagger/notifications",
      "http://0.0.0.0:3003/api/swagger/apidefinitions",
      "http://0.0.0.0:3003/api/swagger/modeldefs",
      "http://0.0.0.0:3003/api/swagger/datasourcedefs",
      "http://0.0.0.0:3003/api/swagger/dealers",
      "http://0.0.0.0:3003/api/swagger/cars",
      "http://0.0.0.0:3003/api/swagger/reservations",
      "http://0.0.0.0:3003/api/swagger/rates"
    ];

    var promises = []
    for (var i = 0;i < resourceUrls.length;i++){
      var x = $http.get(resourceUrls[i]).then(function(response){return response});

      promises.push(x);
    }

    function getResourceData1() {

      return $http.get('http://0.0.0.0:4000/api/swagger/ModelMethods').then(function(response) {
        return response;
      });
    }
    function getResourceData2() {

      return $http.get('http://0.0.0.0:4000/api/swagger/ComponentDefinitions').then(function(response) {
        return response;
      });
    }
    svc.getEResources = function() {


      var promiseOne = getResourceData1();
      var promiseTwo = getResourceData2();


      return $q.all(promises).then(function(resultArray) {
//        var data1 = resultArray[0];
//        var data2 = resultArray[1];

        //var retVal = {}


        console.log(resultArray);

        var returnArray = [];
        for (var i = 0;i < resultArray.length;i++) {
          returnArray.push({
            path:resultArray[i].config.url,
            config:resultArray[i].data
          });
        }

        return returnArray;
//        return _.extend(data1, {
//          events: data2
//        })
      });

//      var defer = $q.defer;
//
//      $http.get('http://0.0.0.0:4000/api/swagger/ModelMethods', function(response) {
//          return defer.resolve(response);
//        },
//        function(response) {
//          console.log('bad get resources');
//        });
//
//
//
//      return defer.promise;


    };
    svc.getExplorerResources = function() {
      var resolves = ['http://0.0.0.0:4000/api/swagger/ComponentDefinitions',
        'http://0.0.0.0:4000/api/swagger/ModelDefinitions',
        'http://0.0.0.0:4000/api/swagger/ModelMethods',
        'http://0.0.0.0:4000/api/swagger/ModelRelations',
        'http://0.0.0.0:4000/api/swagger/ModelAccessControls',
        'http://0.0.0.0:4000/api/swagger/ModelProperties',
        'http://0.0.0.0:4000/api/swagger/DatabaseColumns',
        'http://0.0.0.0:4000/api/swagger/PropertyValidations',
        'http://0.0.0.0:4000/api/swagger/ViewDefinitions',
        'http://0.0.0.0:4000/api/swagger/DataSourceDefinitions'];
      var promises = [];
      var defer = $q.defer();
//      var promises = [];

//      function writeSome(arg) {
//        if (arg !== 'finish') {
//          return $http.get(arg);
//        }
//
//        console.log('write some');
//      }
////
//      function lastTask(){
//        //writeSome('finish').then( function(){
//          defer.resolve();
//       // });
//      }
//
      angular.forEach( resolves, function(value){
        var promise = $http.get(value);
        promises.push(promise);
      });
//
//      $q.all(promises).then(lastTask);
      $q.all(promises).then(function () {
        return defer.resolve();
      });
//
      return defer;


//      .then(function(data) {
//        for (var i = 0;i < data.apis.length;i++) {
//          var promise = $http.get('http://0.0.0.0:4000/api' + data.apis[i].path ).then(function (response) {
//            // The then function here is an opportunity to modify the response
//            console.log(response);
//            // The return value gets picked up by the then in the controller.
//            return response.data;
//          })
//        }
//      })

/*

 'http://0.0.0.0:3003/api/swagger/ComponentDefinitions'
 'http://0.0.0.0:3003/api/swagger/ModelDefinitions'
 'http://0.0.0.0:3003/api/swagger/ModelMethods'
 'http://0.0.0.0:3003/api/swagger/ModelRelations'
 'http://0.0.0.0:3003/api/swagger/ModelAccessControls'
 'http://0.0.0.0:3003/api/swagger/ModelProperties'
 'http://0.0.0.0:3003/api/swagger/DatabaseColumns'
 'http://0.0.0.0:3003/api/swagger/PropertyValidations'
 'http://0.0.0.0:3003/api/swagger/ViewDefinitions'
 'http://0.0.0.0:3003/api/swagger/DataSourceDefinitions'

*/


//      return [];
//      return $resource('http://0.0.0.0:4000/api/swagger/resources', {}, {
//        get:    {method: 'GET'}
//      });

     // var defer = $q.defer();

//      var promise = $http.get('http://0.0.0.0:4000/api/swagger/resources').then(function (response) {
//        // The then function here is an opportunity to modify the response
//        console.log(response);
//        // The return value gets picked up by the then in the controller.
//        return response.data;
//      });
//      // Return the promise to the controller
//      return promise;

    };

    return svc;
  }
]);
