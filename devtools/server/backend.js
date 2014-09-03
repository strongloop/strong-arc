var extend = require('util')._extend;
var debug = require('debug')('studio:devtools');

module.exports = DevToolsBackend;

function DevToolsBackend() {
}

var sampleCpuProfile = loadExampleJsonSync('sample.cpuprofile');
var sampleHeapSnapshot = loadExampleJsonSync('sample.heapsnapshot');

var COMMANDS = {
  'Worker.canInspectWorkers': { result: false },

  'Page.getScriptExecutionStatus': { result: 'enabled' },
  'Page.getResourceTree': {
    frameTree: {
      frame: {
        id: 'dummy-toplevel-frame',
        url: 'app.js',
        securityOrigin: 'localhost'
      },
      resources: []
    }
  },

  'IndexedDB.requestDatabaseNames': {
    databaseNames: []
  },

  // Temporary implementation returning sample data
  'Profiler.stop': { profile: sampleCpuProfile },

  // TODO(bajtos) support Heap profiler
  // 'HeapProfiler.takeHeapSnapshot'
  // 'HeapProfiler.stopTrackingHeapObjects'
};

extend(DevToolsBackend.prototype, {
  serve: function(client) {
    this.client = client;
    this.client.on('message', this._onRequest.bind(this));
    this.client.on('error', this._onError.bind(this));
  },

  _onRequest: function(data) {
    var request;
    try {
      request = JSON.parse(data);
    } catch(err) {
      console.warn('**warn** malformed JSON request %j', data);
    }
    debug('request #%s %s', request.id, request.method, request.params);
    this._handle(request);
  },

  _handle: function(request) {
    var self = this;
    var resultOrHandler = COMMANDS[request.method];
    var fn = typeof resultOrHandler === 'function' ?
      resultOrHandler :
      function(params, callback) {
        callback(null, resultOrHandler);
      };

    fn(request.params, function handleResult(err, result) {
      debug('response #%s %s', request.id, request.method, result);
      var response = { id: request.id };
      if (err) {
        response.error = err.toString();
      } else {
        response.result = result;
      }
      self._sendMessage(response);
    });
  },

  _onError: function(err) {
    console.warn('**warn** websocket error', err);
  },

  _sendMessage: function(message) {
    this.client.send(JSON.stringify(message));
  },
});

function loadExampleJsonSync(name) {
  var fs = require('fs');
  var path = require('path');
  return JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, '..', 'examples', name),
      'utf8'));
}
