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

    var defaultPMAppConfig = {
      appStatePollInterval: 750
    };
    var localAppState = {
      isLocalApp:true,
      isStarted:false,
      url:''
    };

    // async stub for future expansion
    svc.isLocalApp = function() {
      return $timeout(function() {
        return true;
      }, 25);
    };

    svc.startLocalApp = function() {
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
    svc.stopLocalApp = function() {
      var apiRequestPath = '/process-manager/api/ServiceInstances/1/actions';
      return $http.post(apiRequestPath,  {"request":{"cmd":"stop"}})
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          $log.error('stop app fail: ' + error.message + ':' + error);
          return error;
        });
    };
    svc.restartLocalApp = function() {
      var apiRequestPath = '/process-manager/api/ServiceInstances/1/actions';
      return $http.post(apiRequestPath,{"request":{"cmd":"restart"}})
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          $log.error('bad restart: ' + error.message + ':' + error);
          return error;
        });
    };
    svc.getAppStatePollInterval = function() {
      return defaultPMAppConfig.appStatePollInterval;
    };
    svc.isLocalAppRunning = function() {
      var baseUrl = '/process-manager/api/ServiceInstances';
      var reqUrl = baseUrl + '/findOne?filter={"fields":{"npmModules":false},"where":{"id":1}}';
      return $http.get(reqUrl)
        .then(function(response) {
          localAppState.isStarted = response.data.started;
          return response.data;
        })
        .catch(function(error) {
          $log.error('bad get service instances: ' + error.message);
          return error;
        });
    };

    /*
    * Get Local App Url - the app has fully deployed and started
    *
    * - find a non stopped ServiceProcess
    * - check its listeningSockets
    * */
    svc.getLocalAppUrl = function() {

      var bFoundPort = false;
      var returnUrl = '';
      var reqUrl = '/process-manager/api/ServiceProcesses';

      // still a wip to get this filter sorted out so it only returns records with
      // no stopReason property
      // var params = {filter:{where:{"stopTime": 0}}};
      // var stringX = reqUrl + '?filter=' + JSON.stringify({where: { stopReason: { eq: null } } } );

      return $http.get(reqUrl)
        .then(function(response) {
          if (response.data && (response.data.length)) {
            for (var i = 0;i < response.data.length;i++) {
              var pi = response.data[i];
              // found a running process
              if (!pi.stopReason) {
                if (pi.listeningSockets && pi.listeningSockets.length) {
                  localPort = pi.listeningSockets[0].port;
                  bFoundPort = true;
                  break;
                }
              }
            }
            if (bFoundPort) {
              returnUrl = 'http://localhost:' + localPort;
            }
          }
          return returnUrl;
        })
        .catch(function(error) {
          $log.debug('bad get app url: ' + error.message);
        });
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
