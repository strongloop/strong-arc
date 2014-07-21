/** @jsx React.DOM */
/*
 *   Model Title Header
 * */


/*
 *   Model Detail Editor
 * */
var ModelDetailEditor = (ModelDetailEditor = React).createClass({
  getInitialState: function() {
    return this.props.scope.activeInstance;
  },

  handleChange: function(event) {
    var scope = this.props.scope;
    //this.setState({name: event.target.value});
    var stateName = event.target.attributes['data-name'].value;
    var xState = this.state;
    xState[stateName] = event.target.value;
    this.setState(xState);
    if (event.target.attributes.id) {
      var modelDetailProperty = event.target.attributes['data-name'].value;
      var modelDetailValue = event.target.value;
      scope.$apply(function() {
        scope.updateModelDetailProperty(modelDetailProperty, modelDetailValue);
      });
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps.model);
    console.log('Component will receive props');
  },
//  componentWillUpdate: function(nextProps, nextState) {
//    this.setState(nextProps.scope.activeInstance);
//  },
  render: function() {
    var scope = this.props.scope;

    var model = this.state;
    var cx = React.addons.classSet;

    var classes = cx({
      'model-detail-pocket-container is-open': this.props.scope.isModelInstanceBasePropertiesActive,
      'model-detail-pocket-container is-closed': !this.props.scope.isModelInstanceBasePropertiesActive
    });
    var iconClasses = cx({
      'glyphicon glyphicon-minus-sign': this.props.scope.isModelInstanceBasePropertiesActive,
      'glyphicon glyphicon-plus-sign': !this.props.scope.isModelInstanceBasePropertiesActive
    });
    var clickHandler = function(event) {
      scope.$apply(function() {
        scope.toggleModelDetailView();
      });
    };
    var returnVal = (<div />);
    if (scope.activeInstance.name) {
      returnVal = (
        <div>
          <div data-ui-type="cell">
            <label>name</label>
          </div>
          <div data-ui-type="cell">
            <input type="text" value={scope.activeInstance.name} data-name="name" id="ModelName" name="ModelName" className="model-instance-editor-input" />
          </div>
          <button onClick={clickHandler} type="button" className="model-instance-header-btn btn btn-default btn-block" title="Details" ><span className={iconClasses}></span>Details</button>
          <div data-ui-type="table" className={classes}>
            <div data-ui-type="row">
              <div data-ui-type="cell">
                <div data-ui-type="table" >
                  <div data-ui-type="row">
                    <div data-ui-type="cell">
                      <label>plural</label>
                    </div>
                    <div data-ui-type="cell">
                      <input type="text" value={model.props.plural} onChange={this.handleChange} data-name="plural" id="ModelPlural" name="ModelPlural" className="model-instance-editor-input" />
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
                      <input type="checkbox" checked={model.props.public} className="model-instance-editor-input" />
                    </div>
                  </div>
                  <div data-ui-type="row">
                    <div data-ui-type="cell"><label>strict</label></div>
                    <div data-ui-type="cell">
                      <input type="checkbox" checked={model.props.strict} className="model-instance-editor-input" />
                    </div>
                  </div>
                </div>
              </div>
              <div data-ui-type="cell">
                <div data-ui-type="table" >
                  <div data-ui-type="row">
                    <div data-ui-type="cell">
                      <label>datasource</label>
                    </div>
                    <div data-ui-type="cell">
                      <input type="text" value={model.props.dataSource} onChange={this.handleChange} className="model-instance-editor-input" />
                    </div>
                  </div>
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
        </div>
        );
    }

    return returnVal;
  }
});
/*
 *   Model Detail Preview
 * */

