/** @jsx React.DOM */
Canvas.MainCanvasContainer = React.createClass({
  render: function() {
    var scope = this.props.scope;

    var curX = 10;
    var curY = 10;

    var modelContainerWidth = 220;
    var modelContainerHeight = 130;
    var containerWidth = 1000;
    var maxRowInstanceCount = 4;
    var instanceIndex = 1;
    var rowIndex = 1;

    var createModelProperty = function(property) {

      return (<li>{property.name} : {property.props.type}</li>);

    };




    var createCanvasModel = function(modelDef) {



      var containerStyle = {
        top: curX + 'px',
        left: curY + 'px'
      };

      if (!modelDef.children.properties){
        modelDef.children.properties = [];
      }
      if (instanceIndex > maxRowInstanceCount) {
        instanceIndex = 1;
        rowIndex++;
      }
      curX = (modelContainerWidth * instanceIndex);
      curY = (modelContainerHeight * rowIndex);
      instanceIndex++;
      return (<div className="canvas-model-container" id="model_container_{name}" style={containerStyle}>
        <div className="model-header">
          <h3 className="model-header-title">{modelDef.name}</h3>
          <button type="button" className="btn btn-sm btn-default">V</button>
        </div>
        <div className="model-body">
          <ul>{modelDef.children.properties.map(createModelProperty)}</ul>
        </div>
        <div className="model-connection-point"></div>
      </div>);
    };
    // return <div>{this.props.items.map(createCanvasModel)}</ul>;


    return (
      <div className="api-canvas-view-container">
        {scope.$parent.mainNavModels.map(createCanvasModel)}
      </div>
      );

  }

});


