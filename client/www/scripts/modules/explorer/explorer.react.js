/** @jsx React.DOM */
/*
 *
 *   Explorer Main
 *
 * */
var ExplorerMain = (ExplorerMain = React).createClass({

  render: function () {
    var scope = this.props.scope;
    var explorerResources = scope.explorerResources;
    var cx = React.addons.classSet;
    var that = this;

//    var mainClasses = cx({
//      'explorer-model is-open': this.state.isOpen,
//      'explorer-model is-closed': !this.state.isOpen
//    });


    var items = (<div />);
    if (explorerResources.map) {
      items = explorerResources.map(function (resource) {
        return <ExploreModelApiEndPointListItem apiResource={resource} scope={scope} />

      });
    }


    /*
     *
     *   Explorer Main Render
     *
     * */
    return (
      <div className="explorer-view-container">
        <div className="ia-drag-view-title-container">
          <span className="title">explorer</span>
        </div>
        <div className="explorer-view-body">
          <ul className="explorer-model-list">{items}</ul>
        </div>
      </div>
      );
  }
});
/*
 *
 * API End Point List Item
 *
 * */
var ExploreModelApiEndPointListItem = (ExploreModelApiEndPointListItem = React).createClass({
  getInitialState: function () {
    return {
      isOpen: false
    };
  },
  getNameFromPath: function(resource) {
    var rawPath = resource.path;
    var parts = rawPath.split("/");
    var returnPath = parts[(parts.length - 1)];

    return returnPath;
  },
  getSingularlarVersion: function(name) {
    // if the last letter of the name is an 's'
    var retVal = '';

    if (name) {
      var originalLength = name.length;
      var testCharacter = name[(originalLength - 1)]
      if (testCharacter.toLowerCase() === 's') {
        retVal = name.slice(0, (originalLength - 1));
      }
    }

    return retVal;
    // slice it off and return the string
  },
  render: function () {

    var cx = React.addons.classSet;
    var that = this;


    var resource = that.props.apiResource;
    var resourceName = that.getNameFromPath(resource);
    var singularResouceName = that.getSingularlarVersion(resourceName);
    var config = JSON.stringify(resource.config);

    var apis = resource.config.apis.map(function (api) {
      var apiDetails = api.operations[0];

      // api endpoint injection
      return (
        <li className="explorer-api-detail-item">
          <ExploreModelApiEndPoint apiDetails={apiDetails} api={api} />
        </li>
        );


    });





    var explorerMainModelClicked = function (event) {
      var isOpenState = !that.state.isOpen;
      that.setState({isOpen: isOpenState});
    };

//    var mainClasses = cx({
//      'explorer-model is-open': this.state.isOpen,
//      'explorer-model is-closed': !this.state.isOpen
//    });
    var mainClasses = '';
    var modelButtonClass = 'btn btn-default btn-block btn-explorer-model-main'

    if (this.state.isOpen) {
      mainClasses = 'explorer-model is-open';
    }
    else {
      mainClasses = 'explorer-model is-closed'
    }
    if (that.props.scope.activeModelInstance.name === singularResouceName) {
      mainClasses = 'explorer-model is-open is-active';
      modelButtonClass += ' is-active';

    }
    return (
      <li>
        <button onClick={explorerMainModelClicked} className={modelButtonClass}>/{resourceName}</button>
        <div className={mainClasses}>
          <div data-ui-type="table" className="explorer-api-endpoint-summary-table item-row-table">
            <div data-ui-type="row">
              <div data-ui-type="cell">
              Name
              </div>
              <div data-ui-type="cell">
              Path
              </div>
              <div data-ui-type="cell"  >
              Method
              </div>
              <div data-ui-type="cell">
              Summary
              </div>
            </div>

          </div>
          <ul>{apis}</ul>
        </div>
      </li>
      );


  }
});
/*
 *
 * API End Point
 *
 * */
var ExploreModelApiEndPoint = (ExploreModelApiEndPoint = React).createClass({
  getInitialState: function () {
    return {
      isApiOpenState: false
    };
  },
  render: function () {
    var that = this;
    var apiDetails = that.props.apiDetails;
    var api = that.props.api;
    var cx = React.addons.classSet;
    var apiClasses = cx({
      'explorer-model-api-details is-open': that.state.isApiOpenState,
      'explorer-model-api-details is-closed': !that.state.isApiOpenState
    });
    var explorerModelApiClicked = function (event) {
      var isApiOpenState = !that.state.isApiOpenState;
      that.setState({isApiOpenState: isApiOpenState})
    };
    var endPointMethod = 'explorer-api-endpoint-httpmethod-cell explorer-api-method-' + apiDetails.httpMethod;

    return (
      <div>

        <div data-ui-type="table" className="explorer-api-endpoint-summary-table item-row-table">
          <div data-ui-type="row">
            <div data-ui-type="cell">
              <button onClick={explorerModelApiClicked} className="btn btn-block explorer-endpoint-title">{apiDetails.nickname}</button>
            </div>
            <div data-ui-type="cell">
              {api.path}
            </div>
            <div data-ui-type="cell"  className={endPointMethod}>
              {apiDetails.httpMethod}
            </div>
            <div data-ui-type="cell">
              {apiDetails.summary}
            </div>
          </div>

        </div>

        <div className={apiClasses} data-ui-type="table">

          <div data-ui-type="row">
            <div data-ui-type="cell">
              <textarea className="explorer-api-textarea"></textarea>
              <button className="btn btn-default btn-explorer-api-submit">try it out</button>
            </div>
            <div data-ui-type="cell">
              <div>path: {api.path}</div>
              <div>method: {apiDetails.httpMethod}</div>
              <div>response class: {apiDetails.responseClass}</div>
              <div>summary: {apiDetails.summary}</div>
              <div>errorResponses: {apiDetails.errorResponses}</div>
              <ExplorerModelApiParameters parameters={apiDetails.parameters} />
            </div>

          </div>

        </div>
      </div>);
  }
});
/*
 *
 * API Parameters
 *
 * */
var ExplorerModelApiParameters = (ExplorerModelApiParameters = React).createClass({
  getInitialState: function () {
    return {
      isParamsOpenState: false
    };
  },
  render: function () {
    var cx = React.addons.classSet;
    var that = this;
    var parametersClasses = cx({
      'explorer-model-api-parameters is-open': this.state.isParamsOpenState,
      'explorer-model-api-parameters is-closed': !this.state.isParamsOpenState
    });

    var parameters = this.props.parameters.map(function (param) {
      return (
        <li>
          <ul className="explorer-parameter-item-parameter-list">
            <li>name:
              <em>{param.name}</em>
            </li>
            <li>paramType:
              <em>{param.paramType}</em>
            </li>
            <li>description:
              <em>{param.description}</em>
            </li>
            <li>dataType:
              <em>{param.dataType}</em>
            </li>
            <li>required:
              <em>{param.required}</em>
            </li>
            <li>allowMultiple:
              <em>{param.allowMultiple}</em>
            </li>
          </ul>
        </li>
        );
    });

    var explorerModelApiParametersClicked = function (event) {
      var isParamsOpenState = !that.state.isParamsOpenState;
      that.setState({isParamsOpenState: isParamsOpenState});
    };

    return (
      <div className="explorer-parameters-container">
        <button onClick={explorerModelApiParametersClicked} className="btn-explorer-property-toggle">parameters:</button>
        <ul className={parametersClasses}>{parameters}</ul>
      </div>
      );
  }
});
