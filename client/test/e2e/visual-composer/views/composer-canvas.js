var ComposerCanvasView = (function() {
  var EC = protractor.ExpectedConditions;

  function ComposerCanvasView() {
    this.componentIdentifier = element(
      by.css('#composer-canvas'));

    this.waitUntilLoaded = function() {
      browser.driver.wait(
        EC.presenceOf(this.componentIdentifier),
      10000);
    };
  }

  return ComposerCanvasView;
})();

module.exports = ComposerCanvasView;
