/** @jsx React.DOM */

/*
 *
 * Instance Title  View
 *
 * */
var CommonInstanceTitleView = (CommonInstanceTitleView = React).createClass({
  render: function() {
    var retVal = (<span />);
    if (this.props.scope.activeInstance) {
      return (
        <span>{this.props.scope.activeInstance.name}</span>
        );
    }
    return retVal;
  }
});

/*
 *
 * Instance Container Tabs View
 *
 * */
var CommonInstanceTabsView = (CommonInstanceTabsView = React).createClass({
  render: function() {
    var scope = this.props.scope;
    var cx = React.addons.classSet;

    var clickInstanceTabItem = function(event) {
      if (event.target.attributes['data-id']){
        // test to see if tab not already 'active'
        scope.$apply(function () {
          scope.instanceTabItemClicked(event.target.attributes['data-id'].value);
        });
      }
    };
    var clickInstanceTabClose = function(event) {
      if (event.target.attributes['data-id']){
        // test to see if tab not already 'active'
        scope.$apply(function () {
          scope.instanceTabItemCloseClicked(event.target.attributes['data-id'].value);
        });
      }
      else if (event.target.attributes['data-name']) {
//        console.log('close the new model tab');
      }
    };
    var items = [];
    var iterator;
    if (scope.openInstanceRefs) {
      iterator = scope.openInstanceRefs;
    }

    items = this.props.tabItems.map(function(item) {
      var classNameVar = ' instance-tab-item-container';
      if (item.isActive) {
        classNameVar += ' is-active';
      }

      return (
        <li className={classNameVar}>
          <button onClick={clickInstanceTabItem} className="instance-tab-item-button" data-name={item.name} data-id={item.id}>{item.name}</button>
          <button onClick={clickInstanceTabClose} className=" instance-tab-close-button" data-name={item.name} data-id={item.id}>
            <span className="sl-icon sl-icon-close" data-name={item.name} data-id={item.id}></span>
          </button>
        </li>
        );
    });

    var retVal = (<div />);
    if (scope.activeInstance.name) {
      retVal = (<div>
          <ul className=" instance-tabs-list">{items}</ul>
        </div>);
    }
    return retVal;
  }
});
var CommonPreviewInstanceContainer = (CommonPreviewInstanceContainer = React).createClass({
  render: function() {
    var scope = this.props.scope;
    var instance = scope.previewInstance;
    var properties = [];
    if (instance && instance.properties) {
      properties = instance.properties;
    }


    var returnFragment = <div />;
    if (instance) {
      returnFragment = (
        <div>
          <div className=" editor-title-container">
            <span>{scope.$parent.previewInstance.name}</span>
          </div>
          <div className=" editor-tabs-container">
            <ModelEditorTabsView scope={scope} tabItems={this.props.tabItems} />
          </div>
          <div data-id="PreviewBackgroundBlur">
            <div className="preview-instance-body-container">
              <div>
                <ModelDetailView scope={scope} model={instance}  />
                <ModelPropertiesView scope={scope} properties={properties} />
              </div>
            </div>
          </div>
        </div>
        );
    }
    return returnFragment;
  }
});
