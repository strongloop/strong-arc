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
      appStatePollInterval: 2000
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
      // var stringX = reqUrl + '?filter=' + JSON.stringify({where: { stopReason: { neq: null } } } );

      //
      return $http.get(reqUrl)
        .then(function(response) {
          if (response.data && (response.data.length)) {
            var payload = response.data;
            loop1:
            for (var i = 0;i < payload.length;i++) {
              var pi = payload[i];
              // found a running process
              if (!pi.stopReason) {
                if (pi.listeningSockets && Array.isArray(pi.listeningSockets)) {
                  loop2:
                  for (var k = 0;k < pi.listeningSockets.length;k++) {
                    var socket = pi.listeningSockets[k];
                    // must be correct type of port (tcp4 or tcp6)
                    if (socket.addressType === 4 || socket.addressType === 6) {
                      if (socket.port) {
                        localPort = socket.port;
                        bFoundPort = true;
                        break loop1;
                      }
                    }
                  }
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
/*
 *
 * A set of services to add convenience to the user by remembering a list of
 * last used strong-pm server host/ports
 *
 * this is used in Common PID selector component help the user preserved context
 * accrsss the app modules
 *
 * currently it only shows the last successful server reference but it does store
 * each unique reference for further enhancement:
 * i.e choosing from a list of previously used host/port combos
 *
 * */
PM.service('PMHostService', [
  '$log',
  'PMServerService',
  function($log, PMServerService) {
    var svc = this;

    // test server config host value
    function checkServerConfigHost(methodName, config) {
      if (typeof config.host === 'object') {
        $log.error('found it[' + methodName + ']');
      }
      return config;
    }

    svc.getPMServers = function() {
      var pmServers = JSON.parse(window.localStorage.getItem('pmServers'));
      if (pmServers) {
        return pmServers;
      }
      return [];
    };
    svc.clearPMServers = function() {
      window.localStorage.removeItem('pmServers');
      return [];
    };
    svc.addLastPMServer = function(serverConfig) {
      checkServerConfigHost('addLastPMServer', serverConfig);
      var updatedServers = svc.getPMServers();
      updatedServers[updatedServers.length] = serverConfig;
      window.localStorage.setItem('pmServers', JSON.stringify(updatedServers));
      return updatedServers;

    };
    svc.initializeInternalPMHost = function() {
      var defaultLocalPMHostConfig = {
        host: PM_CONST.LOCAL_PM_HOST_NAME,
        port: PM_CONST.LOCAL_PM_PORT_MASK
      };
      var isExists = false; // only inject it we need to
      // determine whether or not to inject local pm reference
      var currentPMHosts = svc.getPMServers();
      if (!currentPMHosts) {
        return svc.addPMServer(defaultLocalPMHostConfig);
      }
      for (var i = 0;i < currentPMHosts.length;i++) {
        if (defaultLocalPMHostConfig.host === currentPMHosts[i].host) {
          isExists = true;
          break;
        }
      }
      if (!isExists) {
        // add to the end of the list
        svc.addLastPMServer(defaultLocalPMHostConfig);
      }
    };
    svc.addPMServer = function(serverConfig) {
      checkServerConfigHost('addPMServer', serverConfig);
      console.log('| ');
      console.log('| addPMServer: ' + JSON.stringify(serverConfig));
      console.log('| ');

      // ensure it is a valid server before adding it
      // is it a valid object
      // test the server config
      return PMServerService.find(serverConfig, {id:1})
        .then(function(response) {

          if (response.status === 200) {
            console.log('| ');
            console.log('| Server Test before saving to localstorage: ' + JSON.stringify(response));
            console.log('| ');
            checkServerConfigHost('addPMServer B', serverConfig);
            // check the list to see if it exists
            // if it does then make it the most recent
            // dont' add dup
            var pmServers = JSON.parse(window.localStorage.getItem('pmServers'));
            if (!pmServers) {
              pmServers = [];
            }
            if (serverConfig.host && serverConfig.port) {
              for (var i = 0;i < pmServers.length;i++) {
                if ((serverConfig.host === pmServers[i].host) && (serverConfig.port === pmServers[i].port)) {
                  pmServers.splice(i,1);
                  break;
                }
              }
              checkServerConfigHost('addPMServer C', serverConfig);
              pmServers.push(serverConfig);
            }
            console.log('| ');
            console.log('| Add Server To Local Storage: ' + JSON.stringify(serverConfig));
            console.log('| ');
            window.localStorage.setItem('pmServers', JSON.stringify(pmServers));
            checkServerConfigHost('addPMServer D', serverConfig);
            return serverConfig;

          }
          else {
            $log.warn('| ');
            $log.warn('| BAD GET SERVERS: [' + response.status + ']' + JSON.stringify(serverConfig));
            $log.warn('| ');
            return {};
          }



        })
        .catch(function(error) {
          $log.error('bad get server service test: ' + error.message)
        });


    };
    svc.getLastPMServer = function() {
      // get the last entry in the array
      var pmServers = JSON.parse(window.localStorage.getItem('pmServers'));

      if (pmServers) {
        var config = pmServers[pmServers.length - 1];
        console.log('|');
        console.log('|  getLastPMServer: ' + JSON.stringify(config));
        console.log('|');
        return config;
      }
      return {
        server: '',
        port: 0
      };
    };

    return svc;
  }
]);
PM.service('PMPidService', [
  '$log',
  'PMServerService',
  'PMServiceInstance',
  'PMServiceProcess',
  function($log, PMServerService, PMServiceInstance, PMServiceProcess) {

    var svc = this;

    // test server config host value
    function checkServerConfigHost(methodName, config) {
      if (typeof config.host === 'object') {
        $log.error('found it B[' + methodName + ']');
      }
      return config;
    }
    /**
     * Initial integration with strong-pm
     * - assumes first service and instance 'instance'
     * */
    // need to add logic for local pm instance
     svc.getDefaultPidData = function(serverConfig, id) {

       checkServerConfigHost('getDefaultPidData', serverConfig);

       return PMServerService.find(serverConfig, {id:id})
         .then(function(response) {
           if (!response.data.length) {
             $log.warn('no services found for id: ' + id);
             return [];
           }
           else {
             // assume first found for now
             var firstService = response.data[0];

             return PMServiceInstance.find(serverConfig, {serverServiceId: firstService.id})
               .then(function(instances) {
                 // first child
                 var firstInstance = instances[0];

                 return PMServiceProcess.find(serverConfig, {serviceInstanceId: firstInstance.id})
                   .then(function(response) {

                     //filter out dead pids
                     response = response.filter(function(process){
                       return !process.stopTime;
                     });

                     for (var i = 0;i < response.length;i++) {
                       response[i].status = 'Running';
                     }

                     return response;
                   })
                   .catch(function(error) {
                     $log.error('no service processes returned: ' + error.message);
                   });
               });
           }
         })
         .catch(function(error) {
           $log.error('no service found for id: ' + id + ' ' + error.message);
           throw error;
         });
    };

    return svc;
  }

]);


/**
 *
 * Abstractions in lieu of Angular SDK interface
 *
 * */
PM.service('PMServerService', ['$http', '$log',
  function($http, $log) {

    return {
      find: function(serverConfig, filter) {
        var baseUrl = 'http://' + serverConfig.host + ':' + serverConfig.port;
        if (serverConfig.host === PM_CONST.LOCAL_PM_HOST_NAME) {
          baseUrl = '/process-manager'
        }
        else if (serverConfig.port === PM_CONST.LOCAL_PM_PORT_MASK){
          $log.warn('invalid port - may be corruped request: ' + JSON.stringify(serverConfig));
          return [];
        }
        var apiRequestPath = baseUrl + '/api/Services';
        return $http({
          url: apiRequestPath,
          method: "GET",
          params: {where:filter}
        })
          .then(function(response) {
            return response;
          })
          .catch(function(error) {
            $log.error(error.message + ':' + error);
            return error;
          });
      }
    }
  }
]);
PM.service('PMServiceInstance', ['$http', '$log',
  function($http, $log) {
    return {
      find: function(serverConfig, filter) {
        var baseUrl = 'http://' + serverConfig.host + ':' + serverConfig.port;
        if (serverConfig.host ===  PM_CONST.LOCAL_PM_HOST_NAME) {
          baseUrl = '/process-manager'
        }
        var apiRequestPath = baseUrl + '/api/ServiceInstances';
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
PM.service('PMServiceProcess', ['$http', '$log',
  function($http, $log) {
    return {
      find: function(serverConfig, filter) {
        var baseUrl = 'http://' + serverConfig.host + ':' + serverConfig.port;
        if (serverConfig.host ===  PM_CONST.LOCAL_PM_HOST_NAME) {
          baseUrl = '/process-manager'
        }
        var apiRequestPath = baseUrl + '/api/ServiceProcesses';
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
PM.service('PMServiceMetric', [
  '$http', '$log', '$timeout',
  function($http, $log, $timeout) {
    return {
      // test server config host value
      checkServerConfigHost: function(methodName, config) {
        if (typeof config.host === 'object') {
          $log.error('found it C[' + methodName + ']');
        }
        return config;
      },
      find: function(serverConfig, filter) {
        console.log('|');
        console.log('|');
        console.log('|      PMServiceMetric: ' + JSON.stringify(serverConfig));
        console.log('|');
        console.log('|');
//        var baseUrl = 'http://' + serverConfig.host + ':' + serverConfig.port;
//        if (serverConfig.host ===  PM_CONST.LOCAL_PM_HOST_NAME) {
//          baseUrl = '/process-manager'
//        }
        // test server config host value
        this.checkServerConfigHost('PMServiceMetric', serverConfig);
        var baseUrl = 'http://' + serverConfig.host + ':' + serverConfig.port;
        if (serverConfig.host === PM_CONST.LOCAL_PM_HOST_NAME) {
          baseUrl = '/process-manager'
        }
        else if (serverConfig.port === PM_CONST.LOCAL_PM_PORT_MASK){
          $log.warn('invalid port - may be corrupted request: ' + JSON.stringify(serverConfig));
          $timeout(function() {
            return [];
          });

        }

        var apiRequestPath = baseUrl + '/api/ServiceMetrics';
        return $http({
          url: apiRequestPath,
          method: "GET",
          params: {filter:filter}
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
