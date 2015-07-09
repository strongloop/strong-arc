var DataSourceEditorView = (function () {
  function DataSourceEditorView() {
    var EC = protractor.ExpectedConditions;
    this.dataSourceNameInput  = element(by.id('name'));
    this.userNameInput = element(by.id('user'));
    this.passwordInput = element(by.id('password'));
    this.host = element(by.id('host'));
    this.port = element(by.id('port'));
    this.databaseName = element(by.id('database'));
    this.connector = element(by.id('connector'));
    this.connectorOptions = element.all(by.css('select#connector option'));
    this.saveDataSourceButton = element(by.css('[data-id="datasource-save-button"]'));
    this.connectionSuccessIndicator = element(by.css('.ui-msg-inline-success'));
    this.testConnectionButton = element(by.buttonText('Test Connection'));

    var scrollIntoView = 'arguments[0].scrollIntoView();';

    this.createNewDataSource = function(name) {
      this.dataSourceNameInput.clear();
      this.dataSourceNameInput.sendKeys(name);
      this.connectorOptions.get(1).click();
      this.connectorOptions.get(0).click(); //total hack
      this.connectorOptions.get(1).click();
      this.saveDataSourceButton.click();
      browser.waitForAngular();
    };

    this.createNewExternalDataSource = function(name, dbname, user, pass, host, port, connectorindex) {
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

    this.saveDataSource = function () {
      this.saveDataSourceButton.click();
    }

    this.testDatabaseConnection = function() {
      var self = this;

      //browser.driver.executeScript(scrollIntoView, self.testConnectionButton);
      
      self.testConnectionButton.click();

      browser.driver.wait(EC.visibilityOf(self.connectionSuccessIndicator), 10000);
    }

    this.getCurrentDSName = function() {
      return this.dataSourceNameInput.getAttribute('value');
    };


  }
  return DataSourceEditorView;
})();

module.exports = DataSourceEditorView;
