var ModelEditorView = (function () {
  function ModelEditorView() {
    var EC = protractor.ExpectedConditions;
    this.modelNameInput  = element(by.id('ModelName'));
    this.saveModelButton = element(
      by.css('.model-save-button-col .instance-save-button'));
    this.addNewPropertyButton = element(
      by.css('.btn-new-model-property'));
    this.propertyNameInputCollection = element.all(
      by.css('.model-instance-property-list input[ng-model="property.name"]'));
    this.propertyCommentInputCollection = element.all(
      by.css('.model-instance-property-list' +
             ' input[ng-model="property.comments"]'));
    this.parentContainer = element(
      by.css('[data-id="CommonInstanceContainer"]'));
    this.addModelButton = element(
      by.css('button[data-type="datasource"].nav-tree-item-addnew'));

    var scrollIntoView = 'arguments[0].scrollIntoView();';

    this.addNewProperty = function(propertyName) {
      var self = this;
      var btn = this.addNewPropertyButton.getWebElement();
      browser.executeScript(scrollIntoView, btn);
      self.parentContainer.click();
      self.addNewPropertyButton.click();
      browser.driver.wait(function() {
        return self.propertyNameInputCollection.count(function(c) {
          return c > 0;
        });
      }, 10000);
      var input = self.propertyNameInputCollection.first();
      input.clear();
      input.sendKeys(propertyName);
      self.saveModelButton.click();
    };
    this.addCommentToProperty = function(index, comment) {
      var self = this;
      browser.driver.wait(function() {
        return self.propertyCommentInputCollection.count().then(function(c) {
          return c > 0;
        });
      }, 10000);
      var target = self.propertyCommentInputCollection.get(index);
      browser.executeScript(scrollIntoView, target);
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
    this.createNewModel = function(modelName) {
      // TODO: these sleeps shouldn't be necessary..
      browser.sleep(500);
      browser.executeScript('window.scroll(0, 0);');
      browser.sleep(500);
      browser.wait(EC.visibilityOf(this.modelNameInput), 10000);
      this.modelNameInput.click();
      this.modelNameInput.clear();
      this.modelNameInput.sendKeys(modelName);
      browser.sleep(500);
      this.parentContainer.click();
      browser.sleep(500);
      this.saveModelButton.click();
      browser.sleep(500);
    };
  }
  return ModelEditorView;
})();

module.exports = ModelEditorView;
