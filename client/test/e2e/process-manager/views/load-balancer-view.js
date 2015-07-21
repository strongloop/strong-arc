var LoadBalancerView = (function () {
  var EC = protractor.ExpectedConditions;

  function LoadBalancerView() {
    this.loadBalancerButton = element(
      by.css('button[ng-click="toggleManagerLoadBalancer()"]'));
    this.loadBalancerForm = element(
      by.css('div .load-balancer-content'));
    this.loadBalancerHostInput = element(
      by.css('.load-balancer-host'));
    this.loadBalancerPortInput = element(
      by.css('.load-balancer-port'));
    this.loadBalancerSaveButton = element(
      by.css('button[ng-click="saveLoadBalancer()"]'));


    this.addLoadBalancer = function (host, port) {
      this.loadBalancerHostInput.clear();
      this.loadBalancerHostInput.sendKeys(host);
      
      this.loadBalancerPortInput.clear();
      this.loadBalancerPortInput.sendKeys(port);      

      this.loadBalancerSaveButton.click();

      browser.sleep(1500);
    }
  }
  return LoadBalancerView;
})();

module.exports = LoadBalancerView;
