(function(window, angular, undefined) {'use strict';

var urlBase = "/api";

/**
 * @ngdoc overview
 * @name lbServices
 * @module
 * @description
 *
 * The `lbServices` module provides services for interacting with
 * the models exposed by the LoopBack server via the REST API.
 *
 */
var module = angular.module("lbServices", ['ngResource']);

/**
 * @ngdoc object
 * @name lbServices.AppDefinition
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `AppDefinition` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "AppDefinition",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/AppDefinitions/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#create
         * @methodOf lbServices.AppDefinition
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AppDefinition` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/AppDefinitions",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#updateOrCreate
         * @methodOf lbServices.AppDefinition
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AppDefinition` object.)
         * </em>
         */
        "updateOrCreate": {
          url: urlBase + "/AppDefinitions",
          method: "PUT",
        },

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#exists
         * @methodOf lbServices.AppDefinition
         *
         * @description
         *
         * Check whether a model instance exists in the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{*=}` - 
         */
        "exists": {
          url: urlBase + "/AppDefinitions/:id/exists",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#findById
         * @methodOf lbServices.AppDefinition
         *
         * @description
         *
         * Find a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AppDefinition` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/AppDefinitions/:id",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#find
         * @methodOf lbServices.AppDefinition
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AppDefinition` object.)
         * </em>
         */
        "find": {
          url: urlBase + "/AppDefinitions",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#findOne
         * @methodOf lbServices.AppDefinition
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AppDefinition` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/AppDefinitions/findOne",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#destroyById
         * @methodOf lbServices.AppDefinition
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "destroyById": {
          url: urlBase + "/AppDefinitions/:id",
          method: "DELETE",
        },

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#count
         * @methodOf lbServices.AppDefinition
         *
         * @description
         *
         * Count instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/AppDefinitions/count",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#prototype$updateAttributes
         * @methodOf lbServices.AppDefinition
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - AppDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AppDefinition` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/AppDefinitions/:id",
          method: "PUT",
        },

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#prototype$__get__models
         * @methodOf lbServices.AppDefinition
         * @deprecated Use AppDefinition.models() instead.
         *
         * @description
         *
         * Queries models of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - AppDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AppDefinition` object.)
         * </em>
         */
        "prototype$__get__models": {
          url: urlBase + "/AppDefinitions/:id/models",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#prototype$__create__models
         * @methodOf lbServices.AppDefinition
         * @deprecated Use AppDefinition.models.create() instead.
         *
         * @description
         *
         * Creates a new instance in models of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - AppDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AppDefinition` object.)
         * </em>
         */
        "prototype$__create__models": {
          url: urlBase + "/AppDefinitions/:id/models",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#prototype$__delete__models
         * @methodOf lbServices.AppDefinition
         * @deprecated Use AppDefinition.models.destroyAll() instead.
         *
         * @description
         *
         * Deletes all models of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - AppDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AppDefinition` object.)
         * </em>
         */
        "prototype$__delete__models": {
          url: urlBase + "/AppDefinitions/:id/models",
          method: "DELETE",
        },

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#prototype$__get__datasources
         * @methodOf lbServices.AppDefinition
         * @deprecated Use AppDefinition.datasources() instead.
         *
         * @description
         *
         * Queries datasources of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - AppDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AppDefinition` object.)
         * </em>
         */
        "prototype$__get__datasources": {
          url: urlBase + "/AppDefinitions/:id/datasources",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#prototype$__create__datasources
         * @methodOf lbServices.AppDefinition
         * @deprecated Use AppDefinition.datasources.create() instead.
         *
         * @description
         *
         * Creates a new instance in datasources of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - AppDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AppDefinition` object.)
         * </em>
         */
        "prototype$__create__datasources": {
          url: urlBase + "/AppDefinitions/:id/datasources",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#prototype$__delete__datasources
         * @methodOf lbServices.AppDefinition
         * @deprecated Use AppDefinition.datasources.destroyAll() instead.
         *
         * @description
         *
         * Deletes all datasources of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - AppDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AppDefinition` object.)
         * </em>
         */
        "prototype$__delete__datasources": {
          url: urlBase + "/AppDefinitions/:id/datasources",
          method: "DELETE",
        },

        // INTERNAL. Use DataSourceDefinition.app() instead.
        "::get::DataSourceDefinition::app": {
          url: urlBase + "/DataSourceDefinitions/:id/app",
          method: "GET",
        },
      }
    );


        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#models
         * @methodOf lbServices.AppDefinition
         * @deprecated Use AppDefinition.models() instead.
         *
         * @description
         *
         * Queries models of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - AppDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        R.models = function() {
          var TargetResource = $injector.get("ModelDefinition");
          var action = TargetResource["::get::AppDefinition::models"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#models.create
         * @methodOf lbServices.AppDefinition
         * @deprecated Use AppDefinition.models.create() instead.
         *
         * @description
         *
         * Creates a new instance in models of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - AppDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        R.models.create = function() {
          var TargetResource = $injector.get("ModelDefinition");
          var action = TargetResource["::create::AppDefinition::models"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#models.destroyAll
         * @methodOf lbServices.AppDefinition
         * @deprecated Use AppDefinition.models.destroyAll() instead.
         *
         * @description
         *
         * Deletes all models of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - AppDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        R.models.destroyAll = function() {
          var TargetResource = $injector.get("ModelDefinition");
          var action = TargetResource["::delete::AppDefinition::models"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#datasources
         * @methodOf lbServices.AppDefinition
         * @deprecated Use AppDefinition.datasources() instead.
         *
         * @description
         *
         * Queries datasources of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - AppDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DataSourceDefinition` object.)
         * </em>
         */
        R.datasources = function() {
          var TargetResource = $injector.get("DataSourceDefinition");
          var action = TargetResource["::get::AppDefinition::datasources"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#datasources.create
         * @methodOf lbServices.AppDefinition
         * @deprecated Use AppDefinition.datasources.create() instead.
         *
         * @description
         *
         * Creates a new instance in datasources of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - AppDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DataSourceDefinition` object.)
         * </em>
         */
        R.datasources.create = function() {
          var TargetResource = $injector.get("DataSourceDefinition");
          var action = TargetResource["::create::AppDefinition::datasources"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.AppDefinition#datasources.destroyAll
         * @methodOf lbServices.AppDefinition
         * @deprecated Use AppDefinition.datasources.destroyAll() instead.
         *
         * @description
         *
         * Deletes all datasources of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - AppDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DataSourceDefinition` object.)
         * </em>
         */
        R.datasources.destroyAll = function() {
          var TargetResource = $injector.get("DataSourceDefinition");
          var action = TargetResource["::delete::AppDefinition::datasources"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.ModelDefinition
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `ModelDefinition` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "ModelDefinition",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/ModelDefinitions/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#create
         * @methodOf lbServices.ModelDefinition
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/ModelDefinitions",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#updateOrCreate
         * @methodOf lbServices.ModelDefinition
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "updateOrCreate": {
          url: urlBase + "/ModelDefinitions",
          method: "PUT",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#exists
         * @methodOf lbServices.ModelDefinition
         *
         * @description
         *
         * Check whether a model instance exists in the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{*=}` - 
         */
        "exists": {
          url: urlBase + "/ModelDefinitions/:id/exists",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#findById
         * @methodOf lbServices.ModelDefinition
         *
         * @description
         *
         * Find a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/ModelDefinitions/:id",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#find
         * @methodOf lbServices.ModelDefinition
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "find": {
          url: urlBase + "/ModelDefinitions",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#findOne
         * @methodOf lbServices.ModelDefinition
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/ModelDefinitions/findOne",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#destroyById
         * @methodOf lbServices.ModelDefinition
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "destroyById": {
          url: urlBase + "/ModelDefinitions/:id",
          method: "DELETE",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#count
         * @methodOf lbServices.ModelDefinition
         *
         * @description
         *
         * Count instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/ModelDefinitions/count",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$updateAttributes
         * @methodOf lbServices.ModelDefinition
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/ModelDefinitions/:id",
          method: "PUT",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$__get__methods
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.methods() instead.
         *
         * @description
         *
         * Queries methods of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$__get__methods": {
          url: urlBase + "/ModelDefinitions/:id/methods",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$__create__methods
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.methods.create() instead.
         *
         * @description
         *
         * Creates a new instance in methods of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$__create__methods": {
          url: urlBase + "/ModelDefinitions/:id/methods",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$__delete__methods
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.methods.destroyAll() instead.
         *
         * @description
         *
         * Deletes all methods of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$__delete__methods": {
          url: urlBase + "/ModelDefinitions/:id/methods",
          method: "DELETE",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$__get__relations
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.relations() instead.
         *
         * @description
         *
         * Queries relations of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$__get__relations": {
          url: urlBase + "/ModelDefinitions/:id/relations",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$__create__relations
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.relations.create() instead.
         *
         * @description
         *
         * Creates a new instance in relations of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$__create__relations": {
          url: urlBase + "/ModelDefinitions/:id/relations",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$__delete__relations
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.relations.destroyAll() instead.
         *
         * @description
         *
         * Deletes all relations of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$__delete__relations": {
          url: urlBase + "/ModelDefinitions/:id/relations",
          method: "DELETE",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$__get__accessControls
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.accessControls() instead.
         *
         * @description
         *
         * Queries accessControls of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$__get__accessControls": {
          url: urlBase + "/ModelDefinitions/:id/accessControls",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$__create__accessControls
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.accessControls.create() instead.
         *
         * @description
         *
         * Creates a new instance in accessControls of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$__create__accessControls": {
          url: urlBase + "/ModelDefinitions/:id/accessControls",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$__delete__accessControls
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.accessControls.destroyAll() instead.
         *
         * @description
         *
         * Deletes all accessControls of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$__delete__accessControls": {
          url: urlBase + "/ModelDefinitions/:id/accessControls",
          method: "DELETE",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$__get__properties
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.properties() instead.
         *
         * @description
         *
         * Queries properties of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$__get__properties": {
          url: urlBase + "/ModelDefinitions/:id/properties",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$__create__properties
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.properties.create() instead.
         *
         * @description
         *
         * Creates a new instance in properties of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$__create__properties": {
          url: urlBase + "/ModelDefinitions/:id/properties",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$__delete__properties
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.properties.destroyAll() instead.
         *
         * @description
         *
         * Deletes all properties of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$__delete__properties": {
          url: urlBase + "/ModelDefinitions/:id/properties",
          method: "DELETE",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$__get__validations
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.validations() instead.
         *
         * @description
         *
         * Queries validations of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$__get__validations": {
          url: urlBase + "/ModelDefinitions/:id/validations",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$__create__validations
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.validations.create() instead.
         *
         * @description
         *
         * Creates a new instance in validations of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$__create__validations": {
          url: urlBase + "/ModelDefinitions/:id/validations",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$__delete__validations
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.validations.destroyAll() instead.
         *
         * @description
         *
         * Deletes all validations of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$__delete__validations": {
          url: urlBase + "/ModelDefinitions/:id/validations",
          method: "DELETE",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$__get__views
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.views() instead.
         *
         * @description
         *
         * Queries views of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$__get__views": {
          url: urlBase + "/ModelDefinitions/:id/views",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$__create__views
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.views.create() instead.
         *
         * @description
         *
         * Creates a new instance in views of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$__create__views": {
          url: urlBase + "/ModelDefinitions/:id/views",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#prototype$__delete__views
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.views.destroyAll() instead.
         *
         * @description
         *
         * Deletes all views of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        "prototype$__delete__views": {
          url: urlBase + "/ModelDefinitions/:id/views",
          method: "DELETE",
        },

        // INTERNAL. Use AppDefinition.models() instead.
        "::get::AppDefinition::models": {
          url: urlBase + "/AppDefinitions/:id/models",
          method: "GET",
          isArray: true,
        },

        // INTERNAL. Use AppDefinition.models.create() instead.
        "::create::AppDefinition::models": {
          url: urlBase + "/AppDefinitions/:id/models",
          method: "POST",
        },

        // INTERNAL. Use AppDefinition.models.destroyAll() instead.
        "::delete::AppDefinition::models": {
          url: urlBase + "/AppDefinitions/:id/models",
          method: "DELETE",
        },

        // INTERNAL. Use DataSourceDefinition.models() instead.
        "::get::DataSourceDefinition::models": {
          url: urlBase + "/DataSourceDefinitions/:id/models",
          method: "GET",
          isArray: true,
        },

        // INTERNAL. Use DataSourceDefinition.models.create() instead.
        "::create::DataSourceDefinition::models": {
          url: urlBase + "/DataSourceDefinitions/:id/models",
          method: "POST",
        },

        // INTERNAL. Use DataSourceDefinition.models.destroyAll() instead.
        "::delete::DataSourceDefinition::models": {
          url: urlBase + "/DataSourceDefinitions/:id/models",
          method: "DELETE",
        },
      }
    );


        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#methods
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.methods() instead.
         *
         * @description
         *
         * Queries methods of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelMethod` object.)
         * </em>
         */
        R.methods = function() {
          var TargetResource = $injector.get("ModelMethod");
          var action = TargetResource["::get::ModelDefinition::methods"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#methods.create
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.methods.create() instead.
         *
         * @description
         *
         * Creates a new instance in methods of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelMethod` object.)
         * </em>
         */
        R.methods.create = function() {
          var TargetResource = $injector.get("ModelMethod");
          var action = TargetResource["::create::ModelDefinition::methods"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#methods.destroyAll
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.methods.destroyAll() instead.
         *
         * @description
         *
         * Deletes all methods of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelMethod` object.)
         * </em>
         */
        R.methods.destroyAll = function() {
          var TargetResource = $injector.get("ModelMethod");
          var action = TargetResource["::delete::ModelDefinition::methods"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#relations
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.relations() instead.
         *
         * @description
         *
         * Queries relations of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelRelation` object.)
         * </em>
         */
        R.relations = function() {
          var TargetResource = $injector.get("ModelRelation");
          var action = TargetResource["::get::ModelDefinition::relations"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#relations.create
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.relations.create() instead.
         *
         * @description
         *
         * Creates a new instance in relations of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelRelation` object.)
         * </em>
         */
        R.relations.create = function() {
          var TargetResource = $injector.get("ModelRelation");
          var action = TargetResource["::create::ModelDefinition::relations"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#relations.destroyAll
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.relations.destroyAll() instead.
         *
         * @description
         *
         * Deletes all relations of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelRelation` object.)
         * </em>
         */
        R.relations.destroyAll = function() {
          var TargetResource = $injector.get("ModelRelation");
          var action = TargetResource["::delete::ModelDefinition::relations"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#accessControls
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.accessControls() instead.
         *
         * @description
         *
         * Queries accessControls of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelAccessControl` object.)
         * </em>
         */
        R.accessControls = function() {
          var TargetResource = $injector.get("ModelAccessControl");
          var action = TargetResource["::get::ModelDefinition::accessControls"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#accessControls.create
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.accessControls.create() instead.
         *
         * @description
         *
         * Creates a new instance in accessControls of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelAccessControl` object.)
         * </em>
         */
        R.accessControls.create = function() {
          var TargetResource = $injector.get("ModelAccessControl");
          var action = TargetResource["::create::ModelDefinition::accessControls"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#accessControls.destroyAll
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.accessControls.destroyAll() instead.
         *
         * @description
         *
         * Deletes all accessControls of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelAccessControl` object.)
         * </em>
         */
        R.accessControls.destroyAll = function() {
          var TargetResource = $injector.get("ModelAccessControl");
          var action = TargetResource["::delete::ModelDefinition::accessControls"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#properties
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.properties() instead.
         *
         * @description
         *
         * Queries properties of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelProperty` object.)
         * </em>
         */
        R.properties = function() {
          var TargetResource = $injector.get("ModelProperty");
          var action = TargetResource["::get::ModelDefinition::properties"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#properties.create
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.properties.create() instead.
         *
         * @description
         *
         * Creates a new instance in properties of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelProperty` object.)
         * </em>
         */
        R.properties.create = function() {
          var TargetResource = $injector.get("ModelProperty");
          var action = TargetResource["::create::ModelDefinition::properties"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#properties.destroyAll
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.properties.destroyAll() instead.
         *
         * @description
         *
         * Deletes all properties of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelProperty` object.)
         * </em>
         */
        R.properties.destroyAll = function() {
          var TargetResource = $injector.get("ModelProperty");
          var action = TargetResource["::delete::ModelDefinition::properties"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#validations
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.validations() instead.
         *
         * @description
         *
         * Queries validations of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PropertyValidation` object.)
         * </em>
         */
        R.validations = function() {
          var TargetResource = $injector.get("PropertyValidation");
          var action = TargetResource["::get::ModelDefinition::validations"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#validations.create
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.validations.create() instead.
         *
         * @description
         *
         * Creates a new instance in validations of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PropertyValidation` object.)
         * </em>
         */
        R.validations.create = function() {
          var TargetResource = $injector.get("PropertyValidation");
          var action = TargetResource["::create::ModelDefinition::validations"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#validations.destroyAll
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.validations.destroyAll() instead.
         *
         * @description
         *
         * Deletes all validations of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PropertyValidation` object.)
         * </em>
         */
        R.validations.destroyAll = function() {
          var TargetResource = $injector.get("PropertyValidation");
          var action = TargetResource["::delete::ModelDefinition::validations"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#views
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.views() instead.
         *
         * @description
         *
         * Queries views of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ViewDefinition` object.)
         * </em>
         */
        R.views = function() {
          var TargetResource = $injector.get("ViewDefinition");
          var action = TargetResource["::get::ModelDefinition::views"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#views.create
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.views.create() instead.
         *
         * @description
         *
         * Creates a new instance in views of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ViewDefinition` object.)
         * </em>
         */
        R.views.create = function() {
          var TargetResource = $injector.get("ViewDefinition");
          var action = TargetResource["::create::ModelDefinition::views"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ModelDefinition#views.destroyAll
         * @methodOf lbServices.ModelDefinition
         * @deprecated Use ModelDefinition.views.destroyAll() instead.
         *
         * @description
         *
         * Deletes all views of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ViewDefinition` object.)
         * </em>
         */
        R.views.destroyAll = function() {
          var TargetResource = $injector.get("ViewDefinition");
          var action = TargetResource["::delete::ModelDefinition::views"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.ModelMethod
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `ModelMethod` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "ModelMethod",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/ModelMethods/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.ModelMethod#create
         * @methodOf lbServices.ModelMethod
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelMethod` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/ModelMethods",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelMethod#updateOrCreate
         * @methodOf lbServices.ModelMethod
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelMethod` object.)
         * </em>
         */
        "updateOrCreate": {
          url: urlBase + "/ModelMethods",
          method: "PUT",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelMethod#exists
         * @methodOf lbServices.ModelMethod
         *
         * @description
         *
         * Check whether a model instance exists in the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{*=}` - 
         */
        "exists": {
          url: urlBase + "/ModelMethods/:id/exists",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelMethod#findById
         * @methodOf lbServices.ModelMethod
         *
         * @description
         *
         * Find a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelMethod` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/ModelMethods/:id",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelMethod#find
         * @methodOf lbServices.ModelMethod
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelMethod` object.)
         * </em>
         */
        "find": {
          url: urlBase + "/ModelMethods",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelMethod#findOne
         * @methodOf lbServices.ModelMethod
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelMethod` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/ModelMethods/findOne",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelMethod#destroyById
         * @methodOf lbServices.ModelMethod
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "destroyById": {
          url: urlBase + "/ModelMethods/:id",
          method: "DELETE",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelMethod#count
         * @methodOf lbServices.ModelMethod
         *
         * @description
         *
         * Count instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/ModelMethods/count",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelMethod#prototype$updateAttributes
         * @methodOf lbServices.ModelMethod
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelMethod id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelMethod` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/ModelMethods/:id",
          method: "PUT",
        },

        // INTERNAL. Use ModelDefinition.methods() instead.
        "::get::ModelDefinition::methods": {
          url: urlBase + "/ModelDefinitions/:id/methods",
          method: "GET",
          isArray: true,
        },

        // INTERNAL. Use ModelDefinition.methods.create() instead.
        "::create::ModelDefinition::methods": {
          url: urlBase + "/ModelDefinitions/:id/methods",
          method: "POST",
        },

        // INTERNAL. Use ModelDefinition.methods.destroyAll() instead.
        "::delete::ModelDefinition::methods": {
          url: urlBase + "/ModelDefinitions/:id/methods",
          method: "DELETE",
        },
      }
    );


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.ModelRelation
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `ModelRelation` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "ModelRelation",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/ModelRelations/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.ModelRelation#create
         * @methodOf lbServices.ModelRelation
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelRelation` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/ModelRelations",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelRelation#updateOrCreate
         * @methodOf lbServices.ModelRelation
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelRelation` object.)
         * </em>
         */
        "updateOrCreate": {
          url: urlBase + "/ModelRelations",
          method: "PUT",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelRelation#exists
         * @methodOf lbServices.ModelRelation
         *
         * @description
         *
         * Check whether a model instance exists in the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{*=}` - 
         */
        "exists": {
          url: urlBase + "/ModelRelations/:id/exists",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelRelation#findById
         * @methodOf lbServices.ModelRelation
         *
         * @description
         *
         * Find a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelRelation` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/ModelRelations/:id",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelRelation#find
         * @methodOf lbServices.ModelRelation
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelRelation` object.)
         * </em>
         */
        "find": {
          url: urlBase + "/ModelRelations",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelRelation#findOne
         * @methodOf lbServices.ModelRelation
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelRelation` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/ModelRelations/findOne",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelRelation#destroyById
         * @methodOf lbServices.ModelRelation
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "destroyById": {
          url: urlBase + "/ModelRelations/:id",
          method: "DELETE",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelRelation#count
         * @methodOf lbServices.ModelRelation
         *
         * @description
         *
         * Count instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/ModelRelations/count",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelRelation#prototype$updateAttributes
         * @methodOf lbServices.ModelRelation
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelRelation id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelRelation` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/ModelRelations/:id",
          method: "PUT",
        },

        // INTERNAL. Use ModelDefinition.relations() instead.
        "::get::ModelDefinition::relations": {
          url: urlBase + "/ModelDefinitions/:id/relations",
          method: "GET",
          isArray: true,
        },

        // INTERNAL. Use ModelDefinition.relations.create() instead.
        "::create::ModelDefinition::relations": {
          url: urlBase + "/ModelDefinitions/:id/relations",
          method: "POST",
        },

        // INTERNAL. Use ModelDefinition.relations.destroyAll() instead.
        "::delete::ModelDefinition::relations": {
          url: urlBase + "/ModelDefinitions/:id/relations",
          method: "DELETE",
        },
      }
    );


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.ModelAccessControl
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `ModelAccessControl` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "ModelAccessControl",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/ModelAccessControls/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.ModelAccessControl#create
         * @methodOf lbServices.ModelAccessControl
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelAccessControl` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/ModelAccessControls",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelAccessControl#updateOrCreate
         * @methodOf lbServices.ModelAccessControl
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelAccessControl` object.)
         * </em>
         */
        "updateOrCreate": {
          url: urlBase + "/ModelAccessControls",
          method: "PUT",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelAccessControl#exists
         * @methodOf lbServices.ModelAccessControl
         *
         * @description
         *
         * Check whether a model instance exists in the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{*=}` - 
         */
        "exists": {
          url: urlBase + "/ModelAccessControls/:id/exists",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelAccessControl#findById
         * @methodOf lbServices.ModelAccessControl
         *
         * @description
         *
         * Find a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelAccessControl` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/ModelAccessControls/:id",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelAccessControl#find
         * @methodOf lbServices.ModelAccessControl
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelAccessControl` object.)
         * </em>
         */
        "find": {
          url: urlBase + "/ModelAccessControls",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelAccessControl#findOne
         * @methodOf lbServices.ModelAccessControl
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelAccessControl` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/ModelAccessControls/findOne",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelAccessControl#destroyById
         * @methodOf lbServices.ModelAccessControl
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "destroyById": {
          url: urlBase + "/ModelAccessControls/:id",
          method: "DELETE",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelAccessControl#count
         * @methodOf lbServices.ModelAccessControl
         *
         * @description
         *
         * Count instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/ModelAccessControls/count",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelAccessControl#prototype$updateAttributes
         * @methodOf lbServices.ModelAccessControl
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelAccessControl id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelAccessControl` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/ModelAccessControls/:id",
          method: "PUT",
        },

        // INTERNAL. Use ModelDefinition.accessControls() instead.
        "::get::ModelDefinition::accessControls": {
          url: urlBase + "/ModelDefinitions/:id/accessControls",
          method: "GET",
          isArray: true,
        },

        // INTERNAL. Use ModelDefinition.accessControls.create() instead.
        "::create::ModelDefinition::accessControls": {
          url: urlBase + "/ModelDefinitions/:id/accessControls",
          method: "POST",
        },

        // INTERNAL. Use ModelDefinition.accessControls.destroyAll() instead.
        "::delete::ModelDefinition::accessControls": {
          url: urlBase + "/ModelDefinitions/:id/accessControls",
          method: "DELETE",
        },
      }
    );


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.ModelProperty
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `ModelProperty` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "ModelProperty",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/ModelProperties/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.ModelProperty#create
         * @methodOf lbServices.ModelProperty
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelProperty` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/ModelProperties",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelProperty#updateOrCreate
         * @methodOf lbServices.ModelProperty
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelProperty` object.)
         * </em>
         */
        "updateOrCreate": {
          url: urlBase + "/ModelProperties",
          method: "PUT",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelProperty#exists
         * @methodOf lbServices.ModelProperty
         *
         * @description
         *
         * Check whether a model instance exists in the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{*=}` - 
         */
        "exists": {
          url: urlBase + "/ModelProperties/:id/exists",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelProperty#findById
         * @methodOf lbServices.ModelProperty
         *
         * @description
         *
         * Find a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelProperty` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/ModelProperties/:id",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelProperty#find
         * @methodOf lbServices.ModelProperty
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelProperty` object.)
         * </em>
         */
        "find": {
          url: urlBase + "/ModelProperties",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelProperty#findOne
         * @methodOf lbServices.ModelProperty
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelProperty` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/ModelProperties/findOne",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelProperty#destroyById
         * @methodOf lbServices.ModelProperty
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "destroyById": {
          url: urlBase + "/ModelProperties/:id",
          method: "DELETE",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelProperty#count
         * @methodOf lbServices.ModelProperty
         *
         * @description
         *
         * Count instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/ModelProperties/count",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ModelProperty#prototype$updateAttributes
         * @methodOf lbServices.ModelProperty
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ModelProperty id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelProperty` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/ModelProperties/:id",
          method: "PUT",
        },

        // INTERNAL. Use ModelDefinition.properties() instead.
        "::get::ModelDefinition::properties": {
          url: urlBase + "/ModelDefinitions/:id/properties",
          method: "GET",
          isArray: true,
        },

        // INTERNAL. Use ModelDefinition.properties.create() instead.
        "::create::ModelDefinition::properties": {
          url: urlBase + "/ModelDefinitions/:id/properties",
          method: "POST",
        },

        // INTERNAL. Use ModelDefinition.properties.destroyAll() instead.
        "::delete::ModelDefinition::properties": {
          url: urlBase + "/ModelDefinitions/:id/properties",
          method: "DELETE",
        },
      }
    );


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.DatabaseColumn
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `DatabaseColumn` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "DatabaseColumn",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/DatabaseColumns/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.DatabaseColumn#create
         * @methodOf lbServices.DatabaseColumn
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DatabaseColumn` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/DatabaseColumns",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.DatabaseColumn#updateOrCreate
         * @methodOf lbServices.DatabaseColumn
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DatabaseColumn` object.)
         * </em>
         */
        "updateOrCreate": {
          url: urlBase + "/DatabaseColumns",
          method: "PUT",
        },

        /**
         * @ngdoc method
         * @name lbServices.DatabaseColumn#exists
         * @methodOf lbServices.DatabaseColumn
         *
         * @description
         *
         * Check whether a model instance exists in the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{*=}` - 
         */
        "exists": {
          url: urlBase + "/DatabaseColumns/:id/exists",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.DatabaseColumn#findById
         * @methodOf lbServices.DatabaseColumn
         *
         * @description
         *
         * Find a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DatabaseColumn` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/DatabaseColumns/:id",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.DatabaseColumn#find
         * @methodOf lbServices.DatabaseColumn
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DatabaseColumn` object.)
         * </em>
         */
        "find": {
          url: urlBase + "/DatabaseColumns",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.DatabaseColumn#findOne
         * @methodOf lbServices.DatabaseColumn
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DatabaseColumn` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/DatabaseColumns/findOne",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.DatabaseColumn#destroyById
         * @methodOf lbServices.DatabaseColumn
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "destroyById": {
          url: urlBase + "/DatabaseColumns/:id",
          method: "DELETE",
        },

        /**
         * @ngdoc method
         * @name lbServices.DatabaseColumn#count
         * @methodOf lbServices.DatabaseColumn
         *
         * @description
         *
         * Count instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/DatabaseColumns/count",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.DatabaseColumn#prototype$updateAttributes
         * @methodOf lbServices.DatabaseColumn
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - DatabaseColumn id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DatabaseColumn` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/DatabaseColumns/:id",
          method: "PUT",
        },
      }
    );


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.PropertyValidation
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `PropertyValidation` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "PropertyValidation",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/PropertyValidations/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.PropertyValidation#create
         * @methodOf lbServices.PropertyValidation
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PropertyValidation` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/PropertyValidations",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.PropertyValidation#updateOrCreate
         * @methodOf lbServices.PropertyValidation
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PropertyValidation` object.)
         * </em>
         */
        "updateOrCreate": {
          url: urlBase + "/PropertyValidations",
          method: "PUT",
        },

        /**
         * @ngdoc method
         * @name lbServices.PropertyValidation#exists
         * @methodOf lbServices.PropertyValidation
         *
         * @description
         *
         * Check whether a model instance exists in the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{*=}` - 
         */
        "exists": {
          url: urlBase + "/PropertyValidations/:id/exists",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.PropertyValidation#findById
         * @methodOf lbServices.PropertyValidation
         *
         * @description
         *
         * Find a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PropertyValidation` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/PropertyValidations/:id",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.PropertyValidation#find
         * @methodOf lbServices.PropertyValidation
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PropertyValidation` object.)
         * </em>
         */
        "find": {
          url: urlBase + "/PropertyValidations",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.PropertyValidation#findOne
         * @methodOf lbServices.PropertyValidation
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PropertyValidation` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/PropertyValidations/findOne",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.PropertyValidation#destroyById
         * @methodOf lbServices.PropertyValidation
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "destroyById": {
          url: urlBase + "/PropertyValidations/:id",
          method: "DELETE",
        },

        /**
         * @ngdoc method
         * @name lbServices.PropertyValidation#count
         * @methodOf lbServices.PropertyValidation
         *
         * @description
         *
         * Count instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/PropertyValidations/count",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.PropertyValidation#prototype$updateAttributes
         * @methodOf lbServices.PropertyValidation
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - PropertyValidation id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `PropertyValidation` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/PropertyValidations/:id",
          method: "PUT",
        },

        // INTERNAL. Use ModelDefinition.validations() instead.
        "::get::ModelDefinition::validations": {
          url: urlBase + "/ModelDefinitions/:id/validations",
          method: "GET",
          isArray: true,
        },

        // INTERNAL. Use ModelDefinition.validations.create() instead.
        "::create::ModelDefinition::validations": {
          url: urlBase + "/ModelDefinitions/:id/validations",
          method: "POST",
        },

        // INTERNAL. Use ModelDefinition.validations.destroyAll() instead.
        "::delete::ModelDefinition::validations": {
          url: urlBase + "/ModelDefinitions/:id/validations",
          method: "DELETE",
        },
      }
    );


    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.ViewDefinition
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `ViewDefinition` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "ViewDefinition",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/ViewDefinitions/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.ViewDefinition#create
         * @methodOf lbServices.ViewDefinition
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ViewDefinition` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/ViewDefinitions",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.ViewDefinition#updateOrCreate
         * @methodOf lbServices.ViewDefinition
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ViewDefinition` object.)
         * </em>
         */
        "updateOrCreate": {
          url: urlBase + "/ViewDefinitions",
          method: "PUT",
        },

        /**
         * @ngdoc method
         * @name lbServices.ViewDefinition#exists
         * @methodOf lbServices.ViewDefinition
         *
         * @description
         *
         * Check whether a model instance exists in the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{*=}` - 
         */
        "exists": {
          url: urlBase + "/ViewDefinitions/:id/exists",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ViewDefinition#findById
         * @methodOf lbServices.ViewDefinition
         *
         * @description
         *
         * Find a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ViewDefinition` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/ViewDefinitions/:id",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ViewDefinition#find
         * @methodOf lbServices.ViewDefinition
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ViewDefinition` object.)
         * </em>
         */
        "find": {
          url: urlBase + "/ViewDefinitions",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.ViewDefinition#findOne
         * @methodOf lbServices.ViewDefinition
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ViewDefinition` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/ViewDefinitions/findOne",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ViewDefinition#destroyById
         * @methodOf lbServices.ViewDefinition
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "destroyById": {
          url: urlBase + "/ViewDefinitions/:id",
          method: "DELETE",
        },

        /**
         * @ngdoc method
         * @name lbServices.ViewDefinition#count
         * @methodOf lbServices.ViewDefinition
         *
         * @description
         *
         * Count instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/ViewDefinitions/count",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.ViewDefinition#prototype$updateAttributes
         * @methodOf lbServices.ViewDefinition
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ViewDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ViewDefinition` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/ViewDefinitions/:id",
          method: "PUT",
        },

        /**
         * @ngdoc method
         * @name lbServices.ViewDefinition#prototype$__get__children
         * @methodOf lbServices.ViewDefinition
         * @deprecated Use ViewDefinition.children() instead.
         *
         * @description
         *
         * Queries children of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ViewDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ViewDefinition` object.)
         * </em>
         */
        "prototype$__get__children": {
          url: urlBase + "/ViewDefinitions/:id/children",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.ViewDefinition#prototype$__create__children
         * @methodOf lbServices.ViewDefinition
         * @deprecated Use ViewDefinition.children.create() instead.
         *
         * @description
         *
         * Creates a new instance in children of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ViewDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ViewDefinition` object.)
         * </em>
         */
        "prototype$__create__children": {
          url: urlBase + "/ViewDefinitions/:id/children",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.ViewDefinition#prototype$__delete__children
         * @methodOf lbServices.ViewDefinition
         * @deprecated Use ViewDefinition.children.destroyAll() instead.
         *
         * @description
         *
         * Deletes all children of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ViewDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ViewDefinition` object.)
         * </em>
         */
        "prototype$__delete__children": {
          url: urlBase + "/ViewDefinitions/:id/children",
          method: "DELETE",
        },

        // INTERNAL. Use ModelDefinition.views() instead.
        "::get::ModelDefinition::views": {
          url: urlBase + "/ModelDefinitions/:id/views",
          method: "GET",
          isArray: true,
        },

        // INTERNAL. Use ModelDefinition.views.create() instead.
        "::create::ModelDefinition::views": {
          url: urlBase + "/ModelDefinitions/:id/views",
          method: "POST",
        },

        // INTERNAL. Use ModelDefinition.views.destroyAll() instead.
        "::delete::ModelDefinition::views": {
          url: urlBase + "/ModelDefinitions/:id/views",
          method: "DELETE",
        },

        // INTERNAL. Use ViewDefinition.children() instead.
        "::get::ViewDefinition::children": {
          url: urlBase + "/ViewDefinitions/:id/children",
          method: "GET",
          isArray: true,
        },

        // INTERNAL. Use ViewDefinition.children.create() instead.
        "::create::ViewDefinition::children": {
          url: urlBase + "/ViewDefinitions/:id/children",
          method: "POST",
        },

        // INTERNAL. Use ViewDefinition.children.destroyAll() instead.
        "::delete::ViewDefinition::children": {
          url: urlBase + "/ViewDefinitions/:id/children",
          method: "DELETE",
        },
      }
    );


        /**
         * @ngdoc method
         * @name lbServices.ViewDefinition#children
         * @methodOf lbServices.ViewDefinition
         * @deprecated Use ViewDefinition.children() instead.
         *
         * @description
         *
         * Queries children of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ViewDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ViewDefinition` object.)
         * </em>
         */
        R.children = function() {
          var TargetResource = $injector.get("ViewDefinition");
          var action = TargetResource["::get::ViewDefinition::children"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ViewDefinition#children.create
         * @methodOf lbServices.ViewDefinition
         * @deprecated Use ViewDefinition.children.create() instead.
         *
         * @description
         *
         * Creates a new instance in children of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ViewDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ViewDefinition` object.)
         * </em>
         */
        R.children.create = function() {
          var TargetResource = $injector.get("ViewDefinition");
          var action = TargetResource["::create::ViewDefinition::children"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.ViewDefinition#children.destroyAll
         * @methodOf lbServices.ViewDefinition
         * @deprecated Use ViewDefinition.children.destroyAll() instead.
         *
         * @description
         *
         * Deletes all children of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - ViewDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ViewDefinition` object.)
         * </em>
         */
        R.children.destroyAll = function() {
          var TargetResource = $injector.get("ViewDefinition");
          var action = TargetResource["::delete::ViewDefinition::children"];
          return action.apply(R, arguments);
        };

    return R;
  }]);

/**
 * @ngdoc object
 * @name lbServices.DataSourceDefinition
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `DataSourceDefinition` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "DataSourceDefinition",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/DataSourceDefinitions/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name lbServices.DataSourceDefinition#create
         * @methodOf lbServices.DataSourceDefinition
         *
         * @description
         *
         * Create a new instance of the model and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DataSourceDefinition` object.)
         * </em>
         */
        "create": {
          url: urlBase + "/DataSourceDefinitions",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.DataSourceDefinition#updateOrCreate
         * @methodOf lbServices.DataSourceDefinition
         *
         * @description
         *
         * Update an existing model instance or insert a new one into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DataSourceDefinition` object.)
         * </em>
         */
        "updateOrCreate": {
          url: urlBase + "/DataSourceDefinitions",
          method: "PUT",
        },

        /**
         * @ngdoc method
         * @name lbServices.DataSourceDefinition#exists
         * @methodOf lbServices.DataSourceDefinition
         *
         * @description
         *
         * Check whether a model instance exists in the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `exists` – `{*=}` - 
         */
        "exists": {
          url: urlBase + "/DataSourceDefinitions/:id/exists",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.DataSourceDefinition#findById
         * @methodOf lbServices.DataSourceDefinition
         *
         * @description
         *
         * Find a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DataSourceDefinition` object.)
         * </em>
         */
        "findById": {
          url: urlBase + "/DataSourceDefinitions/:id",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.DataSourceDefinition#find
         * @methodOf lbServices.DataSourceDefinition
         *
         * @description
         *
         * Find all instances of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DataSourceDefinition` object.)
         * </em>
         */
        "find": {
          url: urlBase + "/DataSourceDefinitions",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.DataSourceDefinition#findOne
         * @methodOf lbServices.DataSourceDefinition
         *
         * @description
         *
         * Find first instance of the model matched by filter from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DataSourceDefinition` object.)
         * </em>
         */
        "findOne": {
          url: urlBase + "/DataSourceDefinitions/findOne",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.DataSourceDefinition#destroyById
         * @methodOf lbServices.DataSourceDefinition
         *
         * @description
         *
         * Delete a model instance by id from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*}` - Model id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * This method returns no data.
         */
        "destroyById": {
          url: urlBase + "/DataSourceDefinitions/:id",
          method: "DELETE",
        },

        /**
         * @ngdoc method
         * @name lbServices.DataSourceDefinition#count
         * @methodOf lbServices.DataSourceDefinition
         *
         * @description
         *
         * Count instances of the model matched by where from the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `where` – `{object=}` - Criteria to match model instances
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `count` – `{number=}` - 
         */
        "count": {
          url: urlBase + "/DataSourceDefinitions/count",
          method: "GET",
        },

        /**
         * @ngdoc method
         * @name lbServices.DataSourceDefinition#prototype$updateAttributes
         * @methodOf lbServices.DataSourceDefinition
         *
         * @description
         *
         * Update attributes for a model instance and persist it into the data source
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - DataSourceDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DataSourceDefinition` object.)
         * </em>
         */
        "prototype$updateAttributes": {
          url: urlBase + "/DataSourceDefinitions/:id",
          method: "PUT",
        },

        /**
         * @ngdoc method
         * @name lbServices.DataSourceDefinition#prototype$__get__models
         * @methodOf lbServices.DataSourceDefinition
         * @deprecated Use DataSourceDefinition.models() instead.
         *
         * @description
         *
         * Queries models of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - DataSourceDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DataSourceDefinition` object.)
         * </em>
         */
        "prototype$__get__models": {
          url: urlBase + "/DataSourceDefinitions/:id/models",
          method: "GET",
          isArray: true,
        },

        /**
         * @ngdoc method
         * @name lbServices.DataSourceDefinition#prototype$__create__models
         * @methodOf lbServices.DataSourceDefinition
         * @deprecated Use DataSourceDefinition.models.create() instead.
         *
         * @description
         *
         * Creates a new instance in models of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - DataSourceDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DataSourceDefinition` object.)
         * </em>
         */
        "prototype$__create__models": {
          url: urlBase + "/DataSourceDefinitions/:id/models",
          method: "POST",
        },

        /**
         * @ngdoc method
         * @name lbServices.DataSourceDefinition#prototype$__delete__models
         * @methodOf lbServices.DataSourceDefinition
         * @deprecated Use DataSourceDefinition.models.destroyAll() instead.
         *
         * @description
         *
         * Deletes all models of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - DataSourceDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DataSourceDefinition` object.)
         * </em>
         */
        "prototype$__delete__models": {
          url: urlBase + "/DataSourceDefinitions/:id/models",
          method: "DELETE",
        },

        /**
         * @ngdoc method
         * @name lbServices.DataSourceDefinition#prototype$__get__app
         * @methodOf lbServices.DataSourceDefinition
         * @deprecated Use DataSourceDefinition.app() instead.
         *
         * @description
         *
         * Fetches belongsTo relation app
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - DataSourceDefinition id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `DataSourceDefinition` object.)
         * </em>
         */
        "prototype$__get__app": {
          url: urlBase + "/DataSourceDefinitions/:id/app",
          method: "GET",
        },

        // INTERNAL. Use AppDefinition.datasources() instead.
        "::get::AppDefinition::datasources": {
          url: urlBase + "/AppDefinitions/:id/datasources",
          method: "GET",
          isArray: true,
        },

        // INTERNAL. Use AppDefinition.datasources.create() instead.
        "::create::AppDefinition::datasources": {
          url: urlBase + "/AppDefinitions/:id/datasources",
          method: "POST",
        },

        // INTERNAL. Use AppDefinition.datasources.destroyAll() instead.
        "::delete::AppDefinition::datasources": {
          url: urlBase + "/AppDefinitions/:id/datasources",
          method: "DELETE",
        },
      }
    );


        /**
         * @ngdoc method
         * @name lbServices.DataSourceDefinition#models
         * @methodOf lbServices.DataSourceDefinition
         * @deprecated Use DataSourceDefinition.models() instead.
         *
         * @description
         *
         * Queries models of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - DataSourceDefinition id
         *
         *  - `filter` – `{object=}` - 
         *
         * @param {Function(Array.<Object>, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Array.<Object>} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        R.models = function() {
          var TargetResource = $injector.get("ModelDefinition");
          var action = TargetResource["::get::DataSourceDefinition::models"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.DataSourceDefinition#models.create
         * @methodOf lbServices.DataSourceDefinition
         * @deprecated Use DataSourceDefinition.models.create() instead.
         *
         * @description
         *
         * Creates a new instance in models of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - DataSourceDefinition id
         *
         * @param {Object} postData Request data.
         *
         * This method expects a subset of model properties as request parameters.
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        R.models.create = function() {
          var TargetResource = $injector.get("ModelDefinition");
          var action = TargetResource["::create::DataSourceDefinition::models"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.DataSourceDefinition#models.destroyAll
         * @methodOf lbServices.DataSourceDefinition
         * @deprecated Use DataSourceDefinition.models.destroyAll() instead.
         *
         * @description
         *
         * Deletes all models of this model.
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - DataSourceDefinition id
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `ModelDefinition` object.)
         * </em>
         */
        R.models.destroyAll = function() {
          var TargetResource = $injector.get("ModelDefinition");
          var action = TargetResource["::delete::DataSourceDefinition::models"];
          return action.apply(R, arguments);
        };

        /**
         * @ngdoc method
         * @name lbServices.DataSourceDefinition#app
         * @methodOf lbServices.DataSourceDefinition
         * @deprecated Use DataSourceDefinition.app() instead.
         *
         * @description
         *
         * Fetches belongsTo relation app
         *
         * @param {Object=} parameters Request parameters.
         *
         *  - `id` – `{*=}` - DataSourceDefinition id
         *
         *  - `refresh` – `{boolean=}` - 
         *
         * @param {Function(Object, Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {Function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @return {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `AppDefinition` object.)
         * </em>
         */
        R.app = function() {
          var TargetResource = $injector.get("AppDefinition");
          var action = TargetResource["::get::DataSourceDefinition::app"];
          return action.apply(R, arguments);
        };

    return R;
  }]);


module
  .factory('LoopBackAuth', function() {
    var props = ['accessTokenId', 'currentUserId'];

    function LoopBackAuth() {
      var self = this;
      props.forEach(function(name) {
        self[name] = load(name);
      });
      this.rememberMe = undefined;
    }

    LoopBackAuth.prototype.save = function() {
      var self = this;
      var storage = this.rememberMe ? localStorage : sessionStorage;
      props.forEach(function(name) {
        save(storage, name, self[name]);
      });
    };

    return new LoopBackAuth();

    // Note: LocalStorage converts the value to string
    // We are using empty string as a marker for null/undefined values.
    function save(storage, name, value) {
      var key = '$LoopBack$' + name;
      if (value == null) value = '';
      storage[key] = value;
    }

    function load(name) {
      var key = '$LoopBack$' + name;
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
          if (LoopBackAuth.accessTokenId) {
            config.headers.authorization = LoopBackAuth.accessTokenId;
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
  .factory('LoopBackResource', [ '$resource', function($resource) {
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
      }

      return resource;
    };
  }]);

})(window, window.angular);