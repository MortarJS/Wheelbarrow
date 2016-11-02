'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CustomHandler = ApiHandlers[config.apiHandler];

// @TODO: handle ENV variables to trigger debug warnings only on dev.
// @TODO: How should this be used?  Perhaps this is extanded for custom controllers and `verifyMethodSignature` is still called in `constructor`?

var ApiHandler = function (_CustomHandler) {
	_inherits(ApiHandler, _CustomHandler);

	function ApiHandler() {
		_classCallCheck(this, ApiHandler);

		var _this = _possibleConstructorReturn(this, (ApiHandler.__proto__ || Object.getPrototypeOf(ApiHandler)).call(this));

		_this.requiredMethods = ['get', 'put', 'post', 'delete'];

		_this.verifyMethodSignature();
		return _this;
	}

	_createClass(ApiHandler, [{
		key: 'get',
		value: function get() {
			var response = void 0;

			try {
				response = _get(ApiHandler.prototype.__proto__ || Object.getPrototypeOf(ApiHandler.prototype), 'get', this).apply(this, arguments);
			} catch (e) {
				if (e instanceof TypeError) {
					throw 'TypeError: ' + this._missingMethodString('get');
				} else {
					throw e;
				}
			}

			// Set response into store
		}
	}, {
		key: 'post',
		value: function post() {
			var response = void 0;

			try {
				response = _get(ApiHandler.prototype.__proto__ || Object.getPrototypeOf(ApiHandler.prototype), 'get', this).apply(this, arguments);
			} catch (e) {
				if (e instanceof TypeError) {
					throw 'TypeError: ' + this._missingMethodString('post');
				} else {
					throw e;
				}
			}

			// Set response into store
		}
	}, {
		key: 'put',
		value: function put() {
			try {
				_get(ApiHandler.prototype.__proto__ || Object.getPrototypeOf(ApiHandler.prototype), 'put', this).apply(this, arguments);
			} catch (e) {
				if (e instanceof TypeError) {
					throw 'TypeError: ' + this._missingMethodString('put');
				} else {
					throw e;
				}
			}
		}
	}, {
		key: 'delete',
		value: function _delete() {
			var response = void 0;

			try {
				response = _get(ApiHandler.prototype.__proto__ || Object.getPrototypeOf(ApiHandler.prototype), 'get', this).apply(this, arguments);
			} catch (e) {
				if (e instanceof TypeError) {
					throw 'TypeError: ' + this._missingMethodString('delete');
				} else {
					throw e;
				}
			}

			// Set response into store
		}
	}, {
		key: 'verifyMethodSignature',
		value: function verifyMethodSignature() {
			var _this2 = this;

			this.requiredMethods.forEach(function (method) {
				if (!_get(ApiHandler.prototype.__proto__ || Object.getPrototypeOf(ApiHandler.prototype), method, _this2)) {
					console.warn(_this2._missingMethodString(method));
				}
			});
		}
	}, {
		key: '_missingMethodString',
		value: function _missingMethodString(method) {
			return 'The \'' + method + '\' method is required but defined in ' + config.apiHandler + '.  Please check the \'apiHandler\' defined in your config file.';
		}
	}]);

	return ApiHandler;
}(CustomHandler);

exports.default = new ApiHandler();