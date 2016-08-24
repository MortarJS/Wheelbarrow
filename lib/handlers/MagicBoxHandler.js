var reqwest = require('reqwest');

/*
 * @class MagicBoxHandler
 *
 *
 * @memberOf Handlers
 * @TODO console.log() the request URL and DATA when in DEV env.
 */
export default class MagicBoxHandler {

	/**
	 * Instantiates the class instance
	 * @memberof Handlers.MagicBoxHandler
	 *
	 * @return {null}
	 */
	constructor() {
	}

	/**
	 * Sets the url for the request based off the options set by the user.
	 * If the user wants to include nested relationships or set query values,
	 * those are appended to the request string, and returned.
	 * @private
	 * @memberof Handlers.MagicBoxHandler
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
	_setUrlModifiers(url, options) {
		if (options.trailingSlash) {
			url += url.slice(-1) === '/' ? '' : '/';
		}

		let firstParam = false;

		if (options.modifiers) {
			if (options.modifiers.include) {
				url += this._includeValues(options.modifiers.include);
				firstParam = true;
			}

			if (options.modifiers.filter) {
				url += firstParam ? '&' + this._deepQueryValues(options.modifiers.filter, 'filter') : '?' + this._deepQueryValues(options.modifiers.filter, 'filter');
				firstParam = true;
			}

			if (options.modifiers.sort) {
				url += firstParam ? '&' + this._deepQueryValues(options.modifiers.sort, 'sort') : '?' + this._deepQueryValues(options.modifiers.sort, 'sort');
				firstParam = true;
			}

			if (options.modifiers.query) {
				url += firstParam ? '&' + this._queryValues(options.modifiers.query) : '?' + this._queryValues(options.modifiers.query);
			}
		}

		return url;
	}

	/**
	 * If there are includes set in the modifiers, formats all included values for the request url.
	 * This function recursively sets all includes, allowing for infinitely nested relationships
	 * @private
	 * @memberof Handlers.MagicBoxHandler
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
	 * @param {object} include The include options set by the user in `options.modifiers.include`.
	 *
	 * @return {string}        The formatted url string to be appended to the base request URL.
	 */
	_includeValues(include) {
		if (Array.isArray(include)) {
			return '?' + include.map((i) => {
				let query = '';
				if (i.collection) {
					query += `include[]=${i.collection}`;
				}

				if (i.include) {
					query += this._includeDeep(i.include);
				}

				return query;
			}).join('&');
		}

		let query = `include[]=${include.collection}`;

		if (include.include) {
			query += this._includeDeep(include.include);
		}

		return '?' + query;
	}

	/**
	 * Handles returning deeply nested includes by recursively parsing all nested includes for a single resource.
	 * @private
	 * @memberof Handlers.MagicBoxHandler
	 *
	 * @param {object} options The (arbitrary length) deeply nested include configuration
	 *
	 * @returns {string} the formatted deep include query parameter
	 */
	_includeDeep(options) {
		let deepQuery = '';
		if (options.collection) {
			deepQuery += `.${options.collection}`;
		}

		if (options.include) {
			deepQuery += this._includeDeep(options.include);
		}

		return deepQuery;
	}

	/**
	 * If there are queries set in the modifiers, formats all query parameters for the request url.
	 * @private
	 * @memberof Handlers.MagicBoxHandler
	 *
	 * @param {object} options The query options set by the user in `options.modifiers.query`.
	 *
	 * @return {string}        The formatted url string to be appended to the request URL.
	 */
	_queryValues(options) {
		let queryString = Object.keys(options).map((key) => {
			return `${key}=${options[key]}`;
		}).join('&');

		return '?' + queryString;
	}

