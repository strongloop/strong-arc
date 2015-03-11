var request = require('request');
var KeyStore = require('./key-store');

// Extract the access token from the request
function getAccessToken(req) {
  var token = req.query.access_token;
  if (token) {
    return token;
  }
  token = req.get('authorization');
  if (typeof token === 'string') {
    // Add support for oAuth 2.0 bearer token
    // http://tools.ietf.org/html/rfc6750
    if (token.indexOf('Bearer ') === 0) {
      token = token.substring(7);
      // Decode from base64
      var buf = new Buffer(token, 'base64');
      token = buf.toString('utf8');
    } else if (/^Basic /i.test(token)) {
      token = token.substring(6);
      token = (new Buffer(token, 'base64')).toString('utf8');
      // The spec says the string is user:pass, so if we see both parts
      // we will assume the longer of the two is the token, so we will
      // extract "a2b2c3" from:
      //   "a2b2c3"
      //   "a2b2c3:"   (curl http://a2b2c3@localhost:3000/)
      //   "token:a2b2c3" (curl http://token:a2b2c3@localhost:3000/)
      //   ":a2b2c3"
      var parts = /^([^:]*):(.*)$/.exec(token);
      if (parts) {
        token = parts[2].length > parts[1].length ? parts[2] : parts[1];
      }
    }
    return token;
  }
}

module.exports = function(Subscription) {
  var store = new KeyStore();
  /**
   * Get all product subscriptions for a given user
   * @param {Number|String} userId User id
   * @param {String} mode Operation mode: online/offline/...
   * @param {Request} req HTTP request object
   * @param {Function} cb callback
   */
  Subscription.getSubscriptions = function(userId, mode, req, cb) {
    if (mode === 'offline') {
      // Read from the local key store
      return store.load(userId, cb);
    }
    var url = Subscription.settings.authUrl;
    request.get({
      url: url + 'users/' + userId + '/subscriptions',
      qs: {
        access_token: getAccessToken(req)
      },
      json: true
    }, function(err, res, body) {
      if (err) {
        if (mode === 'online') {
          // Report error for online mode
          return cb(err, body);
        } else {
          // Fall back to offline mode
          return store.load(userId, cb);
        }
      } else {
        // Refresh the local key store
        store.save(body, userId, function(err) {
          cb(err, body);
        });
      }
    });
  };

  /**
   * Renew a trial subscription for a given user/product/features
   * @param {Number|String} userId User id
   * @param {String} product Product name
   * @param {String|String[]} features Feature names
   * @param {Request} req HTTP request object
   * @param {Function} cb callback
   */
  Subscription.renewTrial = function(userId, product, features, req, cb) {
    var url = Subscription.settings.authUrl;
    request.post({
      url: url + 'users/' + userId + '/renewTrial',
      qs: {
        access_token: getAccessToken(req)
      },
      json: {
        product: product,
        features: features
      }
    }, function(err, res, body) {
      if (err) {
        return cb(err, body);
      }
      Subscription.getSubscriptions(userId, 'online', req, function(err) {
        if (err) {
          return cb(err);
        } else {
          return cb(null, body);
        }
      });
    });
  };

  /**
   * Track usages for a given user/product/features
   * @param {Number|String} userId User id
   * @param {Object|Object[]} usages Product usages
   * @param {Request} req HTTP request object
   * @param {Function} cb callback
   */
  Subscription.trackUsages = function(userId, usages, req, cb) {
    var url = Subscription.settings.authUrl;
    request.post({
      url: url + 'users/' + userId + '/trackUsages',
      qs: {
        access_token: getAccessToken(req)
      },
      json: usages
    }, function(err, res, body) {
      cb(err, body);
    });
  };

  /**
   * Log in with credentials to get the access token
   * @param {Object} credentials username/password
   * @param {String} include Set to 'user' to include the user information
   * @param {Function} cb callback
   */
  Subscription.login = function(credentials, include, cb) {
    var url = Subscription.settings.authUrl;
    request.post({
      url: url + 'users/login',
      qs: {
        include: include
      },
      json: credentials
    }, function(err, res, body) {
      cb(err, body);
    });
  };

  Subscription.remoteMethod('login', {
      isStatic: true,
      description: 'Login a user with username/email and password',
      accepts: [
        {arg: 'credentials', type: 'object', required: true, http: {source: 'body'}},
        {arg: 'include', type: 'string', http: {source: 'query' },
          description: 'Related objects to include in the response. ' +
            'See the description of return value for more details.'}
      ],
      returns: {
        arg: 'accessToken', type: 'object', root: true,
        description: 'The response body contains properties of the AccessToken created on login.\n' +
          'Depending on the value of `include` parameter, the body may contain ' +
          'additional properties:\n\n' +
          '  - `user` - `{User}` - Data of the currently logged in user. (`include=user`)\n\n'
      },
      http: {verb: 'post', path: '/login'}
    }
  );

  Subscription.remoteMethod('getSubscriptions', {
    isStatic: true,
    description: 'List subscriptions for a given username or email',
    accepts: [
      {arg: 'userId', type: 'number', description: 'User id',
        http: {source: 'path'}, required: true},
      {arg: 'mode', type: 'string', description: 'Operation mode',
        http: {source: 'query'}},
      {arg: 'req', type: 'object', http: {source: 'req'}}
    ],
    returns: {arg: 'data', type: ['subscription'], root: true},
    http: {verb: 'get', path: '/:userId/getSubscriptions'}});

  Subscription.remoteMethod('trackUsages', {
    isStatic: true,
    description: 'Track usages',
    accepts: [
      {arg: 'userId', type: 'number', description: 'User id',
        http: {source: 'path'}, required: true},
      {arg: 'usages', type: 'array', description: 'Usage records',
        http: {source: 'body'}},
      {arg: 'req', type: 'object', http: {source: 'req'}}
    ],
    returns: {arg: 'count', type: 'number', root: true},
    http: {verb: 'post', path: '/:userId/trackUsages'}});

  Subscription.remoteMethod('renewTrial', {
    isStatic: true,
    description: 'Renew the trial subscription',
    accepts: [
      {arg: 'userId', type: 'number', description: 'User id',
        http: {source: 'path'}, required: true},
      {arg: 'product', type: 'string', description: 'product',
        http: {source: 'form'}, required: true},
      {arg: 'features', type: 'string', description: 'features',
        http: {source: 'form'}},
      {arg: 'req', type: 'object', http: {source: 'req'}}
    ],
    returns: {arg: 'subscription', type: 'subscription', root: true},
    http: {verb: 'post', path: '/:userId/renewTrial'}});

};
