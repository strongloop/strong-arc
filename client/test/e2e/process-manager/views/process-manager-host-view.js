var ProcessManagerHostView = (function () {
  var EC = protractor.ExpectedConditions;

  function ProcessManagerHostView() {
    this.processManagerHostInput = element(
      by.css('input[ng-model="currentPM.host"]'));
    this.processManagerPortInput = element(
      by.css('input[ng-model="currentPM.port"]'));
    this.addNewProcessManagerButton = element(
      by.css('button[ng-click="initAddNewPMHost()"]'));
    this.processManagerActivateButton = element(
      by.css('button[ng-click="savePM()"]'));
    this.processManagerHostErrorIndicator = element(
      by.css('.sl-icon-question-mark'));
    this.processManagerDeleteButton = element(
      by.css('a[ng-click="deleteHost(host)"]'));
    this.processManagerNoServerMessage = element(
      by.cssContainingText('h4', 'No Server'));
    this.processManagerErrorMessageCloseButton = element(
      by.css('button[ng-click="showPopover = false"]'));

    this.addNewPMHost = function (host, port) {
      var self = this;

      browser.driver.wait(
        EC.elementToBeClickable(self.addNewProcessManagerButton),
      10000);

      this.addNewProcessManagerButton.click();

      browser.driver.wait(
        EC.visibilityOf(self.processManagerHostInput),
      10000);

      self.processManagerHostInput.sendKeys(host);
      self.processManagerPortInput.sendKeys(port);

      browser.sleep(500);

      this.processManagerActivateButton.click();
    };

    this.checkForPMHostErrors = function () {
      var self = this;

      browser.driver.wait(
        EC.elementToBeClickable(self.processManagerHostErrorIndicator),
      10000);

      self.processManagerHostErrorIndicator.click();
    };

    this.closeErrorDialog = function () {
      this.processManagerErrorMessageCloseButton.click();
    };

    this.deleteProcessManagerHost = function () {
      var self = this;

      browser.driver.wait(
        EC.elementToBeClickable(
          self.processManagerDeleteButton
        ),
      10000);

      this.processManagerDeleteButton.click();

      browser.sleep(500);

      var alertDialog = browser.switchTo().alert();
      alertDialog.accept();
    };
  }
  return ProcessManagerHostView;
})();

module.exports = ProcessManagerHostView;