	/**
	 * If there are queries set in the modifiers, formats all query parameters for the request url.
	 * @private
	 * @memberof Handlers.MagicBoxHandler
	 *
	 * @param {object} options The query options set by the user in `options.modifiers.query`.
	 * @param {string} query   The query being assessed (filter, sort, etc.)
	 *
	 * @return {string}        The formatted url string to be appended to the request URL.
	 */
	_keyedQueryValues(options, query) {
		return Object.keys(options).map((key) => {
			return `${query}[${key}]=${options[key]}`;
		}).join('&');
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
	_setOptions(url, method, options, cb) {
		//@TODO: how to handle errors
		return {
			url         : url,
			method      : method,
			type        : options.type        || 'json',
			contentType : options.contentType || 'application/json',
			processData : options.processData || false,
			headers     : options.headers     || {},  // Object.assign({},this.defaultHeaders, option.headers) MAYBE
			success     : function(response) {
				cb(response, url);

				if (options.onSuccess) {
					options.onSuccess(url); // Don't send the response, since that is handled by the dispatcher
				}
			},
			error: (error) => {
				this._handleError(error, url);

				if (options.onError) {
					options.onError(error, url);
				}
			}
		};
	}

	/**
	 * Fires whenever a request returns an error response.  Simply logs the error to the console.
	 * @private
	 * @memberof Handlers.MagicBoxHandler
	 *
	 * @param {object|*} error The error returned from the API. Typically an object but could feasibly be anything.
	 * @param {string}   url   The url that was requested when the error occurred.
	 *
	 * @return {null}
	 *
	 * @TODO: This should be based on NODE env.
	 */
	_handleError(error, url) {
		console.error(`Something went wrong when requesting ${url}`, error);
	}

	/**
	 * Fires a GET request using `reqwest`.
	 * @memberof Handlers.MagicBoxHandler
	 *
	 * @param {string} url     The formatted base url to be used in the GET request.
	 * @param {object} options Additional options that are used to further mutate the request and url before firing it off.
	 * @param {function} cb    A callback that is called when the request is made and a response has been received.
	 *
	 * @return {null}
	 */
	get(url, options = {}, cb) {
		url = this._setUrlModifiers(url, options);

		let request = this._setOptions(url, 'get', options, cb);

		if (options.beforeRequest && typeof options.beforeRequest === "function") {
			request = options.beforeRequest(request) || request;  // If `beforeRequest()` doesn't return a value, don't overwrite the object
		}

		reqwest(request);
	}

	/**
	 * Fires a POST request using `reqwest`.
	 * @memberof Handlers.MagicBoxHandler
	 *
	 * @param {string} url     The formatted base url to be used in the POST request.
	 * @param {*}      data    The data to be sent in the POST
	 * @param {object} options Additional options that are used to further mutate the request and url before firing it off.
	 * @param {function} cb    A callback that is called when the request is made and a response has been received.
	 *
	 * @return {null}
	 */
	post(url, data, options = {}, cb) {
		url = this._setUrlModifiers(url, options);

		let request = this._setOptions(url, 'post', options, cb);
		request.data = data;

		//@TODO this can be pulled into another function or `setOptions`
		if (options.beforeRequest && typeof options.beforeRequest === "function") {
			request = options.beforeRequest(request) || request;  // If `beforeRequest()` doesn't return a value, don't overwrite the object
		}

		reqwest(request);
	}

	/**
	 * Fires a PUT request using `reqwest`.
	 * @memberof Handlers.MagicBoxHandler
	 *
	 * @param {string} url     The formatted base url to be used in the PUT request.
	 * @param {*}      data    The data to be sent in the PUT
	 * @param {object} options Additional options that are used to further mutate the request and url before firing it off.
	 * @param {function} cb    A callback that is called when the request is made and a response has been received.
	 *
	 * @return {null}
	 */
	put(url, data, options = {}, cb) {
		url = this._setUrlModifiers(url, options);

		let request = this._setOptions(url, 'put', options, cb);
		request.data = data;

		if (options.beforeRequest && typeof options.beforeRequest === "function") {
			request = options.beforeRequest(request) || request;  // If `beforeRequest()` doesn't return a value, don't overwrite the object
		}

		reqwest(request);
	}

	/**
	 * Fires a PATCH request using `reqwest`.
	 * @memberof Handlers.MagicBoxHandler
	 *
	 * @param {string} url     The formatted base url to be used in the PATCH request.
	 * @param {*}      data    The data to be sent in the PATCH
	 * @param {object} options Additional options that are used to further mutate the request and url before firing it off.
	 * @param {function} cb    A callback that is called when the request is made and a response has been received.
	 *
	 * @return {null}
	 */
	patch(url, data, options = {}, cb) {
		url = this._setUrlModifiers(url, options);

		let request = this._setOptions(url, 'patch', options, cb);
		request.data = data;

		if (options.beforeRequest && typeof options.beforeRequest === "function") {
			request = options.beforeRequest(request) || request;  // If `beforeRequest()` doesn't return a value, don't overwrite the object
		}

		reqwest(request);
	}

	/**
	 * Fires a DELETE request using `reqwest`.
	 * @memberof Handlers.MagicBoxHandler
	 *
	 * @param {string} url     The formatted base url to be used in the DELETE request.
	 * @param {object} options Additional options that are used to further mutate the request and url before firing it off.
	 * @param {function} cb    A callback that is called when the request is made and a response has been received.
	 *
	 * @return {null}
	 */
	delete(url, options = {}, cb) {
		url = this._setUrlModifiers(url, options);

		let request = this._setOptions(url, 'delete', options, cb);

		if (options.beforeRequest && typeof options.beforeRequest === "function") {
			request = options.beforeRequest(request) || request;  // If `beforeRequest()` doesn't return a value, don't overwrite the object
		}

		reqwest(request);
	}
}
