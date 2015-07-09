var ArcViews = require('../arc/views/');
var ComposerViews = require('../composer/views/');
var EC = protractor.ExpectedConditions;

var randomPropertyName = Math.floor(Math.random() * Date.now()).toString();

var mysqlCreds = {
    user: 'studio',
    pass: 'zh59jeol',
    dbname: 'strong_studio_test'
}

describe('datasource-definition-interactions', function() {
    beforeEach(function() {
        var loginView = new ArcViews.LoginView();
        var landingView = new ArcViews.LandingView();

        loginView.loginToLandingView(false);
        landingView.openComposerView();
    });

    afterEach(function() {
        var headerView = new ArcViews.HeaderView();

        headerView.logout();
    });

    it('should login,' +
        ' open default db,' +
        ' logout',
        function() {
            var mainTreeNavView = new ComposerViews.MainTreeNavView();
            var dataSourceEditorView = new ComposerViews.DataSourceEditorView();

            mainTreeNavView.openFirstDataSource();
            browser.driver.wait(EC.visibilityOf(dataSourceEditorView.saveDataSourceButton), 10000);
            expect(dataSourceEditorView.getCurrentDSName()).toEqual('db');
        }
    );

    it('should login,' +
        ' open new datasource view,' +
        ' create new datasource,' +
        ' delete datasource,' +
        ' logout',
        function() {
            var mainTreeNavView = new ComposerViews.MainTreeNavView();
            var dataSourceEditorView = new ComposerViews.DataSourceEditorView();

            // TODO: these sleeps are really bad...

            browser.sleep(500).then(function() {
                return expect(mainTreeNavView.dataSourceNavItems.count()).toEqual(1);
            });

            mainTreeNavView.openNewDataSourceView();
            expect(dataSourceEditorView.getCurrentDSName()).toEqual('newDatasource');

            dataSourceEditorView.createNewDataSource('testDb');

            browser.sleep(500).then(function() {
                dataSourceEditorView.saveDataSource();
            });

            browser.sleep(750).then(function() {
                expect(dataSourceEditorView.getCurrentDSName()).toEqual('testDb');
                expect(mainTreeNavView.dataSourceNavItems.count()).toEqual(2);
            });

            mainTreeNavView.deleteDataSourceByIndex(1);
            browser.sleep(750).then(function() {
                expect(mainTreeNavView.dataSourceNavItems.count()).toEqual(1);
            });


        }
    );

    it('should login,' +
        ' open new datasource view,' +
        ' create new mysql datasource,' +
        ' logout',
        function() {
            var mainTreeNavView = new ComposerViews.MainTreeNavView();
            var dataSourceEditorView = new ComposerViews.DataSourceEditorView();
            var modelEditorView = new ComposerViews.ModelEditorView();


            // TODO: these sleeps are really bad...


            browser.sleep(500).then(function() {
                return expect(mainTreeNavView.dataSourceNavItems.count()).toEqual(1);
            });


            mainTreeNavView.openNewDataSourceView();
            expect(dataSourceEditorView.getCurrentDSName()).toEqual('newDatasource');

            dataSourceEditorView.createNewExternalDataSource('myotherdb', mysqlCreds.dbname, mysqlCreds.user, mysqlCreds.pass, '127.0.0.1', '3306');
            expect(dataSourceEditorView.getCurrentDSName()).toEqual('myotherdb');
            //browser.pause()

            browser.sleep(750).then(function() {
                expect(mainTreeNavView.dataSourceNavItems.count()).toEqual(2);
            });


            dataSourceEditorView.testDatabaseConnection();
            expect(EC.textToBePresentInElement(dataSourceEditorView.connectionSuccessIndicator, 'Success'));
        }
    );

    it('should login,' +
        ' create new model' +
        ' add a random property' +
        ' migrate model to datasource' +
        ' delete model' +
        ' logout',
        function() {
            var mainTreeNavView = new ComposerViews.MainTreeNavView();
            var dataSourceEditorView = new ComposerViews.DataSourceEditorView();
            var modelEditorView = new ComposerViews.ModelEditorView();

            mainTreeNavView.openNewModelView();

            modelEditorView.createNewModel('mynewmodel');

            expect(modelEditorView.getCurrentModelName()).toEqual('mynewmodel');

            browser.sleep(500);

            modelEditorView.addNewProperty(randomPropertyName);

            browser.sleep(500);

            expect(modelEditorView.getFirstPropertyName()).toEqual(randomPropertyName);


            //potential bug: left column model view flickers before it is saved.
            // browser.sleep(500).then(function() {
            //     return expect(mainTreeNavView.modelNavRows.count()).toEqual(1);
            // });

            modelEditorView.selectDatasource('myotherdb');
            expect(modelEditorView.getCurrentDataSourceIndex()).toEqual('1');

            modelEditorView.saveModel();


            // TODO: these sleeps are really bad...

            browser.sleep(500).then(function() {
                return expect(mainTreeNavView.dataSourceNavItems.count()).toEqual(2);
            });

            browser.sleep(2500).then(function() {
              //wait is necessary for the growl notifications to go away
              modelEditorView.migrateCurrentModel();
            });

            mainTreeNavView.deleteFirstModel();

            browser.sleep(500).then(function() {
                expect(mainTreeNavView.modelNavRows.count()).toEqual(0);
            })
        }
    );

    it('should login,' +
        ' discover from datasource' +
        ' delete datasource' +
        ' logout',
        function() {
            var mainTreeNavView = new ComposerViews.MainTreeNavView();
            var dataSourceEditorView = new ComposerViews.DataSourceEditorView();
            var modelEditorView = new ComposerViews.ModelEditorView();
            var discoveryMenuView = new ComposerViews.DiscoveryMenuView();

            browser.sleep(500);

            mainTreeNavView.openDataSourceDiscoveryByIndex(1);

            discoveryMenuView.filterDiscoveredModels('mynewmodel');

            discoveryMenuView.selectFirstDiscoveredModel();

            discoveryMenuView.continueDiscovery();

            discoveryMenuView.waitForModelsToBeDiscovered();

            discoveryMenuView.continueDiscovery();

            browser.sleep(2500);

            expect(modelEditorView.getFirstPropertyName()).toEqual(randomPropertyName);
        }
    );

    it('should login,' +
      ' delete datasource,' +
      ' delete model' +
      ' logout',
      function () {
        var mainTreeNavView = new ComposerViews.MainTreeNavView();

        browser.sleep(500);

        mainTreeNavView.deleteFirstModel();

        mainTreeNavView.deleteDataSourceByIndex(1);

    });

});