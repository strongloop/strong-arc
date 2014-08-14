// Copyright StrongLoop 2014
app.controller('StudioController', [
  '$rootScope',
  '$scope',
  '$state',
  '$http',
  'IAService',
  'DataSourceService',
  'PropertyService',
  'ExplorerService',
  '$location',
  '$timeout',
  'ModelService',
  'DiscoveryService',
  function($rootScope, $scope, $state, $http, IAService, DataSourceService, PropertyService, ExplorerService, $location, $timeout, ModelService, DiscoveryService) {

    /*
     * Instance Collections
     * */
    $scope.mainNavDatasources = []; // initialized further down
    $scope.mainNavModels = [];  // initialized further down
    $scope.instanceType = 'model';
    $scope.activeInstance = {};

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
    $scope.latestExplorerEndPointResponses = []; // array of named responses for explorer endpoints to hold latest server responses
    $scope.explorerViewXPos = IAService.getExplorerViewXPos();  // for when the user controls it
    //$scope.editorViewXPos = IAService.getEditorViewXPos();
    /*
    *
    * Dirty Flags
    *
    * */
    $scope.apiModelsChanged = false;  // dirty flag
    $scope.apiDataSourcesChanged = false;
    $scope.activeModelPropertiesChanged = false;  // dirty flag
    $scope.explorerDataModelChanged = false; // dirty toggle for triggering renders on the react components


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






    /*
    *
    * API Explorer View
    *
    * */
    $scope.explorerResources = ExplorerService.getEResources().then(function(result) {
      $scope.explorerResources = result;
    });



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
     * branch clicked
     * */
    $scope.navTreeBranchClicked = function(type) {
      console.log('Tree Branch Clicked');
      // change the z-index on the main content to bring the
      // canvas to the fore
      // get reference to the following:
      /*
       [data-id="ModelEditorMainContainer"]
       [data-id="CanvasApiContainer"]
       [data-id="PreviewInstanceContainer"]
       *
       * */
      IAService.showCanvasView();



      $scope.clearSelectedInstances();

    };


    // Main Nav Tree Item clicked
    $scope.navTreeItemClicked = function(type, targetId, multiSelect) {

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
              $scope.openInstanceRefs = IAService.getOpenInstanceRefs();
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
              $scope.openInstanceRefs = IAService.getOpenInstanceRefs();
              $scope.currentOpenDataSourceNames = IAService.getOpenDatasourceNames();
              $scope.clearSelectedInstances();
              IAService.showInstanceView();
              $rootScope.$broadcast('IANavEvent');

            }
          );

          break;

        default:
      }
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
    * DELETE
    * */
    // delete models
    $scope.deleteModelDefinitionRequest = function(modelId) {
      if (modelId){
        if (confirm('delete model?')){
          console.log('delete this model: ' + modelId);
          ModelService.deleteModel(modelId).
            then(function(response){
              loadModels();
            }
          );
        }
      }
    };
    // delete datasource
    $scope.deleteDataSourceDefinitionRequest = function(dsId) {
      if (dsId){
        if (confirm('delete datasource?')){
          console.log('delete this datasource: ' + dsId);
          DataSourceService.deleteDataSource(dsId).
            then(function(response){
              loadDataSources();
            }
          );
        }
      }
    };

    /*
    * Models IA
    * */
    $scope.openSelectedModels = function() {
      var selectedModels = IAService.getCurrentInstanceSelections();
      if (selectedModels) {
        for (var i = 0; i < selectedModels.length;i++) {
          $scope.activeInstance = IAService.activateInstanceByName(selectedModels[i]);
        }
        $scope.currentOpenModelNames = IAService.getOpenModelNames();

        $scope.clearSelectedInstances();
        $rootScope.$broadcast('IANavEvent');

      }
    };

    // save model
    $scope.saveModelRequest = function(config) {

      if (config.id && (config.id !== CONST.newModelPreId)) {
        // update model
        ModelService.updateModel(config).
          then(function(response) {
            // clear reference to 'new' placeholder in openInstanceRefs
            IAService.clearOpenNewModelReference();
            loadModels();
            $scope.activeInstance = response;
          }
        );
      }
      else {
        // double check to clear out 'new' id
        if (config.id === CONST.newModelPreId) {
          delete config.id;
        }
        // create model
        ModelService.createModel(config).
          then(function(response) {
            // clear reference to 'new' placeholder in openInstanceRefs
            IAService.clearOpenNewModelReference();
            loadModels();
            $scope.activeInstance = response;
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
      $scope.newModelInstance = {};
      $scope.newModelInstance.name = input;
      var modelCount = $scope.mainNavModels.length;
      $scope.newModelInstance.isUnique = true;
      for (var i = 0;i < modelCount;i++) {
        var modelInstance = $scope.mainNavModels[i];
        var compString = modelInstance.name.substr(0, input.length);
        if (compString === input) {
          $scope.newModelInstance.isUnique = false;
          break;
        }
      }
    };
    // Model Properties
    $scope.updateModelPropertyRequest = function(modelPropertyConfig) {
      if (modelPropertyConfig && modelPropertyConfig.modelId && modelPropertyConfig.name) {
        PropertyService.updateModelProperty(modelPropertyConfig);
        $scope.activeModelPropertiesChanged = !$scope.activeModelPropertiesChanged;

      }
    };
    $scope.createNewProperty = function() {

      // get model id
      var modelId = $scope.activeInstance.id;
      // should get a config (with at least name/type of property)

      var propConfig = {
        name:'property-name-' + getRandomNumber(),
        type: 'string',
        facetName: 'common',
        modelId: modelId
      };

      var newProperty = PropertyService.createModelProperty(propConfig);
      newProperty.
        then(function (result) {

          $scope.activeInstance.properties.push(result);
          // $scope.activeInstanceChanged = !$scope.activeInstanceChanged;
          $scope.activeModelPropertiesChanged = !$scope.activeModelPropertiesChanged;
          console.log('good add new model property')
        }
      );

    };


    /*
     *
     *   Datasource IA
     *
     *
     * */
    $scope.createDatasourceViewRequest = function() {
      $scope.instanceType = 'datasource';
      $scope.activeInstance = DataSourceService.createNewDatasourceInstance();
      $scope.openInstanceRefs = IAService.getOpenInstanceRefs();
      $scope.clearSelectedInstances();
      IAService.showInstanceView();
      $rootScope.$broadcast('IANavEvent');

    };
    // test datasource connection
    $scope.testDataSourceConnection = function(dsId) {

      DataSourceService.testDataSourceConnection(dsId).
        then(function(response) {
          alert('DataSource status: ' + response.status);
        });

    };

    // save Datasource
    $scope.updateOrCreateDatasource = function(config) {
      var currentDatasource = config;
      if (config.name) {
        console.log('SAVE or CREATE datasource: ' + config.name);
        // check to make sure it is unique
//
//      if (DataSourceService.isNewDatasourceNameUnique(formObj.name)) {
        // call create model
        if (!config.facetName) {
          config.facetName = 'server';
        }
        console.log('CREATE THE DataSource: ' + JSON.stringify(config));

        // double check to clear out 'new' id
        if (config.id === CONST.newModelPreId) {
          delete config.id;
        }

        DataSourceService.createDataSourceDefinition(config).
          then(function(response) {
            // clear reference to 'new' placeholder in openInstanceRefs
            IAService.clearOpenNewDSReference();
            $scope.activeInstance = response;
            $scope.activeInstance.type = 'datasource';
            loadDataSources();
          }
        );

      }
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
      IAService.showInstanceView();

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
    * EXPLORER
    *
    * */
    $scope.showExplorerViewRequest = function() {
      IAService.showExplorerView();
    };


    function isPayloadTypeRequest(rObj) {
      if ((rObj.method === 'POST') || (rObj.method === 'PUT')) {
        return true;
      }
      return false;
    }


    // TODO - refactor this into a service
    $scope.explorerApiRequest = function(requestObj) {
      console.log('explorer api request:  ' + JSON.stringify(requestObj));
      var config = {
        method: requestObj.method,
        url: '/api' + requestObj.path
      };
      if (requestObj.path.indexOf('{id}') !== -1) {

        if (requestObj.data.id) {

          config.url = '/api' + requestObj.path.replace('{id}', requestObj.data.id);
        }

      }
      if (isPayloadTypeRequest(requestObj)) {
        config.data = requestObj.data;
      }



      $http(config).
        success( function(response) {
          $scope.latestExplorerEndPointResponses[requestObj.endPoint] = response;
          $scope.explorerDataModelChanged = !$scope.explorerDataModelChanged;
        }).
        error(function(response) {
          $scope.latestExplorerEndPointResponses[requestObj.endPoint] = response;
          $scope.explorerDataModelChanged = !$scope.explorerDataModelChanged;
        });
    };


    function getRandomNumber() {
      return Math.floor((Math.random() * 100) + 1);
    }
    /*
     *
     *   IA STATE CLEANUP LISTENER
     *
     * */
    $scope.$on('IANavEvent', function(event, data) {
      console.log('IA NAV EVENT PROCESSING');

      var currActiveInstance = $scope.activeInstance;
      var openInstanceRefs = IAService.getOpenInstanceRefs();

      console.log('| 1');
      // check if there is an active instance
      if (currActiveInstance && currActiveInstance.id) {
        console.log('| 2');
        var instanceObjRef = {
          id:currActiveInstance.id,
          name:currActiveInstance.name,
          type:currActiveInstance.type
        };
        // check if there are open instances and that activeInstance is in it
        if (openInstanceRefs.length > 0) {
          console.log('| 2');
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
            console.log('| 3');
            // add active instance to open instance refs

            $scope.openInstanceRefs = IAService.addInstanceRef(instanceObjRef);
          }
          console.log('| 4');

        }
        else {
          // we have a mismatch - we have an active instance but no open instance refs
          // add active instance to openInstanceRefs
          console.log('| 5');

          $scope.openInstanceRefs = IAService.addInstanceRef(instanceObjRef);
        }
      }
      else {
        console.log('| 6');
        // there is no active instance so confirm there are no open instance refs
        if (openInstanceRefs.length > 0) {
          console.log('| 7');
          // we have a mismatch - we have open instances but none are active
          // set the 0 index open instance ref to the active instance
          IAService.activateInstanceById(openInstanceRefs[0].id).
            then(function(instance) {
              console.log('| 8');
              $scope.activeInstance = instance;
              $rootScope.$broadcast('IANavEvent');
            }
          );
        }
        else {
          console.log('| 9');
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
/*
*
* Need to confirm if this is used in the canvas view
*
* */
app.controller('DragDropCtrl', function($scope) {
  $scope.handleDrop = function() {
    console.log('Item has been dropped');
  }
});

