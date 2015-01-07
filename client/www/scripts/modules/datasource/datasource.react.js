/** @jsx React.DOM */

/*
*
*   Datasource Form View
*
* */
var DatasourceEditorView = (DatasourceEditorView = React).createClass({
  getInitialState: function() {
    return {
      activeInstance: this.props.scope.activeInstance,
      isNameValid: this.isNameValid(this.props.scope.activeInstance.name),
      isConnectorValid: this.isConnectorValid(this.props.scope.activeInstance.definition.connector),
      isFormValid: (this.isNameValid(this.props.scope.activeInstance.definition.name) && this.props.scope.activeInstance.definition.connector),
      testConnectionMessage:'',
      testConnectionMessageType: 'success',
      isTesting: false
    }
  },
  componentWillReceiveProps: function(nextProps) {
    var component = this;

    component.setState({
      activeInstance:nextProps.scope.activeInstance,
      isNameValid: component.isNameValid(nextProps.scope.activeInstance.definition.name),
      isConnectorValid: component.isConnectorValid(nextProps.scope.activeInstance.definition.connector),
      isFormValid: (component.isNameValid(nextProps.scope.activeInstance.definition.name) && nextProps.scope.activeInstance.definition.connector)
    });
    if (nextProps.scope.datasource.connectionTestResponse){
      component.setState({isTesting:false});
    }
    component.setState({
      activeInstance: nextProps.scope.activeInstance,
      testConnectionMessage: nextProps.scope.datasource.connectionTestResponse,
      testConnectionMessageType: nextProps.scope.datasource.connectionTestResponseType
    });
  },
  clearMessages: function() {
    var scope = this.props.scope;
    this.setState({
        testConnectionMessage: '',
        testConnectionMessageType: 'success'
      }
    );
    scope.$apply(function() {
      scope.clearTestMessage();
    });
  },
  isConnectorValid: function(connector) {
    if (!connector) {
      return false;
    }
    var availableConnectors = this.props.scope.connectorMetadata;
    return availableConnectors.some(function(it) {
      return it.name === connector;
    });
  },
  isNameValid: function(name) {
    return /^[\-_a-zA-Z0-9]+$/.test(name);
  },
  handleChange: function(event) {
    var component = this;
    if (event.target.attributes['data-name']) {
      var dsPropName = event.target.attributes['data-name'].value;
      var xActiveInstance = this.state.activeInstance;
      xActiveInstance.definition[dsPropName] = event.target.value;
      this.setState({activeInstance:xActiveInstance});

      if (dsPropName === 'name') {
        var isNameValid = component.isNameValid(event.target.value);
        component.setState({
          isNameValid: isNameValid
        });
      }
      if (dsPropName === 'connector') {
        var isConnectorValid = component.isConnectorValid(event.target.value);
        component.setState({
          isConnectorValid: isConnectorValid
        });
      }

    }
  },
  testConnection: function(event) {
    event.preventDefault();
    var scope = this.props.scope;
    var requestData = this.state.activeInstance;
    scope.$apply(function() {
      scope.testDataSourceConnection(requestData);
    });
  },
  saveHandler: function(event) {
    var component = this;
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    if (component.state.isNameValid && component.state.isConnectorValid) {
      var scope = this.props.scope;
      var requestData = this.state.activeInstance;
      scope.$apply(function() {
        scope.saveDataSourceInstanceRequest(requestData);
      });
    }
  },
  render: function() {
    var component = this;
    var cx = React.addons.classSet;
    var dsModel = component.state.activeInstance.definition;
    var dsNameInputClasses = cx({
      'model-instance-name form-control': component.state.isNameValid,
      'model-instance-name form-control is-invalid': !component.state.isNameValid
    });
    var dsNameValidationClasses = cx({
      'model-instance-name-validation is-valid': component.state.isNameValid,
      'model-instance-name-validation is-invalid': !component.state.isNameValid
    });
    var formGroupValidationClasses = cx({
      'model-header-name-container form-group': component.state.isNameValid,
      'model-header-name-container form-group has-error': !component.state.isNameValid
    });
    var formGroupConnectorValidationClasses = cx({
      'form-group': component.state.isConnectorValid,
      'form-group has-error': !component.state.isConnectorValid
    });
    var isFormValid = false;
    if (component.state.isNameValid && component.state.isConnectorValid) {
      isFormValid = true;
    }
    var testButtonClasses = cx({
      'instance-detail-pocket-button instance-save-button activity-indicator datasource-test-button': component.state.isTesting,
      'instance-detail-pocket-button instance-save-button datasource-test-button': !component.state.isTesting
    });

    var testMessageClasses = cx({
      'ui-msg-inline-success': component.state.testConnectionMessageType === 'success',
      'ui-msg-inline-error': component.state.testConnectionMessageType === 'error',
      'datasource-connection-test-response-container': true
    });
    var connectorOptions = this.props.scope.connectorMetadata.map(function(it) {
       return (<option value={it.name}>{it.description}</option>);
    });

    return (
      <div onClick={component.clearMessages} data-id="DatasourceEditorInstanceContainer" className="datasource-editor-instance-container">
        <form name="DatasourceForm" role="form">
          <div className="model-header-container">
            <div className={formGroupValidationClasses}>
              <label for="name">Name</label>
              <input id="name"
              className={dsNameInputClasses}
              required="true"
              name="name"
              type="text"
              value={dsModel.name}
              onChange={component.handleChange}
              data-name="name"
              onBlur={component.saveHandler}
              placeholder="name"
              required="true" />
            </div>
            <button disabled={!isFormValid} type="button" onClick={component.saveHandler} data-id="datasource-save-button" className="instance-detail-pocket-button instance-save-button">Save Datasource</button>
            <div className={dsNameValidationClasses}>
              <span className="validation-error-message">
              DataSource name should conform with <a href="http://docs.strongloop.com/display/public/LB/Valid+names+in+LoopBack" target="_new">valid javascript variable name conventions</a>
              </span>
            </div>
          </div>
          <div className="lineBreak"></div>
          <div className="datasource-field-container">
            <div data-ui-type="table"  className="datasource-layout-table">
              <div data-ui-type="row" className="datasource-layout-row">
                <div data-ui-type="cell" className="datasource-layout-col1">
                  <div className="username-input-container">
                    <div className="datasource-form-group">
                      <label for="user">Username</label>
                      <input id="user"
                        className="form-control"
                        name="user"
                        type="text"
                        value={dsModel.user}
                        onChange={component.handleChange}
                        onBlur={component.saveHandler}
                        data-name="user"
                        placeholder="user" />
                    </div>
                  </div>
                </div>
                <div data-ui-type="cell" className="datasource-layout-col2">
                  <div className="password-container">
                    <div className="datasource-form-group">
                      <label for="password">Password</label>
                      <input id="password"
                      className="form-control"
                      name="password"
                      value={dsModel.password}
                      onChange={component.handleChange}
                      onBlur={component.saveHandler}
                      data-name="password"
                      type="password"
                      placeholder="password" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lineBreak"></div>
            <div data-ui-type="table" className="datasource-layout-table">
              <div data-ui-type="row" className="datasource-layout-row">
                <div data-ui-type="cell" className="datasource-layout-fullwidth-col">
                  <div className="datasource-form-group">
                    <label for="host">Url</label>
                    <input id="url"
                    className="form-control"
                    name="url"
                    value={dsModel.url}
                    onChange={component.handleChange}
                    onBlur={component.saveHandler}
                    data-name="url"
                    type="text"
                    placeholder="url" />
                  </div>
                </div>
              </div>
            </div>
            <div data-ui-type="table" className="datasource-layout-table">
              <div data-ui-type="row" className="datasource-layout-row">
                <div data-ui-type="cell" className="datasource-layout-col1">
                  <div className="datasource-form-group">
                    <label for="host">Host</label>
                    <input id="host"
                    className="form-control"
                    name="host"
                    value={dsModel.host}
                    onChange={component.handleChange}
                    onBlur={component.saveHandler}
                    data-name="host"
                    type="text"
                    placeholder="host" />
                  </div>
                </div>
                <div data-ui-type="cell" className="datasource-layout-col2">
                  <div className="datasource-form-group">
                    <label for="port">Port</label>
                    <input id="port"
                    className="form-control"
                    name="port"
                    value={dsModel.port}
                    onChange={component.handleChange}
                    onBlur={component.saveHandler}
                    data-name="port"
                    type="text"
                    placeholder="port" />
                  </div>
                </div>
              </div>
              <div data-ui-type="row"  className="datasource-layout-row">
                <div data-ui-type="cell" className="datasource-layout-col1">
                  <input type="hidden" data-name="id" name="id" value={dsModel.id} />
                  <div className="datasource-form-group">
                    <label for="database">Database</label>
                    <input id="database"
                    className="form-control"
                    name="database"
                    value={dsModel.database}
                    onChange={component.handleChange}
                    onBlur={component.saveHandler}
                    data-name="database"
                    type="text"
                    placeholder="database name" />
                  </div>
                </div>
                <div data-ui-type="cell" className="datasource-layout-col2">
                  <div className={formGroupConnectorValidationClasses}>
                    <label for="connector">Connector</label>
                    <select className="form-control model-instance-editor-input"
                        id="connector"
                        value={dsModel.connector}
                        onChange={component.handleChange}
                        onBlur={component.saveHandler}
                        data-name="connector"
                        name="connector" >
                      <option value="">choose</option>
                      {connectorOptions}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="datasource-buttons-layout-container">
            <button onClick={component.testConnection} data-id={dsModel.id} className={testButtonClasses}>Test Connection</button>
            <span className={testMessageClasses}>{component.state.testConnectionMessage}</span>
          </div>
        </form>
      </div>
      );
  }
});
