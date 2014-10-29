var StudioViews = require('../studio/views/');

describe('studio-login-logout', function() {
  it('should log into Studio, ' +
    ' confirm landing page,' +
    ' logout',
    function() {
      var loginView = new StudioViews.LoginView();
      var landingView = new StudioViews.LandingView();
      var headerView = new StudioViews.HeaderView();

      loginView.openLoginView();

      expect(loginView.userNameInput.getText()).toEqual('');

      loginView.loginAsTestUser();

      expect(landingView.landingTitle.getText()).toEqual('StrongLoop Studio');

      headerView.logout();

      expect(loginView.userNameInput.getText()).toEqual('');

    }
  );

});
