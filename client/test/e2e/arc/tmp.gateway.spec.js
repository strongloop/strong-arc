var ArcViews = require('../arc/views/');
var BuildDeployViews = require('../build-deploy/views/');
var MetricsViews = require('../metrics/views/');
var GatewayViews = require('../gateway/views/');

var EC = protractor.ExpectedConditions;


describe('gateway smoke test', function() {
  describe('gateway-navigation', function() {
    it('should login,' +
      ' navigation to Gateway view,' +
      ' and log out',
      function() {

        var loginView = new ArcViews.LoginView();
        var landingView = new ArcViews.LandingView();
        var gatewayHomeView = new GatewayViews.GatewayHomeView();
        var headerView = new ArcViews.HeaderView();

        loginView.loginToLandingView();

        landingView.openGatewayView();
        expect(EC.visibilityOf(gatewayHomeView.componentIdentifier));
        expect(EC.visibilityOf(gatewayHomeView.policyListViewButton));
        gatewayHomeView.policyListViewButton.click();
        browser.sleep(700);
        expect(EC.visibilityOf(gatewayHomeView.policyContainer));
        // Policy
        expect(EC.visibilityOf(gatewayHomeView.sideNewPolicyButton));
        gatewayHomeView.sideNewPolicyButton.click();
        browser.sleep(500);
        expect(EC.visibilityOf(gatewayHomeView.closeModalButton));
        gatewayHomeView.closeModalButton.click();
        browser.sleep(1000);
        expect(EC.visibilityOf(gatewayHomeView.mainNewPolicyButton));
        gatewayHomeView.mainNewPolicyButton.click();
        browser.sleep(500);
        expect(EC.visibilityOf(gatewayHomeView.closeModalButton));
        gatewayHomeView.closeModalButton.click();
        browser.sleep(1000);



        // ok now create a policy
        gatewayHomeView.sideNewPolicyButton.click();
        browser.sleep(500);
        expect(EC.visibilityOf(gatewayHomeView.newPolicyNameInput));
        expect(EC.visibilityOf(gatewayHomeView.newPolicyTypeSelect));
        browser.sleep(2000);
        gatewayHomeView.newPolicyNameInput.sendKeys('new policy name');
        browser.sleep(2000);
        gatewayHomeView.newPolicyTypeSelect.click();
        browser.sleep(1000);
        //gatewayHomeView.newPolicyTypeSelect.click();
        //browser.sleep(1000);
       // browser.sleep(1000);
        expect(EC.visibilityOf(gatewayHomeView.policyTypeMetricsSelect));

        gatewayHomeView.policyTypeMetricsSelect.click();
        browser.sleep(1000);

        expect(gatewayHomeView.newPolicyTypeSelect.getText()).toEqual('metrics');

        browser.sleep(1000);
        expect(EC.visibilityOf(gatewayHomeView.saveNewInstanceButton));

        gatewayHomeView.saveNewInstanceButton.click();


        //gatewayHomeView.closeModalButton.click();
        browser.sleep(700);


        expect(EC.visibilityOf(gatewayHomeView.editPolicyNameInput));
        expect(gatewayHomeView.editPolicyNameInput.getAttribute('value')).toEqual('new policy name');

        browser.sleep(700);
        gatewayHomeView.policyListViewButton.click();
        browser.sleep(700);
        //
        //expect(EC.visibilityOf(gatewayHomeView.deletePolicyButton));
        //gatewayHomeView.deletePolicyButton.click();


        // deal with dialog


        // pipeline
        gatewayHomeView.pipelineListViewButton.click();
        browser.sleep(700);
        expect(EC.visibilityOf(gatewayHomeView.pipelineContainer));
        expect(EC.visibilityOf(gatewayHomeView.sideNewPipelineButton));
        gatewayHomeView.sideNewPipelineButton.click();
        browser.sleep(500);
        expect(EC.visibilityOf(gatewayHomeView.closeModalButton));
        gatewayHomeView.closeModalButton.click();
        browser.sleep(1000);
        expect(EC.visibilityOf(gatewayHomeView.mainNewPipelineButton));
        gatewayHomeView.mainNewPipelineButton.click();
        browser.sleep(500);
        expect(EC.visibilityOf(gatewayHomeView.closeModalButton));
        gatewayHomeView.closeModalButton.click();
        browser.sleep(1000);




        // mapping
        gatewayHomeView.gatewaymapListViewButton.click();
        browser.sleep(700);
        expect(EC.visibilityOf(gatewayHomeView.mappingContainer));
        expect(EC.visibilityOf(gatewayHomeView.sideNewMappingButton));
        //gatewayHomeView.sideNewMappingButton.click();
        //browser.sleep(500);
        //expect(EC.visibilityOf(gatewayHomeView.closeModalButton));
        //gatewayHomeView.closeModalButton.click();
        //browser.sleep(1000);
        //expect(EC.visibilityOf(gatewayHomeView.mainNewMappingButton));
        //gatewayHomeView.mainNewMappingButton.click();
        //browser.sleep(500);
        //expect(EC.visibilityOf(gatewayHomeView.closeModalButton));
        //gatewayHomeView.closeModalButton.click();
        //browser.sleep(1000);





        //browser.pause();
        headerView.logout();
      });
  });


});
