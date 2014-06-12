/** @jsx React.DOM */
var CommonPreviewInstanceContainer = React.createClass({
  render: function() {
    var scope = this.props.scope;
    var instance = scope.previewInstance;
    var properties = instance.properties;
    if (!properties) {
      properties = [];
    }


    return (
      <div>
        <div className="model-editor-title-container">
          <span>{scope.$parent.previewInstance.name}</span>
        </div>
        <div className="model-editor-tabs-container">
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
});
