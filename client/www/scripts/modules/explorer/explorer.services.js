// Copyright StrongLoop 2014
Explorer.service('ExplorerService', [
  '$resource',
  '$http',
  '$q',
  function($resource, $http, $q) {
    var svc = {};





    var resourceUrls = [
      "/api/swagger/users",
      "/api/swagger/accessTokens",
      "/api/swagger/applications",
      "/api/swagger/push",
      "/api/swagger/installations",
      "/api/swagger/notifications",
      "/api/swagger/apidefinitions",
      "/api/swagger/modeldefs",
      "/api/swagger/datasourcedefs",
      "/api/swagger/dealers",
      "/api/swagger/cars",
      "/api/swagger/reservations",
      "/api/swagger/rates"
    ];


    var promises = []
    for (var i = 0;i < resourceUrls.length;i++){
      var x = $http.get(resourceUrls[i]).then(function(response){return response});

      promises.push(x);
    }

    // the following is marked for deletion
    function getResourceData1() {
//
//      return $http.get('http://0.0.0.0:3003/api/swagger/ModelMethods').then(function(response) {
//        return response;
//      });
      return [];
    }
    function getResourceData2() {
//
//      return $http.get('http://0.0.0.0:3003/api/swagger/ComponentDefinitions').then(function(response) {
//        return response;
//      });
      return [];
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

    svc.xApiRequest = function(reqObj) {
    //  var defer = $q.defer;
      if (reqObj.method && reqObj.path) {
        delete reqObj.data.id;


        var defer = $q.defer;



        var config = {
          method: reqObj.method,
          url: '/api' + reqObj.path,
          data: reqObj.data
        };
        return $http(config).
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log('Good api request' + data);
           // defer.resolve(data);
            return data;
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('Bad api request' + data);
            defer.reject(data);
          });
        return defer.promise;

      }



    };

    return svc;
  }
]);
