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
                The name needs to conform with <a target="_blank" href="http://docs.strongloop.com/display/public/LB/Valid+names+in+LoopBack" >javascript conventions</a>
              </span>
            </div>
          </div>
          <div className="lineBreak"></div>

          <button
            type="button"
            className="model-instance-header-btn btn-block"
            title="Details" >
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
                  <label>Data source</label>
                </div>
                <select value={component.state.activeInstance.config.dataSource || 'none'}
                  data-name="config.dataSource"
                  name="dataSource"
                  onChange={component.handleDataSourceChange}
                  className="model-instance-editor-input">
                  <option value="">none</option>
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
