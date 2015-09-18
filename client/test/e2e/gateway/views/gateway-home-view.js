var GatewayHomeView = (function () {
  var EC = protractor.ExpectedConditions;

  function GatewayHomeView() {
    var self = this;
    var wait = 5*1000;
    var sleep = 500;


    //menu item lists
    self.policyMenuItemList =
      element.all(by.css('[data-menutype=policy] .tree-item-row'));
    self.pipelineMenuItemList =
      element.all(by.css('[data-menutype=pipeline] .tree-item-row'));
    self.gatewayMapMenuItemList =
      element.all(by.css('[data-menutype=gatewaymap] .tree-item-row'));

    self.componentIdentifier =
      element(by.css('span.ia-project-title-container'));

    self.homeNav =
      element(by.css('div.branding a'));

    // policy
    self.policyListViewButton =
      element(by.css('button[data-type="policy"].tree-branch'));
    self.policyContainer =
      element(by.css('div[ng-controller="PolicyMainController"]'));

    self.editPolicyNameInput =
      element(by.css('input[type="text"][ng-model="policy.name"]'));
    self.newPolicyNameInput =
      element(by.css('.modal-body [ng-model="policy.name"]'));
    var nPTSStr = '.modal-body [data-id="PolicyFormContainer"] ';
    nPTSStr = nPTSStr +'.ui-menu-container input.toggler';
    self.newPolicyTypeSelect =
      element(
        by.css(nPTSStr));

    self.deletePolicyButton =
    element(
      by.css(
        'table.policies tbody tr:nth-child(1) ' +
        'td.actions a.delete-policy'
      )
    );
    self.policyTypeListItems =
      element.all(by.css('.modal-body .ui-form ' +
      '.ui-menu-dropdown .menu li a'));
    self.policyTypeAuthSelect =
      self.policyTypeListItems.get(0);
    self.policyTypeMetricsSelect =
      self.policyTypeListItems.get(1);
    self.policyTypeRateLimitingSelect =
      self.policyTypeListItems.get(2);
    self.policyTypeReversProxySelect =
      self.policyTypeListItems.get(3);

    self.policyReversProxyTargetUrlInput =
      element(by.css(
        'div.modal-body div.policy-proxy-container ' +
        'input[ng-model="policy.targetURL"]'
      ));
    self.policyRateLimitingLimitInput =
      element(by.css(
        'div.modal-body div.policy-ratelimit-container ' +
        'input[ng-model="policy.limit"]'
      ));
    self.policyRateLimitingIntervalInput =
      element(by.css(
        'div.modal-body div.policy-ratelimit-container ' +
        'input[ng-model="policy.interval"]'
      ));
    self.policyAuthScopeInput =
      element(by.css(
        'div.modal-body div.policy-scope-input-container ' +
        'input.policy-scope-input'
      ));

    //sans-modal
    self.newPolicyNameInputNoModal =
      element(by.css('[ng-model="policy.name"]'));
    self.newPolicyTypeSelectNoModal =
      element(by.css(
        '[data-id="PolicyFormContainer"] .ui-menu-container ' +
        'input.toggler'
      ));
    self.policyTypeListItemsNoModal =
      element.all(by.css(
        '[data-id="PolicyFormContainer"] .ui-form .ui-menu-dropdown ' +
        '.menu li a'
      ));
    self.policyTypeAuthSelectNoModal =
      self.policyTypeListItemsNoModal.get(0);
    self.policyTypeMetricsSelectNoModal =
      self.policyTypeListItemsNoModal.get(1);
    self.policyTypeRateLimitingSelectNoModal =
      self.policyTypeListItemsNoModal.get(2);
    self.policyTypeReversProxySelectNoModal =
      self.policyTypeListItemsNoModal.get(3);
    self.policyReversProxyTargetUrlInputNoModal =
      element(by.css(
        '[data-id="PolicyFormContainer"] div.policy-proxy-container ' +
        'input[ng-model="policy.targetURL"]'
      ));
    self.policyRateLimitingLimitInputNoModal =
      element(by.css(
        '[data-id="PolicyFormContainer"] div.policy-ratelimit-container ' +
        'input[ng-model="policy.limit"]'
      ));
    self.policyRateLimitingIntervalInputNoModal =
      element(by.css(
        '[data-id="PolicyFormContainer"] div.policy-ratelimit-container ' +
        'input[ng-model="policy.interval"]'
      ));
    self.policyAuthScopeInputNoModal =
      element(by.css(
        '[data-id="PolicyFormContainer"] div.policy-scope-input-container ' +
        'input.policy-scope-input'
      ));

    self.sideNewPolicyButton =
      element(by.css('button[data-type="policy"].nav-tree-item-addnew'));
    self.mainNewPolicyButton =
      element(by.css(
        'div.entity-list-container button[data-type="policy"].add-new'
      ));

    self.closeModalButton =
      element(by.css('button[ng-click="close()"]'));
    self.saveNewInstanceButton =
      element(by.css('div.modal-footer button.primary'));
    self.saveNewInstanceButtonNoModal =
      element.all(by.css('.ui-form button.primary'));

    self.pipelineListViewButton =
      element(by.css('button[data-type="pipeline"].tree-branch'));
    self.pipelineContainer =
      element(by.css('div[ng-controller="PipelineMainController"]'));

    self.newPipelineNameInput =
      element(by.css(
        '.modal-body div[data-id="PipelineFormContainer"] ' +
        'input[ng-model="pipeline.name"]'
      ));
    self.editPipelineNameInput =
      element(by.css(
        'div[data-id="PipelineFormContainer"] ' +
        'input[ng-model="pipeline.name"]'
      ));
    self.newPipelineAddPolicyButton =
      element(by.css(
        '.modal-body div[data-id="PipelineFormContainer"] ' +
        'div.ui-menu-container button.toggler'
      ));
    self.newPipelineMetricsPolicySelect =
      element(by.css(
        '.modal-body a[data-id="new Metrics policy name"]'
      ));
    self.newPipelineFirstPolicy =
      element(by.css(
        '.modal-body td[title="new Metrics policy name"]'
      ));

    self.deletePipelineButton =
      element.all(by.css(
        'table.pipelines td.actions a.delete-pipeline'
      ));

    self.sideNewPipelineButton =
      element(by.css(
        'button[data-type="pipeline"].nav-tree-item-addnew'
      ));
    self.mainNewPipelineButton =
      element(by.css(
        'div.entity-list-container button[data-type="pipeline"].add-new'
      ));

    self.sideNewMappingButton =
      element(by.css(
        'button[data-type="gatewaymap"].nav-tree-item-addnew'
      ));
    self.mainNewMappingButton =
      element(by.css(
        'div.entity-list-container button[data-type="gatewaymap"].add-new'
      ));

    self.gatewaymapListViewButton =
      element(by.css(
        'button[data-type="gatewaymap"].tree-branch'
      ));

    self.mappingContainer =
      element(by.css(
        'div[ng-controller="GatewayMapMainController"]'
      ));
    self.newMappingNameInput =
      element(by.css(
        '.modal-body div[data-id="GatewayMapFormContainer"] input.map-name'
      ));
    self.newMappingEndpointInput =
      element(by.css(
        '.modal-body div[data-id="GatewayMapFormContainer"] ' +
        'input.map-endpoint'
      ));
    self.newMappingVerbSelect =
      element(by.css(
        '.modal-body .ui-menu-container.verb-menu .toggler'
      ));
    self.newMappingVerbAllSelect =
      element(by.css(
        '.modal-body .ui-menu-container.verb-menu .menu li:nth-child(1) a'
      ));
    self.newMappingPipelineSelect =
      element(by.css(
        '.modal-body .ui-menu-container.pipeline-menu .toggler'
      ));
    self.newMappingPipelineInstanceSelect =
      element.all(by.css(
        '.modal-body .ui-menu-container.pipeline-menu .menu li a'
      ));


    //sans-modal
    self.newMappingNameInputNoModal =
      element(by.css(
        'div[data-id="GatewayMapFormContainer"] input.map-name'
      ));
    self.newMappingEndpointInputNoModal =
      element(by.css(
        'div[data-id="GatewayMapFormContainer"] input.map-endpoint'
      ));
    self.newMappingVerbSelectNoModal =
      element(by.css(
        '.ui-menu-container.verb-menu .toggler'
      ));
    self.newMappingVerbAllSelectNoModal =
      element(by.css(
        '.ui-menu-container.verb-menu .menu li:nth-child(1) a'
      ));
    self.newMappingVerbPostSelectNoModal =
      element(by.css(
        '.ui-menu-container.verb-menu .menu li:nth-child(4) a'
      ));
    self.newMappingPipelineSelectNoModal =
      element(by.css(
        '.ui-menu-container.pipeline-menu .toggler'
      ));
    self.newMappingPipelineInstanceSelectNoModal =
      element.all(by.css(
        '.ui-menu-container.pipeline-menu .menu li a'
      ));

    self.deleteMappingButton =
      element(by.css(
        'table.mappings td.actions a.delete-map'
      ));
    self.confirmDeleteMappingButton =
      element(by.css(
        '.modal button.delete-map'
      ));
    self.confirmDeletePipelineButton =
      element(by.css(
        '.modal button.delete-pipeline'
      ));
    self.confirmDeletePolicyButton =
      element(by.css(
        '.modal button.delete-policy'
      ));
    self.confirmReplaceMappingButton =
      element(by.css('.modal button.primary'));

    //shared clone
    self.confirmCloneButton =
      element(by.css('.clone-modal button.primary'));
    self.confirmDeleteCloneButton =
      element(by.css('.confirm-delete button.primary'));

    //clone policy
    self.contextMenuPolicy =
      element(by.css(
        '[data-menutype="policy"] ' +
        '.tree-item-row:nth-child(1) .btn-nav-context'
      ));
    self.clonePolicyButton =
      element(by.css(
        '[data-menutype="policy"] ' +
        '.tree-item-row:nth-child(1) .clone-instance'
      ));
    self.clonedContextMenuPolicy =
      element(by.css(
        '[data-menutype="policy"] ' +
        '.tree-item-row:nth-child(2) .btn-nav-context'
      ));
    self.deleteClonedPolicyButton =
      element(by.css(
        '[data-menutype="policy"] ' +
        '.tree-item-row:nth-child(2) .delete-instance'
      ));

    //clone pipeline
    self.contextMenuPipeline =
      element(by.css(
        '[data-menutype="pipeline"] ' +
        '.tree-item-row:nth-child(1) .btn-nav-context'
      ));
    self.clonePipelineButton =
      element(by.css(
        '[data-menutype="pipeline"] ' +
        '.tree-item-row:nth-child(1) .clone-instance'
      ));
    self.clonedContextMenuPipeline =
      element(by.css(
        '[data-menutype="pipeline"] ' +
        '.tree-item-row:nth-child(2) .btn-nav-context'
      ));
    self.deleteClonedPipelineButton =
      element(by.css(
        '[data-menutype="pipeline"] ' +
        '.tree-item-row:nth-child(2) .delete-instance'
      ));

    //clone mapping
    self.contextMenuMapping =
      element(by.css(
        '[data-menutype="gatewaymap"] ' +
        '.tree-item-row:nth-child(1) .btn-nav-context'
      ));
    self.cloneMappingButton =
      element(by.css(
        '[data-menutype="gatewaymap"] ' +
        '.tree-item-row:nth-child(1) .clone-instance'
      ));
    self.clonedContextMenuMapping =
      element(by.css(
        '[data-menutype="gatewaymap"] ' +
        '.tree-item-row:nth-child(2) .btn-nav-context'
      ));
    self.deleteClonedMappingButton =
      element(by.css(
        '[data-menutype="gatewaymap"] ' +
        '.tree-item-row:nth-child(2) .delete-instance'
      ));

    //pipeline policies
    self.pipelinePolicyList =
      element.all(by.css('.viewport .policy-name'));
    self.firstPipelineMenuItem =
      element(by.css(
        '[data-menutype="pipeline"] .branch-leaf-list ' +
        '.tree-item-row:nth-child(1) .nav-tree-item'
      ));
    self.editFirstPipelineLink =
      element(by.css(
        'table.pipelines tbody tr:first-child td:first-child a'
      ));
    self.saveEditPipelineButton =
      element(by.css(
        '[data-id="PipelineFormContainer"] button.primary'
      ));
    self.confirmEditPipelineButton =
      element(by.buttonText('Replace'));
    self.togglePipelinePolicyMenu =
      element(by.css('.ui-form .ui-menu-container button.toggler'));
    self.addPipelinePolicyListItems =
      element.all(by.css(
        '[data-id="PipelineFormContainer"] ' +
        '.ui-form .ui-menu-dropdown .menu li a'
      ));
    self.pipelineSummaryList =
      element.all(by.css('table.pipelines tbody tr'));
    self.pipelinePolicyListDeleteLinks =
      element.all(by.css(
        'table.pipelines tbody tr:nth-child(2) a.ui-close'
      ));

    //policies
    self.policySummaryListItems =
      element.all(by.css('table.policies tbody tr'));
    self.policySummaryListEditLinks =
      element.all(by.css(
        'table.policies tbody tr td.gateway-name-col button'
      ));
    self.saveEditPolicyButton =
      element(by.css(
        '[data-id="PolicyFormContainer"] button.primary'
      ));
    self.confirmEditPolicyButton =
      element(by.buttonText('Replace'));

    //mappings
    self.mappingsSummaryListItems =
      element.all(by.css('table.mappings tbody tr'));
    self.mappingsSummaryListEditLinks =
      element.all(by.css(
        'table.mappings tbody tr td:nth-child(1) button'
      ));

    //page object methods
    self.openNewPolicyFromNav = function() {
      self.sideNewPolicyButton.click();
      browser.driver.sleep(sleep);
      expect(EC.visibilityOf(self.closeModalButton));
      self.closeModalButton.click();
    };
    self.openNewPolicyFromView = function() {
      expect(EC.visibilityOf(self.mainNewPolicyButton));
      self.mainNewPolicyButton.click();
      browser.driver.sleep(sleep);
      expect(EC.visibilityOf(self.closeModalButton));
      self.closeModalButton.click();
    };

    self.addMetricsPolicy = function() {
      self.sideNewPolicyButton.click();
      browser.waitForAngular();
      browser.driver.wait(EC.presenceOf(self.newPolicyNameInput), wait);

      self.newPolicyNameInput.sendKeys('new Metrics policy name');
      self.newPolicyTypeSelect.click();
      browser.waitForAngular();

      browser.driver
        .wait(EC.presenceOf(self.policyTypeMetricsSelect), wait);

      self.policyTypeMetricsSelect.click();
      browser.waitForAngular();
      expect(self.newPolicyTypeSelect.getAttribute('value'))
        .toEqual('metrics');

      browser.driver.wait(
        EC.presenceOf(self.saveNewInstanceButton),
        wait
      );

      self.saveNewInstanceButton.click();
      browser.waitForAngular();
    };

    self.addAuthPolicy = function() {
      self.sideNewPolicyButton.click();

      browser.waitForAngular();
      browser.driver.wait(EC.presenceOf(self.newPolicyNameInput), wait);

      self.newPolicyNameInput.sendKeys('new Auth policy name');
      self.newPolicyTypeSelect.click();
      browser.waitForAngular();

      self.policyTypeAuthSelect.click();
      browser.waitForAngular();

      expect(self.newPolicyTypeSelect.getAttribute('value'))
        .toEqual('auth');

      browser.driver.wait(EC.presenceOf(self.saveNewInstanceButton), wait);

      self.saveNewInstanceButton.click();
      browser.waitForAngular();
    };

    self.addRateLimitingPolicy = function() {
      self.sideNewPolicyButton.click();
      browser.waitForAngular();

      browser.driver.wait(EC.presenceOf(self.newPolicyNameInput), wait);

      self.newPolicyNameInput.sendKeys('new Rate Limiting policy name');

      self.newPolicyTypeSelect.click();
      browser.waitForAngular();

      self.policyTypeRateLimitingSelect.click();
      browser.waitForAngular();


      expect(self.newPolicyTypeSelect.getAttribute('value'))
        .toEqual('rateLimiting');
      expect(EC.visibilityOf(self.policyRateLimitingLimitInput));
      expect(EC.visibilityOf(self.policyRateLimitingIntervalInput));

      self.policyRateLimitingLimitInput.sendKeys('5000');
      self.policyRateLimitingIntervalInput.sendKeys('500000');

      browser.driver.wait(EC.presenceOf(self.saveNewInstanceButton), wait);

      self.saveNewInstanceButton.click();
      browser.waitForAngular();
    };

    self.addReverseProxyPolicy = function() {
      self.sideNewPolicyButton.click();
      browser.waitForAngular();

      browser.driver.wait(EC.presenceOf(self.newPolicyNameInput), wait);

      self.newPolicyNameInput.sendKeys('new Reverse Proxy policy name');

      self.newPolicyTypeSelect.click();
      browser.waitForAngular();

      self.policyTypeReversProxySelect.click();
      browser.waitForAngular();

      expect(self.newPolicyTypeSelect.getAttribute('value'))
        .toEqual('reverseProxy');
      expect(EC.visibilityOf(self.policyReversProxyTargetUrlInput));

      self.policyReversProxyTargetUrlInput.sendKeys('https://www.url.com');

      browser.driver.wait(EC.presenceOf(self.saveNewInstanceButton), wait);

      self.saveNewInstanceButton.click();
      browser.waitForAngular();
    };

    self.deleteFirstPolicy = function() {
      var isListClickable =
        EC.elementToBeClickable(self.policyListViewButton);

      browser.driver.wait(isListClickable, wait);
      self.policyListViewButton.click();
      browser.waitForAngular();

      //hover to reveal delete icon
      browser.actions().mouseMove(self.policySummaryListItems.first())
        .perform();
      //browser.driver.sleep(500);
      browser.driver.wait(
        EC.elementToBeClickable(self.deletePolicyButton), wait);

      //delete from list
      self.deletePolicyButton.click();
      browser.waitForAngular();

      //confirm delete
      browser.driver
        .wait(EC.elementToBeClickable(self.confirmDeletePolicyButton), wait);
      self.confirmDeletePolicyButton.click();
      browser.driver
        .wait(EC.elementToBeClickable(self.policyListViewButton), wait);
      browser.waitForAngular();
    };

    self.deleteFirstPipeline = function() {
      self.loadPipelineList();

      var deleteButton = self.deletePipelineButton
        .filter(filterByDisplayed).first();

      //hover to reveal delete icon
      browser.actions().mouseMove(self.pipelineSummaryList.first())
        .perform();
      browser.driver.wait(EC.elementToBeClickable(deleteButton), wait);

      //delete from list
      deleteButton.click();
      browser.waitForAngular();

      //confirm delete
      browser.driver
        .wait(
        EC.elementToBeClickable(self.confirmDeletePipelineButton),
        wait);
      self.confirmDeletePipelineButton.click();
      browser.waitForAngular();
      browser.driver
        .wait(EC.elementToBeClickable(self.pipelineListViewButton), wait);
    };

    self.deleteFirstMapping = function() {
      //load list view
      var isListClickable = EC.elementToBeClickable(
        self.gatewaymapListViewButton
      );

      browser.driver.wait(isListClickable, wait);
      self.gatewaymapListViewButton.click();
      browser.waitForAngular();

      //wait for table to load
      browser.driver
        .wait(EC.visibilityOf(self.mappingsSummaryListItems.first()), wait);

      //hover to reveal delete icon
      browser.actions()
        .mouseMove(self.mappingsSummaryListItems.first()).perform();
      browser.driver
        .wait(EC.elementToBeClickable(self.deleteMappingButton), wait);

      self.deleteMappingButton.click();
      browser.waitForAngular();

      //confirm delete
      browser.driver
        .wait(EC.elementToBeClickable(self.confirmDeleteMappingButton), wait);
      self.confirmDeleteMappingButton.click();
      browser.waitForAngular();
    };

    self.cloneFirstPolicy = function(){
      //load list first
      var isListClickable =
        EC.elementToBeClickable(self.policyListViewButton);
      browser.driver.wait(isListClickable, wait);
      self.policyListViewButton.click();
      browser.waitForAngular();

      var isContextMenuClickable =
        EC.elementToBeClickable(self.contextMenuPolicy);
      browser.driver.wait(isContextMenuClickable, wait);
      self.contextMenuPolicy.click();
      browser.waitForAngular();

      var isCloneButtonClickable =
        EC.elementToBeClickable(self.clonePolicyButton);
      browser.driver.wait(isCloneButtonClickable, wait);
      self.clonePolicyButton.click();
      browser.waitForAngular();

      var isConfirmButtonClickable =
        EC.elementToBeClickable(self.confirmCloneButton);
      browser.driver.wait(isConfirmButtonClickable, wait);
      self.confirmCloneButton.click();
      browser.waitForAngular();
    };

    self.deleteFirstPolicyClone = function(){
      //load list
      var isListClickable =
        EC.elementToBeClickable(self.policyListViewButton);
      browser.driver.wait(isListClickable, wait);
      self.policyListViewButton.click();
      browser.waitForAngular();

      var isContextMenuClickable =
        EC.elementToBeClickable(self.clonedContextMenuPolicy);
      browser.driver.wait(isContextMenuClickable, wait);
      self.clonedContextMenuPolicy.click();
      browser.waitForAngular();

      var isDeleteButtonClickable =
        EC.elementToBeClickable(self.deleteClonedPolicyButton);
      browser.driver.wait(isDeleteButtonClickable, wait);
      self.deleteClonedPolicyButton.click();
      browser.waitForAngular();

      var isConfirmButtonClickable =
        EC.elementToBeClickable(self.confirmDeleteCloneButton);

      browser.driver.wait(isConfirmButtonClickable, wait);
      self.confirmDeleteCloneButton.click();
      browser.waitForAngular();
    };

    self.cloneFirstPipeline = function(){
      self.loadPipelineList();

      var isContextMenuClickable =
        EC.elementToBeClickable(self.contextMenuPipeline);
      browser.driver.wait(isContextMenuClickable, wait);
      self.contextMenuPipeline.click();
      browser.waitForAngular();

      var isCloneButtonClickable =
        EC.elementToBeClickable(self.clonePipelineButton);
      browser.driver.wait(isCloneButtonClickable, wait);
      self.clonePipelineButton.click();
      browser.waitForAngular();

      var isConfirmButtonClickable =
        EC.elementToBeClickable(self.confirmCloneButton);
      browser.driver.wait(isConfirmButtonClickable, wait);
      self.confirmCloneButton.click();
      browser.waitForAngular();
    };

    self.deleteFirstPipelineClone = function(){
      self.loadPipelineList();

      var isContextMenuClickable =
        EC.elementToBeClickable(self.clonedContextMenuPipeline);
      browser.driver.wait(isContextMenuClickable, wait);
      self.clonedContextMenuPipeline.click();
      browser.waitForAngular();

      var isDeleteButtonClickable =
        EC.elementToBeClickable(self.deleteClonedPipelineButton);
      browser.driver.wait(isDeleteButtonClickable, wait);
      self.deleteClonedPipelineButton.click();
      browser.waitForAngular();

      var isConfirmButtonClickable =
        EC.elementToBeClickable(self.confirmDeleteCloneButton);

      browser.driver.wait(isConfirmButtonClickable, wait);
      self.confirmDeleteCloneButton.click();
      browser.waitForAngular();
    };

    self.cloneFirstMapping = function(){
      var isListClickable =
        EC.elementToBeClickable(self.gatewaymapListViewButton);
      browser.driver.wait(isListClickable, wait);
      self.gatewaymapListViewButton.click();
      browser.waitForAngular();

      var isContextMenuClickable =
        EC.elementToBeClickable(self.contextMenuMapping);
      browser.driver.wait(isContextMenuClickable, wait);
      self.contextMenuMapping.click();
      browser.waitForAngular();

      var isCloneButtonClickable =
        EC.elementToBeClickable(self.cloneMappingButton);
      browser.driver.wait(isCloneButtonClickable, wait);
      self.cloneMappingButton.click();
      browser.waitForAngular();

      var isConfirmButtonClickable =
        EC.elementToBeClickable(self.confirmCloneButton);
      browser.driver.wait(isConfirmButtonClickable, wait);
      self.confirmCloneButton.click();
      browser.waitForAngular();
    };

    self.deleteFirstMappingClone = function(){
      var isListClickable =
        EC.elementToBeClickable(self.gatewaymapListViewButton);
      browser.driver.wait(isListClickable, wait);
      self.gatewaymapListViewButton.click();
      browser.waitForAngular();

      var isContextMenuClickable =
        EC.elementToBeClickable(self.clonedContextMenuMapping);
      browser.driver.wait(isContextMenuClickable, wait);
      self.clonedContextMenuMapping.click();
      browser.waitForAngular();

      var isDeleteButtonClickable =
        EC.elementToBeClickable(self.deleteClonedMappingButton);
      browser.driver.wait(isDeleteButtonClickable, wait);
      self.deleteClonedMappingButton.click();
      browser.waitForAngular();

      var isConfirmButtonClickable =
        EC.elementToBeClickable(self.confirmDeleteCloneButton);

      browser.driver.wait(isConfirmButtonClickable, wait);
      self.confirmDeleteCloneButton.click();
      browser.waitForAngular();
    };

    self.loadPipelineList = function(){
      var isListClickable =
        EC.elementToBeClickable(self.pipelineListViewButton);
      browser.driver.wait(isListClickable, wait);
      self.pipelineListViewButton.click();
      browser.waitForAngular();
    };

    self.loadMappingsList = function(){
      var isListClickable =
        EC.elementToBeClickable(self.gatewaymapListViewButton);
      browser.driver.wait(isListClickable, wait);
      self.gatewaymapListViewButton.click();
      browser.waitForAngular();
    };

    self.loadFirstPolicy = function(){
      var isListClickable =
        EC.elementToBeClickable(self.policyListViewButton);
      browser.driver.wait(isListClickable, wait);
      self.policyListViewButton.click();
      browser.waitForAngular();

      var firstItemLink = self.policySummaryListEditLinks.first();
      var isFirstItemClickable =
        EC.elementToBeClickable(firstItemLink);
      browser.driver.wait(isFirstItemClickable, wait);
      firstItemLink.click();
      browser.waitForAngular();
    };

    self.addNewPolicyToPipeline = function(){
      self.loadPipelineList();

      //navigate to edit first pipeline
      var isEditLinkClickable =
        EC.elementToBeClickable(self.editFirstPipelineLink);

      browser.driver.wait(isEditLinkClickable, wait);
      self.editFirstPipelineLink.click();
      browser.waitForAngular();

      self.addExistingPolicyToPipeline();
      self.saveCurrentPipeline();
    };

    self.removePolicyInPipeline = function(){
      //delete first policy on current pipeline
      browser.actions()
        .mouseMove(self.pipelineSummaryList.last()).perform();

      var deletePolicyLink = self.pipelinePolicyListDeleteLinks.last();
      var isDeleteLinkClickable =
        EC.elementToBeClickable(deletePolicyLink);

      browser.driver.wait(isDeleteLinkClickable, wait);
      deletePolicyLink.click();
      browser.waitForAngular();

      self.saveCurrentPipeline();
    };

    self.saveCurrentPipeline = function(){
      //click save button
      var isSaveClickable =
        EC.elementToBeClickable(self.saveEditPipelineButton);

      browser.driver.wait(isSaveClickable, wait);

      self.saveEditPipelineButton.click();
      browser.waitForAngular();

      //click confirm replace
      var isConfirmClickable =
        EC.elementToBeClickable(self.confirmEditPipelineButton, wait);

      browser.driver.wait(isConfirmClickable, wait);

      self.confirmEditPipelineButton.click();
      browser.waitForAngular();
    };


    self.saveCurrentPolicy = function(){
      //click save button
      var isSaveClickable =
        EC.elementToBeClickable(self.saveEditPolicyButton);

      browser.driver.wait(isSaveClickable, wait);

      self.saveEditPolicyButton.click();
      browser.waitForAngular();

      //click confirm replace
      var isConfirmClickable =
        EC.elementToBeClickable(self.confirmEditPolicyButton, wait);

      browser.driver.wait(isConfirmClickable, wait);

      self.confirmEditPolicyButton.click();
      browser.waitForAngular();
    };


    self.addExistingPolicyToPipeline = function(){
      //select last item in policy dropdown and add to pipeline
      var buttonToggler = self.togglePipelinePolicyMenu;
      var isButtonClickable = EC.elementToBeClickable(buttonToggler);

      browser.driver.wait(isButtonClickable, wait);

      //trigger dropdown menu
      buttonToggler.click();
      browser.waitForAngular();

      var lastMenuItem = self.addPipelinePolicyListItems.last();
      var isMenuItemClickable = EC.elementToBeClickable(lastMenuItem);
      browser.driver.wait(isMenuItemClickable, wait);

      //click last item in menu
      lastMenuItem.click();
      browser.waitForAngular();
    };

    self.addNewPipeline = function() {
      // get input field
      browser.driver
        .wait(EC.presenceOf(self.newPipelineNameInput), wait);
      browser.driver
        .wait(EC.presenceOf(self.newPipelineAddPolicyButton), wait);

      // send keys 'new pipeline'
      self.newPipelineNameInput.sendKeys('new pipeline');
      browser.driver.sleep(sleep);
     // expect(EC.visibilityOf(self.newPipelineAddPolicyButton));

       // add policy
      self.newPipelineAddPolicyButton.click();
      browser.waitForAngular();

      browser.driver
        .wait(EC.presenceOf(self.newPipelineMetricsPolicySelect), wait);
     // expect(EC.visibilityOf(self.newPipelineMetricsPolicySelect));
      self.newPipelineMetricsPolicySelect.click();
      browser.waitForAngular();

      // verify policy added
     // expect(EC.visibilityOf(self.newPipelineFirstPolicy));
      browser.driver.wait(EC.presenceOf(self.newPipelineFirstPolicy), wait);

      // save pipeline
    //
    //self.newPipelineNameInput
    //self.newPipelineAddPolicyButton
    //self.newPipelineMetricsPolicySelect
    //self.newPipelineFirstPolicy
      //browser.sleep(7000);
      browser.driver.wait(EC.presenceOf(self.saveNewInstanceButton), wait);

      self.saveNewInstanceButton.click();
      browser.waitForAngular();
    };

    self.addNewMapping = function() {
      browser.driver.wait(EC.presenceOf(self.newMappingNameInput), wait);

      self.newMappingNameInput.sendKeys('new mapping');
      self.newMappingVerbSelect.click();
      browser.waitForAngular();

      browser.driver.wait(EC.presenceOf(self.newMappingVerbAllSelect), wait);
      self.newMappingVerbAllSelect.click();

      expect(EC.visibilityOf(self.newMappingVerbSelect));

      self.newMappingEndpointInput.sendKeys('http://www.url.com');

      self.editMapSelectPipeline(1, true);

      self.saveNewInstanceButton.click();
      browser.waitForAngular();
    };

    self.editMapSelectPipeline = function(position, isModal){
      var pipelineInstanceToSelect;
      var pipelineSelectToggler;

      if ( isModal ) {
        pipelineSelectToggler = self.newMappingPipelineSelect;
      } else {
        pipelineSelectToggler = self.newMappingPipelineSelectNoModal;
      }

      pipelineSelectToggler.click();
      browser.waitForAngular();

      //check which item in list we want
      if ( !position || position === 1 ) {
        if ( isModal ) {
          pipelineInstanceToSelect =
            self.newMappingPipelineInstanceSelect.first();
        } else {
          pipelineInstanceToSelect =
            self.newMappingPipelineInstanceSelectNoModal.first();
        }
      } else if ( position === -1 ) {
        if ( isModal ) {
          pipelineInstanceToSelect =
            self.newMappingPipelineInstanceSelect.last();
        } else {
          pipelineInstanceToSelect =
            self.newMappingPipelineInstanceSelectNoModal.last();
        }
      }

      browser.driver
        .wait(EC.elementToBeClickable(pipelineInstanceToSelect), wait);
      pipelineInstanceToSelect.click();
      browser.waitForAngular();
    };


    //GatewayMapMainController
    self.waitUntilLoaded = function() {
      browser.driver.wait(EC.presenceOf(self.componentIdentifier), wait);
    };

    function filterByDisplayed(el){
      return el.isDisplayed();
    }
  }
  return GatewayHomeView;
})();

module.exports = GatewayHomeView;
