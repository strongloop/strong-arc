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
    this.loadBalancerDeleteButton = element(
      by.css('a[ng-click="deleteLoadBalancer()"]'));


    this.addLoadBalancer = function (host, port) {
      browser.driver.wait(
        EC.elementToBeClickable(
          this.loadBalancerHostInput
        ),
      10000);

      this.loadBalancerHostInput.clear();
      this.loadBalancerHostInput.sendKeys(host);
      
      this.loadBalancerPortInput.clear();
      this.loadBalancerPortInput.sendKeys(port);      

      this.loadBalancerSaveButton.click();

      browser.sleep(1500);
    };

    this.deleteLoadBalancer = function () {
      browser.driver.wait(
        EC.elementToBeClickable(
          this.loadBalancerDeleteButton
        ),
      10000);
      
      this.loadBalancerDeleteButton.click();
      
      browser.sleep(500);

      var alertDialog = browser.switchTo().alert();
      alertDialog.accept();
    };
  }
  return LoadBalancerView;
})();

module.exports = LoadBalancerView;
