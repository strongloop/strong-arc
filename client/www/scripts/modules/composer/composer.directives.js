Composer.directive('slComposerExceptionView', [
  function() {
    return {
      replace:true,
      link: function(scope, el, attrs) {

        scope.$watch('globalExceptionStack', function(newVal) {
          React.renderComponent(ComposerExceptionDisplayView({scope:scope}), el[0]);
          // fatal to Api Composer application
          newVal.map(function(stackItem) {
            if (stackItem.isFatal) {
              $('[data-id="MainSidebarContainer"]').hide();
              $('[data-id="IAMainContentContainer"]').hide();
            }
          });
        }, true);
      }
    }
  }
]);
