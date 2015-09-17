var ArcViews = require('../arc/views/');
var ProcessManagerViews = require('../process-manager/views/');
var EC = protractor.ExpectedConditions;

describe('load-balancer-interactions', function () {
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
		'add a load balancer,' +
		'delete the load balancer', function () {
	  var processManagerHomeView = 
	  	new ProcessManagerViews.ProcessManagerHomeView();
	  var loadBalancerView = 
	  	new ProcessManagerViews.LoadBalancerView();

	  processManagerHomeView.openLoadBalancerForm();

	  loadBalancerView.addLoadBalancer('127.0.0.1', '3333');

	  browser.sleep(1500);

	  processManagerHomeView.closeLoadBalancerForm();	  

	  browser.sleep(1000);

	  processManagerHomeView.openLoadBalancerForm();

	  loadBalancerView.addLoadBalancer('invalid host name', '0');

	  browser.sleep(1500);

	  processManagerHomeView.closeLoadBalancerForm();

	  browser.refresh();

	  processManagerHomeView.openLoadBalancerForm();

	  expect(
	  	loadBalancerView.loadBalancerHostInput.getAttribute('value')
	  ).toEqual('127.0.0.1');

	  loadBalancerView.deleteLoadBalancer();
	});
});