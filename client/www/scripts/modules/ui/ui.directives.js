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
        var togglers = $scope.togglers;
        var anyActive = false;
        for(var i = 0; i < togglers.length; i++) {
          if(togglers[i].isActive) {
            anyActive = true;
            break;
          }
        }

        if(!anyActive) {
          // if no toggler is active, set the first active
          $scope.togglers[0].isActive = true;
          $scope.activeId = $scope.togglers[0].id;
        }

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
        switches: '=',
        classes: '@'
      },
      controller: function($scope, $attrs, $log) {
        $scope.labels = angular.isDefined($attrs.labels) ? $attrs.labels : true;
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

UI.directive('slUiSearchInput', [
  '$log',
  '$timeout',
  function($log, $timeout){
    return {
      restrict: "E",
      replace: true,
      scope: {
        search: '=',
        form: '='
      },
      templateUrl: './scripts/modules/ui/templates/ui.input.search.html',
      controller: function($scope, $attrs, $log) {
        $scope.isClearLink = false;

        $scope.focus = function($event){
          var $targ = $($event.target);
          $scope.isClearLink = $targ.hasClass('.clear').length || $targ.find('.clear').length || $targ.parents('.clear').length;
          var $input = $($event.target).parents('label').find('input');

          if ( $scope.isClearLink ) {
            $input.addClass('ng-focused');
          }
        };

        $scope.clear = function($event){
          $scope.search = null;

          var $el = $($event.target).parents('label');

          //wait for current $apply to finish
          $timeout(function(){
            $el.find('input').addClass('ng-focused').focus();
            $scope.isClearLink = false;
          }, 0);
        }
      }
    }
  }
]);

UI.directive('slUiMenuAction', [
  '$http',
  '$tooltip',
  '$log',
  '$rootScope',
  '$timeout', function($http, $tooltip, $log, $rootScope, $timeout){
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: './scripts/modules/ui/templates/ui.menu.action.html',
      link: function(scope, element, attrs){
        var to;
        scope.showMenu = false;
        scope.hideOnPageClick = attrs.hideonpageclick;

        $rootScope.$on('pageClick', function(e, $event){
          var isMenuClick = !!$($event.target).parents('.ui-menu-action').length;

          if ( scope.hideOnPageClick && !isMenuClick ) {
            scope.showMenu = false;
          }
        });

        scope.hideMenu = function(){
          if ( scope.hideOnPageClick ) return;

          to = $timeout(function(){
            scope.showMenu = false;
          }, 300);
        };

        scope.cancelHide = function(){
          if ( scope.hideOnPageClick ) return;

          if ( to ) {
            $timeout.cancel(to);
          }
        };
      }
    };
  }]);
