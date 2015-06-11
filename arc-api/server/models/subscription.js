var request = require('request');
var async = require('async');
var KeyStore = require('./key-store');
var debug = require('debug')('strong-arc:subscription');

// Extract the access token from the request
function getAccessToken(req) {
  var token = req.query.access_token;
  if (token) {
    return token;
  }
  token = req.get && req.get('authorization');
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

// Parse the http response
function handleRes(err, res, body, done) {
  if (err) {
    return done(err);
  }
  if (res.statusCode !== 200 && res.statusCode !== 201
    && res.statusCode !== 204) {
    debug('Error %d: %j', res.statusCode, body);
    if (body) {
      if (typeof body.error === 'object') {
        err = new Error();
        for (var p in body.error) {
          err[p] = body.error[p];
        }
      } else if (typeof body === 'string') {
        err = new Error(body);
        err.statusCode = res.statusCode;
      }
    }
    if (!err) {
      err = new Error('Error status: ' + res.statusCode);
    }
    return done(err);
  }
  return done(err, body);
}

module.exports = function(Subscription) {
  var store = new KeyStore();

  function loadSubscriptionsFromStore(userId, cb) {
    return store.load(userId, function(err, content) {
      if (err) {
        return cb(err);
      } else {
        return cb(null, (content && content.licenses) || []);
      }
    });
  }

  function loadProductsFromStore(userId, cb) {
    return store.load(userId, function(err, content) {
      if (err) {
        return cb(err);
      } else {
        return cb(null, (content && content.products) || {});
      }
    });
  }

  Subscription.provisionSubscriptions = function(cb) {
    store.load(null, function(err, content) {
      if (err) return cb(err);
      if (content && content.userId) {
        Subscription.provisionTrials(content.userId, content.accessToken,
          function(err, result) {
            if (err) return cb(err);
            debug('Trial subscriptions provisioned:', result);
            reloadSubscriptions(content.userId, content.accessToken, null, cb);
          });
      }
    });
  };

  Subscription.provisionTrials = function(userId, accessToken, cb) {
    var url = Subscription.settings.authUrl;
    request.post({
      url: url + 'users/' + userId + '/provisionTrials',
      qs: {
        access_token: accessToken
      },
      json: true
    }, function(err, res, body) {
      handleRes(err, res, body, cb);
    });
  };


  /**
   * Get all product subscriptions for a given user
   * @param {Number|String} userId User id
   * @param {String} mode Operation mode: online/offline/...
   * @param {Request} req HTTP request object
   * @param {Function} cb callback
   */
  Subscription.getSubscriptions = function(userId, mode, req, cb) {
    if (mode === 'offline') {
      debug('Loading subscriptions from the local key store (offline)');
      // Read from the local key store
      return loadSubscriptionsFromStore(userId, cb);
    }

    var tasks = {};

    var accessToken = getAccessToken(req);
    tasks.subscriptions = function(done) {
      debug('Loading subscriptions from auth service (online)');
      var url = Subscription.settings.authUrl;
      request.get({
        url: url + 'users/' + userId + '/subscriptions',
        qs: {
          access_token: accessToken
        },
        json: true
      }, function(err, res, body) {
        handleRes(err, res, body, done);
      });
    };

    tasks.products = function(done) {
      debug('Loading products from auth service (online)');
      Subscription.getProducts(mode, req, done);
    };

    async.parallel(tasks, function(err, results) {
      if (err) {
        if (mode === 'online') {
          // Report error for online mode
          return cb(err);
        } else {
          debug('Falling back to load subscriptions from the local key store');
          // Fall back to offline mode
          return loadSubscriptionsFromStore(userId, cb);
        }
      } else {
        var products = results.products;
        var subscriptions = results.subscriptions;
        // Refresh the local key store
        store.save({
          products: products,
          licenses: subscriptions,
          userId: userId,
          accessToken: accessToken,
          modified: new Date()}, userId, function(err) {
          cb(err, subscriptions);
        });
      }
    });
  };

  function reloadSubscriptions(userId, accessToken, result, cb) {
    Subscription.getSubscriptions(userId, 'online', {
      query: {access_token: accessToken}
    }, function(err) {
      if (err) {
        return cb(err);
      } else {
        return cb(null, result);
      }
    });
  }

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
    var accessToken = getAccessToken(req);
    request.post({
      url: url + 'users/' + userId + '/renewTrial',
      qs: {
        access_token: accessToken
      },
      json: {
        product: product,
        features: features
      }
    }, function(err, res, body) {
      handleRes(err, res, body, function(err) {
        if (err) {
          return cb(err);
        }
        reloadSubscriptions(userId, accessToken, body, cb);
      });
    });
  };

  /**
   * List product descriptions
   * @param {String} mode Operation mode
   * @param {Request} req HTTP request object
   * @param {Function} cb callback
   */
  Subscription.getProducts = function(mode, req, cb) {
    if (mode === 'offline') {
      return loadProductsFromStore(null, cb);
    }
    var url = Subscription.settings.authUrl;
    request.get({
      url: url + 'subscriptions/products',
      qs: {
        access_token: getAccessToken(req)
      },
      json: true
    }, function(err, res, body) {
      if (err && mode !== 'online') {
        debug('Falling back to load products from the local key store');
        // Fall back to offline mode
        return loadProductsFromStore(null, cb);
      }
      handleRes(err, res, body, cb);
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
      handleRes(err, res, body, cb);
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
      handleRes(err, res, body, function(err) {
        if (err) {
          return cb(err);
        }
        var userId = body.userId;
        var accessToken = body.id;
        reloadSubscriptions(userId, accessToken, body, cb);
      });
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

  Subscription.remoteMethod('getProducts', {
    isStatic: true,
    description: 'List products',
    accepts: [
      {arg: 'mode', type: 'string', description: 'Operation mode',
        http: {source: 'query'}},
      {arg: 'req', type: 'object', http: {source: 'req'}}
    ],
    returns: {arg: 'data', type: 'object', root: true},
    http: {verb: 'get', path: '/products'}});

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

  // FIXME: [rfeng] This is hack to prevent gulp build from hanging due to
  // active handles in the server
  if (process.env.GULP_ANGULAR_CODEGEN) {
    return;
  }

  var app = require('../../../server/server');
  app.meshProxy.models.ManagerHost.observe('before action',
    function(ctx, next) {
      debug('Trapping strong-pm command:', ctx.data);
      if (['stop', 'start', 'restart', 'cluster-restart', 'license-push']
        .indexOf(ctx.data.cmd) === -1) {
        return next();
      }
      Subscription.getSubscriptions(null, 'offline', null,
        function(err, subscriptions) {
          if (err) {
            return next(err);
          }
          debug('Subscriptions:', subscriptions);
          if (Array.isArray(subscriptions)) {
            var keys = subscriptions.map(function(s) {
              return s.licenseKey;
            }).join(':');
            debug('Pushing license keys:', keys);
            var ServerService = ctx.instance.getPMClient().models.ServerService;
            ServerService.findById(ctx.service.serverServiceId, function(err, svc) {
              if (err) {
                return next(err);
              }
              svc.setEnv('STRONGLOOP_LICENSE', keys, function(err, res) {
                debug('Response from strong-pm: %j %j', err, res);
                if (!err && res && res.result && res.result.error) {
                  next(new Error(res.result.error));
                } else {
                  next(err, res);
                }
              });
            });
          } else {
            next();
          }
        });
    });
};
