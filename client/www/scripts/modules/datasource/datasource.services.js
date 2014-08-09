// Copyright StrongLoop 2014
Datasource.service('DatasourceService', [
  'Datasourcedef',
  'DataSourceDefinition',
  'AppStorageService',
  '$timeout',
  '$q',
  function(Datasourcedef, DataSourceDefinition, AppStorageService, $timeout, $q) {
    var svc = {};
    //  var deferred = $q.defer();
    svc.getDiscoverableDatasourceConnectors = function() {
      return ['loopback-connector-mssql', 'loopback-connector-oracle', 'loopback-connector-mysql', 'loopback-connector-postgresql']
    };

    svc.getAllDatasources = function() {

      var deferred = $q.defer();

      DataSourceDefinition.find({},function(response){
          deferred.resolve(response);
        },
        function(response) {
          console.warn('bad get datasource defninitions')
        }
      );

//      var retVal = JSON.parse(window.localStorage.getItem('ApiDatasources'));
//      if (!retVal) {
//        retVal = [];
//      }
//      $timeout(function() {
//        deferred.resolve(retVal);
//      }, 500);

      return deferred.promise;
//      return Datasourcedef.query({},
//        function(response) {
//          var datasources = [];
//          var core = response[0];
//          var log = [];
//          var datasources = [];
//
//          angular.forEach(core, function(value, key){
//            this.push(key + ': ' + value);
//            datasources.push({name:key,props:value});
//          }, log);
//
//          window.localStorage.setItem('ApiDatasources', JSON.stringify(datasources));
//          return datasources;
//        },
//        function(response) {
//          console.log('bad get datasource defs');
//        }
//      );
    };

    svc.getDatasourceByName = function(name) {

      if (window.localStorage.getItem('ApiDatasources')) {
        var currDSCollection = JSON.parse(window.localStorage.getItem('ApiDatasources'));
        for (var i = 0;i < currDSCollection.length;i++) {
          if (currDSCollection[i].name === name) {
            return currDSCollection[i];
          }
        }
      }
    };
    svc.getDataSourceById = function(dsId) {
      var deferred = $q.defer();

      DataSourceDefinition.findById({id:dsId},
        function(response) {
          deferred.resolve(response);
        },
        function(response) {
          console.warn('bad get datasource by id: ' + dsId + '  ' + response);
        }
      );

      return deferred.promise;
    };
    svc.updateNewDatasourceName = function(newName) {
      var openInstanceRefs = AppStorageService.getItem('openInstanceRefs');
      if (!openInstanceRefs) {
        return;
      }
      for (var i = 0;i < openInstanceRefs.length;i++) {
        if (openInstanceRefs[i].name === 'new-datasource') {
          openInstanceRefs[i].name = newName;
          break;
        }
      }
      AppStorageService.setItem('openInstanceRefs', openInstanceRefs);
      return openInstanceRefs;
    };
    svc.createDataSourceDefinition = function(config) {
      var deferred = $q.defer();

      DataSourceDefinition.create({}, config,
        function(response) {
          deferred.resolve(response);
        },
        function(response) {
          console.warn('bad create data source definition: ' + response);
        }
      );


      return deferred.promise;
    };
    // obsolete
    svc.createDatasourceDef = function(datasourceDefObj) {
      console.log('Add this data service: ' + JSON.stringify(datasourceDefObj));
      var currentDatasources = JSON.parse(window.localStorage.getItem('ApiDatasources'));
      if (!currentDatasources) {
        currentDatasources = [];
      }
      currentDatasources.push(datasourceDefObj);
      window.localStorage.setItem('ApiDatasources', JSON.stringify(currentDatasources));
      return datasourceDefObj;
     // return Datasourcedef.create(datasourceDefObj);
    };
    svc.getDatasourceTables = function(dsName) {
      return Datasourcedef.discoverschema({},
        function(response) {

      //    console.log('good get tables defs: '+ response);

//          var core = response[0];
//          var log = [];
//          var datasources = [];
//          angular.forEach(core, function(value, key){
//            this.push(key + ': ' + value);
//            datasources.push({name:key,props:value});
//          }, log);

          // $scope.models = models;
          var x = response.schema;
          var y = x;

          return response.schema;

        },
        function(response) {
          console.log('bad get datasource defs');

        }

      );
    };
    svc.createNewDatasourceInstance = function() {
      var openInstanceRefs = AppStorageService.getItem('openInstanceRefs');
      var defaultDatasourceSchema = {
        name: 'new-datasource',
        type: 'datasource'
      };
      if (!openInstanceRefs) {
        openInstanceRefs = [];
      }
      var doesNewDatasourceExist = false;
      for (var i = 0;i < openInstanceRefs.length;i++) {
        if (openInstanceRefs[i].name === 'new-datasource') {
          doesNewDatasourceExist = true;
          break;
        }
      }
      if (!doesNewDatasourceExist) {
        openInstanceRefs.push(defaultDatasourceSchema);
        AppStorageService.setItem('openInstanceRefs', openInstanceRefs);
      }
      return defaultDatasourceSchema;
    };
    // dormant for now
    svc.isNewDatasourceNameUnique = function(name) {
      var retVar = true;

      var existingDatasources = JSON.parse(window.localStorage.getItem('ApiDatasources'));
      if (existingDatasources) {
        for (var i = 0;i < existingDatasources.length;i++) {
          if (existingDatasources[i].name === name) {
            retVar = false;
            break;
          }
        }
      }

      return retVar;
    };
    return svc;
  }
]);



[{"name":"db","props":{"defaultForType":"db","debug":false}},{"name":"mongodb","props":{"defaultForType":"mongodb","connector":"loopback-connector-mongodb","database":"apistudio","host":"localhost","port":27017,"debug":false,"safe":true,"w":1,"hostname":"localhost","url":"mongodb://localhost:27017/apistudio"}},{"name":"apmDev","props":{"defaultForType":"mysql","connector":"loopback-connector-mysql","database":"apm","host":"localhost","port":3306,"username":"root","password":"","debug":false,"collation":"utf8_general_ci","charset":"utf8","supportBigNumbers":false,"timezone":"local"}},{"name":"icarmysql","props":{"defaultForType":"mysql","connector":"loopback-connector-mysql","host":"demo.strongloop.com","port":3306,"database":"demo","username":"demo","password":"L00pBack","debug":false,"collation":"utf8_general_ci","charset":"utf8","supportBigNumbers":false,"timezone":"local"}},{"name":"push","props":{"defaultForType":"push","connector":"loopback-push-notification","installation":"installation","notification":"notification","application":"application","debug":false}},{"name":"mail","props":{"defaultForType":"mail","debug":false}},{"name":"test","type":"datasource","props":{"defaultForType":"teset","connector":"loopback-connector-oracle","database":"teste","host":"asdfasfd","port":"3423","":"save"}},{"name":"test2","type":"datasource","props":{"defaultForType":"test2","connector":"loopback-connector-mysql","database":"tesr2","host":"asdfasdf","port":"3344","":"save"}}]
