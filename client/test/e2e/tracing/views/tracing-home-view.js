var TracingHomeView = (function () {
  var EC = protractor.ExpectedConditions;

  function TracingHomeView() {
    this.componentIdentifier = element(
      by.css('section .sl-tracing'));

    this.waitUntilLoaded = function() {
      browser.driver.wait(
        EC.presenceOf(this.componentIdentifier),
      10000);
    };
  }
  return TracingHomeView;
})();

module.exports = TracingHomeView;
