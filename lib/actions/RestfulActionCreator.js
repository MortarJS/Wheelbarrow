import RestfulHandler from '../handlers/RestfulHandler';

/*
 * @class RestfulApiAction
 *
 * @memberOf Actions
 */

export default function RestfulActionCreator(url = '', actionHandler = new RestfulHandler()) {
	const baseUrl = _formatBaseUrl(url),
		handler = actionHandler,
		store = {};

	/**
	 * Formats the base url to ensure that it won't cause any request errors.
	 * @private
	 * @memberOf Actions.RestfulApiAction
	 *
	 * @param  {string} url The base url, which may or may not end in a '/'.
	 *
	 * @return {string}     The formated base url without a trailing '/'.
	 */
	function _formatBaseUrl(actionUrl) {
		// If the url ends in a '/' split that off to avoid formatting errors
		if (actionUrl.slice(-1) === '/') {
			actionUrl = actionUrl.slice(0, -1);
		}

		return url;
	}

	function _generateRequestKey() {
		let requestKey = '',
			possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (let i = 0; i < 16; i ++) {
			requestKey += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		// If the key is already in use (unlikely) generate a new one until a unique key is made
		if (store[requestKey]) {
			return _generateRequestKey();
		}

		return requestKey;
	}

	function _addRequestToStore(key, verb, collection, byId = false, options = {}) {
		store[key] = {
			verb       : verb,
			collection : collection,
			byId       : byId,
			options    : options
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
	 * // collection = 'users', making a 'get' request.
	 * // returns 'USERS_GOTTEN'
	 *
	 * @example
	 * // collection = 'users', making a 'get' request for id 5.
	 * // returns 'USERS_GOTTEN_BY_ID'
	 *
	 * @example
	 * // collection = 'users', making a 'post' request.
	 * // returns 'USERS_POSTED'
	 *
	 * @return {string} A formatted string for the dispatch type.
	 */
	function _constructEventName(key, prepend) {
		let requestData = store[key],
			name = `${requestData.verb}_${requestData.collection}`;

		// Optionally modifies the action to have information abuot included examples:
		// e.g. `USERS_GOTTEN_WITH_CHILDREN`
		if (requestData.options.actionWithInclude &&
			requestData.options.modifiers &&
			requestData.options.modifiers.include) {

			name += `_WITH_${requestData.options.modifiers.include.collection}`;
		}

		name = name.toUpperCase();

		return `${prepend}${requestData.byId ? name + '_BY_ID' : name}_SUCCEEDED`;
	}

	// Handles receiving the collection and dispatching it
	function dispatchResponse(key, dispatch, prepend = '', response) {
		dispatch({
			type: _constructEventName(key, prepend),
			data: response
		});
	}

	function dispatchRequestSent(verb, collection, byId, prepend = '') {
		let action = `${prepend}${verb}_${collection.toUpperCase()}`;

		if (byId) {
			action += 'BY_ID';
		}

		return {
			type: action + '_SENT'
		};
	}

	return {
		get: function (collection, options = {}) {
			return (dispatch) => {
				const requestKey = _generateRequestKey(),
					byId = !!options.id,
					verb = 'GET';

				let url = `${baseUrl}/${collection}`;

				if (byId) {
					url += `/${options.id}`;
				}

				_addRequestToStore(requestKey, verb, collection, byId, options);
				dispatch(dispatchRequestSent(verb, collection, byId, this.prependAction));

				handler.get(url, options, dispatchResponse.bind(null, requestKey, dispatch, this.prependAction));
			};
		},

		post: function (collection, data, options = {}) {
			return (dispatch) => {
				const requestKey = _generateRequestKey(),
					byId = !!options.id,
					verb = 'POST';

				let url = `${baseUrl}/${collection}`;

				if (byId) {
					url += `/${options.id}`;
				}

				_addRequestToStore(requestKey, verb, collection, byId, options);
				dispatch(dispatchRequestSent(verb, collection, byId));

				handler.post(url, options, dispatchResponse.bind(this, requestKey, dispatch));
			};
		},

		put: (collection, data, options = {}) => (dispatch) => {},

		patch: (collection, data, options = {}) => (dispatch) => {},

		delete: function (collection, options = {}) {
			return (dispatch) => {
				const requestKey = _generateRequestKey(),
					byId = !!options.id,
					verb = 'DELETE';

				let url = `${baseUrl}/${collection}`;

				if (byId) {
					url += `/${options.id}`;
				}

				_addRequestToStore(requestKey, verb, collection, byId, options);
				dispatch(dispatchRequestSent(verb, collection, byId));

				handler.get(url, options, dispatchResponse.bind(this, requestKey, dispatch));
			}
		}
	}
}
