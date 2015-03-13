var fs = require('fs-extra');
var path = require('path');
var async = require('async');

var homeDir = process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE;

/**
 * Key store
 * @param options
 * @constructor
 */
function KeyStore(options) {
  options = options || {};
  this.root = options.root || path.join(homeDir, '.strongloop');
  this.perUser = options.perUser || false;
}

KeyStore.prototype.getStoreFile = function(userId) {
  var name = 'licenses.json';
  if (this.perUser && userId) {
    name = 'licenses-' + userId + '.json';
  }
  return path.join(this.root, name);
};

KeyStore.prototype.getQueue = function() {
  if (!this.storeQueue) {
    this.storeQueue = async.queue(function(task, cb) {
      task(cb);
    }, 1);
  }
  return this.storeQueue;
};

KeyStore.prototype.save = function(data, userId, cb) {
  if (typeof userId === 'function' && cb === undefined) {
    cb = userId;
    userId = undefined;
  }
  var storeFile = this.getStoreFile(userId);
  this.getQueue().push(function(done) {
    return fs.outputJson(storeFile, data, done);
  }, cb);
}

KeyStore.prototype.load = function(userId, cb) {
  if (typeof userId === 'function' && cb === undefined) {
    cb = userId;
    userId = undefined;
  }
  var storeFile = this.getStoreFile(userId);
  this.getQueue().push(function(done) {
    return fs.readJson(storeFile, done);
  }, cb);
}

module.exports = KeyStore;

