var ModelEditorView = (function () {
  function ModelEditorView() {
    this.modelNameInput  = element(by.css('#ModelName'));
    this.saveModelButton = element(by.css('.model-save-button'));
    this.addNewPropertyButton = element(
      by.css('.btn-new-model-property'));
    this.propertyNameInputCollection = element.all(
      by.css('.props-name-cell [data-name="name"]'));
    this.parentContainer = element(
      by.css('[data-id="CommonInstanceContainer"]'));

    this.addNewProperty = function(propertyName) {
      this.parentContainer.click();
      var filter = browser.findElement(by.css('.btn-new-model-property'));
      var scrollIntoView = function () {
        arguments[0].scrollIntoView();
      };
      browser.executeScript(scrollIntoView, filter);
      this.addNewPropertyButton.click();
      this.propertyNameInputCollection.get(0).clear();
      this.propertyNameInputCollection.get(0).sendKeys(propertyName);
      this.saveModelButton.click();
    };
    this.getFirstPropertyName = function() {
      return this.propertyNameInputCollection.get(0).getAttribute('value');
    };
    this.getCurrentModelName = function() {
      return this.modelNameInput.getAttribute('value');
    };
    this.createNewModel = function(modelName) {
      this.modelNameInput.clear();
      this.modelNameInput.sendKeys(modelName);
      this.saveModelButton.click();
    };
  }
  return ModelEditorView;
})();

module.exports = ModelEditorView;
