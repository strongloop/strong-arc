var BuildDeployHomeView = (function () {
  var EC = protractor.ExpectedConditions;

  function BuildDeployHomeView() {
    var self = this;

    this.componentIdentifier = element(
      by.css('section .sl-build-deploy'));
    this.buildButton = element(
      by.css('form[name="builduniversal"] .primary'));
    this.deployButton = element(
      by.css('form[name="deployuniversal"] .primary'));
    this.buildSuccessMessage = element(
      by.cssContainingText(
        'form[name="builduniversal"]'+
        '[message="build.universal.message"]', 'Success'
      )
    );
    this.deploySuccessMessage = element(
      by.cssContainingText(
        'form[name="deployuniversal"]' +
        ' [message="deploy.universal.message"]', 'Success'
      )
    );

    this.waitUntilLoaded = function() {
      browser.driver.wait(
        EC.presenceOf(self.componentIdentifier),
      10000);
    };

    this.buildApp = function () {
      var self = this;

      browser.driver.wait(
        EC.elementToBeClickable(self.buildButton),
      10000);

      self.buildButton.click();
      self.buildButton.click();

      browser.driver.wait(
        EC.visibilityOf(self.buildSuccessMessage),
      500000);
    };

    this.deployApp = function () {
      var self = this;

      browser.driver.wait(
        EC.elementToBeClickable(self.deployButton),
      10000);

      self.deployButton.click();
      self.deployButton.click();

      browser.driver.wait(
        EC.visibilityOf(self.deploySuccessMessage),
      150000);
    };

  }
  return BuildDeployHomeView;
})();

module.exports = BuildDeployHomeView;
