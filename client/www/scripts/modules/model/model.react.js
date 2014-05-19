/** @jsx React.DOM */
Model.ModelTitleHeader = React.createClass({
  render: function() {
    return (
      <span>{this.props.scope.currModel.name}</span>
    );
  }
});
Model.PropertyBaseEditor = React.createClass({

  render: function() {
    var cx = React.addons.classSet;

    var classes = cx({
      'row is-open': this.props.scope.isModelInstanceBasePropertiesActive,
      'row is-closed': !this.props.scope.isModelInstanceBasePropertiesActive
    });

    var clickHandler = this.props.scope.$apply.bind(this.props.scope, this.props.scope.toggleModelDetailView.bind(null, 0));

    return (
      <div className="container-fluid">
        <input onClick={clickHandler} type="button" className="model-instance-header-btn btn btn-default btn-block" value="Details" />
        <div className={classes}>
          <div className="col-xs-6">
            <div data-ui-type="table" >
              <div data-ui-type="row">
                <div data-ui-type="cell">
                  <label>plural</label>
                </div>
                <div data-ui-type="cell">
                  <input type="text" value={this.props.scope.currModel.plural} className="model-instance-editor-input" ng-model={this.props.scope.currModel.plural} />
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell">
                  <label>datasource</label>
                </div>
                <div data-ui-type="cell">
                  <input type="text" className="model-instance-editor-input" value={this.props.scope.currModel.dataSource} />
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell">
                  <label>base model</label>
                </div>
                <div data-ui-type="cell">
                  <input type="text" className="model-instance-editor-input" ng-model="currProperty.options.base" />
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell"><label>public</label></div>
                <div data-ui-type="cell">
                  <input type="checkbox" className="model-instance-editor-input" value={this.props.scope.currModel.public} />
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell"><label>strict</label></div>
                <div data-ui-type="cell">
                  <input type="checkbox" className="model-instance-editor-input" ng-model="currProperty.strict" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-6">
            <div data-ui-type="table" >
              <div data-ui-type="row">
                <div data-ui-type="cell">
                <label>Indexes</label>
                </div>
                <div data-ui-type="cell">
                  <input type="button" value="edit" className="btn btn-default" />
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell">
                  <label>Scopes</label>
                </div>
                <div data-ui-type="cell">
                  <input type="button" value="edit" className="btn btn-default" />
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell">
                  <label>Access Control</label>
                </div>
                <div data-ui-type="cell">
                  <input type="button" value="edit" className="btn btn-default" />
                </div>
              </div>

            </div>
          </div>


        </div>
      </div>
      );
  }
});
