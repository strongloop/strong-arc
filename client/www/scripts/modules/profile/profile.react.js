/** @jsx React.DOM */
var LoginFormView = (LoginFormView = React).createClass({
  getInitialState: function() {
    return {credentials:this.props.scope.credentials}
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({credentials:nextProps.scope.credentials});
  },
  handleChange: function(event) {
    var scope = this.props.scope;
    var credentialName = '';
    if (event.target.attributes['data-name']) {
      credentialName = event.target.attributes['data-name'].value;
    }
    var xState = this.state;
    xState.credentials[credentialName] = event.target.value;
    this.setState(xState);
    scope.$apply(function() {
      scope.clearLoginErrorMessage();
    });
  },
  render: function() {
    var that = this;
    var scope = that.props.scope;
    var credentials = that.state.credentials;


    var submitLoginRequest = function(event) {
      var scope = that.props.scope;
      var formComp = event.target.form;
      event.preventDefault();
      var loginCredentials = {};

      for (var i = 0;i < formComp.length;i++) {
        if (formComp[i].attributes['id']){
          if ((formComp[i].attributes['id'].value === 'InputUserName')) {
            loginCredentials.email = formComp[i].value;
          }
          if ((formComp[i].attributes['id'].value === 'InputPassword')) {
            loginCredentials.password = formComp[i].value;
          }
        }
      }
      if (loginCredentials.email && loginCredentials.password) {
        scope.$apply(function() {
          scope.loginRequest(loginCredentials);
        });
      }
    };
    var errorDisplay = (<div />);
    if (scope.loginErrorMessage) {
      errorDisplay = (<div className="login-fail-message-container bg-danger">
      {scope.loginErrorMessage}
      </div>);
    }
    return (
      <div className="container card" id="LoginMainContainer">
        <div className="center_div">
          <div data-id="AuthExceptionMessageContainer" className="item item-divider assertive">
          {errorDisplay}
          </div>
          <h2 className="login-form-title">StrongLoop Studio Sign In</h2>
          <form data-id="LoginForm" name="LoginForm" role="form">
            <div className="form-group">
              <label for="InputUserName" className="field-label">Username</label>
              <input id="InputUserName" value={credentials.email}
              className="form-control"
              name="InputUserName"
              onChange={that.handleChange}
              data-name="email"
              type="text"
              placeholder="Email" />
            </div>
            <div className="form-group">
              <label for="InputPassword" className="field-label">Password</label>
              <input type="password" className="form-control"
              value={credentials.password}
              id="InputPassword"
              data-name="password"
              onChange={that.handleChange}
              name="InputPassword"
              placeholder="Password" />
            </div>
            <div className="login-button-container">
              <button type="submit" onClick={submitLoginRequest} className="btn btn-primary pull-right">
              Sign In
              </button>
            </div>
            <div className="lineBreak"></div>
          </form>
          <div data-id="LoginRegisterLinksContainer">
            <a href="https://strongloop.com/register/" target="_blank" title="StrongLoop Studio register link" data-id="RegisterLink" className="login-register-link">Register</a>
            <a href="https://strongloop.com/login?action=lostpassword" target="_blank" title="StrongLoop Studio forgot password link" data-id="ForgotPasswordLink" className="login-forgot-password-link">Forgot password</a>
          </div>
        </div>
      </div>


    );
  }
});
