var ComposerHomeView = (function () {
  function ComposerHomeView() {
    this.projectTitleContainer = element(
      by.css('.ia-project-title-container'));
  }
  return ComposerHomeView;
})();

module.exports = ComposerHomeView;
