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
Common.directive('slCommonAppControls', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/common/templates/common.app.controls.html'
    }
  }
]);

Common.directive('slCommonAppControllerMenu', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/common/templates/common.app.controller.menu.html',
      controller: [
        '$scope',
        '$log',
        '$timeout',
        '$interval',
        'WorkspaceServices',
        function($scope, $log, $timeout, $interval, WorkspaceServices) {

          var isCheckingAppStatus = false;
          var stop;
           /*
           * Check Local App Status
           *
           * - recursive call to check if local app is running
           * - if app is running call second api to get url
           *
           * */
          function checkLocalAppStatus() {

            if (!isCheckingAppStatus) {
              isCheckingAppStatus = true;
              WorkspaceServices.isAppRunning()
                .then(function(response) {
                  if (response.running) {
                    $scope.localAppCtx.localAppState = PM_CONST.RUNNING_STATE;
                    $scope.localAppCtx.link = WorkspaceServices.getLocalAppLink() || {};
                    isCheckingAppStatus = false;
                    if (!stop) {
                      startCheckingLocalAppStatus();
                    }
                  }
                  else {
                    isCheckingAppStatus = false;
                    $scope.localAppCtx.localAppState = PM_CONST.STOPPED_STATE;
                  }

                })
                .catch(function(error) {
                  isCheckingAppStatus = false;
                  $log.warn('bad check for local app running state', error);
                  $scope.localAppCtx.isLocalAppRunning = false;
                  $scope.localAppCtx.localAppState = PM_CONST.STOPPED_STATE;
                  $scope.localAppCtx = clearAppLink($scope.localAppCtx);

                });

            }
          }
          function startCheckingLocalAppStatus(){
            stop = $interval(function() {
              checkLocalAppStatus();
            }, PM_CONST.APP_POLL_INTERVAL);

          }

          function setAppLink(linkCtx, resp) {
            linkCtx.link = {
                display: resp.host + ':' + resp.port,
                url: '//' + resp.host + ':' + resp.port + '/'
              };
            WorkspaceServices.saveLocalAppLink(linkCtx.link);
            return linkCtx;
          }

          /*
           *
           * Button Event Controls
           *
           * */
          $scope.startApp = function() {
            $scope.localAppCtx.localAppState = PM_CONST.STARTING_STATE;
            // call workspace services
            WorkspaceServices.startApp()
              .then(function(appStartResponse) {
                if (appStartResponse.port) {
                  if (appStartResponse.host === "0.0.0.0") {
                    appStartResponse.host = 'localhost';
                  }
                  $scope.localAppCtx = setAppLink($scope.localAppCtx, appStartResponse);
                  $scope.localAppCtx.localAppState = PM_CONST.RUNNING_STATE;
                }
                return appStartResponse;
              })
              .then(function(response) {
                if (!stop) {
                  startCheckingLocalAppStatus();
                }
              }).
              catch(function(error) {
                $log.warn('bad start app running', error);
                $scope.localAppCtx.isLocalAppRunning = false;
                $scope.localAppCtx.localAppState = PM_CONST.STOPPED_STATE;
                $scope.localAppCtx = clearAppLink($scope.localAppCtx);

              });
          };
          $scope.reStartApp = function() {
            $scope.localAppCtx.isLocalAppRunning = false;
            $scope.localAppCtx.localAppState = PM_CONST.RESTARTING_STATE;
            $scope.localAppCtx = clearAppLink($scope.localAppCtx);

            WorkspaceServices.restartApp()
              .then(function(appRestartResponse) {
                if (appRestartResponse.port) {
                  if (appRestartResponse.host === "0.0.0.0") {
                    appRestartResponse.host = 'localhost';
                  }
                  $scope.localAppCtx = setAppLink($scope.localAppCtx, appRestartResponse);
                  $scope.localAppCtx.localAppState = PM_CONST.RUNNING_STATE;
                }
                return appRestartResponse;
              })
              .then(function(response) {
                if (!stop) {
                  startCheckingLocalAppStatus();
                }
              });
          };
          function clearAppLink(appCtx) {
            appCtx.link = {};
            WorkspaceServices.saveLocalAppLink(appCtx.link);
            return appCtx;
          };

          $scope.stopApp = function() {
            $scope.localAppCtx.isLocalAppRunning = false;
            $scope.localAppCtx.localAppState = PM_CONST.STOPPING_STATE;
            $scope.localAppCtx = clearAppLink($scope.localAppCtx);

            WorkspaceServices.stopApp()
              .then(function(response) {
                if (!response.running) {
                  $scope.localAppCtx.localAppState = PM_CONST.STOPPED_STATE;
                  if (angular.isDefined(stop)) {
                    $interval.cancel(stop);
                    stop = undefined;
                  }
                }
              });
          };

          /*
           *
           *   UI Button State Stuff
           *
           * */
          $scope.isShowStartButton = function() {
            if (($scope.localAppCtx.localAppState === PM_CONST.STOPPED_STATE) ||
              ($scope.localAppCtx.localAppState === PM_CONST.STARTING_STATE) ||
              ($scope.localAppCtx.localAppState === PM_CONST.UNKNOWN_STATE)) {
              return true;
            }
            return false;
          };
          $scope.isShowRestartButton = function() {
            if (($scope.localAppCtx.localAppState === PM_CONST.RUNNING_STATE) ||
              ($scope.localAppCtx.localAppState === PM_CONST.RETRIEVING_PORT_STATE) ||
              ($scope.localAppCtx.localAppState === PM_CONST.STOPPING_STATE) ||
              ($scope.localAppCtx.localAppState === PM_CONST.RESTARTING_STATE)) {
              return true;
            }
            return false;
          };
          $scope.isShowAppLink = function() {
            if ($scope.localAppCtx.link.url) {
              return true;
            }
          };
          $scope.isShowAppControlSpinner = function() {
            if ($scope.localAppCtx.link.url) {
              return false;
            }
            if ($scope.localAppCtx.localAppState === PM_CONST.STOPPED_STATE){
              return false;
            }
            if ($scope.localAppCtx.localAppState === PM_CONST.RUNNING_STATE){
              return false;
            }
            return true;
          };
          $scope.isButtonDisabled = function(buttonName) {

            var well = false;
            switch(buttonName) {

              case 'stop':
                if (($scope.localAppCtx.localAppState === PM_CONST.STOPPED_STATE) ||
                  ($scope.localAppCtx.localAppState === PM_CONST.STOPPING_STATE)){
                  well = true;
                }
                break;

              case 'start':
                if ($scope.localAppCtx.localAppState !== PM_CONST.STOPPED_STATE){
                  well = true;
                }
                break;

              case 'restart':
                if (($scope.localAppCtx.localAppState !== PM_CONST.RUNNING_STATE)){
                  well = true;
                }
                if (!$scope.localAppCtx.link.url) {
                  well = true;
                }
                break;

              default:

            }
            return well;
          };


          var init = function() {

            $scope.localAppCtx = {
              localAppState: PM_CONST.STOPPED_STATE,
              isLocalAppRunning: false,
              link: {},
              isLocalApp: true
            };
            checkLocalAppStatus();

          };

          init();
        }
      ]
    }
  }
]);

