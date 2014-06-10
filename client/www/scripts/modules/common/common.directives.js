// Copyright StrongLoop 2014

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
            if (scope.currentOpenModelNames[i] === IAService.getActiveModelInstance().name) {
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
Common.directive('loadingIndicator', [
  function() {
    return {
      template: '<img src="./images/mf_progress_radar.gif" /><p>discovering schema...</p>'
    }
  }
]);

