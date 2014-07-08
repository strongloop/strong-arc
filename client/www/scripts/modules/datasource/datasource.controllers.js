// Copyright StrongLoop 2014
Datasource.controller('DatasourceMainController', [
  '$scope',
  'DatasourceService',
  '$timeout',
  function($scope, DatasourceService, $timeout) {
    /*
    *
    *   <button>Get Datasource Operations: dataSource.operations().</button>
    *               <li><a href="#">ACLSchemas</a></li>
    * */

    console.log('Datasource Main Controller');
    $scope.schemaTables = [];
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
      //console.log('Save Datasource Object: ' + JSON.stringify(dsObj));
    };
    $scope.closeDatasourceForm = function() {
      $scope.isShowDatasourceForm = false;
    };
    $scope.isShowDatasourceForm = false;




//
//    $scope.datasources = DatasourceService.getAllDatasources({});
//    $scope.datasources.$promise.
//      then(function (result) {
//
//        var core = result.name[0];
////
//        var log = [];
//        var datasources = [];
//        angular.forEach(core, function(value, key){
//          //this.push(key + ': ' + value);
//          datasources.push({name:key,props:value});
//        }, log);
//        $scope.datasources = datasources;
//
//
//      });

    $scope.loadSchema = function(dsName) {
      $scope.isDsTablesLoadingIndicatorVisible = true;

      $scope.schemaTables = DatasourceService.getDatasourceTables({'name':'mSql'});
      $scope.schemaTables.$promise.
        then(function (result) {



          $timeout(

            function() {
              $scope.schemaTables = result.schema;
              $scope.isDsTablesLoadingIndicatorVisible = false;
              $scope.isDsTableGridVisible = true;
            }, 2000

          );



        });
    };

    $scope.isSchemaModelComposerVisible = function(){
      return $scope.apiSourceTables.length > 0;
    };


    $scope.dsTablesGridOptions = {
      data: 'schemaTables',
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
