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
      if (event.target.attributes['data-name']){
        scope.$apply(function () {
          scope.navTreeItemClicked('root', event.target.attributes['data-name'].value, event.metaKey);
        });
      }
    };
    return (
      <div>
        <button data-name="ia_root"  onClick={singleClickItem} className="btn btn-default btn-block nav-tree-item nav-tree-root tree-root">strongloop-api-studio</button>
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
  componentDidMount:function(){
    var menuItems = {};
    menuItems.openSelectedModels = {name: "open", callback: this.openSelectedModels};
    $.contextMenu({
      // define which elements trigger this menu
      selector: ".model-node",
      // define the elements of the menu
      items: menuItems,
      events: {
        show: function(opt, event) {

        }
      }
    });
  },
  render: function() {

    var scope = this.props.scope;

    var modelSelectedCollection = [];
    var cx = React.addons.classSet;


    var clickBranch = function(event) {
      if (event.target.attributes['data-name']){
        scope.$apply(function () {
          scope.navTreeBranchClicked('model');
        });
      }
    };

    var singleClickItem = function(event) {
      if (event.target.attributes['data-name']){
        var clickModelName = event.target.attributes['data-name'].value;
        scope.$apply(function () {
          scope.navTreeItemClicked('model', clickModelName, event.metaKey);
        });
      }
    };
    var dblClickItem = function(event) {
      if (event.target.attributes['data-name']){
        scope.$apply(function () {
          scope.navTreeItemDblClicked('model', event.target.attributes['data-name'].value);
        });
      }
    };

    var navModels = [];
    if (Array.isArray(scope.mainNavModels)) {
      navModels = scope.mainNavModels;
    }
    var items = navModels.map(function(item) {
      var classNameVar = 'model-node ';
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
        <li className={classNameVar}>
          <button onDoubleClick={dblClickItem} onClick={singleClickItem} data-name={item.name} className="btn btn-default btn-block nav-tree-item tree-node">{item.name}</button>
        </li>
        );
    });
    return (
      <div>
        <input onClick={clickBranch} data-name="model_root" className="btn btn-default btn-block nav-tree-item tree-branch" type="button" value="Models" />
        <ul className="branch-leaf-list is-open">{items}</ul>
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
  openSelectedModels:function(key, opt) {
    var that = this;
    that.props.scope.$apply(function () {
      that.props.scope.openSelectedModels();
    });
  },
  createModelsFromDS: function(options) {
    var that = this;
    var x = options;

  },
  componentDidMount:function(){
    var menuItems = {};
    var that = this;
    var currentDSName = null;

    var isDiscoverable = false;

    menuItems.openSelectedModels = {name: "open", callback: this.openSelectedModels};
    menuItems.createModelsFromDS = {
      name: "create models",
      disabled: function(key, opt) {
        isDiscoverable = opt.sourceEvent.target.attributes['data-is-discoverable'].value;
        if (isDiscoverable == 'true') {
          return false;
        }
        return true;
      },
      callback: function(key, opt) {
        console.log('||  ' + opt.sourceEvent.target.attributes['data-name'].value);
        var dsName = opt.sourceEvent.target.attributes['data-name'].value;
        if (dsName){
          that.props.scope.$apply(function () {

            that.props.scope.createModelsFromDS(dsName);
          });
        }

      }
    };


    $.contextMenu({
      // define which elements trigger this menu
      selector: '.datasource-node',
      // define the elements of the menu
      items: menuItems,
      events: {
        show: function(opt, event) {
          currentDSName = opt.sourceEvent.target.attributes['data-name'].value;

        }
      }
      // there's more, have a look at the demos and docs...
    });
  },
  render: function() {
    var scope = this.props.scope;

    var cx = React.addons.classSet;

    var clickBranch = function(event) {
      if (event.target.attributes['data-name']){
        scope.$apply(function () {
     //     scope.navTreeBranchClicked('datasource');
        });
      }
    };
    var singleClickItem = function(event) {
      if (event.target.attributes['data-name']){
        var clickDSName = event.target.attributes['data-name'].value;
        scope.$apply(function () {
          scope.navTreeItemClicked('datasource', clickDSName, event.metaKey);
        });
      }
    };
    var dblClickItem = function(event) {
      if (event.target.attributes['data-name']){
        scope.$apply(function () {
          scope.navTreeItemDblClicked('datasource', event.target.attributes['data-name'].value);
        });
      }
    };

    // Datasource menu items
    var datasourceItemRenderer = function(item) {

      var isDiscoverable = false;
      if (item.isDiscoverable) {
        isDiscoverable = item.isDiscoverable;
      }
      var classNameVar = 'datasource-node';
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
        <li key={item.name} className={classNameVar}>
          <button onDoubleClick={dblClickItem} data-is-discoverable={isDiscoverable} onClick={singleClickItem} data-name={item.name} className="btn btn-default btn-block nav-tree-item tree-node">{item.name}</button>
        </li>);
    };
    // Main return
    return (
      <div>
        <input onClick={clickBranch} type="button" data-name="datasources_root" className="btn btn-default btn-block nav-tree-item tree-branch" value="Datasources" />
        <ul className="branch-leaf-list is-open">{scope.mainNavDatasources.map(datasourceItemRenderer)}</ul>
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
//      scope.$apply(function() {
//        scope.createModelViewRequest();
//      });
      console.log('||  CREATE NEW MODEL');

//      var oldNewModelState = that.state.showNewModel;
//      var newModelText = that.state.newModelText;
//      var newState = !oldNewModelState;
//      if (newState === true) {
//        newModelText = 'cancel';
//      }
//      else {
//        newModelText = 'new model';
//      }
//      that.setState({
//        showNewModel:newState,
//        newModelText: newModelText
//      });

    };

    var renderAppViewRequest = function() {
      window.open(
        '/#uiform',
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
        <button onClick={createModelViewRequest} type="button" className="btn btn-sm btn-default">
        {that.state.newModelText}
        </button>
        <button onClick={renderAppViewRequest} type="button" className="btn btn-default btn-sm">
        Render App
        </button>
        <button className="btn btn-default btn-sm" onClick={showExplorerViewRequest}>Explorer</button>
        <div>New datasource</div>
        <div data-ui-type="table">
          <div data-ui-type="row">
            <div data-ui-type="cell">
              <button className="btn btn-default btn-control-ds" title="oracle connector">ocl</button>
            </div>
            <div data-ui-type="cell">
              <button className="btn btn-default btn-control-ds" title="mssql connector">msq</button>
            </div>
            <div data-ui-type="cell">
              <button className="btn btn-default btn-control-ds" title="mysql connector">myq</button>
            </div>
            <div data-ui-type="cell">
              <button className="btn btn-default btn-control-ds" title="postgres connector">pst</button>
            </div>
            <div data-ui-type="cell">
              <button className="btn btn-default btn-control-ds" title="mongodb connector">mngo</button>
            </div>
          </div>
        </div>
      </div>
      );
  }
});

