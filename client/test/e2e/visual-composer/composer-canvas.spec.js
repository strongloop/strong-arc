var ArcViews = require('../arc/views/');
var VisualComposerViews = require('../visual-composer/views/');
var EC = protractor.ExpectedConditions;

describe('tracing-interactions', function() {
  beforeEach(function() {
    var loginView = new ArcViews.LoginView();
    var landingView = new ArcViews.LandingView();

    loginView.loginToLandingView();
    landingView.openVisualComposerView();
  });

  afterEach(function() {
    var headerView = new ArcViews.HeaderView();

    headerView.logout();
  });

  it('should login navigate to api composer, create a model, add a property,' +
     ' and logout', function() {
    var mainTreeNavView = new VisualComposerViews.MainTreeNavView();
    var modelEditorView = new VisualComposerViews.ModelEditorView();

    mainTreeNavView.openNewModelView();
    modelEditorView.createNewModel('mynewmodel');
    expect(modelEditorView.getCurrentModelName()).toEqual('mynewmodel');

    browser.sleep(1000).then(function() {
      expect(mainTreeNavView.modelNavRows.count()).toEqual(1);
    });

    modelEditorView.addNewProperty('mynewproperty');

    expect(
        modelEditorView.getFirstPropertyName()
      ).toEqual('mynewproperty');
  });
});
