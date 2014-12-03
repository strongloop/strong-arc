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

Common.directive('slCommonPidSelector', [
  '$log',
  'ProfilerService',
  'CommonPidService',
  'CommonPMService',
  function($log, ProfilerService, CommonPidService, CommonPMService){
    return {
      restrict: 'E',
      replace: true,
      templateUrl: './scripts/modules/common/templates/common.pid-selector.html',
      controller: function($scope, $attrs){
        $scope.server = {
          host: '',
          port: ''
        };
        if (CommonPMService.getPMServers().length) {
          $scope.server = CommonPMService.getLastPMServer();
        }

        $scope.hasIframe = $attrs.iframe;
        $scope.activeProcess = null;
        $scope.showMoreMenu = false;
        $scope.isRemoteValid = false;
        $scope.isOpen = false;

        $scope.processes = [];

        $scope.hideMenu = function(){
          $scope.isOpen = false;
        };

        $scope.loadProcesses = function(form){
          if ( form.$valid ) {
            $log.log('load processes', $scope.server);

            CommonPidService.getDefaultPidData($scope.server, 1)
              .then(function(pidCollection) {
                CommonPMService.addPMServer($scope.server);
                $scope.processes = pidCollection;
              });
          }
        };

        //clear out active processes and remote state when going back to file
        $scope.resetRemoteState = function(){
          $scope.isRemoteValid = false;
          $scope.processes = [];
          $scope.activeProcess = null;

          if ( $scope.hasIframe ) {
            var iframe = window.frames['devtools'];

            if ( iframe.SL ) {
              iframe.SL.child.profiler.slInit();
            }
          }
        };

        $scope.$watch('form.$valid', function(newVal, oldVal) {
          if ( newVal !== oldVal && !newVal ) {
            $scope.resetRemoteState();
          }
        });

        $scope.setActiveProcess = function(process, isMoreClick){
          if ( $scope.activeProcess && $scope.activeProcess.status !== 'Running' ) return false;

          $scope.activeProcess = process;
          $scope.isProcessFromMore = isMoreClick;
          $log.log('active process', process);
          $scope.isRemoteValid = true;

          if ( $scope.hasIframe ) {
            var iframe = window.frames['devtools'];

            if ( iframe.SL ) {
              iframe.SL.child.profiler.slInit();
              iframe.SL.child.profiler.setServer($scope.server);
              iframe.SL.child.profiler.setActiveProcess(process);
            }
          }
        };
      }
    }
  }]);

Common.directive('slPopoverHelp', [
  '$http',
  '$tooltip',
  '$log', function($http, $tooltip, $log){
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: './scripts/modules/common/templates/common.popover.html',
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
        scope.hideOnPageClick = attrs.hideonpageclick;

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
