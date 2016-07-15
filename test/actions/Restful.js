const expect = require('chai').expect;
var RestfulActionCreator = require('../../build/Wheelbarrow.js').RestfulActionCreator;

var action;

var Dispatcher = {
	dispatch: function() {}
};

var Handler = {
	get: function(url, options, cb) {},
	put: function(url, data, options, cb) {},
	post: function(url, data, options, cb) {},
	delete: function(url, data, options, cb) {}
}

describe('RestfulActionCreator', () => {
	beforeEach(() => {
		action = new RestfulActionCreator('test', 'http://api.com', function() {console.log(arguments);});
	});

	it('should create a class instance', () => {
		expect(action).to.be.an('object');
		expect(action).itself.to.respondTo('getCollection')
			.and.to.respondTo('getResourceById')
			.and.to.respondTo('postToCollection')
			.and.to.respondTo('postResourceById')
			.and.to.respondTo('putCollection')
			.and.to.respondTo('putResourceById')
			.and.to.respondTo('deleteCollection')
			.and.to.respondTo('deleteResourceById');
	});
});
