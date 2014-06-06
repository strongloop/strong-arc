// Copyright StrongLoop 2014
app.controller('IDEController', [
  '$scope',
  '$state',
  'IAService',
  'DatasourceService',
  '$location',
  'ModelService',
  function($scope, $state, IAService, DatasourceService, $location, ModelService) {


    // Datasources
    $scope.mainNavDatasources = [];
    $scope.mainNavModels = [];
    $scope.currentOpenModelNames = IAService.getOpenModelNames();
    $scope.activeDatasources = [];
    $scope.currentSelectedCollection = [];
    $scope.activeModelInstance = IAService.getActiveModelInstance();
    $scope.previewInstance = {};
    $scope.isModelsActive = true;
    $scope.isDataSourcesActive = true;

    $scope.clearModelPreview = function() {
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
      $scope.activeModelInstance = IAService.activateModelByName(target);
      $scope.clearModelPreview();
      $scope.currentOpenModelNames = IAService.getOpenModelNames();
     // $location.path('/models');
    };

    /*
     * branch clicked
     * */
    $scope.navTreeBranchClicked = function(type) {
      console.log('Tree Branch Clicked');

    };

    $scope.modelEditTabItemClicked = function(modelName) {
      var currentOpenModelNames = IAService.getOpenModelNames();
      // defensive check to make sure the component is initialized
      if (currentOpenModelNames && currentOpenModelNames.length > 0){
        // only if the model isn't currently active

        $scope.activeModelInstance = IAService.activateModelByName(modelName);
      }
    };
    $scope.modelEditTabItemCloseClicked = function(modelName) {
      $scope.currentOpenModelNames = IAService.closeModelByName(modelName);

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
    $scope.navTreeItemClicked = function(type, target, multiSelect) {

      switch (type){

        case 'model':
          $scope.previewInstance = ModelService.getModelByName(target);
          break;
        case 'datasource':
          $scope.previewInstance = DatasourceService.getDatasourceByName(target);
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

































    $scope.models = [];


    $scope.models = ModelService.getAllModels({});
    $scope.models.$promise.
      then(function (result) {

        var core = result[0];

        var log = [];
        var models = [];
        angular.forEach(core, function(value, key){
          this.push(key + ': ' + value);
          models.push({name:key,children:value});
        }, log);



        var treedata_api_nav = [
          {
            name: 'Models',
            stateName: 'model',
            children: [
              {
                name: 'Properties',
                children: ['data type', 'default']
              }, {
                name: 'ACL',
                children: ['allow all', 'restrict']
              }, {
                name: 'Relations',
                children: ['has many', 'belongs to']
              }
            ]
          },
          {
            name: 'Datasources',
            stateName: 'datasource',
            children: [
              {
                name: 'Mongo Prod 1',
                children: ['type', 'properties', 'connection']
              }, {
                name: 'prod apn customer',
                children: ['type', 'properties', 'connection']
              }, {
                name: 'MySQL WP reg',
                children: ['type', 'properties', 'connection']
              }
            ]
          },
          {
            name: 'Forms',
            stateName: 'uiform'
          },
          {
            name: 'Layouts',
            stateName: 'layout'
          }
        ];









        for (var i = 0;i < treedata_api_nav.length;i++) {
          if (treedata_api_nav[i].name === 'Models') {
            treedata_api_nav[i].children = models;
            break;
          }
        }






        $scope.models = treedata_api_nav;


      });

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
