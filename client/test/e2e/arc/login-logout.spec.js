var ArcViews = require('../arc/views/');

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

      loginView.loginAsTestUser();

      expect(landingView.landingTitle.getText()).toEqual('StrongLoop Arc');

      headerView.logout();

      expect(loginView.userNameInput.getText()).toEqual('');

    }
  );

});
