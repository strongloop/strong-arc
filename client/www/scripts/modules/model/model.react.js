/** @jsx React.DOM */
/*
 *   Model Detail Editor
 * */
var ModelDetailEditor = (ModelDetailEditor = React).createClass({
  getInitialState: function() {
    return {activeInstance:this.props.scope.activeInstance};
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({activeInstance:{}});
    this.setState({activeInstance:nextProps.scope.activeInstance});
  },
  handleChange: function(event) {
    var scope = this.props.scope;
    var modelPropertyName = '';
    if (event.target.attributes['data-name']) {
      modelPropertyName = event.target.attributes['data-name'].value;
      // commented out code to update tab name while typing
//      if (modelPropertyName === 'name') {
//        // update the tab
//        scope.$apply(function() {
//            scope.updateActiveInstanceName(event.target.value);
//          }
//        );
//      }
      var xState = this.state;
      if (event.target.attributes['type'] && (event.target.attributes['type'].value === 'checkbox')) {
        xState.activeInstance[modelPropertyName] = event.target.checked;
      }
      else {
        xState.activeInstance[modelPropertyName] = event.target.value;
      }
      this.setState(xState);
    }
  },
  processModelNameValue: function(event) {
    if (event.target.attributes['data-name']) {
      var xState = this.state;
      var tActiveInstance = xState.activeInstance;
      var modelPropertyName = tActiveInstance.name;

      // check if plural value is already set
      // if not then set it to a I18N.pluralize value
      if (!tActiveInstance.plural) {
        tActiveInstance.plural = inflection.pluralize(modelPropertyName);
      }
      xState.activeInstance = tActiveInstance;
      this.setState(xState);
    }
  },
  render: function() {
    var that = this;
    var scope = that.props.scope;
    var modelDef = that.state.activeInstance;
    var cx = React.addons.classSet;

    var classes = cx({
      'model-detail-pocket-container is-open': that.props.scope.isModelInstanceBasePropertiesActive,
      'model-detail-pocket-container is-closed': !that.props.scope.isModelInstanceBasePropertiesActive
    });
    var iconClasses = cx({
      'model-editor-section-icon glyphicon glyphicon-minus-sign': that.props.scope.isModelInstanceBasePropertiesActive,
      'model-editor-section-icon glyphicon glyphicon-plus-sign': !that.props.scope.isModelInstanceBasePropertiesActive
    });
    var clickHandler = function(event) {
      scope.$apply(function() {
        scope.toggleModelDetailView();
      });
    };
    var saveModelDefinition = function(event) {
      event.preventDefault();
      var tState = that.state.activeInstance;
      var scope = that.props.scope;
      scope.$apply(function() {
        scope.saveModelRequest(tState);
      });
    };
    var dataSourceOptions = (<option />);
    if (scope.mainNavDatasources.map) {
      dataSourceOptions = scope.mainNavDatasources.map(function(ds) {
        return (<option value={ds.name}>{ds.name}</option>);
      });
    }

    var baseOptions = (<option />);
    if (scope.mainNavModels.map) {
      baseOptions = scope.mainNavModels.map(function(model) {
        return (<option value={model.name}>{model.name}</option>);
      });
    }


    var returnVal = (<div />);
    if (modelDef && modelDef.name) {
      returnVal = (
        <form role="form">
        	<div className="model-header-container">
            <div className="model-header-name-container form-group">
              <label>name</label>
              <input type="text"
                value={modelDef.name}
                onChange={that.handleChange}
                onBlur={that.processModelNameValue}
                data-name="name"
                id="ModelName"
                name="ModelName"
                className="model-instance-name form-control" />
            </div>
            <button onClick={saveModelDefinition}
              className="model-detail-pocket-button model-save-button"
              data-modelId={modelDef.id} >Save Model</button>
          </div>
          <div className="lineBreak"></div>
          <button onClick={clickHandler}
            type="button"
            className="model-instance-header-btn btn btn-default btn-block"
            title="Details" >
            <div className={iconClasses}></div>
            <div className="model-editor-section-title">Details</div>
          </button>
          <div className="model-detail-container">
	          <div className="model-detail-input-row">
	          	<div className="model-detail-input-container">
	          		<div className="model-detail-label">
	          		  <label>Plural</label>
	          		</div>
	          		<input type="text"
	          		 	value={modelDef.plural}
	          		    onChange={this.handleChange}
	          		    data-name="plural"
	          		    id="ModelPlural"
	          		    name="ModelPlural"
	          		    className="model-instance-editor-input" />
	          	</div>
	          	<div className="model-detail-input-container">
	          		<div className="model-detail-label">
	          		  <label>Base model</label>
	          		</div>
                <select value={modelDef.base}
                  data-name="base"
                  name="base"
                  onChange={this.handleChange}
                  className="model-instance-editor-input">
                  {baseOptions}
                </select>
	          	</div>
	          	<div className="model-detail-input-container">
	          		<div className="model-detail-label">
	          		  <label>Datasource</label>
	          		</div>
                <select value={modelDef.dataSource}
                  data-name="dataSource"
                  name="dataSource"
                  onChange={this.handleChange}
                  className="model-instance-editor-input">
                  {dataSourceOptions}
                </select>
	          	</div>
	          </div>

	          <div className="model-detail-button-row">
              <div className="model-detail-input-container listNarrow checkbox">
                <label className="model-instance-editor-checkbox-label">
                  <input type="checkbox"
                  value={modelDef.public}
                  checked={modelDef.public}
                  data-name="public"
                  name="public"
                  onChange={this.handleChange}
                  className="model-instance-editor-checkbox" />public
                </label>
              </div>
              <div className="model-detail-input-container listNarrow checkbox">
                <label className="model-instance-editor-checkbox-label">
                  <input type="checkbox"
                  data-name="strict"
                  name="strict"
                  onChange={this.handleChange}
                  checked={modelDef.strict}
                  value={modelDef.strict}
                  className="model-instance-editor-checkbox" />strict
                </label>

              </div>
	          </div>


          </div>
        </form>
        );
    }

    return returnVal;
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
    that.props.scope.$apply(function() {
      that.props.scope.createNewProperty();
    });

  },

  render: function() {

    var that = this;

    var scope = this.props.scope;
    var properties = scope.properties;
    var cx = React.addons.classSet;

    var classes = cx({
      'row is-open': this.state.isOpen,
      'row is-closed': !this.state.isOpen
    });
    var iconClasses = cx({
      'model-editor-section-icon glyphicon glyphicon-minus-sign': this.state.isOpen,
      'model-editor-section-icon glyphicon glyphicon-plus-sign': !this.state.isOpen
    });
    var clickHandler = function(event) {
      var isOpenState = !that.state.isOpen;
      that.setState({isOpen:isOpenState});
    };

    var items = [];
    items = properties.map(function (item) {
      return  (<ModelPropertyRowDetail modelProperty={item} scope={scope} />);
    });

    var retVal = (<div />);
    if (properties) {
      retVal = (
        <div>
          <button type="button" onClick={clickHandler} className="model-instance-header-btn btn btn-default btn-block" title="Properties" >
            <span className={iconClasses}></span>
            <span className="model-editor-section-title">Properties</span>
          </button>
          <div className={classes} >
            <div className="model-instance-container property-list-header">
              <div data-ui-type="table">
                <div data-ui-type="row" className="model-instance-property-table-header-row">

                  <span data-ui-type="cell" title="property name" className="props-name-header table-header-cell">Name</span>

                  <span data-ui-type="cell" title="data type"className="props-data-type-header table-header-cell">Type</span>

                  <span data-ui-type="cell" title="is id" className="props-isid-header table-header-cell">is id</span>

                  <span data-ui-type="cell" title="required" className="props-required-header table-header-cell">Req</span>

                  <span data-ui-type="cell" title="is index" className="props-index-header table-header-cell">Index</span>

                  <span data-ui-type="cell" title="comments" className="props-comments-header table-header-cell">Comments</span>


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


    return retVal;
  }
});
/*
*
*   Model Property Row Detail Item
*
* */
var ModelPropertyRowDetail = (ModelPropertyRowDetail = React).createClass({
  getInitialState: function() {
    return {
      modelProperty:this.props.modelProperty,
      isOpen:false
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({modelProperty:nextProps.modelProperty});
  },
  componentDidMount: function() {
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

    var tModel = this.state.modelProperty;
    tModel.name = event.target.value;
    this.setState({modelProperty:tModel});
  },
  triggerModelPropertyUpdate: function(event) {
    var scope = this.props.scope;
    if(event.target.attributes['data-name']){
      var tModelPropertyName = event.target.attributes['data-name'].value;
      var tModelProperty = this.state.modelProperty;
      if (event.target.attributes['type'] && (event.target.attributes['type'].value === 'checkbox')) {
        tModelProperty[tModelPropertyName] = event.target.checked;
      }
      else {
        tModelProperty[tModelPropertyName] = event.target.value;
      }
      this.setState({modelProperty:tModelProperty});
      var updateModelPropertyConfig = tModelProperty;
      scope.$apply(function() {
        scope.updateModelPropertyRequest(updateModelPropertyConfig);
      });

    }

  },
  render: function() {

    var that = this;
    var scope = that.props.scope;
    var modelProperty = that.state.modelProperty;
    var cx = React.addons.classSet;


    var togglePropertiesView = function(property) {
      that.setState({isOpen:!that.state.isOpen});
    };

    var pClasses = cx({
      'property-detail-container is-open': that.state.isOpen,
      'property-detail-container is-closed': !that.state.isOpen
    });
    var bClasses = cx({
      'glyphicon glyphicon-open-sign': that.state.isOpen,
      'glyphicon glyphicon-closed-sign': !that.state.isOpen
    });
    var cClasses = cx({
      'modelproperty-container modelproperty-detail-is-open': that.state.isOpen,
      'modelproperty-container modelproperty-detail-is-closed': !that.state.isOpen
    });


    return (
      <li>
        <div className={cClasses}>
          <div data-ui-type="table" className="modelproperty-detail-row" >
            <div data-ui-type="row">
              <span data-ui-type="cell" className="props-name-cell">
                <input ref="propName"
                  data-name="name"
                  type="text"
                  onChange={this.checkSubmitModelProperty}
                  onBlur={this.triggerModelPropertyUpdate}
                  value={modelProperty.name} />
              </span>
              <span data-ui-type="cell" className="props-data-type-cell">
                <DataTypeSelect scope={scope} modelProperty={that.state.modelProperty} type={modelProperty.type} />
              </span>
              <span data-ui-type="cell" className="props-isid-cell">
                <input type="checkbox"
                  data-name="isId"
                  name="isId"
                  onChange={this.triggerModelPropertyUpdate}
                  checked={modelProperty.isId}
                  value={modelProperty.isId}
                  className="model-instance-editor-checkbox" />
              </span>
              <span data-ui-type="cell" className="props-required-cell">
                <input type="checkbox"
                  data-name="required"
                  name="required"
                  onChange={this.triggerModelPropertyUpdate}
                  checked={modelProperty.required}
                  value={modelProperty.required}
                  className="model-instance-editor-checkbox" />
              </span>
              <span data-ui-type="cell" className="props-index-cell">
                <input type="checkbox"
                  data-name="index"
                  name="index"
                  onChange={this.triggerModelPropertyUpdate}
                  checked={modelProperty.index}
                  value={modelProperty.index}
                  className="model-instance-editor-checkbox" />
              </span>
              <span data-ui-type="cell" className="props-comments-cell">
                <input type="text"
                  data-name="comments"
                  name="comments"
                  onBlur={this.triggerModelPropertyUpdate}
                  value={modelProperty.comments}
                  className="property-doc-textarea model-instance-editor-input" />
              </span>
            </div>
          </div>
          <div className={pClasses}>
            <ModelPocketEditorContainer scope={scope} property={modelProperty} />
          </div>


        </div>
      </li>
      );
  }
});




var DataTypeSelect = (DataTypeSelect = React).createClass({
  getInitialState: function() {
    return {
      type:this.props.type,
      modelProperty:this.props.modelProperty
    };
  },
  handleChange: function(event) {
    var scope = this.props.scope;
    var modelPropertyName = '';
    if (event.target.attributes['data-name']) {
      modelPropertyName = event.target.attributes['data-name'].value;
      var xState = this.state;
      xState.modelProperty[modelPropertyName] = event.target.value;
      this.setState(xState);
      scope.$apply(function() {
        scope.updateModelPropertyRequest(xState.modelProperty);
      });
    }
  },
  render: function() {
    var that = this;

    var val = that.state.modelProperty.type;

    var dataTypes = ['string','array','buffer','date','geopoint','number','boolean','object','any'];

    var options = dataTypes.map(function(type) {
      return (<option value={type}>{type}</option>)
    });

    return (<select value={val} data-name="type" onChange={this.handleChange}>{options}</select>);
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


  },
  shouldComponentUpdate: function(nextProps, nextState) {

    if (nextProps.name !== nextState.value) {

      return true;
    }
    return false;

  },
  componentWillUpdate: function(nextProps, nextState) {
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


