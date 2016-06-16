var S = require('reqwest');

export default class RestfulHandler {
	constructor() {
	}

	_setUrl(url, options) {
		if (options.modifiers && options.modifiers.include) {
			url += this._includeValues(options.modifiers.include);
		}

		if (options.modifiers && options.modifiers.query) {
			url += this._queryValues(options.modifiers.query);
		}

		return url;
	}

	_setOptions(url, method, options) {

		//@TODO: how to handle errors
		return {
			url         : url,
			method      : method,
			type        : options.type        || 'json',
			contentType : options.contentType || 'application/json',
			processData : options.processData || false,
			headers     : options.headers     || {},  // Object.assign({},this.defaultHeaders, option.headers) MAYBE
			success     : (response) => {
				cb(response, url);
			},
			error: (error) => {
				this._handleError(error, url);
			}
		};
	}

	_includeValues(options) {
		let path = '';

		path += options.collection;

		if (options.id) {
			path += `/${options.id}`;
		}

		if (options.hasOwnProperty('include')) {
			path += `/${includeValues(options.include)}`;
		}

		return path;
	}

	_queryValues(options) {
		let queryString = Object.keys(options).map((key) => {
			return `${key}=${options[key]}`;
		}).join('&');

		return '?' + queryString;
	}

	_handleError(error, url) {
		console.error(`Something went wrong when requesting ${url}`, error);
		cb(error);
	}

	get(url, options = {}, cb) {
		url = this._setUrl(url, options);

		let request = this._setOptions(url, 'get', options);

		if (options.beforeRequest && typeof options.beforeRequest === "function") {
			request = beforeRequest(request) || request;  // If `beforeRequest()` doesn't return a value, don't overwrite the object
		}

		S(request);
	}

	post(url, data, options = {}, cb) {
		url = this._setUrl(url, options);

		let request = this._setOptions(url, 'post', options);

		//@TODO this can be pulled into another function or `setOptions`
		if (options.beforeRequest && typeof options.beforeRequest === "function") {
			request = beforeRequest(request) || request;  // If `beforeRequest()` doesn't return a value, don't overwrite the object
		}

		S(request);
	}

	put(url, data, options = {}, cb) {
		url = this._setUrl(url, options);

		let request = this._setOptions(url, 'put', options);

		if (options.beforeRequest && typeof options.beforeRequest === "function") {
			request = beforeRequest(request) || request;  // If `beforeRequest()` doesn't return a value, don't overwrite the object
		}

		S(request);
	}

	delete(url, options = {}, cb) {
		url = this._setUrl(url, options);

		let request = this._setOptions(url, 'delete', options);

		if (options.beforeRequest && typeof options.beforeRequest === "function") {
			request = beforeRequest(request) || request;  // If `beforeRequest()` doesn't return a value, don't overwrite the object
		}

		S(request);
	}
}
