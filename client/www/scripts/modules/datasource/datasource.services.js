// Copyright StrongLoop 2014
Datasource.service('DataSourceService', [
  'DataSourceDefinition',
  'ModelConfig',
  'AppStorageService',
  'connectorMetadata',
  '$timeout',
  '$q',
  function DataSourceService(DataSourceDefinition, ModelConfig,
                             AppStorageService, connectorMetadata,
                             $timeout, $q) {
    var svc = this;

    svc.createDataSourceInstance = function(targetInstance) {
      var deferred = $q.defer();
      // double check to clear out 'new' id
      if (targetInstance.definition.id === CONST.NEW_DATASOURCE_PRE_ID) {
        delete targetInstance.definition.id;
      }

      DataSourceDefinition.create({}, targetInstance.definition,
        function(definition) {
          targetInstance.id = definition.id;
          targetInstance.name = definition.name;
          targetInstance.definition = definition;
          deferred.resolve(targetInstance);
        },
        function(error) {
          console.warn('bad create data source definition:',
              error && error.data && error.data.error || error);
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };
    svc.updateDataSourceInstance = function(targetInstance) {
      var deferred = $q.defer();
      var instance = {};
      // double check to clear out 'new' id
      if (targetInstance.definition.id) {
        // remove internal model properties
        delete targetInstance.definition.type;

        // `id` is '{facet}.{name}'
        var oldName = targetInstance.definition.id.split('.')[1];

        // Temporary workaround until loopback-workspace supports renames
        if (oldName === targetInstance.definition.name) {
          DataSourceDefinition.upsert({}, targetInstance.definition,
            function(definition) {
              targetInstance.id = definition.id;
              targetInstance.name = definition.name;
              targetInstance.definition = definition;
              deferred.resolve(targetInstance);
            },
            function(error) {
              console.warn('problem updating DataSourceDefinition: ' + error);
              deferred.reject(error);
            }
          );
        } else {
          var oldId = targetInstance.definition.id;

          targetInstance.definition = DataSourceDefinition.create(targetInstance.definition);
          targetInstance.definition.$promise
            .then(function updateRelatedModelConfigs() {
              var modelConfigs = ModelConfig.find({
                filter: { where: { dataSource: oldName } }
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
              targetInstance.id = targetInstance.definition.id;
              targetInstance.name = targetInstance.definition.name;
              deferred.resolve(targetInstance);
            })
            .catch(function(error) {
              console.warn('Cannot rename %s to %s.', oldId, targetDefinition.id, error);
              deferred.reject(error);
            });
        }
      }
      else {
        console.warn('attempt to update DataSourceDefinition without an id property');
      }

      return deferred.promise;
    };
    svc.getAllDataSourceInstances = function() {

      var deferred = $q.defer();

      DataSourceDefinition.find({},function(response){
          var instances = [];
          angular.forEach(response, function(item) {
            instances.push({
              id: item.id,
              name: item.name,
              type: CONST.DATASOURCE_TYPE,
              definition: item
            });
          });
          deferred.resolve(instances);
        },
        function(response) {
          console.warn('bad get data source defninitions: ' + response)
        }
      );

      return deferred.promise;

    };
    svc.createNewDataSourceInstance = function(initialDefinition) {
      var defaultDataSourceSchema = initialDefinition || {};

      if (!defaultDataSourceSchema.id) {
        defaultDataSourceSchema.id = CONST.NEW_DATASOURCE_PRE_ID;
      }
      if (!defaultDataSourceSchema.name) {
        defaultDataSourceSchema.name = CONST.NEW_DATASOURCE_NAME;
      }
      if (!defaultDataSourceSchema.facetName) {
        defaultDataSourceSchema.facetName = CONST.NEW_DATASOURCE_FACET_NAME;
      }

      return {
        id: defaultDataSourceSchema.id,
        name: defaultDataSourceSchema.name,
        type: CONST.DATASOURCE_TYPE,
        definition: defaultDataSourceSchema
      };
    };
    svc.getDiscoverableDatasourceConnectors = function() {
      return connectorMetadata
        .filter(function(it) {
          return it.features && it.features.discovery;
        })
        .map(function(it) {
          return it.name;
        });
    };
    svc.getDataSourceInstanceById = function(dsId) {
      var deferred = $q.defer();
      var targetDS = {};
      if (dsId !== CONST.NEW_DATASOURCE_PRE_ID) {

        DataSourceDefinition.findById({id:dsId},
          function(definition) {
            var instance = {
              id: definition.id,
              name: definition.name,
              type: CONST.DATASOURCE_TYPE,
              definition: definition
            }
            deferred.resolve(instance);
          },
          function(error) {
            console.warn('bad get data source by id: ' + dsId + '  ' + error);
            deferred.reject(error);
          }
        );

      }
      else {
        console.warn('tried to retrieve data source by new id: ' + dsId );
      }
      return deferred.promise;

    };
    svc.deleteDataSourceInstance = function(dsId) {
      if (dsId) {
        var deferred = $q.defer();

        DataSourceDefinition.deleteById({id:dsId},
          function(response) {
            deferred.resolve(response);
          },
          function(response) {
            console.warn('bad delete data source definition');
          }
        );
        return deferred.promise;
      }
    };
    svc.testDataSourceConnection = function(dsId) {
      var deferred = $q.defer();

      DataSourceDefinition.prototype$testConnection({ id: dsId },
        function(response) {
          deferred.resolve(response);
        },
        function(response) {
          var error = response.data && response.data.error ||
            new Error('Unexpected error ' + response.status);
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };

    return svc;
  }
]);


/**
 * @ngdoc factory
 * @name Datasource.connectorMetadata
 * @description
 * A cached list of supported connectors, including connector metadata.
 */
Datasource.factory('connectorMetadata', [
  'Workspace',
  function connectorMetadataFactory(Workspace) {
    var result = [];
    var list = Workspace.listAvailableConnectors();
    result.$resolved = list.$resolved;

    result.$promise = list.$promise.then(function() {
      list.forEach(function filterSupportedConnectors(connector) {
        var SUPPORTED_CONNECTORS = [
          'memory',
          'oracle',
          'mssql',
          'mysql',
          'postgresql',
          'mongodb'
        ];

        if (SUPPORTED_CONNECTORS.indexOf(connector.name) !== -1) {
          result.push(connector);
        }
      });
      result.$resolved = true;
      return result;
    });

    return result;
  }
]);
