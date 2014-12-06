// Copyright StrongLoop 2014
PM.service('PMAppService', [
  '$log',
  'Deployment',
  function($log, Deployment) {
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

    };
    svc.stopLocalApp = function() {

    };
    svc.restartLocalApp = function() {

    };

    return this;
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
