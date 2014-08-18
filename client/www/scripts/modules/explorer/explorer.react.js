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


    var scope = that.props.scope;


    var resource = that.props.apiResource;
    var modelDef = {};
    var resourceName = that.getNameFromPath(resource);
    var singularResourceName = that.getSingularlarVersion(resourceName);
    for (var i = 0;i < scope.mainNavModels.length;i++){
      if (scope.mainNavModels[i].name === singularResourceName) {
        modelDef = scope.mainNavModels[i];
        break;
      }
    }
    var config = JSON.stringify(resource.config);

    var apis = resource.config.apis.map(function (api) {
      var apiDetails = api.operations[0];

      // api endpoint injection
      return (
        <li className="explorer-api-detail-item">
          <ExploreModelApiEndPoint modelDef={modelDef} apiDetails={apiDetails} api={api} scope={scope} />
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
    if (that.props.scope.activeInstance.name === singularResourceName) {
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
 *
 * In order to provide a better ux than the existing swagger
 * we need a reference to the model definition so we can
 * generate a form based on the property names and data types
 *
 * then we can post that data through to the app controller
 *
 * need to distinguish between the various http methods and parameter types
 *
 *
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
    var scope = that.props.scope;


    var modelDef = that.props.modelDef;
    var apiDetails = that.props.apiDetails;
    var api = that.props.api;
    var currentResponseValue = '';
    if (scope.latestExplorerEndPointResponses) {
      if (scope.latestExplorerEndPointResponses[apiDetails.nickname]) {
        currentResponseValue = scope.latestExplorerEndPointResponses[apiDetails.nickname];
      }
    }
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

    var sendExplorerRequest = function(event) {
      var theForm = event.target.form;
      var sourceEndPoint = event.target.attributes['data-name'].value;

      var requestData = {};
      var explorerRequestObj = {
        path: api.path,
        method: apiDetails.httpMethod,
        endPoint: sourceEndPoint,
        data: {}
      };
      for (var i = 0;i < theForm.length;i++) {
        if (theForm[i].value) {
          requestData[theForm[i].name] = theForm[i].value;
        }
      }
      explorerRequestObj.data = requestData;
      scope.$apply(function() {
        scope.explorerApiRequest(explorerRequestObj);
      });
      return false;
    };

    var modelProperties = [];
    if (modelDef.props && modelDef.props.properties) {
      if ((apiDetails.httpMethod === 'POST') || (apiDetails.httpMethod === 'PUT')) {
        modelProperties = modelDef.props.properties.map(function(property) {
          var reqVal = false;
          if (property.props && property.props.required) {
            reqVal = property.props.required;
          }

          var labelClass = '';
          if (reqVal) {
            labelClass = 'is-required';
          }
          switch (property.props.type.toLowerCase()) {
            case 'string':
              return (<div className="form-group"><label className={labelClass}>{property.name}</label><input required={reqVal} className="form-control" type="text" name={property.name} /></div>);
              break;
            case 'number':
              return (<div className="form-group"><label className={labelClass}>{property.name}</label><input className="form-control" type="text" name={property.name} /></div>);
              break;

            case 'date':
              return (<div className="form-group"><label className={labelClass}>{property.name}</label><input className="form-control" type="date" name={property.name} /></div>);
              break;
            case 'array':
              return (<div className="form-group"><label className={labelClass}>{property.name}</label><textarea className="form-control" name={property.name} ></textarea></div>);
              break;
            case 'object':
              return (<div className="form-group"><label className={labelClass}>{property.name}</label><textarea className="form-control" name={property.name} ></textarea></div>);
              break;
            case 'any':
              return (<div className="form-group"><label className={labelClass}>{property.name}</label><textarea className="form-control" name={property.name} ></textarea></div>);
              break;

            default:
              return (<div className="form-group"><label className={labelClass}>{property.name}</label><input className="form-control" type="text" name={property.name} /></div>);

              break;

          }

        });
      }
      if (api.path.indexOf('{id}') !== -1){
        modelProperties = (<div className="form-group"><label className="is-required">id</label><input required="required" className="form-control" type="text" name="id" /></div>);

      }
    };

    var userFriendlyName = apiDetails.nickname;
    var tArray = apiDetails.nickname.split('_');
    if (tArray.length === 2) {
      userFriendlyName = tArray[1];
    }


    return (
      <div>

        <div data-ui-type="table" className="explorer-api-endpoint-summary-table item-row-table">
          <div data-ui-type="row">
            <div data-ui-type="cell">
              <button onClick={explorerModelApiClicked} className="btn btn-block explorer-endpoint-title" title={apiDetails.nickname}>{userFriendlyName}</button>
            </div>
            <div data-ui-type="cell">
              {api.path}
            </div>
            <div data-ui-type="cell"  className={endPointMethod}>
              {apiDetails.httpMethod}
            </div>
            <div data-ui-type="cell" className="explorer-endpoint-summary-text">
              {apiDetails.summary}
            </div>
          </div>

        </div>


        <div className={apiClasses}>

          <div data-ui-type="table" className="explorer-item-form-layout">
            <div data-ui-type="row">
              <div data-ui-type="cell">
                <form className="explorer-endpoint-form" role="form">
                  {modelProperties}
                  <button data-name={apiDetails.nickname} onClick={sendExplorerRequest} className="btn btn-default btn-explorer-api-submit">try it out</button>
                </form>
              </div>
              <div data-ui-type="cell">
                <textarea  className="explorer-api-textarea" value={JSON.stringify(currentResponseValue, null, 2)}></textarea>
              </div>
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
      isParamsOpenState: true
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
