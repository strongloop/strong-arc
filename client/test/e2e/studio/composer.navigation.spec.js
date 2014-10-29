var StudioViews = require('../studio/views/');
var ComposerViews = require('../composer/views/');

describe('composer-navigation', function() {
  it('should login,' +
    ' navigation to API Composer view,' +
    ' and log out',
    function() {

      var loginView = new StudioViews.LoginView();
      var landingView = new StudioViews.LandingView();
      var composerHomeView = new ComposerViews.ComposerHomeView();
      var headerView = new StudioViews.HeaderView();

      loginView.loginToLandingView();

      landingView.openComposerView();

      expect(composerHomeView.projectTitleContainer.getText()).toEqual('EMPTY');

      headerView.logout();

    }
  );

});
