var ArcViews = require('../arc/views/');
var ProcessManagerViews = require('../process-manager/views/');
var BuildDeployViews = require('../build-deploy/views/');
var EC = protractor.ExpectedConditions;

describe('process-manager-and-build-deploy-interactions', function () {
  beforeEach(function() {
		var loginView = new ArcViews.LoginView();
		var landingView = new ArcViews.LandingView();

		loginView.loginToLandingView();
		landingView.openProcessManagerView();
  });

  afterEach(function() {
    var headerView = new ArcViews.HeaderView();

    headerView.logout();
  });

	it('should login and navigate to process manager,' +
		'should add a pm host and activate it', function () {
	  var processManagerHostView = 
	  	new ProcessManagerViews.ProcessManagerHostView();
	  var buildDeployHomeView = 
	  	new BuildDeployViews.BuildDeployHomeView();
    var headerView = new ArcViews.HeaderView();
    var landingView = new ArcViews.LandingView();


	  browser.sleep(500);

	  processManagerHostView.addNewPMHost(
	  	'ec2-52-8-216-111.us-west-1.compute.amazonaws.com', '8701'
	  );

	  headerView.navigateToLandingPage();

	  landingView.openBuildDeployView();

	  browser.sleep(500);

	  buildDeployHomeView.buildApp();

		buildDeployHomeView.deployApp();

		headerView.navigateToLandingPage();

	  landingView.openProcessManagerView();

	  expect(
	  	EC.visibilityOf(
	  		processManagerHostView.processManagerStatusActive
	  	)
	  );

	  processManagerHostView.deleteProcessManagerHost();
	},5000000);
});