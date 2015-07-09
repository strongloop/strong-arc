var ArcViews = require('../arc/views/');
var ComposerViews = require('../composer/views/');
var EC = protractor.ExpectedConditions;

describe('model-definition-interactions', function() {
  beforeEach(function() {
    var loginView = new ArcViews.LoginView();
    var landingView = new ArcViews.LandingView();
    var modelEditorView = new ComposerViews.ModelEditorView();
    loginView.loginToLandingView();
    landingView.openComposerView();
    browser.driver.wait(EC.visibilityOf(modelEditorView.addModelButton), 5000);
  });
  afterEach(function() {
    var headerView = new ArcViews.HeaderView();
    headerView.logout();
  });

  it('should login navigate to api composer,' +
    ' create a model,' +
    ' add a property,' +
    ' logout',
    function() {
      var mainTreeNavView = new ComposerViews.MainTreeNavView();
      var dataSourceEditorView = new ComposerViews.DataSourceEditorView();
      var modelEditorView = new ComposerViews.ModelEditorView();

      mainTreeNavView.openNewModelView();

      modelEditorView.createNewModel('mynewmodel');

      expect(modelEditorView.getCurrentModelName()).toEqual('mynewmodel');

      browser.sleep(1000).then(function () {
          expect(mainTreeNavView.modelNavRows.count()).toEqual(1);
      });

      modelEditorView.addNewProperty('mynewproperty');
      expect(modelEditorView.getFirstPropertyName()).toEqual('mynewproperty');

    }
  );

  it('should login navigate to api composer,' +
    ' open a model,' +
    ' open a property,' +
    ' add a comment, ' +
    ' edit the comment, ' +
    ' delete the model,' +
    ' logout',
    function() {
      var mainTreeNavView = new ComposerViews.MainTreeNavView();
      var modelEditorView = new ComposerViews.ModelEditorView();

      browser.sleep(750);
      expect(mainTreeNavView.modelNavRows.count()).toEqual(1);

      mainTreeNavView.openFirstModel();
      expect(modelEditorView.getCurrentModelName()).toEqual('mynewmodel');

      modelEditorView.addCommentToProperty(0, 'comment1');
      browser.sleep(250);
      expect(modelEditorView.getFirstComment()).toEqual('comment1');

      browser.sleep(500);

      modelEditorView.addCommentToProperty(0, 'comment2');
      browser.sleep(250);
      expect(modelEditorView.getFirstComment()).toEqual('comment2');
      
      browser.sleep(500);

      mainTreeNavView.deleteFirstModel();
      browser.sleep(500);
      expect(mainTreeNavView.modelNavRows.count()).toEqual(0);
    }
  );

});
