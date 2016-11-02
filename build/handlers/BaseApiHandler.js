"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// This serves as a base line for implementing your own handler.
// To get started, copy this file and implement your custom API logic.

var BaseApiHandler = function () {
	function BaseApiHandler() {
		_classCallCheck(this, BaseApiHandler);
	}

	_createClass(BaseApiHandler, [{
		key: "dispatchResponse",
		value: function dispatchResponse() {}
	}, {
		key: "get",
		value: function get(url) {
			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var cb = arguments[2];
		}
	}, {
		key: "post",
		value: function post(url, data) {
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
			var cb = arguments[3];
		}
	}, {
		key: "put",
		value: function put(url, data) {
			var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
			var cb = arguments[3];
		}
	}, {
		key: "patch",
		value: function patch(url, data) {
			var optoins = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
			var cb = arguments[3];
		}
	}, {
		key: "delete",
		value: function _delete(url) {
			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var cb = arguments[2];
		}
	}]);

	return BaseApiHandler;
}();

exports.default = BaseApiHandler;