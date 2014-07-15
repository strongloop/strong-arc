/** @jsx React.DOM */

/*
*
*   Datasource Form View
*
* */
var DatasourceEditorView = (DatasourceEditorView = React).createClass({
  render: function() {
    var scope = this.props.scope;

    var saveHandler = function(event) {

      var theForm = event.target.form;


      var requestData = {};
//      var explorerRequestObj = {
//        path: api.path,
//        method: apiDetails.httpMethod,
//        endPoint: sourceEndPoint,
//        data: {}
//      };
      for (var i = 0;i < theForm.length;i++) {
        if (theForm[i].value) {
          console.log('Processing Form : ' + theForm[i].name + ' = ' + theForm[i].value);
          requestData[theForm[i].name] = theForm[i].value;
        }
      }

      if (requestData.name.length > 0) {
        console.log('submit this form: ' + JSON.stringify(requestData));
        scope.$apply(function() {
          scope.updateOrCreateDatasource(requestData);
        });
      }





    };

    return (
      <form name="DatasourceForm" role="form">
        <div className="form-group">
          <label for="name">Name</label>
          <input id="name"
            className="form-control"
            name="name"
            type="text"
            placeholder="name" required="true" />
        </div>
        <div className="form-group">
          <label for="defaultForType">Default For Type</label>
          <input id="defaultForType"
            className="form-control"
            name="defaultForType"
            type="text"
            placeholder="default for type" />
        </div>
        <div className="form-group">
          <label for="connector">Connector</label>
          <select
            id="connector"
            name="connector">
            <option value="loopback-connector-mysql">My SQL</option>
            <option value="loopback-connector-mongodb">Mongo DB</option>
            <option value="loopback-connector-oracle">Oracle</option>
          </select>
        </div>
        <div className="form-group">
          <label for="database">Database</label>
          <input id="database"
            className="form-control"
            name="database"
            type="text"
            placeholder="database name" />
        </div>
        <div className="form-group">
          <label for="host">Host</label>
          <input id="host"
            className="form-control"
            name="host"
            type="text"
            placeholder="host" />
        </div>
        <div className="form-group">
          <label for="port">Port</label>
          <input id="port"
            className="form-control"
            name="port"
            type="text"
            placeholder="port" />
        </div>
        <div className="form-group">
          <label for="userName">Username</label>
          <input id="userName"
            className="form-control"
            name="userName"
            type="text"
            placeholder="username" />
        </div>
        <div className="form-group">
          <label for="password">Password</label>
          <input id="password"
            className="form-control"
            name="password"
            type="password"
            placeholder="password" />
        </div>
        <div className="form-group">
          <label for="debug">Debug</label>
          <input id="debug"
            className="form-control"
            name="debug"
            type="text"
            placeholder="debug" />
        </div>

        <div>
          <input type="button"
            onClick={saveHandler}
            className="primary pull-right"
            value="save" />
        </div>
        <div>&nbsp;</div>
      </form>
    );
  }
});
