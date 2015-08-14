var ArcViews = require('../arc/views/');
var BuildDeployViews = require('../build-deploy/views/');
var MetricsViews = require('../metrics/views/');
var GatewayViews = require('../gateway/views/');
var gatewayHomeView = require('./views/gateway-home-view');

var EC = protractor.ExpectedConditions;


describe('gateway', function() {
  beforeEach(function(){
    var loginView = new ArcViews.LoginView();
    var landingView = new ArcViews.LandingView();
    var gatewayHomeView = new GatewayViews.GatewayHomeView();
    var headerView = new ArcViews.HeaderView();

    loginView.loginToLandingView();

    landingView.openGatewayView();
    gatewayHomeView.policyListViewButton.click();
    browser.sleep(700);
    // ok now create a policy
    gatewayHomeView.addMetricsPolicy();

    browser.sleep(700);

    gatewayHomeView.policyListViewButton.click();
    browser.sleep(1000);

    // pipeline
    gatewayHomeView.pipelineListViewButton.click();
    browser.sleep(700);
    gatewayHomeView.sideNewPipelineButton.click();
    browser.sleep(500);
    gatewayHomeView.addNewPipeline();
    browser.sleep(500);

    browser.driver.wait(
      EC.presenceOf(gatewayHomeView.pipelineListViewButton),
      4000);

    gatewayHomeView.pipelineListViewButton.click();
    // mapping
    browser.driver.wait(
      EC.presenceOf(gatewayHomeView.gatewaymapListViewButton),
      4000);
    gatewayHomeView.gatewaymapListViewButton.click();

    browser.driver.wait(
      EC.presenceOf(gatewayHomeView.sideNewMappingButton),
      4000);

    gatewayHomeView.sideNewMappingButton.click();

    browser.driver.wait(
      EC.presenceOf(gatewayHomeView.closeModalButton),
      4000);

    gatewayHomeView.addNewMapping();

    browser.driver.wait(
      EC.presenceOf(gatewayHomeView.gatewaymapListViewButton),
      4000);

    browser.driver.wait(
      EC.presenceOf(gatewayHomeView.pipelineListViewButton),
      4000);

    gatewayHomeView.gatewaymapListViewButton.click();

  });


  afterEach(function(){
    var loginView = new ArcViews.LoginView();
    var landingView = new ArcViews.LandingView();
    var gatewayHomeView = new GatewayViews.GatewayHomeView();
    var headerView = new ArcViews.HeaderView();

    browser.driver.wait(
      EC.presenceOf(gatewayHomeView.deleteMappingButton),
      4000);

    gatewayHomeView.deleteFirstMapping();


    browser.driver.wait(
      EC.presenceOf(gatewayHomeView.pipelineListViewButton),
      4000);

    gatewayHomeView.pipelineListViewButton.click();

    // browser.sleep(300);
    gatewayHomeView.deleteFirstPipeline();


    gatewayHomeView.policyListViewButton.click();

    gatewayHomeView.deleteFirstPolicy();
    browser.driver.wait(
      EC.presenceOf(gatewayHomeView.deletePolicyButton),
      4000);
    browser.driver.wait(
      EC.presenceOf(gatewayHomeView.pipelineListViewButton),
      4000);
    gatewayHomeView.pipelineListViewButton.click();
    browser.driver.wait(
      EC.presenceOf(gatewayHomeView.gatewaymapListViewButton),
      4000);
    gatewayHomeView.gatewaymapListViewButton.click();
    browser.sleep(100);


    browser.driver.wait(
      EC.presenceOf(gatewayHomeView.homeNav),
      4000)
    ;

    gatewayHomeView.homeNav.click();
    headerView.logout();

    browser.drive.wait(
      EC.presenceOf(loginView.userNameInput),
      4000);
  });

  it('should clone a gateway policy',function() {
    expect(true).toEqual(false);
  });

  it('should clone a gateway pipeline', function() {
    expect(true).toEqual(false);
  });

  it('should clone a gateway mapping', function() {
    expect(true).toEqual(false);
  });

  it('should edit a gateway policy',function() {
    expect(true).toEqual(false);
  });

  it('should edit a gateway pipeline', function() {
    expect(true).toEqual(false);
  });

  it('should edit a gateway mapping', function() {
    expect(true).toEqual(false);
  });
});
