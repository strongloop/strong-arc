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
