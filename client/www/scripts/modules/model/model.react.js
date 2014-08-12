/** @jsx React.DOM */
/*
 *   Model Detail Editor
 * */
var ModelDetailEditor = (ModelDetailEditor = React).createClass({
  getInitialState: function() {
    return this.props.scope.activeInstance;
  },

//  handleChange: function(event) {
//    var scope = this.props.scope;
//    //this.setState({name: event.target.value});
//    var stateName = event.target.attributes['data-name'].value;
//    var xState = this.state;
//    xState[stateName] = event.target.value;
//    this.setState(xState);
//    if (event.target.attributes.id) {
//      var modelDetailProperty = event.target.attributes['data-name'].value;
//      var modelDetailValue = event.target.value;
//      scope.$apply(function() {
//        scope.updateModelDetailProperty(modelDetailProperty, modelDetailValue);
//      });
//    }
//  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps.model);
    console.log('Component will receive props');
  },
  handleChange: function(event) {
    var modelPropertyName = '';
    console.log('model form edit handler ');
    if (event.target.attributes['data-name']) {
      modelPropertyName = event.target.attributes['data-name'].value;
      var xState = this.state;
      this.state[modelPropertyName] = event.target.value;
      this.setState(xState);
    }



//    //xState[stateName] = event.target.value;
//    for (var i = 0;i < xState.props.properties.length;i++) {
//      if (xState.props.properties[i].name === stateName) {
//        xState.props.properties[i].value = event.target.value;
//      }
//    }



  },
//  componentWillUpdate: function(nextProps, nextState) {
//    this.setState(nextProps.scope.activeInstance);
//  },
  render: function() {
    var that = this;
    var scope = that.props.scope;

    var model = that.state;
    var modelDef = that.state;
    var cx = React.addons.classSet;

    var classes = cx({
      'model-detail-pocket-container is-open': that.props.scope.isModelInstanceBasePropertiesActive,
      'model-detail-pocket-container is-closed': !that.props.scope.isModelInstanceBasePropertiesActive
    });
    var iconClasses = cx({
      'glyphicon glyphicon-minus-sign': that.props.scope.isModelInstanceBasePropertiesActive,
      'glyphicon glyphicon-plus-sign': !that.props.scope.isModelInstanceBasePropertiesActive
    });
    var clickHandler = function(event) {
      scope.$apply(function() {
        scope.toggleModelDetailView();
      });
    };
    var saveModelDefinition = function(event) {
      var scope = that.props.scope;
//      var formEls = event.target.form;
//      if (formEls.length > 0) {
//        var modelObj = {};
//        for (var i = 0;i < formEls.length;i++) {
//          if (formEls[i].attributes['data-name']) {
//            modelObj[formEls[i].attributes['data-name'].value] = formEls[i].value;
//          }
//
//        }
//
//      }
      console.log('hello: ' + JSON.stringify(that.state));
      scope.$apply(function() {
        scope.saveModelRequest(that.state);
      })
      return false;
    };
    var returnVal = (<div />);
    if (scope.activeInstance.name) {
      returnVal = (
        <form role="form">
        	<div className="model-header-container">
	          <div data-ui-type="cell">
	            <label>name</label>
	          </div>
	          <div data-ui-type="cell">
	            <input type="text"
	              value={modelDef.name}
	              onChange={that.handleChange}
	              data-name="name"
	              id="ModelName"
	              name="ModelName"
	              className="model-instance-editor-input" />
	          </div>
	          <button onClick={saveModelDefinition}
	            className="model-detail-pocket-button model-save-button"
	            data-modelId={modelDef.Id} >Save</button>
          </div>
          <button onClick={clickHandler}
            type="button"
            className="model-instance-header-btn btn btn-default btn-block"
            title="Details" >
            <span className={iconClasses}></span>Details</button>
          
          
          <div className="model-detail-container">
	          <div className="model-detail-input-row">
	          	<div className="model-detail-input-container">
	          		<div className="model-detail-label">
	          		  <label>plural</label>
	          		</div>
	          		<input type="text"
	          		 	value={modelDef.plural}
	          		    onChange={this.handleChange}
	          		    data-name="plural"
	          		    id="ModelPlural"
	          		    name="ModelPlural"
	          		    className="model-instance-editor-input" />
	          	</div>
	          	<div className="model-detail-input-container">
	          		<div className="model-detail-label">
	          		  <label>base model</label>
	          		</div>
	          		<input type="text"
	          		  value={modelDef.base}
	          		  onChange={this.handleChange}
	          		  data-name="base"
	          		  id="ModelBase"
	          		  name="ModelBase"
	          		  className="model-instance-editor-input" />
	          	</div>
	          	<div className="model-detail-input-container">
	          		<div className="model-detail-label">
	          		  <label>datasource</label>
	          		</div>
	          		<input type="text" value={modelDef.dataSource} onChange={this.handleChange} className="model-instance-editor-input" />
	          	</div>
	          </div>
	          
	          <div className="model-detail-input-row">
	          	<div className="model-detail-input-container listNarrow">
	          		<label className="model-detail-label">public</label>
	          		<input type="checkbox"
	          		   checked={modelDef.public}
	          		   className="model-instance-editor-checkbox" />
	          	</div>
	          	<div className="model-detail-input-container listNarrow">
	          		<label className="model-detail-label">strict</label>
	          		<input type="checkbox"
	          		    checked={modelDef.strict}
	          		    className="model-instance-editor-checkbox" />
	          	</div>
	          	<div className="model-detail-input-container listWide">
	          		<label className="model-detail-label">Indexes</label>
	          		<input type="button" value="Edit" className="model-detail-pocket-button" />
	          	</div>
	          	<div className="model-detail-input-container listWide">
	          		<label className="model-detail-label">Scopes</label>
	          		<input type="button" value="Edit" className="model-detail-pocket-button" />
	          	</div>
	          	<div className="model-detail-input-container listWide">
	              	<div>
	              		<label className="model-detail-label">Access</label>
	              		<input type="button" value="Edit" className="model-detail-pocket-button" />
	          		</div>
	          	</div>
	          </div>
	          	
	          
          </div>
        </form>
        );
    }

    return returnVal;
  }
});
/*
 *
 *   MODEL PROPERTIES
 *
 *
 * */
