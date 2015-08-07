var GatewayHomeView = (function () {
  var EC = protractor.ExpectedConditions;

  function GatewayHomeView() {
    var self = this;
    self.componentIdentifier = element(
      by.css('span.ia-project-title-container'));

    self.waitUntilLoaded = function() {
      browser.driver.wait(
        EC.presenceOf(self.componentIdentifier),
        10000);
    };
  }
  return GatewayHomeView;
})();

module.exports = GatewayHomeView;
