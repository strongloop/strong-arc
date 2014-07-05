/** @jsx React.DOM */

/*
*
*   Datasource Form View
*
* */
var DatasourceEditorView = (DatasourceEditorView = React).createClass({
  render: function() {
    return (
      <form name="DatasourceForm" role="form">
        <div className="form-group">
          <label for="InputDatasourceName">Name</label>
          <input id="InputDatasourceName"
            className="form-control"
            name="InputDatasourceName"
            type="text"
            placeholder="name"
            ng-model="cDatasource.name" />
        </div>
        <div className="form-group">
          <label for="InputDefaultForType">Default For Type</label>
          <input id="InputDefaultForType"
            className="form-control"
            name="InputDefaultForType"
            type="text"
            placeholder="default for type"
            ng-model="cDatasource.defaultForType" />
        </div>
        <div className="form-group">
          <label for="InputConnector">Connector</label>
          <select ng-model="cDatasource.connector"
            id="InputConnector"
            name="InputConnector"
            ng-change="updateCurrDatasourceConnector()">
            <option value="loopback-connector-mysql">My SQL</option>
            <option value="loopback-connector-mongodb">Mongo DB</option>
            <option value="loopback-connector-oracle">Oracle</option>
          </select>
        </div>
        <div className="form-group">
          <label for="InputDatabase">Database</label>
          <input id="InputDatabase"
            className="form-control"
            name="InputDatabase"
            type="text"
            placeholder="database name"
            ng-model="cDatasource.database" />
        </div>
        <div className="form-group">
          <label for="InputHost">Host</label>
          <input id="InputHost"
            className="form-control"
            name="InputHost"
            type="text"
            placeholder="host"
            ng-model="cDatasource.host" />
        </div>
        <div className="form-group">
          <label for="InputPort">Port</label>
          <input id="InputPort"
            className="form-control"
            name="InputPort"
            type="text"
            placeholder="port"
            ng-model="cDatasource.port" />
        </div>
        <div className="form-group">
          <label for="InputUsername">Username</label>
          <input id="InputUsername"
            className="form-control"
            name="InputUsername"
            type="text"
            placeholder="username"
            ng-model="cDatasource.username" />
        </div>
        <div className="form-group">
          <label for="InputPassword">Password</label>
          <input id="InputPassword"
            className="form-control"
            name="InputPassword"
            type="password"
            placeholder="password"
            ng-model="cDatasource.password" />
        </div>
        <div className="form-group">
          <label for="InputDebug">Debug</label>
          <input id="InputDebug"
            className="form-control"
            name="InputDebug"
            type="text"
            placeholder="debug"
            ng-model="cDatasource.debug" />
        </div>

        <div>
          <input type="button"
            className="primary pull-right"
            value="save"
            ng-model="cDatasource"
            ng-click="saveDatasource()" />
        </div>
        <div>&nbsp;</div>
      </form>
    );
  }
});
