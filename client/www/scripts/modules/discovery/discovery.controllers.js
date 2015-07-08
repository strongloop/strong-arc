// Copyright StrongLoop 2014
Discovery.controller('DiscoveryMainController', [
  '$scope',
  'ModelService',
  '$timeout',
  '$rootScope',
  'DiscoveryService',
  'PropertyService',
  'IAService',
  '$q',
  function($scope, ModelService, $timeout, $rootScope, DiscoveryService, PropertyService, IAService, $q) {

    $scope.isDsTablesLoadingIndicatorVisible = true;
    $scope.currentDiscoveryStep = 'selectSourceTables';
    $scope.showDiscoveryBackButton = false;
    $scope.showSelectAllButton = true;
    $scope.isSelectAllButtonDisabled = true;
    $scope.tableSelections = []; // note also used to disable wizard buttons
    $scope.targetTables = [];
    $scope.masterSelectedProperties = []; // collection of selected property collections
    $scope.targetGenerateSrcTables = [];  // selected tables from the schema
    $scope.showModelPreview = false;
    $scope.isDsTableGridVisible = false;
    $scope.isAllSchemaTablesSelected = false;

    $scope.filterOptions = {
      filterText: ''
    };

    $scope.schemaSrcTables = [];

    // discovery wizard form
    var dsName = $scope.targetDiscoveryDSName;
    if (dsName) {
      $scope.schemaSrcTables = DiscoveryService.getSchemaDataFromDatasource(dsName).
        then(function(schemaData) {
          $scope.schemaSrcTables = schemaData;  // trigger the grid display
          $scope.isDsTableGridVisible = true;
          $scope.isDsTablesLoadingIndicatorVisible = false;

          //todo: work around for step1 not showing data grid
          $(window).trigger('resize');
        });
    }

    $scope.isSchemaModelComposerVisible = function(){
      return $scope.targetGenerateSrcTables.length > 0;
    };

    $scope.toggeleSelectAllSchemaTables = function() {
      if ($scope.schemaSrcTables) {
        $scope.isAllSchemaTablesSelected = !$scope.isAllSchemaTablesSelected;
        $scope.dsTablesGridOptions.selectAll($scope.isAllSchemaTablesSelected);
      }
    };

    // next click
    $scope.discoveryNexBtnClicked = function() {
      $scope.targetTables = $scope.dsTablesGridOptions.selectedItems;
      $scope.isDsTableGridVisible = false;

      switch($scope.currentDiscoveryStep) {

        // initial step show the output from the 'get schema' call on the ds
        case 'initialSchemaView':
          $scope.showSelectAllButton = true;
          $scope.currentDiscoveryStep = 'selectSourceTables';
          $scope.showDiscoveryBackButton = false;
          $scope.showModelPreview = false;
          break;

        // user has selected at least one source table
        case 'selectSourceTables':

          $scope.showSelectAllButton = false;
          $scope.isDsTablesLoadingIndicatorVisible = true;
          DiscoveryService.getModelsFromSchemaSelections(dsName, $scope.targetTables).
            then(function(response) {
              $scope.showModelPreview = true;
              $scope.targetGenerateSrcTables = response;
              $scope.isDsTablesLoadingIndicatorVisible = false;
            });
          $scope.currentDiscoveryStep = 'confirmAndCreateModels';
          $scope.showDiscoveryBackButton = true;
          break;

        // Generate the definitions
        case 'confirmAndCreateModels':
          // reset wizard step
          $scope.currentDiscoveryStep = 'initialSchemaView';
          $scope.showDiscoveryBackButton = true;
          $scope.targetGenerateSrcTables.map(function(table, index) {
            var dSource = dsName.split('.')[1];
            var selectedProperties = $scope.masterSelectedProperties[index];
            DiscoveryService.createModelFromSchema(dsName, table, selectedProperties)
              .then(function handleNewModelFromSchema(modelId) {
                var instance = ModelService.getModelInstanceById(modelId)
                  .then(function openNewModelInstance(instance) {
                    IAService.addInstanceRef(instance);
                    IAService.setActiveInstance(instance);
                    $rootScope.$broadcast('newSchemaModelsEvent', {});

                  })
                  .catch(function handleNewModelInstanceError(error) {
                    console.warn('bad get new model instance: ' + error);
                  });
              })
              .catch(function handleNewModelFromSchemaError(error) {
                console.warn('bad create model from schema: ' + error);
              });

          });
          // kill the modal
          $scope.cancel();

          break;

        default:

      }
    };

    $scope.discoveryBackBtnClicked = function() {
      $scope.targetGenerateSrcTables = [];
      $scope.isDsTableGridVisible = true;
      $scope.showSelectAllButton = true;
      $scope.showModelPreview = false;
      switch($scope.currentDiscoveryStep) {
        case 'initialSchemaView':
          $scope.showDiscoveryBackButton = false;
          break;

        case 'selectSourceTables':
          $scope.currentDiscoveryStep = 'initialSchemaView';
          $scope.showDiscoveryBackButton = false;

          break;

        case 'confirmAndCreateModels':
          $scope.currentDiscoveryStep = 'selectSourceTables';
          $scope.showDiscoveryBackButton = false;

          break;

        default:

      }
    };


    // source schema grid config
    $scope.dsTablesGridOptions = {
      data: 'schemaSrcTables',
      columnDefs: [
        {field:'name', displayName:'Table', minWidth: 500, cellClass: 'discovery-data-cell'},
        {field:'owner',displayName:'Owner', maxWidth: 10, cellClass: 'discovery-data-cell'}
      ],
      checkboxHeaderTemplate: '<input class="ngSelectionHeader" type="checkbox" ng-model="allSelected" ng-change="toggleSelectAll(allSelected)"/>',
      checkboxCellTemplate: '<label class="ui-checkbox">' +
        '<input type="checkbox">' +
        '<i class="icon"></i>'+
        '</label>',
      showSelectionCheckbox: true,
      selectWithCheckboxOnly: false,
      afterSelectionChange: function (rowItem) {
        if (!$scope.isAllSchemaTablesSelected) {
          $scope.isAllSchemaTablesSelected = ($scope.schemaSrcTables.length === $scope.tableSelections.length);
        }

        //coerce single row to an array
        if (!_.isArray(rowItem) ) {
          rowItem = [rowItem];
        }

        //select the rows if need be
        rowItem.map(function(row){
          var $elm = row.elm || row.clone.elm;
          //add class to checkbox if row is selected
          var $input = $elm.find('.ui-checkbox [type=checkbox]');

          if ( row.selected ) {
            $input.addClass('checked');
          } else {
            $input.removeClass('checked');
          }
        });
      },
      rowHeight: 40,
      selectedItems:  $scope.tableSelections,
      multiSelect: true,
      filterOptions: $scope.filterOptions
    };

  }
]);
