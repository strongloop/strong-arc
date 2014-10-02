UI.directive('slUiSelect', [
  function(){
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/ui/templates/ui.select.html',
      scope: {
        list: '=',
        selected: '='
      },
      controller: function($scope, $attrs, $location, $timeout, $log, $state) {
        $scope.hideMenu = function(){
          $scope.isOpen = false;
        };

        $scope.selectItem = function(item){
          $state.go( item.id );
          $scope.hideMenu();
        };
      }
    }
  }
]);
