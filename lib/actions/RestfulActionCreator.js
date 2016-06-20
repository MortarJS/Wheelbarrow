import RestfulHandler from '../handlers/RestfulHandler';

export default class RestfulApiAction {

	/**
	 * Called whenever a new action is created.  Handles setting the class instance's collection
	 * and base url to be used when making api requests.
	 *
	 * @param {string}   collection     The collection that all requests routed through these actions will get. eg 'users' or 'posts'
	 * @param {string}   baseUrl        The base url for the API (eg. http://mortarjs.io/api/)
	 * @param {obj}      dispatcher     The dispatcher for the project. Used to dispatching an action when the response comes back.
	 * @param {function} handler
	 *
	 * @return {null}
	 */
	constructor(collection, baseUrl, dispatcher, handler = new RestfulHandler()) {
		this.collection    = collection;
		this.baseUrl       = this._formatBaseUrl(baseUrl);
		this.dispatcher    = dispatcher;
		this.handler       = handler;

		this.requestVerb = '';
		this.requestById = false;
	}

	/**
	 * Formats the base url to ensure that it won't cause any request errors.
	 * @private
	 *
	 * @param  {string} url The base url, which may or may not end in a '/'.
	 *
	 * @return {string}     The formated base url without a trailing '/'.
	 */
	_formatBaseUrl(url) {
		// If the url ends in a '/' split that off to avoid formatting errors
		if (url.slice(-1) === '/') {
			url = url.slice(0, -1);
		}

		return url;
	}

	/**
	 * Constructs the name of the action's event name to be dispatched when a request is made and handled.
	 * @private
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
	_constructEventName() {
		let name = `${this.collection.toUpperCase()}_${this.requestVerb.toUpperCase()}`;

		return this.requestById ? name + '_BY_ID' : name;
	}

	// Handles receiving the collection and dispatching it
	// @TODO: settle on the name for this API
	dispatchResponse(response, url) {
		this.dispatcher.dispatch({
			type: this._constructEventName(),
			data: response
		});
	}

	/**
	 * Constructs the request url to get a collection defined in `this.collection`.
	 * Uses the url to make a `get` request to the given Api Handler.
	 *
	 * @param {object}        options asdf
	 *
	 * @return {null}
	 */
	getCollection(options) {
		let url = `${this.baseUrl}/${this.collection}`; // config.apiUrl + version + this.collection

		this.requestVerb = 'gotten';
		this.requestById = false;
		this.handler.get(url, options, this.dispatchResponse.bind(this));
	}

	/**
	 * Constructs the request url to `get` a resource in the class's collection at the given id.
	 * Uses the url to make a `get` request to the given Api Handler.
	 *
	 * @param {string|number} id      The id of the resource to `get` in the collection.
	 * @param {object}        options asdf
	 *
	 * @return {null}
	 */
	getResourceById(id, options) {
		let url = `${this.baseUrl}/${this.collection}/${id}`; // config.apiUrl + version + this.collection

		this.requestVerb = 'gotten';
		this.requestById = true;
		this.handler.get(url, options, this.dispatchResponse.bind(this));
	}

	/**
	 * Constructs the request url to post a new resource to a collection defined in `this.collection`.
	 * Uses the url to make a `post` request to the given Api Handler.
	 *
	 * @param {*}      data    The data to be added as a new resource in the collection.  Typically an object, but can be anything.
	 * @param {object} options
	 *
	 * @return {null}
	 */
	postToCollection(data, options) {
		let url = `${this.baseUrl}/${this.collection}`; // config.apiUrl + version + this.collection

		this.requestVerb = 'posted';
		this.requestById = false;
		this.handler.post(url, options, this.dispatchResponse.bind(this));
	}

	/**
	 * Constructs the request url to post a new resource with the given ID to a collection defined in `this.collection`.
	 * Uses the url to make a `post` request to the given Api Handler.
	 *
	 * Note that this is not typically used.  `postToCollection()` is usually what should be used when posting a new resource.
	 *
	 * @param {string|number} id      The id that the new resource will have
	 * @param {*}             data    The data to be added as a new resource in the collection.  Typically an object, but can be anything.
	 * @param {object}        options
	 *
	 * @return {null}
	 */
	postResourceById(id, data, options) {
		let url = `${this.baseUrl}/${this.collection}/${id}`; // config.apiUrl + version + this.collection

		this.requestVerb = 'posted';
		this.requestById = true;
		this.handler.post(url, options, this.dispatchResponse.bind(this));
	}

	/**
	 * Constructs the request url to put new data to a collection defined in `this.collection`.
	 * Uses the url to make a `put` request to the given Api Handler.
	 *
	 * Typically, this will erase all data in the collection and replace it with the passed data.
	 *
	 * @param {array|*} data    The data to replace the collection with. Typically an array of items in the collection
	 * @param {object}  options
	 *
	 * @return {null}
	 */
	putCollection(data, options) {
		let url = `${this.baseUrl}/${this.collection}`; // config.apiUrl + version + this.collection

		this.requestVerb = 'put';
		this.requestById = false;
		this.handler.put(url, options, this.dispatchResponse.bind(this));
	}

	/**
	 * Constructs the request url to put new data to a resource with the given ID to a collection defined in `this.collection`.
	 * Uses the url to make a `put` request to the given Api Handler.
	 *
	 * @param {string|number} id      The id that the new resource will have
	 * @param {*}             data    The data to be added as a new resource in the collection.  Typically an object, but can be anything.
	 * @param {object}        options
	 *
	 * @return {null}
	 */
	putResourceById(id, data, options) {
		let url = `${this.baseUrl}/${this.collection}/${id}`; // config.apiUrl + version + this.collection

		this.requestVerb = 'put';
		this.requestById = true;
		this.handler.put(url, options, this.dispatchResponse.bind(this));
	}

	/**
	 * Constructs the request url to delete the entire collection.
	 * Uses the url to make a `delete` request to the given Api Handler.
	 *
	 * @param {object}  options
	 *
	 * @return {null}
	 */
	deleteCollection(options) {
		let url = `${this.baseUrl}/${this.collection}`; // config.apiUrl + version + this.collection

		this.requestVerb = 'deleted';
		this.requestById = false;
		this.handler.delete(url, options, this.dispatchResponse.bind(this));
	}

	/**
	 * Constructs the request url to delete the resource at a given id in the collection.
	 * Uses the url to make a `delete` request to the given Api Handler.
	 *
	 * @param {string|number} id      The id of the resource to be deleted.
	 * @param {object}        options
	 *
	 * @return {null}
	 */
	deleteResourceById(id, options) {
		let url = `${this.baseUrl}/${this.collection}/${id}`; // config.apiUrl + version + this.collection

		this.requestVerb = 'deleted';
		this.requestById = true;
		this.handler.delete(url, options, this.dispatchResponse.bind(this));
	}
}

