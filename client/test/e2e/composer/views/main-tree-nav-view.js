var MainTreeNavView = (function () {
  var EC = protractor.ExpectedConditions;

  function MainTreeNavView() {
    this.modelNavRows = element.all(
      by.css('.model-branch-container .tree-item-row'));
    this.modelNavButtons = element.all(
      by.css('.model-branch-container .tree-item-row button'));
    this.modelCtxBtns = element.all(
      by.css('.model-branch-container button.btn-nav-context'));
    this.dataSourceCtxBtns = element.all(
      by.css('.datasource-branch-container button.btn-ds-nav-context'));
    this.addModelButton = element(
      by.id('nav-tree-addnew-model'));
    this.ctxModelDelete = element(by.css('.context-menu-model-delete'));
    this.ctxDsDelete = element(by.css('.context-menu-ds-delete'));
    this.ctxDsDiscover = element(by.css('.context-menu-ds-discover'));
    this.dataSourceNavItems = element.all(
      by.css('.datasource-branch-container button.nav-tree-item'));
    this.contextMenuTrigger = element(by.css('button.btn-nav-context'));
    this.addDataSourceButton = element(
      by.id('nav-tree-addnew-datasource'));
    this.currentMessage = element(
      by.repeater('message in messages'));

    this.openNewModelView = function() {
      browser.driver.wait(EC.presenceOf(this.addModelButton), 10000);
      this.addModelButton.click();
    };
    this.openFirstModel = function() {
      browser.driver.wait(EC.presenceOf(this.addModelButton), 10000);
      this.modelNavButtons.first().click();
    };
    this.openFirstDataSource = function() {
      var self = this;
      browser.driver.wait(function() {
        return self.dataSourceNavItems.count(function(c) {
          return c > 0;
        });
      }, 10000);
      self.dataSourceNavItems.first().click();
    };
    this.openDataSourceDiscoveryByIndex = function (index) {
      var self = this;
      browser.driver.wait(
        EC.presenceOf(this.addDataSourceButton),
      10000);
      var dataSourceNavCtx = this.dataSourceCtxBtns.get(index);
      browser.driver.actions().click(dataSourceNavCtx).perform();
      browser.driver.wait(EC.visibilityOf(self.ctxDsDiscover), 1000);
      browser.driver.actions().click(self.ctxDsDiscover).perform();
    };
    this.openNewDataSourceView = function() {
      var self = this;
      browser.driver.wait(EC.visibilityOf(self.addDataSourceButton), 10000);
      self.addDataSourceButton.click();
    };
    this.deleteDataSourceByIndex = function(index) {
      var self = this;
      browser.driver.wait(
        EC.presenceOf(this.addDataSourceButton),
      10000);
      var dataSourceNavCtx = self.dataSourceCtxBtns.get(index);
      browser.driver.actions().click(dataSourceNavCtx).perform();
      browser.driver.wait(EC.visibilityOf(self.ctxDsDelete), 1700);
      browser.driver.actions().click(self.ctxDsDelete).perform();
      browser.wait(EC.alertIsPresent(), 1200);
      var alertDialog = browser.switchTo().alert();
      alertDialog.accept();
    };
    this.deleteFirstModel = function() {
      var self = this;
      browser.driver.wait(
        EC.presenceOf(this.addDataSourceButton),
      10000);
      // Main Tree Context Menu
      var modelNavCtx = self.modelCtxBtns.get(0);
      browser.driver.actions().click(modelNavCtx).perform();
      browser.driver.wait(EC.visibilityOf(self.ctxModelDelete), 1000);
      browser.driver.actions().click(self.ctxModelDelete).perform();
      browser.wait(EC.alertIsPresent(), 10000);
      var alertDialog = browser.switchTo().alert();
      alertDialog.accept();
    };
    this.waitForMessages = function () {
      browser.driver.wait(EC.visibilityOf(this.currentMessage),5000);
      browser.driver.wait(EC.invisibilityOf(this.currentMessage),5000);
    };
  }
  return MainTreeNavView;
})();

module.exports = MainTreeNavView;
