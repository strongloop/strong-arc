var ArcViews = require('../arc/views/');

var EC = protractor.ExpectedConditions;

describe('arc-login-logout', function() {
  it('should log into Arc, ' +
    ' confirm landing page,' +
    ' logout',
    function() {
      var loginView = new ArcViews.LoginView();
      var landingView = new ArcViews.LandingView();
      var headerView = new ArcViews.HeaderView();

      loginView.openLoginView();

      expect(loginView.userNameInput.getText()).toEqual('');

      loginView.loginToLandingView();

      expect(landingView.landingTitle.getText()).toEqual('StrongLoop Arc');

      headerView.logout();
      expect(loginView.userNameInput.getText()).toEqual('');
    }
  );

  it('should log into Arc with incorrect credentials, ' +
    ' confirm login failure,' +
    ' logout',
    function() {
      var loginView = new ArcViews.LoginView();

      loginView.openLoginView();

      expect(loginView.userNameInput.getText()).toEqual('');

      loginView.loginAsFalseUser();

      expect(
        EC.visibilityOf(
          element(by.css('div .login-fail-message-container'))
        )
      );
  });
});
