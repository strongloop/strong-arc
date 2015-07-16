var DiscoveryMenuView = (function () {
  function DiscoveryMenuView() {
    var EC = protractor.ExpectedConditions;
    this.filterInput = element(by.css('.discovery-schema-filter-input'));
    this.selectAllButton = element(by.css('.btn-select-all'));
    this.discoveredModelsCollection = element(
      by.repeater('row in renderedRows'));
    this.continueFromDiscoveredModelsButton = element(
      by.css('button[ng-click="discoveryNexBtnClicked()"]'));
    this.indicatorOfModelsBeingDiscovered = element(
      by.cssContainingText('.discovery-schema-grid-label',
      'Models to be generated'));

    this.filterDiscoveredModels = function (value) {
      var el = this.filterInput;

      browser.driver.wait(EC.visibilityOf(el), 15000);

      this.filterInput.sendKeys(value);
    };

    this.selectFirstDiscoveredModel = function () {
      var el = this.discoveredModelsCollection;

      browser.driver.wait(EC.elementToBeClickable(el), 15000);

      el.click();
    };

    this.selectAllDiscoveredModels = function () {
      var el = this.selectAllButton;

      browser.driver.wait(EC.elementToBeClickable(el), 15000);

      el.click();
    };

    this.continueDiscovery = function () {
      var el = this.continueFromDiscoveredModelsButton;

      browser.driver.wait(EC.elementToBeClickable(el), 15000);

      el.click();      
    };
    
    this.waitForModelsToBeDiscovered = function () {
      var el = this.indicatorOfModelsBeingDiscovered;

      browser.driver.wait(EC.visibilityOf(el), 15000);
    };
  }
  return DiscoveryMenuView;
})();

module.exports = DiscoveryMenuView;
