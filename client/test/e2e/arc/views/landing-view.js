var LandingView = (function () {
  function LandingView() {
    this.landingTitle  = element(by.css('.landing-title'));
    this.composerAppCommand  = element(
      by.css('.sl-apps a[ui-sref="composer"].app-launch'));

    this.openComposerView = function() {
      this.composerAppCommand.click();
    };
  }
  return LandingView;
})();

module.exports = LandingView;
