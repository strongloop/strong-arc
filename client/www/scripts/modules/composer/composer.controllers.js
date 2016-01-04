Composer.controller('ComposerMainController', [
  '$rootScope',
  '$q',
  '$log',
  '$scope',
  '$state',
  '$http',
  'IAService',
  'DataSourceService',
  'WorkspaceServices',
  'DiscoveryService',
  'PropertyService',
  '$location',
  '$timeout',
  'ModelService',
  'growl',
  function($rootScope, $q, $log, $scope, $state, $http, IAService, DataSourceService, WorkspaceServices, DiscoveryService, PropertyService, $location, $timeout, ModelService, growl) {

    // Instance Collections
    $scope.mainNavDatasources = []; // initialized further down
    $scope.mainNavModels = [];  // initialized further down
    $scope.instanceType = 'model';
    $scope.activeInstance = {};
    $scope.modelNavIsVisible = true;
    $scope.dsNavIsVisible = true;
    $scope.globalExceptionStack = [];
    $scope.datasource = {
      connectionTestResponse: '',
      connectionTestResponseType: 'success'
    };

    // list of open instances (models/datasources)
    $scope.openInstanceRefs = IAService.getOpenInstanceRefs();

    // legacy
    $scope.currentOpenDatasourceNames = IAService.getOpenDatasourceNames();
    $scope.currentSelectedCollection = IAService.clearInstanceSelections();
    // dirty flags
    $scope.apiModelsChanged = false;  // dirty flag
    $scope.apiDataSourcesChanged = false;
    $scope.activeModelPropertiesChanged = false;  // dirty flag
    $scope.activeInstanceUpdated = false; // dirty toggle for active instance update

    // initialize UI state
    // set active instance if available
    $rootScope.$watch('projectName', function(name) {
      if (name) {
        // initialize active instance
        $scope.activeInstance = IAService.getActiveInstance();
        if ($scope.activeInstance) {
          // refresh the instance to avloid stale data between server/client
          IAService.activateInstanceById($scope.activeInstance.id, $scope.activeInstance.type)
            .then(function(response) {
              $scope.activeInstance = response;
              $rootScope.$broadcast('IANavEvent');
            });
        }

      }
    });
    // Validate the workspace
    WorkspaceServices.validate().then(function(isValid) {
      if (!isValid) {
        $rootScope.$broadcast('GlobalExceptionEvent', {
            isFatal: true,
            message: WorkspaceServices.validationError.message,
            code: WorkspaceServices.validationError.code,
            details: 'API Composer only works with valid LoopBack projects',
            help: [
              { text: 'Ensure you have LoopBack installed and create your project using the slc loopback command.' },
              { text: 'See:' },
              { link: 'http://loopback.io/',
                text: 'LoopBack getting started guide' },
              { text: 'for more information' }
            ]
          }
        );
      }
    });


    // Load Model and DataSource collections
    var loadModels = function() {
      $scope.mainNavModels = ModelService.getAllModelInstances();
      $scope.mainNavModels.
        then(function (result) {
          $scope.mainNavModels = result;
          $scope.apiModelsChanged = !$scope.apiModelsChanged;
          $rootScope.$broadcast('IANavEvent');
        }
      );
    };
    loadModels();
    var loadDataSources = function() {
      $scope.mainNavDatasources = DataSourceService.getAllDataSourceInstances();
      $scope.mainNavDatasources.
        then(function (result) {
          $scope.mainNavDatasources = result;
          $scope.apiDataSourcesChanged = !$scope.apiDataSourcesChanged;
          $rootScope.$broadcast('IANavEvent');
        });
    };
    loadDataSources();

    // Helper methods
    $scope.clearSelectedInstances = function() {
      $scope.instanceSelections = IAService.clearInstanceSelections();
    };
    $scope.clearSelectedDatasources = function() {
      $scope.currentDatasourceSelections = IAService.clearSelectedDatasourceNames();
    };
    $scope.setApiModelsDirty = function() {
      $scope.apiModelsChanged = !$scope.apiModelsChanged;
    };

    $scope.$watchGroup(['activeInstance', 'openInstanceRefs'],
      function(newVal) {
        if (!Array.isArray($scope.openInstanceRefs)) {
          return;
        }

        $scope.tabItems = $scope.openInstanceRefs.map(
          function(openInstance) {
            return angular.extend({}, openInstance, {
              isActive: openInstance.name === $scope.activeInstance.name
            });
          }
        );
      }
    );

    $scope.openSelectedInstance = function(id, type) {
      if (id && type) {
        IAService.activateInstanceById(id, type).
          then(function(instance) {
            $scope.openInstanceRefs = IAService.getOpenInstanceRefs();
            $scope.activeInstance = instance;
            $rootScope.$broadcast('IANavEvent');
          }).
          catch(function(response) {
            $log.warn('problem activating instance: ' + '[' + id + ']' + response);
          }
        );
      }
    };
    // delete instance
    $scope.deleteInstanceRequest = function(instanceIdConfig, type) {
      if (instanceIdConfig){
        var confirmText = 'delete model?';
        if (type === CONST.DATASOURCE_TYPE){
          confirmText = 'delete data source?';
        }
        if (confirm(confirmText)){

          if (type === CONST.MODEL_TYPE) {
            // delete the model
            ModelService.deleteModelInstance(instanceIdConfig.definitionId, instanceIdConfig.configId).
              then(function(response){
                // remove from open instance refs
                $scope.activeInstance = IAService.resetActiveToFirstOpenInstance(instanceIdConfig.definitionId);
                loadModels();
              }
            );
          }
          else if (type === CONST.DATASOURCE_TYPE) {

            DataSourceService.deleteDataSourceInstance(instanceIdConfig.definitionId).
              then(function(response){
                $scope.activeInstance = IAService.resetActiveToFirstOpenInstance(instanceIdConfig.definitionId);

                //reset data source for models using the deleted datasource
                var models = $scope.mainNavModels.filter(function(model){
                  var dataSourceId = instanceIdConfig.definitionId.split('.')[1];

                  return model.config.dataSource === dataSourceId;
                });

                models.forEach(function(model){
                  model.config.dataSource = null;

                  //save the model
                  ModelService.updateModelInstance(model);
                });

                loadModels();
                loadDataSources();
              }
            );
          }
        }
      }
    };
    // create new instance
    $scope.createNewInstance = function(type, initialData) {
      // start New Model
      if (!type) {
        $log.warn('createNewInstance called with no type argument');
        return;
      }
      var newDefaultInstance = {};
      if (type === CONST.MODEL_TYPE) {
        // check if new model is already open
        if (IAService.isNewModelOpen()) {
          // easier to just close it an refresh than to activate existing instance ref
          IAService.closeInstanceById(CONST.NEW_MODEL_PRE_ID);
        }
        newDefaultInstance = ModelService.createNewModelInstance(initialData);
      }
      else if (type === CONST.DATASOURCE_TYPE) {
        if (IAService.isNewDataSourceOpen()) {
          IAService.closeInstanceById(CONST.NEW_DATASOURCE_PRE_ID);
        }
        newDefaultInstance = DataSourceService.createNewDataSourceInstance(initialData);
      }
      $scope.activeInstance = IAService.setActiveInstance(newDefaultInstance);
      IAService.addInstanceRef($scope.activeInstance);
      $scope.openInstanceRefs = IAService.getOpenInstanceRefs();
      $scope.clearSelectedInstances();
      $rootScope.$broadcast('IANavEvent');

    };
    // update active instance
    $scope.updateActiveInstance = function(instance, type, id) {
      $scope.activeInstance = IAService.setActiveInstance(instance, type, id);
      $scope.openInstanceRefs = IAService.getOpenInstanceRefs();
    };

    // nav branch clicked
    $scope.navTreeBranchClicked = function(type) {
      $scope.clearSelectedInstances();
    };
    // nav tree item clicked
    $scope.navTreeItemClicked = function(type, targetId, multiSelect) {
      $scope.openSelectedInstance(targetId, type);
    };

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
          $scope.activeInstance = IAService.setActiveInstance({});
          $rootScope.$broadcast('IANavEvent');
        } else {
          // active the first instance by default
          IAService.activateInstanceById($scope.openInstanceRefs[0].id, $scope.openInstanceRefs[0].type).
            then(function(instance) {
              $scope.activeInstance = instance;
              $rootScope.$broadcast('IANavEvent');
            });
        }
      }

      $scope.clearSelectedInstances();
    };

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
    $scope.createModelViewRequest = function() {
      $scope.instanceType = CONST.MODEL_TYPE;
      var isNewOpen = IAService.isNewModelOpen();


      // check to see if new mode is already open

      if (isNewOpen) {
        // if it is check if it is active
        // if new model is open but not active then just close it and
        // start a fresh one
        // the downside of this is that any unsaved data will be lost
        // unfortunately the way the open tabs are handled the data isn't there anyway
        // so will have to enhance in the future to preserve unsaved and inactive data
        // TODO sean
        if ($scope.activeInstance && ($scope.activeInstance.id !== CONST.NEW_MODEL_PRE_ID)) {
          $scope.openInstanceRefs = IAService.closeInstanceById(CONST.NEW_MODEL_PRE_ID);
          $scope.createNewInstance(CONST.MODEL_TYPE);
        }
      }
      else {
        $scope.createNewInstance(CONST.MODEL_TYPE);
      }




    };

    $scope.migrateModelConfig = function(config) {
      var instance = $scope.activeInstance;
      instance.isMigrating = true;
      return ModelService.migrateModelConfig(config)
        .then(function() {
          instance.isMigrating = false;
        }, function(ex) {
          growl.addErrorMessage(
            'could not migrate model (check console for details)'
          );
        })
        .then(function() {
          growl.addSuccessMessage('model migrated');
        });
    }

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
      }
      else {
        $log.warn('update property called with insufficient parameters: ' + JSON.stringify(modelPropertyConfig));
      }

    };
    function getPropertyNameSnapshot(propArray) {
      var retArray = [];
      propArray.map(function(item) {
        retArray.push(item.name);
      });
      return retArray;
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
                  growl.addSuccessMessage("property deleted");
                  $scope.activeInstance = IAService.setActiveInstance(instance, CONST.MODEL_TYPE);
                  $scope.activeModelPropertiesChanged = !$scope.activeModelPropertiesChanged;                }
              );
            }
          );
        }
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
            growl.addSuccessMessage("property created");
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

    // open datasource editor
    $scope.createDatasourceViewRequest = function(initialData) {
      $scope.instanceType = CONST.DATASOURCE_TYPE;
      var isNewOpen = IAService.isNewDataSourceOpen();
      // check to see if new mode is already open
      if (isNewOpen) {
        // if it is check if it is active
        // if new model is open but not active then just close it and
        // start a fresh one
        if ($scope.activeInstance && ($scope.activeInstance.id !== CONST.NEW_DATASOURCE_PRE_ID)) {
          $scope.openInstanceRefs = IAService.closeInstanceById(CONST.NEW_DATASOURCE_PRE_ID);
          $scope.createNewInstance(CONST.DATASOURCE_TYPE, initialData);
        }
      }
      else {
        $scope.createNewInstance(CONST.DATASOURCE_TYPE, initialData);
      }
    };

    // save DataSource instance
    $scope.saveDataSourceInstanceRequest = function(targetInstance) {
      var targetDef = targetInstance.definition;

      if (targetDef.id) {

        var originalDataSourceId = targetDef.id;
        // make sure there is a facetName
        if (!targetDef.facetName) {
          targetDef.facetName = CONST.NEW_DATASOURCE_FACET_NAME;
        }

        // create DataSourceDefinition
        // double check to clear out 'new' id
        if (targetDef.id === CONST.NEW_DATASOURCE_PRE_ID) {
          delete targetDef.id;

          return DataSourceService.createDataSourceInstance(targetInstance).
            then(function(instance) {
              $scope.activeInstance = instance;
              IAService.updateOpenInstanceRef(originalDataSourceId, $scope.activeInstance.type, $scope.activeInstance);
              $scope.updateActiveInstance(
                $scope.activeInstance, CONST.DATASOURCE_TYPE, originalDataSourceId);
              loadDataSources();
              growl.addSuccessMessage("data source created");
              $rootScope.$broadcast('IANavEvent');
              return $scope.activeInstance;

            }
          );
        }
        // update DataSourceDefinition
        else {
          return DataSourceService.updateDataSourceInstance(targetInstance).
            then(function(instance) {
              growl.addSuccessMessage('data source updated');
              $scope.activeInstance = instance;
              IAService.updateOpenInstanceRef(originalDataSourceId, $scope.activeInstance.type, $scope.activeInstance);
              $scope.updateActiveInstance(
                $scope.activeInstance, CONST.DATASOURCE_TYPE, originalDataSourceId);
              loadDataSources();
              return $scope.activeInstance;
            })
            .catch(function(error){
              $log.warn('bad data source definition update: ' + error);
              growl.addErrorMessage('error updating data source definition');
            }

          );
        }
      }
    };

    // test datasource connection
    $scope.testDataSourceConnection = function(instance) {
      var dsDef = instance.definition;

      if (!dsDef.connector) {
        growl.addErrorMessage('Failed: missing connector');
        return;
      }

      return $scope.saveDataSourceInstanceRequest(instance)
        .then(function(data) {
          return DataSourceService.testDataSourceConnection(data.id);
        })
        .catch(function(err) {
          return {
            status: false,
            error: {
              message: 'Failed.'
            }
          };
        });
    };

    // global exception
    $scope.clearGlobalException = function() {
      $scope.globalExceptionStack = IAService.clearGlobalExceptionStack();
    };

    /*
     *
     * DISCOVERY
     *
     * */

    // new schema event
    $scope.$on('newSchemaModelsEvent', function(event, message){
      $scope.openInstanceRefs = IAService.getOpenInstanceRefs();
      $scope.activeInstance = IAService.getActiveInstance();
      $scope.instanceType = 'model';
      $scope.activeInstance.type = 'model';
      // note that the handler is passed the problem domain parameters
      loadModels();
      $scope.setApiModelsDirty();


    });
    $scope.createModelsFromDS = function(id) {
      DataSourceService.testDataSourceConnection(id)
        .then(function(response) {
          if (response.status) {
            // open a modal window and trigger the discovery flow
            var modalConfig = DiscoveryService.getDiscoveryModalConfig(id);
            var modalInstance = IAService.openModal(modalConfig);
            modalInstance.opened.then(function() {
              window.setUI();
            });
          }
          else {
            $rootScope.$broadcast('GlobalExceptionEvent', response.error);
          }
        })
        .catch(function(error) {
          $rootScope.$broadcast('GlobalExceptionEvent', error);
        });
    };


    /*
    *
    * Event Listeners
    *
    * keep these to absolute minimum - in principle
    *
    * */
    $scope.$on('GlobalExceptionEvent', function(event, data) {
      $scope.globalExceptionStack = IAService.setGlobalException(data);
    });
    // nav event
    $scope.$on('IANavEvent', function(event, data) {

      var currActiveInstance = $scope.activeInstance;
      var openInstanceRefs = IAService.getOpenInstanceRefs();

      // check if there is an active instance
      if (currActiveInstance && currActiveInstance.id) {
        var instanceObjRef = {
          id:currActiveInstance.id,
          name:currActiveInstance.name,
          type:currActiveInstance.type
        };
        // check if there are open instances and that activeInstance is in it
        if (openInstanceRefs.length > 0) {
          var isActiveInstanceOpen = false;
          // loop over the refs to confirm active instance is in there
          for (var i = 0;i < openInstanceRefs.length;i++) {
            if (openInstanceRefs[i].id === currActiveInstance.id) {
              // active instance is open
              isActiveInstanceOpen = true;
              break;
            }
          }
          // if it isn't in there we need to add it
          if (!isActiveInstanceOpen) {
            // add active instance to open instance refs

            $scope.openInstanceRefs = IAService.addInstanceRef(instanceObjRef);
          }

        }
        else {
          // we have a mismatch - we have an active instance but no open instance refs
          // add active instance to openInstanceRefs

          $scope.openInstanceRefs = IAService.addInstanceRef(instanceObjRef);
        }
      }
      else {
        // there is no active instance so confirm there are no open instance refs
        if (openInstanceRefs.length > 0) {
          // we have a mismatch - we have open instances but none are active
          // set the 0 index open instance ref to the active instance
          // active the first instance by default
          IAService.activateInstanceById(openInstanceRefs[0].id, openInstanceRefs[0].type).
            then(function(instance) {
              $scope.activeInstance = instance;
              $rootScope.$broadcast('IANavEvent');
            }
          );
        }
        else {
          // there are no open instances so we're good - everything is closed
        }

      }
      $scope.openInstanceRefs = IAService.getOpenInstanceRefs();
    });

  }
]);
