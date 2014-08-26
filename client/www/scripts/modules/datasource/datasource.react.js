/** @jsx React.DOM */

/*
*
*   Datasource Form View
*
* */
var DatasourceEditorView = (DatasourceEditorView = React).createClass({
  getInitialState: function() {
    return {activeInstance: this.props.scope.activeInstance}
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({activeInstance:nextProps.scope.activeInstance});
  },
  handleChange: function(event) {
    var scope = this.props.scope;
    //this.setState({name: event.target.value});
    var stateName = event.target.attributes['data-name'].value;
    var xActiveInstance = this.state.activeInstance;
    xActiveInstance[stateName] = event.target.value;
    this.setState({activeInstance:xActiveInstance});

  },
  render: function() {
    var scope = this.props.scope;

    var dsModel = this.state.activeInstance;

    var buildRequestData = function(theForm) {
      var requestData = {};

      for (var i = 0;i < theForm.length;i++) {
        if (theForm[i].value) {
          requestData[theForm[i].name] = theForm[i].value;
        }
      }

      return requestData;
    };

    var testConnection = function(event) {
      var requestData = buildRequestData(event.target.form);
      scope.$apply(function() {
        scope.testDataSourceConnection(requestData);
      });
      return false;
    };

    var saveHandler = function(event) {
      var requestData = buildRequestData(event.target.form);

      if (requestData.name.length > 0) {
        scope.$apply(function() {
          scope.updateOrCreateDatasource(requestData);

        });
      }

    };

    return (
      <div data-id="DatasourceEditorInstanceContainer" className="datasource-editor-instance-container">
        <form name="DatasourceForm" role="form">
          <div className="model-header-container">
            <div className="model-header-name-container form-group">
              <label for="name">Name</label>
              <input id="name"
              className="model-instance-name form-control"
              name="name"
              type="text"
              value={dsModel.name}
              onChange={this.handleChange}
              data-name="name"
              placeholder="name"
              required="true" />
            </div>
            <button type="button" onClick={saveHandler} className="model-detail-pocket-button model-save-button">Save Datasource</button>
          </div>
          <div className="lineBreak"></div>
          <div className="datasource-field-container">
            <div data-ui-type="table"  className="datasource-layout-table">
              <div data-ui-type="row" className="datasource-layout-row">
                <div data-ui-type="cell" className="datasource-layout-col1">
                  <div className="username-input-container">
                    <div className="datasource-form-group">
                      <label for="userName">Username</label>
                      <input id="userName"
                      className="form-control"
                      name="userName"
                      type="text"
                      value={dsModel.userName}
                      onChange={this.handleChange}
                      data-name="userName"
                      placeholder="username" />
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
                  <div className="form-group">
                    <label for="connector">Connector</label>
                    <select className=
                    "model-instance-editor-input"
                    id="connector"
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
            <button onClick={testConnection} data-id={dsModel.id}  className="model-detail-pocket-button model-save-button datasource-test-button">Test Connection</button>
          </div>
        </form>
      </div>
      );
  }
});
