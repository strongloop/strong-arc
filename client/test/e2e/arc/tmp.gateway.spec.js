var ArcViews = require('../arc/views/');
var BuildDeployViews = require('../build-deploy/views/');
var MetricsViews = require('../metrics/views/');
var GatewayViews = require('../gateway/views/');

var EC = protractor.ExpectedConditions;


describe('gateway smoke test', function() {
  describe('gateway-navigation', function() {
    it('should login, navigation to Gateway view, and log out',
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
        browser.driver.sleep(700);
        expect(EC.visibilityOf(gatewayHomeView.policyContainer));
        // Policy
        expect(EC.visibilityOf(gatewayHomeView.sideNewPolicyButton));




        // ok now create a policy
        gatewayHomeView.addMetricsPolicy();


        /*
        *
        * add auth proxy
        * add ratelimiting policy
        * add reverseproxy policy
        *
        * */

        //gatewayHomeView.closeModalButton.click();
        browser.driver.sleep(500);
        expect(EC.visibilityOf(gatewayHomeView.editPolicyNameInput));
        expect(gatewayHomeView.editPolicyNameInput.getAttribute('value')).toEqual('new Metrics policy name');
        browser.driver.sleep(700);

        gatewayHomeView.policyListViewButton.click();
        browser.driver.sleep(700);


        // add auth proxy
        gatewayHomeView.addAuthPolicy();


        browser.driver.sleep(500);
        expect(EC.visibilityOf(gatewayHomeView.editPolicyNameInput));
        expect(gatewayHomeView.editPolicyNameInput.getAttribute('value')).toEqual('new Auth policy name');
        browser.driver.sleep(700);


        // add ratelimiting policy
        gatewayHomeView.policyListViewButton.click();
        browser.driver.sleep(700);


        // add ratelimiting proxy
        gatewayHomeView.addRateLimitingPolicy();


        browser.driver.sleep(500);
        expect(EC.visibilityOf(gatewayHomeView.editPolicyNameInput));
        expect(gatewayHomeView.editPolicyNameInput.getAttribute('value')).toEqual('new Rate Limiting policy name');
        browser.driver.sleep(700);


        gatewayHomeView.policyListViewButton.click();
        browser.driver.sleep(700);

        // add reverseproxy policy
        gatewayHomeView.addReverseProxyPolicy();


        browser.driver.sleep(500);
        expect(EC.visibilityOf(gatewayHomeView.editPolicyNameInput));
        expect(gatewayHomeView.editPolicyNameInput.getAttribute('value')).toEqual('new Reverse Proxy policy name');
        browser.driver.sleep(700);


        gatewayHomeView.policyListViewButton.click();
        browser.driver.sleep(1000);

        //  DELETE POLICY
        expect(EC.visibilityOf(gatewayHomeView.deletePolicyButton));
        // gatewayHomeView.deleteFirstPolicy();





        /*
        *
        * PIPELINES
        *
        * */

        expect(EC.visibilityOf(gatewayHomeView.pipelineListViewButton));

        // pipeline
        gatewayHomeView.pipelineListViewButton.click();
        browser.driver.sleep(700);
        expect(EC.visibilityOf(gatewayHomeView.pipelineContainer));
        expect(EC.visibilityOf(gatewayHomeView.sideNewPipelineButton));

        browser.driver.sleep(500);
        gatewayHomeView.sideNewPipelineButton.click();
        browser.driver.sleep(500);
        browser.driver.sleep(500);
        expect(EC.visibilityOf(gatewayHomeView.closeModalButton));


        gatewayHomeView.addNewPipeline();
        browser.driver.sleep(500);

        // TODO fix post add new pipeline navigation
        // currently sits on the pipeline list view
        //expect(EC.visibilityOf(gatewayHomeView.editPipelineNameInput));
        //
        //expect(gatewayHomeView.editPipelineNameInput.getAttribute('value')).toEqual('new pipeline');


        browser.driver.wait(
          EC.presenceOf(gatewayHomeView.pipelineListViewButton),
          4000);
        gatewayHomeView.pipelineListViewButton.click();
        //browser.driver.sleep(300);




        // mapping
        browser.driver.wait(
          EC.presenceOf(gatewayHomeView.gatewaymapListViewButton),
          4000);
        gatewayHomeView.gatewaymapListViewButton.click();

        browser.driver.wait(
          EC.presenceOf(gatewayHomeView.mappingContainer),
          4000);
        browser.driver.wait(
          EC.presenceOf(gatewayHomeView.sideNewMappingButton),
          4000);

        gatewayHomeView.sideNewMappingButton.click();

        browser.driver.wait(
          EC.presenceOf(gatewayHomeView.closeModalButton),
          4000);

        gatewayHomeView.addNewMapping();

        browser.driver.sleep(200);



        //gatewayHomeView.gatewaymapListViewButton.click();
        ////browser.driver.sleep(5000);
        //
        //
        //browser.driver.wait(
        //  EC.presenceOf(gatewayHomeView.deleteMappingButton),
        //  4000);
        gatewayHomeView.deleteFirstMapping();
        //browser.driver.wait(
        //  EC.presenceOf(gatewayHomeView.pipelineListViewButton),
        //  4000);
        //gatewayHomeView.pipelineListViewButton.click();
       // browser.driver.sleep(300);
        gatewayHomeView.deleteFirstPipeline();


        //gatewayHomeView.policyListViewButton.click();

        gatewayHomeView.deleteFirstPolicy();
        //browser.driver.wait(
        //  EC.presenceOf(gatewayHomeView.deletePolicyButton),
        //  4000);
        gatewayHomeView.deleteFirstPolicy();
        //browser.driver.wait(
        //  EC.presenceOf(gatewayHomeView.deletePolicyButton),
        //  4000);
        gatewayHomeView.deleteFirstPolicy();
        //browser.driver.wait(
        //  EC.presenceOf(gatewayHomeView.deletePolicyButton),
        //  4000);
        gatewayHomeView.deleteFirstPolicy();

        browser.driver.wait(
          EC.presenceOf(gatewayHomeView.pipelineListViewButton),
          4000);
        gatewayHomeView.pipelineListViewButton.click();
        browser.driver.wait(
          EC.presenceOf(gatewayHomeView.gatewaymapListViewButton),
          4000);
        gatewayHomeView.gatewaymapListViewButton.click();
        browser.driver.sleep(100);


        browser.driver.wait(
         EC.presenceOf(gatewayHomeView.homeNav),
         4000);
        gatewayHomeView.homeNav.click();

      }, 60*1000);
  });


});
