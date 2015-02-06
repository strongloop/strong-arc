Manager.service('ManagerServices', [
  '$log',
  function( $log) {
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
