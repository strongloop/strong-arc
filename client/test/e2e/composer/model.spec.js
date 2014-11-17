var ArcViews = require('../arc/views/');
var ComposerViews = require('../composer/views/');

describe('model-definition-interactions', function() {
  it('should login navigate to api composer,' +
    ' create a model,' +
    ' add a property,' +
    ' add a comment, ' +
    ' edit the comment, ' +
    ' delete the model,' +
    ' logout',
    function() {

      var loginView = new ArcViews.LoginView();
      var landingView = new ArcViews.LandingView();
      var mainTreeNavView = new ComposerViews.MainTreeNavView();
      var modelEditorView = new ComposerViews.ModelEditorView();
      var headerView = new ArcViews.HeaderView();

      loginView.loginToLandingView();

      landingView.openComposerView();

      expect(mainTreeNavView.modelNavRows.count === 0);

      mainTreeNavView.openNewModelView();

      expect(modelEditorView.getCurrentModelName() === 'newModel');

      modelEditorView.createNewModel('mynewmodel');

      browser.waitForAngular();

      expect(modelEditorView.getCurrentModelName() === 'mynewmodel');
      expect(mainTreeNavView.modelNavRows.count === 1);

      modelEditorView.addNewProperty('mynewproperty');

      browser.waitForAngular();

      expect(modelEditorView.getFirstPropertyName() === 'mynewproperty');

      modelEditorView.addCommentToProperty(0, 'comment1');

      expect(modelEditorView.getFirstComment() === 'comment1');

      modelEditorView.addCommentToProperty(0, 'comment2');

      expect(modelEditorView.getFirstComment() === 'comment2');

      mainTreeNavView.deleteFirstModel();

      expect(mainTreeNavView.modelNavRows.count === 0);

      headerView.logout();
    }
  );

});

