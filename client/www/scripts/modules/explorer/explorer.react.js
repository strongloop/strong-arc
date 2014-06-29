/** @jsx React.DOM */
var ExplorerMain = (ExplorerMain = React).createClass({
  getInitialState: function() {
    return {
      isOpen: false,
      isParamsOpenState: false
    };
  },
  render: function() {
    var scope = this.props.scope;
    var explorerResources = scope.explorerResources;
    var cx = React.addons.classSet;
    var that = this;

    var mainClasses = cx({
      'explorer-model is-open': this.state.isOpen,
      'explorer-model is-closed': !this.state.isOpen
    });



    var items = explorerResources.map(function(resource) {
      var config = JSON.stringify(resource.config);

      var apis = resource.config.apis.map(function(api) {
        var apiDetails = api.operations[0];

        return (
          <li className="explorer-api-detail-item">
            <ExploreModelApiEndPoint apiDetails={apiDetails} api={api} />
          </li>
          );


      });
      var getNameFromPath = function(resource) {
        var rawPath = resource.path;
        var parts = rawPath.split("/");
        var returnPath = parts[(parts.length - 1)];

        return returnPath;
      };

      var explorerMainModelClicked = function(event) {
        var isOpenState = !that.state.isOpen;
        that.setState({isOpen:isOpenState});
      };
      return (<li>
        <button onClick={explorerMainModelClicked} className="btn btn-default btn-block btn-explorer-model-main">{getNameFromPath(resource)}</button>
        <div className={mainClasses}>
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
            API Explorer
            <ul className="explorer-model-list">{items}</ul>
          </div>
        </div>
      );
  }
});
var ExploreModelApiEndPoint = (ExploreModelApiEndPoint = React).createClass({
  getInitialState: function() {
    return {
      isApiOpenState: false
    };
  },
  render: function() {
    var that = this;
    var apiDetails = that.props.apiDetails;
    var api = that.props.api;
    var cx = React.addons.classSet;
    var apiClasses = cx({
      'explorer-model-api-details is-open': that.state.isApiOpenState,
      'explorer-model-api-details is-closed': !that.state.isApiOpenState
    });
    var explorerModelApiClicked = function(event) {
      var isApiOpenState = !that.state.isApiOpenState;
      that.setState({isApiOpenState:isApiOpenState})
    };
    return (
      <div>
        <button onClick={explorerModelApiClicked} className="btn btn-block explorer-endpoint-title">{apiDetails.nickname}</button>
        <div className={apiClasses}>
          <div>path: {api.path}</div>
          <div>method: {apiDetails.httpMethod}</div>
          <div>response class: {apiDetails.responseClass}</div>
          <div>summary: {apiDetails.summary}</div>
          <div>errorResponses: {apiDetails.errorResponses}</div>


          <ExplorerModelApiParameters parameters={apiDetails.parameters} />
        </div>
      </div>);
  }
});
var ExplorerModelApiParameters = (ExplorerModelApiParameters = React).createClass({
  getInitialState: function() {
    return {
      isParamsOpenState: false
    };
  },
  render: function() {
    var cx = React.addons.classSet;
    var that = this;
    var parametersClasses = cx({
      'explorer-model-api-parameters is-open': this.state.isParamsOpenState,
      'explorer-model-api-parameters is-closed': !this.state.isParamsOpenState
    });

    var parameters = this.props.parameters.map(function(param) {
      return (
        <li>
          <ul className="explorer-parameter-item-parameter-list">
            <li>name: <em>{param.name}</em></li>
            <li>paramType: <em>{param.paramType}</em></li>
            <li>description: <em>{param.description}</em></li>
            <li>dataType: <em>{param.dataType}</em></li>
            <li>required: <em>{param.required}</em></li>
            <li>allowMultiple: <em>{param.allowMultiple}</em></li>
          </ul>
        </li>
        );
    });

    var explorerModelApiParametersClicked = function(event) {
      var isParamsOpenState = !that.state.isParamsOpenState;
      that.setState({isParamsOpenState:isParamsOpenState});
    };

    return (
      <div className="explorer-parameters-container">
        <button onClick={explorerModelApiParametersClicked} className="btn-explorer-property-toggle">parameters:</button>
        <ul className={parametersClasses}>{parameters}</ul>
      </div>
      );
  }
});
