// Copyright StrongLoop 2014
/*
 *
 *   Discovery Discovery
 *
 * */
Discovery.directive('slDiscoverySchema', [
  'ModelService',
  '$timeout',
  '$rootScope',
  'DiscoveryService',
  'PropertyService',
  '$http',
  function(ModelService, $timeout, $rootScope, DiscoveryService, PropertyService, $http) {
    return {
      replace:true,
      templateUrl: './scripts/modules/discovery/templates/discovery.schema.html',
      controller:  function($scope, DataSourceService) {

        $scope.isDsTablesLoadingIndicatorVisible = true;
        $scope.currentDiscoveryStep = 'selectTables';
        $scope.showDiscoveryBackButton = false;
        $scope.nextButtonDisabledTxt = 'disabled="disabled"';
        $scope.tableSelections = [];
        $scope.targetTables = [];
        $scope.gTables = [];


        $scope.datasources = [];
        $scope.apiSourceTables = [];
        $scope.isDsTableGridVisible = false;
        // $scope.isDsTablesLoadingIndicatorVisible = false;

        $scope.filterOptions = {
          filterText: ''
        };


        $scope.schemaTables3 = [];

//        DiscoveryWizardForm
        var dsName = $scope.targetDiscoveryDSName;
        if (dsName) {
          $scope.schemaTables3 = DiscoveryService.getSchemaDataFromDatasource(dsName).
            then(function(response) {
              $scope.schemaTables3 = response;
              $scope.isDsTableGridVisible = true;
              $scope.isDsTablesLoadingIndicatorVisible = false;
            });
        }


        $scope.isSchemaModelComposerVisible = function(){
          return $scope.apiSourceTables.length > 0;
        };
        var propertyInjectionSet = function(modelId, propNames, propObj) {

          var damn = propNames.map(function(key) {
            var testObj = propObj[key];
            console.log(testObj);
            testObj.name = key;
            testObj.modelId = modelId;
            testObj.facetName = CONST.NEW_MODEL_FACET_NAME;
            PropertyService.createModelProperty(testObj).
              then(function(response){
                console.log('GREAT WE CREATED A Property')
              }).
              catch(function error(msg) {
                console.error('bad WE did not create A Property: ' + msg);
              });
          });
        };

        $scope.discoveryNexBtnClicked = function() {
          //console.log('generate models' + $scope.dsTablesGridOptions.selectedItems);
          var dsId = 'server.icarmysql-real';
          $scope.targetTables = $scope.dsTablesGridOptions.selectedItems;
          $scope.gTables = DiscoveryService.getModelsFromSchemaSelections(dsName, $scope.targetTables).
            then(function(response) {
              //$scope.gTables = response.status;
              $scope.apiSourceTables = response;
            });
          $scope.isDsTableGridVisible = false;
          switch($scope.currentDiscoveryStep) {
            case 'initialize':
              $scope.currentDiscoveryStep = 'selectTables';
              $scope.showDiscoveryBackButton = false;
              break;

            case 'selectTables':
              $scope.currentDiscoveryStep = 'reviewModels';
              $scope.showDiscoveryBackButton = true;
              break;

            case 'reviewModels':
              $scope.currentDiscoveryStep = 'initialize';
              $scope.showDiscoveryBackButton = true;
              // ('create the following models: '  );
              $scope.apiSourceTables.map(function(table) {
                table.facetName = CONST.NEW_MODEL_FACET_NAME;
                ModelService.createModel(table).
                  then(function(response) {
                    // create properties
                    var modelId = response.id;

                    var propertiesCollection = [];

                    var propKeys = Object.keys(table.properties);



                    var newProperty = new propertyInjectionSet(modelId, propKeys, table.properties);




                    $scope.activeInstance = response;
                  }
                );
              });
              var newModels= ModelService.generateModelsFromSchema($scope.apiSourceTables);

              $scope.cancel();

              $rootScope.$broadcast('newSchemaModelsEvent', {});


              break;

            default:

          }


        };
        $scope.discoveryBackBtnClicked = function() {
          console.log('back to schema');
          $scope.apiSourceTables = [];
          $scope.isDsTableGridVisible = true;

          switch($scope.currentDiscoveryStep) {
            case 'initialize':

              break;

            case 'selectTables':
              $scope.currentDiscoveryStep = 'initialize';
              $scope.showDiscoveryBackButton = false;

              break;

            case 'reviewModels':
              $scope.currentDiscoveryStep = 'selectTables';
              $scope.showDiscoveryBackButton = false;

              break;

            default:

          }
        };
        $scope.$on('ngGridEventData', function(){
          //$scope.dsTablesGridOptions.selectRow(0, true);

        });
        $scope.dsTablesGridOptions = {
          data: 'schemaTables3',
          columnDefs: [
            {field:'name', displayName:'Table'},
            {field:'owner',displayName:'Owner'}
          ],
          selectedItems:  $scope.tableSelections,
          multiSelect: true,
          filterOptions: $scope.filterOptions
        };
        $scope.getTableStyle = function() {
          var rowHeight=30;
          var headerHeight=45;
          return {
            height: 600
          };
        };



      },
      link: function(scope, el, attrs) {




      }
    }
  }
]);
Discovery.directive('slDiscoveryModelPreview', [
  function() {
    return {
      replace: true,
      link: function(scope, el, attrs) {

        scope.$watch('apiSourceTables', function(tables) {
          React.renderComponent(TargetTableModelPreview({scope:scope}), el[0]);
        },true);
      }
    };
  }
]);
Discovery.directive('slCommonDisabledAttrib', [
  function() {
    return {
      restrict: 'A',
      replace: false,
      controller: function($scope) {
        console.log('disabled attribute');
        $scope.isDisabled = true;
      },
      link: function(scope, el, attrs) {

        el.attr('disabled', 'disabled');

        scope.$watch('tableSelections', function(items) {
          console.log('TEST VALUe TeST VAluE');
          if (items){
            if (items.length && items.length > 0) {
              el.removeAttr('disabled');
            }
            else{
              el.attr('disabled', 'disabled');
            }
          }

        }, true);
      }
    };
  }
]);
