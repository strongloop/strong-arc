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

UI.directive('slUiToggle', [
  '$log',
  function($log){
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/ui/templates/ui.toggle.html',
      scope: {
        togglers: '='
      },
      controller: function($scope, $attrs, $log) {
        $scope.togglers[0].isActive = true;
        $scope.activeId = $scope.togglers[0].id;

        $scope.setActive = function(toggler){

          //reset active flag for all togglers
          $scope.togglers.forEach(function(togg){
            togg.isActive = false;
          });

          toggler.isActive = true;
          $scope[toggler.activeId] = toggler.id;
          $scope.$parent[toggler.activeId] = toggler.id;
        }
      }
    }
  }
]);

UI.directive('slUiSwitch', [
  '$log',
  function($log){
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/ui/templates/ui.switch.html',
      scope: {
        switches: '='
      },
      controller: function($scope, $attrs, $log) {
        $scope.switches[0].isActive = true;
        $scope.activeId = $scope.switches[0].id;

        $scope.setActive = function(switcher){

          //reset active flag for all togglers
          $scope.switches.forEach(function(switcher){
            switcher.isActive = false;
          });

          switcher.isActive = true;
          $scope[switcher.activeId] = switcher.id;
          $scope.$parent[switcher.activeId] = switcher.id;
        }
      }
    }
  }
]);
