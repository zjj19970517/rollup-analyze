var foo=(function(x){'use strict';function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var x__default=/*#__PURE__*/_interopDefaultLegacy(x);var self=/*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({__proto__:null,get default(){return foo}},Symbol.toStringTag,{value:'Module'}));console.log(self);
function foo () {
	console.log( x__default["default"] );
}
// trailing comment
return foo;})(x);