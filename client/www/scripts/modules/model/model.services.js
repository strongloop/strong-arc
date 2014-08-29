// Copyright StrongLoop 2014
Model.service('ModelService', [
  'Modeldef',
  'ModelDefinition',
  'ModelConfig',
  '$q',
  'AppStorageService',
  function(Modeldef, ModelDefinition, ModelConfig, $q, AppStorageService) {
    var svc = {};
    svc.createModel = function(config) {
      var deferred = $q.defer();
      if (config.name) {

        // double check to clear out 'new' id
        if (config.id === CONST.NEW_MODEL_PRE_ID) {
          delete config.id;
        }

        ModelDefinition.create({}, config, function(response) {

          var modelConfig = angular.extend(
            {
              facetName: CONST.APP_FACET,
              name: config.name
            },
            config.config);

            modelConfig = ModelConfig.create(modelConfig,
              function() {
                setModelConfig(response, modelConfig);
                deferred.resolve(response);
              },
              function(response) {
                console.warn('bad create model config: ' + response);
              });
          },
          function(response){
            console.warn('bad create model def: ' + response);
          });
      }
      return deferred.promise;

    };
    svc.deleteModel = function(definitionId, configId) {
      if (definitionId) {
        var deferred = $q.defer();

        ModelDefinition.deleteById({ id: definitionId },
          function(response) {
            if (!configId) {
              deferred.resolve(response);
            } else {
              ModelConfig.deleteById({ id: configId },
                function() {
                  deferred.resolve(response);
                },
                function(response) {
                  console.warn('Cannot delete ModelConfig.', response);
                });
            }
          },
          function(response) {
            console.warn('bad delete model definition', response);
          }
        );
        return deferred.promise;
      }
    };

    function setModelConfig(definition, config) {
      if (Object.hasOwnProperty(definition, 'config'))
        delete definition.config;

      Object.defineProperty(definition, 'config', {
        value: config,
        writable: true,
        enumerable: false
      });
    }

    svc.getAllModels = function() {
      var deferred = $q.defer();
      ModelConfig.find({},
        function(configs) {
          var configMap = {};
          angular.forEach(configs, function(value, key) {
            configMap[value.name] = value;
          });

          ModelDefinition.find({},
            function(response) {

              // add create model to this for new model

              var core = response;
              var log = [];
              var models = [];
              angular.forEach(core, function(value, key) {
                // this.push(key + ': ' + value);
                var lProperties = [];
                if (value.properties) {
                  angular.forEach(value.properties, function(value, key) {
                    lProperties.push({name: key, props: value});
                  });
                  value.properties = lProperties;
                }
                var lOptions = [];
                if (value.options) {
                  angular.forEach(value.options, function(value, key) {
                    lOptions.push({name: key, props: value});
                  });
                  value.options = lProperties;
                }

                setModelConfig(value, configMap[value.name]);
                models.push({name: key, props: value});
              }, log);


              deferred.resolve(core);
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
    svc.updateModel = function(model) {
      var deferred = $q.defer();

      if (model.id) {
        // `id` is '{facet}.{name}'
        var oldName = model.id.split('.')[1];

        // Temporary workaround until loopback-workspace supports renames
        if (oldName === model.name) {
          ModelDefinition.upsert(model,
            function(response) {
              model.config.facetName = model.config.facetName || CONST.APP_FACET;
              model.config.name = model.config.name || model.name;

              ModelConfig.upsert(model.config,
                function(configResponse) {
                  setModelConfig(response, configResponse);

                  // copy over properties, they were not changed
                  response.properties = model.properties;

                  deferred.resolve(response);
                },
                function(configResponse) {
                  console.warn('Cannot update model configuration', model.id, configResponse);
                }
              );
            },
            function(response) {
              console.warn('bad update model definition: ' + model.id);
            }
          );
        } else {
          var oldId = model.id;

          // delete properties that should be generated from the new name
          delete model.id;
          delete model.configFile;

          var updatedModel = ModelDefinition.create(model);
          updatedModel.$promise
            .then(function moveAllRelatedDataToNewModel() {
              return $q.all(
                ['properties', 'validations', 'relations', 'accessControls']
                  .map(function moveToNewModel(relationName) {
                    var entities = ModelDefinition[relationName]({ id: oldId });
                    return entities.$promise
                      .then(function updateModelId() {
                        return $q.all(entities.map(function(it) {
                          it.modelId = updatedModel.id;
                          return it.$save();
                        }));
                      })
                      .then(function addToLocalModel() {
                        // Views expects that `modelDef.properties`
                        // is populated with model properties
                        updatedModel[relationName] = entities;
                      });
                  }));
            })
            .then(function renameModelConfig() {
              var modelConfig = model.config;
              var oldConfigId = modelConfig.id;
              modelConfig.name = updatedModel.name;

              // delete properties that should be generated from the new name
              delete modelConfig.id;
              delete modelConfig.configFile;

              var updatedConfig = ModelConfig.create(modelConfig);
              return updatedConfig.$promise
                .then(function updateConfigReference() {
                  setModelConfig(updatedModel, updatedConfig);
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
              deferred.resolve(updatedModel);
            })
            .catch(function(err) {
              console.warn('Cannot rename %s to %s.', oldId, model.name, err);
            });
        }

      }

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

            svc.createModel(newLBModel);

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

    svc.getModelById = function(modelId) {
      var targetModel = {};
      var deferred = $q.defer();
      if (modelId !== CONST.NEW_MODEL_PRE_ID) {


        ModelDefinition.findById({id:modelId},
          // success
          function(response) {
            targetModel = response;
            ModelDefinition.properties({id:targetModel.id}, function(response) {
              targetModel.properties = response;

              ModelConfig.findOne(
                {
                  filter: {
                    where: {
                      facetName: CONST.APP_FACET,
                      name: targetModel.name
                    }
                  }
                },
                function(config) {
                  setModelConfig(targetModel, config);
                  deferred.resolve(targetModel);
                },
                function(response) {
                  console.warn('cannot get ModelConfig', response);
                  setModelConfig(targetModel, new DefaultModelSchema().config);
                  deferred.resolve(targetModel);
                });
            });

          },
          // fail
          function(response) {
            console.warn('bad get model definition: ' + response);
          }
        );
      }
      else {
        deferred.resolve(targetModel);
      }
      return deferred.promise;

    };
    svc.isPropertyUnique = function(modelRef, newPropertyName) {
      var isUnique = true;
      var newNameLen = newPropertyName.length;
      if (!modelRef.properties) {
        modelRef.properties = [];
      }
      for (var i = 0;i < modelRef.properties.length;i++) {
        var xModelProp = modelRef.properties[i];
        if (xModelProp.name.substr(0, newNameLen) === newPropertyName) {
          return false;
        }
      }
      return isUnique;

    };

    var DefaultModelSchema = function(){
      var schema = {
        id: CONST.NEW_MODEL_PRE_ID,
        type: CONST.MODEL_TYPE,
        facetName: CONST.NEW_MODEL_FACET_NAME,
        strict: false,
        name: CONST.NEW_MODEL_NAME,
        idInjection: false,
        base: CONST.NEW_MODEL_BASE
      };

      setModelConfig(schema, {
        facetName: CONST.APP_FACET,
        public: true,
        dataSource: null
      });

      return schema;
    };

    svc.createNewModelInstance = function() {
      var returnInstance = new DefaultModelSchema();

      return returnInstance;
    };
    return svc;
  }
]);

