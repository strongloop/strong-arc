var DataSourceEditorView = (function () {
  var SUCCESS = 0;
  var ERROR = 1;
  function DataSourceEditorView() {
    var EC = protractor.ExpectedConditions;
    this.dataSourceNameInput  = element(by.id('name'));
    this.userNameInput = element(by.id('user'));
    this.passwordInput = element(by.id('password'));
    this.host = element(by.id('host'));
    this.port = element(by.id('port'));
    this.databaseName = element(by.id('database'));
    this.connector = element(by.id('connector'));
    this.connectorOptions = element.all(
      by.css('select#connector option'));
    this.saveDataSourceButton = element(
      by.css('[data-id="datasource-save-button"]'));
    this.connectionSuccessIndicator = element(
      by.css('.ui-msg-inline-success'));
    this.connectionFailureIndicator = element(
      by.css('.ui-msg-inline-error'));
    this.testConnectionButton = element(
      by.id('datasource-test-connection-button'));

    this.createNewDataSource = function createNewDataSource(name) {
      this.dataSourceNameInput.clear();
      this.dataSourceNameInput.sendKeys(name);
      this.connectorOptions.get(1).click();
      this.connectorOptions.get(0).click(); //total hack
      this.connectorOptions.get(1).click();
      this.saveDataSourceButton.click();
      browser.waitForAngular();
    };

    this.createNewExternalDataSource = function createNewExternalDataSource(
    name, dbname, user, pass, host, port, connectorindex) {
      browser.driver.wait(EC.presenceOf(this.dataSourceNameInput), 10000);
      this.dataSourceNameInput.clear();
      this.dataSourceNameInput.sendKeys(name);
      this.userNameInput.sendKeys(user || '');
      this.passwordInput.sendKeys(pass || '');
      this.host.sendKeys(host || '');
      this.port.sendKeys(port || '');
      this.databaseName.sendKeys(dbname || '');
      this.connectorOptions.get(connectorindex || 2).click();
      this.saveDataSourceButton.click();
      browser.waitForAngular();
    };

    this.saveDataSource = function saveDataSource() {
      this.saveDataSourceButton.click();
    };

    this.testDatabaseConnectionFor =
    function testDatabaseConnectionFor(outcome) {
      var self = this;

      self.testConnectionButton.click();

      if(outcome === SUCCESS) {
        browser.driver.wait(EC.visibilityOf(
          self.connectionSuccessIndicator), 10000);
      } else if (outcome === ERROR) {
        browser.driver.wait(EC.visibilityOf(
          self.connectionFailureIndicator), 10000);
      }
    };

    this.getCurrentDSName = function getCurrentDSName() {
      return this.dataSourceNameInput.getAttribute('value');
    };

  }
  return DataSourceEditorView;
})();

module.exports = DataSourceEditorView;
