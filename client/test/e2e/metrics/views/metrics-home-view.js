var MetricsHomeView = (function () {
  var EC = protractor.ExpectedConditions;

  function MetricsHomeView() {
    this.componentIdentifier = element(
      by.css('section .sl-metrics'));

    this.waitUntilLoaded = function() {
      browser.driver.wait(
        EC.presenceOf(this.componentIdentifier),
      10000);
    };
  }
  return MetricsHomeView;
})();

module.exports = MetricsHomeView;
