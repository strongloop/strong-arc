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
<<<<<<< HEAD
    $scope.modelNavIsVisible = true;
    $scope.dsNavIsVisible = true;
=======
    $scope.globalExceptionStack = [];
>>>>>>> first cut at global exception handling

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
    var reloadOpenInstances = function() {
      $scope.openInstanceRefs = IAService.getOpenInstanceRefs();
    };
    reloadOpenInstances();


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
          $rootScope.$broadcast('IANavEvent');
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

    // branch clicked
    $scope.navTreeBranchClicked = function(type) {
      $scope.clearSelectedInstances();
    };

    // Main Nav Tree Item clicked
    $scope.navTreeItemClicked = function(type, targetId, multiSelect) {
<<<<<<< HEAD
      $scope.openSelectedInstance(targetId, type);
=======

      switch (type){

        case 'model':
          /*
           * cases:
           * - item is not open: open preview view of item
           * - item is open and active: do nothing
           * - item is open but not active: activate item
           *
           * */

          //jQuery('[data-id="CanvasApiContainer"]').transition({ x: 1000 });
          var openModelNames = IAService.getOpenModelNames();
          var targetModel = ModelService.getModelById(targetId).
            then(function(targetModel) {
              $scope.activeInstance = IAService.setActiveInstance(targetModel, 'model');
              reloadOpenInstances();
              $scope.currentOpenModelNames = IAService.getOpenModelNames();
              $scope.clearSelectedInstances();
              IAService.showInstanceView();
              $rootScope.$broadcast('IANavEvent');

            }
          );

          // check for preview mode




          break;
        case 'datasource':
          //$scope.previewInstance = DataSourceService.getDatasourceByName(target);
          /*
           * cases:
           * - item is not open: open preview view of item
           * - item is open and active: do nothing
           * - item is open but not active: activate item
           *
           * */

          var openDatasourceNames = IAService.getOpenDatasourceNames();
          var targetDataSource = DataSourceService.getDataSourceById(targetId).
            then(function(targetDataSource) {
              $scope.activeInstance = IAService.setActiveInstance(targetDataSource, 'datasource');
              reloadOpenInstances();
              $scope.currentOpenDataSourceNames = IAService.getOpenDatasourceNames();
              $scope.clearSelectedInstances();
              IAService.showInstanceView();
              $rootScope.$broadcast('IANavEvent');

            }
          );

          break;

        default:
      }
>>>>>>> first cut at global exception handling
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
        reloadOpenInstances();
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
            IAService.clearOpenNewModelReference();
            $scope.activeInstance = IAService.setActiveInstance(response, CONST.MODEL_TYPE);
            loadModels();
<<<<<<< HEAD
=======
            $scope.activeInstance = response;
            IAService.closeInstanceById(originalModelId);
            IAService.addInstanceRef({
              id:$scope.activeInstance.id,
              name:$scope.activeInstance.name,
              type:CONST.MODEL_TYPE
            });
            IAService.setActiveInstance($scope.activeInstance, CONST.MODEL_TYPE);
            reloadOpenInstances();
>>>>>>> first cut at global exception handling
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
            IAService.clearOpenNewModelReference();
            loadModels();
            $scope.activeInstance = response;
            IAService.setActiveInstance($scope.activeInstance, CONST.MODEL_TYPE);
            reloadOpenInstances();
          }
        );
      }
    };

    $scope.createModelViewRequest = function() {
      $scope.instanceType = 'model';
      $scope.activeInstance = ModelService.createNewModelInstance();
      $scope.activeInstance = IAService.setActiveInstance($scope.activeInstance, 'model');
      $scope.openInstanceRefs = IAService.getOpenInstanceRefs();
      $scope.clearSelectedInstances();
      IAService.showInstanceView();
      $rootScope.$broadcast('IANavEvent');

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
    // delete models
    $scope.deleteModelDefinitionRequest = function(modelId) {
      if (modelId){
        if (confirm('delete model?')){
          // remove from open instance refs
          $scope.openInstanceRefs = IAService.closeInstanceById(modelId);
          // reset activeInstace if this is it
          if ($scope.activeInstance.id === modelId) {
            if ($scope.openInstanceRefs.length === 0) {
              IAService.clearActiveInstance();
              $rootScope.$broadcast('IANavEvent');

            }
            else {

              // active the first instance by default
              IAService.activateInstanceById($scope.openInstanceRefs[0].id).
                then(function(instance) {
                  $scope.activeInstance = instance;
                  reloadOpenInstances();
                  $rootScope.$broadcast('IANavEvent');
                }
              );
            }
          }

          ModelService.deleteModel(modelId).
            then(function(response){
              loadModels();
            }
          );
        }
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
      $scope.instanceType = 'datasource';
      $scope.activeInstance =
        DataSourceService.createNewDatasourceInstance(initialData);
      $scope.openInstanceRefs = IAService.getOpenInstanceRefs();
      $scope.clearSelectedInstances();
      IAService.showInstanceView();
      $rootScope.$broadcast('IANavEvent');

    };
    // test datasource connection
    $scope.testDataSourceConnection = function(config) {

      DataSourceService.testDataSourceConnection(config).
        then(function(response) {
          alert('DataSource status: ' + response.status);
        })
        .catch(function(err) {
          alert('DataSource error: ' + err);
        });
    };

    // delete datasource
    $scope.deleteDataSourceDefinitionRequest = function(dsId) {
      if (dsId){
        if (confirm('delete datasource?')){
          // remove from open instance refs
          $scope.openInstanceRefs = IAService.closeInstanceById(dsId);
          // check if instance is activeInstance
          if ($scope.openInstanceRefs.length === 0) {
            IAService.clearActiveInstance();
            $rootScope.$broadcast('IANavEvent');

          }
          else {

            // active the first instance by default
            IAService.activateInstanceById($scope.openInstanceRefs[0].id).
              then(function(instance) {
                $scope.activeInstance = instance;
                reloadOpenInstances();
                $rootScope.$broadcast('IANavEvent');
              }
            );
          }

          DataSourceService.deleteDataSource(dsId).
            then(function(response){
              loadDataSources();
              reloadOpenInstances();
            }
          );
        }
      }
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

          DataSourceService.createDataSourceDefinition(config).
            then(function(response) {
              // clear reference to 'new' placeholder in openInstanceRefs
              IAService.clearOpenNewDSReference();
              $scope.activeInstance = response;
              $scope.activeInstance.type = CONST.DATASOURCE_TYPE;
              IAService.closeInstanceById(originalDataSourceId);
              IAService.addInstanceRef({
                id:$scope.activeInstance.id,
                name:$scope.activeInstance.name,
                type:$scope.activeInstance.type
              });
              IAService.setActiveInstance($scope.activeInstance, CONST.DATASOURCE_TYPE);
              reloadOpenInstances();
              loadDataSources();
            }
          );
        }
        // update DataSourceDefinition
        else {
          DataSourceService.updateDataSourceDefinition(config).
            then(function(response) {
                $scope.activeInstance = response;
                $scope.activeInstance.type = CONST.DATASOURCE_TYPE;
                IAService.setActiveInstance($scope.activeInstance, CONST.DATASOURCE_TYPE);
              reloadOpenInstances();
                loadDataSources();
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

    $scope.$on('GlobalExceptionEvent', function(event, data) {
      $scope.globalExceptionStack.push(data);
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

