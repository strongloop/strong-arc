/** @jsx React.DOM */

var CommonCreateInstanceContainer = (CommonCreateInstanceContainer = React).createClass({
  render: function() {
    var scope = this.props.scope;
    var instance = scope.newModelInstance;
    var properties = [];
    if (instance && instance.properties) {
      properties = instance.properties;
    }



    return (
      <div>
        <div className=" editor-title-container">
          <span>{instance.name}s</span>
        </div>
        <div className=" editor-tabs-container">
          <ModelCreateTabsView scope={scope} tabItems={this.props.tabItems} />
        </div>

        <NewModelForm scope={scope} />

      </div>);
  }
});
/*
 *
 * Instance Title  View
 *
 * */
var CommonInstanceTitleView = (CommonInstanceTitleView = React).createClass({
  render: function() {
    return (
      <span >{this.props.scope.activeInstance.name}</span>
      );
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
      if (event.target.attributes['data-name']){
        // test to see if tab not already 'active'
        scope.$apply(function () {
          scope.instanceTabItemClicked(event.target.attributes['data-name'].value);
        });
      }
    };
    var clickInstanceTabClose = function(event) {
      if (event.target.attributes['data-name']){
        // test to see if tab not already 'active'
        scope.$apply(function () {
          scope.instanceTabItemCloseClicked(event.target.attributes['data-name'].value);
        });
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
          <button onClick={clickInstanceTabItem} className=" instance-tab-item-button" data-name={item.name}>{item.name}</button>
          <button onClick={clickInstanceTabClose} className=" instance-tab-close-button" data-name={item.name}>
            <span className="glyphicon glyphicon-remove" data-name={item.name}></span>
          </button>
        </li>
        );
    });

    return (
      <div>
        <ul className=" instance-tabs-list">{items}</ul>
      </div>
      );
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
