// Copyright StrongLoop 2014
PM.service('PMAppService', [
  '$q',
  '$log',
  '$timeout',
  '$http',
  'Deployment',
  function($q, $log, $timeout, $http, Deployment) {
    var svc = this;

    var isLocalApp = true;
    var isLocalAppRunning = false;

    svc.startLocalApp = function() {
//      return $timeout(function(){
//        isLocalAppRunning = true;
//        return isLocalAppRunning;
//      },350);
      return Deployment.create({
          type: 'local'
        })
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.error('bad deploy local app: ' + error.message);
        });
    };
    svc.isLocalAppRunning = function() {

      return $timeout(function(){
        return isLocalAppRunning;
      },350);
      var reqUrl = '/process-manager/api/ServiceInstances/1/actions';
      $http.get(reqUrl);

      return $http({
        url: reqUrl,
        method: "GET",
        params: {"started":"true"}
      })
        .then(function(response) {
          $log.debug('app running request response: ' + response.data);
          return response.data;
        })
        .catch(function(error) {
          $log.error('bad is app running response: ' + error.message + ':' + error);
          return error;
        });
    };
    svc.stopLocalApp = function() {
//      return $timeout(function(){
//        isLocalAppRunning = false;
//        return isLocalAppRunning;
//      },350);
      var apiRequestPath = '/process-manager/api/ServiceInstances/1/actions';
      return $http.post(apiRequestPath,  {"request":{"cmd":"stop"}})
        .then(function(response) {
          $log.debug('stop app success: ' + response.data);
          return response.data;
        })
        .catch(function(error) {
          $log.error('stop app fail: ' + error.message + ':' + error);
          return error;
        });
    };
    svc.restartLocalApp = function() {
//      return $timeout(function(){
//        isLocalAppRunning = true;
//        return isLocalAppRunning;
//      },479);






      var apiRequestPath = '/process-manager/api/ServiceInstances/1/actions';
      return $http.post(apiRequestPath,{"request":{"cmd":"restart"}})
        .then(function(response) {
          $log.debug('Good restart: ' + response.data);
          return response.data;
        })
        .catch(function(error) {
          $log.error('bad restart: ' + error.message + ':' + error);
          return error;
        });
//      var reqUrl = '/process-manager/ServiceInstances/1/actions';
//      $http.post(reqUrl, {},
//        function(response){
//          $log.debug('Good restart: ' + reseponse);
//        },
//        function(error) {
//          $log.debug('bad restart: ' + error.message);
//
//        }
//      );
    };
/*


 POST /process-manager/ServiceInstances/1/actions

 {

 "request": {

 cmd: "restart"

 }

 }



 // is the local app running

 GET /process-manager/actions



 {

 "started": true

 }



 // what is the port of the local app

 GET /process-manager/ServerProcesses

 "listeningSockets": [...]




* */
    return svc;
  }
]);
Common.service('CommonPMServiceProcess', ['$http', '$log',
  function($http, $log) {
    return {
      find: function(serverConfig, filter) {
        var apiRequestPath = 'http://' + serverConfig.host + ':' + serverConfig.port + '/api/ServiceProcesses';
        return $http({
            url: apiRequestPath,
            method: "GET",
            params: {where:filter}
          })
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            $log.error(error.message + ':' + error);
            return error;
          });
      }
    }
  }

]);
