var S = require('reqwest');

// @TODO what happens if there isn't a cb defined?
// @TODO console.log() the request URL and DATA when in DEV env.
export default class RestfulHandler {

	/**
	 * Instantiates the class instance
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
		if (options.modifiers && options.modifiers.include) {
			url += this._includeValues(options.modifiers.include);
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
	_includeValues(options) {
		let path = '';

		path += path.slice(-1) === '/' ? options.collection : '/' + options.collection; // Append a / when needed

		if (options.id) {
			path += `/${options.id}`;
		}

		if (options.hasOwnProperty('include')) {
			path += `/${includeValues(options.include)}`;
		}

		return path;
	}

	/**
	 * If there are queries set in the modifiers, formats all query parameters for the request url.
	 * @private
	 *
	 * @param {object} options The query options set by the user in `options.modifiers.query`.
	 *
	 * @return {string} The formatted url string to be appended to the request URL.
	 */
	_queryValues(options) {
		let queryString = Object.keys(options).map((key) => {
			return `${key}=${options[key]}`;
		}).join('&');

		return '?' + queryString;
	}

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
			},
			error: (error) => {
				this._handleError(error, url);
			}
		};
	}

	_handleError(error, url) {
		console.error(`Something went wrong when requesting ${url}`, error);
	}

	get(url, options = {}, cb) {
		url = this._setUrlModifiers(url, options);

		let request = this._setOptions(url, 'get', options, cb);

		if (options.beforeRequest && typeof options.beforeRequest === "function") {
			request = options.beforeRequest(request) || request;  // If `beforeRequest()` doesn't return a value, don't overwrite the object
		}

		S(request);
	}

	post(url, data, options = {}, cb) {
		url = this._setUrlModifiers(url, options);

		let request = this._setOptions(url, 'post', options, cb);
		request.data = data;

		//@TODO this can be pulled into another function or `setOptions`
		if (options.beforeRequest && typeof options.beforeRequest === "function") {
			request = options.beforeRequest(request) || request;  // If `beforeRequest()` doesn't return a value, don't overwrite the object
		}

		S(request);
	}

	put(url, data, options = {}, cb) {
		url = this._setUrlModifiers(url, options);

		let request = this._setOptions(url, 'put', options, cb);
		request.data = data;

		if (options.beforeRequest && typeof options.beforeRequest === "function") {
			request = options.beforeRequest(request) || request;  // If `beforeRequest()` doesn't return a value, don't overwrite the object
		}

		S(request);
	}

	delete(url, options = {}, cb) {
		url = this._setUrlModifiers(url, options);

		let request = this._setOptions(url, 'delete', options, cb);

		if (options.beforeRequest && typeof options.beforeRequest === "function") {
			request = options.beforeRequest(request) || request;  // If `beforeRequest()` doesn't return a value, don't overwrite the object
		}

		S(request);
	}
}
