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
      var newValue = null;
      if (event.target.attributes['type'] && (event.target.attributes['type'].value === 'checkbox')) {
        newValue = event.target.checked;
      } else {
        newValue = event.target.value;
      }
      modelPropertyName = event.target.attributes['data-name'].value;
      if (modelPropertyName === 'name') {
        xState.isNameValid = component.isNameValid(event.target.value);
      }
      if (/^config\./.test(modelPropertyName)) {
        modelPropertyName = modelPropertyName.split('.')[1];
        xState.activeInstance.config[modelPropertyName] = newValue;
      } else {
        xState.activeInstance.definition[modelPropertyName] = newValue;
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
      this.saveModelInstance();
    }
  },
  saveModelInstance: function(event) {
    var component = this;
    if (event && event.preventDefault) {
      event.preventDefault();
    }
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
      'model-editor-section-icon sl-icon sl-icon-minus-thick': component.state.isDetailsContainerOpen,
      'model-editor-section-icon sl-icon sl-icon-plus-thick': !component.state.isDetailsContainerOpen
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
              className="instance-detail-pocket-button instance-save-button"
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
      isPropertiesContainerOpen:true,
      scope: this.props.scope,
      properties: this.props.scope.activeInstance.properties
    };
  },
  componentWillReceiveProps: function(nextProps) {
    var component = this;
    component.setState({
      scope: nextProps.scope,
      properties: nextProps.scope.activeInstance.properties
    });
  },
  shouldComponentUpdate: function(nextProps, nextState) {

    // return this.state.isOpen !== nextState.isOpen;
    return true;
  },
  triggerNewPropertyEditor: function() {
    var scope = this.props.scope;
    if (scope.activeInstance.id !== CONST.NEW_MODEL_PRE_ID){
      scope.$apply(function() {
        scope.createNewModelProperty();
      });
    }
    else {
      scope.$apply(function() {
        scope.earlyNewPropertyWarning();
      });
    }
  },
  toggleModelProperties: function() {
    $('[data-id="ModelPropertyListContainer"]').toggle(250);
    var currState = this.state.isPropertiesContainerOpen;
    this.setState({isPropertiesContainerOpen:!currState});
  },
  render: function() {

    var component = this;

    var scope = component.state.scope;
    var properties = component.state.properties;
    var cx = React.addons.classSet;

    var classes = cx({
      'row is-open': component.state.isOpen,
      'row is-closed': !component.state.isOpen
    });
    var iconClasses = cx({
      'model-editor-section-icon sl-icon sl-icon-minus-thick': component.state.isPropertiesContainerOpen,
      'model-editor-section-icon sl-icon sl-icon-plus-thick': !component.state.isPropertiesContainerOpen
    });
    var items = properties.map(function (item) {
      return  (<ModelPropertyRowDetail modelProperty={item} scope={scope} />);
    });

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

                  <span data-ui-type="cell" title="required" className="props-required-header table-header-cell">Required</span>

                  <span data-ui-type="cell" title="is index" className="props-index-header table-header-cell">Index</span>

                  <span data-ui-type="cell" title="comments" className="props-comments-header table-header-cell">Comments</span>

                  <span data-ui-type="cell" title="controls" className="props-controls-header table-header-cell"></span>

                  <span data-ui-type="cell" title="controls" className="props-controls-header table-header-cell"></span>


                </div>
              </div>
            </div>
            <ul className="model-instance-property-list">
            {items}
            </ul>
            <button title="New Property" type="button" onClick={component.triggerNewPropertyEditor} className="btn-new-model-property" >New Property</button>          </div>
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
*   container for each property item
*
* */
var ModelPropertyRowDetail = (ModelPropertyRowDetail = React).createClass({
  getInitialState: function() {
    return {
      currModelId:this.props.modelProperty.modelId,
      modelProperty:this.props.modelProperty,
      isOpen:false,
      scope: this.props.scope,
      isNameValid: true
    };
  },
  componentWillReceiveProps: function(nextProps) {
    var component = this;
    component.setState({
      modelProperty:nextProps.modelProperty,
      scope: nextProps.scope,
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
      'sl-icon sl-icon-open-sign': component.state.isOpen,
      'sl-icon sl-icon-closed-sign': !component.state.isOpen
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
              <div data-ui-type="cell" className={propertyCellValidationClasses}>
                <input ref="propName"
                  data-name="name"
                  required="true"
                  type="text"
                  onChange={component.checkSubmitModelProperty}
                  onBlur={component.triggerModelPropertyUpdate}
                  value={modelProperty.name} />
              </div>
              <div data-ui-type="cell" className="props-data-type-cell">
                <DataTypeSelect scope={component.state.scope} modelProperty={component.state.modelProperty} type={modelProperty.type} />
              </div>
              <div data-ui-type="cell" className="props-isid-cell">
                <input type="checkbox"
                  data-name="isId"
                  name="isId"
                  onChange={component.triggerModelPropertyUpdate}
                  checked={modelProperty.isId}
                  value={modelProperty.isId}
                  className="model-instance-editor-checkbox" />
              </div>
              <div data-ui-type="cell" className="props-required-cell">
                <input type="checkbox"
                  data-name="required"
                  name="required"
                  onChange={component.triggerModelPropertyUpdate}
                  checked={modelProperty.required}
                  value={modelProperty.required}
                  className="model-instance-editor-checkbox" />
              </div>
              <div data-ui-type="cell" className="props-index-cell">
                <input type="checkbox"
                  data-name="index"
                  name="index"
                  onChange={component.triggerModelPropertyUpdate}
                  checked={modelProperty.index}
                  value={modelProperty.index}
                  className="model-instance-editor-checkbox" />
              </div>
              <div data-ui-type="cell" className="props-comments-cell">
                <input type="text"
                  data-name="comments"
                  name="comments"
                  onChange={component.triggerModelPropertyUpdate}
                  onBlur={component.triggerModelPropertyUpdate}
                  value={modelProperty.comments}
                  className="property-doc-textarea model-instance-editor-input" />
              </div>
              <div data-ui-type="cell" className="props-controls-cell">
                <button alt="save" title="save" className="props-remove-btn">
                  <span className="glyphicon glyphicon-floppy-save"></span>
                </button>
              </div>
              <div data-ui-type="cell" className="props-controls-cell">
                <button className="props-remove-btn" onClick={component.deleteModelProperty} data-id={modelProperty.id}>
                  <span data-id={modelProperty.id} className="sl-icon sl-icon-close"></span>
                </button>
              </div>
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

/*
* DataTypeSelect - Component to manage property 'type' value
* - type value can be a wide variety of patterns including:
* -- string
* -- js object
* -- model name reference
* -- array of any of the above
*
* - it is possible users may edit the json directly in the project
*     in a way that isn't possible via the gui - generally in the form of
*     'anonymous' js object patterns
*     eg:
         {
           "x": {
             "type": "number"
           },
           "y": {
             "type": "string"
           }
         }
* - these can be direct type values or arrays of these patterns
* - if an 'anonymous' object pattern is detected it is displayed read only
* - if the user tries to change the value of a property type that includes an
*     anonymous js object pattern they will be alerted that the current value
*     will be destroyed if they continue
*
* This component may display 2 select components if the data type is an array
*   so the user can choose the type of array
* - DataTypeSelectOptions
*
* If the value is an ajop either directly or in an array, a control is displayed to
*   allow the user to view the object pattern
*
* */
var DataTypeSelect = (DataTypeSelect = React).createClass({
  getInitialState: function() {
    return {
      isArray:(this.getDataTypeString(this.props.modelProperty.type) === 'array'),
      isAnonObject:(this.isAnonObj(this.props.modelProperty.type)),
      type:this.props.type,
      arrayType: this.getArrayType(),
      scope:this.props.scope,
      val:this.getDataTypeString(this.props.modelProperty.type),
      showObjDetails:false,
      modelProperty:this.props.modelProperty
    };
  },
  componentWillReceiveProps: function(nextProps) {
    var component = this;
    component.setState({
      isArray:(this.getDataTypeString(nextProps.modelProperty.type) === 'array'),
      isAnonObject:(this.isAnonObj(nextProps.modelProperty.type)),
      val:this.getDataTypeString(this.props.modelProperty.type),
      arrayType: this.getArrayType(),
      type:nextProps.modelProperty.type
    });
  },
  handleChange: function(event) {
    var scope = this.props.scope;
    var modelPropertyName = '';
    if (event.target.attributes['data-name']) {
      modelPropertyName = event.target.attributes['data-name'].value;

      var xState = this.state;
      if (this.state.isAnonObject) {

        if (confirm('This value has been edited outside the scope of this gui.  ' +
            'If you change it the existing value will be lost. Continue?')) {
            xState.modelProperty[modelPropertyName] = event.target.value;
            this.setState(xState);
            scope.$apply(function() {
              scope.updateModelPropertyRequest(xState.modelProperty);
            });
          }
      }
      else {
        xState.modelProperty[modelPropertyName] = event.target.value;
        this.setState(xState);
        scope.$apply(function() {
          scope.updateModelPropertyRequest(xState.modelProperty);
        });
      }
    }
  },
  getArrayType: function() {
    var component = this;
    var retVal = 'any'; // default
    var typeString = component.getDataTypeString(this.props.modelProperty.type);
    if (typeString === 'array') {
      var propType = component.props.modelProperty.type;
      if (Array.isArray(propType)) {
        retVal = propType[0];
        if (typeof retVal === 'object') {
          retVal = Array.isArray(retVal)? 'array' : 'object';
        }
      }
    }
    return retVal;
  },
  updatePropertyType: function(value) {
    var component = this;
    var property = component.state.modelProperty;
    property.type = [value];
    component.setState({arrayType: event.target.value});
    component.setState({modelProperty: property});
    scope.$apply(function() {
      scope.updateModelPropertyRequest(component.state.modelProperty);
    });
  },
  handleArrayTypeChange: function(event) {
    var component = this;
    var scope = component.props.scope;
    var modelProperty = component.props.modelProperty;
    var modelPropertyName = '';

    if (event.target.attributes['data-name']) {

      if (this.state.isAnonObject) {

        if (confirm('This value has been edited outside the scope of this gui. ' +
          'If you change it the existing value will be lost. Continue?')) {
            component.updatePropertyType(event.target.value);
          }
      }
      else {
        component.updatePropertyType(event.target.value);
      }
    }
  },
  isAnonObj: function(value) {
    var isAnonObject = false;
    var tO = (typeof value);
    if (tO !== 'object') {
      return isAnonObject;
    }
    var isArray = Array.isArray(value)? true : false;

    // if not object, may be an array of anon obj
    if (isArray) {
      if (typeof value[0] === 'object') {
        isAnonObject = true;
      }
    }
    else {
      isAnonObject = true;
    }
    return isAnonObject;
  },
  getDataTypeString: function(value) {
    var retVal = value;
    if (typeof retVal === 'object') {
      retVal = Array.isArray(retVal)? 'array' : 'object';
    }
    return retVal;
  },
  getAppModelNames: function() {
    var retVal = [];
    if (this.state.scope && this.state.scope.mainNavModels){
      this.state.scope.mainNavModels.map(function(model) {
        retVal.push(model.name);
      });
    }
    return retVal;
  },

  render: function() {
    var component = this;
    var cx = React.addons.classSet;

    var toggleAnonObjectDetails = function() {
      var currentState = component.state.showObjDetails;
      var newState = !currentState;
      component.setState({showObjDetails:newState});

    };

    var arrayDetailContainer = cx({
      'array-detail-container is-open': component.state.isArray,
      'array-detail-container is-closed': !component.state.isArray
    });
    var objectDetailContainer = cx({
      'object-detail-container is-open': component.state.isAnonObject,
      'object-detail-container is-closed': !component.state.isAnonObject
    });
    var objectDetail = cx({
      'object-detail is-open': component.state.showObjDetails,
      'object-detail is-closed': !component.state.showObjDetails
    });

    return (
      <div>
        <DataTypeSelectOptions
          modelProperty={component.state.modelProperty}
          data-name="type"
          scope={component.state.scope}
          val={component.state.val}
          onChange={component.handleChange} />
        <div className={arrayDetailContainer}>
          <label>of</label>
          <DataTypeSelectOptions
            modelProperty={component.state.modelProperty}
            data-name="sub-type"
            scope={component.state.scope}
            val={component.state.arrayType}
            onChange={component.handleArrayTypeChange} />
        </div>
        <div className="property-type-object-definition-display">
          <div className={objectDetailContainer}>
            <button className="btn-command" onClick={toggleAnonObjectDetails}>details</button>
            <div className="abs-container">
              <code className={objectDetail}>
              {JSON.stringify(component.state.type)}
              </code>
            </div>
          </div>
        </div>
      </div>
      );
  }
});
/*
* DataTypeSelectOptions - drop down select component to allow users to
*   choose the type of data or the type of array for a particular model
*   property type
*
*   note: it inherits the onchange method from the parent props.
*
* */
var DataTypeSelectOptions = (DataTypeSelectOptions = React).createClass({
  getInitialState: function() {
    return {
      onChangeFunc:this.props.onChange,
      value: this.props.val,
      modelProperty:this.props.modelProperty
    };
  },
  componentWillReceiveProps: function(nextProps) {
    var component = this;
    component.setState({
      onChangeFunc:nextProps.onChange,
      value: nextProps.val,
      modelProperty:nextProps.modelProperty
    });
  },
  render: function() {
    var component = this;


    var options = this.props.scope.modelPropertyTypes.map(function(item) {
        return (<option value={item} >{item}</option>);
    });
    return (
      <select value={component.state.value} data-name={component.props['data-name']} onChange={component.state.onChangeFunc}>
        {options}
      </select>
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

    if (config.dataSource === CONST.DEFAULT_DATASOURCE) {
      config.dataSource = null;
    }
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
      className="instance-detail-pocket-button model-migrate-button"
      type="button"
      onClick={this.handleClick}>Migrate Model</button>)
    }
  }
});
