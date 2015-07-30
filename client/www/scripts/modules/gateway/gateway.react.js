/** @jsx React.DOM */
/*
*
*   Main Nav Container
*
* */
var GatewayMainNav = (GatewayMainNav = React).createClass({
  render: function() {
    var component = this;
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
        <GatewayNav className="ia-model-nav-container" rscope={component.props.rootScope} scope={component.props.scope} collection={component.props.scope.gatewayMapCtx.gatewayMaps} type="gatewaymap" />
        <GatewayNav className="ia-model-nav-container" rscope={component.props.rootScope} scope={component.props.scope} collection={component.props.scope.pipelineCtx.pipelines} type="pipeline" />
        <GatewayNav className="ia-model-nav-container" rscope={component.props.rootScope} scope={component.props.scope} collection={component.props.scope.policyCtx.policies} type="policy" />
      </div>
      );
  }
});
/*
*
*   Gateway Entity Branch Nav
*
* */
var GatewayNav = (GatewayNav = React).createClass({
  deleteSelectedInstance: function(key, opt) {
    if (confirm('delete instance?')) {
      var scope = this.props.scope;
      var rootScope = this.props.rscope;
      try{
        var targetAttributes = opt.sourceEvent.currentTarget.attributes;
        if (targetAttributes['data-id']) {
          var instanceId = targetAttributes['data-id'].value;
          var type = targetAttributes['data-type'].value;

          if (type && instanceId) {
            rootScope.$apply(function(){
              scope.deleteInstanceRequest(instanceId, type);
            });
          }
        } else {
          console.warn('Missing some of the required attributes.');
        }
      }
      catch(error) {
        console.warn('error deleting model definition: ' + error);
      }
    }
  },
  cloneSelectedInstance: function(key, opt) {
    var scope = this.props.scope;
    var rootScope = this.props.rscope;

   // if (confirm('clone instance?')) {

      try{
        var targetAttributes = opt.sourceEvent.currentTarget.attributes;
        if (targetAttributes['data-id']) {
          var instanceId = targetAttributes['data-id'].value;
          var type = targetAttributes['data-type'].value;
          var name = targetAttributes['data-name'].value;

          if (type && instanceId) {
            var cloneConfig = {
              id: instanceId,
              type: type,
              name: name
            };
          //  var scope = component.props.scope;
            rootScope.$apply(function(){
              console.log('DEBUG - clone react');
              scope.cloneInstanceRequest(cloneConfig);
            });
          }
        } else {
          console.warn('Missing some of the required attributes.');
        }
      }
      catch(error) {
        console.warn('error cloning instancw definition: ' + error);
      }
//    }

  },
  addNewInstanceRequest: function(event) {
    var scope = this.props.scope;
    var rootScope = this.props.rscope;

    if (event.currentTarget.attributes['data-type']){
      var tVal = event.currentTarget.attributes['data-type'].value;
      if (tVal === 'pipeline') {
        rootScope.$apply(function() {
          scope.showAddNewPipelineForm();
        });
      }
      if (tVal === 'policy') {
        scope.$apply(function() {
          scope.showAddNewPolicyForm();
        });
      }
      if (tVal === 'gatewaymap') {
        rootScope.$apply(function() {
          scope.showAddNewGatewayMapForm();
        });
      }


    }

  },
  componentDidMount:function(){
    var tscope = this.props.scope;
    var rootScope = this.props.rscope;

    var menuItems = {};
    var component = this;


    /*
    * Context Menu
    * */
    menuItems.cloneSelectedInstance = {name: "clone", callback: component.cloneSelectedInstance};
    menuItems.deleteSelectedInstance = {name: "delete", callback: component.deleteSelectedInstance};

    $.contextMenu({
      // define which elements trigger this menu
      selector: '.btn-nav-context',
      trigger: 'left',
      // define the elements of the menu
      items: menuItems,
      events: {
        show: function(opt) {
        }
      }
    });
  },
  gatewayMainNav: function(key, opt) {
    var scope = this.props.scope;
    var rootScope = this.props.scope;
    var id = '';
    var baseNav = key.currentTarget.attributes['data-type'].value;
    if (key.currentTarget.attributes['data-id']) {
      id = key.currentTarget.attributes['data-id'].value;
    }
    rootScope.$apply(function() {
      scope.setMainNav(baseNav, id);
    });
  },
  render: function() {

    var component = this;
    var scope = component.props.scope;
    var rootScope = this.props.rscope;
    var collection = component.props.collection;
    var type = component.props.type;

    var cx = React.addons.classSet;

    var navItemContainerClasses = cx({
      'ia-tree-node-table branch-leaf-list model-branch-container is-open': true,
      'ia-tree-node-table branch-leaf-list model-branch-container is-closed': false
    });
    var navItemOpenCloseIconClasses = cx({
      'nav-branch-openclose-icon sl-icon sl-icon-arrow-down': true,
      'nav-branch-openclose-icon sl-icon sl-icon-arrow-right': !false
    });

    rowItems = [];
    // Instances
    if (collection.map) {
      var rowItems = collection.map(function(item) {

        if (scope.gatewayCtx.currentInstanceId === item.id) {
          item.isActive = true;
        }

        var cssClassIcon = 'sl-icon sl-icon-file';
        if (type === 'policy') {
          switch(item.type) {
            case 'auth' :
              cssClassIcon = 'sl-icon sl-icon-lightning';
              break;

            case 'ratelimiting' :
              cssClassIcon = 'sl-icon sl-icon-logo';
              break;

            case 'metrics' :
              cssClassIcon = 'sl-icon sl-icon-link';
              break;

            case 'reverseproxy' :
              cssClassIcon = 'sl-icon sl-icon-file';
              break;

            default:


          }

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
        var dsConnectEl = (<span />);

        item.configId = item.id;
        var urlString = '/#/gateway/' + type + '/' + item.id;

        return (
          <div data-ui-type="row" className={classNameVar} data-id={item.id}>
            <div data-ui-type="cell" className="ia-nav-item-icon-container-col">
              <span data-name={item.name} title={item.type}  data-id={item.id} className={cssClassIcon}></span>
            </div>
            <div data-ui-type="cell" className="ia-nav-item-name-container-col">
              <button data-name={item.name} data-id={item.id} data-type={type} className="nav-tree-item tree-node" onClick={component.gatewayMainNav}>{item.name}</button>
            </div>
            <div data-ui-type="cell" className="ia-nav-item-dsconnect-icon-container-col">
            {dsConnectEl}
            </div>
            <div data-ui-type="cell" className="ia-nav-item-contextmenu-icon-container-col">
              <button className="btn-command btn-nav-context" data-name={item.name} data-id={item.id} data-type={type}>
                <span data-name={item.name} data-id={item.id} data-type={type} className="sl-icon sl-icon-box-arrow-down"></span>
              </button>
            </div>
          </div>
        );
      });
    }

    var rowClass = 'btn btn-default btn-block nav-tree-item tree-branch';
    if (!scope.gatewayCtx.currentInstanceId) {
      if (type === scope.gatewayCtx.currentView) {
        rowClass = rowClass + ' is-active';
      }
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
    // nav branch sections
    return (
      <div>
        <button onClick={component.gatewayMainNav} data-type={type} data-name="model_root" className={rowClass}  title={navTitle()} >
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
