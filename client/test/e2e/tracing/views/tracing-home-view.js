var TracingHomeView = (function () {
  var EC = protractor.ExpectedConditions;

  function TracingHomeView() {
    this.componentIdentifier = element(
      by.css('section .sl-tracing'));
    this.dismissErrorButton = element(
      by.css('button[ng-click="onClickDismiss($event)"]'));

    this.waitUntilLoaded = function() {
      browser.driver.wait(
        EC.presenceOf(this.componentIdentifier),
      10000);
    };

    this.acceptErrorNotice = function () {
      var self = this;

      browser.driver.wait(
        EC.elementToBeClickable(
          self.dismissErrorButton
        )
      );

      self.dismissErrorButton.click();
    };
  }
  return TracingHomeView;
})();

module.exports = TracingHomeView;
