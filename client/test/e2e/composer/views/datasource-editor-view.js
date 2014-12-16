var DataSourceEditorView = (function () {
  function DataSourceEditorView() {
    this.dataSourceNameInput  = element(by.id('name'));
    this.userNameInput = element(by.id('user'));
    this.passwordInput = element(by.id('password'));
    this.host = element(by.id('host'));
    this.port = element(by.id('port'));
    this.databaseName = element(by.id('database'));
    this.connector = element(by.id('connector'));
    this.connectorOptions = element.all('select#connector option');
    this.saveDataSourceButton = element(
      by.css('[data-id="datasource-save-button"]'));

    this.createNewDataSource = function(name) {
      var dsObj = {
        name: name,
        connector: 'mysql'
      };

      this.dataSourceNameInput.clear();
      this.dataSourceNameInput.sendKeys(dsObj.name);
      var options = element.all(
          by.css('select#connector option'))
        .then(function(options){
          options[2].click();
        });

      this.saveDataSourceButton.click();
      browser.waitForAngular();
    };
    this.getCurrentDSName = function() {
      return this.dataSourceNameInput.getAttribute('value');
    };
  }
  return DataSourceEditorView;
})();

module.exports = DataSourceEditorView;
