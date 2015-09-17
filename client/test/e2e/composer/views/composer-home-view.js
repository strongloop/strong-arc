var ComposerHomeView = (function () {
  var EC = protractor.ExpectedConditions;

  function ComposerHomeView() {
    this.componentIdentifier = element(
      by.css('section .sl-composer'));

    this.waitUntilLoaded = function() {
      browser.driver.wait(
        EC.presenceOf(this.componentIdentifier),
      10000);
    };
  }
  return ComposerHomeView;
})();

module.exports = ComposerHomeView;