var ModelPropertiesEditor = (ModelPropertiesEditor = React).createClass({

  getInitialState: function() {
    return {
      isOpen:true
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {

    // return this.state.isOpen !== nextState.isOpen;
    return true;
  },
  triggerNewPropertyEditor: function() {
    var item = {};
    var that = this;
    console.log('New Property Editor');
    that.props.scope.$apply(function() {
      that.props.scope.createNewProperty();
    });

  },

  render: function() {

    var that = this;

    var scope = this.props.scope;
    var properties = scope.properties;
    var cx = React.addons.classSet;




    var classes = cx({
      'row is-open': this.state.isOpen,
      'row is-closed': !this.state.isOpen
    });
    var iconClasses = cx({
      'glyphicon glyphicon-minus-sign': this.state.isOpen,
      'glyphicon glyphicon-plus-sign': !this.state.isOpen
    });
    var clickHandler = function(event) {
      var isOpenState = !that.state.isOpen;
      that.setState({isOpen:isOpenState});
    };


    var items = [];
    items = properties.map(function (item) {
      return  (<ModelPropertyRowDetail modelProperty={item} scope={scope} />);
    });


    return (
      <div>
        <button type="button" onClick={clickHandler} className="model-instance-header-btn btn btn-default btn-block" title="Properties" ><span className={iconClasses}></span>Properties</button>
        <div className={classes} >
          <div className="model-instance-container property-list-header">
            <div data-ui-type="table">
              <div data-ui-type="row" className="model-instance-property-table-header-row">
                <span data-ui-type="cell" className="props-name-cell table-header-cell" title="property name">name</span>
                <span data-ui-type="cell" className="props-data-type-cell table-header-cell" title="data type">type</span>
                <span data-ui-type="cell" className="props-default-value-cell table-header-cell" title="default value"></span>
                <span data-ui-type="cell" className="props-required-cell" title="required">req</span>
                <span data-ui-type="cell" className="props-index-cell table-header-cell" title="is index">index</span>
                <span data-ui-type="cell" className="props-comments-cell table-header-cell header" title="comments">comments</span>
              </div>
            </div>
          </div>
          <ul className="model-instance-property-list">
            {items}
          </ul>
          <button type="button" onClick={this.triggerNewPropertyEditor} className="btn-new-model-property" >New Property</button>
        </div>


      </div>

      );
  }
});
/*
*
*   Model Property Row Detail Item
*
* */
var ModelPropertyRowDetail = (ModelPropertyRowDetail = React).createClass({
  getInitialState: function() {
    return {
      modelProperty:this.props.modelProperty,
      isOpen:false
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({modelProperty:nextProps.modelProperty});
    console.log('Component will receive props');
  },
  componentDidMount: function() {
    console.log('the field has loaded check if property name is property-name');
    var propNameInputs = jQuery('[data-name="ModelPropertyName"]');
    for (var i = 0;i < propNameInputs.length;i++) {
      if (propNameInputs[i].value === 'property-name' ){
        jQuery(propNameInputs[i]).select();
      }
    }
  },
  checkSubmitModelProperty: function(event) {
//    if (event.keyCode === 13) {
//      console.log('|||    ENTER ');
//    }

    var tModel = this.state.modelProperty;
    tModel.name = event.target.value;
    this.setState({modelProperty:tModel});
  },
  triggerModelPropertyUpdate: function(event) {
    var scope = this.props.scope;
    if(event.target.attributes['data-name']){
      var tModelPropertyName = event.target.attributes['data-name'].value;
      var tModelProperty = this.state.modelProperty;
      tModelProperty[tModelPropertyName] = event.target.value;
      this.setState({modelProperty:tModelProperty});
      var updateModelPropertyConfig = tModelProperty;
      scope.$apply(function() {
        scope.updateModelPropertyRequest(updateModelPropertyConfig);
      });
      console.log('ok going to save on blur');
    }

  },
  render: function() {

    var that = this;
    var scope = that.props.scope;
    var modelProperty = that.state.modelProperty;
    var cx = React.addons.classSet;


    var togglePropertiesView = function(property) {
      that.setState({isOpen:!that.state.isOpen});
    };

    var pClasses = cx({
      'property-detail is-open': that.state.isOpen,
      'property-detail is-closed': !that.state.isOpen
    });
    var bClasses = cx({
      'glyphicon glyphicon-chevron-down': that.state.isOpen,
      'glyphicon glyphicon-chevron-right': !that.state.isOpen
    });


    return (
      <li>
        <div >
          <div data-ui-type="table">
            <div data-ui-type="row">
              <span data-ui-type="cell" className="props-name-cell">
                <button
                  onClick={togglePropertiesView}
                  className="btn btn-sm btn-default btn-model-property-spinner">
                  <span className={bClasses}></span>
                </button>
                <input ref="propName"
                  data-name="name"
                  type="text"
                  onChange={this.checkSubmitModelProperty}
                  onBlur={this.triggerModelPropertyUpdate}
                  value={modelProperty.name} />
              </span>
              <span data-ui-type="cell" className="props-data-type-cell">
                <DataTypeSelect value={modelProperty.type} />
              </span>
              <span data-ui-type="cell" className="props-default-value-cell">
                <input type="text"
                  className="model-instance-editor-input"
                  placeholder="default value" />
              </span>
              <span data-ui-type="cell" className="props-required-cell">
                <input type="checkbox" />
              </span>
              <span data-ui-type="cell" className="props-index-cell">
                <input type="checkbox" />
              </span>
              <span data-ui-type="cell" className="props-comments-cell">
                <textarea className="property-doc-textarea model-instance-editor-input" ></textarea>
              </span>
            </div>
          </div>
          <div className={pClasses}>
            <ModelPocketEditorContainer scope={scope} property={modelProperty} />
          </div>


        </div>
      </li>
      );
  }
});




var DataTypeSelect = (DataTypeSelect = React).createClass({
  render: function() {

    var dataTypes = ['string','array','buffer','date','geopoint','number','boolean','object','any'];

    var options = dataTypes.map(function(type) {
      return (<option value={type}>{type}</option>)
    });
    return (<select value={this.props.value}>{options}</select>);
  }
});

/*
 *   Property Comment Editor
 * */
var PropertyCommentEditor = (PropertyCommentEditor = React).createClass({
  render: function() {
    var scope = this.props.scope;

    var updatePropertyDoc = function(event) {
      scope.$apply(function () {
        scope.property.props.doc = event.target.value;
      });
    };

    return (
      <textarea onChange={updatePropertyDoc} className="model-instance-editor-input">
          {this.props.doc}
      </textarea>
      );
  }
});
/*
 * property name editor
 * */
var PropertyNameEditor = (PropertyNameEditor = React).createClass({
//  getInitialState: function() {
//   // return {value: this.props.scope.property.name};
//  },
  componentWillRecieveProps: function(nextProps) {
    console.log('next props: ' + nextProps);

  },
  shouldComponentUpdate: function(nextProps, nextState) {

    if (nextProps.name !== nextState.value) {

      return true;
    }
    return false;

  },
  componentWillUpdate: function(nextProps, nextState) {

    console.log('nextState ===' + JSON.stringify(nextProps.name));
    this.setProps({value:nextProps.name});
  },
  render: function() {
    var scope = this.props.scope;
    var value = this.props.name;

    var changeHandler = function(event) {
//      this.setState({'value': event.target.value});
      scope.$apply(function () {
        scope.property.name = event.target.value;
      });
    };
    return (
      <input type="text" value={value} onChange={changeHandler} className="model-instance-editor-input" />

      );
  }
});
var ModelPocketEditorMiscView = (ModelPocketEditorMiscView = React).createClass({
  render: function() {
    return (
      <div data-ui-type="table" className="pocket-editor-table">
        <div data-ui-type="row">
          <div data-ui-type="cell">
            <label>Name</label>

          </div>
          <div data-ui-type="cell" >
            <input type="text" value={this.props.property.name} readOnly={this.props.mode} />

          </div>
        </div>
        <div data-ui-type="row">
          <div data-ui-type="cell">
            <label>Comments</label>
          </div>
          <div data-ui-type="cell">
            <textarea value={this.props.property.doc} ></textarea>
          </div>
        </div>
      </div>
      );
  }
});
/*
 *   Model Pocket Editor Container
 * */
var ModelPocketEditorContainer = (ModelPocketEditorContainer = React).createClass({
  getInitialState: function() {
    return {
      targetView: 'id',
      mode: this.props.mode || null
    };
  },
  getTargetContent: function() {
    var tView = this.state.targetView;
    var viewFragment = '';
    switch (tView){
      case 'id':
        viewFragment = (<PropertyIdEditor scope={this.props.scope} property={this.props.property} mode={this.state.mode} />);

        break;

      case 'validation':
        viewFragment = (<PropertyValidationEditor scope={this.props.scope} property={this.props.property} mode={this.state.mode} />);

        break;

      case 'map':
        viewFragment = (<PropertyMapEditor scope={this.props.scope} property={this.props.property} mode={this.state.mode} />);

        break;

      case 'format':
        viewFragment = (<PropertyFormatEditor scope={this.props.scope} property={this.props.property} mode={this.state.mode} />);

        break;

      default:
        viewFragment = (<div>hmmm... we don't seem to be able to find the view you're looking for</div>);

    }
    return viewFragment;
  },

  pocketEditorTabSelect: function(event) {
    var targetView = event.target.attributes['data-target'].value;
    this.setState({targetView:targetView});
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return true;
  },

  render: function() {

    var frag = this.getTargetContent();

    return (

      <div className="model-details-pocket-editor-container">

        <div>
          <ul className="model-config-tab-list">
            <li>
              <input type="button" data-target="id" onClick={this.pocketEditorTabSelect} className="btn btn-default btn-sm" value="id config" />
            </li>
            <li>
              <input type="button" data-target="validation" onClick={this.pocketEditorTabSelect} className="btn btn-default btn-sm" value="validation" />
            </li>
            <li>
              <input type="button" data-target="format" onClick={this.pocketEditorTabSelect} className="btn btn-default btn-sm" value="format" />
            </li>
            <li>
              <input type="button" data-target="map" onClick={this.pocketEditorTabSelect} className="btn btn-default btn-sm" value="map" />
            </li>
          </ul>
        </div>
        <div className="tab-box-body">
        {frag}
        </div>


      </div>

      );
  }
});
/*
 *   Property Connection Editor
 * */
var PropertyConnectionEditor = (PropertyConnectionEditor = React).createClass({
  render: function() {
    var scope = this.props.scope;
    return (
      <div>
        <h4>Connection</h4>
        <label>target model</label>
        <input type="text"
        placeholder="search models" />
        <label>target property</label>
        <input type="text" placeholder="search properties" />
      </div>
      );
  }
});
/*
 *
 *   NEW MODEL
 *
 * */
var NewModelForm = (NewModelForm = React).createClass({
  getInitialState: function() {
    return this.props.scope.newModelInstance;
  },
  newModelNameInput: function(event) {
    var that = this;
    var scope = that.props.scope;
    var targetValue = event.target.value;
    //console.log('new model name request: ' + event.target.value);

    if (targetValue) {
      // check to see if it is valid (no spaces, no invalid characters etc.
      // then check to see if it is unique
      scope.$apply(function() {
        scope.processModelNameInput(targetValue);
      });
    }

  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps.scope.newModelInstance);
    console.log('Component will receive props');
  },
  render:function() {

    var scope = this.props.scope;
    var model = this.state;

    var uniqueWarningCss = 'new-model-name';

    var uniqueText = '';
    if (model.isUnique) {
      uniqueWarningCss += ' is-unique';
      uniqueText = 'unique name';
    }
    else {
      uniqueWarningCss += ' is-duplicate';
      uniqueText = 'duplicate name';
    }

    return (
      <div>
        <form>
          <label>Model name</label>
          <input placeholder="model name" value={model.name} onChange={this.newModelNameInput} type="text" />
          <span className={uniqueWarningCss}>{uniqueText}</span>
          <br />
          <button className="btn btn-primary">create</button>
        </form>
      </div>
      );
  }
});


