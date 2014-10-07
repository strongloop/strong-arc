var StudioViews = require('../studio/views/');
var ComposerViews = require('../composer/views/');

describe('datasource-definition-interactions', function() {
  it('should login, open default db, logout',
    function() {
      var loginView = new StudioViews.LoginView();
      var landingView = new StudioViews.LandingView();
      var mainTreeNavView = new ComposerViews.MainTreeNavView();
      var dataSourceEditorView = new ComposerViews.DataSourceEditorView();
      var headerView = new StudioViews.HeaderView();

      loginView.loginToLandingView();

      landingView.openComposerView();

      mainTreeNavView.openFirstDataSource();

      expect(dataSourceEditorView.getCurrentDSName() === 'db');

      headerView.logout();
    }
  );
  it('should login,' +
    ' open new datasource view,' +
    ' create new datasource,' +
    ' delete datasource,' +
    ' logout',
    function() {
      var loginView = new StudioViews.LoginView();
      var landingView = new StudioViews.LandingView();
      var mainTreeNavView = new ComposerViews.MainTreeNavView();
      var dataSourceEditorView = new ComposerViews.DataSourceEditorView();
      var headerView = new StudioViews.HeaderView();

      loginView.loginToLandingView();

      landingView.openComposerView();

      expect(mainTreeNavView.dataSourceNavItems.count === 1);

      mainTreeNavView.openNewDataSourceView();

      expect(dataSourceEditorView.getCurrentDSName() === 'newDatasource');

      dataSourceEditorView.createNewDataSource('testDb');

      browser.waitForAngular();

      expect(dataSourceEditorView.getCurrentDSName() === 'testDb');

      expect(mainTreeNavView.dataSourceNavItems.count === 2);

      mainTreeNavView.deleteDataSourceByIndex(1);

      expect(mainTreeNavView.dataSourceNavItems.count === 1);

      headerView.logout();

    }
  );

});
