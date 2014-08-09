/** @jsx React.DOM */

/*
*
*   Datasource Form View
*
* */
var DatasourceEditorView = (DatasourceEditorView = React).createClass({
  getInitialState: function() {
    return this.props.scope.activeInstance;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps.model);
    console.log('DS editor will receive props');
  },
  handleChange: function(event) {
    var scope = this.props.scope;
    //this.setState({name: event.target.value});
    var stateName = event.target.attributes['data-name'].value;
    var xState = this.state;
    xState[stateName] = event.target.value;
    this.setState(xState);
    console.log('data source form edit handler ');
//    if (event.target.attributes.id) {
//      var modelDetailProperty = event.target.attributes['data-name'].value;
//      var modelDetailValue = event.target.value;
////      scope.$apply(function() {
////        scope.updateModelDetailProperty(modelDetailProperty, modelDetailValue);
////      });
//    }
  },
  render: function() {
    var scope = this.props.scope;

    var dsModel = this.state;

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
            value={dsModel.name}
            onChange={this.handleChange}
            data-name="name"
            placeholder="name"
            required="true" />
        </div>
        <div className="form-group">
          <label for="defaultForType">Default For Type</label>
          <input id="defaultForType"
            className="form-control"
            name="defaultForType"
            type="text"
            value={dsModel.props.defaultForType}
            onChange={this.handleChange}
            data-name="defaultForType"
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
            value={dsModel.props.database}
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
            value={dsModel.props.host}
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
            value={dsModel.props.port}
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
            value={dsModel.props.userName}
            onChange={this.handleChange}
            data-name="userName"
            placeholder="username" />
        </div>
        <div className="form-group">
          <label for="password">Password</label>
          <input id="password"
            className="form-control"
            name="password"
            value={dsModel.props.password}
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
    );
  }
});
