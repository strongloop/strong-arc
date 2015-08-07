var ArcViews = require('../arc/views/');
var BuildDeployViews = require('../build-deploy/views/');
var MetricsViews = require('../metrics/views/');
var GatewayViews = require('../gateway/views/');

var EC = protractor.ExpectedConditions;


describe('gateway smoke test', function() {
  describe('gateway-navigation', function() {
    it('should login,' +
      ' navigation to Gateway view,' +
      ' and log out',
      function() {

        var loginView = new ArcViews.LoginView();
        var landingView = new ArcViews.LandingView();
        var gatewayHomeView = new GatewayViews.GatewayHomeView();
        var headerView = new ArcViews.HeaderView();

        loginView.loginToLandingView();

        landingView.openGatewayView();
        expect(EC.visibilityOf(gatewayHomeView.componentIdentifier));
        headerView.logout();
      });
  });


});
