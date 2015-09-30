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
  'growl',
  '$timeout',
  'PMServerService',
  'ManagerServices',
  function($log, growl, $timeout, PMServerService, ManagerServices) {
    var svc = this;

    svc.getPMServers = function(opts) {
      opts = opts || {};

      return ManagerServices.getManagerHosts(function(hosts) {
          return hosts;
        });
    };
    svc.clearPMServers = function() {
      window.localStorage.removeItem('pmServers');
      return [];
    };
    svc.addLastPMServer = function(serverConfig) {
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
    svc.addPMServer = function(serverConfig, doTest) {

      if (!doTest) {
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
          pmServers.push(serverConfig);
        }
        window.localStorage.setItem('pmServers', JSON.stringify(pmServers));
        $timeout(function() {
          return serverConfig;

        });
      }
      else {
        // ensure it is a valid server before adding it
        // is it a valid object
        // test the server config
        return PMServerService.find(serverConfig, {id:1})
          .then(function(response) {

            if (response.status === 200) {
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
                pmServers.push(serverConfig);
              }
              window.localStorage.setItem('pmServers', JSON.stringify(pmServers));
              return serverConfig;
            }
            else {
              $log.warn('invalid PM Host value: ' + JSON.stringify(serverConfig));
              growl.addWarnMessage('invalid PM Host value: ' + JSON.stringify(serverConfig), {ttl:2200})
              return {};
            }
          })
          .catch(function(error) {
            $log.error('bad get server service test: ' + error.message)
          });
      }
    };
    svc.getPMClient = function(host, port){
      var Client = require('strong-mesh-models').Client;
      var client = new Client('http://' + host + ':' + port);

      return client;
    };
    svc.getFirstPMInstance = function(pmHost, cb) {
      var PMClient = require('strong-mesh-models').Client;
      var pm = new PMClient('http://' + pmHost.host + ':' + pmHost.port );

        pm.instanceFind('1', function(err, instance) {
          if (err) {
            $log.warn('trace: error finding pm instance: ' + err.message);
            return cb(err, null);
          }
          if (!instance){
            $log.warn('trace: no instance returned: http://' + pmHost.host + ':' + pmHost.port );
            return cb({message:'no instance returned'}, null);
          }

          return cb(null, instance);

        });
    };
    svc.getLatestPMServer = function(cb) {
      // get the last entry in the array
      //var pmServers = JSON.parse(window.localStorage.getItem('pmServers'));
      if (!cb) {
        $log.warn('CB is not a function');
        return;
      }

      return ManagerServices.getManagerHosts(function(hosts) {
        if (!hosts) {
          return cb({});
        }
        return cb(hosts[0]);
      });

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

    /**
     * Initial integration with strong-pm
     * - assumes first service and instance 'instance'
     * */
    // need to add logic for local pm instance
     svc.getDefaultPidData = function(serverConfig, id) {

       return PMServerService.findById(serverConfig, id)
         .then(function(response) {
           if (!response.data || !response.data.length) {
             $log.warn('no services found for id: ' + id);
             return [];
           }

           // assume first found for now
           var firstService = response.data[0];

             return PMServiceInstance.findById(serverConfig, firstService.id)
               .then(function(instances) {
                 // first child
                 var firstInstance = instances[0];

                 return PMServiceProcess.find(serverConfig, {serviceInstanceId: firstInstance.id})
                   .then(function(response) {

                     //filter out dead pids and supervisor
                     response = response.filter(function(process){
                       return (!process.stopTime && (process.workerId !== 0));
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
          $log.warn('invalid port - may be corrupted request: ' + JSON.stringify(serverConfig));
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
      },
      findById: function(serverConfig, id) {
        var baseUrl = 'http://' + serverConfig.host + ':' + serverConfig.port;
        if (serverConfig.host === PM_CONST.LOCAL_PM_HOST_NAME) {
          baseUrl = '/process-manager'
        }
        else if (serverConfig.port === PM_CONST.LOCAL_PM_PORT_MASK){
          $log.warn('invalid port - may be corrupted request: ' + JSON.stringify(serverConfig));
          return [];
        }
        var apiRequestPath = baseUrl + '/api/Services';
        return $http({
          url: apiRequestPath,
          method: "GET",
          params: id
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
      },
      findById: function(serverConfig, id) {
        var baseUrl = 'http://' + serverConfig.host + ':' + serverConfig.port;
        if (serverConfig.host ===  PM_CONST.LOCAL_PM_HOST_NAME) {
          baseUrl = '/process-manager'
        }
        var apiRequestPath = baseUrl + '/api/ServiceInstances';
        return $http({
          url: apiRequestPath,
          method: "GET",
          params: id
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
      },
      capabilities: function(serverConfig, processId) {
        if (serverConfig && serverConfig.host && serverConfig.port) {
          var baseUrl = 'http://' + serverConfig.host + ':' + serverConfig.port;
          if (serverConfig.host ===  PM_CONST.LOCAL_PM_HOST_NAME) {
            baseUrl = '/process-manager'
          }
          var apiRequestPath = baseUrl + '/api/ServiceProcesses/' + processId + '/queryCapabilities/';
          return $http({url: apiRequestPath, method: 'GET'})
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              $log.error(error.message + ':' + error);
              return error;
            });
        }

      }
    };
  }

]);
PM.service('PMServiceMetric', [
  '$http', '$log', '$timeout',
  function($http, $log, $timeout) {
    return {
      find: function(serverConfig, filter) {
        // test server config host value
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
