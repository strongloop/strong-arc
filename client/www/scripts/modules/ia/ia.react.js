/** @jsx React.DOM */
/*
*
*   Main Nav Container
*
* */
var IAMainNavContainer = (IAMainNavContainer = React).createClass({


  render: function() {

    var scope = this.props.scope;
    var singleClickItem = function(event) {
      if (event.target.attributes['data-id']){
        scope.$apply(function () {
          scope.navTreeItemClicked('root', event.target.attributes['data-id'].value, event.metaKey);
        });
      }
    };
    return (
      <div>
        <div className="ia-project-title-header-container" >
          <div className="ia-project-nav-help">
            <a target="_blank" href="http://docs.strongloop.com/display/SLS/Using+frobnors">
              <span id="mainNavContextHelp" data-id="MainNavContextHelp" className="glyphicon glyphicon-question-mark"></span>
            </a>
          </div>
          <span className="ia-project-title-container">This is an example of a long project name</span>
        </div>
        <IAMainModelNav scope={this.props.scope} />
        <IAMainDatasourceNav scope={this.props.scope} />
      </div>
      );
  }
});
/*
*
*   Model Main Nav
*
* */
var IAMainModelNav = (IAMainModelNav = React).createClass({
  openSelectedModels:function(key, opt) {
    var that = this;
    that.props.scope.$apply(function () {
      that.props.scope.openSelectedModels();
    });
  },
  deleteSelectedModel: function(key, opt) {
    var scope = this.props.scope;

    try{
      if (opt.sourceEvent.currentTarget.attributes['data-id']){
        var modelId = opt.sourceEvent.currentTarget.attributes['data-id'].value;
        scope.$apply(function(){
         scope.deleteModelDefinitionRequest(modelId);
        });

      }
    }
    catch(error) {
      console.warn('error deleting model definition: ' + error);
    }

  },
  componentDidMount:function(){

  },
  render: function() {

    var scope = this.props.scope;

    var modelSelectedCollection = [];
    var cx = React.addons.classSet;


    var clickBranch = function(event) {
      scope.$apply(function () {
        scope.navTreeBranchClicked('model');
      });
    };

    var singleClickItem = function(event) {

      if (event.target.attributes['data-id'] || event.target.parentElement.attributes['data-id']){
        var val = '';
        if (event.target.attributes['data-id']) {
          val = event.target.attributes['data-id'].value;
        }
        else {
          val = event.target.parentElement.attributes['data-id'].value;
        }
        scope.$apply(function () {
          scope.navTreeItemClicked('model', val, event.metaKey);
        });

      }

    };

    var addNewInstanceRequest = function(event) {
      scope.$apply(function() {
        scope.createModelViewRequest();
      });
    };
    var hoverEvent = function(event) {

      $(event.target).parent('.tree-item-row').attr('data-state', 'hover');
    };
    var hoverOutEvent = function(event) {

    };
    var navModels = [];
    if (Array.isArray(scope.mainNavModels)) {
      navModels = scope.mainNavModels;
    }
    var navItemContainerClasses = cx({
      'ia-tree-node-table branch-leaf-list is-open': scope.modelNavIsVisible,
      'ia-tree-node-table branch-leaf-list is-closed': !scope.modelNavIsVisible
    });
    var navItemOpenCloseIconClasses = cx({
      'nav-branch-openclose-icon glyphicon glyphicon-navbranch-open': scope.modelNavIsVisible,
      'nav-branch-openclose-icon glyphicon glyphicon-navbranch-closed': !scope.modelNavIsVisible
    });
    var navItemsOpenCloseFolderIconClasses = cx({
      'nav-branch-folder-icon glyphicon glyphicon-folder-open': scope.modelNavIsVisible,
      'nav-branch-folder-icon glyphicon glyphicon-folder-open': !scope.modelNavIsVisible
    });
    var rowItems = navModels.map(function(item) {
      var classNameVar = 'tree-item-row ';
      if (item.isActive) {
        classNameVar += ' is-active';
      }
      else if (item.isOpen) {
        classNameVar += ' is-open';
      }
      else if (item.isSelected) {
        classNameVar += ' is-selected'
      }
      return (
        <div data-ui-type="row" onMouseOver={hoverEvent} onMouseOut={hoverOutEvent} className={classNameVar} data-id={item.id} >
          <div data-ui-type="cell" className="ia-nav-item-icon-container-col">
            <span data-name={item.name}  data-id={item.id} className="glyphicon glyphicon-file"></span>
          </div>
          <div data-ui-type="cell" className="ia-nav-item-name-container-col">
            <button onClick={singleClickItem} data-name={item.name} data-id={item.id} className="nav-tree-item tree-node" title={item.name}><span className = "nav-tree-item-header">{item.name}</span>
            </button>
          </div>
          <div data-ui-type="cell" className="ia-nav-item-dsconnect-icon-container-col">
            <span data-name={item.name}  data-id={item.id} className="glyphicon glyphicon-lightning"></span>
          </div>
          <div data-ui-type="cell" className="ia-nav-item-contextmenu-icon-container-col">
            <span data-name={item.name}  data-id={item.id} className="glyphicon glyphicon-contextmenu"></span>
          </div>
        </div>
        );
    });
    return (
      <div>
        <button onClick={clickBranch} data-name="model_root" className="btn btn-default btn-block nav-tree-item tree-branch"  title="Models" >
          <span className={navItemOpenCloseIconClasses}></span>
          <span className="nav-branch-folder-icon glyphicon glyphicon-folder-open"></span>
          <span className="nav-branch-title">Models</span>
        </button>
        <div data-ui-type="table" className={navItemContainerClasses}>
          {rowItems}
        </div>
        <button onClick={addNewInstanceRequest} data-type="model" className="nav-tree-item-addnew"><span className="plus">+</span>Add New Model</button>
      </div>
      );
  }
});
/*
*
*   Datasource Main Nav
*
* */
var IAMainDatasourceNav = (IAMainDatasourceNav = React).createClass({
  openSelectedDataSources:function(key, opt) {
    var that = this;
    that.props.scope.$apply(function () {
      that.props.scope.openSelectedModels();
    });
  },
  createModelsFromDS: function(options) {
    var that = this;
    var x = options;
  },
  deleteSelectedDataSource: function(key, opt) {
    var scope = this.props.scope;

    try{
      if (opt.sourceEvent.currentTarget.attributes['data-id']){
        var dsId = opt.sourceEvent.currentTarget.attributes['data-id'].value;
        scope.$apply(function(){
          scope.deleteDataSourceDefinitionRequest(dsId);
        });
      }
    }
    catch(error) {
      console.warn('error deleting model definition: ' + error);
    }

  },
  componentDidMount:function(){
    var menuItems = {};
    var that = this;
    var currentDSName = null;

    var isDiscoverable = false;

    menuItems.openSelectedModels = {name: "open", callback: this.openSelectedDataSources};

    menuItems.deleteSelectedDataSource = {name: "delete", callback: this.deleteSelectedDataSource};

    $.contextMenu({
      // define which elements trigger this menu
      selector: '.datasource-node',
      // define the elements of the menu
      items: menuItems,
      events: {
        show: function(opt, event) {
          if (opt.sourceEvent.target.attributes['data-name']){
            currentDSName = opt.sourceEvent.target.attributes['data-name'].value;
          }


        }
      }
      // there's more, have a look at the demos and docs...
    });
  },
  render: function() {
    var scope = this.props.scope;

    var cx = React.addons.classSet;

    var clickBranch = function(event) {
      scope.$apply(function () {
        scope.navTreeBranchClicked('datasource');
      });
    };
    var singleClickItem = function(event) {

      if (event.target.attributes['data-id'] || event.target.parentElement.attributes['data-id']){
        var val = '';
        if (event.target.attributes['data-id']) {
          val = event.target.attributes['data-id'].value;
        }
        else {
          val = event.target.parentElement.attributes['data-id'].value;
        }
        scope.$apply(function () {
          scope.navTreeItemClicked('datasource', val, event.metaKey);
        });

      }

    };
    var navItemContainerClasses = cx({
      'ia-tree-node-table branch-leaf-list is-open': scope.dsNavIsVisible,
      'ia-tree-node-table branch-leaf-list is-closed': !scope.dsNavIsVisible
    });
    var navItemOpenCloseIconClasses = cx({
      'nav-branch-openclose-icon glyphicon glyphicon-navbranch-open': scope.dsNavIsVisible,
      'nav-branch-openclose-icon glyphicon glyphicon-navbranch-closed': !scope.dsNavIsVisible
    });
    var navItemsOpenCloseFolderIconClasses = cx({
      'glyphicon glyphicon-folder-open': scope.dsNavIsVisible,
      'glyphicon glyphicon-folder-closed': !scope.dsNavIsVisible
    });
    var addNewInstanceRequest = function(event) {
      if (event.target.attributes['data-type'] || event.target.parentElement.attributes['data-type']){
        var val = '';
        if (event.target.attributes['data-type']) {
          val = event.target.attributes['data-type'].value;
        }
        else {
          val = event.target.parentElement.attributes['data-type'].value;
        }
        scope.$apply(function() {
          scope.createDatasourceViewRequest();
        });
      }
    };

    var rowItems = (<div />);
    if (scope.mainNavDatasources.map) {
      rowItems = scope.mainNavDatasources.map(function(item) {
        var classNameVar = 'tree-item-row ';
        if (item.isActive) {
          classNameVar += ' is-active';
        }
        else if (item.isOpen) {
          classNameVar += ' is-open';
        }
        else if (item.isSelected) {
          classNameVar += ' is-selected'
        }
        return (
          <div data-ui-type="row" className={classNameVar} data-id={item.id} >
            <div data-ui-type="cell" className="ia-nav-item-icon-container-col">
              <span data-name={item.name}  data-id={item.id} className="glyphicon glyphicon-file"></span>
            </div>
            <div data-ui-type="cell" className="ia-nav-item-name-container-col">
              <button onClick={singleClickItem} data-name={item.name} data-id={item.id} className="nav-tree-item tree-node" title={item.name}><span className = "nav-tree-item-header">{item.name}</span>
              </button>
            </div>
            <div data-ui-type="cell" className="ia-nav-item-dsconnect-icon-container-col">
            </div>
            <div data-ui-type="cell" className="ia-nav-item-contextmenu-icon-container-col">
              <span data-name={item.name}  data-id={item.id} className="glyphicon glyphicon-contextmenu"></span>
            </div>

          </div>
          );
      });
    }

    // Main return
    return (
      <div>
        <button onClick={clickBranch} type="button" data-name="datasources_root" className="btn btn-default btn-block nav-tree-item tree-branch" title="Datasources">
          <span className={navItemOpenCloseIconClasses}></span>
          <span className="nav-branch-folder-icon glyphicon glyphicon-folder-open"></span>
          <span className="nav-branch-title">DataSources</span>
        </button>
        <div data-ui-type="table" className={navItemContainerClasses}>
          {rowItems}
        </div>
        <button onClick={addNewInstanceRequest} data-type="datasource" className="nav-tree-item-addnew"><span className="plus">+</span>Add New Datasource</button>
      </div>
      );
  }
});
/*
*
* Main Controls
*
* */
var IAMainControls = (IAMainControls = React).createClass({
  getInitialState: function() {
    return {
      showNewModel: false,
      newModelText: 'new model'
    };
  },
  componentDidMount: function() {
    window.setUI();
  },
  render: function() {
    var that = this;
    var scope = that.props.scope;

    var createModelViewRequest = function() {

      scope.$apply(function() {
        scope.createModelViewRequest();
      });

    };
    var addNewInstanceRequest = function(event) {
      if (event.target.attributes['data-type'] || event.target.parentElement.attributes['data-type']){
        var val = '';
        if (event.target.attributes['data-type']) {
          val = event.target.attributes['data-type'].value;
        }
        else {
          val = event.target.parentElement.attributes['data-type'].value;
        }

        var connector = event.target.attributes['data-name'] ?
          event.target.attributes['data-name'].value :
          event.target.parentElement.attributes['data-name'].value;

        scope.$apply(function() {
          scope.createDatasourceViewRequest({
            connector: connector
          });
        });
      }
    };

    var renderAppViewRequest = function() {
      window.open(
        '/#demo',
        '_blank'
      );

    };
    var showExplorerViewRequest = function() {
      scope.$apply(function() {
        scope.showExplorerViewRequest();
      });
    };
    return (
      <div data-id="IAMainControlsContainer">
        <div className="main-controls-title">Create</div>


        <div className="main-controls-container">

        <div data-ui-type="table">
          <div data-ui-type="row">
            <div data-ui-type="cell">
              <label className="main-control-command-label">MODEL</label>
              <button onClick={createModelViewRequest} type="button" className="btn btn-sm btn-primary">
                <span className="maincontrol-main-icon glyphicon glyphicon-plus-sign"></span>
                <span className="maincontrol-main-button-label">New</span>
              </button>
            </div>
            <div data-ui-type="cell">
              <label className="main-control-command-label">APP</label>
              <button disabled="disabled" onClick={renderAppViewRequest} type="button" className="btn btn-primary btn-sm">
                <span className="maincontrol-main-icon glyphicon glyphicon-play"></span>
                <span className="maincontrol-main-button-label">Render</span>
              </button>
            </div>
          </div>
        </div>


        <label className="main-control-command-label">DATASOURCE</label>
        <div data-ui-type="table">
          <div data-ui-type="row">
            <div data-ui-type="cell">
              <button onClick={addNewInstanceRequest}
                data-type="datasource"
                data-name="oracle"
                className="btn btn-default btn-control-ds"
                title="oracle connector">
                  <span className="glyphicon glyphicon-database"></span>
              </button>
              <div className="ds-type-name">Oracle</div>
            </div>
            <div data-ui-type="cell">
              <button className="btn btn-default btn-control-ds"
                data-type="datasource"
                data-name="mssql"
                onClick={addNewInstanceRequest}
                title="mssql connector">
                  <span className="glyphicon glyphicon-database"></span>
              </button>
              <div className="ds-type-name">MS SQL</div>
            </div>
            <div data-ui-type="cell">
              <button onClick={addNewInstanceRequest}
                data-type="datasource"
                className="btn btn-default btn-control-ds"
                data-name="mysql"
                title="mysql connector">
                  <span className="glyphicon glyphicon-database"></span>
              </button>
              <div className="ds-type-name">MySQL</div>
            </div>
            <div data-ui-type="cell">
              <button onClick={addNewInstanceRequest}
                data-type="datasource"
                className="btn btn-default btn-control-ds"
                data-name="postgres"
                title="postgres connector">
                <span className="glyphicon glyphicon-database"></span>
              </button>
              <div className="ds-type-name">Postgres</div>
            </div>
            <div data-ui-type="cell">
              <button onClick={addNewInstanceRequest}
                data-type="datasource"
                className="btn btn-default btn-control-ds"
                data-name="mongo"
                title="mongodb connector">
                  <span className="glyphicon glyphicon-database"></span>
              </button>
              <div className="ds-type-name">Mongo</div>
            </div>
          </div>
        </div>

        </div>

      </div>
      );
  }
});

