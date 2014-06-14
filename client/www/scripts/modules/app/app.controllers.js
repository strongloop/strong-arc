// Copyright StrongLoop 2014
app.controller('IDEController', [
  '$scope',
  '$state',
  'IAService',
  'DatasourceService',
  '$location',
  'ModelService',
  function($scope, $state, IAService, DatasourceService, $location, ModelService) {

    $scope.mainContentZIndexes = {
      ModelEditorMainContainer: 101,
      PreviewInstanceContainer: 100,
      CanvasApiContainer: 130
    };

    // Datasources
    $scope.mainNavDatasources = []; // initialized further down
    $scope.mainNavModels = [];  // initialized further down
    $scope.currentOpenModelNames = IAService.getOpenModelNames();
    $scope.currentOpenDatasourceNames = IAService.getOpenDatasourceNames();
    $scope.currentSelectedCollection = IAService.clearSelectedModelNames();
    $scope.activeModelInstance = IAService.getActiveModelInstance();
    $scope.activeDatasourceInstance = IAService.getActiveModelInstance();
    $scope.previewInstance = IAService.clearPreviewModelInstance();
    $scope.isModelsActive = true;
    $scope.isDataSourcesActive = true;
    $scope.currentModelSelections = IAService.clearSelectedModelNames();
    $scope.currentDatasourceSelections = IAService.clearSelectedDatasourceNames();

    $scope.selectModel = function(name) {
      $scope.currentModelSelections = IAService.addToCurrentModelSelections(name);
    };
    $scope.selectDatasource = function(name) {
      $scope.currentModelSelections = IAService.addToCurrentModelSelections(name);
    };
    $scope.clearSelectedModels = function() {
      $scope.currentModelSelections = IAService.clearSelectedModelNames();
    };
    $scope.clearSelectedDatasources = function() {
      $scope.currentDatasourceSelections = IAService.clearSelectedDatasourceNames();
    };

    $scope.clearModelPreview = function() {
      $scope.previewInstance = {};
      IAService.clearPreviewModelInstance();
      $scope.currentSelectedCollection = [];
    };
    $scope.clearDatasourcePreview = function() {
      $scope.previewInstance = {};
      IAService.clearPreviewModelInstance();
      $scope.currentSelectedCollection = [];
    };

    /*
     *
     *   An item has been double clicked.
     *
     *   - clear any preview
     *   - add item to currently active instances
     *   - set item as the currently active instance
     *
     * */
    $scope.navTreeItemDblClicked = function(type, target) {
      console.log('dbl clicked!!: ' + target);

      switch(type) {

        case 'model':
          $scope.activeModelInstance = IAService.activateModelByName(target);
          $scope.clearModelPreview();
          $scope.currentOpenModelNames = IAService.getOpenModelNames();
          jQuery('[data-id="ModelEditorMainContainer"]').css('z-index', 112);
          jQuery('[data-id="DatsourceEditorMainContainer"]').css('z-index', 111);
          jQuery('[data-id="CanvasApiContainer"]').css('z-index', 113);
          jQuery('[data-id="PreviewInstanceContainer"]').css('z-index', 111);
          jQuery('[data-id="CanvasApiContainer"]').transition({ x: 1000 });
          $scope.clearSelectedModels();
          break;

        case 'datasource':
          $scope.activeDatasourceInstance = IAService.activateDatasourceByName(target);
          $scope.clearDatasourcePreview();
          $scope.currentOpenDatasourceNames = IAService.getOpenDatasourceNames();
          jQuery('[data-id="ModelEditorMainContainer"]').css('z-index', 111);
          jQuery('[data-id="DatasourceEditorMainContainer"]').css('z-index', 112);
          jQuery('[data-id="CanvasApiContainer"]').css('z-index', 113);
          jQuery('[data-id="PreviewInstanceContainer"]').css('z-index', 111);
          jQuery('[data-id="CanvasApiContainer"]').transition({ x: 1000 });
          $scope.clearSelectedDatasources();
          break;
        default:

      }


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
      jQuery('[data-id="ModelEditorMainContainer"]').css('z-index', 110);
      jQuery('[data-id="DatasourceEditorMainContainer"]').css('z-index', 110);
      jQuery('[data-id="CanvasApiContainer"]').css('z-index', 113);
      jQuery('[data-id="CanvasApiContainer"]').transition({ x: 0 });
      jQuery('[data-id="PreviewInstanceContainer"]').css('z-index', 111);
      $scope.clearSelectedModels();

    };

    $scope.modelEditTabItemClicked = function(name) {
      var currentOpenModelNames = IAService.getOpenModelNames();
      // defensive check to make sure the component is initialized
      if (currentOpenModelNames && currentOpenModelNames.length > 0){
        // only if the model isn't currently active

        $scope.activeModelInstance = IAService.activateModelByName(name);
      }
      $scope.clearSelectedModels();
    };
    $scope.datasourceEditTabItemClicked = function(name) {
      var currentOpenDatasourceNames = IAService.getOpenDatasourceNames();
      // defensive check to make sure the component is initialized
      if (currentOpenDatasourceNames && currentOpenDatasourceNames.length > 0){
        // only if the model isn't currently active

        $scope.activeDatasourceInstance = IAService.activateDatasourceByName(name);
      }
      $scope.clearSelectedDatasources();
    };
    $scope.modelEditTabItemCloseClicked = function(name) {

      $scope.currentOpenModelNames = IAService.closeModelByName(name);
      // reset the active instance and reset tabs and nav
      if ($scope.activeModelInstance.name === name) {
        if ($scope.currentOpenModelNames.length === 0) {
          $scope.aciveModelInstance = {};
        }
        else {

          // active the first instance by default
          $scope.activeModelInstance = IAService.activateModelByName($scope.currentOpenModelNames[0]);

        }
      }
      $scope.clearSelectedModels();
    };
    $scope.datasourceEditTabItemCloseClicked = function(name) {

      $scope.currentOpenDatasourceNames = IAService.closeDatasourceByName(name);
      // reset the active instance and reset tabs and nav
      if ($scope.activeDatasourceInstance.name === name) {
        if ($scope.currentOpenDatasourceNames.length === 0) {
          $scope.aciveDatasoruceInstance = {};
        }
        else {

          // active the first instance by default
          $scope.aciveDatasoruceInstance = IAService.activateDatasourceByName($scope.currentOpenDatasourceNames[0]);

        }
      }
      $scope.clearSelectedDatasources();
    };

    /*
     *
     * get the list of current active instances
     *
     * check for a current active instance
     *
     * render instance editor view
     *
     * */
    $scope.openInstances = function() {

    };
    $scope.openSelectedModels = function() {
      var selectedModels = IAService.getCurrentModelSelections();
      if (selectedModels) {
        $scope.clearModelPreview();
        for (var i = 0; i < selectedModels.length;i++) {
          $scope.activeModelInstance = IAService.activateModelByName(selectedModels[i]);
        }
        $scope.currentOpenModelNames = IAService.getOpenModelNames();
        jQuery('[data-id="ModelEditorMainContainer"]').css('z-index', 112);
        jQuery('[data-id="DatasourceEditorMainContainer"]').css('z-index', 112);
        jQuery('[data-id="CanvasApiContainer"]').css('z-index', 113);
        jQuery('[data-id="CanvasApiContainer"]').transition({ x: 1000 });
        jQuery('[data-id="PreviewInstanceContainer"]').css('z-index', 111);
        $scope.clearSelectedModels();
      }
    };
    $scope.openSelectedDatasources = function() {
      var selectedDatasources = IAService.getCurrentDatasourceSelections();
      if (selectedDatasources) {
        $scope.clearDatasourcePreview();
        for (var i = 0; i < selectedDatasourcess.length;i++) {
          $scope.activeDatasourceInstance = IAService.activateDatasourceByName(selectedDatasources[i]);
        }
        $scope.currentOpenDatasourcelNames = IAService.getOpenDatasourceNames();
        jQuery('[data-id="ModelEditorMainContainer"]').css('z-index', 112);
        jQuery('[data-id="DatasourceEditorMainContainer"]').css('z-index', 112);
        jQuery('[data-id="CanvasApiContainer"]').css('z-index', 113);
        jQuery('[data-id="CanvasApiContainer"]').transition({ x: 1000 });
        jQuery('[data-id="PreviewInstanceContainer"]').css('z-index', 111);
        $scope.clearSelectedDatasources();
      }
    };


    /*
     an element on the nav tree has been single left clicked
     could be:
     - the app root
     -- show the 'canvas' view
     - a 'branch' (datasources or models)
     -- show filtered canvas view
     - a 'node' - conceptually a leaf in v1 but could become branch or leaf in future
     -- show instance property editor view

     control key may be pressed or not
     -- if pressed, add to current selection collection
     -- if not then clear current selected collection

     */
    $scope.navTreeItemClicked = function(type, targetName, multiSelect) {

      switch (type){

        case 'model':
          var openModelNames = $scope.currentOpenModelNames;
          var targetModel = ModelService.getModelByName(targetName);
          if (openModelNames && (openModelNames.indexOf(targetName) === -1)) {
            // mode is not open so preview it
            $scope.previewInstance = targetModel;
            jQuery('[data-id="ModelEditorMainContainer"]').css('z-index', 111);
            jQuery('[data-id="ModelDatasourceMainContainer"]').css('z-index', 111);
            jQuery('[data-id="CanvasApiContainer"]').css('z-index', 113);
            jQuery('[data-id="CanvasApiContainer"]').transition({ x: 1000 });
            jQuery('[data-id="PreviewInstanceContainer"]').css('z-index', 112);
          }
          else {
            // model is open
            // make sure it isn't currently active
            if ($scope.activeModelInstance.name !== targetName) {
              jQuery('[data-id="ModelEditorMainContainer"]').css('z-index', 112);
              jQuery('[data-id="ModelDatasourceMainContainer"]').css('z-index', 111);
              jQuery('[data-id="CanvasApiContainer"]').css('z-index', 113);
              jQuery('[data-id="CanvasApiContainer"]').transition({ x: 1000 });
              jQuery('[data-id="PreviewInstanceContainer"]').css('z-index', 111);
              $scope.activeModelInstance = IAService.activateModelByName(targetName);
              $scope.clearModelPreview();
              $scope.clearSelectedModels();
            }


          }


          /*
          * cases:
          * - item is not open: open preview view of item
          * - item is open and active: do nothing
          * - item is open but not active: activate item
          *
          * */
          $scope.previewInstance = ModelService.getModelByName(targetName);
          break;
        case 'datasource':
          //$scope.previewInstance = DatasourceService.getDatasourceByName(target);
          break;

        default:


      }
      IAService.setPreviewModelInstance($scope.previewInstance);

      // control key is pressed
      if (multiSelect) {
        $scope.currentSelectedCollection.push($scope.previewInstance);
      }
      else{
        // in preview mode load up the instance in case
        // the user gives it focus (wants to edit it)
        $scope.currentSelectedCollection = [$scope.previewInstance];
      }

    };
    $scope.openInstance = function(type, name) {
      if (type && name){
        switch(type) {
          case 'model':
            //var tModel = ModelService.getModelByName(name);
            $scope.currentOpenModelNames.push(name);
            $scope.activeModelInstance = ModelService.getModelByName(name);

            break;

          case 'datasource':
            var tDatasource = ModelService.getDatasourceByName(name);
            $scope.activeDatasources.push(tDatasource);
            $scope.activeModelInstance = DatasourceService.getDatasourceByName(name);

            break;

          default:
        }
        IAService.setActiveModelInstance($scope.activeModelInstance);
        $scope.clearModelPreview();
      }

    };






    /*
     * Datasources
     * */
    $scope.mainNavDatasources = DatasourceService.getAllDatasources({});
    $scope.mainNavDatasources.$promise.
      then(function (result) {

        var core = result.name[0];
//
        var log = [];
        var datasources = [];
        angular.forEach(core, function(value, key){
          //this.push(key + ': ' + value);
          datasources.push({name:key,props:value});
        }, log);
        $scope.mainNavDatasources = datasources;


      });


    // Models



    $scope.mainNavModels = ModelService.getAllModels({});
    $scope.mainNavModels.$promise.
      then(function (result) {

        var core = result[0];

        var log = [];
        var mainNavModels = [];
        angular.forEach(core, function(value, key){
          this.push(key + ': ' + value);
          mainNavModels.push({name:key,children:value});


        }, log);
        $scope.mainNavModels = mainNavModels;
      }
    );

  }
]);
app.controller('HomeMainController',[
  '$scope',
  '$location',
  function($scope, $location){
    var viewModel = {};
    viewModel.message = 'StrongLoop API Studio';
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
