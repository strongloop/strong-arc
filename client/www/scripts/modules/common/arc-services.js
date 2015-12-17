(function(window, angular, undefined) {'use strict';

var urlBase = "/api";
var authHeader = 'authorization';

function getHost(url) {
  var m = url.match(/^(?:https?:)?\/\/([^\/]+)/);
  return m ? m[1] : null;
}

var urlBaseHost = getHost(urlBase) || location.host;

/**
 * @ngdoc overview
 * @name ArcServices
 * @module
 * @description
 *
 * The `ArcServices` module provides services for interacting with
 * the models exposed by the LoopBack server via the REST API.
 *
 */
var module = angular.module("ArcServices", ['ngResource']);

/**
 * @ngdoc object
 * @name ArcServices.Project
 * @header ArcServices.Project
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Project` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Project",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Projects/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name ArcServices.Project#current
         * @methodOf ArcServices.Project
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method does not accept any data. Supply an empty object.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Project` object.)
         * </em>
         */
        "current": {
          url: urlBase + "/Projects/current",
          method: "POST"
        },
      }
    );




    /**
    * @ngdoc property
    * @name ArcServices.Project#modelName
    * @propertyOf ArcServices.Project
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Project`.
    */
    R.modelName = "Project";


    return R;
  }]);

/**
 * @ngdoc object
 * @name ArcServices.ArcApp
 * @header ArcServices.ArcApp
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `ArcApp` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "ArcApp",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/ArcApps/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name ArcServices.ArcApp#list
         * @methodOf ArcServices.ArcApp
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `results` – `{ArcApp=}` - 
         */
        "list": {
          url: urlBase + "/ArcApps",
          method: "GET"
        },
      }
    );




    /**
    * @ngdoc property
    * @name ArcServices.ArcApp#modelName
    * @propertyOf ArcServices.ArcApp
    * @description
    * The name of the model represented by this $resource,
    * i.e. `ArcApp`.
    */
    R.modelName = "ArcApp";


    return R;
  }]);

/**
 * @ngdoc object
 * @name ArcServices.Subscription
 * @header ArcServices.Subscription
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Subscription` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Subscription",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Subscriptions/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name ArcServices.Subscription#login
         * @methodOf ArcServices.Subscription
         *
         * @description
         *
         * Login a user with username/email and password
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `include` – `{string=}` - Related objects to include in the response. See the description of return value for more details.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * The response body contains properties of the AccessToken created on login.
         * Depending on the value of `include` parameter, the body may contain additional properties:
         * 
         *   - `user` - `{User}` - Data of the currently logged in user. (`include=user`)
         * 
         *
         */
        "login": {
          url: urlBase + "/Subscriptions/login",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name ArcServices.Subscription#getSubscriptions
         * @methodOf ArcServices.Subscription
         *
         * @description
         *
         * List subscriptions for a given username or email
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `userId` – `{number}` - User id
         *
         *  - `mode` – `{string=}` - Operation mode
         *
         *  - `req` – `{object=}` - 
         *
         * @param {function(Array.<Object>,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Subscription` object.)
         * </em>
         */
        "getSubscriptions": {
          isArray: true,
          url: urlBase + "/Subscriptions/:userId/getSubscriptions",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name ArcServices.Subscription#getProducts
         * @methodOf ArcServices.Subscription
         *
         * @description
         *
         * List products
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `mode` – `{string=}` - Operation mode
         *
         *  - `req` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Subscription` object.)
         * </em>
         */
        "getProducts": {
          url: urlBase + "/Subscriptions/products",
          method: "GET"
        },

        /**
         * @ngdoc method
         * @name ArcServices.Subscription#trackUsages
         * @methodOf ArcServices.Subscription
         *
         * @description
         *
         * Track usages
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `userId` – `{number}` - User id
         *
         * @param {Object} postData Request data.
         *
         *  - `usages` – `{*=}` - Usage records
         *
         *  - `req` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Subscription` object.)
         * </em>
         */
        "trackUsages": {
          url: urlBase + "/Subscriptions/:userId/trackUsages",
          method: "POST"
        },

        /**
         * @ngdoc method
         * @name ArcServices.Subscription#renewTrial
         * @methodOf ArcServices.Subscription
         *
         * @description
         *
         * Renew the trial subscription
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `userId` – `{number}` - User id
         *
         * @param {Object} postData Request data.
         *
         *  - `product` – `{string}` - product
         *
         *  - `features` – `{string=}` - features
         *
         *  - `req` – `{object=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Subscription` object.)
         * </em>
         */
        "renewTrial": {
          url: urlBase + "/Subscriptions/:userId/renewTrial",
          method: "POST"
        },
      }
    );




    /**
    * @ngdoc property
    * @name ArcServices.Subscription#modelName
    * @propertyOf ArcServices.Subscription
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Subscription`.
    */
    R.modelName = "Subscription";


    return R;
  }]);


