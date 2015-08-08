var GatewayHomeView = (function () {
  var EC = protractor.ExpectedConditions;

  function GatewayHomeView() {
    var self = this;
    self.componentIdentifier = element(
      by.css('span.ia-project-title-container'));


    // policy
    self.policyListViewButton = element(by.css('button[data-type="policy"].tree-branch'));
    self.policyContainer = element(by.css('div[ng-controller="PolicyMainController"]'));

    self.editPolicyNameInput = element(by.css('input[type="text"][ng-model="policy.name"]'));
    self.newPolicyNameInput = element(by.css('div.modal-body input[type="text"][ng-model="policy.name"]'));
    self.newPolicyTypeSelect = element(by.css('div.modal-body div.policy-type-select-container button.toggle-btn'));
    self.deletePolicyButton = element(by.css('table.policies button[ng-click="deletePolicy(policy)"]'));
    //self.newPolicyTypeValueAttrib = element(by.css('div.modal-body div.policy-type-select-container button.toggle-btn'));
    self.policyTypeAuthSelect = element(by.css('div.modal-body div.policy-type-select-container ul.dropdown-menu li button[value="auth"]'));
    self.policyTypeMetricsSelect = element(by.css('div.modal-body div.policy-type-select-container ul.dropdown-menu li button[value="metrics"]'));
    self.policyTypeRateLimitingSelect = element(by.css('div.modal-body div.policy-type-select-container ul.dropdown-menu li button[value="reverseproxy"]'));
    self.policyTypeReversProxySelect = element(by.css('div.modal-body div.policy-type-select-container ul.dropdown-menu li button[value="gatewaymap"]'));

    self.closeModalButton = element(by.css('button[ng-click="close()"]'));
    self.saveNewInstanceButton = element(by.css('div.modal-footer button.primary'));


    self.pipelineListViewButton = element(by.css('button[data-type="pipeline"].tree-branch'));
    self.pipelineContainer = element(by.css('div[ng-controller="PipelineMainController"]'));

    self.sideNewPolicyButton = element(by.css('button[data-type="policy"].nav-tree-item-addnew'));
    self.mainNewPolicyButton = element(by.css('div.entity-list-container button[data-type="policy"].add-new'));

    self.sideNewPipelineButton = element(by.css('button[data-type="pipeline"].nav-tree-item-addnew'));
    self.mainNewPipelineButton = element(by.css('div.entity-list-container button[data-type="pipeline"].add-new'));

    self.sideNewMappingButton = element(by.css('button[data-type="gatewaymap"].nav-tree-item-addnew'));
    self.mainNewMappingButton = element(by.css('div.entity-list-container button[data-type="gatewaymap"].add-new'));



    self.gatewaymapListViewButton = element(by.css('button[data-type="gatewaymap"].tree-branch'));

    self.mappingContainer = element(by.css('div[ng-controller="GatewayMapMainController"]'));
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
