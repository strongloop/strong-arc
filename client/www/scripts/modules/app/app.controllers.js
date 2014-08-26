// Copyright StrongLoop 2014
app.controller('StudioController', [
  '$rootScope',
  '$scope',
  '$state',
  '$http',
  'IAService',
  'DataSourceService',
  'PropertyService',
  '$location',
  '$timeout',
  'ModelService',
  function($rootScope, $scope, $state, $http, IAService, DataSourceService, PropertyService, $location, $timeout, ModelService) {

    /*
     * Instance Collections
     * */
    $scope.mainNavDatasources = []; // initialized further down
    $scope.mainNavModels = [];  // initialized further down
    $scope.instanceType = 'model';
    $scope.activeInstance = {};
    $scope.modelNavIsVisible = true;
    $scope.dsNavIsVisible = true;
    $scope.globalExceptionStack = [];

    /*
    *
    * list of open instances (models/datasources)
    * collection of light-weight objects to keep UI context
    * - name
    * - type
    * - ?
    *
    * needs full IAService implementation (CRUD / utilities)
    * aim to replace currentOpenModelNames and currentOpenDatasourceNames
    *
    * */
    $scope.openInstanceRefs = IAService.getOpenInstanceRefs();

    // legacy
    $scope.currentOpenDatasourceNames = IAService.getOpenDatasourceNames();
    $scope.currentSelectedCollection = IAService.clearInstanceSelections();
    /*
    *
    * Dirty Flags
    *
    * */
    $scope.apiModelsChanged = false;  // dirty flag
    $scope.apiDataSourcesChanged = false;
    $scope.activeModelPropertiesChanged = false;  // dirty flag
    $scope.activeInstanceUpdated = false; // dirty toggle for active instance update


    // initialize active instance
    IAService.getActiveInstance().
      then(function(response) {
        $scope.activeInstance = response;
      }
    );


    /*
    *
    * MODEL and DATASOURCE collections
    *
    * */
    var loadModels = function() {
      $scope.mainNavModels = ModelService.getAllModels();
      $scope.mainNavModels.
        then(function (result) {
          $scope.mainNavModels = result;
          $scope.apiModelsChanged = !$scope.apiModelsChanged;
        }
      );
    };
    loadModels();
    /*
     *
     * Datasources
     *
     * */
    var loadDataSources = function() {
      $scope.mainNavDatasources = DataSourceService.getAllDatasources();
      $scope.mainNavDatasources.
        then(function (result) {

          $scope.mainNavDatasources = result;
          $scope.apiDataSourcesChanged = !$scope.apiDataSourcesChanged;


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



    // toggle instance view
    $scope.toggleInstanceContainer = function() {
      IAService.toggleInstanceView();
    };

    /*
    *
    * Open Instance By Id
    *
    * */
    $scope.openSelectedInstance = function(id, type) {
      if (id && type) {
        IAService.activateInstanceById(id, type).
          then(function(response) {
            $scope.openInstanceRefs = IAService.getOpenInstanceRefs();
            $scope.activeInstance = response;
          }).
          catch(function(response) {
            console.warn('problem activating instance: ' + '[' + id + ']' + response);
          }
        );
      }
    };
    /*
    *
    * Delete Instance by Id
    *
    *
    * */

    // delete instance
    $scope.deleteInstanceRequest = function(instanceId, type) {
      var refId = instanceId;
      if (refId){
        var confirmText = 'delete model?';
        if (type === CONST.DATASOURCE_TYPE){
          confirmText = 'delete datasource?';
        }
        if (confirm(confirmText)){

          if (type === CONST.MODEL_TYPE) {
            // delete the model
            ModelService.deleteModel(refId.definitionId, refId.configId).
              then(function(response){
                // remove from open instance refs
                resetActiveToFirstOpenInstance(refId.definitionId, CONST.MODEL_TYPE);
                loadModels();
              }
            );
          }
          else if (type === CONST.DATASOURCE_TYPE) {
            DataSourceService.deleteDataSource(refId).
              then(function(response){
                resetActiveToFirstOpenInstance(refId, CONST.MODEL_TYPE);
                loadDataSources();
              }
            );
          }
        }
      }
    };



    // branch clicked
    $scope.navTreeBranchClicked = function(type) {
      $scope.clearSelectedInstances();
    };

    // Main Nav Tree Item clicked
    $scope.navTreeItemClicked = function(type, targetId, multiSelect) {
      $scope.openSelectedInstance(targetId, type);
    };


    /*
    *
    * CONTENT EDIT TABS CLICK EVENTS
    *
    * need to add check if there are unsaved changes
    * before navigating away
    *
    * */
    $scope.instanceTabItemClicked = function(id) {
      var openInstanceRefs = IAService.getOpenInstanceRefs();
      // defensive check to make sure the component is initialized
      if (openInstanceRefs && openInstanceRefs.length > 0){
        // only if the model isn't currently active
        var targetInstance = IAService.activateInstanceById(id).
          then(function(targetInstance) {
            $scope.activeInstance = targetInstance;
            $scope.clearSelectedInstances();
          }
        );
      }
    };

    $scope.instanceTabItemCloseClicked = function(id) {

      $scope.openInstanceRefs = IAService.closeInstanceById(id);
      // reset the active instance and reset tabs and nav
      if ($scope.activeInstance.id === id) {
        if ($scope.openInstanceRefs.length === 0) {
          IAService.clearActiveInstance();
          $scope.activeInstance = {};
          $rootScope.$broadcast('IANavEvent');

        }
        else {

          // active the first instance by default
          IAService.activateInstanceById($scope.openInstanceRefs[0].id).
            then(function(instance) {
              $scope.activeInstance = instance;
              $rootScope.$broadcast('IANavEvent');
            }
          );
        }
      }
      $scope.clearSelectedInstances();
    };




    /*
    *
    *
    *
    *
    * Models IA
    *
    *
    *
    *
    * */
    // save model
    $scope.saveModelRequest = function(config) {

      if (config.id && (config.id !== CONST.NEW_MODEL_PRE_ID)) {
        var originalModelId = config.id;
        // update model
        ModelService.updateModel(config).
          then(function(response) {
            // clear reference to 'new' placeholder in openInstanceRefs
            $scope.activeInstance = IAService.setActiveInstance(response, CONST.MODEL_TYPE);
            IAService.clearOpenNewModelReference();
            loadModels();
          }
        );
      }
      else {
        // double check to clear out 'new' id
        if (config.id === CONST.NEW_MODEL_PRE_ID) {
          delete config.id;
        }
        // create model
        ModelService.createModel(config).
          then(function(response) {
            // clear reference to 'new' placeholder in openInstanceRefs

            $scope.activeInstance = IAService.setActiveInstance(response, CONST.MODEL_TYPE);
            $scope.openInstanceRefs = IAService.addInstanceRef({
              id:$scope.activeInstance.id,
              name:$scope.activeInstance.name,
              type: CONST.MODEL_TYPE
            });
            IAService.clearOpenNewModelReference();
            IAService.setActiveInstance($scope.activeInstance, CONST.MODEL_TYPE);
            loadModels();
            $rootScope.$broadcast('IANavEvent');
          }
        );
      }
    };

    $scope.createNewInstance = function(type) {
      // start New Model
      if (type) {
        var newDefaultInstance = {};
        if (type === CONST.MODEL_TYPE) {
          newDefaultInstance = ModelService.createNewModelInstance();
        }
        else if (type === CONST.DATASOURCE_TYPE) {
          newDefaultInstance = DataSourceService.createNewDataSourceInstance();
        }
        $scope.activeInstance = IAService.setActiveInstance(newDefaultInstance, type);
        $scope.openInstanceRefs = IAService.getOpenInstanceRefs();
        $scope.clearSelectedInstances();
        $rootScope.$broadcast('IANavEvent');
        IAService.showInstanceView();
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

     // New Model Name Input Processing
    $scope.processModelNameInput = function(input) {
      // placeholder method to process changes that need
      // to propagated when the model name changes

    };
    $scope.updateActiveInstanceName = function(name) {
      $scope.activeInstance.name = name;
      $scope.activeInstanceUpdated = !$scope.activeInstanceUpdated;
    };
    // Model Properties
    $scope.updateModelPropertyRequest = function(modelPropertyConfig) {
      if (modelPropertyConfig && modelPropertyConfig.modelId && modelPropertyConfig.name) {
        PropertyService.updateModelProperty(modelPropertyConfig);
        $scope.activeModelPropertiesChanged = !$scope.activeModelPropertiesChanged;

      }
    };
    $scope.deleteModelPropertyRequest = function(config) {
      if (config.id && config.modelId) {
        if (confirm('delete this model property?')){
          // this seems a bit redundant and could likely benefit
          // from refactoring
          // delete the property from the active instance and then reload the
          // whole instance again is 2 async calls
          PropertyService.deleteModelProperty(config).
            then(function(response) {
              ModelService.getModelById(config.modelId).
                then(function(response) {
                  $scope.activeInstance = IAService.setActiveInstance(response, CONST.MODEL_TYPE);
                }
              );
            }
          );
        }
      }
    };


    var resetActiveToFirstOpenInstance = function(refId, type) {
      $scope.openInstanceRefs = IAService.closeInstanceById(refId);
      // reset activeInstace if this is it
      if ($scope.activeInstance.id === refId) {
        if ($scope.openInstanceRefs.length === 0) {
          $scope.activeInstance = IAService.clearActiveInstance();
        }
        else {
          // active the first instance by default
          IAService.activateInstanceById($scope.openInstanceRefs[0].id).
            then(function(instance) {
              $scope.activeInstance = IAService.setActiveInstance(instance, type);
              $scope.openInstanceRefs = IAService.getOpenInstanceRefs();

              $rootScope.$broadcast('IANavEvent');
            }
          );
        }
      }
      else {
        $scope.openInstanceRefs = IAService.getOpenInstanceRefs();
      }


    };







    $scope.createNewProperty = function() {

      // get model id
      var modelId = $scope.activeInstance.id;
      // should get a config (with at least name/type of property)

      var propConfig = {
        name:'property-name-' + getRandomNumber(),
        type: 'string',
        facetName: CONST.NEW_MODEL_FACET_NAME,
        modelId: modelId
      };

      var newProperty = PropertyService.createModelProperty(propConfig);
      newProperty.
        then(function (result) {

          $scope.activeInstance.properties.push(result);
          // $scope.activeInstanceChanged = !$scope.activeInstanceChanged;
          $scope.activeModelPropertiesChanged = !$scope.activeModelPropertiesChanged;
        }
      );

    };


    /*
     *
     *   Datasource IA
     *
     *
     * */
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
          $scope.createNewInstance(CONST.DATASOURCE_TYPE);
        }
      }
      else {
        $scope.createNewInstance(CONST.DATASOURCE_TYPE);
      }
    };
    // test datasource connection
    $scope.testDataSourceConnection = function(config) {
      if (!config.connector) {
        alert('Select a connector first.');
        return;
      }

      $scope.updateOrCreateDatasource(config)
        .then(function(data) {
          return DataSourceService.testDataSourceConnection(data.id);
        })
        .then(function(response) {
          alert('DataSource status: ' + response.status);
        })
        .catch(function(err) {
          alert('DataSource error: ' + err.message);
        });
    };

    // save Datasource
    $scope.updateOrCreateDatasource = function(config) {
      var currentDatasource = config;
      if (config.id) {

        var originalDataSourceId = config.id;
        // make sure there is a facetName
        if (!config.facetName) {
          config.facetName = CONST.NEW_DATASOURCE_FACET_NAME;
        }

        // create DataSourceDefinition
        // double check to clear out 'new' id
        if (config.id === CONST.NEW_DATASOURCE_PRE_ID) {
          delete config.id;

          return DataSourceService.createDataSourceDefinition(config).
            then(function(response) {
              // clear reference to 'new' placeholder in openInstanceRefs
              $scope.activeInstance = IAService.setActiveInstance(response, CONST.DATASOURCE_TYPE);
              $scope.openInstanceRefs = IAService.addInstanceRef({
                id:$scope.activeInstance.id,
                name:$scope.activeInstance.name,
                type: CONST.DATASOURCE_TYPE
              });
              IAService.clearOpenNewDSReference();
              loadDataSources();
              $rootScope.$broadcast('IANavEvent');
              return response;
            }
          );
        }
        // update DataSourceDefinition
        else {
          return DataSourceService.updateDataSourceDefinition(config).
            then(function(response) {
                $scope.activeInstance = response;
                $scope.activeInstance.type = CONST.DATASOURCE_TYPE;
                IAService.setActiveInstance($scope.activeInstance, CONST.DATASOURCE_TYPE);
                loadDataSources();
                return response;
              }
            ).
            catch(function(response){
              console.warn('update DataSourceDefinition failed: ' + response.message);
            });
        }
      }
    };


    function getRandomNumber() {
      return Math.floor((Math.random() * 100) + 1);
    }

    $scope.clearGlobalException = function() {
      $scope.globalExceptionStack = IAService.clearGlobalExceptionStack();
    };
    $scope.$on('GlobalExceptionEvent', function(event, data) {
      $scope.globalExceptionStack = IAService.setGlobalException(data);
    });
    /*
     *
     *   IA STATE CLEANUP LISTENER
     *
     * */
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
          IAService.activateInstanceById(openInstanceRefs[0].id).
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
    viewModel.message = 'Strong Studio';
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

