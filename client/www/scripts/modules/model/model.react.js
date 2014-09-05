/** @jsx React.DOM */
/*
 *   Model Detail Editor
 * */
var ModelDetailEditor = (ModelDetailEditor = React).createClass({
  getInitialState: function() {
    return {
      activeInstance:this.props.scope.activeInstance,
      isDetailsContainerOpen:true,
      isNameValid:true,
      isFormValid: false
    };
  },
  componentWillReceiveProps: function(nextProps) {
    var component = this;
    component.setState({
      activeInstance:nextProps.scope.activeInstance,
      isFormValid: component.isNameValid(nextProps.scope.activeInstance.name)
    });
  },
  isNameValid: function(name) {
    return /^[\-_a-zA-Z0-9]+$/.test(name);
  },
  handleChange: function(event) {
    var component = this;
    var modelPropertyName = '';
    if (event.target.attributes['data-name']) {
      var xState = component.state;
      modelPropertyName = event.target.attributes['data-name'].value;
      if (modelPropertyName === 'name') {
        xState.isNameValid = component.isNameValid(event.target.value);
      }
      if ((modelPropertyName === 'config.public') || (modelPropertyName === 'config.dataSource')){
        modelPropertyName = modelPropertyName.split('.');
        if (event.target.attributes['type'] && (event.target.attributes['type'].value === 'checkbox')) {
          xState.activeInstance.config[modelPropertyName[1]] = event.target.checked;
        } else {
          xState.activeInstance.config[modelPropertyName[1]] = event.target.value;
        }
      }
      if (event.target.attributes['type'] && (event.target.attributes['type'].value === 'checkbox')) {
        xState.activeInstance.definition[modelPropertyName] = event.target.checked;
      } else {
        xState.activeInstance.definition[modelPropertyName] = event.target.value;
      }
      component.setState(xState);
    }
  },
  handleDataSourceChange: function(event) {
    var component = this;
    var select = event.target;
    var selectedOption = select.options[select.selectedIndex];
    var value = selectedOption.value;
    var xState = component.state;
    var modelDef = xState.activeInstance.definition;
    var modelConfig = xState.activeInstance.config;
    var base = modelDef.base;

    if(value === CONST.DEFAULT_DATASOURCE) {
      value = null;
      modelDef.base = CONST.NEW_MODEL_BASE;
    } else if(base === CONST.NEW_MODEL_BASE) {
      modelDef.base = CONST.DEFAULT_DATASOURCE_BASE_MODEL;
    }

    xState.activeInstance.config.dataSource = value;

    component.setState(xState);
    this.setBaseForDataSource();
  },
  setBaseForDataSource: function() {
    var component = this;
    var xState = component.state;
    var modelDef = xState.activeInstance.definition;
    var modelConfig = xState.activeInstance.config;
    var base = modelDef.base;
    var baseIsDefault = base === CONST.NEW_MODEL_BASE;
    var noDataSourceSelected = modelConfig.dataSource === CONST.DEFAULT_DATASOURCE;

    if(noDataSourceSelected) {
      modelDef.base = CONST.NEW_MODEL_BASE;
    } else {
      modelDef.base = CONST.DEFAULT_DATASOURCE_BASE_MODEL;
    }

    component.setState(xState);
  },
  handleBaseBlur: function() {
    var component = this;
    var xState = component.state;
    var modelDef = xState.activeInstance.definition;
    var base = $.trim(modelDef.base, '');

    if(!base) {
      component.setBaseForDataSource();
    }
  },
  processModelNameValue: function(event) {
    if (event.target.attributes['data-name']) {
      var xState = this.state;
      var tActiveInstance = xState.activeInstance;
      var modelPropertyName = tActiveInstance.definition.name;

      // check if plural value is already set
      // if not then set it to a I18N.pluralize value
      if (!tActiveInstance.definition.plural) {
        tActiveInstance.definition.plural = inflection.pluralize(modelPropertyName);
      }
      xState.activeInstance = tActiveInstance;
      this.setState(xState);
    }
  },
  saveModelInstance: function(event) {
    var component = this;
    event.preventDefault();
    var instance = component.state.activeInstance;
    var scope = component.props.scope;
    scope.$apply(function() {
      scope.saveModelInstanceRequest(instance);
    });
  },
  toggleModelDetailContainer: function() {
    $('.model-detail-container').toggle(250);
    var currState = this.state.isDetailsContainerOpen;
    this.setState({isDetailsContainerOpen:!currState});
  },
  render: function() {
    var component = this;
    var scope = component.props.scope;
    var activeInstance = component.state.activeInstance;
    var modelDef = activeInstance.definition;
    var cx = React.addons.classSet;

    var classes = cx({
      'model-detail-pocket-container is-open': component.props.scope.isModelInstanceBasePropertiesActive,
      'model-detail-pocket-container is-closed': !component.props.scope.isModelInstanceBasePropertiesActive
    });
    var iconClasses = cx({
      'model-editor-section-icon glyphicon glyphicon-minus-sign': component.state.isDetailsContainerOpen,
      'model-editor-section-icon glyphicon glyphicon-plus-sign': !component.state.isDetailsContainerOpen
    });
    var modelNameInputClasses = cx({
      'model-instance-name form-control': component.state.isNameValid,
      'model-instance-name form-control is-invalid': !component.state.isNameValid
    });
    var modelNameValidationClasses = cx({
      'model-instance-name-validation is-valid': component.state.isNameValid,
      'model-instance-name-validation is-invalid': !component.state.isNameValid
    });
    var formGroupValidationClasses = cx({
      'model-header-name-container form-group': component.state.isNameValid,
      'model-header-name-container form-group has-error': !component.state.isNameValid
    });
    var clickHandler = function(event) {
      scope.$apply(function() {
        scope.toggleModelDetailView();
      });
    };

    var dataSourceOptions = [];
    if (scope.mainNavDatasources.map) {
      dataSourceOptions.push(
        <option value={CONST.DEFAULT_DATASOURCE}>{CONST.DEFAULT_DATASOURCE}</option>
      );
      dataSourceOptions = dataSourceOptions.concat(scope.mainNavDatasources.map(function(ds) {
        return (<option value={ds.name}>{ds.name}</option>);
      }));
    }

    var baseOptions = (<option />);
    if (scope.mainNavModels.map) {
      baseOptions = scope.mainNavModels.map(function(model) {
        return (<option value={model.name}>{model.name}</option>);
      });
    }
    var isFormValid = false;
    if (component.state.isNameValid) {
      isFormValid = true;
    }

    var returnVal = (<div />);
    if (modelDef) {
      returnVal = (
        <form role="form">
          <div className="model-header-container">
            <div className={formGroupValidationClasses}>
              <label>Name</label>
              <input type="text"
                value={modelDef.name}
                onChange={component.handleChange}
                onBlur={component.processModelNameValue}
                data-name="name"
                id="ModelName"
                name="ModelName"
                placeholder="model name"
                className={modelNameInputClasses} />
            </div>
            <button onClick={component.saveModelInstance}
              disabled={!isFormValid}
              className="model-detail-pocket-button model-save-button"
              data-modelId={modelDef.id} >Save Model</button>
            <MigrateButton scope={scope} />
            <div className={modelNameValidationClasses}>
              <span className="validation-error-message">
                The name needs to conform with <a target="_blank" href="https://mathiasbynens.be/notes/javascript-identifiers" >javascript conventions</a>
              </span>
            </div>
          </div>
          <div className="lineBreak"></div>

          <button onClick={component.toggleModelDetailContainer}
            type="button"
            className="model-instance-header-btn btn-block"
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
                    onChange={component.handleChange}
                    data-name="plural"
                    id="ModelPlural"
                    name="ModelPlural"
                    className="model-instance-editor-input" />
              </div>
              <div className="model-detail-input-container">
                <div className="model-detail-label">
                  <label>Base model</label>
                </div>
                <input
                  className="model-instance-editor-input"
                  type="text"
                  data-name="base"
                  value={modelDef.base}
                  onChange={component.handleChange}
                  onBlur={component.handleBaseBlur} />
              </div>
              <div className="model-detail-input-container">
                <div className="model-detail-label">
                  <label>Datasource</label>
                </div>
                <select value={component.state.activeInstance.config.dataSource}
                  data-name="config.dataSource"
                  name="dataSource"
                  onChange={component.handleDataSourceChange}
                  className="model-instance-editor-input">
                  {dataSourceOptions}
                </select>
              </div>
            </div>

            <div className="model-detail-button-row">
              <div className="model-detail-input-container listNarrow checkbox">
                <label className="model-instance-editor-checkbox-label">
                  <input type="checkbox"
                  value={component.state.activeInstance.config.public}
                  checked={component.state.activeInstance.config.public}
                  data-name="config.public"
                  name="public"
                  onChange={component.handleChange}
                  className="model-instance-editor-checkbox" />public
                </label>
              </div>
              <div className="model-detail-input-container listNarrow checkbox">
                <label className="model-instance-editor-checkbox-label">
                  <input type="checkbox"
                  data-name="strict"
                  name="strict"
                  onChange={component.handleChange}
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
 * */
var ModelPropertiesEditor = (ModelPropertiesEditor = React).createClass({

  getInitialState: function() {
    return {
      isOpen:true,
      isPropertiesContainerOpen:true
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
      that.props.scope.createNewModelProperty();
    });

  },
  toggleModelProperties: function() {
    $('[data-id="ModelPropertyListContainer"]').toggle(250);
    var currState = this.state.isPropertiesContainerOpen;
    this.setState({isPropertiesContainerOpen:!currState});
  },
  render: function() {

    var component = this;

    var scope = component.props.scope;
    var properties = scope.activeInstance.properties;
    var cx = React.addons.classSet;

    var classes = cx({
      'row is-open': component.state.isOpen,
      'row is-closed': !component.state.isOpen
    });
    var iconClasses = cx({
      'model-editor-section-icon glyphicon glyphicon-minus-sign': component.state.isPropertiesContainerOpen,
      'model-editor-section-icon glyphicon glyphicon-plus-sign': !component.state.isPropertiesContainerOpen
    });
    var clickHandler = function(event) {
      var isOpenState = !component.state.isPropertiesContainerOpen;
      component.setState({isOpen:isOpenState});
    };

    var items = [];
    items = properties.map(function (item) {
      return  (<ModelPropertyRowDetail modelProperty={item} scope={scope} />);
    });
    var disabledVal = false;
    var titleText = 'New Property';
    if (scope.activeInstance.id === CONST.NEW_MODEL_PRE_ID){
      disabledVal = true;
      titleText = 'Save your model before adding properties';
    }
    var retVal = (<div />);
    if (properties) {
      retVal = (
        <div>
          <button type="button" onClick={component.toggleModelProperties} className="model-instance-header-btn btn-block" title="Properties" >
            <span className={iconClasses}></span>
            <span className="model-editor-section-title">Properties</span>
          </button>
          <div data-id="ModelPropertyListContainer" className={classes} >
            <div className="model-instance-container property-list-header">
              <div data-ui-type="table">
                <div data-ui-type="row" className="model-instance-property-table-header-row">

                  <span data-ui-type="cell" title="property name" className="props-name-header table-header-cell">Name</span>

                  <span data-ui-type="cell" title="data type"className="props-data-type-header table-header-cell">Type</span>

                  <span data-ui-type="cell" title="is id" className="props-isid-header table-header-cell">is id</span>

                  <span data-ui-type="cell" title="required" className="props-required-header table-header-cell">Req</span>

                  <span data-ui-type="cell" title="is index" className="props-index-header table-header-cell">Index</span>

                  <span data-ui-type="cell" title="comments" className="props-comments-header table-header-cell">Comments</span>

                  <span data-ui-type="cell" title="controls" className="props-controls-header table-header-cell"></span>


                </div>
              </div>
            </div>
            <ul className="model-instance-property-list">
            {items}
            </ul>
            <button disabled={disabledVal} title={titleText} type="button" onClick={component.triggerNewPropertyEditor} className="btn-new-model-property" >New Property</button>
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
      currModelId:this.props.modelProperty.modelId,
      modelProperty:this.props.modelProperty,
      isOpen:false,
      isNameValid: true
    };
  },
  componentWillReceiveProps: function(nextProps) {
    var component = this;
    component.setState({
      modelProperty:nextProps.modelProperty,
      isNameValid: component.isNameValid(nextProps.modelProperty.name)
    });
  },
  componentDidMount: function() {
    var propNameInputs = jQuery('[data-name="ModelPropertyName"]');
    for (var i = 0;i < propNameInputs.length;i++) {
      if (propNameInputs[i].value === 'property-name' ){
        jQuery(propNameInputs[i]).select();
      }
    }
  },
  isNameValid: function(name) {
    return /^[\-_a-zA-Z0-9]+$/.test(name);
  },
  componentDidUpdate: function() {
    // recalculate in case properties push below the scroll view
    window.triggerResizeUpdate();
  },
  checkSubmitModelProperty: function(event) {
    var component = this;

    var tModel = this.state.modelProperty;
    tModel.name = event.target.value;
    this.setState({modelProperty:tModel});
    component.setState({
      isNameValid: component.isNameValid(event.target.value)
    });
  },
  triggerModelPropertyUpdate: function(event) {
    var component = this;
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
      if (tModelPropertyName === 'name') {
        component.setState({
          isNameValid: component.isNameValid(event.target.value)
        });
      }
      var updateModelPropertyConfig = tModelProperty;
      scope.$apply(function() {
        scope.updateModelPropertyRequest(updateModelPropertyConfig);
      });
    }
  },
  deleteModelProperty: function(event) {
    var component = this;
    var scope = component.props.scope;
    if (event.target.attributes['data-id']) {
      var modelPropId = event.target.attributes['data-id'].value;
      scope.$apply(function() {
        scope.deleteModelPropertyRequest({id:modelPropId,modelId:component.state.currModelId});
      });
    }
  },
  render: function() {

    var component = this;
    var scope = component.props.scope;
    var modelProperty = component.state.modelProperty;
    var cx = React.addons.classSet;


    var togglePropertiesView = function(property) {
      component.setState({isOpen:!component.state.isOpen});
    };

    var pClasses = cx({
      'property-detail-container is-open': component.state.isOpen,
      'property-detail-container is-closed': !component.state.isOpen
    });
    var bClasses = cx({
      'glyphicon glyphicon-open-sign': component.state.isOpen,
      'glyphicon glyphicon-closed-sign': !component.state.isOpen
    });
    var cClasses = cx({
      'modelproperty-container modelproperty-detail-is-open': component.state.isOpen,
      'modelproperty-container modelproperty-detail-is-closed': !component.state.isOpen
    });
    var propertyCellValidationClasses = cx({
      'props-name-cell': component.state.isNameValid,
      'props-name-cell has-errors': !component.state.isNameValid
    });
    var propertyValidationContainerClasses = cx({
      'model-instance-name-validation is-valid': component.state.isNameValid,
      'model-instance-name-validation is-invalid': !component.state.isNameValid
    });


    return (
      <li>
        <div className={cClasses}>
          <div data-ui-type="table" className="modelproperty-detail-row" >
            <div data-ui-type="row">
              <span data-ui-type="cell" className={propertyCellValidationClasses}>
                <input ref="propName"
                  data-name="name"
                  required="true"
                  type="text"
                  onChange={component.checkSubmitModelProperty}
                  onBlur={component.triggerModelPropertyUpdate}
                  value={modelProperty.name} />
              </span>
              <span data-ui-type="cell" className="props-data-type-cell">
                <DataTypeSelect scope={scope} modelProperty={component.state.modelProperty} type={modelProperty.type} />
              </span>
              <span data-ui-type="cell" className="props-isid-cell">
                <input type="checkbox"
                  data-name="isId"
                  name="isId"
                  onChange={component.triggerModelPropertyUpdate}
                  checked={modelProperty.isId}
                  value={modelProperty.isId}
                  className="model-instance-editor-checkbox" />
              </span>
              <span data-ui-type="cell" className="props-required-cell">
                <input type="checkbox"
                  data-name="required"
                  name="required"
                  onChange={component.triggerModelPropertyUpdate}
                  checked={modelProperty.required}
                  value={modelProperty.required}
                  className="model-instance-editor-checkbox" />
              </span>
              <span data-ui-type="cell" className="props-index-cell">
                <input type="checkbox"
                  data-name="index"
                  name="index"
                  onChange={component.triggerModelPropertyUpdate}
                  checked={modelProperty.index}
                  value={modelProperty.index}
                  className="model-instance-editor-checkbox" />
              </span>
              <span data-ui-type="cell" className="props-comments-cell">
                <input type="text"
                  data-name="comments"
                  name="comments"
                  onBlur={component.triggerModelPropertyUpdate}
                  value={modelProperty.comments}
                  className="property-doc-textarea model-instance-editor-input" />
              </span>
              <span data-ui-type="cell" className="props-controls-cell">
                <button className="props-remove-btn" onClick={component.deleteModelProperty} data-id={modelProperty.id}>
                  <span data-id={modelProperty.id} className="glyphicon glyphicon-remove"></span>
                </button>

              </span>

            </div>
          </div>
          <div className={propertyValidationContainerClasses}>
            <span className="validation-error-message">
            Property name should conform with <a href="https://mathiasbynens.be/notes/javascript-identifiers" target="_new">valid javascript variable name conventions</a>
            </span>
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

var MigrateButton = (MigrateButton = React).createClass({
  getInitialState: function() {
    return {scope: this.props.scope};
  },
  handleClick: function() {
    var component = this;
    var config = this.state.scope.activeInstance.config;

    component
      .props
      .scope
      .migrateModelConfig(config);
  },
  render: function() {
    var activeInstance = this.state.scope.activeInstance;
    var canMigrate = activeInstance.canMigrate;
    if(activeInstance.isMigrating) {
      return (<strong className="model-migrate-loading">Migrating...</strong>);
    } else {
      return (<button
      title={canMigrate ? ''
        : 'Select a data source that supports migration to enable this feature.'}
      disabled={canMigrate ? '' : 'disabled'}
      className="model-detail-pocket-button model-migrate-button"
      onClick={this.handleClick}>Migrate Model</button>)
    }
  }
});
