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
      testConnectionMessage: nextProps.scope.datasource.connectionTestResponse
    });
  },
  clearMessages: function() {
    var scope = this.props.scope;
    this.setState({
        testConnectionMessage:''
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
    var connectors = ["memory","oracle","mssql","mysql","postgresql","mongodb"];
    return (connectors.indexOf(connector) !== -1);
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
    event.preventDefault();
    var scope = this.props.scope;
    var requestData = this.state.activeInstance;
    scope.$apply(function() {
      scope.saveDataSourceInstanceRequest(requestData);
    });
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
      'model-detail-pocket-button activity-indicator model-save-button datasource-test-button': component.state.isTesting,
      'model-detail-pocket-button model-save-button datasource-test-button': !component.state.isTesting
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
              placeholder="name"
              required="true" />
            </div>
            <button disabled={!isFormValid} type="button" onClick={component.saveHandler} className="model-detail-pocket-button model-save-button">Save Datasource</button>
            <div className={dsNameValidationClasses}>
              <span className="validation-error-message">
              DataSource name should conform with <a href="https://mathiasbynens.be/notes/javascript-identifiers" target="_new">valid javascript variable name conventions</a>
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
                <div data-ui-type="cell" className="datasource-layout-col1">
                  <div className="datasource-form-group">
                    <label for="host">Host</label>
                    <input id="host"
                    className="form-control"
                    name="host"
                    value={dsModel.host}
                    onChange={component.handleChange}
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
                        data-name="connector"
                        name="connector" >
                      <option value="">choose</option>
                      <option value="memory">In-Memory</option>
                      <option value="oracle">Oracle</option>
                      <option value="mssql">MS SQL</option>
                      <option value="mysql">MySQL</option>
                      <option value="postgresql">PostgreSQL</option>
                      <option value="mongodb">MongoDB</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="datasource-buttons-layout-container">
            <button onClick={component.testConnection} data-id={dsModel.id} className={testButtonClasses}>Test Connection</button>
            <span className="datasource-connection-test-response-container">{component.state.testConnectionMessage}</span>
          </div>
        </form>
      </div>
      );
  }
});
