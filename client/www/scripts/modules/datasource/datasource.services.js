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
          console.warn('bad get datasource defninitions: ' + response)
        }
      );

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
      if (dsId !== CONST.NEW_DATASOURCE_PRE_ID) {

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
        if (openInstanceRefs[i].name === CONST.NEW_DATASOURCE_NAME) {
          openInstanceRefs[i].name = newName;
          break;
        }
      }
      AppStorageService.setItem('openInstanceRefs', openInstanceRefs);
      return openInstanceRefs;
    };
    svc.createDataSourceDefinition = function(config) {
      var deferred = $q.defer();
      // double check to clear out 'new' id
      if (config.id === CONST.NEW_DATASOURCE_PRE_ID) {
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
    svc.updateDataSourceDefinition = function(config) {
      var deferred = $q.defer();
      // double check to clear out 'new' id
      if (config.id) {
        DataSourceDefinition.upsert({}, config,
          function(response) {
            deferred.resolve(response);
          },
          function(response) {
            console.warn('bad update data source definition: ' + response);
          }
        );
      }

      return deferred.promise;
    };
    svc.testDataSourceConnection = function(dsId) {
      var deferred = $q.defer();

      DataSourceDefinition.findById({id:dsId},
        function(response) {
          response.$prototype$testConnection({id:dsId},
            function(response) {
              deferred.resolve(response);
            },
            function(response) {
              console.warn('bad test ds connection: ' + response);
            }
          );
        },
        function(response) {

        }
      );

      return deferred.promise;
    };
    // obsolete
    svc.createDatasourceDef = function(datasourceDefObj) {
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
        id: CONST.NEW_DATASOURCE_PRE_ID,
        name: CONST.NEW_DATASOURCE_NAME,
        facetName: CONST.NEW_DATASOURCE_FACET_NAME,
        type: CONST.DATASOURCE_TYPE
      };
      var doesNewDatasourceExist = false;
      for (var i = 0;i < openInstanceRefs.length;i++) {
        if (openInstanceRefs[i].name === CONST.NEW_DATASOURCE_NAME) {
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
