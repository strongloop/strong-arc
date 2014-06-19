// Copyright StrongLoop 2014
Datasource.controller('DatasourceMainController', [
  '$scope',
  'DatasourceService',
  function($scope, DatasourceService) {
    /*
    *
    *   <button>Get Datasource Operations: dataSource.operations().</button>
    *               <li><a href="#">ACLSchemas</a></li>
    * */

    console.log('Datasource Main Controller');
    $scope.datasources = [];
    $scope.apiSourceTables = [];
    $scope.isDsTableGridVisible = false;
    $scope.isDsTablesLoadingIndicatorVisible = false;

    $scope.filterOptions = {
      filterText: ''
    };

    $scope.openDatasourceForm = function() {
      $scope.isShowDatasourceForm = true;
    };
    $scope.saveDatasource = function(dsObj) {
      console.log('Save Datasource Object: ' + JSON.stringify(dsObj));
    };
    $scope.closeDatasourceForm = function() {
      $scope.isShowDatasourceForm = false;
    };
    $scope.isShowDatasourceForm = false;





    $scope.datasources = DatasourceService.getAllDatasources({});
    $scope.datasources.$promise.
      then(function (result) {

        var core = result.name[0];
//
        var log = [];
        var datasources = [];
        angular.forEach(core, function(value, key){
          //this.push(key + ': ' + value);
          datasources.push({name:key,props:value});
        }, log);
        $scope.datasources = datasources;


      });

    $scope.loadSchema = function(dsName) {
      $scope.isDsTablesLoadingIndicatorVisible = true;

      $scope.tables = DatasourceService.getDatasourceTables({'name':'mSql'});
      $scope.tables.$promise.
        then(function (result) {


          $scope.tables = result.schema;
          $scope.isDsTablesLoadingIndicatorVisible = false;
          $scope.isDsTableGridVisible = true;


        });
    };

    $scope.isSchemaModelComposerVisible = function(){
      return $scope.apiSourceTables.length > 0;
    };


    $scope.dsTablesGridOptions = {
      data: 'tables',
      columnDefs: [
        {field:'name', displayName:'Table'},
        {field:'owner',displayName:'Owner'},
        {field: '', width: '35px', cellClass:'api-grid-ctrl-col', cellTemplate: '<button type="button" ng-click="deleteApi(row)" class="close" aria-hidden="true">&times;</button>' }
      ],
      selectedItems: [],
      multiSelect: true,
      filterOptions: $scope.filterOptions
    };


    $scope.$on('ngGridEventData', function(){
      //$scope.dsTablesGridOptions.selectRow(0, true);
    });
  }
]);
