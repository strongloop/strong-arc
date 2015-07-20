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
  '$parse',
  function($log, $parse) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: './scripts/modules/ui/templates/ui.toggle.html',
      scope: {
        togglers: '='
      },
      controller: function($scope, $attrs, $log) {
        var togglers = $scope.togglers;
        var anyActive = false;

        for (var i = 0; i < togglers.length; i++) {
          if (togglers[i].isActive) {
            anyActive = true;
            break;
          }
        }

        $scope.setActive = function(toggler) {
          var activeValue = $parse(toggler.activeId);

          //reset active flag for all togglers
          $scope.togglers.forEach(function(togg) {
            togg.isActive = false;
          });

          toggler.isActive = true;
          activeValue.assign($scope.$parent, toggler.id);
        };

        if (!anyActive) {
          // if no toggler is active, set the first active
          $scope.togglers[0].isActive = true;
          $scope.setActive(togglers[0]);
        }
      }
    };
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

/**
 * @ngdoc directive
 *
 * sl-ui-data-table
 *
 * Applies behaviour for complying with the SL styleguide to tables
 * containing inputs.
 */
UI.directive('slUiDataTable', function() {
  return {
    restrict: 'A',
    link: function($scope, element, attrs) {
      var eventName = 'click.slUiDataTable';
      var $lastSelected = null;

      $(element).off(eventName)
        .on(eventName, 'td.has-selectable', function(mouseEvent) {
          var $input = $(this).find(':input');

          // if the click was in the surrounding td, select the first input
          if (!$(mouseEvent.target).is(':input') && $input.length) {
            $input[0].focus();
          }

          // clear up the previous selections
          if ($lastSelected) {
            $lastSelected.removeClass('selected');
            $lastSelected.closest('tr').removeClass('has-selected-selectable');
          }

          // apply classes for selection, and preventing hover outline
          $(this).closest('tr').addClass('has-selected-selectable');
          $lastSelected = $(this).find('.selectable').addClass('selected');
      });
    }
  };
});

UI.directive('uiIcon', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: './scripts/modules/ui/templates/ui.icons.svg.html',
    scope: {
      name: '@',
      classes: '@'
    },
    link: function(scope, elem, attrs){
      var className = '.'+scope.name;
      var icon = elem.find(className);

      elem.html(icon);
    }
  };
});

UI.directive('uiCrumbs', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: './scripts/modules/ui/templates/ui.crumbs.html',
    scope: {
      crumbs: '=',
      onClick: '&'
    },
    link: function(scope, elem, attrs){
      scope._onClick = function($index, crumb){
        var len = scope.crumbs.length-1;
        var i = $index;

        //skip if clicking on last breadcrumb
        if ( i === len ) return;

        //remove crumbs after clicked crumb
        scope.crumbs.splice(i+1, len);
        scope.onClick({ i: i, crumb: crumb, len: len });
      }
    }
  };
});

UI.directive('slUiMenuDropdown', [
  '$http',
  '$log',
  '$rootScope',
  '$timeout', function($http, $log, $rootScope, $timeout){
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        toggler: '='
      },
      templateUrl: './scripts/modules/ui/templates/ui.menu.dropdown.html',
      link: function(scope, element, attrs){
        var to;
        scope.hideOnPageClick = attrs.hideonpageclick;

        $rootScope.$on('pageClick', function(e, $event){
          var isMenuClick = !!$($event.target).parents('.ui-menu-dropdown').length;

          if ( scope.hideOnPageClick && !isMenuClick ) {
            scope.toggler = false;
          }
        });

        scope.hideMenu = function(){
          if ( scope.hideOnPageClick ) return;

          to = $timeout(function(){
            scope.toggler = false;
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

UI.directive('slUiMenuDropdownFilter', [
  '$http',
  '$log',
  '$rootScope',
  '$timeout', function($http, $log, $rootScope, $timeout){
    return {
      restrict: 'E',
      replace: true,
      scope: {
        filterText: '=filter',
        toggler: '=',
        selected: '=',
        isFiltering: '=filtering'
      },
      templateUrl: './scripts/modules/ui/templates/ui.menu.dropdown.filter.html',
      controller: function($scope){
        $scope.clearFilter = function(item){
          $scope.filterText = '';
          $scope.toggler = false;
          $scope.selected = null;
        };

        $scope.hideMenu = function(){
          $scope.toggler = false;
        };

        $scope.showMenu = function(){
          $scope.toggler = true;
        };

        $scope.toggleMenu = function(){
          $scope.toggler = !$scope.toggler;
        };

        $scope.setFocused = function(val){
          $scope.isFocused = val;
        };
      }
    };
  }]);

UI.directive('uiDropdown', [
  '$http',
  '$log',
  '$rootScope',
  '$timeout', function($http, $log, $rootScope, $timeout){
    return {
      restrict: 'E',
      replace: true,
      scope: {
        selected: '=',
        items: '=',
        isFiltering: '=filtering'
      },
      templateUrl: './scripts/modules/ui/templates/ui.dropdown.html',
      controller: function($scope){
        $scope.toggler = false;
        $scope.filterText = '';

        $scope.showMenu = function(){
          $scope.toggler = true;
        };

        $scope.selectItem = function(item){
          $scope.filterText = item.name;
          $scope.selected = item;
          $scope.toggler = false;
        };
      }
    };
  }]);