module
  .factory('LoopBackAuth', function() {
    var props = ['accessTokenId', 'currentUserId', 'rememberMe'];
    var propsPrefix = '$LoopBack$';

    function LoopBackAuth() {
      var self = this;
      props.forEach(function(name) {
        self[name] = load(name);
      });
      this.currentUserData = null;
    }

    LoopBackAuth.prototype.save = function() {
      var self = this;
      var storage = this.rememberMe ? localStorage : sessionStorage;
      props.forEach(function(name) {
        save(storage, name, self[name]);
      });
    };

    LoopBackAuth.prototype.setUser = function(accessTokenId, userId, userData) {
      this.accessTokenId = accessTokenId;
      this.currentUserId = userId;
      this.currentUserData = userData;
    }

    LoopBackAuth.prototype.clearUser = function() {
      this.accessTokenId = null;
      this.currentUserId = null;
      this.currentUserData = null;
    }

    LoopBackAuth.prototype.clearStorage = function() {
      props.forEach(function(name) {
        save(sessionStorage, name, null);
        save(localStorage, name, null);
      });
    };

    return new LoopBackAuth();

    // Note: LocalStorage converts the value to string
    // We are using empty string as a marker for null/undefined values.
    function save(storage, name, value) {
      var key = propsPrefix + name;
      if (value == null) value = '';
      storage[key] = value;
    }

    function load(name) {
      var key = propsPrefix + name;
      return localStorage[key] || sessionStorage[key] || null;
    }
  })
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('LoopBackAuthRequestInterceptor');
  }])
  .factory('LoopBackAuthRequestInterceptor', [ '$q', 'LoopBackAuth',
    function($q, LoopBackAuth) {
      return {
        'request': function(config) {

          // filter out external requests
          var host = getHost(config.url);
          if (host && host !== urlBaseHost) {
            return config;
          }

          if (LoopBackAuth.accessTokenId) {
            config.headers[authHeader] = LoopBackAuth.accessTokenId;
          } else if (config.__isGetCurrentUser__) {
            // Return a stub 401 error for User.getCurrent() when
            // there is no user logged in
            var res = {
              body: { error: { status: 401 } },
              status: 401,
              config: config,
              headers: function() { return undefined; }
            };
            return $q.reject(res);
          }
          return config || $q.when(config);
        }
      }
    }])

  /**
   * @ngdoc object
   * @name ArcServices.LoopBackResourceProvider
   * @header ArcServices.LoopBackResourceProvider
   * @description
   * Use `LoopBackResourceProvider` to change the global configuration
   * settings used by all models. Note that the provider is available
   * to Configuration Blocks only, see
   * {@link https://docs.angularjs.org/guide/module#module-loading-dependencies Module Loading & Dependencies}
   * for more details.
   *
   * ## Example
   *
   * ```js
   * angular.module('app')
   *  .config(function(LoopBackResourceProvider) {
   *     LoopBackResourceProvider.setAuthHeader('X-Access-Token');
   *  });
   * ```
   */
  .provider('LoopBackResource', function LoopBackResourceProvider() {
    /**
     * @ngdoc method
     * @name ArcServices.LoopBackResourceProvider#setAuthHeader
     * @methodOf ArcServices.LoopBackResourceProvider
     * @param {string} header The header name to use, e.g. `X-Access-Token`
     * @description
     * Configure the REST transport to use a different header for sending
     * the authentication token. It is sent in the `Authorization` header
     * by default.
     */
    this.setAuthHeader = function(header) {
      authHeader = header;
    };

    /**
     * @ngdoc method
     * @name ArcServices.LoopBackResourceProvider#setUrlBase
     * @methodOf ArcServices.LoopBackResourceProvider
     * @param {string} url The URL to use, e.g. `/api` or `//example.com/api`.
     * @description
     * Change the URL of the REST API server. By default, the URL provided
     * to the code generator (`lb-ng` or `grunt-loopback-sdk-angular`) is used.
     */
    this.setUrlBase = function(url) {
      urlBase = url;
      urlBaseHost = getHost(urlBase) || location.host;
    };

    /**
     * @ngdoc method
     * @name ArcServices.LoopBackResourceProvider#getUrlBase
     * @methodOf ArcServices.LoopBackResourceProvider
     * @description
     * Get the URL of the REST API server. The URL provided
     * to the code generator (`lb-ng` or `grunt-loopback-sdk-angular`) is used.
     */
    this.getUrlBase = function() {
      return urlBase;
    };

    this.$get = ['$resource', function($resource) {
      return function(url, params, actions) {
        var resource = $resource(url, params, actions);

        // Angular always calls POST on $save()
        // This hack is based on
        // http://kirkbushell.me/angular-js-using-ng-resource-in-a-more-restful-manner/
        resource.prototype.$save = function(success, error) {
          // Fortunately, LoopBack provides a convenient `upsert` method
          // that exactly fits our needs.
          var result = resource.upsert.call(this, {}, this, success, error);
          return result.$promise || result;
        };
        return resource;
      };
    }];
  });

})(window, window.angular);
