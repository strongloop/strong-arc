// Copyright StrongLoop 2014
app.controller('SuiteController', ['$scope', '$rootScope', 'LandingService', 'ProfileService', function($scope, $rootScope, LandingService, ProfileService){
  $scope.suiteIA = {
    apps: []
  };

  $scope.isAuthUser = function(){
    return ProfileService.isAuthUser();
  };

  LandingService.getApps()
    .then(function(data){
      $scope.suiteIA.apps = data;
    });

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    //clear the selected app from previous page
    delete $scope.suiteIA.selectedApp;
  });

}]);

app.controller('StudioController', [
  '$rootScope',
  '$q',
  '$scope',
  '$state',
  '$http',
  'IAService',
  'DataSourceService',
  'DiscoveryService',
  'PropertyService',
  '$location',
  '$timeout',
  'ModelService',
  'growl',
  function($rootScope, $q, $scope, $state, $http, IAService, DataSourceService, DiscoveryService, PropertyService, $location, $timeout, ModelService, growl) {

    // Instance Collections
    $scope.mainNavDatasources = []; // initialized further down
    $scope.mainNavModels = [];  // initialized further down
    $scope.instanceType = 'model';
    $scope.activeInstance = {};
    $scope.modelNavIsVisible = true;
    $scope.dsNavIsVisible = true;
    $scope.globalExceptionStack = [];
    $scope.datasource = {
      connectionTestResponse:''
    };

    $scope.suiteIA.selectedApp =  {
      "id": "studio",
      "name": "API Composer"
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
        $rootScope.$broadcast('IANavEvent');
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


    // open instance
    $scope.openSelectedInstance = function(id, type) {
      if (id && type) {
        IAService.activateInstanceById(id, type).
          then(function(instance) {
            $scope.openInstanceRefs = IAService.getOpenInstanceRefs();
            $scope.activeInstance = instance;
            $rootScope.$broadcast('IANavEvent');
          }).
          catch(function(response) {
            console.warn('problem activating instance: ' + '[' + id + ']' + response);
          }
        );
      }
    };
    // delete instance
    $scope.deleteInstanceRequest = function(instanceIdConfig, type) {
      if (instanceIdConfig){
        var confirmText = 'delete model?';
        if (type === CONST.DATASOURCE_TYPE){
          confirmText = 'delete datasource?';
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
        console.warn('createNewInstance called with no type argument');
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
            console.warn('unable to get type from open instance ref: ' + id);
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

        }
        else {

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

    $scope.updateActiveInstanceName = function(name) {
      $scope.activeInstance.name = name;
      $scope.activeInstanceUpdated = !$scope.activeInstanceUpdated;
    };


    // save model
    $scope.saveModelInstanceRequest = function(instance) {
      var originalModelId = instance.definition.id;

      if (instance.id && (instance.id !== CONST.NEW_MODEL_PRE_ID)) {
        // update model
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
          console.warn('bad update model definition: ' + error);
        });
      }
      else {
        // double check to clear out 'new' id
        if (instance.definition.id === CONST.NEW_MODEL_PRE_ID) {
          delete instance.id;
          delete instance.definition.id;
        }
        // create model
        ModelService.createModelInstance(instance).
          then(function(instanceResponse) {
            growl.addSuccessMessage("model created");
            $scope.activeInstance = instanceResponse;
            IAService.updateOpenInstanceRef(originalModelId, $scope.activeInstance.type, $scope.activeInstance);
            $scope.updateActiveInstance(
              $scope.activeInstance, CONST.MODEL_TYPE, originalModelId);
            loadModels();
            $rootScope.$broadcast('IANavEvent');
          }
        );
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
          growl.addSuccessMessage("model migrated");
        });
    }

    // update model property
    $scope.updateModelPropertyRequest = function(modelPropertyConfig) {
      if (modelPropertyConfig && modelPropertyConfig.modelId && modelPropertyConfig.name) {
        PropertyService.updateModelProperty(modelPropertyConfig);
        $scope.activeModelPropertiesChanged = !$scope.activeModelPropertiesChanged;

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

      // get model id
      var modelId = $scope.activeInstance.id;
      // should get a config (with at least name/type of property)

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
              growl.addSuccessMessage("datasource created");
              $rootScope.$broadcast('IANavEvent');
              return $scope.activeInstance;

            }
          );
        }
        // update DataSourceDefinition
        else {
          return DataSourceService.updateDataSourceInstance(targetInstance).
            then(function(instance) {
              growl.addSuccessMessage('datasource updated');
              $scope.activeInstance = instance;
              IAService.updateOpenInstanceRef(originalDataSourceId, $scope.activeInstance.type, $scope.activeInstance);
              $scope.updateActiveInstance(
                $scope.activeInstance, CONST.DATASOURCE_TYPE, originalDataSourceId);
              loadDataSources();
              return $scope.activeInstance;
            })
            .catch(function(error){
              console.warn('bad datasource definition update: ' + error);
              growl.addErrorMessage('error updating datasource definition');
            }

          );
        }
      }
    };
    // test datasource connection
    $scope.testDataSourceConnection = function(instance) {
      var dsDef = instance.definition;

      if (!dsDef.connector) {
         setFriendlyTestConnectionMsg('Failed: missing connector');
        return;
      }

      $scope.clearTestMessage();


      $scope.saveDataSourceInstanceRequest(instance)
        .then(function(data) {
          return DataSourceService.testDataSourceConnection(data.id);
        })
        .then(function(response) {
          setFriendlyTestConnectionMsg(response);
        })
        .catch(function(err) {
          // Note: The http error is reported in the global error view
          setFriendlyTestConnectionMsg('Failed.');
        });


    };
    $scope.clearTestMessage = function() {
      $scope.datasource.connectionTestResponse = '';
    };
    var setFriendlyTestConnectionMsg = function(response) {
      var message;
      if (typeof response === 'string') {
        message = response;
      } else if (response.status) {
        message = 'Success';
      } else if (!response.error) {
        message = 'Failed.';
      } else {
        message = 'Failed: ' + response.error.message;
      }
      $scope.datasource.connectionTestResponse = message;
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

      // open a modal window and trigger the discovery flow
      var modalConfig = DiscoveryService.getDiscoveryModalConfig(id);
      var modalInstance = IAService.openModal(modalConfig);
      modalInstance.opened.then(function() {
        window.setUI();
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

      $scope.clearTestMessage();

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


app.controller('HomeMainController',[
  '$scope',
  '$location',
  function($scope, $location){
    var viewModel = {};
    viewModel.message = 'StrongLoop Studio';
    $scope.viewModel = viewModel;


  }
]);
/*
*
* */
app.controller('GlobalNavController',[
  '$scope',
  'ProfileService',
  '$location',
  function($scope, ProfileService, $location) {
    $scope.isAuthUser = function(){
      return ProfileService.getCurrentUserId();
    };
  }
]);

app.controller('DevToolsController',[
  '$scope',
  '$location',
  function($scope, $location){

    $scope.suiteIA.selectedApp = {
      "id": "devtools",
      "name": "Profiler"
    };
  }
]);