var ModelDetailView = (ModelDetailView = React).createClass({
  render: function() {
    var model = this.props.model;
    var cx = React.addons.classSet;

    var classes = cx({
//      'row is-open': this.props.scope.isModelInstanceBasePropertiesActive,
//      'row is-closed': !this.props.scope.isModelInstanceBasePropertiesActive
    });

    var clickHandler = this.props.scope.$apply.bind(this.props.scope, this.props.scope.toggleModelDetailView.bind(null, 0));

    return (
      <div>
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
                  <label>datasource</label>
                </div>
                <div data-ui-type="cell">
                 {model.dataSource}
                </div>
              </div>
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
 *
 *   MODEL PROPERTIES
 *
 *
 * */
var ModelPropertiesEditor = (ModelPropertiesEditor = React).createClass({

  getInitialState: function() {
    return {
      isOpen:true
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {

    // return this.state.isOpen !== nextState.isOpen;
    return true;
  },
  triggerNewPropertyEditor: function() {
    var item = {};
    var that = this;
    console.log('New Property Editor');
    that.props.scope.$apply(function() {
      that.props.scope.createNewProperty();
    });

  },

  render: function() {

    var that = this;

    var scope = this.props.scope;
    var properties = this.props.properties;
    var cx = React.addons.classSet;




    var classes = cx({
      'row is-open': this.state.isOpen,
      'row is-closed': !this.state.isOpen
    });
    var iconClasses = cx({
      'glyphicon glyphicon-minus-sign': this.state.isOpen,
      'glyphicon glyphicon-plus-sign': !this.state.isOpen
    });
    var clickHandler = function(event) {
      var isOpenState = !that.state.isOpen;
      that.setState({isOpen:isOpenState});
    };


    var items = [];
    items = properties.map(function (item) {
      return  (<ModelPropertyRowDetail rowData={item} scope={scope} />);
    });


    return (
      <div>
        <button type="button" onClick={clickHandler} className="model-instance-header-btn btn btn-default btn-block" title="Properties" ><span className={iconClasses}></span>Properties</button>
        <div className={classes} >
          <div className="model-instance-container property-list-header">
            <div data-ui-type="table">
              <div data-ui-type="row" className="model-instance-property-table-header-row">
                <span data-ui-type="cell" className="props-name-cell table-header-cell" title="property name">name</span>
                <span data-ui-type="cell" className="props-data-type-cell table-header-cell" title="data type">type</span>
                <span data-ui-type="cell" className="props-default-value-cell table-header-cell" title="default value"></span>
                <span data-ui-type="cell" className="props-required-cell" title="required">req</span>
                <span data-ui-type="cell" className="props-index-cell table-header-cell" title="is index">index</span>
                <span data-ui-type="cell" className="props-comments-cell table-header-cell header" title="comments">comments</span>
              </div>
            </div>
          </div>
          <ul className="model-instance-property-list">
            {items}
          </ul>
          <button type="button" onClick={this.triggerNewPropertyEditor} className="btn-new-model-property" >New Property</button>
        </div>


      </div>

      );
  }
});
var DataTypeSelect = (DataTypeSelect = React).createClass({
  render: function() {

    var dataTypes = ['string','array','buffer','date','geopoint','number','boolean','object','any'];

    var options = dataTypes.map(function(type) {
      return (<option value={type}>{type}</option>)
    });
    return (<select value={this.props.value}>{options}</select>);
  }
});
var ModelPropertyRowDetail = (ModelPropertyRowDetail = React).createClass({
  getInitialState: function() {
    return {
      model:this.props.rowData,
      isOpen:false
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({model:nextProps.rowData});
    console.log('Component will receive props');
  },
  componentDidMount: function() {
    console.log('the field has loaded check if property name is property-name');
    var propNameInputs = jQuery('[data-name="ModelPropertyName"]');
    for (var i = 0;i < propNameInputs.length;i++) {
      if (propNameInputs[i].value === 'property-name' ){
        jQuery(propNameInputs[i]).select();
      }
    }
  },
  checkSubmitModelProperty: function(event) {
//    if (event.keyCode === 13) {
//      console.log('|||    ENTER ');
//    }

    var tModel = this.state.model;
    tModel.name = event.target.value;
    this.setState({model:tModel});
  },
  savePropertyEntry: function() {
    console.log('|||||    SAVE THE FORM ');
  },
  render: function() {

    var that = this;
    var scope = that.props.scope;
    var model = that.state.model;
    var cx = React.addons.classSet;


    var togglePropertiesView = function(property) {
      that.setState({isOpen:!that.state.isOpen});
    };

    var pClasses = cx({
      'property-detail is-open': that.state.isOpen,
      'property-detail is-closed': !that.state.isOpen
    });
    var bClasses = cx({
      'glyphicon glyphicon-chevron-down': that.state.isOpen,
      'glyphicon glyphicon-chevron-right': !that.state.isOpen
    });


    return (
      <li onKeyUp={this.savePropertyEntry}>
        <div >
          <div data-ui-type="table">
            <div data-ui-type="row">
              <span data-ui-type="cell" className="props-name-cell">
                <button
                  onClick={togglePropertiesView}
                  className="btn btn-sm btn-default btn-model-property-spinner">
                  <span className={bClasses}></span>
                </button>
                <input ref="propName" data-name="ModelPropertyName" type="text" onChange={this.checkSubmitModelProperty} value={model.name} />
              </span>
              <span data-ui-type="cell" className="props-data-type-cell">
                <DataTypeSelect value={model.props.type} />
              </span>
              <span data-ui-type="cell" className="props-default-value-cell">
                <input type="text"
                className="model-instance-editor-input"
                placeholder="default value" />
              </span>
              <span data-ui-type="cell" className="props-required-cell">
                <input type="checkbox" />
              </span>
              <span data-ui-type="cell" className="props-index-cell">
                <input type="checkbox" />
              </span>
              <span data-ui-type="cell" className="props-comments-cell">
                <textarea className="property-doc-textarea model-instance-editor-input" ></textarea>
              </span>
            </div>
          </div>
          <div className={pClasses}>
            <ModelPocketEditorContainer scope={scope} property={model} />
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
var ModelPropertiesView = (ModelPropertiesView = React).createClass({
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
var PropertyCommentEditor = (PropertyCommentEditor = React).createClass({
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
var PropertyNameEditor = (PropertyNameEditor = React).createClass({
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
var ModelPocketEditorMiscView = (ModelPocketEditorMiscView = React).createClass({
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
var ModelPocketEditorContainer = (ModelPocketEditorContainer = React).createClass({
  getInitialState: function() {
    return {
      targetView: 'id',
      mode: this.props.mode || null
    };
  },
  getTargetContent: function() {
    var tView = this.state.targetView;
    var viewFragment = '';
    switch (tView){
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
        viewFragment = (<div>hmmm... we don't seem to be able to find the view you're looking for</div>);

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
var PropertyConnectionEditor = (PropertyConnectionEditor = React).createClass({
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
 *
 *   NEW MODEL
 *
 * */
var NewModelForm = (NewModelForm = React).createClass({
  getInitialState: function() {
    return this.props.scope.newModelInstance;
  },
  newModelNameInput: function(event) {
    var that = this;
    var scope = that.props.scope;
    var targetValue = event.target.value;
    //console.log('new model name request: ' + event.target.value);

    if (targetValue) {
      // check to see if it is valid (no spaces, no invalid characters etc.
      // then check to see if it is unique
      scope.$apply(function() {
        scope.processModelNameInput(targetValue);
      });
    }

  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps.scope.newModelInstance);
    console.log('Component will receive props');
  },
  render:function() {

    var scope = this.props.scope;
    var model = this.state;

    var uniqueWarningCss = 'new-model-name';

    var uniqueText = '';
    if (model.isUnique) {
      uniqueWarningCss += ' is-unique';
      uniqueText = 'unique name';
    }
    else {
      uniqueWarningCss += ' is-duplicate';
      uniqueText = 'duplicate name';
    }

    return (
      <div>
        <form>
          <label>Model name</label>
          <input placeholder="model name" value={model.name} onChange={this.newModelNameInput} type="text" />
          <span className={uniqueWarningCss}>{uniqueText}</span>
          <br />
          <button className="btn btn-primary">create</button>
        </form>
      </div>
      );
  }
});


