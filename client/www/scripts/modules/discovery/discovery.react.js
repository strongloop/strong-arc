/** @jsx React.DOM */
var TargetTableModelRowItem = (TargetTableModelRowItem = React).createClass({
  render: function() {
    var that = this;
    var propertiesObj = that.props.tableProperties;
    var propertiesCollection = [];

    var propertyKeys = Object.keys(propertiesObj);

    var tPropKeys = propertyKeys.map(function(key) {
      var testObj = propertiesObj[key];
      console.log(testObj);
      testObj.name = key;
      propertiesCollection.push(testObj)
    });

    // this propItemObj is the collection of properties from

    var renderedProperties = propertiesCollection.map(function(property) {

      function isIdVal(val) {
        if (val === 1) {
          return 'true';
        }
        return 'false';
      }
      /*
      *
      * {
      * id: 1
      * type: "String",
      * required: false,
      * length: 765,
      * precision: null,
      * scale: null
      * length: 765
      *
      *
      *
      * */
      return (<div data-ui-type="row">
          <div data-ui-type="cell">{property.name}</div>
          <div data-ui-type="cell">{property.type}</div>
          <div data-ui-type="cell">{property.required.toString()}</div>
          <div data-ui-type="cell">{isIdVal(property.id)}</div>
          <div data-ui-type="cell">{property.length}</div>
          <div data-ui-type="cell">{property.precision}</div>
          <div data-ui-type="cell">{property.scale}</div>
        </div>);
    });

    var mainTable = (<div data-ui-type="table" className="discovery-target-model-table">
      <div data-ui-type="row" className="table-header">
        <div data-ui-type="cell">
          name
        </div>
        <div data-ui-type="cell">
          type
        </div>
        <div data-ui-type="cell">
          required
        </div>
        <div data-ui-type="cell">
          is id
        </div>
        <div data-ui-type="cell">
          length
        </div>
        <div data-ui-type="cell">
          precision
        </div>
        <div data-ui-type="cell">
          scale
        </div>
      </div>
      {renderedProperties}
    </div>);
    return (<li>{mainTable}</li>);


  }
});
var TargetTableModelPreview = (TargetTableModelPreview = React).createClass({
  render:function() {
    var that = this;
    var scope = that.props.scope;

    function renderTableDefItemProperty(property) {
      if (property) {
        return (<li>{property.name}</li>);
      }
    }

    function renderTableDefItem(item) {
      var tableDefinitionName = item.name;
//      var properties = (<li></li>);
//      var propObj = item.properties;
//
//      if (propObj) {
////        properties = item.properties.map(function(key, prop) {
////          return (<li>{key}</li>);
////        });
//        for (var property in propObj) {
//         // if (item.properties.hasOwnProperty(property)) {
//          console.log('property in properties: ' + property);
//            return (<li>{property}</li>);
//         // }
//        }
//
//      }
//      //<ul>{properties}</ul>
//      return (<li>{item.name}DiscoveryTargetTableModelItem</li>);
      return (<div>
          <div>Model: {tableDefinitionName}</div>
          <div>properties:</div>
          <TargetTableModelRowItem tableProperties={item.properties} />
        </div>);

    }
//
//    if (scope.apiSourceTables.length) {
//      retVar = (<li>hello world target schema model tables</div>);
//
//    }
    return (<ul>{scope.apiSourceTables.map(renderTableDefItem)}</ul>);
  }
});

