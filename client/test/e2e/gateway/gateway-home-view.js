var GatewayHomeView = (function () {
  var EC = protractor.ExpectedConditions;

  function GatewayHomeView() {
    this.componentIdentifier = element(
      by.css('[data-id="GatewayMainContainer"]'));

    this.waitUntilLoaded = function() {
      browser.driver.wait(
        EC.presenceOf(this.componentIdentifier),
        10000);
    };
  }
  return GatewayHomeView;
})();

module.exports = GatewayHomeView;
