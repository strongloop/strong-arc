/** @jsx React.DOM */
var ComposerExceptionDisplayView = (ComposerExceptionDisplayView = React).createClass({
  toggleStackView: function() {
    $('[data-id="GlobalExceptionDetailsContainer"]').toggle(250);
  },
  render: function() {
    var component = this;
    var scope = component.props.scope;
    var displayMarkup = (<div />);
    var clearGlobalException = function() {
      scope.$apply(function() {
        scope.clearGlobalException();
      });
    };

    if (scope.globalExceptionStack.length) {
      var prevMessage = '';
      displayMarkup = scope.globalExceptionStack.map(function(stackItem) {
        if (stackItem.message !== prevMessage) {
          prevMessage = stackItem.message;
          /*
           * NOTE the var declarations in the set are deliberately not
           * assigned in a block at the top of the function to make the code
           * more readable and portable.
           * */
          var nameElement;
          if (stackItem.name) {
            nameElement =  (
              <li>
                <span className="ia-global-exception-label">Name: </span>
                <span className="ia-global-exception-value">{stackItem.name}</span>
              </li>
              );
          }
          var messageElement;
          if (stackItem.message) {
            messageElement = (
              <li>
                <span  className="ia-global-exception-label">Message: </span>
                <span className="ia-global-exception-value">{stackItem.message}</span>
              </li>
              );
          }
          var detailsElement;
          if (stackItem.details) {
            detailsElement = (
              <li>
                <span  className="ia-global-exception-label">Details: </span>
                <span className="ia-global-exception-value">{stackItem.details}</span>
              </li>
              );
          }
          var requestUrlElement;
          if (stackItem.requestUrl) {
            requestUrlElement = (
              <li>
                <span  className="ia-global-exception-label">Request: </span>
                <span className="ia-global-exception-value">{stackItem.requestUrl}</span>
              </li>
              );
          }
          var statusElement;
          if (stackItem.status) {
            statusElement = (
              <li>
                <span  className="ia-global-exception-label">Staus: </span>
                <span className="ia-global-exception-value">{stackItem.status}</span>
              </li>
              );
          }
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
          var helpElement;
          if (stackItem.help) {
            var helpString = stackItem.help;
            if (Array.isArray(stackItem.help)) {
              helpString = stackItem.help.map(function(item) {
                  if (item.link) {
                    return (<a href={item.link} target="_blank" title={item.text}>{item.text}</a>);
                  }
                  else {
                    return (<span> {item.text} </span>);
                  }
                }
              );
            }
            helpElement = (
              <div className="ia-global-exception-help">{helpString}</div>
            );
          }
          var stackTraceElement;
          if (stackItem.stack) {
            stackTraceElement = (
              <div data-id="StackTraceMessageContainer"
              className="global-exception-stack-display">{stackItem.stack}</div>
              );
          };
          return (
            <div data-id="IAGlobalExceptionDisplayContainer" className="ia-global-exception-container">
              <span onClick={clearGlobalException} className="sl-icon sl-icon-close ia-global-exception-close-button"></span>
              <div className="ia-global-exception-header">Oops! Something is wrong</div>
              <div className="ia-global-exception-value">{stackItem.message}</div>
              {helpElement}
              <div className="ia-global-exception-link" onClick={component.toggleStackView}>Show/hide details</div>
              <div data-id="GlobalExceptionDetailsContainer">

                <ul className="ia-global-exception-body">
                  {nameElement}
                  {messageElement}
                  {detailsElement}
                  {requestUrlElement}
                  {statusElement}
                </ul>
                {stackTraceElement}

              </div>
            </div>);
        }

      });
    }
    return (<div>{displayMarkup}</div>);
  }
});
