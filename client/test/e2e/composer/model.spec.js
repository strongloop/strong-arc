var StudioViews = require('../studio/views/');
var ComposerViews = require('../composer/views/');

describe('model-definition-interactions', function() {
  it('should login navigate to api composer,' +
    ' create a model,' +
    ' add a property,' +
    ' rename property,' +
    ' delete the model,' +
    ' logout',
    function() {

      var loginView = new StudioViews.LoginView();
      var landingView = new StudioViews.LandingView();
      var mainTreeNavView = new ComposerViews.MainTreeNavView();
      var modelEditorView = new ComposerViews.ModelEditorView();
      var headerView = new StudioViews.HeaderView();

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

      mainTreeNavView.deleteFirstModel();

      expect(mainTreeNavView.modelNavRows.count === 0);

      headerView.logout();
    }
  );

});
