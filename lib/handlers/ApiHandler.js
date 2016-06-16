var CustomHandler = ApiHandlers[config.apiHandler];

// @TODO: handle ENV variables to trigger debug warnings only on dev.
class ApiHandler extends CustomHandler {

	constructor() {
		super();
		this.requiredMethods = ['get', 'put', 'post', 'delete'];

		this.verifyMethodSignature();
	}

	get() {
		let response;

		try {
			response = super.get(...arguments);
		} catch (e) {
			if (e instanceof TypeError) {
				throw `TypeError: ${this._missingMethodString('get')}`;
			} else {
				throw e;
			}
		}

		// Set response into store
	}

	post() {
		let response;

		try {
			response = super.get(...arguments);
		} catch (e) {
			if (e instanceof TypeError) {
				throw `TypeError: ${this._missingMethodString('post')}`;
			} else {
				throw e;
			}
		}

		// Set response into store
	}

	put() {
		try {
			super.put(...arguments);
		} catch (e) {
			if (e instanceof TypeError) {
				throw `TypeError: ${this._missingMethodString('put')}`;
			} else {
				throw e;
			}
		}
	}

	delete() {
		let response;

		try {
			response = super.get(...arguments);
		} catch (e) {
			if (e instanceof TypeError) {
				throw `TypeError: ${this._missingMethodString('delete')}`;
			} else {
				throw e;
			}
		}

		// Set response into store
	}

	verifyMethodSignature() {
		this.requiredMethods.forEach((method) => {
			if (! super[method]) {
				console.warn(this._missingMethodString(method));
			}
		});
	}

	_missingMethodString(method) {
		return `The '${method}' method is required but defined in ${config.apiHandler}.  Please check the 'apiHandler' defined in your config file.`;
	}
}

export default new ApiHandler();
