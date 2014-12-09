// Copyright StrongLoop 2014
PM.service('PMAppService', [
  '$q',
  '$log',
  '$timeout',
  '$interval',
  '$http',
  'Deployment',
  function($q, $log, $timeout, $interval, $http, Deployment) {
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
    svc.startLocalAppPolling = function() {

      if (!isLocalApp) {
        return;
      }
      if (!isLocalAppRunning) {
        $interval(function() {
          svc.isLocalAppRunning()
            .then(function(response) {
              $log.debug('is app running: ' + response);
            })
            .catch(function(error) {
              $log.warn('bad polling for is app running');
            });
        }, 5000);
      }
    };
    svc.isLocalAppRunning = function() {

//      return $timeout(function(){
//        return isLocalAppRunning;
//      },350);


//
     var reqUrl = '/process-manager/api/ServiceInstances/1';
     return $http.get(reqUrl)
        .then(function(response) {
          // check if started = true
          if (response.data && (response.data.started === true)) {
            return true;
          }
          return false;
        })
        .catch(function(error) {
          $log.warn('[test if server is running] bad get ServiceInstance/1: ' + error.message);
          return false;
        });
    };
    svc.getLocalAppUrl = function() {

      var localPort = 80;
      var bFoundPort = false;
      var returnUrl = '';
      var reqUrl = '/process-manager/api/ServiceProcesses';
      return $http.get(reqUrl)
        .then(function(response) {
          // check for stopReason  /  stopTime first instance get the port
          if (response.data && (response.data.length)) {
            for (var i = 0;i < response.data.length;i++) {
              var pi = response.data[i];
              // found a running process
              if (!pi.stopReaseon) {
                localPort = pi.listeningSockets[0].port;
                bFoundPort = true;
                break;
              }
            }
            if (bFoundPort) {
              returnUrl = 'http://localhost:' + localPort;
            }
            else {
              $log.warn('unable to get local app url / port');
            }

          }
          return returnUrl;
        })
        .catch(function(error) {
          $log.warn('[get local port] bad get api/ServerProcesses: ' + error.message);
        });
      // test response if started = true;

//ServiceProcesses

      // check for stopReason  /  stopTime first instance get the port


    };
    svc.stopLocalApp = function() {
//      return $timeout(function(){
//        isLocalAppRunning = false;
//        return isLocalAppRunning;
//      },350);




//
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
      return $timeout(function(){
        isLocalAppRunning = true;
        return isLocalAppRunning;
      },479);






//      var apiRequestPath = '/process-manager/api/ServiceInstances/1/actions';
//      return $http.post(apiRequestPath,{"request":{"cmd":"restart"}})
//        .then(function(response) {
//          $log.debug('Good restart: ' + response.data);
//          return response.data;
//        })
//        .catch(function(error) {
//          $log.error('bad restart: ' + error.message + ':' + error);
//          return error;
//        });

    };

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