/*
*
*   Common Instance Tabs View
*
* */
Common.directive('slCommonInstanceTabsView', [
  function() {
    return {
      templateUrl: './scripts/modules/common/templates/common.instance.tabs.view.html',
      replace: true,
      scope: {
        tabItems: '=',
        onTabActivate: '&',
        onCloseTab: '&'
      },
      link: function(scope) {
        scope.clickInstanceTabItem = function(item) {
          scope.onTabActivate({
            id: item.id,
            type: item.type
          });
        };

        scope.clickInstanceTabClose = function(item) {
          scope.onCloseTab({
            id: item.id
          });
        };
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
            $scope.props = '{ radius:6, width:2, length: 4, color:\'#999\'}';
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
      scope: {
        name: '@'
      },
      templateUrl: './scripts/modules/common/templates/common.popover.help.html',
      link: function(scope, el, attrs){
        scope.loading = false;
        scope.position = attrs.position || 'right';
        scope.iconclass = attrs.iconclass || 'sl-icon sl-icon-question-mark';

         scope.$watch('showHelp', function(newVal, oldVal){
          if ( newVal ) {
            //only  show spinner on initial request
            if ( !scope.content ) {
              scope.loading = true;
            }

            $http.get('/help/'+scope.name+'.json')
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
      scope: {
        showontrue: '=?',
        onshow: '&?',
        secondaryButtonText: '@secondarybuttontext',
        secondaryButtonAction: '&secondarybuttonaction',
        classes: '@?'
      },
      transclude: true,
      templateUrl: './scripts/modules/common/templates/common.popover.info.html',
      link: function(scope, element, attrs, ctrl){
        var to;
        scope.position = attrs.position || 'bottom';
        scope.icon = attrs.icon;
        scope.title = attrs.title || '';
        scope.hideOnPageClick = attrs.hideonpageclick;

        scope.$watch('showontrue', function(newVal, oldVal){
          if ( scope.showPopover && newVal ) return;
          scope.showPopover = newVal;
        });

        scope.$watch('showPopover', function(newVal, oldVal){
          scope.showontrue = newVal;

          if ( newVal && scope.onshow ) {
            scope.onshow();
          }
        });

        $rootScope.$on('pageClick', function(e, $event){
          var isPopoverClick = !!$($event.target).parents('.ui-popover.info').length;
          var isOutsideTriggerClick = !!( $($event.target).parents('.ui-popover-trigger').length || $($event.target).hasClass('ui-popover-trigger') );

          if ( scope.hideOnPageClick && !isPopoverClick && !isOutsideTriggerClick ) {
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

          if (scope.hideOnPageClick && !isMenuClick) {
            scope.showPopover = false;
          }
        });

        scope.hidePopover = function(){
          if ( scope.hideOnPageClick ) return;

          to = $timeout(function(){
            scope.showPopover = false;
          }, 400);
        };

        scope.cancelHide = function() {
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


Common.directive('slMessageGlobal', [
  function(){
    return {
      restrict: 'E',
      replace: true,
      scope: {
      },
      transclude: true,
      templateUrl: './scripts/modules/common/templates/common.message.global.html',
      link: function(scope, elem, attrs){
        scope.$watch('showMessage', function(newVal){
          if ( !newVal ) {
            $(elem).addClass('hide');
          } else {
            $(elem).removeClass('hide');
          }
        })
      },
      controller:['$state', '$scope', '$rootScope', '$log', function($state, $scope, $rootScope, $log){
        $rootScope.$on('dismissMessage', function($event){
          $scope.showMessage = false;
        });

        $scope.onClickDismiss = function($event){
          $scope.showMessage = false;
          if ($scope.stateOnClose) {
            $state.go($scope.stateOnClose);
          }
        };

        $scope.links = [];
        $rootScope.$on('message', function($event, data){
          $scope.stateOnClose = data.stateOnClose;
          $scope.body = data.body;
          if (data.link) {
            $scope.links[0] = {
              link: data.link,
              linkText: data.linkText
            };
          }
          if (data.links) {
            $scope.links = data.links;
          }
          $scope.email = 'mailto:'+data.email+'?subject=Licensing';
          $scope.emailText = data.emailText;

          $scope.showMessage = true;
        });
      }]
    };
  }
]);
