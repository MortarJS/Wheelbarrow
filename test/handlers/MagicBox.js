import MagicBox from "../../lib/handlers/MagicBoxHandler";

var expect = require('chai').expect;

describe('MagicBoxHandler', () => {
	let magicBox = new MagicBox(),
		url      = 'api.com/users';

	let beforeRequest = function() {
	};

	beforeEach(() => {
	});

	describe('url modifiers', () => {
		describe('includes', () => {
			it('can include a single relation', () => {
				let options = {
					modifiers: {
						include: {
							collection: 'pets'
						}
					}
				};

				let request = magicBox._setUrlModifiers(url, options);

				expect(request).to.equal(`${url}?include[]=pets`);
			});

			it('can include a multiple relations', () => {
				let options = {
					modifiers: {
						include: [
							{
								collection: 'pets'
							},
							{
								collection: 'children'
							}
						]
					}
				};

				let request = magicBox._setUrlModifiers(url, options);

				expect(request).to.equal(`${url}?include[]=pets&include[]=children`);
			});

			it('can deep include a single relation', () => {
				let options = {
					modifiers: {
						include: {
							collection: 'pets',
							include: {
								collection: 'food'
							}
						}
					}
				};

				let request = magicBox._setUrlModifiers(url, options);

				expect(request).to.equal(`${url}?include[]=pets.food`);
			});
		});
	});
});
