/** @jsx React.DOM */
var ModelEditorTabsView = React.createClass({
  render: function() {
    var scope = this.props.scope;
    var cx = React.addons.classSet;

    var classes = cx({
      'model-edit-tab-item-container is-active': this.props.isActive,
      'model-edit-tab-item-container': !this.props.isActive
    });

    var clickModelEditTabItem = function(event) {
      if (event.target.attributes['data-name']){
        // test to see if tab not already 'active'
        scope.$apply(function () {
          scope.modelEditTabItemClicked(event.target.attributes['data-name'].value);
        });
      }
    };
    var clickModelEditorTabClose = function(event) {
      if (event.target.attributes['data-name']){
        // test to see if tab not already 'active'
        scope.$apply(function () {
          scope.modelEditTabItemCloseClicked(event.target.attributes['data-name'].value);
        });
      }
    };
    var items = [];
    var iterator;
    if (scope.currentOpenModelNames) {
      iterator = scope.currentOpenModelNames;
    }
    else {
      iterator = scope.$parent.currentOpenModelNames;
    }

    items = this.props.tabItems.map(function(item) {
      return (
        <li className={classes}>
          <button onClick={clickModelEditTabItem} className="model-edit-tab-item-button" data-name={item}>{item}</button>
          <button onClick={clickModelEditorTabClose} className="model-edit-tab-close-button" data-name={item}>
            <span className="glyphicon glyphicon-remove" data-name={item}></span>
          </button>
        </li>
        );
    });

    return (
      <div>
        <ul className="model-editor-tabs-list">{items}</ul>
      </div>
      );
  }
});
/*
*   Model Title Header
* */
ModelTitleHeader = React.createClass({
  render: function() {
    return (
      <span>{this.props.scope.currModel.name}</span>
    );
  }
});
/*
*   Property Comment Editor
* */
PropertyCommentEditor = React.createClass({
  render: function() {
    var scope = this.props.scope;

    var updatePropertyDoc = function(event) {
      scope.$apply(function () {
        scope.property.props.doc = event.target.value;
      });
    };

    return (
        <textarea onChange={updatePropertyDoc} className="model-instance-editor-input">
          {this.props.doc}
        </textarea>
      );
  }
});
/*
* property name editor
* */
PropertyNameEditor = React.createClass({
//  getInitialState: function() {
//   // return {value: this.props.scope.property.name};
//  },
  componentWillRecieveProps: function(nextProps) {
    console.log('next props: ' + nextProps);

  },
  shouldComponentUpdate: function(nextProps, nextState) {

    if (nextProps.name !== nextState.value) {

      return true;
    }
    return false;

  },
  componentWillUpdate: function(nextProps, nextState) {

    console.log('nextState ===' + JSON.stringify(nextProps.name));
    this.setProps({value:nextProps.name});
  },
  render: function() {
    var scope = this.props.scope;
    var value = this.props.name;

    var changeHandler = function(event) {
//      this.setState({'value': event.target.value});
      scope.$apply(function () {
        scope.property.name = event.target.value;
      });
    };
    return (
      <input type="text" value={value} onChange={changeHandler} className="model-instance-editor-input" />

      );
  }
});
var ModelPocketEditorMiscView = React.createClass({
  render: function() {
    return (
      <div data-ui-type="table" className="pocket-editor-table">
        <div data-ui-type="row">
          <div data-ui-type="cell">
            <label>Name</label>

          </div>
          <div data-ui-type="cell" >
            <PropertyNameEditor scope={this.props.scope} />

          </div>
        </div>
        <div data-ui-type="row">
          <div data-ui-type="cell">
            <label>Comments</label>
          </div>
          <div data-ui-type="cell">
            <PropertyCommentEditor scope={this.props.scope} />
          </div>
        </div>
      </div>
      );
  }
});
/*
*   Model Pocket Editor Container
* */
var ModelPocketEditorContainer = React.createClass({
  getInitialState: function() {
    return {
      targetView: 'misc'
    };
  },
  getTargetContent: function() {
    var tView = this.state.targetView;
    var viewFragment = '';
    switch (tView){
      case 'misc':
        viewFragment = (<ModelPocketEditorMiscView scope={this.props.scope} />);

        break;
      case 'id':
        viewFragment = (<PropertyIdEditor scope={this.props.scope} />);

        break;

      case 'validation':
        viewFragment = (<PropertyValidationEditor scope={this.props.scope} />);

        break;

      case 'map':
        viewFragment = (<PropertyMapEditor scope={this.props.scope} />);

        break;

      case 'format':
        viewFragment = (<PropertyFormatEditor scope={this.props.scope} />);

        break;

      default:
        viewFragment = (<ModelPocketEditorMiscView scope={this.props.scope} />);

    }
    return viewFragment;
  },

  pocketEditorTabSelect: function(event) {
    var targetView = event.target.attributes['data-target'].value;
    this.setState({targetView:targetView});
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return true;
  },

  render: function() {
    var scope = this.props.scope;
    var frag = this.getTargetContent();

    return (

      <div collapse="isCollapsed" className="model-details-pocket-editor-container">

        <div>
          <ul className="model-config-tab-list">
            <li>
              <input type="button" data-target="misc" onClick={this.pocketEditorTabSelect} className="btn btn-default btn-sm" value="misc" />
            </li>
            <li>
              <input type="button" data-target="id" onClick={this.pocketEditorTabSelect} className="btn btn-default btn-sm" value="id config" />
            </li>
            <li>
              <input type="button" data-target="validation" onClick={this.pocketEditorTabSelect} className="btn btn-default btn-sm" value="validation" />
            </li>
            <li>
              <input type="button" data-target="format" onClick={this.pocketEditorTabSelect} className="btn btn-default btn-sm" value="format" />
            </li>
            <li>
              <input type="button" data-target="map" onClick={this.pocketEditorTabSelect} className="btn btn-default btn-sm" value="map" />
            </li>
          </ul>
        </div>
        <div className="tab-box-body">
        {frag}
        </div>


      </div>

      );
  }
});
   /*
*   Property Connection Editor
* */
PropertyConnectionEditor = React.createClass({
  render: function() {
    var scope = this.props.scope;
    return (
      <div>
        <h4>Connection</h4>
        <label>target model</label>
        <input type="text"
                placeholder="search models" />
        <label>target property</label>
        <input type="text" placeholder="search properties" />
      </div>
    );
  }
});

