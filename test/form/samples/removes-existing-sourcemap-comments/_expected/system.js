System.register([], (function () {
	'use strict';
	return {
		execute: (function () {

			function foo (x) {
				return x;
			}

			var str = `
//# sourceMappingURL=main.js.map
`;

			console.log( foo(str) );

		})
	};
}));
