var MainTreeNavView = (function () {
  function MainTreeNavView() {
    this.modelNavRows = element.all(
      by.css('.model-branch-container .tree-item-row'));
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

    this.openNewModelView = function() {
      this.addModelButton.click();
    };
    this.openFirstDataSource = function() {
      this.dataSourceNavItems.get(0).click();
    };
    this.openNewDataSourceView = function() {
      this.addDataSourceButton.click();
    };
    this.deleteDataSourceByIndex = function(index) {
      var ptor = protractor.getInstance();

      var dataSourceNavCtx = this.dataSourceCtxBtns.get(1);
      browser.driver.actions().click(dataSourceNavCtx).perform();
      var deleteButton = this.ctxMenuTriggers.get(2);
      browser.driver.actions().click(deleteButton).perform();
      var alertDialog = ptor.switchTo().alert();

      alertDialog.accept();
    };
    this.deleteFirstModel = function() {
      var ptor = protractor.getInstance();
      // Main Tree Context Menu
      var modelNavCtx = this.modelCtxBtns.get(0);

      browser.driver.actions().click(modelNavCtx).perform();

      var deleteButton = this.ctxMenuTriggers.get(0);
      browser.driver.actions().click(deleteButton).perform();

      var alertDialog = ptor.switchTo().alert();

      alertDialog.accept();
    };
  }
  return MainTreeNavView;
})();

module.exports = MainTreeNavView;
