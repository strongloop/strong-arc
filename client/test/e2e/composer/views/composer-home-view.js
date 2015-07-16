var ComposerHomeView = (function () {
  var EC = protractor.ExpectedConditions;

  function ComposerHomeView() {
    this.projectTitleContainer = element(
      by.css('.ia-project-title-container'));

    this.waitUntilLoaded = function() {
      browser.driver.wait(
        EC.presenceOf(this.projectTitleContainer),
      10000);
    };
  }
  return ComposerHomeView;
})();

module.exports = ComposerHomeView;
