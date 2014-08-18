// Copyright StrongLoop 2014
Datasource.controller('DatasourceMainController', [
  '$scope',
  'DataSourceService',
  '$timeout',
  '$http',
  function($scope, DataSourceService, $timeout, $http) {
    /*
    *
    *   <button>Get Datasource Operations: dataSource.operations().</button>
    *               <li><a href="#">ACLSchemas</a></li>
    * */

    $scope.schemaTables = [];
    $scope.apiSourceTables = [];
    $scope.isDsTablesLoadingIndicatorVisible = false;

    $scope.filterOptions = {
      filterText: ''
    };

    $scope.openDatasourceForm = function() {
      $scope.isShowDatasourceForm = true;
    };
    $scope.saveDatasource = function(dsObj) {

    };
    $scope.closeDatasourceForm = function() {
      $scope.isShowDatasourceForm = false;
    };
    $scope.isShowDatasourceForm = false;





  }
]);
