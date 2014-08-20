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
      <div data-id="DatasourceEditorInstanceContainer" >
        <form name="DatasourceForm" role="form">
          <button onClick={testConnection}>Test Connection</button>
          <input type="hidden" data-name="id" name="id" value={dsModel.id} />
          <div className="form-group">
            <label for="name">Name</label>
            <input id="name"
              className="form-control"
              name="name"
              type="text"
              value={dsModel.name}
              onChange={this.handleChange}
              data-name="name"
              placeholder="name"
              required="true" />
          </div>
          <div className="form-group">
            <label for="connector">Connector</label>
            <select
              id="connector"
              value={dsModel.connector}
              onChange={this.handleChange}
              data-name="connector"
              name="connector" >
              <option value="">choose</option>
              <option value="loopback-connector-oracle">Oracle</option>
              <option value="loopback-connector-mssql">MsSQL</option>
              <option value="loopback-connector-mysql">MySQL</option>
              <option value="loopback-connector-postgres">Postgres</option>
              <option value="loopback-connector-mongodb">Mongo DB</option>
            </select>
          </div>
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
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
          <div className="form-group">
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

          <div>
            <input type="button"
              onClick={saveHandler}
              className="primary pull-right"
              value="save" />
          </div>
          <div>&nbsp;</div>
        </form>
      </div>

      );
  }
});
