var GatewayHomeView = (function () {
  var EC = protractor.ExpectedConditions;

  function GatewayHomeView() {
    var self = this;
    self.componentIdentifier = element(
      by.css('span.ia-project-title-container'));


    self.homeNav = element(by.css('div.branding a'));

    // policy
    self.policyListViewButton = element(by.css('button[data-type="policy"].tree-branch'));
    self.policyContainer = element(by.css('div[ng-controller="PolicyMainController"]'));

    self.editPolicyNameInput = element(by.css('input[type="text"][ng-model="policy.name"]'));
    self.newPolicyNameInput = element(by.css('div.modal-body input[type="text"][ng-model="policy.name"]'));
    self.newPolicyTypeSelect = element(by.css('div.modal-body div.policy-type-select-container button.toggle-btn'));
    self.deletePolicyButton = element(by.css('table.policies tbody tr:nth-child(1) td.actions a.delete-policy'));
    //self.newPolicyTypeValueAttrib = element(by.css('div.modal-body div.policy-type-select-container button.toggle-btn'));
    self.policyTypeAuthSelect = element(by.css('div.modal-body div.policy-type-select-container ul.dropdown-menu li button[value="auth"]'));
    self.policyTypeMetricsSelect = element(by.css('div.modal-body div.policy-type-select-container ul.dropdown-menu li button[value="metrics"]'));
    self.policyTypeRateLimitingSelect = element(by.css('div.modal-body div.policy-type-select-container ul.dropdown-menu li button[value="ratelimiting"]'));
    self.policyTypeReversProxySelect = element(by.css('div.modal-body div.policy-type-select-container ul.dropdown-menu li button[value="reverseproxy"]'));

    self.policyReversProxyTargetUrlInput = element(by.css('div.modal-body div.policy-proxy-container input[ng-model="policy.targetURL"]'));
    self.policyRateLimitingLimitInput = element(by.css('div.modal-body div.policy-ratelimit-container input[ng-model="policy.limit"]'));
    self.policyRateLimitingIntervalInput = element(by.css('div.modal-body div.policy-ratelimit-container input[ng-model="policy.interval"]'));
    self.policyAuthScopeInput = element(by.css('div.modal-body div.policy-scope-input-container input.policy-scope-input'));

    self.sideNewPolicyButton = element(by.css('button[data-type="policy"].nav-tree-item-addnew'));
    self.mainNewPolicyButton = element(by.css('div.entity-list-container button[data-type="policy"].add-new'));

    self.closeModalButton = element(by.css('button[ng-click="close()"]'));
    self.saveNewInstanceButton = element(by.css('div.modal-footer button.primary'));

    self.pipelineListViewButton = element(by.css('button[data-type="pipeline"].tree-branch'));
    self.pipelineContainer = element(by.css('div[ng-controller="PipelineMainController"]'));

    self.newPipelineNameInput = element(by.css('.modal-body div[data-id="PipelineFormContainer"] input[ng-model="pipeline.name"]'));
    self.editPipelineNameInput = element(by.css('div[data-id="PipelineFormContainer"] input[ng-model="pipeline.name"]'));
    self.newPipelineAddPolicyButton = element(by.css('.modal-body div[data-id="PipelineFormContainer"] div.ui-menu-container button.toggler'));
    self.newPipelineMetricsPolicySelect = element(by.css('.modal-body a[data-id="new Metrics policy name"]'));
    self.newPipelineFirstPolicy = element(by.css('.modal-body td[title="new Metrics policy name"]'));

    self.deletePipelineButton = element(by.css('table.pipelines td.actions a.delete-pipeline'));

    self.sideNewPipelineButton = element(by.css('button[data-type="pipeline"].nav-tree-item-addnew'));
    self.mainNewPipelineButton = element(by.css('div.entity-list-container button[data-type="pipeline"].add-new'));

    self.sideNewMappingButton = element(by.css('button[data-type="gatewaymap"].nav-tree-item-addnew'));
    self.mainNewMappingButton = element(by.css('div.entity-list-container button[data-type="gatewaymap"].add-new'));

    self.gatewaymapListViewButton = element(by.css('button[data-type="gatewaymap"].tree-branch'));

    self.mappingContainer = element(by.css('div[ng-controller="GatewayMapMainController"]'));
    self.newMappingNameInput = element(by.css('.modal-body div[data-id="GatewayMapFormContainer"] input.map-name'));
    self.newMappingEndpointInput = element(by.css('.modal-body div[data-id="GatewayMapFormContainer"] input.map-endpoint'));
    //self.editMappingNameInput = element(by.css('div[data-id="GatewayMapFormContainer"] input[ng-model="map.name"]'));
    //self.newMappingAddPipelineButton = element(by.css('.modal-body .modal-body .ui-menu-container.pipeline-menu .toggler'));
    self.newMappingVerbSelect = element(by.css('.modal-body .ui-menu-container.verb-menu .toggler'));
    self.newMappingVerbAllSelect = element(by.css('.modal-body .ui-menu-container.verb-menu .menu li:nth-child(1) a'));
    self.newMappingPipelineSelect = element(by.css('.modal-body .ui-menu-container.pipeline-menu .toggler'));
    self.newMappingPipelineInstanceSelect = element(by.css('.modal-body .ui-menu-container.pipeline-menu .menu li:nth-child(1) a'));
    //self.newMappingFirstPipeline = element(by.css('.modal-body td[title="new pipeline"]'));
    //
    self.deleteMappingButton = element(by.css('table.mappings td.actions a.delete-map'));
    self.confirmDeleteMappingButton = element(by.css('.modal button.delete-map'));
    self.confirmDeletePipelineButton = element(by.css('.modal button.delete-pipeline'));
    self.confirmDeletePolicyButton = element(by.css('.modal button.delete-policy'));

    self.openNewPolicyFromNav = function() {
      self.sideNewPolicyButton.click();
      browser.sleep(500);
      expect(EC.visibilityOf(self.closeModalButton));
      self.closeModalButton.click();
    };
    self.openNewPolicyFromView = function() {
      expect(EC.visibilityOf(self.mainNewPolicyButton));
      self.mainNewPolicyButton.click();
      browser.sleep(500);
      expect(EC.visibilityOf(self.closeModalButton));
      self.closeModalButton.click();
    };

    self.addMetricsPolicy = function() {
      self.sideNewPolicyButton.click();
      browser.driver.wait(
        EC.presenceOf(self.newPolicyNameInput),
        4000);


      self.newPolicyNameInput.sendKeys('new Metrics policy name');

      self.newPolicyTypeSelect.click();

      browser.driver.wait(
        EC.presenceOf(self.policyTypeMetricsSelect),
        4000);

      self.policyTypeMetricsSelect.click();

      expect(self.newPolicyTypeSelect.getText()).toEqual('metrics');

      browser.driver.wait(
        EC.presenceOf(self.saveNewInstanceButton),
        4000);

      self.saveNewInstanceButton.click();
    };
    self.addAuthPolicy = function() {
      self.sideNewPolicyButton.click();
     // browser.sleep(500);
      browser.driver.wait(
        EC.presenceOf(self.newPolicyNameInput),
        4000);
      self.newPolicyNameInput.sendKeys('new Auth policy name');
     // browser.sleep(300);
      self.newPolicyTypeSelect.click();
     // browser.sleep(300);
      self.policyTypeAuthSelect.click();
    //  browser.sleep(300);

      expect(self.newPolicyTypeSelect.getText()).toEqual('auth');

     // browser.sleep(300);
      browser.driver.wait(
        EC.presenceOf(self.saveNewInstanceButton),
        4000);

    //  expect(EC.visibilityOf(self.saveNewInstanceButton));

      self.saveNewInstanceButton.click();
    };
    self.addRateLimitingPolicy = function() {
      self.sideNewPolicyButton.click();
     // browser.sleep(500);
      browser.driver.wait(
        EC.presenceOf(self.newPolicyNameInput),
        4000);

      self.newPolicyNameInput.sendKeys('new Rate Limiting policy name');
     // browser.sleep(300);
      self.newPolicyTypeSelect.click();
     // browser.sleep(300);
      self.policyTypeRateLimitingSelect.click();
     // browser.sleep(300);

      expect(self.newPolicyTypeSelect.getText()).toEqual('ratelimiting');

      expect(EC.visibilityOf(self.policyRateLimitingLimitInput));
      expect(EC.visibilityOf(self.policyRateLimitingIntervalInput));

      self.policyRateLimitingLimitInput.sendKeys('5000');
      self.policyRateLimitingIntervalInput.sendKeys('500000');

      browser.driver.wait(
        EC.presenceOf(self.saveNewInstanceButton),
        4000);
    //  expect(EC.visibilityOf(self.saveNewInstanceButton));

      self.saveNewInstanceButton.click();

    };
    self.addReverseProxyPolicy = function() {
      self.sideNewPolicyButton.click();
      //browser.sleep(500);
      browser.driver.wait(
        EC.presenceOf(self.newPolicyNameInput),
        4000);

      self.newPolicyNameInput.sendKeys('new Reverse Proxy policy name');
      //browser.sleep(300);
      self.newPolicyTypeSelect.click();
     // browser.sleep(300);
      self.policyTypeReversProxySelect.click();
      //browser.sleep(300);

      expect(self.newPolicyTypeSelect.getText()).toEqual('reverseproxy');

      expect(EC.visibilityOf(self.policyReversProxyTargetUrlInput));

      self.policyReversProxyTargetUrlInput.sendKeys('https://www.url.com');

     // browser.sleep(300);

      //expect(EC.visibilityOf(self.saveNewInstanceButton));

      browser.driver.wait(
        EC.presenceOf(self.saveNewInstanceButton),
        4000);

      self.saveNewInstanceButton.click();

    };

    self.deleteFirstPolicy = function() {
      //delete in list
      //browser.driver.wait(EC.presenceOf(self.deletePolicyButton), 4000);
      //self.deletePolicyButton.click();

      //lost list view
      var isListClickable = EC.elementToBeClickable(self.policyListViewButton);

      browser.driver.wait(isListClickable, 5000);
      self.policyListViewButton.click();

      //hover to reveal delete icon
      browser.actions().mouseMove(element(by.css('table.policies tbody tr:nth-child(1)'))).perform();
      browser.driver.sleep(500);
      browser.driver.wait(EC.elementToBeClickable(self.deletePolicyButton), 5000);

      //delete from list
      self.deletePolicyButton.click();

      //confirm delete
      browser.driver.wait(EC.elementToBeClickable(self.confirmDeletePolicyButton), 4000);
      self.confirmDeletePolicyButton.click();
      browser.driver.wait(EC.elementToBeClickable(self.policyListViewButton), 4000);

      //wait for modal to close
      browser.driver.sleep(1000);
    };

    self.deleteFirstPipeline = function() {
      //lost list view
      var isListClickable = EC.elementToBeClickable(self.pipelineListViewButton);

      browser.driver.wait(isListClickable, 5000);
      self.pipelineListViewButton.click();

      //hover to reveal delete icon
      browser.actions().mouseMove(element(by.css('table.pipelines tbody tr:nth-child(1)'))).perform();
      browser.driver.wait(EC.elementToBeClickable(self.deletePipelineButton), 5000);

      //delete from list
      self.deletePipelineButton.click();

      //confirm delete
      browser.driver.wait(EC.elementToBeClickable(self.confirmDeletePipelineButton), 4000);
      self.confirmDeletePipelineButton.click();
      browser.driver.wait(EC.elementToBeClickable(self.pipelineListViewButton), 4000);

      //wait for modal to close
      browser.driver.sleep(1000);
    };

    self.deleteFirstMapping = function() {

      //load list view
      var isListClickable = EC.elementToBeClickable(self.gatewaymapListViewButton);

      browser.driver.wait(isListClickable, 10000);
      self.gatewaymapListViewButton.click();
      browser.driver.sleep(500);

      //wait for table to load
      browser.driver.wait(EC.visibilityOf(element(by.css('table.mappings tbody tr'))), 5000);
      browser.driver.sleep(500);

      //hover to reveal delete icon
      browser.actions().mouseMove(element(by.css('table.mappings tbody tr:nth-child(1)'))).perform();
      browser.driver.wait(EC.elementToBeClickable(self.deleteMappingButton), 5000);

      browser.driver.sleep(500);
      self.deleteMappingButton.click();

      //confirm delete
      browser.driver.wait(EC.elementToBeClickable(self.confirmDeleteMappingButton), 4000);
      self.confirmDeleteMappingButton.click();

      //wait for modal to close
      browser.driver.sleep(1000);
    };

    self.addNewPipeline = function() {
      // get input field
    // expect(EC.visibilityOf(self.newPipelineNameInput));
      browser.driver.wait(
        EC.presenceOf(self.newPipelineNameInput),
        4000);
      //expect(EC.visibilityOf(self.newPipelineAddPolicyButton));
      browser.driver.wait(
        EC.presenceOf(self.newPipelineAddPolicyButton),
        4000);

      // send keys 'new pipeline'
      self.newPipelineNameInput.sendKeys('new pipeline');
      browser.sleep(100);
     // expect(EC.visibilityOf(self.newPipelineAddPolicyButton));

       // add policy
      self.newPipelineAddPolicyButton.click();
      browser.driver.wait(
        EC.presenceOf(self.newPipelineMetricsPolicySelect),
        4000);
     // expect(EC.visibilityOf(self.newPipelineMetricsPolicySelect));
      self.newPipelineMetricsPolicySelect.click();
      browser.sleep(100);

      // verify policy added
     // expect(EC.visibilityOf(self.newPipelineFirstPolicy));
      browser.driver.wait(
        EC.presenceOf(self.newPipelineFirstPolicy),
        4000);

      // save pipeline
    //
    //self.newPipelineNameInput
    //self.newPipelineAddPolicyButton
    //self.newPipelineMetricsPolicySelect
    //self.newPipelineFirstPolicy
      //browser.sleep(7000);
      browser.driver.wait(
        EC.presenceOf(self.saveNewInstanceButton),
        4000);

      self.saveNewInstanceButton.click();


    };

    self.addNewMapping = function() {
      // get input field
      //expect(EC.visibilityOf(self.newMappingNameInput));
    //  expect(EC.visibilityOf(self.newMappingAddPipelineButton));
      browser.driver.wait(
        EC.presenceOf(self.newMappingNameInput),
        4000);
      //browser.driver.wait(
      //  EC.presenceOf(self.newMappingAddPipelineButton),
      //  4000);
      // send keys 'new mapping'

      self.newMappingNameInput.sendKeys('new mapping');
     //
     //
     //// browser.pause();
     // // add verb
      self.newMappingVerbSelect.click();
      browser.sleep(300);
      browser.driver.wait(
        EC.presenceOf(self.newMappingVerbAllSelect),
        4000);
      self.newMappingVerbAllSelect.click();

      browser.sleep(100);
      expect(EC.visibilityOf(self.newMappingVerbSelect));

      self.newMappingEndpointInput.sendKeys('http://www.url.com');


      self.newMappingPipelineSelect.click();
      browser.driver.wait(
        EC.presenceOf(self.newMappingPipelineInstanceSelect),
        4000);
      self.newMappingPipelineInstanceSelect.click();

      browser.sleep(100);


      // expect(EC.visibilityOf(self.newMappingInstanceSelect));
     // self.newMappingInstanceSelect.click();
     // browser.sleep(300);
     //
     //
     // // add endpoint
     // // choose pipeline
     // // save
     //
     //
     // // add pipeline
     // self.newMappingAddPipelineButton.click();
     // browser.sleep(300);
     //
     // // verify policy added
     // expect(EC.visibilityOf(self.newMappingFirstPipeline));
     // // save pipeline
     // //
     // browser.sleep(300);
     //
      self.saveNewInstanceButton.click();
    };



    //GatewayMapMainController
    self.waitUntilLoaded = function() {
      browser.driver.wait(
        EC.presenceOf(self.componentIdentifier),
        10000);
    };
  }
  return GatewayHomeView;
})();

module.exports = GatewayHomeView;
