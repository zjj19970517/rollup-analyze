const path = require('path');

module.exports = {
	description: 'disallows updates to imported bindings',
	error: {
		code: 'ILLEGAL_REASSIGNMENT',
		message: `Illegal reassignment to import 'a'`,
		id: path.join(__dirname, 'main.js'),
		pos: 28,
		watchFiles: [path.join(__dirname, 'foo.js'), path.join(__dirname, 'main.js')],
		loc: {
			file: path.join(__dirname, 'main.js'),
			line: 3,
			column: 0
		},
		frame: `
			1: import { a } from './foo';
			2:
			3: a++;
			   ^
		`
	}
};

// test copied from https://github.com/esnext/es6-module-transpiler/tree/master/test/examples/update-expression-of-import-fails
