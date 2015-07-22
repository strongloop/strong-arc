var ArcViews = require('../arc/views/');
var ProcessManagerViews = require('../process-manager/views/');
var EC = protractor.ExpectedConditions;

xdescribe('load-balancer-interactions', function () {
  beforeEach(function() {
		var loginView = new ArcViews.LoginView();
		var landingView = new ArcViews.LandingView();

		loginView.loginToLandingView();
		landingView.openProcessManagerView();
  });

	it('should login and navigate to process manager,' +
		'add a load balancer,' +
		'delete the load balancer', function () {
	  var processManagerHomeView = 
	  	new ProcessManagerViews.ProcessManagerHomeView();
	  var loadBalancerView = 
	  	new ProcessManagerViews.LoadBalancerView();

	  processManagerHomeView.openLoadBalancerForm();

	  loadBalancerView.addLoadBalancer('127.0.0.1', '3333');

	  browser.pause();
	});
});