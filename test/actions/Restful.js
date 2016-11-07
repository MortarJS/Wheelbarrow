const expect = require('chai').expect;
import  RestfulActionCreator  from '../../build/Wheelbarrow';

function dispatch(action) {
	return action;
}

var Handler = {
	get: function(url, options, cb) {
		cb({test: '123'});
	},
	put: function(url, data, options, cb) {},
	post: function(url, data, options, cb) {},
	delete: function(url, data, options, cb) {}
}

let api;

describe('RestfulActionCreator', () => {

	beforeEach(() => {
		api = new RestfulActionCreator('https://jsonplaceholder.typicode.com', Handler);
	});

	it('should make a get request', () => {
		const expected = [ 'GET_POSTS_SENT', 'GET_POSTS_SUCCEEDED'];
		let index = 0;

		api.get('posts')((action) => {
			expect(action).to.have.property('type');
			expect(action.type).to.equal(expected[index]);

			if (index === 1) {
				expect(action.data).to.deep.equal({test: '123'});
			}

			index++;
		});
	});

	it('should allow prepending to the action name', () => {
		const expected = [ 'MOCHA_GET_POSTS_SENT', 'MOCHA_GET_POSTS_SUCCEEDED'];
		let index = 0;

		api.prependAction = 'MOCHA_';

		api.get('posts')((action) => {
			expect(action).to.have.property('type');
			expect(action.type).to.equal(expected[index]);

			if (index === 1) {
				expect(action.data).to.deep.equal({test: '123'});
			}

			index++;
		});
	});

// 	it('should create a class instance', () => {
// 		expect(action).to.be.an('object');
// 		expect(action).itself.to.respondTo('getCollection')
// 			.and.to.respondTo('get')
// 			.and.to.respondTo('post')
// 			.and.to.respondTo('put')
// 			.and.to.respondTo('patch')
// 			.and.to.respondTo('delete');
// 	});
});
