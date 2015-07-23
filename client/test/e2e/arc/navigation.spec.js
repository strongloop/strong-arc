var ArcViews = require('../arc/views/');
var ComposerViews = require('../composer/views/');
var BuildDeployViews = require('../build-deploy/views/');
var ProcessManagerViews = require('../process-manager/views/');
var MetricsViews = require('../metrics/views/');
var TracingViews = require('../tracing/views/');
var ProfilerViews = require('../profiler/views/');

var EC = protractor.ExpectedConditions;


describe('navigation smoke test', function() {
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
        expect(EC.visibilityOf(composerHomeView.componentIdentifier));

        headerView.logout();
      });
  });

  describe('build-deploy-navigation', function() {
    it('should login,' +
      ' navigation to Build Deploy view,' +
      ' and log out',
      function() {

        var loginView = new ArcViews.LoginView();
        var landingView = new ArcViews.LandingView();
        var buildDeployHomeView = new BuildDeployViews.BuildDeployHomeView();
        var headerView = new ArcViews.HeaderView();

        loginView.loginToLandingView();
        landingView.openBuildDeployView();
        expect(EC.visibilityOf(buildDeployHomeView.componentIdentifier));
        headerView.logout();
      });
  });


  describe('process-manager-navigation', function() {
    it('should login,' +
      ' navigation to Process Manager view,' +
      ' and log out',
      function() {

        var loginView = new ArcViews.LoginView();
        var landingView = new ArcViews.LandingView();
        var processManagerHomeView =
          new ProcessManagerViews.ProcessManagerHomeView();
        var headerView = new ArcViews.HeaderView();

        loginView.loginToLandingView();

        landingView.openProcessManagerView();
        expect(EC.visibilityOf(processManagerHomeView.componentIdentifier));
        headerView.logout();
      });
  });

  describe('metrics-navigation', function() {
    it('should login,' +
      ' navigation to Metrics view,' +
      ' and log out',
      function() {

        var loginView = new ArcViews.LoginView();
        var landingView = new ArcViews.LandingView();
        var metricsHomeView = new MetricsViews.MetricsHomeView();
        var headerView = new ArcViews.HeaderView();

        loginView.loginToLandingView();

        landingView.openMetricsView();
        expect(EC.visibilityOf(metricsHomeView.componentIdentifier));
        headerView.logout();
      });
  });


  describe('tracing-navigation', function() {
    it('should login,' +
      ' navigation to Tracing view,' +
      ' and log out',
      function() {

        var loginView = new ArcViews.LoginView();
        var landingView = new ArcViews.LandingView();
        var tracingHomeView = new TracingViews.TracingHomeView();
        var headerView = new ArcViews.HeaderView();

        loginView.loginToLandingView();

        landingView.openTracingView();
        expect(EC.visibilityOf(tracingHomeView.componentIdentifier));
        headerView.logout();
      });
  });

  describe('profiler-navigation', function() {
    it('should login,' +
      ' navigation to Profiler view,' +
      ' and log out',
      function() {

        var loginView = new ArcViews.LoginView();
        var landingView = new ArcViews.LandingView();
        var profilerHomeView = new ProfilerViews.ProfilerHomeView();
        var headerView = new ArcViews.HeaderView();

        loginView.loginToLandingView();

        landingView.openProfilerView();
        expect(EC.visibilityOf(profilerHomeView.componentIdentifier));
        headerView.logout();
      });
  });
});