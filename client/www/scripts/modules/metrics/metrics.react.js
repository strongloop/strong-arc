/** @jsx React.DOM */
var MetricsCounterItem = (MetricsCounterItem = React).createClass({
  render: function() {
    return (<li>|</li>);
  }
});
var MetricsUpdateCounter = (MetricsUpdateCounter = React).createClass({
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

    var rows = [];
    for (var i=0; i < currTickerVal; i++) {
      rows.push(<MetricsCounterItem />);
    }

    return (
      <div data-id="MetricCounterContainer">
        <div data-ui-type="table" data-id="MetricsTimerDisplayContainer">
          <div data-ui-type="row">
            <div data-ui-type="cell">

            </div>
            <div data-ui-type="cell" className="timer-display-value-col">

            </div>
            <div data-ui-type="cell">
              <label>data points:</label>
            </div>
            <div data-ui-type="cell" className="timer-display-value-col">
              <span>{ scope.dataPointCount }</span>
            </div>
            <div data-ui-type="cell" className="heartbeat-col">
              <span className="metrics-dashboard-instrument-value">
                <ul className="metric-timer-list">
              {rows}
                </ul>
              </span>
            </div>
          </div>
        </div>
        <br />
      </div>
      );
  }
});





