var config = require('../../../bootstrap').config;

import Wheelbarrow from '../Wheelbarrow';
import {ApiHandler} from '../../../app-container';

export default class MagicBoxResourceActions {
	constructor(resource) {
		this.resource = resource;
		this.baseUrl  = config.base.apiVersionedUrl;
	}

	// Handles receiving the resource and dispatching it
	dispatchResource(url, response) {
		console.log('RESOURCE RECEIVED', url, response);

		Wheelbarrow.dispatch({
			type: '',
			data: ''
		})
	}

	// Gets a resource at an id (eg .../users/1)
	getResourceById(id, options) {
		let url = `${this.baseUrl}${this.resource}/${id}`; // config.apiUrl + version + this.resource

		ApiHandler.get(url, options, this.dispatchResource);
	}

	// Gets a list of resources (eg .../users/)
	getResourceList(options) {
		let url = `${this.baseUrl}${this.resource}`; // config.apiUrl + version + this.resource

		ApiHandler.get(url, options, this.dispatchResource);
	}

	postResource() {}

	putResource() {}

	deleteResource() {}
}

