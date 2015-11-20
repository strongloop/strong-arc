var ArcViews = require('../arc/views/');
var ComposerViews = require('../composer/views/');
var EC = protractor.ExpectedConditions;
var testServer = 'http://127.0.0.1:' + (process.env.TEST_SERVER_PORT || 9800);

describe('model-definition-interactions', function() {
  beforeAll(function() {
    var loginView = new ArcViews.LoginView();
    var landingView = new ArcViews.LandingView();
    loginView.loginToLandingView();
    landingView.openComposerView();
  });

  beforeEach(function() {
    var modelEditorView = new ComposerViews.ModelEditorView();
    browser.get(testServer + '/#/composer');
    browser.driver.wait(
      EC.visibilityOf(modelEditorView.addModelButton),
      5000);
  });

  afterAll(function() {
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
    }
  );

  it(' should login navigate to api composer,' +
    ' open a model,' +
    ' open a property,' +
    ' add a comment, ' +
    ' edit the comment, ' +
    ' modify settings of the model' +
    ' logout',
    function() {
      var mainTreeNavView = new ComposerViews.MainTreeNavView();
      var modelEditorView = new ComposerViews.ModelEditorView();

      browser.sleep(750);
      expect(mainTreeNavView.modelNavRows.count()).toEqual(1);

      mainTreeNavView.openFirstModel();
      expect(modelEditorView.getCurrentModelName()).toEqual('mynewmodel');

      modelEditorView.addCommentToProperty(0, 'comment1\n');
      browser.sleep(250);
      expect(modelEditorView.getFirstComment()).toEqual('comment1');

      browser.sleep(500);

      modelEditorView.addCommentToProperty(0, 'comment2\n');

      browser.sleep(250);

      expect(modelEditorView.getFirstComment()).toEqual('comment2');

      browser.sleep(500);

      modelEditorView.toggleFirstModelId();

      browser.sleep(750);

      modelEditorView.toggleFirstModelRequired();

      browser.sleep(750);

      modelEditorView.toggleFirstModelIndex();


      expect(mainTreeNavView.modelNavRows.count()).toEqual(1);
    }

  );

  it(' should login navigate to api composer,' +
    ' open a model,' +
    ' attempt to create a property with an invalid name' +
    ' logout',
    function() {
      var mainTreeNavView = new ComposerViews.MainTreeNavView();
      var modelEditorView = new ComposerViews.ModelEditorView();

      browser.sleep(750);
      expect(mainTreeNavView.modelNavRows.count()).toEqual(1);

      mainTreeNavView.openFirstModel();
      expect(modelEditorView.getCurrentModelName()).toEqual('mynewmodel');

      modelEditorView.addNewProperty('invalid property name');

      expect(modelEditorView.validationErrorMessagePresent());

      expect(mainTreeNavView.modelNavRows.count()).toEqual(1);
    }

  );

  it('should open a model' +
    ' open a property,' +
    ' verify settings were persisted,' +
    ' delete the model,' +
    ' logout',
    function() {
      var mainTreeNavView = new ComposerViews.MainTreeNavView();
      var dataSourceEditorView = new ComposerViews.DataSourceEditorView();
      var modelEditorView = new ComposerViews.ModelEditorView();

      browser.sleep(750);
      expect(mainTreeNavView.modelNavRows.count()).toEqual(1);

      mainTreeNavView.openFirstModel();
      expect(modelEditorView.getCurrentModelName()).toEqual('mynewmodel');

      browser.sleep(750);

      expect(modelEditorView.getCheckedElements().count()).toEqual(3);
      expect(modelEditorView.getFirstComment()).toEqual('comment2');

      mainTreeNavView.deleteFirstModel();
      browser.sleep(500);
      expect(mainTreeNavView.modelNavRows.count()).toEqual(0);
    }

  );

  it('should attempt to create a model with a false name,' +
    ' logout',
    function() {
      var mainTreeNavView = new ComposerViews.MainTreeNavView();
      var dataSourceEditorView = new ComposerViews.DataSourceEditorView();
      var modelEditorView = new ComposerViews.ModelEditorView();

      mainTreeNavView.openNewModelView();

      modelEditorView.createNewModel('my wrong model');

      expect(modelEditorView.validationErrorMessagePresent());

      expect(mainTreeNavView.modelNavRows.count()).toEqual(0);
    }

  );

  it('should attempt to create a model with no name,' +
    ' logout',
    function() {
      var mainTreeNavView = new ComposerViews.MainTreeNavView();
      var dataSourceEditorView = new ComposerViews.DataSourceEditorView();
      var modelEditorView = new ComposerViews.ModelEditorView();

      mainTreeNavView.openNewModelView();

      modelEditorView.createNewModel('');

      expect(modelEditorView.validationErrorMessagePresent());

      expect(mainTreeNavView.modelNavRows.count()).toEqual(0);
    }

  );

});
