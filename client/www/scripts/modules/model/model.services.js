// Copyright StrongLoop 2014
Model.service('ModelService', [
  'Modeldef',
  'ModelDefinition',
  'ModelConfig',
  '$q',
  'AppStorageService',
  'ModelProperty',
  'DataSourceDefinition',
  'connectorMetadata',
  function(Modeldef, ModelDefinition, ModelConfig, $q,
           AppStorageService, ModelProperty, DataSourceDefinition, connectorMetadata) {
    var svc = {};



    svc.createModelInstance = function(targetInstance) {
        if (targetInstance.definition.name) {

        delete targetInstance.id;
        delete targetInstance.definition.id;

        return ModelDefinition.create({}, targetInstance.definition)
          .$promise
          .then(function(definition) {

            targetInstance.id = definition.id;
            targetInstance.name = definition.name;
            targetInstance.definition = definition;
            targetInstance.config = angular.extend({
                name: definition.name,
                facetName: CONST.APP_FACET
              },
              targetInstance.config);

            return ModelConfig.create(targetInstance.config)
              .$promise
              .then(function(config) {
                targetInstance.config = config;
                return svc.isModelConfigMigrateable(targetInstance .config)
                  .then(function(canMigrate) {
                    targetInstance.canMigrate = canMigrate;
                    return targetInstance;
                  }).
                  catch(function(error) {
                    log.warn('bad is model config migratable: ' + error);
                    return error;
                  });
              })
              .catch(function(error) {
                console.warn('bad create model config: ' + error);
                return error;
              });

          })
          .catch(function(error){
            console.warn('bad create model def: ' + error);
            return error;
          });

    }
      else {
        console.warn('createModelInstance called with no definition name');
        return null;
      }
    };
    // returns a full 'instance' with a definition and config property
    svc.getModelInstanceById = function(modelId) {
      var deferred = $q.defer();
      var instance = {};
      svc.getModelDefinitionById(modelId).
        // model definition
        then(function(definition) {
          // begin the instance object
          // add the definition
          instance = {
            definition: definition,
            type: CONST.MODEL_TYPE,
            id: definition.id,
            name: definition.name
          };
          return instance;
        }).
        // model config
        then(function(instance) {
          // get the config
          svc.getModelConfigByName(instance.name).
            then(function(response) {
              instance.config = response;
              if (instance.config.dataSource) {
                if (instance.config.dataSource === null) {
                  instance.config.dataSource = CONST.DEFAULT_DATASOURCE;
                }
              }
              else {
                instance.config.dataSource = CONST.DEFAULT_DATASOURCE;
              }
              return instance;
            }).
            then(function(instance) {
              // model properties
              svc.getModelPropertiesById(instance.id).
                then(function(properties) {
                  instance.properties = properties;
                  svc.isModelConfigMigrateable(instance.config)
                    .then(function(canMigrate) {
                      instance.canMigrate = canMigrate;
                      deferred.resolve(instance);
                    });
                });
            }).
            catch(function(error) {
              console.warn('bad get model config');
              return error;
            });
        }).
        catch(function(error) {
          deferred.reject(error);
        });

      return deferred.promise;

    };
    svc.deleteModelInstance = function(definitionId, configId) {
      if (definitionId) {
        var deferred = $q.defer();

        ModelDefinition.deleteById({ id: definitionId },
          function(response) {
            ModelConfig.deleteById({ id: configId },
              function() {
                deferred.resolve(response);
              },
              function(response) {
                console.warn('Cannot delete ModelConfig.', response);
              });
          },
          function(response) {
            console.warn('bad delete model definition', response);
          }
        );
        return deferred.promise;
      }
    };
    svc.getAllModelInstances = function() {
      var deferred = $q.defer();
      ModelConfig.find({},
        function(configs) {
          var configMap = {};
          angular.forEach(configs, function(value, key) {
            configMap[value.name] = value;
          });

          ModelDefinition.find({ filter: { where: { readonly: false } } },
            function(response) {

              // add create model to this for new model
              var core = response;
              var log = [];
              var modelInstances = [];
              angular.forEach(core, function(value, key) {
                var instance = {};

                instance.id = value.id;
                instance.name = value.name;
                instance.type = CONST.MODEL_TYPE;
                instance.definition = value;


                var lOptions = [];
                if (value.options) {
                  angular.forEach(value.options, function(value, key) {
                    lOptions.push({name: key, props: value});
                  });
                  instance.options = lOptions;
                }

                instance.config = configMap[value.name];
                if (instance.config.dataSource) {
                  if (instance.config.dataSource === null) {
                    instance.config.dataSource = CONST.DEFAULT_DATASOURCE;
                  }
                }
                else {
                  instance.config.dataSource = CONST.DEFAULT_DATASOURCE;
                }
                modelInstances.push(instance);
              }, log);


              deferred.resolve(modelInstances);
            },

            function(response) {
              console.warn('bad get model defs: ' + response);
            }
          );
        },
        function(err) {
          console.warn('Cannot get model configs.', err);
        }
      );

      return deferred.promise;

    };
    svc.updateModelInstance = function(targetInstance) {
      var deferred = $q.defer();

      if (targetInstance.definition.id) {

        // `id` is '{facet}.{name}'
        var oldName = targetInstance.definition.id.split('.')[1];

        // Temporary workaround until loopback-workspace supports renames
        if (oldName === targetInstance.definition.name) {
          ModelDefinition.upsert(targetInstance.definition,
            function(definition) {
              targetInstance.definition = definition;
              targetInstance.config = angular.extend({
                  name: definition.name,
                  facetName: CONST.APP_FACET
                },
                targetInstance.config);
              if (targetInstance.config.dataSource && (targetInstance.config.dataSource === CONST.NULL_DATASOURCE)){
                targetInstance.config.dataSource = null;
              }
              ModelConfig.upsert(targetInstance.config,
                function(configResponse) {
                  targetInstance.config = configResponse;
                  svc.isModelConfigMigrateable(targetInstance.config)
                    .then(function(canMigrate) {
                      targetInstance.canMigrate = canMigrate;
                      deferred.resolve(targetInstance);
                    });
                },
                function(error) {
                  console.warn('Cannot update model configuration', targetInstance.id, error);
                }
              );
            },
            function(error) {
              console.warn('bad update model definition: [' + targetInstance.id + '][' + error + ']');
            }
          );
        } else {
          var oldId = targetInstance.definition.id;

          // delete properties that should be generated from the new name
          delete targetInstance.definition.id;
          delete targetInstance.definition.configFile;

          targetInstance.definition = ModelDefinition.create(targetInstance.definition);
          targetInstance.definition.$promise
            .then(function moveAllRelatedDataToNewModel() {
              return $q.all(
                ['properties', 'validations', 'relations', 'accessControls']
                  .map(function moveToNewModel(relationName) {
                    var entities = ModelDefinition[relationName]({ id: oldId });
                    return entities.$promise
                      .then(function updateModelId() {
                        return $q.all(entities.map(function(it) {
                          it.modelId = targetInstance.definition.id;
                          return it.$save();
                        }));
                      })
                      .then(function addToLocalModel() {
                        // is populated with model properties
                        targetInstance[relationName] = entities;
                      });
                  }));
            })
            .then(function renameModelConfig() {
              var modelConfig = targetInstance.config;
              var oldConfigId = modelConfig.id;
              modelConfig.name = targetInstance.definition.name;

              // delete properties that should be generated from the new name
              delete modelConfig.id;
              delete modelConfig.configFile;

              var updatedConfig = ModelConfig.create(modelConfig);
              return updatedConfig.$promise
                .then(function updateConfigReference() {
                  targetInstance.config = updatedConfig;
                })
                .then(function deleteOldModelConfig() {
                  if (!oldConfigId) return;
                  return ModelConfig.deleteById({ id: oldConfigId }).$promise;
                });
            })
            .then(function deleteOldModel() {
              return ModelDefinition.deleteById({ id: oldId }).$promise;
            })
            .then(function() {
              // ensure they are in sync
              targetInstance.id = targetInstance.definition.id;
              targetInstance.name = targetInstance.definition.name;
              deferred.resolve(targetInstance);
            })
            .catch(function(err) {
              console.warn('Cannot rename %s to %s.', oldId, model.name, err);
            });
        }

      }

      return deferred.promise;

    };
    var DefaultModelInstance = function(){
      var schema = {
        id: CONST.NEW_MODEL_PRE_ID,
        type: CONST.MODEL_TYPE,
        name: CONST.NEW_MODEL_NAME,
        definition: {
          id: CONST.NEW_MODEL_PRE_ID,
          facetName: CONST.NEW_MODEL_FACET_NAME,
          strict: false,
          name: CONST.NEW_MODEL_NAME,
          idInjection: false,
          base: CONST.NEW_MODEL_BASE
        },
        properties: [],
        config: {
          facetName: CONST.APP_FACET,
          public: true,
          dataSource: CONST.DEFAULT_DATASOURCE
        }
      };

      return schema;
    };
    svc.createNewModelInstance = function() {
      var returnInstance = new DefaultModelInstance();
      return returnInstance;
    };


    svc.getModelDefinitionById = function(modelId) {
      var deferred = $q.defer();
      if (modelId !== CONST.NEW_MODEL_PRE_ID) {
        ModelDefinition.findById({id:modelId},
          function(definition) {
            deferred.resolve(definition);
          },
          function(error) {
            deferred.reject(error);
          });
      }
      else {
        console.warn('attempt to retrieve new model definition');
        deferred.reject('attempt to retrieve new model definition');
      }
      return deferred.promise;
    };

    svc.getModelPropertiesById = function(modelId) {
      var deferred = $q.defer();
      ModelDefinition.properties({id:modelId},
        function(properties) {
          deferred.resolve(properties);
        },
        function(error) {
          console.warn('couldnt get properties for model');
          deferred.reject(error);
        });
      return deferred.promise;
    };

    svc.getModelConfigByName = function(modelName){
      var deferred = $q.defer();
      ModelConfig.findOne(
        {
          filter: {
            where: {
              facetName: CONST.APP_FACET,
              name: modelName
            }
          }
        },
        function(config) {
          deferred.resolve(config);
        },
        function(error) {
          deferred.reject(error);
        });

      return deferred.promise;
    };

    svc.generateModelsFromSchema = function(schemaCollection) {
      if (schemaCollection && schemaCollection.length > 0) {

        var openInstances = AppStorageService.getItem('openInstanceRefs');
        if (!openInstances) {
          openInstances = [];
        }
        for (var i = 0;i < schemaCollection.length;i++) {
          var sourceDbModelObj = schemaCollection[i];
          // model definition object generation from schema
          // TODO map db source name here
          var newLBModel = {
            id: sourceDbModelObj.id,
            name: sourceDbModelObj.name,
            type:'model'

          };
          // open instances reset
          openInstances.push({
            id: sourceDbModelObj.id,
            name: sourceDbModelObj.name,
            type:'model'
          });

          var modelProps = {
            config: {
              public: true
            },
            plural: sourceDbModelObj.name + 's'
          };
          newLBModel.props = modelProps;
          if (sourceDbModelObj.properties) {
            for (var k = 0;k < sourceDbModelObj.properties.length;k++){
              var sourceProperty = sourceDbModelObj.properties[k];
              var targetDataType = 'string';

              // lock the varchar type
              if (sourceProperty.dataType.toLowerCase().indexOf('varchar') > -1) {
                sourceProperty.dataType = 'varchar';
              }

              // TODO hopefully this conversion will happen in the API
              switch (sourceProperty.dataType) {

                case 'int':
                  targetDataType = 'Number';
                  break;

                case 'varchar':
                  targetDataType = 'String';
                  break;

                case 'datetime':
                  targetDataType = 'Date';
                  break;

                case 'timestamp':
                  targetDataType = 'Date';
                  break;

                case 'char':
                  targetDataType = 'String';
                  break;

                case 'tinytext':
                  targetDataType = 'String';
                  break;

                case 'longtext':
                  targetDataType = 'String';
                  break;

                case 'point':
                  targetDataType = 'GeoPoint';
                  break;

                default:
                  targetDataType = 'String';

              }

              var propertyProps = {
                type:targetDataType
              };
              newLBModel.props.properties.push({
                name:sourceProperty.columnName,
                props:propertyProps
              });

            }

            svc.createModelDefinition(newLBModel);

          }


        }
        // open the new models
        AppStorageService.setItem('openInstanceRefs', openInstances);
        // activate the last one
        AppStorageService.setItem('activeInstance', newLBModel);
        // activate the first of the index
        // IAService.activeInstance = svc.activate
        //var nm = IAService.activateInstanceByName(newOpenInstances[0], 'model');

      }
    };

    svc.migrateModelConfig = function(config) {
      var deferred = $q.defer();
      var promise = deferred.promise;

      if (config.dataSource === CONST.DEFAULT_DATASOURCE) {
        config.dataSource = null;
      }
      return DataSourceDefinition.findOne({
        filter: {
          where: {
          name: config.dataSource,
          facetName: CONST.APP_FACET
          }
        }
      })
      .$promise
      .then(function(dataSourceDef) {
        return DataSourceDefinition.prototype$autoupdate({
          id: dataSourceDef.id
        },{
          modelName: config.name
        }).$promise;
      });
    }

    svc.isModelConfigMigrateable = function(config) {
      var deferred = $q.defer();
      var promise = deferred.promise;
      var canMigrate = false;
      if (config.dataSource === CONST.NULL_DATASOURCE) {
        config.dataSource = null;
      }
      if(!config || !config.dataSource) {
        deferred.resolve(canMigrate);
        return promise;
      }

      DataSourceDefinition.findOne({
        filter: {
          where: {
            name: config.dataSource,
            facetName: CONST.APP_FACET
          }
        }
      },
      function(dataSourceDef) {
        var connectorName = dataSourceDef && dataSourceDef.connector;
        var metadata = connectorMetadata.filter(function(it) {
          return it.name === connectorName;
        })[0];

        var connectorIsSupported = connectorName &&
          metadata && metadata.features && metadata.features.migration;

        deferred.resolve(dataSourceDef && connectorIsSupported);
      });

      return promise;
    }

    return svc;
  }
]);

