/** @jsx React.DOM */
/*
*
*   Main Nav Container
*
* */
window.GatewayMainNav = (GatewayMainNav = React).createClass({


  render: function() {

    var component = this;

    var scope = this.props.scope;
    var singleClickItem = function(event) {
      if (event.target.attributes['data-id']){
        scope.$apply(function () {
          scope.navTreeItemClicked('root', event.target.attributes['data-id'].value, event.metaKey);
        });
      }
    };
    var projectName = 'Strong Gateway';
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
        <GatewayNav className="ia-model-nav-container" scope={component.props.scope} collection={component.props.scope.gatewayMapCtx.gatewayMaps} type="gatewaymap" />
        <GatewayNav className="ia-model-nav-container" scope={component.props.scope} collection={component.props.scope.pipelineCtx.pipelines} type="pipeline" />
        <GatewayNav className="ia-model-nav-container" scope={component.props.scope} collection={component.props.scope.policyCtx.policies} type="policy" />
      </div>
      );
  }
});
/*
*
*   Model Main Nav
*
* */
var GatewayNav = (GatewayNav = React).createClass({
  getInitialState: function() {
    return {isModelNavContainerOpen:true};
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

    if (event.currentTarget.attributes['data-type']){
      var tVal = event.currentTarget.attributes['data-type'].value;
      if (tVal === 'pipeline') {
        scope.$apply(function() {
          scope.showAddNewPipelineForm();
        });
      }
      if (tVal === 'policy') {
        scope.$apply(function() {
          scope.showAddNewPolicyForm();
        });
      }
      if (tVal === 'gatewaymap') {
        scope.$apply(function() {
          scope.showAddNewGatewayMapForm();
        });
      }


    }

  },
  componentDidMount: function() {
    var component = this;
    var menuItems = {};
    menuItems.deleteSelectedModel = {name: "delete", callback: component.deleteSelectedModel};

  },
  gatewayMainNav: function(key, opt) {
    var scope = this.props.scope;
    scope.$apply(function() {
      scope.setMainNav(key.currentTarget.attributes['data-type'].value);
    });
  },
  render: function() {

    var component = this;
    var scope = component.props.scope;
    var collection = component.props.collection;
    var type = component.props.type;

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

    var navItemContainerClasses = cx({
      'ia-tree-node-table branch-leaf-list model-branch-container is-open': true,
      'ia-tree-node-table branch-leaf-list model-branch-container is-closed': false
    });
    var navItemOpenCloseIconClasses = cx({
      'nav-branch-openclose-icon sl-icon sl-icon-arrow-down': true,
      'nav-branch-openclose-icon sl-icon sl-icon-arrow-right': !false
    });
    var navItemsOpenCloseFolderIconClasses = cx({
      'nav-branch-folder-icon sl-icon sl-icon-folder': true,
      'nav-branch-folder-icon sl-icon sl-icon-folder': !false
    });

    rowItems = [];
    if (collection.map) {
      var rowItems = collection.map(function(item) {
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

        item.configId = item.id;
        var urlString = '/#/gateway/' + type + '/' + item.id;

        return (
          <div data-ui-type="row" className={classNameVar} data-id={item.id}>
            <div data-ui-type="cell" className="ia-nav-item-icon-container-col">
              <span data-name={item.name}  data-id={item.id} className="sl-icon sl-icon-file"></span>
            </div>
            <div data-ui-type="cell" className="ia-nav-item-name-container-col">
              <a className="nav-tree-item tree-node" href={urlString}>{item.name}</a>

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
    }

    function navTitle() {
      if (type === 'gatewaymap') {
        return 'Maps';
      }
      else if (type === 'pipeline') {
        return 'Pipelines';

      }
      else if (type === 'policy') {
        return 'Policies';

      }
      else {
        return  '----';
      }
    }
    return (
      <div>
        <button onClick={component.gatewayMainNav} data-type={type} data-name="model_root" className="btn btn-default btn-block nav-tree-item tree-branch"  title="Models" >
          <span className={navItemOpenCloseIconClasses}></span>
          <span className="nav-branch-folder-icon sl-icon sl-icon-folder"></span>
          <span className="nav-branch-title">{navTitle()}</span>
        </button>
        <div data-ui-type="table" className={navItemContainerClasses}>
          {rowItems}
        </div>
        <button onClick={component.addNewInstanceRequest} data-type={type} className="nav-tree-item-addnew"><span className="plus">+</span>Add New {navTitle()}</button>
      </div>
      );
  }
});
