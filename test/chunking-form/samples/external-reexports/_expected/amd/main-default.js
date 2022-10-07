define(['exports', 'external-all', 'external-default', 'external-default-named', 'external-default-namespace'], (function (exports, externalAll, externalDefault, externalDefaultNamed, externalDefaultNamespace) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var externalAll__default = /*#__PURE__*/_interopDefaultLegacy(externalAll);
	var externalDefault__default = /*#__PURE__*/_interopDefaultLegacy(externalDefault);
	var externalDefaultNamed__default = /*#__PURE__*/_interopDefaultLegacy(externalDefaultNamed);
	var externalDefaultNamespace__default = /*#__PURE__*/_interopDefaultLegacy(externalDefaultNamespace);



	Object.defineProperty(exports, 'foo', {
		enumerable: true,
		get: function () { return externalAll__default["default"]; }
	});
	Object.defineProperty(exports, 'bar', {
		enumerable: true,
		get: function () { return externalDefault__default["default"]; }
	});
	Object.defineProperty(exports, 'baz', {
		enumerable: true,
		get: function () { return externalDefaultNamed__default["default"]; }
	});
	Object.defineProperty(exports, 'quux', {
		enumerable: true,
		get: function () { return externalDefaultNamespace__default["default"]; }
	});

	Object.defineProperty(exports, '__esModule', { value: true });

}));
