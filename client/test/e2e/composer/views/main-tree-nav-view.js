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
      by.css('button[data-type="model"].nav-tree-item-addnew'));
    this.ctxMenuTriggers = element.all(by.css('.context-menu-item'));
    this.dataSourceNavItems = element.all(
      by.css('.datasource-branch-container button.nav-tree-item'));
    this.contextMenuTrigger = element(by.css('button.btn-nav-context'));
    this.addDataSourceButton = element(
      by.css('button[data-type="datasource"].nav-tree-item-addnew'));
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
      browser.driver.wait(
        EC.presenceOf(this.addDataSourceButton),
      10000);
      var dataSourceNavCtx = this.dataSourceCtxBtns.get(index);
      browser.driver.actions().click(dataSourceNavCtx).perform();
      var discoverButton = this.ctxMenuTriggers.get(1);
      browser.driver.actions().click(discoverButton).perform();
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
      var deleteButton = self.ctxMenuTriggers.get(2);
      browser.driver.actions().click(deleteButton).perform();
      browser.sleep(500);
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
      var deleteButton = self.ctxMenuTriggers.get(0);
      browser.driver.actions().click(deleteButton).perform();
      browser.sleep(500);
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
