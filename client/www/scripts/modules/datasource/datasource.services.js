// Copyright StrongLoop 2014
Datasource.service('DataSourceService', [
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
      console.log('(A) SET OPEN INSTANCE REFS: ' + JSON.stringify(openInstanceRefs));
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
        console.log('(B) SET OPEN INSTANCE REFS: ' + JSON.stringify(openInstanceRefs));
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
