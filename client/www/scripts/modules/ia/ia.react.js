/** @jsx React.DOM */
var IAMainModelNav = React.createClass({

  render: function() {
    var scope = this.props.scope;

    var cx = React.addons.classSet;

    var classes = cx({
      'branch-leaf-list is-open': this.props.scope.isModelsActive,
      'branch-leaf-list is-closed': !this.props.scope.isModelsActive
    });

    var clickBranch = function(event) {
      if (event.target.attributes['data-name']){
        scope.$apply(function () {
          scope.navTreeBranchClicked('model');
        });
      }
   };

    var singleClickItem = function(event) {
      if (event.target.attributes['data-name']){
        scope.$apply(function () {
          scope.navTreeItemClicked('model', event.target.attributes['data-name'].value, event.metaKey);
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

    var items = scope.mainNavModels.map(function(item) {
      return (<li><button onDoubleClick={dblClickItem} onClick={singleClickItem} data-name={item.name} className="btn btn-default btn-block nav-tree-item tree-node">{item.name}</button></li>);
    });
    return (
      <div>
        <input onClick={clickBranch} data-name="model_root" className="btn btn-default btn-block nav-tree-item tree-branch" type="button" value="Models" />
        <ul className={classes}>{items}</ul>
      </div>
      );
  }
});
var IAMainDatasourceNav = React.createClass({

  render: function() {
    var scope = this.props.scope;

    var cx = React.addons.classSet;

    var classes = cx({
      'branch-leaf-list is-open': this.props.scope.isDataSourcesActive,
      'branch-leaf-list is-closed': !this.props.scope.isDataSourcesActive
    });
    var clickBranch = function(event) {
      if (event.target.attributes['data-name']){
        scope.$apply(function () {
          scope.navTreeBranchClicked('datasource');
        });
      }
    };
    var singleClickItem = function(event) {
      if (event.target.attributes['data-name']){
        scope.$apply(function () {
          scope.navTreeItemClicked('datasource', event.target.attributes['data-name'].value, event.metaKey);
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

    var items = scope.mainNavDatasources.map(function(item) {
      return (<li><button onDoubleClick={dblClickItem} onClick={singleClickItem} data-name={item.name} className="btn btn-default btn-block nav-tree-item tree-node">{item.name}</button></li>);
    });
    return (
      <div>
        <input onClick={singleClickItem} type="button" data-name="datasources_root" className="btn btn-default btn-block nav-tree-item tree-branch" value="Datasources" />
        <ul className={classes}>{items}</ul>
      </div>
      );
  }
});
/*
*
* Master Nav Container
*
* */
var IAMainNavContainer = React.createClass({
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
