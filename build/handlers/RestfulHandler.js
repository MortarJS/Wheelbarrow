'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var reqwest = require('reqwest');

/*
 * @class RestfulHandler
 *
 *
 * @memberOf Handlers
 * @TODO console.log() the request URL and DATA when in DEV env.
 */

var RestfulHandler = function () {

	/**
  * Instantiates the class instance
  * @memberof Handlers.RestfulHandler
  *
  * @return {null}
  */
	function RestfulHandler() {
		_classCallCheck(this, RestfulHandler);
	}

	/**
  * Sets the url for the request based off the options set by the user.
  * If the user wants to include nested relationships or set query values,
  * those are appended to the request string, and returned.
  * @private
  * @memberof Handlers.RestfulHandler
  *
  * @example
  * // url = api.com/users/5
  * let options = {
  *	modifiers: {
  *		include: {
  *			collection: 'posts',
  *			id: 1
  *		},
  *		query: {
  *			name: 'Ky',
  *			sort: 'asc'
  *		}
  *	};
  * }
  * // Returns 'api.com/users/5/posts/5?name=Ky&sort=asc'
  *
  * @param {string} url     The base url for the request. eg `api.com/api/users/5`.
  * @param {object} options Additional options to customize the request with.
  *
  * @return {string} The url with all of the restful uri and parameters set.
  */


	_createClass(RestfulHandler, [{
		key: '_setUrlModifiers',
		value: function _setUrlModifiers(url, options) {
			if (options.modifiers && options.modifiers.include) {
				url += this._includeValues(options.modifiers.include);
			}

			if (options.trailingSlash) {
				url += url.slice(-1) === '/' ? '' : '/';
			}

			if (options.modifiers && options.modifiers.query) {
				url += this._queryValues(options.modifiers.query);
			}

			return url;
		}

		/**
   * If there are includes set in the modifiers, formats all included values for the request url.
   * This function recursively sets all includes, allowing for infinitely nested relationships
   * @private
   * @memberof Handlers.RestfulHandler
   *
   * @example
   * let options.modifiers.include = {
   *	collection: 'posts',
   *	id: 3,
   *	include: {
   *		collection: 'author',
   *		id: 1,
   *		include: {
   *			collection: 'pets'
   *		}
   *	}
   * }
   * // Returns /posts/3/author/1/pets
   *
   * @param {object} options The include options set by the user in `options.modifiers.include`.
   *
   * @return {string}        The formatted url string to be appended to the base request URL.
   */

	}, {
		key: '_includeValues',
		value: function _includeValues(options) {
			var path = '';

			path += path.slice(-1) === '/' ? options.collection : '/' + options.collection; // Append a / when needed

			if (options.id) {
				path += '/' + options.id;
			}

			if (options.hasOwnProperty('include')) {
				path += '/' + this._includeValues(options.include);
			}

			return path;
		}

		/**
   * If there are queries set in the modifiers, formats all query parameters for the request url.
   * @private
   * @memberof Handlers.RestfulHandler
   *
   * @param {object} options The query options set by the user in `options.modifiers.query`.
   *
   * @return {string}        The formatted url string to be appended to the request URL.
   */

	}, {
		key: '_queryValues',
		value: function _queryValues(options) {
			var queryString = Object.keys(options).map(function (key) {
				return key + '=' + options[key];
			}).join('&');

			return '?' + queryString;
		}

		/**
   *
   * @param {string}   url     The formatted url to use in the request.
   * @param {string}   method  The request method.  'GET', 'POST', 'PUT', 'DELETE', for example.
   * @param {object}   options The user-defined options for this request.
   * @param {function} cb      A callback function to be called after getting a successful response.
   *
   * @return {object} The request's options formatted for use in `reqwest`.
   */

	}, {
		key: '_setOptions',
		value: function _setOptions(url, method, options, cb) {
			var _this = this;

			//@TODO: how to handle errors
			return {
				url: url,
				method: method,
				type: options.type || 'json',
				contentType: options.contentType || 'application/json',
				processData: options.processData || false,
				headers: options.headers || {}, // Object.assign({},this.defaultHeaders, option.headers) MAYBE
				success: function success(response) {
					cb(response, url);

					if (options.onSuccess) {
						options.onSuccess(url); // Don't send the response, since that is handled by the dispatcher
					}
				},
				error: function error(_error) {
					_this._handleError(_error, url);

					if (options.onError) {
						options.onError(_error, url);
					}
				}
			};
		}

		/**
   * Fires whenever a request returns an error response.  Simply logs the error to the console.
   * @private
   * @memberof Handlers.RestfulHandler
   *
   * @param {object|*} error The error returned from the API. Typically an object but could feasibly be anything.
   * @param {string}   url   The url that was requested when the error occurred.
   *
   * @return {null}
   *
   * @TODO: This should be based on NODE env.
   */

	}, {
		key: '_handleError',
		value: function _handleError(error, url) {
			console.error('Something went wrong when requesting ' + url, error);
		}

		/**
   * Fires a GET request using `reqwest`.
   * @memberof Handlers.RestfulHandler
   *
   * @param {string} url     The formatted base url to be used in the GET request.
   * @param {object} options Additional options that are used to further mutate the request and url before firing it off.
   * @param {function} cb    A callback that is called when the request is made and a response has been received.
   *
   * @return {null}
   */

	}, {
		key: 'get',
		value: function get(url) {
			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var cb = arguments[2];

			url = this._setUrlModifiers(url, options);

			var request = this._setOptions(url, 'get', options, cb);

			if (options.beforeRequest && typeof options.beforeRequest === "function") {
				request = options.beforeRequest(request) || request; // If `beforeRequest()` doesn't return a value, don't overwrite the object
			}

			reqwest(request);
		}

		/**
   * Fires a POST request using `reqwest`.
   * @memberof Handlers.RestfulHandler
   *
   * @param {string} url     The formatted base url to be used in the POST request.
   * @param {*}      data    The data to be sent in the POST
   * @param {object} options Additional options that are used to further mutate the request and url before firing it off.
   * @param {function} cb    A callback that is called when the request is made and a response has been received.
   *
   * @return {null}
   */

	}, {
		key: 'post',
		value: function post(url, data) {
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
			var cb = arguments[3];

			url = this._setUrlModifiers(url, options);

			var request = this._setOptions(url, 'post', options, cb);
			request.data = data;

			//@TODO this can be pulled into another function or `setOptions`
			if (options.beforeRequest && typeof options.beforeRequest === "function") {
				request = options.beforeRequest(request) || request; // If `beforeRequest()` doesn't return a value, don't overwrite the object
			}

			reqwest(request);
		}

		/**
   * Fires a PUT request using `reqwest`.
   * @memberof Handlers.RestfulHandler
   *
   * @param {string} url     The formatted base url to be used in the PUT request.
   * @param {*}      data    The data to be sent in the PUT
   * @param {object} options Additional options that are used to further mutate the request and url before firing it off.
   * @param {function} cb    A callback that is called when the request is made and a response has been received.
   *
   * @return {null}
   */

	}, {
		key: 'put',
		value: function put(url, data) {
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
			var cb = arguments[3];

			url = this._setUrlModifiers(url, options);

			var request = this._setOptions(url, 'put', options, cb);
			request.data = data;

			if (options.beforeRequest && typeof options.beforeRequest === "function") {
				request = options.beforeRequest(request) || request; // If `beforeRequest()` doesn't return a value, don't overwrite the object
			}

			reqwest(request);
		}

		/**
   * Fires a PATCH request using `reqwest`.
   * @memberof Handlers.RestfulHandler
   *
   * @param {string} url     The formatted base url to be used in the PATCH request.
   * @param {*}      data    The data to be sent in the PATCH
   * @param {object} options Additional options that are used to further mutate the request and url before firing it off.
   * @param {function} cb    A callback that is called when the request is made and a response has been received.
   *
   * @return {null}
   */

	}, {
		key: 'patch',
		value: function patch(url, data) {
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
			var cb = arguments[3];

			url = this._setUrlModifiers(url, options);

			var request = this._setOptions(url, 'patch', options, cb);
			request.data = data;

			if (options.beforeRequest && typeof options.beforeRequest === "function") {
				request = options.beforeRequest(request) || request; // If `beforeRequest()` doesn't return a value, don't overwrite the object
			}

			reqwest(request);
		}

		/**
   * Fires a DELETE request using `reqwest`.
   * @memberof Handlers.RestfulHandler
   *
   * @param {string} url     The formatted base url to be used in the DELETE request.
   * @param {object} options Additional options that are used to further mutate the request and url before firing it off.
   * @param {function} cb    A callback that is called when the request is made and a response has been received.
   *
   * @return {null}
   */

	}, {
		key: 'delete',
		value: function _delete(url) {
			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var cb = arguments[2];

			url = this._setUrlModifiers(url, options);

			var request = this._setOptions(url, 'delete', options, cb);

			if (options.beforeRequest && typeof options.beforeRequest === "function") {
				request = options.beforeRequest(request) || request; // If `beforeRequest()` doesn't return a value, don't overwrite the object
			}

			reqwest(request);
		}
	}]);

	return RestfulHandler;
}();

exports.default = RestfulHandler;