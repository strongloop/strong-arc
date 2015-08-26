var ArcViews = require('../arc/views/');
var BuildDeployViews = require('../build-deploy/views/');
var MetricsViews = require('../metrics/views/');
var GatewayViews = require('../gateway/views/');
var gatewayHomeView = require('./views/gateway-home-view');

var EC = protractor.ExpectedConditions;


describe('gateway', function() {
  var wait = 5*1000;
  var sleep = 500;

  beforeEach(function(){
    var loginView = new ArcViews.LoginView();
    var landingView = new ArcViews.LandingView();
    var gatewayHomeView = new GatewayViews.GatewayHomeView();
    var headerView = new ArcViews.HeaderView();

    loginView.loginToLandingView();

    landingView.openGatewayView();
    gatewayHomeView.policyListViewButton.click();

    // ok now create a policy
    gatewayHomeView.addMetricsPolicy();

    gatewayHomeView.policyListViewButton.click();
    browser.waitForAngular();

    // pipeline
    gatewayHomeView.pipelineListViewButton.click();
    browser.waitForAngular();

    gatewayHomeView.sideNewPipelineButton.click();
    browser.waitForAngular();

    gatewayHomeView.addNewPipeline();
    browser.waitForAngular();

    browser.driver.wait(EC.presenceOf(gatewayHomeView.pipelineListViewButton), wait);

    gatewayHomeView.pipelineListViewButton.click();
    browser.waitForAngular();

    // mapping
    browser.driver.wait(EC.presenceOf(gatewayHomeView.gatewaymapListViewButton), wait);
    gatewayHomeView.gatewaymapListViewButton.click();
    browser.waitForAngular();

    browser.driver.wait(EC.presenceOf(gatewayHomeView.sideNewMappingButton), wait);

    gatewayHomeView.sideNewMappingButton.click();
    browser.waitForAngular();
    browser.driver.wait(EC.presenceOf(gatewayHomeView.closeModalButton), wait);

    gatewayHomeView.addNewMapping();
    browser.waitForAngular();
    browser.driver.wait(EC.presenceOf(gatewayHomeView.gatewaymapListViewButton), wait);
    browser.driver.wait(EC.presenceOf(gatewayHomeView.pipelineListViewButton), wait);
  });

  afterEach(function(){
    var loginView = new ArcViews.LoginView();
    var gatewayHomeView = new GatewayViews.GatewayHomeView();
    var headerView = new ArcViews.HeaderView();

    gatewayHomeView.deleteFirstMapping();
    gatewayHomeView.deleteFirstPipeline();
    gatewayHomeView.deleteFirstPolicy();

    gatewayHomeView.homeNav.click();
    headerView.logout();
    browser.driver.wait(EC.presenceOf(loginView.userNameInput), wait);
  });

  it('should clone a gateway policy',function() {
    var gatewayHomeView = new GatewayViews.GatewayHomeView();
    var policyMenuItemList = gatewayHomeView.policyMenuItemList;

    gatewayHomeView.cloneFirstPolicy();
    expect(policyMenuItemList.count()).toEqual(2);

    gatewayHomeView.deleteFirstPolicyClone();
    expect(policyMenuItemList.count()).toEqual(1);
  });

  it('should clone a gateway pipeline', function() {
    var gatewayHomeView = new GatewayViews.GatewayHomeView();
    var pipelineMenuItemList = gatewayHomeView.pipelineMenuItemList;

    gatewayHomeView.cloneFirstPipeline();
    expect(pipelineMenuItemList.count()).toEqual(2);

    gatewayHomeView.deleteFirstPipelineClone();
    expect(pipelineMenuItemList.count()).toEqual(1);
  });

  it('should clone a gateway mapping', function() {
    var gatewayHomeView = new GatewayViews.GatewayHomeView();
    var gatewayMapMenuItemList = gatewayHomeView.gatewayMapMenuItemList;

    gatewayHomeView.cloneFirstMapping();
    expect(gatewayMapMenuItemList.count()).toEqual(2);

    gatewayHomeView.deleteFirstMappingClone();
    expect(gatewayMapMenuItemList.count()).toEqual(1);
  });

  //
  //it('should edit a gateway policy',function() {
  //  expect(true).toEqual(false);
  //});
  //
  it('should edit a gateway pipeline', function() {
    var gatewayHomeView = new GatewayViews.GatewayHomeView();

    //clone policy
    gatewayHomeView.cloneFirstPolicy();

    //add new policy to pipeline
    gatewayHomeView.addNewPolicyToPipeline();

    //refresh pipeline page
    gatewayHomeView.loadPipelineList();

    //check for two policies in first pipeline
    expect(gatewayHomeView.pipelinePolicyList.count()).toBe(2);

    //edit first pipeline
    var firstPipelineMenuItem = gatewayHomeView.firstPipelineMenuItem;
    var isMenuVisible = EC.elementToBeClickable(firstPipelineMenuItem);

    browser.driver.wait(isMenuVisible, wait);
    firstPipelineMenuItem.click();
    browser.waitForAngular();

    gatewayHomeView.removePolicyInPipeline();

    //check for only one pipeline
    gatewayHomeView.loadPipelineList();
    expect(gatewayHomeView.pipelinePolicyList.count()).toBe(1);

    gatewayHomeView.deleteFirstPolicy();
  });

  //
  //it('should edit a gateway mapping', function() {
  //  expect(true).toEqual(false);
  //});
});
