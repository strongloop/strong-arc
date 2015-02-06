// Copyright StrongLoop 2014
/*
*
* Common Instance Container
*
* holds:
* - title view
* - tabs view
* - content view
*
*
*
*
* */
Common.directive('slCommonInstanceContainer', [
  function() {
    return {
      templateUrl: './scripts/modules/common/templates/common.instance.container.html'
    }
  }
]);
/*
*
*   Common Instance Title View
*
* */
Common.directive('slCommonInstanceTitleView', [
  function() {
    return {
      link: function(scope, el, attrs) {
        scope.$watch('activeInstance', function(newVal, oldVal) {
          if (scope.activeInstance) {
            React.renderComponent(CommonInstanceTitleView({scope: scope}), el[0]);
          }

        }, true);
        scope.$watch('activeInstanceUpdated', function() {
          if (scope.activeInstance) {
            React.renderComponent(CommonInstanceTitleView({scope: scope}), el[0]);
          }
        }, true);

      }
    }
  }
]);

/*
*
*   Common Instance Tabs View
*
* */
Common.directive('slCommonInstanceTabsView', [
  'IAService',
  function(IAService) {
    return {
      link: function(scope, el, attrs) {
        function renderComp(){

          var tabItems = [];
         if (scope.openInstanceRefs && scope.openInstanceRefs.length) {
            for (var i = 0;i < scope.openInstanceRefs.length;i++) {
              var isActive = false;
              if (scope.openInstanceRefs[i].name === scope.activeInstance.name) {
                isActive = true;
              }
              tabItems.push({
                id:scope.openInstanceRefs[i].id,
                name:scope.openInstanceRefs[i].name,
                type:scope.openInstanceRefs[i].type,
                isActive:isActive
              });
            }
          }
          React.renderComponent(CommonInstanceTabsView({scope:scope, tabItems:tabItems}), el[0]);

        }

        scope.$watch('activeInstance', function(instance) {
          if (scope.activeInstance) {
            renderComp();
          }
        },true);
        scope.$watch('activeInstanceUpdated', function() {
          if (scope.activeInstance) {
            renderComp();
          }
        }, true);
//        scope = scope.$parent;
        scope.$watch('openInstanceRefs', function(newNames, oldNames) {
          if (scope.activeInstance) {
            renderComp();
          }
        }, true);
      }
    }
  }
]);
/**
 * sl-common-enter
 *
 * calls a scope method on click event
 *
 * <input ng-enter="method()" />
 *
 *
 * */
Common.directive('slCommonEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.slCommonEnter);
        });

        event.preventDefault();
      }
    });
  };
});
 /**
 * sl-common-select-on-click
 *
 * generic attribute directive to autoselect the contents of an input
 * by single clicking the content
 *
 * */
Common.directive('slCommonSelectOnClick', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.on('click', function () {
        this.select();
      });
    }
  };
});
Common.directive('slCommonLoadingIndicator', [
  function() {
    return {
      template: '<span us-spinner="{{props}}"></span>',
      controller: function($scope, $attrs){
        $scope.size = $attrs.size || 'large';

        switch($scope.size){
          case 'small':
            $scope.props = '{radius:6, width:2, length: 4, color:\'#999\'}';
            break;
          case 'large':
          default:
            $scope.props = '{radius:30, width:8, length: 24, color:\'#7DBD33\'}';
            break;
        }
      }
    }
  }
]);

Common.directive('slPopoverHelp', [
  '$http',
  '$tooltip',
  '$log', function($http, $tooltip, $log){
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: './scripts/modules/common/templates/common.popover.help.html',
      link: function(scope, el, attrs){
        scope.loading = false;
        scope.position = attrs.position || 'right';

        scope.$watch('showHelp', function(newVal, oldVal){
          if ( newVal ) {
            //only  show spinner on initial request
            if ( !scope.content ) {
              scope.loading = true;
            }

            $http.get('/help/'+attrs.id+'.json')
              .then(function(res){
                scope.loading = false;
                scope.title = res.data.title;
                scope.content = res.data.body.view.value;
              });
          }
        });
      }
    };
}]);

