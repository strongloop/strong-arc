/** @jsx React.DOM */
var MetricsVisualTicker = (MetricsVisualTicker = React).createClass({
  getInitialState: function() {
    return {
      tickerValue: this.props.scope.sysTime.ticker
    }
  },
  componentWillReceiveProps: function(nextProps) {
    var component = this;
    component.setState({
      tickerValue: nextProps.scope.sysTime.ticker
    });
  },
  render: function() {
    var component = this;
    var scope = component.props.scope;
    var currTickerVal = scope.sysTime.ticker;

    var items = [];
    for (var i = 1;i < 16;i++) {
      var tickerClass = 'glyphicon glyphicon-time on';
      if (i > currTickerVal) {
        tickerClass = 'glyphicon glyphicon-time off';
      }
      items.push(<li><i className={tickerClass}></i></li>)
    }

    return (
       <ul className="metric-timer-list">
        {items}
        </ul>
      );
  }
});
