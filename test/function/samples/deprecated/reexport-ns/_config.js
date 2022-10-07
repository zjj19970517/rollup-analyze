const assert = require('assert');

module.exports = {
	description: 'external namespace reexport',
	options: {
		strictDeprecations: false,
		external: ['external'],
		output: {
			namespaceToStringTag: true
		}
	},
	exports(exports) {
		assert.strictEqual(typeof exports.maths, 'object');
		assert.strictEqual(exports[Symbol.toStringTag], 'Module');
		assert.strictEqual(exports.maths.external, true);
	}
};