Common.directive('slPopoverMenu', [
  '$http',
  '$tooltip',
  '$log',
  '$rootScope',
  '$timeout', function($http, $tooltip, $log, $rootScope, $timeout){
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      transclude: true,
      templateUrl: './scripts/modules/common/templates/common.popover.menu.html',
      link: function(scope, element, attrs, ctrl, transclude){
        var to;
        scope.position = attrs.position || 'bottom';
        scope.icon = attrs.icon;
        scope.title = attrs.title || '';
        scope.hideOnPageClick = attrs.hideonpageclick;
        scope.showPopover = false;

        scope.$watch('showPopover', function(newVal, oldVal){
        });

        $rootScope.$on('pageClick', function(e, $event){
          var isMenuClick = !!$($event.target).parents('.ui-popover.menu').length;

          if ( scope.hideOnPageClick && !isMenuClick ) {
            scope.showPopover = false;
          }
        });

        scope.hidePopover = function(){
          if ( scope.hideOnPageClick ) return;

          to = $timeout(function(){
            scope.showPopover = false;
          }, 400);
        };

        scope.cancelHide = function(){
          if ( scope.hideOnPageClick ) return;

          if ( to ) {
            $timeout.cancel(to);
          }
        };

        transclude(scope.$parent, function(clone, scope) {
          clone.removeClass('hide');
          element.find('.ui-popover-body').append(clone);
        });
      }
    };
  }]);

Common.directive('slPopoverInfo', [
  '$http',
  '$tooltip',
  '$log',
  '$rootScope',
  '$timeout', function($http, $tooltip, $log, $rootScope, $timeout){
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      transclude: true,
      templateUrl: './scripts/modules/common/templates/common.popover.info.html',
      link: function(scope, element, attrs, ctrl){
        var to;
        scope.position = attrs.position || 'bottom';
        scope.icon = attrs.icon;
        scope.title = attrs.title || '';
        scope.hideOnPageClick = attrs.hideonpageclick;

        scope.$watch('showPopover', function(newVal, oldVal){
        });

        $rootScope.$on('pageClick', function(e, $event){
          var isPopoverClick = !!$($event.target).parents('.ui-popover.info').length;

          if ( scope.hideOnPageClick && !isPopoverClick ) {
            scope.showPopover = false;
          }
        });

        scope.hidePopover = function(){
          if ( scope.hideOnPageClick ) return;

          to = $timeout(function(){
            scope.showPopover = false;
          }, 400);
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

Common.directive('slPopover', [
  '$http',
  '$tooltip',
  '$log',
  '$rootScope',
  '$timeout', function($http, $tooltip, $log, $rootScope, $timeout){
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      transclude: true,
      templateUrl: './scripts/modules/common/templates/common.popover.html',
      link: function(scope, element, attrs, ctrl, transclude){
        var to;
        scope.position = attrs.position || 'left';
        scope.icon = attrs.icon;
        scope.hideOnPageClick = attrs.hideonpageclick;

        scope.$watch('showPopover', function(newVal, oldVal){
        });

        $rootScope.$on('pageClick', function(e, $event){
          var isMenuClick = !!$($event.target).parents('.ui-popover.generic').length;

          if ( scope.hideOnPageClick && !isMenuClick ) {
            scope.showPopover = false;
          }
        });

        scope.hidePopover = function(){
          if ( scope.hideOnPageClick ) return;

          to = $timeout(function(){
            scope.showPopover = false;
          }, 400);
        };

        scope.cancelHide = function(){
          if ( scope.hideOnPageClick ) return;

          if ( to ) {
            $timeout.cancel(to);
          }
        };
        //
        //transclude(scope.$parent, function(clone, scope) {
        //  clone.removeClass('hide');
        //  element.find('.ui-popover-body').append(clone);
        //});
      }
    };
  }]);

Common.directive('slCommonFormMessage', [
  function () {
    return {
      restrict: "E",
      replace: true,
      scope: {
        message: '=',
        type: '=?'
      },
      templateUrl: './scripts/modules/common/templates/common.form-message.html',
      controller: function($scope, $attrs, $log){
        $scope.hideMessage = function(){
          $scope.message = '';
          $scope.type = '';
        };
      }
    }
  }
]);

Common.directive('slCommonConsoleLog', [
  function () {
    return {
      restrict: "E",
      replace: true,
      templateUrl: './scripts/modules/common/templates/common.console.html'
    }
  }
]);


Common.directive('slIframeOnload', [function(){
  return {
    scope: {
      callBack: '&slIframeOnload'
    },
    link: function(scope, element, attrs){
      element.on('load', function(){
        return scope.callBack();
      })
    }
  }}]);


Common.directive('ngFocus', ['$log', function($log) {
  var FOCUS_CLASS = "ng-focused";
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      ctrl.$focused = false;
      element.bind('focus', function(evt) {
        element.addClass(FOCUS_CLASS);
        scope.$apply(function() {ctrl.$focused = true;});
      }).bind('blur', function(evt) {
        if ( scope.isClearLink ) return;

        element.removeClass(FOCUS_CLASS);
        scope.$apply(function() {ctrl.$focused = false;});
      });
    }
  }
}]);
