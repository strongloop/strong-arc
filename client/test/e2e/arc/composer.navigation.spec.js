var ArcViews = require('../arc/views/');
var ComposerViews = require('../composer/views/');

describe('composer-navigation', function() {
  it('should login,' +
    ' navigation to API Composer view,' +
    ' and log out',
    function() {

      var loginView = new ArcViews.LoginView();
      var landingView = new ArcViews.LandingView();
      var composerHomeView = new ComposerViews.ComposerHomeView();
      var headerView = new ArcViews.HeaderView();

      loginView.loginToLandingView();

      landingView.openComposerView();

      expect(composerHomeView.projectTitleContainer.getText()).toEqual('EMPTY');

      headerView.logout();

    }
  );

});
