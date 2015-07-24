var ProcessManagerHomeView = (function () {
  var EC = protractor.ExpectedConditions;

  function ProcessManagerHomeView() {
    this.loadBalancerButton = element(
      by.css('button[ng-click="toggleManagerLoadBalancer()"]'));
    this.loadBalancerForm = element(
      by.css('div .load-balancer-content'));
    this.componentIdentifier = element(
      by.css('.manager-pm-host-grid')
    );

    this.waitUntilLoaded = function() {
      browser.driver.wait(
        EC.presenceOf(this.componentIdentifier),
      10000);
    };

    this.openLoadBalancerForm = function () {
      var self = this;
      this.loadBalancerButton.click();

      browser.driver.wait(
        EC.visibilityOf(self.loadBalancerForm),
      10000);
    };

    this.closeLoadBalancerForm = function () {
      var self = this;
      this.loadBalancerButton.click();

      browser.driver.wait(
        EC.invisibilityOf(self.loadBalancerForm),
      10000);
    };
  }
  return ProcessManagerHomeView;
})();

module.exports = ProcessManagerHomeView;
