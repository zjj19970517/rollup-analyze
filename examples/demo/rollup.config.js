const path = require('path');

const resolve = function (...args) {
	return path.resolve(__dirname, ...args);
};

export default {
	input: {
		'index.js': resolve('./index1.js')
	},
	output: {
		dir: resolve('./dist'),
		exports: 'auto',
		entryFileNames: '[name]',
		generatedCode: 'es2015',
		interop: 'default',
		sourcemap: true
	}
};
