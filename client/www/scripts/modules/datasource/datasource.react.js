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
      isConnectorValid: this.isConnectorValid(this.props.scope.activeInstance.connector),
      isFormValid: (this.isNameValid(this.props.scope.activeInstance.name) && this.props.scope.activeInstance.connector)
    }
  },
  componentWillReceiveProps: function(nextProps) {
    var component = this;
    component.setState({
      activeInstance:nextProps.scope.activeInstance,
      isNameValid: component.isNameValid(nextProps.scope.activeInstance.name),
      isConnectorValid: component.isConnectorValid(nextProps.scope.activeInstance.connector),
      isFormValid: (component.isNameValid(nextProps.scope.activeInstance.name) && nextProps.scope.activeInstance.connector)
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
      xActiveInstance[dsPropName] = event.target.value;
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
  buildRequestData: function(theForm) {
    var requestData = {};
    for (var i = 0;i < theForm.length;i++) {
      if (theForm[i].value) {
        requestData[theForm[i].name] = theForm[i].value;
      }
    }
    return requestData;
  },
  testConnection: function(event) {
    var scope = this.props.scope;
    var requestData = this.buildRequestData(event.target.form);
    scope.$apply(function() {
      scope.testDataSourceConnection(requestData);
    });
    return false;
  },
  saveHandler: function(event) {
    var scope = this.props.scope;
    var requestData = this.buildRequestData(event.target.form);
    if (requestData.name.length > 0) {
      scope.$apply(function() {
        scope.updateOrCreateDatasource(requestData);
      });
    }
  },
  render: function() {
    var component = this;
    var cx = React.addons.classSet;
    var dsModel = component.state.activeInstance;
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

    return (
      <div data-id="DatasourceEditorInstanceContainer" className="datasource-editor-instance-container">
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
              onChange={this.handleChange}
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
                      onChange={this.handleChange}
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
                      onChange={this.handleChange}
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
                    onChange={this.handleChange}
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
                    onChange={this.handleChange}
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
                    onChange={this.handleChange}
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
                        required="true"
                        value={dsModel.connector}
                        onChange={this.handleChange}
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
            <button onClick={component.testConnection} data-id={dsModel.id}  className="model-detail-pocket-button model-save-button datasource-test-button">Test Connection</button>
          </div>
        </form>
      </div>
      );
  }
});
