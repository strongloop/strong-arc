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
    //browser.driver.sleep(700);
    // ok now create a policy
    gatewayHomeView.addMetricsPolicy();

    //browser.driver.sleep(700);

    gatewayHomeView.policyListViewButton.click();
    browser.waitForAngular();
    //browser.driver.sleep(1000);

    // pipeline
    gatewayHomeView.pipelineListViewButton.click();
    browser.waitForAngular();
    //browser.driver.sleep(700);
    gatewayHomeView.sideNewPipelineButton.click();
    browser.waitForAngular();
    //browser.driver.sleep(500);
    gatewayHomeView.addNewPipeline();
    browser.waitForAngular();
    //browser.driver.sleep(500);

    browser.driver.wait(EC.presenceOf(gatewayHomeView.pipelineListViewButton), 4000);

    gatewayHomeView.pipelineListViewButton.click();
    browser.waitForAngular();
    // mapping
    browser.driver.wait(EC.presenceOf(gatewayHomeView.gatewaymapListViewButton), 4000);
    gatewayHomeView.gatewaymapListViewButton.click();
    browser.waitForAngular();

    browser.driver.wait(EC.presenceOf(gatewayHomeView.sideNewMappingButton), 4000);

    gatewayHomeView.sideNewMappingButton.click();
    browser.waitForAngular();
    browser.driver.wait(EC.presenceOf(gatewayHomeView.closeModalButton), 4000);

    gatewayHomeView.addNewMapping();
    browser.waitForAngular();
    browser.driver.wait(EC.presenceOf(gatewayHomeView.gatewaymapListViewButton), 4000);
    browser.driver.wait(EC.presenceOf(gatewayHomeView.pipelineListViewButton), 4000);
    //browser.driver.sleep(500);
  });


  afterEach(function(){
    var loginView = new ArcViews.LoginView();
    var landingView = new ArcViews.LandingView();
    var gatewayHomeView = new GatewayViews.GatewayHomeView();
    var headerView = new ArcViews.HeaderView();

    gatewayHomeView.deleteFirstMapping();
    gatewayHomeView.deleteFirstPipeline();
    gatewayHomeView.deleteFirstPolicy();

    gatewayHomeView.homeNav.click();
    headerView.logout();
    browser.driver.wait(EC.presenceOf(loginView.userNameInput), 4000);
  });

  it('should clone a gateway policy',function() {
    var loginView = new ArcViews.LoginView();
    var landingView = new ArcViews.LandingView();
    var gatewayHomeView = new GatewayViews.GatewayHomeView();
    var headerView = new ArcViews.HeaderView();

    gatewayHomeView.cloneFirstPolicy();
    expect(element.all(by.css('[data-menutype=policy] .tree-item-row')).count()).toEqual(2);

    gatewayHomeView.deleteFirstPolicyClone();
    expect(element.all(by.css('[data-menutype=policy] .tree-item-row')).count()).toEqual(1);
  });

  it('should clone a gateway pipeline', function() {
    var gatewayHomeView = new GatewayViews.GatewayHomeView();

    gatewayHomeView.cloneFirstPipeline();
    expect(element.all(by.css('[data-menutype=pipeline] .tree-item-row')).count()).toEqual(2);

    gatewayHomeView.deleteFirstPipelineClone();
    expect(element.all(by.css('[data-menutype=pipeline] .tree-item-row')).count()).toEqual(1);
  });

  //
  //it('should clone a gateway mapping', function() {
  //  expect(true).toEqual(true);
  //});

  //
  //it('should edit a gateway policy',function() {
  //  expect(true).toEqual(false);
  //});
  //
  //it('should edit a gateway pipeline', function() {
  //  expect(true).toEqual(false);
  //});
  //
  //it('should edit a gateway mapping', function() {
  //  expect(true).toEqual(false);
  //});
});
