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
     menuItems.openSelectedModels = {name: "open", callback: this.openSelectedModels};
     $.contextMenu({
       // define which elements trigger this menu
       selector: ".model-node",
       // define the elements of the menu
       items: menuItems,
       events: {
         show: function(opt, event) {

         }
       }
     });
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
           <button onClick={singleClickItem} data-name={item.name} className="btn btn-default btn-block nav-tree-item tree-node"><span data-name={item.name} className="glyphicon glyphicon-file"></span>{item.name}</button>
         </li>
         );
     });
     return (
       <div>
         <button onClick={clickBranch} data-name="model_root" className="btn btn-default btn-block nav-tree-item tree-branch"  title="Models" ><span className="glyphicon glyphicon-folder-open"></span>Models</button>
         <ul className="branch-leaf-list is-open">{items}</ul>
         <button onClick={addNewInstanceRequest} data-type="model" className="nav-tree-item-addnew"><span className="glyphicon glyphicon-plus-sign"></span>Add New Model</button>
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
  render: function() {
    var that = this;
    var scope = this.props.scope;
    var modelDef = that.props.modelDef;

    var sendDemoRequest = function(event) {
      console.log('submit the demo form');
      var theForm = event.target.form;
      var sourceEndPoint = event.target.attributes['data-name'].value;

      var requestData = {};
      var requestObj = {
        path:'./api/',
        method: 'POST',
        endPoint: sourceEndPoint,
        data: {}
      };
      for (var i = 0;i < theForm.length;i++) {
        if (theForm[i].value) {
          console.log('Processing Form : ' + theForm[i].name + ' = ' + theForm[i].value);
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
//      if (api.path.indexOf('{id}') !== -1){
//        modelProperties = (<div className="form-group"><label className="is-required">id</label><input required="required" className="form-control" type="text" name="id" /></div>);
//
//      }
    };
   return (
      <form className="explorer-endpoint-form" data-name={scope.name} role="form">
                  {modelProperties}
        <button data-name={modelDef.name} onClick={clearDemoForm} className="btn btn-default">cancel</button>
        <button data-name={modelDef.name} onClick={sendDemoRequest} className="btn btn-primary">submit</button>
      </form>
     );
  }
});
