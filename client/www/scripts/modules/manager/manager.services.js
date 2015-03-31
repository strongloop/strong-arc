Manager.service('ManagerServices', [
  '$log',
  '$http',
  'LicensesService',
  function($log, $http, LicensesService) {

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


    /**
     * Update licenses on server
     */
    svc.updateLicenses = function(host){
      var url = host.protocol + '://' + host.host + (host.port === 80 || host.port === 443 ? '' : ':' + host.port );

      return LicensesService.getLicenses()
        .then(function(licenses){
          var keys = licenses.map(function(lic){
            return lic.licenseKey;
          });

          return $http.put(url + '/api/Services/1/env/STRONGLOOP_LICENSE', { value: keys.join(':') });
        });
    };

    return svc;
  }

]);
