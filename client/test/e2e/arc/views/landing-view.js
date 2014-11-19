var LandingView = (function () {
  function LandingView() {
    this.landingTitle  = element(by.css('.landing-title'));
    this.composerAppCommand  = element(
      by.css('.sl-app a[ui-sref="composer"]'));

    this.openComposerView = function() {
      this.composerAppCommand.click();
    };
  }
  return LandingView;
})();

module.exports = LandingView;