/*
* ModelPropertyPocketEditor
* */
ModelPropertyPocketEditor = React.createClass({
  render: function() {
    return (
      <div className="model-pocket-editor-container">
        <div className="model-pocket-editor-tab-container">

          <div>
            <PropertyIdEditor />
            <PropertyValidationEditor />
            <PropertyMapEditor />
          </div>

        </div>
      </div>
      );
  }
});

/*
*   Model Detail Editor
* */
ModelDetailEditor = React.createClass({

  render: function() {
    var cx = React.addons.classSet;

    var classes = cx({
      'row is-open': this.props.scope.isModelInstanceBasePropertiesActive,
      'row is-closed': !this.props.scope.isModelInstanceBasePropertiesActive
    });

    var clickHandler = this.props.scope.$apply.bind(this.props.scope, this.props.scope.toggleModelDetailView.bind(null, 0));

    return (
      <div className="container-fluid">
        <input onClick={clickHandler} type="button" className="model-instance-header-btn btn btn-default btn-block" value="Details" />
        <div className={classes}>
          <div className="col-xs-6">
            <div data-ui-type="table" >
              <div data-ui-type="row">
                <div data-ui-type="cell">
                  <label>plural</label>
                </div>
                <div data-ui-type="cell">
                  <input type="text" value={this.props.scope.activeModelInstance.plural} className="model-instance-editor-input" ng-model={this.props.scope.activeModelInstance.plural} />
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell">
                  <label>datasource</label>
                </div>
                <div data-ui-type="cell">
                  <input type="text" className="model-instance-editor-input" value={this.props.scope.activeModelInstance.dataSource} />
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell">
                  <label>base model</label>
                </div>
                <div data-ui-type="cell">
                  <input type="text" className="model-instance-editor-input" ng-model="currProperty.options.base" />
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell"><label>public</label></div>
                <div data-ui-type="cell">
                  <input type="checkbox" className="model-instance-editor-input" value={this.props.scope.activeModelInstance.public} />
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell"><label>strict</label></div>
                <div data-ui-type="cell">
                  <input type="checkbox" className="model-instance-editor-input" ng-model="currProperty.strict" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-6">
            <div data-ui-type="table" >
              <div data-ui-type="row">
                <div data-ui-type="cell">
                <label>Indexes</label>
                </div>
                <div data-ui-type="cell">
                  <input type="button" value="edit" className="btn btn-default" />
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell">
                  <label>Scopes</label>
                </div>
                <div data-ui-type="cell">
                  <input type="button" value="edit" className="btn btn-default" />
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell">
                  <label>Access Control</label>
                </div>
                <div data-ui-type="cell">
                  <input type="button" value="edit" className="btn btn-default" />
                </div>
              </div>

            </div>
          </div>


        </div>
      </div>
      );
  }
});
