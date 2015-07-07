var ComposerHomeView = (function () {
  function ComposerHomeView() {
    this.projectTitleContainer = element(
      by.css('.ia-project-title-container'));

    this.waitUntilLoaded = function() {
      var self = this;
      browser.driver.wait(function() {
        return self.projectTitleContainer.isPresent();
      }, 10000);
    };
  }
  return ComposerHomeView;
})();

module.exports = ComposerHomeView;
