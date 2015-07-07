var ArcViews = require('../arc/views/');
var ComposerViews = require('../composer/views/');

describe('model-definition-interactions', function() {
  beforeEach(function() {
    var loginView = new ArcViews.LoginView();
    var landingView = new ArcViews.LandingView();
    var modelEditorView = new ComposerViews.ModelEditorView();
    loginView.loginToLandingView();
    landingView.openComposerView();
    browser.driver.wait(function() {
      return modelEditorView.addModelButton.isPresent();
    }, 10000);
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
      var modelEditorView = new ComposerViews.ModelEditorView();

      browser.sleep(500);
      expect(mainTreeNavView.modelNavRows.count()).toEqual(0);

      mainTreeNavView.openNewModelView();

      modelEditorView.createNewModel('mynewmodel');

      browser.waitForAngular();
      browser.sleep(500);

      expect(modelEditorView.getCurrentModelName()).toEqual('mynewmodel');

      expect(mainTreeNavView.modelNavRows.count()).toEqual(1);

      modelEditorView.addNewProperty('mynewproperty');
      expect(modelEditorView.getFirstPropertyName()).toEqual('mynewproperty');
    }
  );

  xit('should login navigate to api composer,' +
    ' open a model,' +
    ' open a property,' +
    ' add a comment, ' +
    ' edit the comment, ' +
    ' delete the model,' +
    ' logout',
    function() {
      var mainTreeNavView = new ComposerViews.MainTreeNavView();
      var modelEditorView = new ComposerViews.ModelEditorView();

      browser.sleep(500);
      expect(mainTreeNavView.modelNavRows.count()).toEqual(1);

      mainTreeNavView.openFirstModel();
      expect(modelEditorView.getCurrentModelName()).toEqual('mynewmodel');

      // TODO: test fails with a "Maximum call stack size exceeded."
      modelEditorView.addCommentToProperty(0, 'comment1');
      expect(modelEditorView.getFirstComment()).toEqual('comment1');
      modelEditorView.addCommentToProperty(0, 'comment2');
      expect(modelEditorView.getFirstComment()).toEqual('comment2');
      mainTreeNavView.deleteFirstModel();
      expect(mainTreeNavView.modelNavRows.count()).toEqual(0);
    }
  );

});
