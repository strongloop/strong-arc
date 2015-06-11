/*jshint browser:true */
/*global InspectorBackendClass:true */

// Show the "profiles" panel on startup
var lastActiveDTPanel = window.localStorage.getItem('lastActiveDTPanel')? window.localStorage.getItem('lastActiveDTPanel') : 'profiles';
localStorage.lastActivePanel = JSON.stringify(lastActiveDTPanel);
//localStorage.lastActivePanel = JSON.stringify('profiles');

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

var SL = window.SL || {};
SL.child = SL.child || {};
SL.child.profiler = SL.child.profiler || {};

SL.child.profiler = {
  slInit: function(){
    var event = new Event('slInit');

    //todo fire event on an object
    //WebInspector.Main.dispatchEvent(event);
    document.documentElement.dispatchEvent(event);
  },

  setActiveProcess: function(process){
    var event = new CustomEvent('setActiveProcess', {
      detail: {
        process: process
      }
    });

    document.documentElement.dispatchEvent(event);
  },

  setServer: function(server){
    var event = new CustomEvent('setServer', {
      detail: {
        server: server
      }
    });

    document.documentElement.dispatchEvent(event);
  },

  loadFile: function(file) {
    var event = new CustomEvent('loadFile', {
      detail: {
        file: file
      }
    });

    document.documentElement.dispatchEvent(event);
  },

  showProfile: function(profile) {
    var event = new CustomEvent('showProfile', {
      detail: {
        profile: profile
      }
    });

    document.documentElement.dispatchEvent(event);
  }
};

//initialize itself when iframe loads
(function(){
    SL.child.profiler.slInit();
})();
