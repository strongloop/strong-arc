var ArcViews = require('../arc/views/');
var ProcessManagerViews = require('../process-manager/views/');
var EC = protractor.ExpectedConditions;

describe('process-manager-host-interactions', function () {
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

	xit('should login and navigate to process manager,' +
		'add a valid pm host,', function () {
	  var processManagerHostView =
	  	new ProcessManagerViews.ProcessManagerHostView();

	  browser.sleep(500);

	  processManagerHostView.addNewPMHost('localhost', '1234');

	  processManagerHostView.checkForPMHostErrors();

	  expect(
	  	EC.visibilityOf(
	  		processManagerHostView.processManagerNoServerMessage
	  	)
	  );

	  processManagerHostView.deleteProcessManagerHost();
	});

	it('should login and navigate to process manager,' +
		'should add a pm host and activate it (test)', function () {
    var landingView = new ArcViews.LandingView();
	  var processManagerHostView =
	  	new ProcessManagerViews.ProcessManagerHostView();
    var processManagerHomeView = new ProcessManagerViews.ProcessManagerHomeView();

    var headerView = new ArcViews.HeaderView();

    headerView.navigateToLandingPage();
    browser.driver.wait(
      EC.presenceOf(this.processManagerAppCommand),
      10000);
    landingView.openProcessManagerView();

    browser.driver.wait(
      EC.visibilityOf(processManagerHomeView.componentIdentifier),
      10000);
	  processManagerHostView.addNewPMHost(
	  	'ec2-52-8-216-111.us-west-1.compute.amazonaws.com', '8701'
	  );

	  processManagerHostView.checkForPMHostMessage();

	  expect(
	  	EC.visibilityOf(
	  		processManagerHostView.processManagerNoApplicationFoundMessage
	  	)
	  );

	  processManagerHostView.deleteProcessManagerHost();


	});
});
