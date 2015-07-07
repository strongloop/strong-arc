var ArcViews = require('../arc/views/');
var ComposerViews = require('../composer/views/');
var EC = protractor.ExpectedConditions;

describe('datasource-definition-interactions', function() {
  it('should login, open default db, logout',
    function() {
      var loginView = new ArcViews.LoginView();
      var landingView = new ArcViews.LandingView();
      var mainTreeNavView = new ComposerViews.MainTreeNavView();
      var dataSourceEditorView = new ComposerViews.DataSourceEditorView();
      var headerView = new ArcViews.HeaderView();

      loginView.loginToLandingView();
      landingView.openComposerView();
      mainTreeNavView.openFirstDataSource();
      browser.driver.wait(
        EC.visibilityOf(dataSourceEditorView.saveDataSourceButton), 10000);
      expect(dataSourceEditorView.getCurrentDSName()).toEqual('db');

      headerView.logout();
    }
  );
  it('should login,' +
    ' open new datasource view,' +
    ' create new datasource,' +
    ' delete datasource,' +
    ' logout',
    function() {
      var loginView = new ArcViews.LoginView();
      var landingView = new ArcViews.LandingView();
      var mainTreeNavView = new ComposerViews.MainTreeNavView();
      var dataSourceEditorView = new ComposerViews.DataSourceEditorView();
      var headerView = new ArcViews.HeaderView();

      loginView.loginToLandingView();

      landingView.openComposerView();

      // TODO: these sleeps are really bad...

      browser.sleep(500).then(function() {
        return expect(mainTreeNavView.dataSourceNavItems.count()).toEqual(1);
      });

      mainTreeNavView.openNewDataSourceView();
      expect(dataSourceEditorView.getCurrentDSName()).toEqual('newDatasource');

      dataSourceEditorView.createNewDataSource('testDb');
      browser.sleep(500).then(function() {
        expect(dataSourceEditorView.getCurrentDSName()).toEqual('testDb');
        expect(mainTreeNavView.dataSourceNavItems.count()).toEqual(2);
      });

      dataSourceEditorView.createNewDataSource('testDb2');
      browser.sleep(500).then(function() {
        expect(dataSourceEditorView.getCurrentDSName()).toEqual('testDb2');
        expect(mainTreeNavView.dataSourceNavItems.count()).toEqual(2);
      });

      mainTreeNavView.deleteDataSourceByIndex(0);
      browser.sleep(500).then(function() {
        expect(mainTreeNavView.dataSourceNavItems.count()).toEqual(1);
      });

      headerView.logout();
    }
  );

});
