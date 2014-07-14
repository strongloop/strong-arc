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
      templateUrl: './scripts/modules/common/templates/common.instance.container.html',
      controller: function($scope) {


      },
      link: function(scope, el, attrs) {
        jQuery('[data-id="CommonInstanceContainer"]').dblclick(function() {
          scope.toggleInstanceContainer();
        });
      }
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
          React.renderComponent(CommonInstanceTitleView({scope: scope}), el[0]);
        });
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

          for (var i = 0;i < scope.openInstanceRefs.length;i++) {
            var isActive = false;
            if (scope.openInstanceRefs[i].name === scope.activeInstance.name) {
              isActive = true;
            }
            tabItems.push({
              name:scope.openInstanceRefs[i].name,
              isActive:isActive
            });
          }

          React.renderComponent(CommonInstanceTabsView({scope:scope, tabItems:tabItems}), el[0]);
        }

        scope.$watch('activeInstance', function(newVal, oldVal) {
          renderComp();
        });
//        scope = scope.$parent;
        scope.$watch('openInstanceRefs', function(newNames, oldNames) {
          renderComp();
        });
      }
    }
  }
]);
/*
*
*   Common Instance Content View Container
*
*   - model form view
*   - model preview
*   - datasource form view
*   - datasource preview
*
* */
Common.directive('slCommonInstanceContentView', [
  function() {
    return {
      link: function(scope, el, attrs) {

      }
    }
  }
]);






/*
 *
 *   Instance Create
 *
 * */
Common.directive('slCommonInstanceCreate', [
  'IAService',
  function(IAService) {
    return {
      replace: true,
      link: function(scope, el, attrs) {
        function renderComp(){
          var tabItems = [];

          for (var i = 0;i < scope.currentOpenModelNames.length;i++) {
            var isActive = false;
            if (scope.currentOpenModelNames[i] === IAService.getActiveInstance().name) {
              isActive = true;
            }
            tabItems.push({
              name:scope.currentOpenModelNames[i],
              isActive:isActive
            });
          }

          React.renderComponent(CommonCreateInstanceContainer({scope:scope, tabItems:tabItems}), el[0]);
        }

        scope.$watch('newModelInstance', function(newVal, oldVal) {
          renderComp();
        }, true);


//        scope.$watch('previewInstance', function(newVal, oldVal) {
//          React.renderComponent(CommonPreviewInstanceContainer({scope:scope}), el[0]);
//        });
      }
    }
  }
]);
/*
*
*   Instance Preview
*
* */
Common.directive('slCommonInstancePreview', [
  'IAService',
  function(IAService) {
    return {
      replace: true,
     // templateUrl: './scripts/modules/common/templates/common.instance.preview.html',
      link: function(scope, el, attrs) {
        function renderComp(){
          var tabItems = [];

          for (var i = 0;i < scope.currentOpenModelNames.length;i++) {
            var isActive = false;
            if (scope.currentOpenModelNames[i] === IAService.getActiveInstance().name) {
              isActive = true;
            }
            tabItems.push({
              name:scope.currentOpenModelNames[i],
              isActive:isActive
            });
          }

          React.renderComponent(CommonPreviewInstanceContainer({scope:scope, tabItems:tabItems}), el[0]);
        }

        scope.$watch('previewInstance', function(newVal, oldVal) {
          renderComp();
        });


//        scope.$watch('previewInstance', function(newVal, oldVal) {
//          React.renderComponent(CommonPreviewInstanceContainer({scope:scope}), el[0]);
//        });
      }
    }
  }
]);
// reference https://github.com/goodeggs/ng-focus-on
Common.directive('focusOn', function() {
  return function(scope, elem, attr) {
    return scope.$on('focusOn', function(e, name) {
      if (name === attr.focusOn) {
        return elem[0].select();
      }
    });
  };
});
Common.directive('slCommonLoadingIndicator', [
  function() {
    return {
      template: '<div class="loading-indicator"><img src="./images/mf_progress_radar.gif" /><p>discovering schema...</p></div>'
    }
  }
]);
Common.directive('slCommonDisabledAttrib', [
  function() {
    return {
      restrict: 'A',
      replace: false,
      controller: function($scope) {
        console.log('disabled attribute')
      },
      link: function(scope, el, attrs) {

        el.attr('disabled', 'disabled');

        scope.$watch('dsTablesGridOptions.selectedItems', function(items) {
          console.log('TEST VALU ETST VAOE');
        });
        var x = 'y';
      }
    };
  }
]);

