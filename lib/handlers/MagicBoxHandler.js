var S = require('reqwest');

// @TODO: handle ENV variables to trigger debug warnings only on dev.
export default class MagicBoxHandler {
	constructor() {
		this.token = 'kOTWNfy7d9INO9fVPp8yFlqHxuRKXqvGFgj6iDnx'; // API User Token
	}

	/**
	 * Assign the authorization header
	 *
	 * @returns {object}
	 */
	authorizationHeader() {
		return {
			Authorization: `Bearer ${this.token}`
		}
	}

	/**
	 * Build the URL string with modifiers
	 *
	 * @param {string} url
	 * @param {string} options
	 * @returns {string}
	 */
	buildUrlString(url, options) {
		return url + this.buildUrlModifiers(options.modifiers);
	}

	/**
	 * Build a query string (of modifiers) such as per_page, filter, etc
	 *
	 * @param modifiers
	 * @returns {string}
	 */
	buildUrlModifiers(modifiers) {
		let parts = [];
		for (let key in modifiers) {
			// Handle filters and sorts as php assoc. arrays ['key' => 'value']
			if (key === 'filters') {
				parts = parts.concat(this.buildFilters(modifiers[key], key));
			} else if (key === 'sort' || key === 'aggregate') {
				let part = modifiers[key];

				for (let column in part) {
					parts.push(key + '[' + column + ']=' + part[column]);
				}
			} else if (key === 'include') {
				modifiers[key].forEach((relation, index) => {
					parts.push('include[]=' + relation);
				});
			} else {
				// Handle others as objects to be serialized
				parts.push(QueryHelper.serialize(modifiers[key]));
			}
		}

		if (parts.length > 0) {
			return '?' + parts.join('&');
		}

		return '';
	}

	/**
	 * Set up content type string
	 *
	 * @param options
	 * @returns {string}
	 */
	setContentType(options) {
		switch (options.contentType) {
			case 'form':
				return 'multipart/form-data';
			default:
				return 'application/json';
		}
	}

	/**
	 * Determine if data should be processed by reqwest
	 *
	 * @param {object} options
	 * @returns {boolean}
	 */
	shouldProcessData(options) {
		switch (options.contentType) {
			case 'form':
				return false;
			default:
				return true;
		}
	}

	/**
	 * Merge the developer's headers with the authorization header
	 *
	 * @param userHeaders
	 * @returns {*|exports}
	 */
	mergeHeaders(userHeaders) {
		return Object.assign(this.authorizationHeader(), userHeaders);
	}

	processHeaders() {
		console.log('constructing headers');

		return 'Bearer - Kyle';
	}

	get(url, options = {}, cb) {
		console.log('getting url: ', url)

		S({
			url: url,
			method: 'get',
			success: (response) => {
				// console.log('resp', url, response);
				cb(url, response);
			}
		})

		//S({
		//	url         : this.buildUrlString(url, options),
		//	method      : 'get',
		//	contentType : this.setContentType(options),
		//	processData : this.shouldProcessData(options),
		//	headers     : options.noAuth ? options.headers : this.mergeHeaders(options.headers),
		//	success     : (response) => {
		//		console.log('Success response', response);
		//		// Call pagination action creator to store pagination data
		//		// if (response.meta && response.meta.pagination) {
		//		// 	PaginationActionCreators.acceptPaginatedData(response.meta.pagination);
		//		// 	cb(options.dataNode ? response[options.dataNode] : response, response.meta.pagination);
		//		// } else {
		//		// 	// Call action creator callback that receives user data
		//		// 	cb(options.dataNode ? response[options.dataNode] : response);
		//		// }
		//		//
		//		if (typeof cb === 'function') {
		//			cb(); // @TODO: Figure out how we want this to work.
		//		}
		//	},
		//	error: (response) => {
		//		this.handleError(response, options);
		//	}
		//});

	}

	put(path, data, cb) {
		console.log(`putting ${data} to ${path}`)

		if (typeof cb === 'function') {
			cb()
		}
	}

	handleError(response, url, options) {
		console.warn(`Something went wrong when requesting ${url}`, response);
	}
}
