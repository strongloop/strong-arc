/** @jsx React.DOM */
var ExplorerMain = (ExplorerMain = React).createClass({
  render: function() {
    var scope = this.props.scope;
    var explorerResources = scope.explorerResources;
    var items = <li></li>;

    items = explorerResources.map(function(resource) {
      var config = JSON.stringify(resource.config);

      var apis = resource.config.apis.map(function(api) {
      var apiDetails = api.operations[0];

        var parameters = apiDetails.parameters.map(function(param) {
          return (
            <li>name: <em>{param.name}</em>  [type: {param.paramType}]</li>);
        });
        return (
          <li className="explorer-api-detail-item">
            <div className="explorer-endpoint-title">{apiDetails.nickname}</div>
            <div className="explorer-endpoint-container">
              <div>path: {api.path}</div>
              <div>method: {apiDetails.httpMethod}</div>
              <div className="explorer-parameters-container">
                <button className="btn-explorer-property-toggle">parameters:</button>
                <ul className="explorer-parameters-list">{parameters}</ul>
              </div>
            </div>
          </li>);
      });
      var getNameFromPath = function(resource) {
        var rawPath = resource.path;
        var parts = rawPath.split("/");
        var returnPath = parts[(parts.length - 1)];

        return returnPath;
      };
      return (<li>
        <button className="btn btn-default btn-block">{getNameFromPath(resource)}</button>
        <div>
        <h3>Model API End Points</h3>
        <ul>{apis}</ul>
        </div>
      </li>);
    });


    return (
        <div className="explorer-view-container">
          <div className="ia-drag-view-title-container">
            <span className="title">explorer</span>
          </div>
          <div className="explorer-view-body">
            Explorer Goes Here
            <ul className="explorer-model-list">{items}</ul>
          </div>
        </div>
      );
  }
});
