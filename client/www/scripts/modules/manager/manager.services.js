Manager.service('ManagerServices', [
  '$log',
  '$http',
  '$location',
  'LicensesService',
  function($log, $http, $location, LicensesService) {

    var svc = this;

    /*
    *
    * Get Manager Hosts
    *
    * */
    svc.getHostServers = function() {
      var servers = JSON.parse(window.localStorage.getItem('hostServers'));
      if (servers) {
        return servers;
      }
      return [];

    };
    /*
    *
    * Process Host Status
    *
    * */
    svc.processHostStatus = function(host, appCtx) {
      host.status = {
        isProblem: true,
        isActive: false,
        isInactive: false,
        display: 'Problem',
        actionLabel: 'Activate',
        problem: {
          title: '',
          description: ''
        }
      };

      // is there an exception present

      /*
       * non exception problem states
       *
       * - app is failing to start but pm is continuing to try to start app
       * - the wrong app is running
       * - the app is not running on the pm (it has been stopped)
       *
       * */
      /*
       *
       *
       * Exception Present
       *
       *
       * */
      if (host.errorType) {

        $log.warn('error-type: ' + host.errorType);
        // connection
        // - connection refused
        // - connection timeout
        switch(host.errorType) {
          case 'connection': {

            switch (host.error.message) {

              case 'getaddrinfo ENOTFOUND':
                host.status.problem.title = 'No PM Host Server';
                host.status.problem.description = 'There does not seem to be a server at this address';

                break;

              case 'connect ECONNREFUSED':
                host.status.problem.title = 'No Server';
                host.status.problem.description = 'There was no response from this address. Confirm the server has been provisioned as is currently running at the address.';

                break;

              case 'connect ENETDOWN':

                host.status.problem.title = 'connect ENETDOWN';
                host.status.problem.description = 'connect ENETDOWN';

                break;

              default:
                host.status.problem.title = 'connection error';
                host.status.problem.description = host.error.message;

            }

            break;
          }
          case 'invalid': {
            if (host.error.message.indexOf('Unknown "ServiceInstance"') !== -1){
              host.status.display = 'No App';
              host.status.isProblem = false;
              host.status.isNoApp = true;
              host.status.isActive = true;
              host.status.isInactive = false;
              host.status.problem.title = 'No Application Found';
              host.status.problem.description = 'If it is a new host try deploying an app to it via Arc or the command line.';
            }
            else {
              host.status.problem.title = 'exception: ' + host.errorType;
              host.status.problem.description = host.error.message;
            }

            break;
          }
          case 'unknown': {
            if (host.error.message && host.error.message.indexOf('ETIMEDOUT') !== -1){
              host.status.isProblem = true;
              host.status.isNoApp = false;
              host.status.isActive = false;
              host.status.isInactive = false;
              host.status.problem.title = 'Request Timeout';
              host.status.problem.description = 'Check the status of the host to make sure it is up.';
            }
            else {
              host.status.problem.title = 'exception: ' + host.errorType;
              host.status.problem.description = host.error.message || 'Unknown error';
            }

            break;
          }
          default:
            host.status.problem.title = 'exception: ' + host.errorType;
            host.status.problem.description = host.error.message;

        }

      }
      /*
       *
       *
       * Non Exception Problems
       *
       * */
      else {

        // we have an app
        if (host.app) {



              /*
               *
               * Ding ding ding
               *
               * */
              if (host.processes.pids.length > 0) {
                // growl.addSuccessMessage("status change: 'Active'");
                host.status = {
                  isProblem: false,
                  isActive: true,
                  isNoApp: false,
                  display: 'Active',
                  actionLabel: '',
                  problem: {
                    title: '',
                    description: ''
                  }
                };
              }
              else {
                host.status.isProblem = false;
                host.status.isActive = false;
                host.status.isNoApp = false;
                host.status.isInactive = true;
                host.status.display = 'Inactive';
                host.status.problem.title = 'The app is not running';
                host.status.problem.description = 'The app is not running. Click start in the action menu to start it';
              }


        }
        // there is no app here
        else {
          host.status.display = 'No App';
          host.status.isProblem = false;
          host.status.isNoApp = true;
          host.status.isActive = true;
          host.status.isInactive = false;
          host.status.problem.title = 'No app found';
          host.status.problem.description = 'There is no app here. Try clicking start in the action menu to start it';
        }
      }

     // growl.addSuccessMessage("status change: " + host.status.display);
      return host;
    };
    svc.getManagerHosts = function(cb) {
      var meshManager = require('strong-mesh-client')('http://' + $location.host() + ':' + $location.port() + '/manager');
      meshManager.models.ManagerHost.find(function(err, hosts) {
        if (err) {
          $log.warn('exception requesting manager hosts');
          return;
        }
        if (hosts && hosts.map) {
          if (cb) {
            cb(hosts);
          }
        }
      });
    };
    /*
    *
    * Update type-ahead db
    *
    * */
    svc.updateHostServers = function(collection) {
      var existingServers = svc.getHostServers();
      if (existingServers.length > 0) {
        existingServers.map(function(exSrv) {
          var bExists = false;
          collection.map(function(cItem) {
            if (cItem.host === exSrv.host) {
              bExists = true;
            }
          });
          if (!bExists) {
            // add this one to the localStorage
            svc.addToHostServers(exSrv);
          }
        });
      }
      else {
        // fresh populate
        collection.map(function(cItem) {
          svc.addToHostServers(cItem);
        });
      }


    };
    /*
    *
    * Append server config to localStorage
    *
    * */
    svc.addToHostServers = function(server) {
      var servers = svc.getHostServers();
      servers.push(server);
      window.localStorage.setItem('hostServers', JSON.stringify(servers));
    };

    return svc;
  }

]);
