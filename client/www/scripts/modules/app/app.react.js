/** @jsx React.DOM */
var AppSelection = (AppSelection = React).createClass({
  render: function() {
    var scope = this.props.scope;

    var options = scope.wsComps.map(function(option) {
      return (<option value={option.name}>{option.name}</option>);
    });
    return (<select>{options}</select>);
  }
});
