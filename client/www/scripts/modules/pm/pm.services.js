// Copyright StrongLoop 2014
PM.service('PMAppService', [
  '$log',
  '$http',
  'Deployment',
  function($log, $http, Deployment) {
    var svc = this;

    svc.startLocalApp = function() {
      Deployment.create({
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

      var reqUrl = '/process-manager/actions';
      $http.get(reqUrl);

      return $http({
        url: reqUrl,
        method: "GET",
        params: {"cmd":"restart"}
      })
        .then(function(response) {
          $log.debug('Good restart: ' + response.data);
          return response.data;
        })
        .catch(function(error) {
          $log.error(error.message + ':' + error);
          return error;
        });
    };
    svc.stopLocalApp = function() {

    };
    svc.restartLocalApp = function() {
      var apiRequestPath = '/process-manager/ServiceInstances/1/actions';
      return $http({
          url: apiRequestPath,
          method: "POST",
          params: {"request":{"cmd":"restart"}}
        })
        .then(function(response) {
          $log.debug('Good restart: ' + response.data);
          return response.data;
        })
        .catch(function(error) {
          $log.error(error.message + ':' + error);
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
