'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RestfulHandler = require('../handlers/RestfulHandler');

var _RestfulHandler2 = _interopRequireDefault(_RestfulHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * @class RestfulApiAction
 *
 * @memberOf Actions
 */
var RestfulApiAction = function () {

	/**
  * Called whenever a new action is created.  Handles setting the class instance's collection
  * and base url to be used when making api requests.
  *
  * @memberOf Actions.RestfulApiAction
  *
  * @param {string}   collection     The collection that all requests routed through these actions will get. eg 'users' or 'posts'
  * @param {string}   baseUrl        The base url for the API (eg. http://mortarjs.io/api/)
  * @param {obj}      dispatcher     The dispatcher for the project. Used to dispatching an action when the response comes back.
  * @param {function} handler
  *
  * @return {null}
  */
	function RestfulApiAction(collection, baseUrl, dispatcher) {
		var handler = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new _RestfulHandler2.default();

		_classCallCheck(this, RestfulApiAction);

		this.collection = collection;
		this.baseUrl = this._formatBaseUrl(baseUrl);
		this.dispatcher = dispatcher;
		this.handler = handler;
		this.store = {};
	}

	/**
  * Formats the base url to ensure that it won't cause any request errors.
  * @private
  * @memberOf Actions.RestfulApiAction
  *
  * @param  {string} url The base url, which may or may not end in a '/'.
  *
  * @return {string}     The formated base url without a trailing '/'.
  */


	_createClass(RestfulApiAction, [{
		key: '_formatBaseUrl',
		value: function _formatBaseUrl(url) {
			// If the url ends in a '/' split that off to avoid formatting errors
			if (url.slice(-1) === '/') {
				url = url.slice(0, -1);
			}

			return url;
		}
	}, {
		key: '_generateRequestKey',
		value: function _generateRequestKey() {
			var requestKey = '',
			    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for (var i = 0; i < 16; i++) {
				requestKey += possible.charAt(Math.floor(Math.random() * possible.length));
			}

			// If the key is already in use (unlikely) generate a new one until a unique key is made
			if (this.store[requestKey]) {
				return this._generateRequestKey();
			}

			return requestKey;
		}
	}, {
		key: '_addRequestToStore',
		value: function _addRequestToStore(key, verb) {
			var byId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
			var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

			this.store[key] = {
				verb: verb,
				byId: byId,
				options: options
			};
		}

		/**
   * Constructs the name of the action's event name to be dispatched when a request is made and handled.
   * @private
   * @memberOf Actions.RestfulApiAction
   *
   * @param {string} key The request key for request that is having an event generated.
   *
   * @example
   * // this.collection = 'users', making a 'get' request.
   * // returns 'USERS_GOTTEN'
   *
   * @example
   * // this.collection = 'users', making a 'get' request for id 5.
   * // returns 'USERS_GOTTEN_BY_ID'
   *
   * @example
   * // this.collection = 'users', making a 'post' request.
   * // returns 'USERS_POSTED'
   *
   * @return {string} A formatted string for the dispatch type.
   */

	}, {
		key: '_constructEventName',
		value: function _constructEventName(key) {
			var requestData = this.store[key],
			    name = this.collection + '_' + requestData.verb;

			// Optionally modifies the action to have information abuot included examples:
			// e.g. `USERS_GOTTEN_WITH_CHILDREN`
			if (requestData.options.actionWithInclude && requestData.options.modifiers && requestData.options.modifiers.include) {

				name += '_WITH_' + requestData.options.modifiers.include.collection;
			}

			name = name.toUpperCase();

			return requestData.byId ? name + '_BY_ID' : name;
		}

		// Handles receiving the collection and dispatching it
		// @TODO: settle on the name for this API

	}, {
		key: 'dispatchResponse',
		value: function dispatchResponse(key, response) {
			this.dispatcher.dispatch({
				type: this._constructEventName(key),
				data: response
			});
		}

		/**
   * Constructs the request url to get a collection defined in `this.collection`.
   * Uses the url to make a `get` request to the given Api Handler.
   * @memberOf Actions.RestfulApiAction
   *
   * @param {object}        options asdf
   *
   * @return {null}
   */

	}, {
		key: 'getCollection',
		value: function getCollection(options) {
			var attr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var url = this.baseUrl + '/' + this.collection,
			    // config.apiUrl + version + this.collection
			requestKey = this._generateRequestKey();
			var verb = 'gotten';
			if (attr) {
				verb = attr + '_' + verb;
			}
			this._addRequestToStore(requestKey, verb, false, options);
			this.handler.get(url, options, this.dispatchResponse.bind(this, requestKey));
		}
		/**
   * Constructs the request url to `get` a resource in the class's collection at the given id.
   * Uses the url to make a `get` request to the given Api Handler.
   * @memberOf Actions.RestfulApiAction
   *
   * @param {string|number} id      The id of the resource to `get` in the collection.
   * @param {object}        options asdf
   *
   * @return {null}
   */

	}, {
		key: 'getResourceById',
		value: function getResourceById(id, options) {
			var url = this.baseUrl + '/' + this.collection + '/' + id,
			    // config.apiUrl + version + this.collection
			requestKey = this._generateRequestKey();

			this._addRequestToStore(requestKey, 'gotten', true, options);
			this.handler.get(url, options, this.dispatchResponse.bind(this, requestKey));
		}

		/**
   * Constructs the request url to post a new resource to a collection defined in `this.collection`.
   * Uses the url to make a `post` request to the given Api Handler.
   * @memberOf Actions.RestfulApiAction
   *
   * @param {*}      data    The data to be added as a new resource in the collection.  Typically an object, but can be anything.
   * @param {object} options
   *
   * @return {null}
   */

	}, {
		key: 'postToCollection',
		value: function postToCollection(data, options) {
			var url = this.baseUrl + '/' + this.collection,
			    // config.apiUrl + version + this.collection
			requestKey = this._generateRequestKey();

			this._addRequestToStore(requestKey, 'posted', false, options);
			this.handler.post(url, data, options, this.dispatchResponse.bind(this, requestKey));
		}

		/**
   * Constructs the request url to post a new resource with the given ID to a collection defined in `this.collection`.
   * Uses the url to make a `post` request to the given Api Handler.
   *
   * Note that this is not typically used.  `postToCollection()` is usually what should be used when posting a new resource.
   * @memberOf Actions.RestfulApiAction
   *
   * @param {string|number} id      The id that the new resource will have
   * @param {*}             data    The data to be added as a new resource in the collection.  Typically an object, but can be anything.
   * @param {object}        options
   *
   * @return {null}
   */

	}, {
		key: 'postResourceById',
		value: function postResourceById(id, data, options) {
			var url = this.baseUrl + '/' + this.collection + '/' + id,
			    // config.apiUrl + version + this.collection
			requestKey = this._generateRequestKey();

			this._addRequestToStore(requestKey, 'posted', true, options);
			this.handler.post(url, data, options, this.dispatchResponse.bind(this, requestKey));
		}

		/**
   * Constructs the request url to put new data to a collection defined in `this.collection`.
   * Uses the url to make a `put` request to the given Api Handler.
   *
   * Typically, this will erase all data in the collection and replace it with the passed data.
   * @memberOf Actions.RestfulApiAction
   *
   * @param {array|*} data    The data to replace the collection with. Typically an array of items in the collection
   * @param {object}  options
   *
   * @return {null}
   */

	}, {
		key: 'putCollection',
		value: function putCollection(data, options) {
			var url = this.baseUrl + '/' + this.collection,
			    // config.apiUrl + version + this.collection
			requestKey = this._generateRequestKey();

			this._addRequestToStore(requestKey, 'put', false, options);
			this.handler.put(url, data, options, this.dispatchResponse.bind(this, requestKey));
		}

		/**
   * Constructs the request url to put new data to a resource with the given ID to a collection defined in `this.collection`.
   * Uses the url to make a `put` request to the given Api Handler.
   * @memberOf Actions.RestfulApiAction
   *
   * @param {string|number} id      The id of the resource being put to.
   * @param {*}             data    The data to be added as a new resource in the collection.  Typically an object, but can be anything.
   * @param {object}        options
   *
   * @return {null}
   */

	}, {
		key: 'putResourceById',
		value: function putResourceById(id, data, options) {
			var url = this.baseUrl + '/' + this.collection + '/' + id,
			    // config.apiUrl + version + this.collection
			requestKey = this._generateRequestKey();

			this._addRequestToStore(requestKey, 'put', true, options);
			this.handler.put(url, data, options, this.dispatchResponse.bind(this, requestKey));
		}

		/**
   * Constructs the request url to patch values on an existingresource with the given ID to a collection defined in `this.collection`.
   * Uses the url to make a `patch` request to the given Api Handler.
   * @memberOf Actions.RestfulApiAction
   *
   * @param {string|number} id      The id of the resource being patched
   * @param {object}        data    The key value pair to update on the resource.
   * @param {object}        options
   *
   * @return {null}
   */

	}, {
		key: 'patchResourceById',
		value: function patchResourceById(id, data, options) {
			var url = this.baseUrl + '/' + this.collection + '/' + id,
			    // config.apiUrl + version + this.collection
			requestKey = this._generateRequestKey();

			this._addRequestToStore(requestKey, 'patched', true, options);
			this.handler.patch(url, data, options, this.dispatchResponse.bind(this, requestKey));
		}

		/**
   * Constructs the request url to delete the entire collection.
   * Uses the url to make a `delete` request to the given Api Handler.
   * @memberOf Actions.RestfulApiAction
   *
   * @param {object}  options
   *
   * @return {null}
   */

	}, {
		key: 'deleteCollection',
		value: function deleteCollection(options) {
			var url = this.baseUrl + '/' + this.collection,
			    // config.apiUrl + version + this.collection
			requestKey = this._generateRequestKey();

			this._addRequestToStore(requestKey, 'deleted', false, options);
			this.handler.delete(url, options, this.dispatchResponse.bind(this, requestKey));
		}

		/**
   * Constructs the request url to delete the resource at a given id in the collection.
   * Uses the url to make a `delete` request to the given Api Handler.
   * @memberOf Actions.RestfulApiAction
   *
   * @param {string|number} id      The id of the resource to be deleted.
   * @param {object}        options
   *
   * @return {null}
   */

	}, {
		key: 'deleteResourceById',
		value: function deleteResourceById(id, options) {
			var url = this.baseUrl + '/' + this.collection + '/' + id,
			    // config.apiUrl + version + this.collection
			requestKey = this._generateRequestKey();

			this._addRequestToStore(requestKey, 'deleted', true, options);
			this.handler.delete(url, options, this.dispatchResponse.bind(this, requestKey));
		}
	}]);

	return RestfulApiAction;
}();

exports.default = RestfulApiAction;