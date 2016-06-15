var config = require('../../../bootstrap').config;

import Wheelbarrow from '../Wheelbarrow';
import {ApiHandler} from '../../../app-container';

export default class RestfulApiActions {

	/**
	 * Called whenever a new action is created.  Handles setting the class instance's collection
	 * and base url to be used when making api requests.
	 *
	 * @param {string} collection The collection that all requests routed through these actions will get. eg 'users' or 'posts'
	 *
	 * @return {null}
	 */
	constructor(collection) {
		this.collection = collection;
		this.baseUrl  = config.base.apiVersionedUrl;
	}

	// Handles receiving the collection and dispatching it
	// @TODO: settle on the name for this API
	dispatchCollection(url, response) {
		Wheelbarrow.dispatch({
			type: '',
			data: ''
		})
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
		let url = `${this.baseUrl}${this.collection}/${id}`; // config.apiUrl + version + this.collection

		ApiHandler.get(url, options, this.dispatchResource);
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
		let url = `${this.baseUrl}${this.collection}`; // config.apiUrl + version + this.collection

		ApiHandler.get(url, options, this.dispatchCollection);
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
		let url = `${this.baseUrl}${this.collection}/${id}`; // config.apiUrl + version + this.collection
		ApiHandler.post(url, options, this.dispatchCollection);
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
		let url = `${this.baseUrl}${this.collection}/${id}`; // config.apiUrl + version + this.collection
		ApiHandler.post(url, options, this.dispatchCollection)
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
		let url = `${this.baseUrl}${this.collection}/${id}`; // config.apiUrl + version + this.collection
		ApiHandler.put(url, options, this.dispatchCollection)
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
	putCollection() {
		let url = `${this.baseUrl}${this.collection}/${id}`; // config.apiUrl + version + this.collection
		ApiHandler.put(url, options, this.dispatchCollection)
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
		let url = `${this.baseUrl}${this.collection}/${id}`; // config.apiUrl + version + this.collection
		ApiHandler.delete(url, options, this.dispatchCollection)
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
		let url = `${this.baseUrl}${this.collection}/${id}`; // config.apiUrl + version + this.collection
		ApiHandler.delete(url, options, this.dispatchCollection)
	}
}

