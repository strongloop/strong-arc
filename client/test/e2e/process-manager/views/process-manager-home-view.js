var ProcessManagerHomeView = (function () {
  var EC = protractor.ExpectedConditions;

  function ProcessManagerHomeView() {
    var self = this;
    self.loadBalancerButton = element(
      by.css('button[ng-click="toggleManagerLoadBalancer()"]'));
    self.loadBalancerForm = element(
      by.css('div .load-balancer-content'));
    self.componentIdentifier = element(
      by.css('.manager-pm-host-grid')
    );

    self.waitUntilLoaded = function() {
      browser.driver.wait(
        EC.presenceOf(self.componentIdentifier),
      10000);
    };

    self.openLoadBalancerForm = function () {
      self.loadBalancerButton.click();

      browser.driver.wait(
        EC.visibilityOf(self.loadBalancerForm),
      10000);

    };

    this.closeLoadBalancerForm = function () {

      self.loadBalancerButton.click();

      browser.driver.wait(
        EC.invisibilityOf(self.loadBalancerForm),
      10000);
    };
  }
  return ProcessManagerHomeView;
})();

module.exports = ProcessManagerHomeView;
