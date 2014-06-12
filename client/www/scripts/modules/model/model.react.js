/** @jsx React.DOM */
/*
 *   Model Title Header
 * */
ModelTitleHeader = React.createClass({
  render: function() {
    return (
      <span>{this.props.scope.activeModelInstance.name}</span>
      );
  }
});
var ModelEditorTabsView = React.createClass({
  render: function() {
    var scope = this.props.scope;
    var cx = React.addons.classSet;



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
      var classNameVar = 'model-edit-tab-item-container';
      if (item.isActive) {
        classNameVar += ' is-active';
      }

      return (
        <li className={classNameVar}>
          <button onClick={clickModelEditTabItem} className="model-edit-tab-item-button" data-name={item.name}>{item.name}</button>
          <button onClick={clickModelEditorTabClose} className="model-edit-tab-close-button" data-name={item.name}>
            <span className="glyphicon glyphicon-remove" data-name={item.name}></span>
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
 *
 *   MODEL PROPERTIES
 *
 *
 * */
var ModelPropertiesEditor = React.createClass({

  getInitialState: function() {
    return {isOpen:false};
  },
  shouldComponentUpdate: function(nextProps, nextState) {

    // return this.state.isOpen !== nextState.isOpen;
    return true;
  },

  render: function() {

    var that = this;

    var scope = this.props.scope;
    var properties = this.props.properties;
    var cx = React.addons.classSet;

//    if (this.props.uiState) {
//      if (this.props.uiState.isOpen) {
//        this.setState({isOpen:isOpen});
//      }
//    }




    var classes = cx({
      'row is-open': this.state.isOpen,
      'row is-closed': !this.state.isOpen
    });

    var clickHandler = function(event) {
      var isOpenState = !that.state.isOpen;
      that.setState({isOpen:isOpenState});
    };


    var items = [];
    var items = properties.map(function (item) {
      return  (<ModelPropertyRowDetail rowData={item} scope={scope} />);
    });


    return (
      <div>
        <input type="button" onClick={clickHandler} className="model-instance-header-btn btn btn-default btn-block" value="Properties" />
        <div className={classes} >
          <div className="model-instance-container property-list-header">
            <div data-ui-type="table">
              <div data-ui-type="row" className="model-instance-property-table-header-row">
                <span data-ui-type="cell" className="props-name-cell table-header-cell" title="property name">name</span>
                <span data-ui-type="cell" className="props-data-type-cell table-header-cell" title="data type">type</span>
                <span data-ui-type="cell" className="props-isid-cell table-header-cell" title="is index">index</span>
                <span data-ui-type="cell" className="props-default-value-cell table-header-cell" title="default value"></span>
                <span data-ui-type="cell" className="props-required-cell" title="required">req</span>
                <span data-ui-type="cell" className="props-map-cell table-header-cell header" title="relations">rel.</span>
              </div>
            </div>
          </div>
          <ul className="model-instance-property-list">
            {items}
          </ul>
        </div>


      </div>

      );
  }
});
var ModelPropertyRowDetail = React.createClass({
  getInitialState: function() {
    return {
      rowData:this.props.rowData,
      isOpen:false
    };
  },
  render: function() {

    var that = this;
    var scope = this.props.scope;


    var cx = React.addons.classSet;

    var togglePropertiesView = function(property) {
      that.setState({isOpen:!that.state.isOpen});
    };

    var pClasses = cx({
      'property-detail is-open': that.state.isOpen,
      'property-detail is-closed': !that.state.isOpen
    });

    var rowData = this.state.rowData;
    return (
      <li >
        <div >
          <div data-ui-type="table">
            <div data-ui-type="row">
              <span data-ui-type="cell" className="props-name-cell">
                <input type="button"
                value={ rowData.name }
                onClick={togglePropertiesView}
                className="btn btn-sm btn-default btn-block" />
              </span>
              <span data-ui-type="cell" className="props-data-type-cell">
                <input type="button"
                className="btn btn-sm btn-default"
                value={rowData.props.type} />
              </span>
              <span data-ui-type="cell" className="props-isindex-cell">
                <input type="checkbox" />
              </span>
              <span data-ui-type="cell" className="props-default-value-cell">
                <input type="text"
                className="model-instance-editor-input"
                placeholder="default value" />
              </span>
              <span data-ui-type="cell" className="props-required-cell">
                <input type="checkbox" />
              </span>
              <span data-ui-type="cell" className="props-connection-cell">
                <button className="btn btn-link">
                  <span className="glyphicon glyphicon-flash"></span>
                </button>

              </span>
            </div>
          </div>
          <div className={pClasses}>
            <ModelPocketEditorContainer scope={scope} property={rowData} />
          </div>


        </div>
      </li>
      );
  }
});


/*
 *
 *   MODEL PROPERTIES VIEW
 *
 * */
var ModelPropertiesView = React.createClass({
  render: function() {
    var scope = this.props.scope;
    var properties = this.props.properties;
    var mode = 'preview';

    var getRowItem = function(rowData) {
      return (
        <li >
          <div >
            <div data-ui-type="table">
              <div data-ui-type="row">
                <span data-ui-type="cell" className="props-name-cell">
                  <input type="button"
                  value={ rowData.name }
                  className="btn btn-sm btn-default btn-block" />
                </span>
                <span data-ui-type="cell" className="props-data-type-cell">
                  {rowData.props.type}
                </span>
                <span data-ui-type="cell" className="props-isindex-cell">
                  <input type="checkbox" readonly />
                </span>
                <span data-ui-type="cell" className="props-default-value-cell">
                [default value]
                </span>
                <span data-ui-type="cell" className="props-required-cell">
                  <input type="checkbox" />
                </span>
                <span data-ui-type="cell" className="props-connection-cell">
                  <button className="btn btn-link">
                    <span className="glyphicon glyphicon-flash"></span>
                  </button>

                </span>
              </div>
            </div>
            <ModelPocketEditorContainer scope={scope} property={rowData} mode={mode} />
          </div>
        </li>
        );
    };



    return (
      <div>
        <input type="button" className="model-instance-header-btn btn btn-default btn-block" value="Properties" />
        <div >
          <div className="model-instance-container property-list-header">
            <div data-ui-type="table">
              <div data-ui-type="row" className="model-instance-property-table-header-row">
                <span data-ui-type="cell" className="props-name-cell table-header-cell" title="property name">name</span>
                <span data-ui-type="cell" className="props-data-type-cell table-header-cell" title="data type">type</span>
                <span data-ui-type="cell" className="props-isid-cell table-header-cell" title="is index">index</span>
                <span data-ui-type="cell" className="props-default-value-cell table-header-cell" title="default value"></span>
                <span data-ui-type="cell" className="props-required-cell" title="required">req</span>
                <span data-ui-type="cell" className="props-map-cell table-header-cell header" title="relations">rel.</span>
              </div>
            </div>
          </div>
          <ul className="model-instance-property-list">
            {properties.map(getRowItem)}
          </ul>
        </div>


      </div>

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
            <input type="text" value={this.props.property.name} readOnly={this.props.mode} />

          </div>
        </div>
        <div data-ui-type="row">
          <div data-ui-type="cell">
            <label>Comments</label>
          </div>
          <div data-ui-type="cell">
            <textarea value={this.props.property.doc} ></textarea>
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
      targetView: 'misc',
      mode: this.props.mode || null
    };
  },
  getTargetContent: function() {
    var tView = this.state.targetView;
    var viewFragment = '';
    switch (tView){
      case 'misc':
        viewFragment = (<ModelPocketEditorMiscView scope={this.props.scope} property={this.props.property} mode={this.state.mode} />);

        break;
      case 'id':
        viewFragment = (<PropertyIdEditor scope={this.props.scope} property={this.props.property} mode={this.state.mode} />);

        break;

      case 'validation':
        viewFragment = (<PropertyValidationEditor scope={this.props.scope} property={this.props.property} mode={this.state.mode} />);

        break;

      case 'map':
        viewFragment = (<PropertyMapEditor scope={this.props.scope} property={this.props.property} mode={this.state.mode} />);

        break;

      case 'format':
        viewFragment = (<PropertyFormatEditor scope={this.props.scope} property={this.props.property} mode={this.state.mode} />);

        break;

      default:
        viewFragment = (<ModelPocketEditorMiscView scope={this.props.scope} property={this.props.property} mode={this.state.mode} />);

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

    var frag = this.getTargetContent();

    return (

      <div className="model-details-pocket-editor-container">

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
 *
 * marked for deletion
 * */
//ModelPropertyPocketEditor = React.createClass({
//  render: function() {
//    return (
//      <div className="model-pocket-editor-container">
//        <div className="model-pocket-editor-tab-container">
//
//          <div>
//            <PropertyIdEditor scope={this.props.scope}  />
//            <PropertyValidationEditor />
//            <PropertyMapEditor />
//          </div>
//
//        </div>
//      </div>
//      );
//  }
//});
/*
 *   Model Detail Preview
 * */

ModelDetailView = React.createClass({
  render: function() {
    var model = this.props.model;
    var cx = React.addons.classSet;

    var classes = cx({
//      'row is-open': this.props.scope.isModelInstanceBasePropertiesActive,
//      'row is-closed': !this.props.scope.isModelInstanceBasePropertiesActive
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
                  {model.plural}
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell">
                  <label>datasource</label>
                </div>
                <div data-ui-type="cell">
                 {model.dataSource}
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell">
                  <label>base model</label>
                </div>
                <div data-ui-type="cell">

                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell"><label>public</label></div>
                <div data-ui-type="cell">

                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell"><label>strict</label></div>
                <div data-ui-type="cell">

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

                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell">
                  <label>Scopes</label>
                </div>
                <div data-ui-type="cell">

                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell">
                  <label>Access Control</label>
                </div>
                <div data-ui-type="cell">

                </div>
              </div>

            </div>
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
    var scope = this.props.scope;
    var model = this.props.model;
    var cx = React.addons.classSet;

    var classes = cx({
      'row is-open': this.props.scope.isModelInstanceBasePropertiesActive,
      'row is-closed': !this.props.scope.isModelInstanceBasePropertiesActive
    });

    var clickHandler = function(event) {
      scope.$apply(function() {
        scope.toggleModelDetailView();
      });
    };
//    this.props.scope, this.props.scope.toggleModelDetailView.bind(null, 0));

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
                  <input type="text" value={model.plural} className="model-instance-editor-input" ng-model={model.plural} />
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell">
                  <label>datasource</label>
                </div>
                <div data-ui-type="cell">
                  <input type="text" className="model-instance-editor-input" value={model.dataSource} />
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell">
                  <label>base model</label>
                </div>
                <div data-ui-type="cell">
                  <input type="text" className="model-instance-editor-input"  />
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell"><label>public</label></div>
                <div data-ui-type="cell">
                  <input type="checkbox" className="model-instance-editor-input" value={model.public} />
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell"><label>strict</label></div>
                <div data-ui-type="cell">
                  <input type="checkbox" className="model-instance-editor-input" />
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
