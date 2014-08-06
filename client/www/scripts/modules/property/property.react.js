/** @jsx React.DOM */
/*
*   Property Format Editor
* */
var PropertyFormatEditor = (PropertyFormatEditor = React).createClass({
  render: function() {
    return (
      <div >
      Property Format Editor
        <div data-ui-type="table" className="pocket-editor-table">
          <div data-ui-type="row">
            <div data-ui-type="cell">
              <label>_trim_</label>
            </div>
            <div data-ui-type="cell">
              <input type="checkbox" />
            </div>
          </div>
          <div data-ui-type="row">
            <div data-ui-type="cell">
              <label>UPPER CASE</label>
            </div>
            <div data-ui-type="cell">
              <input type="checkbox" />
            </div>
          </div>
          <div data-ui-type="row">
            <div data-ui-type="cell">
              <label>lower case</label>
            </div>
            <div data-ui-type="cell">
              <input type="checkbox" />
            </div>
          </div>
          <div data-ui-type="row">
            <div data-ui-type="cell">
              <label>Date</label>
            </div>
            <div data-ui-type="cell">
              <input type="checkbox" />
            </div>
          </div>
          <div data-ui-type="row">
            <div data-ui-type="cell">
              <label>format</label>
            </div>
            <div data-ui-type="cell">
              <select>
                <option>YYYY/MM/YY</option>
                <option>MM/YY</option>
                <option>dddd/MM/YY</option>
              </select>
            </div>
          </div>
          <div data-ui-type="row">
            <div data-ui-type="cell">
              <label>autoincrement</label>
            </div>
            <div data-ui-type="cell">
              <input type="checkbox" />
            </div>
          </div>
        </div>
      </div>
      );
  }
});
 /*
*   Property Map Editor
* */
var PropertyMapEditor = (PropertyMapEditor = React).createClass({
  render: function() {
    return (
      <div >
      Property Map Editor
        <div data-ui-type="table" className="pocket-editor-table">
          <div data-ui-type="row">
            <div data-ui-type="cell">
              <input type="text" value="FIRST_NAME" />
            </div>
            <div data-ui-type="cell">
              <input type="text" value="varchar(55)" />
            </div>
            <div data-ui-type="cell">
              <input type="text" placeholder="property name" />
            </div>
            <div data-ui-type="cell">
              <button className="btn btn-default btn-xs">String</button>
            </div>
          </div>
        </div>

      </div>




    );
  }
});
/*
 *   Property Validation Editor
 * */
var PropertyValidationEditor = (PropertyValidationEditor = React).createClass({
  render: function() {
    return (
      <div >
      Property Validation Editor
        <div data-ui-type="table" className="pocket-editor-table">
          <div data-ui-type="row">
            <div data-ui-type="cell">
              <label>Required</label>
            </div>
            <div data-ui-type="cell">
              <input type="checkbox" checked={this.props.property.required}/>
              </div>
            </div>
            <div data-ui-type="row">
              <div data-ui-type="cell">
                <label>Email</label>
              </div>
              <div data-ui-type="cell">
                <input type="checkbox" />
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell">
                  <label>Max Length</label>
                </div>
                <div data-ui-type="cell">
                  <input type="text" className="model-instance-editor-input" placeholder="max length" />
                  </div>
                </div>
                <div data-ui-type="row">
                  <div data-ui-type="cell">
                    <label>Min</label>
                  </div>
                  <div data-ui-type="cell">
                    <input type="text" className="model-instance-editor-input" placeholder="min" />
                  </div>
                </div>
                <div data-ui-type="row">
                  <div data-ui-type="cell">
                    <label>Max</label>
                  </div>
                  <div data-ui-type="cell">
                    <input type="text" className="model-instance-editor-input" placeholder="max" />
                    </div>
                  </div>
                  <div data-ui-type="row">
                    <div data-ui-type="cell">
                      <label>Numeric</label>
                    </div>
                    <div data-ui-type="cell">
                      <input type="checkbox" />
                    </div>
                  </div>
                  <div data-ui-type="row">
                    <div data-ui-type="cell">
                      <label>Presence of</label>
                    </div>
                    <div data-ui-type="cell">
                      <input type="text" className="model-instance-editor-input" placeholder="includes" />
                    </div>
                  </div>
                  <div data-ui-type="row">
                    <div data-ui-type="cell">
                      <label>Unique</label>
                    </div>
                    <div data-ui-type="cell">
                      <input type="checkbox" />
                    </div>
                  </div>
                  <div data-ui-type="row">
                    <div data-ui-type="cell">
                      <label>Pattern</label>
                    </div>
                    <div data-ui-type="cell">
                      <input type="text" className="model-instance-editor-input" placeholder="pattern" />
                    </div>
                  </div>
                  <div data-ui-type="row">
                    <div data-ui-type="cell">
                      <label>Message</label>
                    </div>
                    <div data-ui-type="cell">
                      <textarea></textarea>
                    </div>
                  </div>
                </div>
              </div>
    );
  }
});
/*
 *   Property Id Editor
 * */
var PropertyIdEditor = (PropertyIdEditor = React).createClass({
  render: function() {
    var scope = this.props.scope;
    var property = this.props.property;

    var isIdChangeHandler = function(event) {
      scope.$apply(function() {
        scope.property.id = event.target.checked;
      });
    };
    return (
      <div >
      Property Id Editor

        <div data-ui-type="table" className="pocket-editor-table">
          <div data-ui-type="row">
            <div data-ui-type="cell">
              <label>Is Id</label>
            </div>
            <div data-ui-type="cell">
              <input type="checkbox" onChange={isIdChangeHandler} checked={property.id} />
              </div>
            </div>
            <div data-ui-type="row">
              <div data-ui-type="cell">
                <label>Id Injection</label>
              </div>
              <div data-ui-type="cell">
                <input type="checkbox" />
                </div>
              </div>
              <div data-ui-type="row">
                <div data-ui-type="cell">
                  <label>Autogenerated</label>
                </div>
                <div data-ui-type="cell">
                  <input type="checkbox" />
                  </div>
                </div>
                <div data-ui-type="row">
                  <div data-ui-type="cell">
                    <label>Type</label>
                  </div>
                  <div data-ui-type="cell">
                    <select>
                      <option>number</option>
                      <option>string</option>
                      <option>uid</option>
                    </select>
                  </div>
                </div>
                <div data-ui-type="row">
                  <div data-ui-type="cell">
                    <label>Autoincrement</label>
                  </div>
                  <div data-ui-type="cell">
                    <input type="checkbox" />
                    </div>
                  </div>
                </div>
              </div>
      );
  }
});
