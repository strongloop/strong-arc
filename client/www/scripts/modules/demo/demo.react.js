/** @jsx React.DOM */
 /*
  *
  *   Demo Main Nav
  *
  * */
 var DemoModelNav = (DemoModelNav = React).createClass({
   openSelectedModels:function(key, opt) {
     var that = this;
     that.props.scope.$apply(function () {
       that.props.scope.openSelectedModels();
     });
   },
   componentDidMount:function(){
     var menuItems = {};

   },
   render: function() {

     var scope = this.props.scope;

     var modelSelectedCollection = [];
     var cx = React.addons.classSet;


     var clickBranch = function(event) {
       if (event.target.attributes['data-name']){
         scope.$apply(function () {
           scope.navTreeBranchClicked('model');
         });
       }
     };

     var singleClickItem = function(event) {
//      if (event.target.attributes['data-name']){
//        var clickModelName = event.target.attributes['data-name'].value;
//        scope.$apply(function () {
//          scope.navTreeItemClicked('model', clickModelName, event.metaKey);
//        });
//      }


       if (event.target.attributes['data-name'] || event.target.parentElement.attributes['data-name']){
         var val = '';
         if (event.target.attributes['data-name']) {
           val = event.target.attributes['data-name'].value;
         }
         else {
           val = event.target.parentElement.attributes['data-name'].value;
         }
         scope.$apply(function () {
           console.log('demo navigation: ' + val);
           document.location.href = '#demo/' + val;
           scope.demoModelChanged(val);
         });

       }



     };

     var addNewInstanceRequest = function(event) {
       if (event.target.attributes['data-type']){
         console.log('add new: ' + event.target.attributes['data-type'].value);
         scope.$apply(function() {
           scope.createModelViewRequest();
         });
       }
     };
     var navModels = [];
     if (Array.isArray(scope.appModels)) {
       navModels = scope.appModels;
     }
     var items = navModels.map(function(item) {
       var classNameVar = 'model-node ';
       if (item.isActive) {
         classNameVar += ' is-active';
       }
       else if (item.isOpen) {
         classNameVar += ' is-open';
       }
       else if (item.isSelected) {
         classNameVar += ' is-selected'
       }
       return (
         <li className={classNameVar}>
           <button onClick={singleClickItem} data-name={item.name} className="btn btn-default btn-block "><span data-name={item.name} className="glyphicon glyphicon-file"></span>{item.name}</button>
         </li>
         );
     });
     return (
       <div>
         <ul className="branch-leaf-list is-open">{items}</ul>
       </div>
       );
   }
 });
/*
*
*   Demo Form
*
* */
var DemoForm = (DemoForm = React).createClass({
  getInitialState: function() {
    return this.props.scope.curFormData;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps.scope.curFormData);
  },
  handleChange: function(event) {
    var stateName = event.target.attributes['data-name'].value;
    var xState = this.state;
    //xState[stateName] = event.target.value;
    for (var i = 0;i < xState.props.properties.length;i++) {
      if (xState.props.properties[i].name === stateName) {
        xState.props.properties[i].value = event.target.value;
      }
    }
    this.setState(xState);
    console.log('demo form edit handler ');

  },
  render: function() {
    var that = this;
    var scope = that.props.scope;
    var modelDef = that.state;


    var sendDemoRequest = function(event) {
      console.log('submit the demo form');
      var theForm = event.target.form;
      var sourceEndPoint = event.target.attributes['data-name'].value;

      var reqMethod = 'POST';

      var requestData = {};
      var requestObj = {
        path:'./api/',
        method: 'POST',
        endPoint: sourceEndPoint,
        data: {}
      };
      for (var i = 0;i < theForm.length;i++) {
        if (theForm[i].value) {
          if (theForm[i].name === 'id') {
            if (theForm[i].value) {
              requestObj.method = 'PUT';
            }
          }
          requestData[theForm[i].name] = theForm[i].value;
        }
      }
      requestObj.data = requestData;
      scope.$apply(function() {
        scope.demoRestApiRequest(requestObj);
      });
      return false;
    };

    var clearDemoForm = function() {
      console.log('clear the demo form');
    };

    var apiDetails = {httpMethod:'POST'};

    var modelProperties = [];
    if (modelDef.props && modelDef.props.properties) {

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
            return (
              <div className="form-group">
                <label className={labelClass}>{property.name}</label>
                <input required={reqVal}
                  className="form-control"
                  type="text"
                  value={property.value}
                  onChange={that.handleChange}
                  data-name={property.name}
                  name={property.name} />
              </div>);
            break;
          case 'number':
            return (
              <div className="form-group">
                <label className={labelClass}>{property.name}</label>
                <input className="form-control"
                  value={property.value}
                  onChange={that.handleChange}
                  data-name={property.name}
                  type="text" name={property.name} />
              </div>);
            break;

          case 'date':
            return (<div className="form-group">
              <label className={labelClass}>{property.name}</label>
              <input className="form-control"
                value={property.value}
                onChange={that.handleChange}
                data-name={property.name}
                type="date" name={property.name} />
            </div>);
            break;
          case 'array':
            return (<div className="form-group">
              <label className={labelClass}>{property.name}</label>
              <textarea className="form-control"
                value={property.value}
                onChange={that.handleChange}
                data-name={property.name}
                name={property.name} ></textarea>
            </div>);
            break;
          case 'object':
            return (<div className="form-group">
              <label className={labelClass}>{property.name}</label>
              <textarea
                className="form-control"
                value={property.value}
                onChange={that.handleChange}
                data-name={property.name}
                name={property.name} ></textarea>
            </div>);
            break;
          case 'any':
            return (<div className="form-group">
              <label className={labelClass}>{property.name}</label>
              <textarea
                className="form-control"
                value={property.value}
                onChange={that.handleChange}
                data-name={property.name}
                name={property.name} ></textarea>
            </div>);
            break;

          default:
            return (<div className="form-group">
              <label className={labelClass}>{property.name}</label>
              <input className="form-control"
                value={property.value}
                onChange={that.handleChange}
                data-name={property.name}
                type="text" name={property.name} />
            </div>);

            break;

        }

      });
    };
   return (
      <form className="explorer-endpoint-form" data-name={scope.name} role="form">
        <div className="demo-app-form-container">
          {modelProperties}
        </div>
        <button data-name={modelDef.name} onClick={clearDemoForm} className="btn btn-default">cancel</button>
        <button data-name={modelDef.name} onClick={sendDemoRequest} className="btn btn-primary">submit</button>
      </form>
     );
  }
});
