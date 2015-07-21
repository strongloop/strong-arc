var BuildDeployHomeView = (function () {
  var EC = protractor.ExpectedConditions;

  function BuildDeployHomeView() {
    var self = this;

    this.componentIdentifier = element(
      by.css('section .sl-build-deploy'));

    this.waitUntilLoaded = function() {
      browser.driver.wait(
        EC.presenceOf(self.componentIdentifier),
      10000);
    };
  }
  return BuildDeployHomeView;
})();

module.exports = BuildDeployHomeView;
