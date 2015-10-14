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
});
