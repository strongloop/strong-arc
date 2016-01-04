var ModelEditorView = (function () {
  function ModelEditorView() {
    var EC = protractor.ExpectedConditions;
    this.modelNameInput  = element(by.id('ModelName'));
    this.saveModelButton = element(
      by.css('#instance-save-button'));
    this.migrateModelButton = element(
      by.css('.model-migrate-button-col .model-migrate-button'));
    this.migrateLoadingIndicator = element(
      by.css('strong.model-migrate-loading'));
    this.addNewPropertyButton = element(
      by.css('.btn-new-model-property'));
    this.propertyNameInputCollection = element.all(
      by.css('.model-instance-property-list' +
             ' input[ng-model="property.name"]'));
    this.propertyCollection = element.all(
      by.css('.model-instance-property-list'));
    this.newModelTab = element(
      by.css('button[data-id="sl.temp.new-model"]'));
    this.propertyCommentInputCollection = element.all(
      by.css('.model-instance-property-list' +
             ' input[ng-model="property.comments"]'));
    this.parentContainer = element(
      by.css('[data-id="CommonInstanceContainer"]'));
    this.addModelButton = element(
      by.css('button[data-type="datasource"].nav-tree-item-addnew'));
    this.dataSourceSelect = element(
      by.css('select[name="dataSource"]'));
    this.propertyIDCheckbox = element(
      by.css('input[ng-model="property.isId"] ~ i'));
    this.propertyRequiredCheckbox = element(
      by.css('input[ng-model="property.required"] ~ i'));
    this.propertyIndexCheckbox = element(
      by.css('input[ng-model="property.index"] ~ i'));
    this.propertyCheckboxCollection = element.all(
      by.css('.modelproperty-container .checked'));
    this.validationErrorMessage = element(
      by.css('.validation-error-message'));

    var scrollIntoView = 'arguments[0].scrollIntoView();';

    this.addNewProperty = function(propertyName) {
      var self = this;
      var btn = this.addNewPropertyButton.getWebElement();
      browser.executeScript(scrollIntoView, btn);
      self.parentContainer.click();
      self.addNewPropertyButton.click();
      browser.sleep(500);
      var input = self.propertyNameInputCollection.first();
      input.clear();
      input.sendKeys(propertyName);
      self.saveModelButton.click();
    };
    this.addCommentToProperty = function(index, comment) {
      browser.sleep(1000);
      var target = this.propertyCommentInputCollection.get(index);
      target.click();
      target.clear();
      target.sendKeys(comment);
    };
    this.getFirstComment = function() {
      return this.propertyCommentInputCollection.first().getAttribute('value');
    };
    this.getFirstPropertyName = function() {
      return this.propertyNameInputCollection.first().getAttribute('value');
    };
    this.getCurrentModelName = function() {
      return this.modelNameInput.getAttribute('value');
    };
    this.getCurrentDataSourceIndex = function() {
      return this.dataSourceSelect.getAttribute('value');
    };
    this.createNewModel = function(modelName) {
      this.modelNameInput.clear();
      this.modelNameInput.sendKeys(modelName);
      browser.sleep(500);
      this.parentContainer.click();
      browser.sleep(500);
      this.saveModelButton.click();
    };
    this.selectDatasource = function selectDatasource(name) {
      var el = this.dataSourceSelect;

      browser.sleep(250).then(function () {
        el.element(by.cssContainingText('option', name)).click();
      });
    };
    this.migrateCurrentModel = function migrateCurrentModel() {
      var self = this;
      var indicator = this.migrateLoadingIndicator;

      browser.driver.wait(
        EC.elementToBeClickable(self.migrateModelButton),
      10000);

      this.migrateModelButton.click();

      browser.driver.wait(
        protractor.until.elementIsNotVisible(indicator),
      10000);
    };

    this.saveModel = function saveModel() {
      this.saveModelButton.click();
    };

    this.toggleFirstModelId = function toggleFirstModelId() {
      this.propertyIDCheckbox.click();
    };

    this.toggleFirstModelRequired = function toggleFirstModelId() {
      this.propertyRequiredCheckbox.click();
    };

    this.toggleFirstModelIndex = function toggleFirstModelId() {
      this.propertyIndexCheckbox.click();
    };

    this.getCheckedElements = function getCheckedElements () {
      return this.propertyCheckboxCollection;
    };

    this.validationErrorMessagePresent =
    function validationErrorMessagePresent () {
      return this.validationErrorMessage.isPresent();
    };
  }
  return ModelEditorView;
})();

module.exports = ModelEditorView;
