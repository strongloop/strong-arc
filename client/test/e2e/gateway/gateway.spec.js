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

  it('should edit a gateway mapping', function() {
    var gatewayHomeView = new GatewayViews.GatewayHomeView();

    //create two pipelines
    gatewayHomeView.cloneFirstPipeline();

    //list maps
    gatewayHomeView.loadMappingsList();

    //edit first map
    var editMapLink = gatewayHomeView.mappingsSummaryListEditLinks.first();
    var isEditLinkClickable = EC.elementToBeClickable(editMapLink);

    browser.driver.wait(isEditLinkClickable, wait);
    editMapLink.click();

    //change pipeline in dropdown
    gatewayHomeView.editMapSelectPipeline(-1); //select last item in list

    //change url endpoint
    gatewayHomeView.newMappingEndpointInputNoModal.sendKeys('/api2');

    //change verb
    gatewayHomeView.newMappingVerbSelectNoModal.click();
    browser.waitForAngular();

    browser.driver.wait(EC.presenceOf(gatewayHomeView.newMappingVerbPostSelectNoModal), wait);
    gatewayHomeView.newMappingVerbPostSelectNoModal.click();

    //first save button (some are hidden)
    gatewayHomeView.saveNewInstanceButtonNoModal.filter(function(el) {
      return el.isDisplayed();
    }).first().click();
    browser.waitForAngular();

    //confirm replace
    gatewayHomeView.confirmReplaceMappingButton.click();
    browser.waitForAngular();

    //list maps
    gatewayHomeView.loadMappingsList();

    //check for pipeline name
    var selectedPipelineName = gatewayHomeView.newMappingPipelineSelectNoModal.getAttribute('value');
    var endpointUrl = gatewayHomeView.newMappingEndpointInputNoModal.getAttribute('value');
    var selectedVerbName = gatewayHomeView.newMappingVerbSelectNoModal.getAttribute('value');

    //verify results of edit operation
    expect(selectedPipelineName).toMatch(/\d+/);
    expect(endpointUrl).toMatch(/api2/);
    expect(selectedVerbName).toEqual('POST');

    //cleanup
    //change mapping back to first pipeline so we can delete the cloned pipeline
    gatewayHomeView.loadMappingsList();
    var editMapLink = gatewayHomeView.mappingsSummaryListEditLinks.first();
    var isEditLinkClickable = EC.elementToBeClickable(editMapLink);
    browser.driver.wait(isEditLinkClickable, wait);
    editMapLink.click();

    //change pipeline in dropdown
    gatewayHomeView.editMapSelectPipeline(1, false); //select first item in list (nomodal)
    //first save button (some are hidden)
    gatewayHomeView.saveNewInstanceButtonNoModal.filter(function(el) {
      return el.isDisplayed();
    }).first().click();
    browser.waitForAngular();
    //confirm replace
    gatewayHomeView.confirmReplaceMappingButton.click();
    browser.waitForAngular();

    gatewayHomeView.deleteFirstPipelineClone();
  });
});
