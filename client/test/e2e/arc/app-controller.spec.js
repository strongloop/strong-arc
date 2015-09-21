var ArcViews = require('../arc/views/');

var EC = protractor.ExpectedConditions;

describe('app-controller-test', function() {
  describe('app-start', function() {
    it('should login,' +
      ' start local app, ' +
      ' confirm it is running, ' +
      ' stop app, ' +
      ' confirm it is stopped' +
      ' and log out',
      function() {

        var loginView = new ArcViews.LoginView();
        var appControllerView = new ArcViews.AppControllerView();
        var headerView = new ArcViews.HeaderView();

        loginView.loginToLandingView();

        headerView.openAppController();

        appControllerView.startStopApp();

        headerView.logout();
      });
  });

});
