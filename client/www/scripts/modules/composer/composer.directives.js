Composer.directive('slComposerExceptionHelp', [
  function() {
    return {
      replace: true,
      templateUrl: './scripts/modules/composer/templates/composer.exception.help.html',
      scope: {
        helpInfo: '='
      },
      link: function(scope, el, attrs) {
        /*
         * The helpElement can contain hyperlinks as pointers to documentation or
         * examples or straight text as string.
         * Straight text will get wrapped in a <span> element
         * Text with hyperlinks must be specified as an array containing
         * either text or link elements
         *
         * the following thrown globalException object eg:
         *   stackItem.help = [
         *     { text: 'this is a description of the error' },
         *     { text: 'See:' },
         *     { text: 'I am the link text title', link: 'http://www.example.com'},
         *     { text: 'for more info' }
         *   ];
         *
         *   will get translated into a markup structure as follows:
         *   <span> this is a description of the error </span>
         *   <span See </span>
         *   <a href="http://www.example.com">I am the link text title</a>
         *   <span> for more info </span>
         *
         *   the following eg:
         *   stackItem.help = 'This is a description of the error';
         *
         *   will get translated into the following:
         *   <span> This is a description of the error </span>
         *
         * */
        scope.$watch('helpInfo', function(newVal) {
          if (!Array.isArray(newVal)) {
            scope.helpInfo = newVal = [newVal];
          }
        });
      }
    };
  }
]);

Composer.directive('slComposerExceptionView', [
  function() {
    return {
      replace: true,
      templateUrl: './scripts/modules/composer/templates/composer.exception.html',
      link: function(scope, el, attrs) {
        scope.toggleStackView = function() {
          $('[data-id="GlobalExceptionDetailsContainer"]').toggle(250);
        };

        scope.exceptionProps = [
          { key: 'name', label: 'Name' },
          { key: 'message', label: 'Message' },
          { key: 'details', label: 'Details' },
          { key: 'requestUrl', label: 'Request' },
          { key: 'status', label: 'status' }
        ];

        scope.$watch('globalExceptionStack', function(newVal) {
          var isFatal = function(stackItem) {
            return stackItem && stackItem.isFatal;
          };

          // Hide the navigation in the event of a fatal error
          if (newVal.some(isFatal)) {
            $('[data-id="MainSidebarContainer"]').hide();
            $('[data-id="IAMainContentContainer"]').hide();
          }
        }, true);
      }
    }
  }
]);
