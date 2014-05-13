// Copyright StrongLoop 2014
Layout.controller('LayoutMainController', [
  '$scope',
  function($scope) {
    console.log('Layout Main Controller');
    var isEnabledAddRowControls = false;
    var isShowColumnConfigForm = false;
    $scope.currLayout = {};
    $scope.createNewLayout = function() {
      isEnabledAddRowControls = true;
    };
    $scope.currNewRow = [];
    var currNewColumn = [];
    $scope.currNewColumnConfig = {};
    var isAddRowFormVisible = false;
    $scope.isAddRowFormVisible = function() {
      return isAddRowFormVisible;
    };
    $scope.addColumnConfig = function() {
      $scope.currNewColumn.push($scope.currNewColumnConfig);
    };

    $scope.currColModel = function() {
      return $scope.currNewColumn;
    };

    $scope.addNewRow = function() {
      isAddRowFormVisible = true;
      $scope.currNewRow = [];


      if (!$scope.currLayout.rows) {
        $scope.currLayout.rows = [];
      }
      $scope.currLayout.rows.push($scope.currNewRow);

    };
    $scope.isShowAddRowControls = function() {
      return isEnabledAddRowControls;
    };
    $scope.closeAddNewRow = function() {
      isAddRowFormVisible = false;
    };

    $scope.isColumnConfigFormVisible = function() {
      return isShowColumnConfigForm;
    };

    $scope.currLayoutModel = function() {
      return $scope.currLayout;
    };

    $scope.addColumn = function() {
      $scope.currNewRow.push($scope.currNewColumn);
      $scope.currNewColumn = [];
      $scope.currNewColumnConfig = {};
    }
  }
]);
