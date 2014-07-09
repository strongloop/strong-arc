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
  '$http',
  function(ModelService, $timeout, $rootScope, DiscoveryService, $http) {
    return {
      replace:true,
      templateUrl: './scripts/modules/discovery/templates/discovery.schema.html',
      controller:  function($scope, DatasourceService) {

        $scope.isDsTablesLoadingIndicatorVisible = true;
        $scope.currentDiscoveryStep = 'selectTables';

        $scope.schemaTables3 = [];


        var dsName = 'icarsmysql';
        $scope.schemaTables3 = DiscoveryService.getSchemaDataFromDatasource(dsName).
          then(function(response) {
            $scope.schemaTables3 = response;
            $scope.isDsTableGridVisible = true;
            $scope.isDsTablesLoadingIndicatorVisible = false;
        });

        $scope.isSchemaModelComposerVisible = function(){
          return $scope.apiSourceTables.length > 0;
        };

        $scope.generateModels = function() {
          //console.log('generate models' + $scope.dsTablesGridOptions.selectedItems);
          $scope.apiSourceTables = $scope.dsTablesGridOptions.selectedItems;
          $scope.isDsTableGridVisible = false;
          switch($scope.currentDiscoveryStep) {
            case 'initialize':
              $scope.currentDiscoveryStep = 'selectTables';
              break;

            case 'selectTables':
              $scope.currentDiscoveryStep = 'reviewModels';

              break;

            case 'reviewModels':
              $scope.currentDiscoveryStep = 'initialize';
              // ('create the following models: '  );
              var newModels= ModelService.generateModelsFromSchema($scope.apiSourceTables);

              $scope.cancel();

              $rootScope.$broadcast('newSchemaModelsEvent', {});


              break;

            default:

          }


        };
        $scope.viewSchemaTables = function() {
          console.log('back to schema');
          $scope.apiSourceTables = [];
          $scope.isDsTableGridVisible = true;
          switch($scope.currentDiscoveryStep) {
            case 'initialize':

              break;

            case 'selectTables':
              $scope.currentDiscoveryStep = 'initialize';

              break;

            case 'reviewModels':
              $scope.currentDiscoveryStep = 'selectTables';

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
          selectedItems: [],
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



        $scope.datasources = [];
        $scope.apiSourceTables = [];
        $scope.isDsTableGridVisible = false;
        // $scope.isDsTablesLoadingIndicatorVisible = false;

        $scope.filterOptions = {
          filterText: ''
        };

      },
      link: function(scope, el, attrs) {



      }
    }
  }
]);
