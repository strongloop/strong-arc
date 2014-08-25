// Copyright StrongLoop 2014
Datasource.service('DataSourceService', [
  'DataSourceDefinition',
  'ModelConfig',
  'AppStorageService',
  '$timeout',
  '$q',
  function(DataSourceDefinition, ModelConfig, AppStorageService, $timeout, $q) {
    var svc = {};
    //  var deferred = $q.defer();
    svc.getDiscoverableDatasourceConnectors = function() {
      return ['mssql', 'oracle', 'mysql', 'postgresql'];
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
        // `id` is '{facet}.{name}'
        var oldName = config.id.split('.')[1];

        // Temporary workaround until loopback-workspace supports renames
        if (oldName === config.name) {
          DataSourceDefinition.upsert({}, config,
            function(response) {
              deferred.resolve(response);
            },
            function(response) {
              deferred.reject(response);
            }
          );
        } else {
          var oldId = config.id;

          var updatedDefinition = DataSourceDefinition.create(config);
          updatedDefinition.$promise
            .then(function updateRelatedModelConfigs() {
              var modelConfigs = ModelConfig.find({
                where: { dataSource: oldName }
              });

              return modelConfigs.$promise.then(function updateModelConfig() {
                $q.all(modelConfigs.map(function(mc) {
                  mc.dataSource = config.name;
                  return mc.$save();
                }));
              });
            })
            .then(function deleteOldDataSource() {
              return DataSourceDefinition.deleteById({ id: oldId }).$promise;
            })
            .then(function() {
              deferred.resolve(updatedDefinition);
            })
            .catch(function(err) {
              console.warn('Cannot rename %s to %s.', oldId, config.id, err);
            });
        }
      }
      else {
        console.warn('attempt to update DataSourceDefinition without an id property');
      }

      return deferred.promise;
    };
    svc.testDataSourceConnection = function(config) {
      if (!config.connector) {
        return $q.reject('Select a connector first.');
      }

      var deferred = $q.defer();

      DataSourceDefinition.testConnection({}, config,
        function(response) {
          deferred.resolve(response);
        },
        function(response) {
          var msg = response.data && response.data.error &&
            response.data.error.message;
          msg = msg || 'Unexpected error ' + response.status;
          deferred.reject(msg);
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
    svc.createNewDatasourceInstance = function(initialData) {
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
      angular.extend(defaultDatasourceSchema, initialData);

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
