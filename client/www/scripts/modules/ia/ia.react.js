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
    var projectName = scope.projectName || '(unknown project)';
    return (
      <div>
        <div className="ia-project-title-header-container" >
          <div className="ia-project-nav-help">
            <a target="_blank" href="http://docs.strongloop.com/display/ARC/StrongLoop+Arc">
              <span id="mainNavContextHelp" data-id="MainNavContextHelp" className="sl-icon sl-icon-question-mark"></span>
            </a>
          </div>
          <span className="ia-project-title-container">{projectName}</span>
        </div>
        <IAMainModelNav className="ia-model-nav-container" scope={this.props.scope} />
        <IAMainDatasourceNav className="ia-datasource-nav-container" scope={this.props.scope} />
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
  getInitialState: function() {
    return {isModelNavContainerOpen:true};
  },
  openSelectedModels:function(key, opt) {
    var component = this;
    if (opt.sourceEvent.currentTarget.attributes['data-id']) {
      var modelid = opt.sourceEvent.currentTarget.attributes['data-id'].value;
      component.props.scope.$apply(function () {
        component.props.scope.openSelectedInstance(modelid, CONST.MODEL_TYPE);
      });
    }
  },
  deleteSelectedModel: function(key, opt) {
    var scope = this.props.scope;
    try{
      var targetAttributes = opt.sourceEvent.currentTarget.attributes;
      if (targetAttributes['data-id']) {
        var definitionId = targetAttributes['data-id'].value;
        var configId = targetAttributes['data-config-id'] && targetAttributes['data-config-id'].value;
        var instanceId = {
          definitionId: definitionId,
          configId: configId
        };

        scope.$apply(function(){
          scope.deleteInstanceRequest(instanceId, CONST.MODEL_TYPE);
        });
      } else {
        console.warn('Missing some of the required model attributes.');
      }
    }
    catch(error) {
      console.warn('error deleting model definition: ' + error);
    }
  },
  addNewInstanceRequest: function(event) {
    var scope = this.props.scope;
    scope.$apply(function() {
      scope.createModelViewRequest();
    });
  },
  componentDidMount: function() {
    var component = this;
    var menuItems = {};
    var currentDSName = null;
    var isDiscoverable = false;

//    menuItems.openSelectedModels = {name: "open", callback: component.openSelectedModels};
    menuItems.deleteSelectedModel = {name: "delete", callback: component.deleteSelectedModel};

    $.contextMenu({
      // define which elements trigger this menu
      selector: '.btn-nav-context',
      trigger: 'left',
      // define the elements of the menu
      items: menuItems,
      events: {
        show: function(opt, event) {
          if (opt.sourceEvent.target.attributes['data-name']){
            currentDSName = opt.sourceEvent.target.attributes['data-name'].value;
          }
        }
      }
    });
  },
  toggleModelNav: function() {
    $('.model-branch-container').toggle(250);
    var currState = this.state.isModelNavContainerOpen;
    this.setState({isModelNavContainerOpen:!currState});
  },
  render: function() {

    var component = this;
    var scope = component.props.scope;

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
    var navModels = [];
    if (Array.isArray(scope.mainNavModels)) {
      navModels = scope.mainNavModels;
    }
    var navItemContainerClasses = cx({
      'ia-tree-node-table branch-leaf-list model-branch-container is-open': scope.modelNavIsVisible,
      'ia-tree-node-table branch-leaf-list model-branch-container is-closed': !scope.modelNavIsVisible
    });
    var navItemOpenCloseIconClasses = cx({
      'nav-branch-openclose-icon sl-icon sl-icon-arrow-down': component.state.isModelNavContainerOpen,
      'nav-branch-openclose-icon sl-icon sl-icon-arrow-right': !component.state.isModelNavContainerOpen
    });
    var navItemsOpenCloseFolderIconClasses = cx({
      'nav-branch-folder-icon sl-icon sl-icon-folder': scope.modelNavIsVisible,
      'nav-branch-folder-icon sl-icon sl-icon-folder': !scope.modelNavIsVisible
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
      var dsConnectEl = (<span />);
      // TODO - SEAN fix this bug - it needs to reference 'config' for dataSource
      if (item.dataSource && (item.dataSource !== CONST.DEFAULT_DATASOURCE )) {
        dsConnectEl = (<span data-name={item.name}  data-id={item.id} className="sl-icon sl-icon-lightning"></span>);
      }
      item.configId = item.config && item.config.id;

      return (
        <div data-ui-type="row" className={classNameVar} data-id={item.id}>
          <div data-ui-type="cell" className="ia-nav-item-icon-container-col">
            <span data-name={item.name}  data-id={item.id} className="sl-icon sl-icon-file"></span>
          </div>
          <div data-ui-type="cell" className="ia-nav-item-name-container-col">
            <button onClick={singleClickItem} data-name={item.name} data-id={item.id} className="nav-tree-item tree-node" title={item.name}><span className = "nav-tree-item-header">{item.name}</span>
            </button>
          </div>
          <div data-ui-type="cell" className="ia-nav-item-dsconnect-icon-container-col">
            {dsConnectEl}
          </div>
          <div data-ui-type="cell" className="ia-nav-item-contextmenu-icon-container-col">
            <button className="btn-command btn-nav-context" data-id={item.id} data-config-id={item.configId}>
              <span data-name={item.name} data-id={item.id} data-config-id={item.configId} className="sl-icon sl-icon-box-arrow-down"></span>
            </button>
          </div>
        </div>
        );
    });
    return (
      <div>
        <button onClick={component.toggleModelNav} data-name="model_root" className="btn btn-default btn-block nav-tree-item tree-branch"  title="Models" >
          <span className={navItemOpenCloseIconClasses}></span>
          <span className="nav-branch-folder-icon sl-icon sl-icon-folder"></span>
          <span className="nav-branch-title">Models</span>
        </button>
        <div data-ui-type="table" className={navItemContainerClasses}>
          {rowItems}
        </div>
        <button onClick={component.addNewInstanceRequest} data-type="model" className="nav-tree-item-addnew"><span className="plus">+</span>Add New Model</button>
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
  getInitialState: function() {
    return {isDataSourceNavContainerOpen:true};
  },
  openSelectedDataSource:function(key, opt) {
    var component = this;
    if (opt.sourceEvent.currentTarget.attributes['data-id']) {
      var dsId = opt.sourceEvent.currentTarget.attributes['data-id'].value;
      component.props.scope.$apply(function () {
        component.props.scope.openSelectedInstance(dsId, CONST.DATASOURCE_TYPE);
      });
    }
  },
  addNewInstanceRequest: function(event) {
    var scope = this.props.scope;
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
  },
  deleteSelectedDataSource: function(key, opt) {
    var scope = this.props.scope;

    try{
      if (opt.sourceEvent.currentTarget.attributes['data-id']){
        var dsIdConfig = {
          definitionId: opt.sourceEvent.currentTarget.attributes['data-id'].value
        };
        scope.$apply(function(){
          scope.deleteInstanceRequest(dsIdConfig, CONST.DATASOURCE_TYPE);
        });
      }
    }
    catch(error) {
      console.warn('error deleting model definition: ' + error);
    }

  },
  componentDidMount:function(){
    var menuItems = {};
    var component = this;
    var isDiscoverable = false;

    /*
     * Note createModelsFromDS must be the first menu item in the menu
     * to allow control whether it is visible or not.  If you want to adjust
     * the order of the menu items you must take into account
     * See the show event below
     * */
    menuItems.createModelsFromDS = {
      name: "discover models",
      disabled: function(key, opt) {
        if (opt.sourceEvent.target.attributes['data-is-discoverable']) {
          isDiscoverable = opt.sourceEvent.target.attributes['data-is-discoverable'].value;
        }
        else if (opt.sourceEvent.target.parentElement.attributes['data-name']){
          isDiscoverable = opt.sourceEvent.target.parentElement.attributes['data-is-discoverable'].value;
        }
        if (isDiscoverable === 'true') {
          return false;
        }
        return true;
      },
      callback: function(key, opt) {
        var dsId = '';
        if (opt.sourceEvent.target.attributes['data-id']) {
          dsId = opt.sourceEvent.target.attributes['data-id'].value;
        }
        // check the parent element
        else if (opt.sourceEvent.target.parentElement.attributes['data-id']){
          dsId = opt.sourceEvent.target.parentElement.attributes['data-id'].value;
        }
        if (dsId){
          component.props.scope.$apply(function () {

            component.props.scope.createModelsFromDS(dsId);
          });
        }

      }
    };
    menuItems.deleteSelectedDataSource = {name: "delete", callback: component.deleteSelectedDataSource};

    $.contextMenu({
      // define which elements trigger this menu
      selector: '.btn-ds-nav-context',
      trigger: 'left',
      // define the elements of the menu
      items: menuItems,
      events: {
        show: function(opt) {
          if (opt.sourceEvent.target.attributes['data-is-discoverable']) {
            var isDiscoverable = JSON.parse(opt.sourceEvent.target.attributes['data-is-discoverable'].value);
            // note the order of menu items to target not showing discover item on
            // ds types that don't support it.
            // show by default (in case it was turned off by another item as it is shared
            $('.context-menu-list li:first-child').show();
            if (!isDiscoverable) {
              $('.context-menu-list li:first-child').hide();
            }
          }
        }
      }
    });
  },
  toggleDataSourceNav: function() {
    $('.datasource-branch-container').toggle(250);
    var currState = this.state.isDataSourceNavContainerOpen;
    this.setState({isDataSourceNavContainerOpen:!currState});
  },
  render: function() {
    var component = this;
    var scope = component.props.scope;

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
      'ia-tree-node-table branch-leaf-list datasource-branch-container is-open': scope.dsNavIsVisible,
      'ia-tree-node-table branch-leaf-list datasource-branch-container is-closed': !scope.dsNavIsVisible
    });
    var navItemOpenCloseIconClasses = cx({
      'nav-branch-openclose-icon sl-icon sl-icon-arrow-down': component.state.isDataSourceNavContainerOpen,
      'nav-branch-openclose-icon sl-icon sl-icon-arrow-right': !component.state.isDataSourceNavContainerOpen
    });
    var navItemsOpenCloseFolderIconClasses = cx({
      'sl-icon sl-icon-folder-open': scope.dsNavIsVisible,
      'sl-icon sl-icon-folder-closed': !scope.dsNavIsVisible
    });


    var rowItems = (<div />);
    if (scope.mainNavDatasources.map) {
      rowItems = scope.mainNavDatasources.map(function(item) {

        var isDiscoverable = false;
        if (item.isDiscoverable) {
          isDiscoverable = item.isDiscoverable;
        }
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
              <span data-name={item.name}  data-id={item.id} className="sl-icon sl-icon-file"></span>
            </div>
            <div data-ui-type="cell" className="ia-nav-item-name-container-col">
              <button onClick={singleClickItem} data-name={item.name} data-id={item.id} className="nav-tree-item tree-node" title={item.name}><span className = "nav-tree-item-header">{item.name}</span>
              </button>
            </div>
            <div data-ui-type="cell" className="ia-nav-item-dsconnect-icon-container-col">
            </div>
            <div data-ui-type="cell" className="ia-nav-item-contextmenu-icon-container-col">
              <button className="btn-command btn-ds-nav-context" data-is-discoverable={isDiscoverable} data-id={item.id}>
                <span data-name={item.name}  data-id={item.id} className="sl-icon sl-icon-box-arrow-down"></span>
              </button>
            </div>

          </div>
          );
      });
    }

    // Main return
    return (
      <div>
        <button onClick={component.toggleDataSourceNav} type="button" data-name="datasources_root" className="btn btn-default btn-block nav-tree-item tree-branch" title="Datasources">
          <span className={navItemOpenCloseIconClasses}></span>
          <span className="nav-branch-folder-icon sl-icon sl-icon-folder"></span>
          <span className="nav-branch-title">Data Sources</span>
        </button>
        <div data-ui-type="table" className={navItemContainerClasses}>
          {rowItems}
        </div>
        <button onClick={component.addNewInstanceRequest} data-type="datasource" className="nav-tree-item-addnew"><span className="plus">+</span>Add New Data Source</button>
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
    var component = this;
    return {
      showNewModel: false,
      newModelText: 'new model'
    };
  },
  componentDidMount: function() {

    window.setUI();
  },
  componentWillReceiveProps: function(nextProps) {
    var component = this;
  },
  render: function() {
    var component = this;
    var scope = component.props.scope;
    var cx = React.addons.classSet;

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

    return (
      <div data-id="IAMainControlsContainer">
        <div className="main-controls-title">Create</div>

        <div className="main-controls-container">
          <div data-ui-type="table">
            <div data-ui-type="row">
              <div data-ui-type="cell">
                <label className="main-control-command-label">MODEL</label>
                <button onClick={createModelViewRequest} type="button" className="btn btn-primary btn-fullsize">
                  <span className="maincontrol-main-icon sl-icon sl-icon-plus-sign"></span>
                  <span className="maincontrol-main-button-label">New</span>
                </button>
              </div>
              <div data-ui-type="cell" className="main-control-apprender-container">

              </div>
            </div>
          </div>


          <label className="main-control-command-label">DATA SOURCE</label>
          <div data-ui-type="table">
            <div data-ui-type="row">
              <div data-ui-type="cell">
                <button onClick={addNewInstanceRequest}
                  data-type="datasource"
                  data-name="oracle"
                  className="btn btn-default btn-control-ds"
                  title="oracle connector">
                    <span className="sl-icon sl-icon-database"></span>
                </button>
                <div className="ds-type-name">Oracle</div>
              </div>
              <div data-ui-type="cell">
                <button className="btn btn-default btn-control-ds"
                  data-type="datasource"
                  data-name="mssql"
                  onClick={addNewInstanceRequest}
                  title="mssql connector">
                    <span className="sl-icon sl-icon-database"></span>
                </button>
                <div className="ds-type-name">MS SQL</div>
              </div>
              <div data-ui-type="cell">
                <button onClick={addNewInstanceRequest}
                  data-type="datasource"
                  className="btn btn-default btn-control-ds"
                  data-name="mysql"
                  title="mysql connector">
                    <span className="sl-icon sl-icon-database"></span>
                </button>
                <div className="ds-type-name">MySQL</div>
              </div>
              <div data-ui-type="cell">
                <button onClick={addNewInstanceRequest}
                  data-type="datasource"
                  className="btn btn-default btn-control-ds"
                  data-name="postgresql"
                  title="postgres connector">
                  <span className="sl-icon sl-icon-database"></span>
                </button>
                <div className="ds-type-name">PostgreSQL</div>
              </div>
              <div data-ui-type="cell">
                <button onClick={addNewInstanceRequest}
                  data-type="datasource"
                  className="btn btn-default btn-control-ds"
                  data-name="mongodb"
                  title="mongodb connector">
                    <span className="sl-icon sl-icon-database"></span>
                </button>
                <div className="ds-type-name">MongoDB</div>
              </div>
            </div>
          </div>

        </div>

      </div>
      );
  }
});
