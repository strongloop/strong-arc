VisualComposer.controller('VisualComposerMainController', [
  '$scope',
  '$q',
  'ModelService',
  'IAService',
  'growl',
  '$log',
  'PropertyService',
  function VisualComposerMainController($scope, $q, ModelService, IAService,
    growl, $log, PropertyService) {
    var models = $q.defer();

    $scope.models = [];
    $scope.connections = [];
    $scope.mainNavModels = [];

    function getPropertyNameSnapshot(propArray) {
      return propArray.map(function(item) {
        return item.name;
      });
    }

    function getPropertyIndex(name, list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i] === name) {
          return i;
        }
      }
    }

    // update model property
    $scope.updateModelPropertyNameRequest = function(config) {
      var modelPropertyConfig = config.propertyConfig;
      if (modelPropertyConfig && modelPropertyConfig.modelId && modelPropertyConfig.name) {

        var propertyNameSnapshot = getPropertyNameSnapshot(config.currProperties);
        var currentIndex = getPropertyIndex(modelPropertyConfig.name, propertyNameSnapshot);

        PropertyService.updateModelProperty(modelPropertyConfig)
          .then(function(updatedProperty) {
            growl.addSuccessMessage('property updated');
            $scope.activeInstance.properties[currentIndex] = updatedProperty;
            IAService.setActiveInstance($scope.activeInstance);
            $scope.activeModelPropertiesChanged = !$scope.activeModelPropertiesChanged;
          });
      }
    };
    // delete model property
    $scope.deleteModelPropertyRequest = function(config) {
      if (config.id && config.modelId) {
        if (confirm('delete this model property?')){
          // this seems a bit redundant and could likely benefit
          // from refactoring
          // delete the property from the active instance and then reload the
          // whole instance again is 2 async calls
          PropertyService.deleteModelProperty(config).
            then(function(response) {
              ModelService.getModelInstanceById(config.modelId).
                then(function(instance) {
                  growl.addSuccessMessage('property deleted');
                  $scope.activeInstance = IAService.setActiveInstance(instance, CONST.MODEL_TYPE);
                  $scope.activeModelPropertiesChanged = !$scope.activeModelPropertiesChanged;
                }
              );
            }
          );
        }
      }
    };
    // update model property
    $scope.updateModelPropertyRequest = function(config) {
      var modelPropertyConfig = config.propertyConfig;
      if (modelPropertyConfig && modelPropertyConfig.modelId && modelPropertyConfig.id && modelPropertyConfig.name) {

        var propertyNameSnapshot = getPropertyNameSnapshot(config.currProperties);
        var currentIndex = getPropertyIndex(modelPropertyConfig.name, propertyNameSnapshot);


        PropertyService.updateModelProperty(modelPropertyConfig)
          .then(function(updatedProperty) {
            growl.addSuccessMessage('property updated');
            $scope.activeInstance.properties[currentIndex] = updatedProperty;
            IAService.setActiveInstance($scope.activeInstance);
            $scope.activeModelPropertiesChanged = !$scope.activeModelPropertiesChanged;
          });
      } else {
        $log.warn('update property called with insufficient parameters: ' + JSON.stringify(modelPropertyConfig));
      }

    };

    // create model property
    $scope.createNewModelProperty = function() {

      // make sure the model has finished initializing
      if ($scope.isCreatingModelDef) {
        return $timeout(function() {
          $scope.createNewModelProperty();
        }, 35);
      }

      // get model id
      var modelId = $scope.activeInstance.id;
      // should get a config (with at least name/type of property)

      if (modelId) {
        var propConfig = {
          name:'propertyName' + getRandomNumber(),
          type: 'string',
          facetName: CONST.NEW_MODEL_FACET_NAME,
          modelId: modelId
        };

        var newProperty = PropertyService.createModelProperty(propConfig);
        newProperty.
          then(function (result) {
            growl.addSuccessMessage('property created');
            $scope.activeInstance.properties.push(result);
            $scope.activeModelPropertiesChanged = !$scope.activeModelPropertiesChanged;
          }
        );
      }
      else {
        $log.warn('create model property called without valid modelId');
      }


    };
    function getRandomNumber() {
      return Math.floor((Math.random() * 100) + 1);
    }

    // editor tab clicked
    $scope.instanceTabItemClicked = function(id) {
      var openInstanceRefs = IAService.getOpenInstanceRefs();
      // defensive check to make sure the component is initialized
      if (openInstanceRefs && openInstanceRefs.length > 0){
        // only if the model isn't currently active
        if ($scope.activeInstance.id !== id) {
          var type;
          // get the type of instance
          for (var i = 0;i < openInstanceRefs.length;i++) {
            if (openInstanceRefs[i].id === id) {
              type = openInstanceRefs[i].type;
              break;
            }
          }
          if (type) {
            IAService.activateInstanceById(id, type).
              then(function(instance) {
                $scope.activeInstance = instance;
                $scope.clearSelectedInstances();
              }).
              catch(function(error) {
                console.warn('problem activating instance: ' + error);
              });
          }
          else {
            $log.warn('unable to get type from open instance ref: ' + id);
          }
        }
      }
    };

    // close editor tab
    $scope.instanceTabItemCloseClicked = function(id) {
      $scope.openInstanceRefs = IAService.closeInstanceById(id);

      // reset the active instance and reset tabs and nav
      if ($scope.activeInstance.id === id) {
        if ($scope.openInstanceRefs.length === 0) {
          IAService.clearActiveInstance();
          $scope.activeInstance = {};
          $scope.activeInstance = IAService.setActiveInstance($scope.activeInstance);
          $rootScope.$broadcast('IANavEvent');
        } else {
          // active the first instance by default
          IAService.activateInstanceById($scope.openInstanceRefs[0].id, $scope.openInstanceRefs[0].type).
            then(function(instance) {
              $scope.activeInstance = instance;
              $rootScope.$broadcast('IANavEvent');
            }
          );
        }
      }

      $scope.clearSelectedInstances();
    };

    $scope.selectModel = function(model) {
      $scope.activeInstance = IAService.setActiveInstance(model);
    };

    // update active instance
    $scope.updateActiveInstance = function(instance, type, id) {
      $scope.activeInstance = IAService.setActiveInstance(instance, type, id);
      $scope.openInstanceRefs = IAService.getOpenInstanceRefs();
    }

    $scope.updateActiveInstanceName = function(name) {
      $scope.activeInstance.name = name;
      $scope.activeInstanceUpdated = !$scope.activeInstanceUpdated;
    };

    // flag to prevent 'double' saves and race conditions during intial creation
    $scope.isCreatingModelDef = false;
    // save model
    $scope.saveModelInstanceRequest = function(instance) {
      var originalModelId = instance.definition.id;

      if (instance.id && (instance.id !== CONST.NEW_MODEL_PRE_ID)) {
        // update model
        if (!$scope.isCreatingModelDef) { // test to ensure not in init create cycle still
          ModelService.updateModelInstance(instance).
            then(function(instance) {
              growl.addSuccessMessage("model saved");
              $scope.activeInstance = instance;
              IAService.updateOpenInstanceRef(originalModelId, $scope.activeInstance.type, $scope.activeInstance);
              $scope.updateActiveInstance(
                $scope.activeInstance, CONST.DATASOURCE_TYPE, originalModelId);
              loadModels();
            }).
            catch(function(error) {
              $log.warn('bad update model definition: ' + error);
            });
        }

      }
      else {
        // double check to clear out 'new' id
        if (instance.definition.id === CONST.NEW_MODEL_PRE_ID) {
          delete instance.id;
          delete instance.definition.id;
        }
        if (!$scope.isCreatingModelDef) {
          $scope.isCreatingModelDef = true;
          // create model
          ModelService.createModelInstance(instance).
            then(function(instanceResponse) {

              growl.addSuccessMessage("model created");
              $scope.activeInstance = instanceResponse;
              $scope.isCreatingModelDef = false;  // toggle off creating flag
              IAService.updateOpenInstanceRef(originalModelId, $scope.activeInstance.type, $scope.activeInstance);
              $scope.updateActiveInstance(
                $scope.activeInstance, CONST.MODEL_TYPE, originalModelId);
              loadModels();
              $rootScope.$broadcast('IANavEvent');

            })
            .catch(function(error) {
              $scope.isCreatingModelDef = false;  // toggle off creating flag
              $log.error('bad create model instance ' + error.message);
            });
        }
      }
    };

    loadModels();

    function loadModels() {
      ModelService.getAllModelInstances()
        .then(function(result) {
          var ready = [];

          result.forEach(function(model) {
            ready.push(ModelService.getModelPropertiesById(model.id)
              .then(function(properties) {
                model.properties = properties;
              }));
          });

          $q.all(ready).then(function() {
            models.resolve(result);
          });
        });

      ModelService.getAllModelRelations()
        .then(function(results) {
          // TODO: setup relations
        });

      models.promise.then(function(models) {
        $scope.models = models;
        $scope.$broadcast('refreshModels');
      });
    }
  }
]);
