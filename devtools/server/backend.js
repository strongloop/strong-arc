var extend = require('util')._extend;
module.exports = DevToolsBackend;

function DevToolsBackend() {
}

extend(DevToolsBackend.prototype, {
  serve: function(client) {
    this.client = client;
    this.client.on('message', this._onRequest.bind(this));
    this.client.on('error', this._onError.bind(this));
  },

  _onRequest: function(message) {
    console.log('TODO request', message);
  },

  _onError: function(err) {
    console.warn('**warn** websocket error', err);
  },

  _sendMessage: function(message) {
    this.client.send(JSON.stringify(message));
  },
});
