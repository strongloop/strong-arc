/*jshint browser:true */
/*global InspectorBackendClass:true */

// Show the "profiles" panel on startup
localStorage.lastActivePanel = JSON.stringify('profiles');

// Wire up websocket to talk to backend
WebInspector.Main.prototype._createConnection = function() {
  var webSocketUrl = function() {
    var a = document.createElement('a');
    // browser will resolve this relative path to an absolute one
    a.href = 'ws';
    a.protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return a.href;
  }();

  InspectorBackendClass.WebSocketConnection.Create(
    webSocketUrl,
    this._connectionEstablished.bind(this));
};
