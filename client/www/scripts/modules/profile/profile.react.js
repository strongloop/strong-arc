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
          <h2>Sign in to Strong Studio</h2>
          <div className="item item-divider assertive">
          {errorDisplay}
          </div>
          <form name="LoginForm" role="form">
            <div className="form-group">
              <label for="InputUserName">Username</label>
              <input id="InputUserName" value={credentials.email}
                className="form-control"
                name="InputUserName"
                onChange={that.handleChange}
                data-name="email"
                type="text"
                placeholder="Email" />
            </div>
            <div className="form-group">
              <label for="InputPassword">Password</label>
              <input type="password" className="form-control"
                value={credentials.password}
                id="InputPassword"
                data-name="password"
                onChange={that.handleChange}
                name="InputPassword"
                placeholder="Password" />
            </div>
            <button type="submit" onClick={submitLoginRequest} className="btn btn-primary pull-right">
            Sign In
            </button>
          </form>
        </div>
      </div>

    );
  }
});
