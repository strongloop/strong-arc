var ProfilerHomeView = (function () {
  var EC = protractor.ExpectedConditions;

  function ProfilerHomeView() {
    this.componentIdentifier = element(
      by.css('section .sl-profiler'));

    this.waitUntilLoaded = function() {
      browser.driver.wait(
        EC.presenceOf(this.componentIdentifier),
      10000);
    };
  }
  return ProfilerHomeView;
})();

module.exports = ProfilerHomeView;
