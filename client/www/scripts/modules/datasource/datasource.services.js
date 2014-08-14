// Copyright StrongLoop 2014
Datasource.service('DataSourceService', [
  'DataSourceDefinition',
  'AppStorageService',
  '$timeout',
  '$q',
  function(DataSourceDefinition, AppStorageService, $timeout, $q) {
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
      var targetDS = {};
      if (dsId !== CONST.newDataSourcePreId) {

        DataSourceDefinition.findById({id:dsId},
          function(response) {
            targetDS = response;
            deferred.resolve(targetDS);
          },
          function(response) {
            console.warn('bad get datasource by id: ' + dsId + '  ' + response);
          }
        );

      }
      else {
        deferred.resolve(targetDS);
      }
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
      console.log('(A) SET OPEN INSTANCE REFS: ' + JSON.stringify(openInstanceRefs))
      AppStorageService.setItem('openInstanceRefs', openInstanceRefs);
      return openInstanceRefs;
    };
    svc.createDataSourceDefinition = function(config) {
      var deferred = $q.defer();
      // double check to clear out 'new' id
      if (config.id === CONST.newDataSourcePreId) {
        delete config.id;
      }
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
    };
    svc.createNewDatasourceInstance = function() {
      //var openInstanceRefs = IAService.getOpenInstanceRefs();
      var openInstanceRefs = AppStorageService.getItem('openInstanceRefs');
      if (!openInstanceRefs) {
        openInstanceRefs = [];
      }
      var defaultDatasourceSchema = {
        id: CONST.newDataSourcePreId,
        name: CONST.newDataSourceName,
        facetName: CONST.newDataSourceFacetName,
        type: 'datasource'
      };
      var doesNewDatasourceExist = false;
      for (var i = 0;i < openInstanceRefs.length;i++) {
        if (openInstanceRefs[i].name === CONST.newDataSourceName) {
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
    // delete datasource
    svc.deleteDataSource = function(dsId) {
      if (dsId) {
        var deferred = $q.defer();

        DataSourceDefinition.deleteById({id:dsId},
          function(response) {
            deferred.resolve(response);
          },
          function(response) {
            console.warn('bad delete datasource definition');
          }
        );
        return deferred.promise;
      }
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
