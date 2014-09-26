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
      template: '<div class="loading-indicator"><img src="./style/src/images/spinner3-greenie.gif" /></div>'
    }
  }
]);


