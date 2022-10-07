var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var coreJs = {exports: {}};

var features = {exports: {}};

var full = {exports: {}};

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global$$ =
  // eslint-disable-next-line es-x/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

var objectGetOwnPropertyDescriptor = {};

var fails$1m = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

var fails$1l = fails$1m;

// Detect IE8's incomplete defineProperty implementation
var descriptors = !fails$1l(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

var fails$1k = fails$1m;

var functionBindNative = !fails$1k(function () {
  // eslint-disable-next-line es-x/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});

var NATIVE_BIND$4 = functionBindNative;

var call$16 = Function.prototype.call;

var functionCall = NATIVE_BIND$4 ? call$16.bind(call$16) : function () {
  return call$16.apply(call$16, arguments);
};

var objectPropertyIsEnumerable = {};

var $propertyIsEnumerable$2 = {}.propertyIsEnumerable;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor$a = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor$a && !$propertyIsEnumerable$2.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor$a(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable$2;

var createPropertyDescriptor$c = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var NATIVE_BIND$3 = functionBindNative;

var FunctionPrototype$4 = Function.prototype;
var bind$v = FunctionPrototype$4.bind;
var call$15 = FunctionPrototype$4.call;
var uncurryThis$1t = NATIVE_BIND$3 && bind$v.bind(call$15, call$15);

var functionUncurryThis = NATIVE_BIND$3 ? function (fn) {
  return fn && uncurryThis$1t(fn);
} : function (fn) {
  return fn && function () {
    return call$15.apply(fn, arguments);
  };
};

var uncurryThis$1s = functionUncurryThis;

var toString$B = uncurryThis$1s({}.toString);
var stringSlice$h = uncurryThis$1s(''.slice);

var classofRaw$1 = function (it) {
  return stringSlice$h(toString$B(it), 8, -1);
};

var uncurryThis$1r = functionUncurryThis;
var fails$1j = fails$1m;
var classof$m = classofRaw$1;

var $Object$6 = Object;
var split$3 = uncurryThis$1r(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails$1j(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object$6('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof$m(it) == 'String' ? split$3(it, '') : $Object$6(it);
} : $Object$6;

var $TypeError$z = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible$k = function (it) {
  if (it == undefined) throw $TypeError$z("Can't call method on " + it);
  return it;
};

// toObject with fallback for non-array-like ES3 strings
var IndexedObject$7 = indexedObject;
var requireObjectCoercible$j = requireObjectCoercible$k;

var toIndexedObject$k = function (it) {
  return IndexedObject$7(requireObjectCoercible$j(it));
};

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
var isCallable$E = function (argument) {
  return typeof argument == 'function';
};

var isCallable$D = isCallable$E;

var isObject$C = function (it) {
  return typeof it == 'object' ? it !== null : isCallable$D(it);
};

var global$_ = global$$;
var isCallable$C = isCallable$E;

var aFunction = function (argument) {
  return isCallable$C(argument) ? argument : undefined;
};

var getBuiltIn$L = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global$_[namespace]) : global$_[namespace] && global$_[namespace][method];
};

var uncurryThis$1q = functionUncurryThis;

var objectIsPrototypeOf = uncurryThis$1q({}.isPrototypeOf);

var getBuiltIn$K = getBuiltIn$L;

var engineUserAgent = getBuiltIn$K('navigator', 'userAgent') || '';

var global$Z = global$$;
var userAgent$7 = engineUserAgent;

var process$4 = global$Z.process;
var Deno$1 = global$Z.Deno;
var versions = process$4 && process$4.versions || Deno$1 && Deno$1.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent$7) {
  match = userAgent$7.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent$7.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

var engineV8Version = version;

/* eslint-disable es-x/no-symbol -- required for testing */

var V8_VERSION$3 = engineV8Version;
var fails$1i = fails$1m;

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- required for testing
var nativeSymbol = !!Object.getOwnPropertySymbols && !fails$1i(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION$3 && V8_VERSION$3 < 41;
});

/* eslint-disable es-x/no-symbol -- required for testing */

var NATIVE_SYMBOL$6 = nativeSymbol;

var useSymbolAsUid = NATIVE_SYMBOL$6
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';

var getBuiltIn$J = getBuiltIn$L;
var isCallable$B = isCallable$E;
var isPrototypeOf$d = objectIsPrototypeOf;
var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

var $Object$5 = Object;

var isSymbol$7 = USE_SYMBOL_AS_UID$1 ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn$J('Symbol');
  return isCallable$B($Symbol) && isPrototypeOf$d($Symbol.prototype, $Object$5(it));
};

var $String$5 = String;

var tryToString$7 = function (argument) {
  try {
    return $String$5(argument);
  } catch (error) {
    return 'Object';
  }
};

var isCallable$A = isCallable$E;
var tryToString$6 = tryToString$7;

var $TypeError$y = TypeError;

// `Assert: IsCallable(argument) is true`
var aCallable$X = function (argument) {
  if (isCallable$A(argument)) return argument;
  throw $TypeError$y(tryToString$6(argument) + ' is not a function');
};

var aCallable$W = aCallable$X;

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
var getMethod$i = function (V, P) {
  var func = V[P];
  return func == null ? undefined : aCallable$W(func);
};

var call$14 = functionCall;
var isCallable$z = isCallable$E;
var isObject$B = isObject$C;

var $TypeError$x = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
var ordinaryToPrimitive$2 = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable$z(fn = input.toString) && !isObject$B(val = call$14(fn, input))) return val;
  if (isCallable$z(fn = input.valueOf) && !isObject$B(val = call$14(fn, input))) return val;
  if (pref !== 'string' && isCallable$z(fn = input.toString) && !isObject$B(val = call$14(fn, input))) return val;
  throw $TypeError$x("Can't convert object to primitive value");
};

var shared$9 = {exports: {}};

var isPure = false;

var global$Y = global$$;

// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var defineProperty$i = Object.defineProperty;

var defineGlobalProperty$3 = function (key, value) {
  try {
    defineProperty$i(global$Y, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global$Y[key] = value;
  } return value;
};

var global$X = global$$;
var defineGlobalProperty$2 = defineGlobalProperty$3;

var SHARED = '__core-js_shared__';
var store$5 = global$X[SHARED] || defineGlobalProperty$2(SHARED, {});

var sharedStore = store$5;

var store$4 = sharedStore;

(shared$9.exports = function (key, value) {
  return store$4[key] || (store$4[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.23.5',
  mode: 'global',
  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.23.5/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});

var requireObjectCoercible$i = requireObjectCoercible$k;

var $Object$4 = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
var toObject$B = function (argument) {
  return $Object$4(requireObjectCoercible$i(argument));
};

var uncurryThis$1p = functionUncurryThis;
var toObject$A = toObject$B;

var hasOwnProperty = uncurryThis$1p({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es-x/no-object-hasown -- safe
var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject$A(it), key);
};

var uncurryThis$1o = functionUncurryThis;

var id$2 = 0;
var postfix = Math.random();
var toString$A = uncurryThis$1o(1.0.toString);

var uid$6 = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$A(++id$2 + postfix, 36);
};

var global$W = global$$;
var shared$8 = shared$9.exports;
var hasOwn$A = hasOwnProperty_1;
var uid$5 = uid$6;
var NATIVE_SYMBOL$5 = nativeSymbol;
var USE_SYMBOL_AS_UID = useSymbolAsUid;

var WellKnownSymbolsStore$1 = shared$8('wks');
var Symbol$3 = global$W.Symbol;
var symbolFor = Symbol$3 && Symbol$3['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$3 : Symbol$3 && Symbol$3.withoutSetter || uid$5;

var wellKnownSymbol$K = function (name) {
  if (!hasOwn$A(WellKnownSymbolsStore$1, name) || !(NATIVE_SYMBOL$5 || typeof WellKnownSymbolsStore$1[name] == 'string')) {
    var description = 'Symbol.' + name;
    if (NATIVE_SYMBOL$5 && hasOwn$A(Symbol$3, name)) {
      WellKnownSymbolsStore$1[name] = Symbol$3[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore$1[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore$1[name] = createWellKnownSymbol(description);
    }
  } return WellKnownSymbolsStore$1[name];
};

var call$13 = functionCall;
var isObject$A = isObject$C;
var isSymbol$6 = isSymbol$7;
var getMethod$h = getMethod$i;
var ordinaryToPrimitive$1 = ordinaryToPrimitive$2;
var wellKnownSymbol$J = wellKnownSymbol$K;

var $TypeError$w = TypeError;
var TO_PRIMITIVE$1 = wellKnownSymbol$J('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
var toPrimitive$4 = function (input, pref) {
  if (!isObject$A(input) || isSymbol$6(input)) return input;
  var exoticToPrim = getMethod$h(input, TO_PRIMITIVE$1);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call$13(exoticToPrim, input, pref);
    if (!isObject$A(result) || isSymbol$6(result)) return result;
    throw $TypeError$w("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive$1(input, pref);
};

var toPrimitive$3 = toPrimitive$4;
var isSymbol$5 = isSymbol$7;

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
var toPropertyKey$9 = function (argument) {
  var key = toPrimitive$3(argument, 'string');
  return isSymbol$5(key) ? key : key + '';
};

var global$V = global$$;
var isObject$z = isObject$C;

var document$3 = global$V.document;
// typeof document.createElement is 'object' in old IE
var EXISTS$1 = isObject$z(document$3) && isObject$z(document$3.createElement);

var documentCreateElement$2 = function (it) {
  return EXISTS$1 ? document$3.createElement(it) : {};
};

var DESCRIPTORS$J = descriptors;
var fails$1h = fails$1m;
var createElement$1 = documentCreateElement$2;

// Thanks to IE8 for its funny defineProperty
var ie8DomDefine = !DESCRIPTORS$J && !fails$1h(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement$1('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

var DESCRIPTORS$I = descriptors;
var call$12 = functionCall;
var propertyIsEnumerableModule$2 = objectPropertyIsEnumerable;
var createPropertyDescriptor$b = createPropertyDescriptor$c;
var toIndexedObject$j = toIndexedObject$k;
var toPropertyKey$8 = toPropertyKey$9;
var hasOwn$z = hasOwnProperty_1;
var IE8_DOM_DEFINE$1 = ie8DomDefine;

// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
objectGetOwnPropertyDescriptor.f = DESCRIPTORS$I ? $getOwnPropertyDescriptor$2 : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject$j(O);
  P = toPropertyKey$8(P);
  if (IE8_DOM_DEFINE$1) try {
    return $getOwnPropertyDescriptor$2(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn$z(O, P)) return createPropertyDescriptor$b(!call$12(propertyIsEnumerableModule$2.f, O, P), O[P]);
};

var objectDefineProperty = {};

var DESCRIPTORS$H = descriptors;
var fails$1g = fails$1m;

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
var v8PrototypeDefineBug = DESCRIPTORS$H && fails$1g(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});

var isObject$y = isObject$C;

var $String$4 = String;
var $TypeError$v = TypeError;

// `Assert: Type(argument) is Object`
var anObject$1A = function (argument) {
  if (isObject$y(argument)) return argument;
  throw $TypeError$v($String$4(argument) + ' is not an object');
};

var DESCRIPTORS$G = descriptors;
var IE8_DOM_DEFINE = ie8DomDefine;
var V8_PROTOTYPE_DEFINE_BUG$1 = v8PrototypeDefineBug;
var anObject$1z = anObject$1A;
var toPropertyKey$7 = toPropertyKey$9;

var $TypeError$u = TypeError;
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var $defineProperty$1 = Object.defineProperty;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE$1 = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
objectDefineProperty.f = DESCRIPTORS$G ? V8_PROTOTYPE_DEFINE_BUG$1 ? function defineProperty(O, P, Attributes) {
  anObject$1z(O);
  P = toPropertyKey$7(P);
  anObject$1z(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor$1(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty$1(O, P, Attributes);
} : $defineProperty$1 : function defineProperty(O, P, Attributes) {
  anObject$1z(O);
  P = toPropertyKey$7(P);
  anObject$1z(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty$1(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError$u('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var DESCRIPTORS$F = descriptors;
var definePropertyModule$c = objectDefineProperty;
var createPropertyDescriptor$a = createPropertyDescriptor$c;

var createNonEnumerableProperty$i = DESCRIPTORS$F ? function (object, key, value) {
  return definePropertyModule$c.f(object, key, createPropertyDescriptor$a(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var makeBuiltIn$4 = {exports: {}};

var DESCRIPTORS$E = descriptors;
var hasOwn$y = hasOwnProperty_1;

var FunctionPrototype$3 = Function.prototype;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS$E && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn$y(FunctionPrototype$3, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS$E || (DESCRIPTORS$E && getDescriptor(FunctionPrototype$3, 'name').configurable));

var functionName = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};

var uncurryThis$1n = functionUncurryThis;
var isCallable$y = isCallable$E;
var store$3 = sharedStore;

var functionToString$1 = uncurryThis$1n(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable$y(store$3.inspectSource)) {
  store$3.inspectSource = function (it) {
    return functionToString$1(it);
  };
}

var inspectSource$5 = store$3.inspectSource;

var global$U = global$$;
var isCallable$x = isCallable$E;
var inspectSource$4 = inspectSource$5;

var WeakMap$4 = global$U.WeakMap;

var nativeWeakMap = isCallable$x(WeakMap$4) && /native code/.test(inspectSource$4(WeakMap$4));

var shared$7 = shared$9.exports;
var uid$4 = uid$6;

var keys$3 = shared$7('keys');

var sharedKey$4 = function (key) {
  return keys$3[key] || (keys$3[key] = uid$4(key));
};

var hiddenKeys$6 = {};

var NATIVE_WEAK_MAP$1 = nativeWeakMap;
var global$T = global$$;
var uncurryThis$1m = functionUncurryThis;
var isObject$x = isObject$C;
var createNonEnumerableProperty$h = createNonEnumerableProperty$i;
var hasOwn$x = hasOwnProperty_1;
var shared$6 = sharedStore;
var sharedKey$3 = sharedKey$4;
var hiddenKeys$5 = hiddenKeys$6;

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError$8 = global$T.TypeError;
var WeakMap$3 = global$T.WeakMap;
var set$3, get$2, has;

var enforce = function (it) {
  return has(it) ? get$2(it) : set$3(it, {});
};

var getterFor$2 = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject$x(it) || (state = get$2(it)).type !== TYPE) {
      throw TypeError$8('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP$1 || shared$6.state) {
  var store$2 = shared$6.state || (shared$6.state = new WeakMap$3());
  var wmget = uncurryThis$1m(store$2.get);
  var wmhas = uncurryThis$1m(store$2.has);
  var wmset = uncurryThis$1m(store$2.set);
  set$3 = function (it, metadata) {
    if (wmhas(store$2, it)) throw new TypeError$8(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset(store$2, it, metadata);
    return metadata;
  };
  get$2 = function (it) {
    return wmget(store$2, it) || {};
  };
  has = function (it) {
    return wmhas(store$2, it);
  };
} else {
  var STATE = sharedKey$3('state');
  hiddenKeys$5[STATE] = true;
  set$3 = function (it, metadata) {
    if (hasOwn$x(it, STATE)) throw new TypeError$8(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty$h(it, STATE, metadata);
    return metadata;
  };
  get$2 = function (it) {
    return hasOwn$x(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn$x(it, STATE);
  };
}

var internalState = {
  set: set$3,
  get: get$2,
  has: has,
  enforce: enforce,
  getterFor: getterFor$2
};

var fails$1f = fails$1m;
var isCallable$w = isCallable$E;
var hasOwn$w = hasOwnProperty_1;
var DESCRIPTORS$D = descriptors;
var CONFIGURABLE_FUNCTION_NAME$2 = functionName.CONFIGURABLE;
var inspectSource$3 = inspectSource$5;
var InternalStateModule$l = internalState;

var enforceInternalState$4 = InternalStateModule$l.enforce;
var getInternalState$i = InternalStateModule$l.get;
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var defineProperty$h = Object.defineProperty;

var CONFIGURABLE_LENGTH = DESCRIPTORS$D && !fails$1f(function () {
  return defineProperty$h(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn$3 = makeBuiltIn$4.exports = function (value, name, options) {
  if (String(name).slice(0, 7) === 'Symbol(') {
    name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn$w(value, 'name') || (CONFIGURABLE_FUNCTION_NAME$2 && value.name !== name)) {
    if (DESCRIPTORS$D) defineProperty$h(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn$w(options, 'arity') && value.length !== options.arity) {
    defineProperty$h(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn$w(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS$D) defineProperty$h(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState$4(value);
  if (!hasOwn$w(state, 'source')) {
    state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn$3(function toString() {
  return isCallable$w(this) && getInternalState$i(this).source || inspectSource$3(this);
}, 'toString');

var isCallable$v = isCallable$E;
var definePropertyModule$b = objectDefineProperty;
var makeBuiltIn$2 = makeBuiltIn$4.exports;
var defineGlobalProperty$1 = defineGlobalProperty$3;

var defineBuiltIn$p = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable$v(value)) makeBuiltIn$2(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty$1(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule$b.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};

var objectGetOwnPropertyNames = {};

var ceil$1 = Math.ceil;
var floor$a = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es-x/no-math-trunc -- safe
var mathTrunc = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor$a : ceil$1)(n);
};

var trunc$1 = mathTrunc;

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
var toIntegerOrInfinity$o = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc$1(number);
};

var toIntegerOrInfinity$n = toIntegerOrInfinity$o;

var max$9 = Math.max;
var min$c = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex$b = function (index, length) {
  var integer = toIntegerOrInfinity$n(index);
  return integer < 0 ? max$9(integer + length, 0) : min$c(integer, length);
};

var toIntegerOrInfinity$m = toIntegerOrInfinity$o;

var min$b = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
var toLength$d = function (argument) {
  return argument > 0 ? min$b(toIntegerOrInfinity$m(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

var toLength$c = toLength$d;

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
var lengthOfArrayLike$A = function (obj) {
  return toLength$c(obj.length);
};

var toIndexedObject$i = toIndexedObject$k;
var toAbsoluteIndex$a = toAbsoluteIndex$b;
var lengthOfArrayLike$z = lengthOfArrayLike$A;

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod$8 = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject$i($this);
    var length = lengthOfArrayLike$z(O);
    var index = toAbsoluteIndex$a(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod$8(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod$8(false)
};

var uncurryThis$1l = functionUncurryThis;
var hasOwn$v = hasOwnProperty_1;
var toIndexedObject$h = toIndexedObject$k;
var indexOf$2 = arrayIncludes.indexOf;
var hiddenKeys$4 = hiddenKeys$6;

var push$m = uncurryThis$1l([].push);

var objectKeysInternal = function (object, names) {
  var O = toIndexedObject$h(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn$v(hiddenKeys$4, key) && hasOwn$v(O, key) && push$m(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn$v(O, key = names[i++])) {
    ~indexOf$2(result, key) || push$m(result, key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys$3 = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

var internalObjectKeys$1 = objectKeysInternal;
var enumBugKeys$2 = enumBugKeys$3;

var hiddenKeys$3 = enumBugKeys$2.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es-x/no-object-getownpropertynames -- safe
objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys$1(O, hiddenKeys$3);
};

var objectGetOwnPropertySymbols = {};

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- safe
objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

var getBuiltIn$I = getBuiltIn$L;
var uncurryThis$1k = functionUncurryThis;
var getOwnPropertyNamesModule$2 = objectGetOwnPropertyNames;
var getOwnPropertySymbolsModule$3 = objectGetOwnPropertySymbols;
var anObject$1y = anObject$1A;

var concat$4 = uncurryThis$1k([].concat);

// all object keys, includes non-enumerable and symbols
var ownKeys$3 = getBuiltIn$I('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule$2.f(anObject$1y(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule$3.f;
  return getOwnPropertySymbols ? concat$4(keys, getOwnPropertySymbols(it)) : keys;
};

var hasOwn$u = hasOwnProperty_1;
var ownKeys$2 = ownKeys$3;
var getOwnPropertyDescriptorModule$6 = objectGetOwnPropertyDescriptor;
var definePropertyModule$a = objectDefineProperty;

var copyConstructorProperties$4 = function (target, source, exceptions) {
  var keys = ownKeys$2(source);
  var defineProperty = definePropertyModule$a.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule$6.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn$u(target, key) && !(exceptions && hasOwn$u(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};

var fails$1e = fails$1m;
var isCallable$u = isCallable$E;

var replacement = /#|\.prototype\./;

var isForced$5 = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable$u(detection) ? fails$1e(detection)
    : !!detection;
};

var normalize = isForced$5.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced$5.data = {};
var NATIVE = isForced$5.NATIVE = 'N';
var POLYFILL = isForced$5.POLYFILL = 'P';

var isForced_1 = isForced$5;

var global$S = global$$;
var getOwnPropertyDescriptor$9 = objectGetOwnPropertyDescriptor.f;
var createNonEnumerableProperty$g = createNonEnumerableProperty$i;
var defineBuiltIn$o = defineBuiltIn$p;
var defineGlobalProperty = defineGlobalProperty$3;
var copyConstructorProperties$3 = copyConstructorProperties$4;
var isForced$4 = isForced_1;

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global$S;
  } else if (STATIC) {
    target = global$S[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global$S[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor$9(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced$4(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties$3(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty$g(sourceProperty, 'sham', true);
    }
    defineBuiltIn$o(target, key, sourceProperty, options);
  }
};

var wellKnownSymbol$I = wellKnownSymbol$K;

var TO_STRING_TAG$9 = wellKnownSymbol$I('toStringTag');
var test$2 = {};

test$2[TO_STRING_TAG$9] = 'z';

var toStringTagSupport = String(test$2) === '[object z]';

var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;
var isCallable$t = isCallable$E;
var classofRaw = classofRaw$1;
var wellKnownSymbol$H = wellKnownSymbol$K;

var TO_STRING_TAG$8 = wellKnownSymbol$H('toStringTag');
var $Object$3 = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof$l = TO_STRING_TAG_SUPPORT$2 ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object$3(it), TO_STRING_TAG$8)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable$t(O.callee) ? 'Arguments' : result;
};

var classof$k = classof$l;

var $String$3 = String;

var toString$z = function (argument) {
  if (classof$k(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return $String$3(argument);
};

var objectDefineProperties = {};

var internalObjectKeys = objectKeysInternal;
var enumBugKeys$1 = enumBugKeys$3;

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es-x/no-object-keys -- safe
var objectKeys$6 = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys$1);
};

var DESCRIPTORS$C = descriptors;
var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
var definePropertyModule$9 = objectDefineProperty;
var anObject$1x = anObject$1A;
var toIndexedObject$g = toIndexedObject$k;
var objectKeys$5 = objectKeys$6;

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es-x/no-object-defineproperties -- safe
objectDefineProperties.f = DESCRIPTORS$C && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject$1x(O);
  var props = toIndexedObject$g(Properties);
  var keys = objectKeys$5(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule$9.f(O, key = keys[index++], props[key]);
  return O;
};

var getBuiltIn$H = getBuiltIn$L;

var html$2 = getBuiltIn$H('document', 'documentElement');

/* global ActiveXObject -- old IE, WSH */

var anObject$1w = anObject$1A;
var definePropertiesModule$1 = objectDefineProperties;
var enumBugKeys = enumBugKeys$3;
var hiddenKeys$2 = hiddenKeys$6;
var html$1 = html$2;
var documentCreateElement$1 = documentCreateElement$2;
var sharedKey$2 = sharedKey$4;

var GT = '>';
var LT = '<';
var PROTOTYPE$2 = 'prototype';
var SCRIPT = 'script';
var IE_PROTO$1 = sharedKey$2('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement$1('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html$1.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE$2][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys$2[IE_PROTO$1] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es-x/no-object-create -- safe
var objectCreate$1 = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE$2] = anObject$1w(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE$2] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule$1.f(result, Properties);
};

var objectGetOwnPropertyNamesExternal = {};

var toPropertyKey$6 = toPropertyKey$9;
var definePropertyModule$8 = objectDefineProperty;
var createPropertyDescriptor$9 = createPropertyDescriptor$c;

var createProperty$9 = function (object, key, value) {
  var propertyKey = toPropertyKey$6(key);
  if (propertyKey in object) definePropertyModule$8.f(object, propertyKey, createPropertyDescriptor$9(0, value));
  else object[propertyKey] = value;
};

var toAbsoluteIndex$9 = toAbsoluteIndex$b;
var lengthOfArrayLike$y = lengthOfArrayLike$A;
var createProperty$8 = createProperty$9;

var $Array$a = Array;
var max$8 = Math.max;

var arraySliceSimple = function (O, start, end) {
  var length = lengthOfArrayLike$y(O);
  var k = toAbsoluteIndex$9(start, length);
  var fin = toAbsoluteIndex$9(end === undefined ? length : end, length);
  var result = $Array$a(max$8(fin - k, 0));
  for (var n = 0; k < fin; k++, n++) createProperty$8(result, n, O[k]);
  result.length = n;
  return result;
};

/* eslint-disable es-x/no-object-getownpropertynames -- safe */

var classof$j = classofRaw$1;
var toIndexedObject$f = toIndexedObject$k;
var $getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
var arraySlice$d = arraySliceSimple;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames$1(it);
  } catch (error) {
    return arraySlice$d(windowNames);
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
objectGetOwnPropertyNamesExternal.f = function getOwnPropertyNames(it) {
  return windowNames && classof$j(it) == 'Window'
    ? getWindowNames(it)
    : $getOwnPropertyNames$1(toIndexedObject$f(it));
};

var wellKnownSymbolWrapped = {};

var wellKnownSymbol$G = wellKnownSymbol$K;

wellKnownSymbolWrapped.f = wellKnownSymbol$G;

var global$R = global$$;

var path$1 = global$R;

var path = path$1;
var hasOwn$t = hasOwnProperty_1;
var wrappedWellKnownSymbolModule$1 = wellKnownSymbolWrapped;
var defineProperty$g = objectDefineProperty.f;

var defineWellKnownSymbol$m = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!hasOwn$t(Symbol, NAME)) defineProperty$g(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule$1.f(NAME)
  });
};

var call$11 = functionCall;
var getBuiltIn$G = getBuiltIn$L;
var wellKnownSymbol$F = wellKnownSymbol$K;
var defineBuiltIn$n = defineBuiltIn$p;

var symbolDefineToPrimitive = function () {
  var Symbol = getBuiltIn$G('Symbol');
  var SymbolPrototype = Symbol && Symbol.prototype;
  var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
  var TO_PRIMITIVE = wellKnownSymbol$F('toPrimitive');

  if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
    // `Symbol.prototype[@@toPrimitive]` method
    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
    // eslint-disable-next-line no-unused-vars -- required for .length
    defineBuiltIn$n(SymbolPrototype, TO_PRIMITIVE, function (hint) {
      return call$11(valueOf, this);
    }, { arity: 1 });
  }
};

var defineProperty$f = objectDefineProperty.f;
var hasOwn$s = hasOwnProperty_1;
var wellKnownSymbol$E = wellKnownSymbol$K;

var TO_STRING_TAG$7 = wellKnownSymbol$E('toStringTag');

var setToStringTag$d = function (target, TAG, STATIC) {
  if (target && !STATIC) target = target.prototype;
  if (target && !hasOwn$s(target, TO_STRING_TAG$7)) {
    defineProperty$f(target, TO_STRING_TAG$7, { configurable: true, value: TAG });
  }
};

var uncurryThis$1j = functionUncurryThis;
var aCallable$V = aCallable$X;
var NATIVE_BIND$2 = functionBindNative;

var bind$u = uncurryThis$1j(uncurryThis$1j.bind);

// optional / simple context binding
var functionBindContext = function (fn, that) {
  aCallable$V(fn);
  return that === undefined ? fn : NATIVE_BIND$2 ? bind$u(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var classof$i = classofRaw$1;

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es-x/no-array-isarray -- safe
var isArray$8 = Array.isArray || function isArray(argument) {
  return classof$i(argument) == 'Array';
};

var uncurryThis$1i = functionUncurryThis;
var fails$1d = fails$1m;
var isCallable$s = isCallable$E;
var classof$h = classof$l;
var getBuiltIn$F = getBuiltIn$L;
var inspectSource$2 = inspectSource$5;

var noop = function () { /* empty */ };
var empty = [];
var construct$1 = getBuiltIn$F('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec$c = uncurryThis$1i(constructorRegExp.exec);
var INCORRECT_TO_STRING$2 = !constructorRegExp.exec(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable$s(argument)) return false;
  try {
    construct$1(noop, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable$s(argument)) return false;
  switch (classof$h(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING$2 || !!exec$c(constructorRegExp, inspectSource$2(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
var isConstructor$a = !construct$1 || fails$1d(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;

var isArray$7 = isArray$8;
var isConstructor$9 = isConstructor$a;
var isObject$w = isObject$C;
var wellKnownSymbol$D = wellKnownSymbol$K;

var SPECIES$6 = wellKnownSymbol$D('species');
var $Array$9 = Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesConstructor$1 = function (originalArray) {
  var C;
  if (isArray$7(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor$9(C) && (C === $Array$9 || isArray$7(C.prototype))) C = undefined;
    else if (isObject$w(C)) {
      C = C[SPECIES$6];
      if (C === null) C = undefined;
    }
  } return C === undefined ? $Array$9 : C;
};

var arraySpeciesConstructor = arraySpeciesConstructor$1;

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate$6 = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};

var bind$t = functionBindContext;
var uncurryThis$1h = functionUncurryThis;
var IndexedObject$6 = indexedObject;
var toObject$z = toObject$B;
var lengthOfArrayLike$x = lengthOfArrayLike$A;
var arraySpeciesCreate$5 = arraySpeciesCreate$6;

var push$l = uncurryThis$1h([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod$7 = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject$z($this);
    var self = IndexedObject$6(O);
    var boundFunction = bind$t(callbackfn, that);
    var length = lengthOfArrayLike$x(self);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate$5;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push$l(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push$l(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

var arrayIteration = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod$7(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod$7(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod$7(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod$7(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod$7(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod$7(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod$7(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod$7(7)
};

var $$4S = _export;
var global$Q = global$$;
var call$10 = functionCall;
var uncurryThis$1g = functionUncurryThis;
var DESCRIPTORS$B = descriptors;
var NATIVE_SYMBOL$4 = nativeSymbol;
var fails$1c = fails$1m;
var hasOwn$r = hasOwnProperty_1;
var isPrototypeOf$c = objectIsPrototypeOf;
var anObject$1v = anObject$1A;
var toIndexedObject$e = toIndexedObject$k;
var toPropertyKey$5 = toPropertyKey$9;
var $toString$3 = toString$z;
var createPropertyDescriptor$8 = createPropertyDescriptor$c;
var nativeObjectCreate = objectCreate$1;
var objectKeys$4 = objectKeys$6;
var getOwnPropertyNamesModule$1 = objectGetOwnPropertyNames;
var getOwnPropertyNamesExternal = objectGetOwnPropertyNamesExternal;
var getOwnPropertySymbolsModule$2 = objectGetOwnPropertySymbols;
var getOwnPropertyDescriptorModule$5 = objectGetOwnPropertyDescriptor;
var definePropertyModule$7 = objectDefineProperty;
var definePropertiesModule = objectDefineProperties;
var propertyIsEnumerableModule$1 = objectPropertyIsEnumerable;
var defineBuiltIn$m = defineBuiltIn$p;
var shared$5 = shared$9.exports;
var sharedKey$1 = sharedKey$4;
var hiddenKeys$1 = hiddenKeys$6;
var uid$3 = uid$6;
var wellKnownSymbol$C = wellKnownSymbol$K;
var wrappedWellKnownSymbolModule = wellKnownSymbolWrapped;
var defineWellKnownSymbol$l = defineWellKnownSymbol$m;
var defineSymbolToPrimitive$1 = symbolDefineToPrimitive;
var setToStringTag$c = setToStringTag$d;
var InternalStateModule$k = internalState;
var $forEach$3 = arrayIteration.forEach;

var HIDDEN = sharedKey$1('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE$1 = 'prototype';

var setInternalState$j = InternalStateModule$k.set;
var getInternalState$h = InternalStateModule$k.getterFor(SYMBOL);

var ObjectPrototype$4 = Object[PROTOTYPE$1];
var $Symbol = global$Q.Symbol;
var SymbolPrototype$1 = $Symbol && $Symbol[PROTOTYPE$1];
var TypeError$7 = global$Q.TypeError;
var QObject = global$Q.QObject;
var nativeGetOwnPropertyDescriptor$2 = getOwnPropertyDescriptorModule$5.f;
var nativeDefineProperty$1 = definePropertyModule$7.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule$1.f;
var push$k = uncurryThis$1g([].push);

var AllSymbols = shared$5('symbols');
var ObjectPrototypeSymbols = shared$5('op-symbols');
var WellKnownSymbolsStore = shared$5('wks');

// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS$B && fails$1c(function () {
  return nativeObjectCreate(nativeDefineProperty$1({}, 'a', {
    get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$2(ObjectPrototype$4, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype$4[P];
  nativeDefineProperty$1(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype$4) {
    nativeDefineProperty$1(ObjectPrototype$4, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty$1;

var wrap$1 = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype$1);
  setInternalState$j(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS$B) symbol.description = description;
  return symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype$4) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject$1v(O);
  var key = toPropertyKey$5(P);
  anObject$1v(Attributes);
  if (hasOwn$r(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!hasOwn$r(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor$8(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (hasOwn$r(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor$8(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty$1(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject$1v(O);
  var properties = toIndexedObject$e(Properties);
  var keys = objectKeys$4(properties).concat($getOwnPropertySymbols(properties));
  $forEach$3(keys, function (key) {
    if (!DESCRIPTORS$B || call$10($propertyIsEnumerable$1, properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable$1 = function propertyIsEnumerable(V) {
  var P = toPropertyKey$5(V);
  var enumerable = call$10(nativePropertyIsEnumerable, this, P);
  if (this === ObjectPrototype$4 && hasOwn$r(AllSymbols, P) && !hasOwn$r(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !hasOwn$r(this, P) || !hasOwn$r(AllSymbols, P) || hasOwn$r(this, HIDDEN) && this[HIDDEN][P]
    ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject$e(O);
  var key = toPropertyKey$5(P);
  if (it === ObjectPrototype$4 && hasOwn$r(AllSymbols, key) && !hasOwn$r(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor$2(it, key);
  if (descriptor && hasOwn$r(AllSymbols, key) && !(hasOwn$r(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject$e(O));
  var result = [];
  $forEach$3(names, function (key) {
    if (!hasOwn$r(AllSymbols, key) && !hasOwn$r(hiddenKeys$1, key)) push$k(result, key);
  });
  return result;
};

var $getOwnPropertySymbols = function (O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$4;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject$e(O));
  var result = [];
  $forEach$3(names, function (key) {
    if (hasOwn$r(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn$r(ObjectPrototype$4, key))) {
      push$k(result, AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL$4) {
  $Symbol = function Symbol() {
    if (isPrototypeOf$c(SymbolPrototype$1, this)) throw TypeError$7('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : $toString$3(arguments[0]);
    var tag = uid$3(description);
    var setter = function (value) {
      if (this === ObjectPrototype$4) call$10(setter, ObjectPrototypeSymbols, value);
      if (hasOwn$r(this, HIDDEN) && hasOwn$r(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor$8(1, value));
    };
    if (DESCRIPTORS$B && USE_SETTER) setSymbolDescriptor(ObjectPrototype$4, tag, { configurable: true, set: setter });
    return wrap$1(tag, description);
  };

  SymbolPrototype$1 = $Symbol[PROTOTYPE$1];

  defineBuiltIn$m(SymbolPrototype$1, 'toString', function toString() {
    return getInternalState$h(this).tag;
  });

  defineBuiltIn$m($Symbol, 'withoutSetter', function (description) {
    return wrap$1(uid$3(description), description);
  });

  propertyIsEnumerableModule$1.f = $propertyIsEnumerable$1;
  definePropertyModule$7.f = $defineProperty;
  definePropertiesModule.f = $defineProperties;
  getOwnPropertyDescriptorModule$5.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule$1.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule$2.f = $getOwnPropertySymbols;

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap$1(wellKnownSymbol$C(name), name);
  };

  if (DESCRIPTORS$B) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty$1(SymbolPrototype$1, 'description', {
      configurable: true,
      get: function description() {
        return getInternalState$h(this).description;
      }
    });
    {
      defineBuiltIn$m(ObjectPrototype$4, 'propertyIsEnumerable', $propertyIsEnumerable$1, { unsafe: true });
    }
  }
}

$$4S({ global: true, constructor: true, wrap: true, forced: !NATIVE_SYMBOL$4, sham: !NATIVE_SYMBOL$4 }, {
  Symbol: $Symbol
});

$forEach$3(objectKeys$4(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol$l(name);
});

$$4S({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL$4 }, {
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$$4S({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL$4, sham: !DESCRIPTORS$B }, {
  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$$4S({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL$4 }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames
});

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
defineSymbolToPrimitive$1();

// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag$c($Symbol, SYMBOL);

hiddenKeys$1[HIDDEN] = true;

var NATIVE_SYMBOL$3 = nativeSymbol;

/* eslint-disable es-x/no-symbol -- safe */
var nativeSymbolRegistry = NATIVE_SYMBOL$3 && !!Symbol['for'] && !!Symbol.keyFor;

var $$4R = _export;
var getBuiltIn$E = getBuiltIn$L;
var hasOwn$q = hasOwnProperty_1;
var toString$y = toString$z;
var shared$4 = shared$9.exports;
var NATIVE_SYMBOL_REGISTRY$1 = nativeSymbolRegistry;

var StringToSymbolRegistry = shared$4('string-to-symbol-registry');
var SymbolToStringRegistry$1 = shared$4('symbol-to-string-registry');

// `Symbol.for` method
// https://tc39.es/ecma262/#sec-symbol.for
$$4R({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY$1 }, {
  'for': function (key) {
    var string = toString$y(key);
    if (hasOwn$q(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = getBuiltIn$E('Symbol')(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry$1[symbol] = string;
    return symbol;
  }
});

var $$4Q = _export;
var hasOwn$p = hasOwnProperty_1;
var isSymbol$4 = isSymbol$7;
var tryToString$5 = tryToString$7;
var shared$3 = shared$9.exports;
var NATIVE_SYMBOL_REGISTRY = nativeSymbolRegistry;

var SymbolToStringRegistry = shared$3('symbol-to-string-registry');

// `Symbol.keyFor` method
// https://tc39.es/ecma262/#sec-symbol.keyfor
$$4Q({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
  keyFor: function keyFor(sym) {
    if (!isSymbol$4(sym)) throw TypeError(tryToString$5(sym) + ' is not a symbol');
    if (hasOwn$p(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  }
});

var NATIVE_BIND$1 = functionBindNative;

var FunctionPrototype$2 = Function.prototype;
var apply$q = FunctionPrototype$2.apply;
var call$$ = FunctionPrototype$2.call;

// eslint-disable-next-line es-x/no-reflect -- safe
var functionApply$1 = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND$1 ? call$$.bind(apply$q) : function () {
  return call$$.apply(apply$q, arguments);
});

var uncurryThis$1f = functionUncurryThis;

var arraySlice$c = uncurryThis$1f([].slice);

var $$4P = _export;
var getBuiltIn$D = getBuiltIn$L;
var apply$p = functionApply$1;
var call$_ = functionCall;
var uncurryThis$1e = functionUncurryThis;
var fails$1b = fails$1m;
var isArray$6 = isArray$8;
var isCallable$r = isCallable$E;
var isObject$v = isObject$C;
var isSymbol$3 = isSymbol$7;
var arraySlice$b = arraySlice$c;
var NATIVE_SYMBOL$2 = nativeSymbol;

var $stringify = getBuiltIn$D('JSON', 'stringify');
var exec$b = uncurryThis$1e(/./.exec);
var charAt$h = uncurryThis$1e(''.charAt);
var charCodeAt$5 = uncurryThis$1e(''.charCodeAt);
var replace$b = uncurryThis$1e(''.replace);
var numberToString$3 = uncurryThis$1e(1.0.toString);

var tester = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;

var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL$2 || fails$1b(function () {
  var symbol = getBuiltIn$D('Symbol')();
  // MS Edge converts symbol values to JSON as {}
  return $stringify([symbol]) != '[null]'
    // WebKit converts symbol values to JSON as null
    || $stringify({ a: symbol }) != '{}'
    // V8 throws on boxed symbols
    || $stringify(Object(symbol)) != '{}';
});

// https://github.com/tc39/proposal-well-formed-stringify
var ILL_FORMED_UNICODE = fails$1b(function () {
  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
    || $stringify('\uDEAD') !== '"\\udead"';
});

var stringifyWithSymbolsFix = function (it, replacer) {
  var args = arraySlice$b(arguments);
  var $replacer = replacer;
  if (!isObject$v(replacer) && it === undefined || isSymbol$3(it)) return; // IE8 returns string on undefined
  if (!isArray$6(replacer)) replacer = function (key, value) {
    if (isCallable$r($replacer)) value = call$_($replacer, this, key, value);
    if (!isSymbol$3(value)) return value;
  };
  args[1] = replacer;
  return apply$p($stringify, null, args);
};

var fixIllFormed = function (match, offset, string) {
  var prev = charAt$h(string, offset - 1);
  var next = charAt$h(string, offset + 1);
  if ((exec$b(low, match) && !exec$b(hi, next)) || (exec$b(hi, match) && !exec$b(low, prev))) {
    return '\\u' + numberToString$3(charCodeAt$5(match, 0), 16);
  } return match;
};

if ($stringify) {
  // `JSON.stringify` method
  // https://tc39.es/ecma262/#sec-json.stringify
  $$4P({ target: 'JSON', stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = arraySlice$b(arguments);
      var result = apply$p(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace$b(result, tester, fixIllFormed) : result;
    }
  });
}

var $$4O = _export;
var NATIVE_SYMBOL$1 = nativeSymbol;
var fails$1a = fails$1m;
var getOwnPropertySymbolsModule$1 = objectGetOwnPropertySymbols;
var toObject$y = toObject$B;

// V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FORCED$r = !NATIVE_SYMBOL$1 || fails$1a(function () { getOwnPropertySymbolsModule$1.f(1); });

// `Object.getOwnPropertySymbols` method
// https://tc39.es/ecma262/#sec-object.getownpropertysymbols
$$4O({ target: 'Object', stat: true, forced: FORCED$r }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    var $getOwnPropertySymbols = getOwnPropertySymbolsModule$1.f;
    return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject$y(it)) : [];
  }
});

var $$4N = _export;
var DESCRIPTORS$A = descriptors;
var global$P = global$$;
var uncurryThis$1d = functionUncurryThis;
var hasOwn$o = hasOwnProperty_1;
var isCallable$q = isCallable$E;
var isPrototypeOf$b = objectIsPrototypeOf;
var toString$x = toString$z;
var defineProperty$e = objectDefineProperty.f;
var copyConstructorProperties$2 = copyConstructorProperties$4;

var NativeSymbol = global$P.Symbol;
var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

if (DESCRIPTORS$A && isCallable$q(NativeSymbol) && (!('description' in SymbolPrototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString$x(arguments[0]);
    var result = isPrototypeOf$b(SymbolPrototype, this)
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };

  copyConstructorProperties$2(SymbolWrapper, NativeSymbol);
  SymbolWrapper.prototype = SymbolPrototype;
  SymbolPrototype.constructor = SymbolWrapper;

  var NATIVE_SYMBOL = String(NativeSymbol('test')) == 'Symbol(test)';
  var symbolToString = uncurryThis$1d(SymbolPrototype.toString);
  var symbolValueOf = uncurryThis$1d(SymbolPrototype.valueOf);
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  var replace$a = uncurryThis$1d(''.replace);
  var stringSlice$g = uncurryThis$1d(''.slice);

  defineProperty$e(SymbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = symbolValueOf(this);
      var string = symbolToString(symbol);
      if (hasOwn$o(EmptyStringDescriptionStore, symbol)) return '';
      var desc = NATIVE_SYMBOL ? stringSlice$g(string, 7, -1) : replace$a(string, regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $$4N({ global: true, constructor: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}

var defineWellKnownSymbol$k = defineWellKnownSymbol$m;

// `Symbol.asyncIterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.asynciterator
defineWellKnownSymbol$k('asyncIterator');

var defineWellKnownSymbol$j = defineWellKnownSymbol$m;

// `Symbol.hasInstance` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.hasinstance
defineWellKnownSymbol$j('hasInstance');

var defineWellKnownSymbol$i = defineWellKnownSymbol$m;

// `Symbol.isConcatSpreadable` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.isconcatspreadable
defineWellKnownSymbol$i('isConcatSpreadable');

var defineWellKnownSymbol$h = defineWellKnownSymbol$m;

// `Symbol.iterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.iterator
defineWellKnownSymbol$h('iterator');

var defineWellKnownSymbol$g = defineWellKnownSymbol$m;

// `Symbol.match` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.match
defineWellKnownSymbol$g('match');

var defineWellKnownSymbol$f = defineWellKnownSymbol$m;

// `Symbol.matchAll` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.matchall
defineWellKnownSymbol$f('matchAll');

var defineWellKnownSymbol$e = defineWellKnownSymbol$m;

// `Symbol.replace` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.replace
defineWellKnownSymbol$e('replace');

var defineWellKnownSymbol$d = defineWellKnownSymbol$m;

// `Symbol.search` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.search
defineWellKnownSymbol$d('search');

var defineWellKnownSymbol$c = defineWellKnownSymbol$m;

// `Symbol.species` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.species
defineWellKnownSymbol$c('species');

var defineWellKnownSymbol$b = defineWellKnownSymbol$m;

// `Symbol.split` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.split
defineWellKnownSymbol$b('split');

var defineWellKnownSymbol$a = defineWellKnownSymbol$m;
var defineSymbolToPrimitive = symbolDefineToPrimitive;

// `Symbol.toPrimitive` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.toprimitive
defineWellKnownSymbol$a('toPrimitive');

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
defineSymbolToPrimitive();

var getBuiltIn$C = getBuiltIn$L;
var defineWellKnownSymbol$9 = defineWellKnownSymbol$m;
var setToStringTag$b = setToStringTag$d;

// `Symbol.toStringTag` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.tostringtag
defineWellKnownSymbol$9('toStringTag');

// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag$b(getBuiltIn$C('Symbol'), 'Symbol');

var defineWellKnownSymbol$8 = defineWellKnownSymbol$m;

// `Symbol.unscopables` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.unscopables
defineWellKnownSymbol$8('unscopables');

var isCallable$p = isCallable$E;

var $String$2 = String;
var $TypeError$t = TypeError;

var aPossiblePrototype$2 = function (argument) {
  if (typeof argument == 'object' || isCallable$p(argument)) return argument;
  throw $TypeError$t("Can't set " + $String$2(argument) + ' as a prototype');
};

/* eslint-disable no-proto -- safe */

var uncurryThis$1c = functionUncurryThis;
var anObject$1u = anObject$1A;
var aPossiblePrototype$1 = aPossiblePrototype$2;

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es-x/no-object-setprototypeof -- safe
var objectSetPrototypeOf$1 = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
    setter = uncurryThis$1c(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject$1u(O);
    aPossiblePrototype$1(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

var defineProperty$d = objectDefineProperty.f;

var proxyAccessor$2 = function (Target, Source, key) {
  key in Target || defineProperty$d(Target, key, {
    configurable: true,
    get: function () { return Source[key]; },
    set: function (it) { Source[key] = it; }
  });
};

var isCallable$o = isCallable$E;
var isObject$u = isObject$C;
var setPrototypeOf$8 = objectSetPrototypeOf$1;

// makes subclassing work correct for wrapped built-ins
var inheritIfRequired$6 = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf$8 &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable$o(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject$u(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf$8($this, NewTargetPrototype);
  return $this;
};

var toString$w = toString$z;

var normalizeStringArgument$5 = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString$w(argument);
};

var isObject$t = isObject$C;
var createNonEnumerableProperty$f = createNonEnumerableProperty$i;

// `InstallErrorCause` abstract operation
// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
var installErrorCause$2 = function (O, options) {
  if (isObject$t(options) && 'cause' in options) {
    createNonEnumerableProperty$f(O, 'cause', options.cause);
  }
};

var uncurryThis$1b = functionUncurryThis;

var $Error$1 = Error;
var replace$9 = uncurryThis$1b(''.replace);

var TEST = (function (arg) { return String($Error$1(arg).stack); })('zxcasd');
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

var clearErrorStack$4 = function (stack, dropEntries) {
  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error$1.prepareStackTrace) {
    while (dropEntries--) stack = replace$9(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  } return stack;
};

var fails$19 = fails$1m;
var createPropertyDescriptor$7 = createPropertyDescriptor$c;

var errorStackInstallable = !fails$19(function () {
  var error = Error('a');
  if (!('stack' in error)) return true;
  // eslint-disable-next-line es-x/no-object-defineproperty -- safe
  Object.defineProperty(error, 'stack', createPropertyDescriptor$7(1, 7));
  return error.stack !== 7;
});

var getBuiltIn$B = getBuiltIn$L;
var hasOwn$n = hasOwnProperty_1;
var createNonEnumerableProperty$e = createNonEnumerableProperty$i;
var isPrototypeOf$a = objectIsPrototypeOf;
var setPrototypeOf$7 = objectSetPrototypeOf$1;
var copyConstructorProperties$1 = copyConstructorProperties$4;
var proxyAccessor$1 = proxyAccessor$2;
var inheritIfRequired$5 = inheritIfRequired$6;
var normalizeStringArgument$4 = normalizeStringArgument$5;
var installErrorCause$1 = installErrorCause$2;
var clearErrorStack$3 = clearErrorStack$4;
var ERROR_STACK_INSTALLABLE$2 = errorStackInstallable;
var DESCRIPTORS$z = descriptors;

var wrapErrorConstructorWithCause$2 = function (FULL_NAME, wrapper, FORCED, IS_AGGREGATE_ERROR) {
  var STACK_TRACE_LIMIT = 'stackTraceLimit';
  var OPTIONS_POSITION = IS_AGGREGATE_ERROR ? 2 : 1;
  var path = FULL_NAME.split('.');
  var ERROR_NAME = path[path.length - 1];
  var OriginalError = getBuiltIn$B.apply(null, path);

  if (!OriginalError) return;

  var OriginalErrorPrototype = OriginalError.prototype;

  // V8 9.3- bug https://bugs.chromium.org/p/v8/issues/detail?id=12006
  if (hasOwn$n(OriginalErrorPrototype, 'cause')) delete OriginalErrorPrototype.cause;

  if (!FORCED) return OriginalError;

  var BaseError = getBuiltIn$B('Error');

  var WrappedError = wrapper(function (a, b) {
    var message = normalizeStringArgument$4(IS_AGGREGATE_ERROR ? b : a, undefined);
    var result = IS_AGGREGATE_ERROR ? new OriginalError(a) : new OriginalError();
    if (message !== undefined) createNonEnumerableProperty$e(result, 'message', message);
    if (ERROR_STACK_INSTALLABLE$2) createNonEnumerableProperty$e(result, 'stack', clearErrorStack$3(result.stack, 2));
    if (this && isPrototypeOf$a(OriginalErrorPrototype, this)) inheritIfRequired$5(result, this, WrappedError);
    if (arguments.length > OPTIONS_POSITION) installErrorCause$1(result, arguments[OPTIONS_POSITION]);
    return result;
  });

  WrappedError.prototype = OriginalErrorPrototype;

  if (ERROR_NAME !== 'Error') {
    if (setPrototypeOf$7) setPrototypeOf$7(WrappedError, BaseError);
    else copyConstructorProperties$1(WrappedError, BaseError, { name: true });
  } else if (DESCRIPTORS$z && STACK_TRACE_LIMIT in OriginalError) {
    proxyAccessor$1(WrappedError, OriginalError, STACK_TRACE_LIMIT);
    proxyAccessor$1(WrappedError, OriginalError, 'prepareStackTrace');
  }

  copyConstructorProperties$1(WrappedError, OriginalError);

  try {
    // Safari 13- bug: WebAssembly errors does not have a proper `.name`
    if (OriginalErrorPrototype.name !== ERROR_NAME) {
      createNonEnumerableProperty$e(OriginalErrorPrototype, 'name', ERROR_NAME);
    }
    OriginalErrorPrototype.constructor = WrappedError;
  } catch (error) { /* empty */ }

  return WrappedError;
};

/* eslint-disable no-unused-vars -- required for functions `.length` */

var $$4M = _export;
var global$O = global$$;
var apply$o = functionApply$1;
var wrapErrorConstructorWithCause$1 = wrapErrorConstructorWithCause$2;

var WEB_ASSEMBLY = 'WebAssembly';
var WebAssembly$1 = global$O[WEB_ASSEMBLY];

var FORCED$q = Error('e', { cause: 7 }).cause !== 7;

var exportGlobalErrorCauseWrapper = function (ERROR_NAME, wrapper) {
  var O = {};
  O[ERROR_NAME] = wrapErrorConstructorWithCause$1(ERROR_NAME, wrapper, FORCED$q);
  $$4M({ global: true, constructor: true, arity: 1, forced: FORCED$q }, O);
};

var exportWebAssemblyErrorCauseWrapper = function (ERROR_NAME, wrapper) {
  if (WebAssembly$1 && WebAssembly$1[ERROR_NAME]) {
    var O = {};
    O[ERROR_NAME] = wrapErrorConstructorWithCause$1(WEB_ASSEMBLY + '.' + ERROR_NAME, wrapper, FORCED$q);
    $$4M({ target: WEB_ASSEMBLY, stat: true, constructor: true, arity: 1, forced: FORCED$q }, O);
  }
};

// https://github.com/tc39/proposal-error-cause
exportGlobalErrorCauseWrapper('Error', function (init) {
  return function Error(message) { return apply$o(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('EvalError', function (init) {
  return function EvalError(message) { return apply$o(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('RangeError', function (init) {
  return function RangeError(message) { return apply$o(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('ReferenceError', function (init) {
  return function ReferenceError(message) { return apply$o(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('SyntaxError', function (init) {
  return function SyntaxError(message) { return apply$o(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('TypeError', function (init) {
  return function TypeError(message) { return apply$o(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('URIError', function (init) {
  return function URIError(message) { return apply$o(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('CompileError', function (init) {
  return function CompileError(message) { return apply$o(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('LinkError', function (init) {
  return function LinkError(message) { return apply$o(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('RuntimeError', function (init) {
  return function RuntimeError(message) { return apply$o(init, this, arguments); };
});

var DESCRIPTORS$y = descriptors;
var fails$18 = fails$1m;
var anObject$1t = anObject$1A;
var create$f = objectCreate$1;
var normalizeStringArgument$3 = normalizeStringArgument$5;

var nativeErrorToString = Error.prototype.toString;

var INCORRECT_TO_STRING$1 = fails$18(function () {
  if (DESCRIPTORS$y) {
    // Chrome 32- incorrectly call accessor
    // eslint-disable-next-line es-x/no-object-defineproperty -- safe
    var object = create$f(Object.defineProperty({}, 'name', { get: function () {
      return this === object;
    } }));
    if (nativeErrorToString.call(object) !== 'true') return true;
  }
  // FF10- does not properly handle non-strings
  return nativeErrorToString.call({ message: 1, name: 2 }) !== '2: 1'
    // IE8 does not properly handle defaults
    || nativeErrorToString.call({}) !== 'Error';
});

var errorToString$2 = INCORRECT_TO_STRING$1 ? function toString() {
  var O = anObject$1t(this);
  var name = normalizeStringArgument$3(O.name, 'Error');
  var message = normalizeStringArgument$3(O.message);
  return !name ? message : !message ? name : name + ': ' + message;
} : nativeErrorToString;

var defineBuiltIn$l = defineBuiltIn$p;
var errorToString$1 = errorToString$2;

var ErrorPrototype$1 = Error.prototype;

// `Error.prototype.toString` method fix
// https://tc39.es/ecma262/#sec-error.prototype.tostring
if (ErrorPrototype$1.toString !== errorToString$1) {
  defineBuiltIn$l(ErrorPrototype$1, 'toString', errorToString$1);
}

var fails$17 = fails$1m;

var correctPrototypeGetter = !fails$17(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es-x/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

var hasOwn$m = hasOwnProperty_1;
var isCallable$n = isCallable$E;
var toObject$x = toObject$B;
var sharedKey = sharedKey$4;
var CORRECT_PROTOTYPE_GETTER$2 = correctPrototypeGetter;

var IE_PROTO = sharedKey('IE_PROTO');
var $Object$2 = Object;
var ObjectPrototype$3 = $Object$2.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es-x/no-object-getprototypeof -- safe
var objectGetPrototypeOf$1 = CORRECT_PROTOTYPE_GETTER$2 ? $Object$2.getPrototypeOf : function (O) {
  var object = toObject$x(O);
  if (hasOwn$m(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable$n(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object$2 ? ObjectPrototype$3 : null;
};

var iterators = {};

var wellKnownSymbol$B = wellKnownSymbol$K;
var Iterators$4 = iterators;

var ITERATOR$a = wellKnownSymbol$B('iterator');
var ArrayPrototype$2 = Array.prototype;

// check on default Array iterator
var isArrayIteratorMethod$3 = function (it) {
  return it !== undefined && (Iterators$4.Array === it || ArrayPrototype$2[ITERATOR$a] === it);
};

var classof$g = classof$l;
var getMethod$g = getMethod$i;
var Iterators$3 = iterators;
var wellKnownSymbol$A = wellKnownSymbol$K;

var ITERATOR$9 = wellKnownSymbol$A('iterator');

var getIteratorMethod$9 = function (it) {
  if (it != undefined) return getMethod$g(it, ITERATOR$9)
    || getMethod$g(it, '@@iterator')
    || Iterators$3[classof$g(it)];
};

var call$Z = functionCall;
var aCallable$U = aCallable$X;
var anObject$1s = anObject$1A;
var tryToString$4 = tryToString$7;
var getIteratorMethod$8 = getIteratorMethod$9;

var $TypeError$s = TypeError;

var getIterator$b = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod$8(argument) : usingIterator;
  if (aCallable$U(iteratorMethod)) return anObject$1s(call$Z(iteratorMethod, argument));
  throw $TypeError$s(tryToString$4(argument) + ' is not iterable');
};

var call$Y = functionCall;
var anObject$1r = anObject$1A;
var getMethod$f = getMethod$i;

var iteratorClose$4 = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject$1r(iterator);
  try {
    innerResult = getMethod$f(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call$Y(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject$1r(innerResult);
  return value;
};

var bind$s = functionBindContext;
var call$X = functionCall;
var anObject$1q = anObject$1A;
var tryToString$3 = tryToString$7;
var isArrayIteratorMethod$2 = isArrayIteratorMethod$3;
var lengthOfArrayLike$w = lengthOfArrayLike$A;
var isPrototypeOf$9 = objectIsPrototypeOf;
var getIterator$a = getIterator$b;
var getIteratorMethod$7 = getIteratorMethod$9;
var iteratorClose$3 = iteratorClose$4;

var $TypeError$r = TypeError;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var ResultPrototype = Result.prototype;

var iterate$J = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_RECORD = !!(options && options.IS_RECORD);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind$s(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose$3(iterator, 'normal', condition);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject$1q(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_RECORD) {
    iterator = iterable.iterator;
  } else if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod$7(iterable);
    if (!iterFn) throw $TypeError$r(tryToString$3(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod$2(iterFn)) {
      for (index = 0, length = lengthOfArrayLike$w(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf$9(ResultPrototype, result)) return result;
      } return new Result(false);
    }
    iterator = getIterator$a(iterable, iterFn);
  }

  next = IS_RECORD ? iterable.next : iterator.next;
  while (!(step = call$X(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose$3(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && isPrototypeOf$9(ResultPrototype, result)) return result;
  } return new Result(false);
};

var $$4L = _export;
var isPrototypeOf$8 = objectIsPrototypeOf;
var getPrototypeOf$d = objectGetPrototypeOf$1;
var setPrototypeOf$6 = objectSetPrototypeOf$1;
var copyConstructorProperties = copyConstructorProperties$4;
var create$e = objectCreate$1;
var createNonEnumerableProperty$d = createNonEnumerableProperty$i;
var createPropertyDescriptor$6 = createPropertyDescriptor$c;
var clearErrorStack$2 = clearErrorStack$4;
var installErrorCause = installErrorCause$2;
var iterate$I = iterate$J;
var normalizeStringArgument$2 = normalizeStringArgument$5;
var wellKnownSymbol$z = wellKnownSymbol$K;
var ERROR_STACK_INSTALLABLE$1 = errorStackInstallable;

var TO_STRING_TAG$6 = wellKnownSymbol$z('toStringTag');
var $Error = Error;
var push$j = [].push;

var $AggregateError$1 = function AggregateError(errors, message /* , options */) {
  var options = arguments.length > 2 ? arguments[2] : undefined;
  var isInstance = isPrototypeOf$8(AggregateErrorPrototype, this);
  var that;
  if (setPrototypeOf$6) {
    that = setPrototypeOf$6(new $Error(), isInstance ? getPrototypeOf$d(this) : AggregateErrorPrototype);
  } else {
    that = isInstance ? this : create$e(AggregateErrorPrototype);
    createNonEnumerableProperty$d(that, TO_STRING_TAG$6, 'Error');
  }
  if (message !== undefined) createNonEnumerableProperty$d(that, 'message', normalizeStringArgument$2(message));
  if (ERROR_STACK_INSTALLABLE$1) createNonEnumerableProperty$d(that, 'stack', clearErrorStack$2(that.stack, 1));
  installErrorCause(that, options);
  var errorsArray = [];
  iterate$I(errors, push$j, { that: errorsArray });
  createNonEnumerableProperty$d(that, 'errors', errorsArray);
  return that;
};

if (setPrototypeOf$6) setPrototypeOf$6($AggregateError$1, $Error);
else copyConstructorProperties($AggregateError$1, $Error, { name: true });

var AggregateErrorPrototype = $AggregateError$1.prototype = create$e($Error.prototype, {
  constructor: createPropertyDescriptor$6(1, $AggregateError$1),
  message: createPropertyDescriptor$6(1, ''),
  name: createPropertyDescriptor$6(1, 'AggregateError')
});

// `AggregateError` constructor
// https://tc39.es/ecma262/#sec-aggregate-error-constructor
$$4L({ global: true, constructor: true, arity: 2 }, {
  AggregateError: $AggregateError$1
});

var $$4K = _export;
var getBuiltIn$A = getBuiltIn$L;
var apply$n = functionApply$1;
var fails$16 = fails$1m;
var wrapErrorConstructorWithCause = wrapErrorConstructorWithCause$2;

var AGGREGATE_ERROR = 'AggregateError';
var $AggregateError = getBuiltIn$A(AGGREGATE_ERROR);
var FORCED$p = !fails$16(function () {
  return $AggregateError([1]).errors[0] !== 1;
}) && fails$16(function () {
  return $AggregateError([1], AGGREGATE_ERROR, { cause: 7 }).cause !== 7;
});

// https://github.com/tc39/proposal-error-cause
$$4K({ global: true, constructor: true, arity: 2, forced: FORCED$p }, {
  AggregateError: wrapErrorConstructorWithCause(AGGREGATE_ERROR, function (init) {
    // eslint-disable-next-line no-unused-vars -- required for functions `.length`
    return function AggregateError(errors, message) { return apply$n(init, this, arguments); };
  }, FORCED$p, true)
});

var wellKnownSymbol$y = wellKnownSymbol$K;
var create$d = objectCreate$1;
var defineProperty$c = objectDefineProperty.f;

var UNSCOPABLES = wellKnownSymbol$y('unscopables');
var ArrayPrototype$1 = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
  defineProperty$c(ArrayPrototype$1, UNSCOPABLES, {
    configurable: true,
    value: create$d(null)
  });
}

// add a key to Array.prototype[@@unscopables]
var addToUnscopables$n = function (key) {
  ArrayPrototype$1[UNSCOPABLES][key] = true;
};

var $$4J = _export;
var toObject$w = toObject$B;
var lengthOfArrayLike$v = lengthOfArrayLike$A;
var toIntegerOrInfinity$l = toIntegerOrInfinity$o;
var addToUnscopables$m = addToUnscopables$n;

// `Array.prototype.at` method
// https://github.com/tc39/proposal-relative-indexing-method
$$4J({ target: 'Array', proto: true }, {
  at: function at(index) {
    var O = toObject$w(this);
    var len = lengthOfArrayLike$v(O);
    var relativeIndex = toIntegerOrInfinity$l(index);
    var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
    return (k < 0 || k >= len) ? undefined : O[k];
  }
});

addToUnscopables$m('at');

var $TypeError$q = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

var doesNotExceedSafeInteger$7 = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError$q('Maximum allowed index exceeded');
  return it;
};

var fails$15 = fails$1m;
var wellKnownSymbol$x = wellKnownSymbol$K;
var V8_VERSION$2 = engineV8Version;

var SPECIES$5 = wellKnownSymbol$x('species');

var arrayMethodHasSpeciesSupport$5 = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION$2 >= 51 || !fails$15(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES$5] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

var $$4I = _export;
var fails$14 = fails$1m;
var isArray$5 = isArray$8;
var isObject$s = isObject$C;
var toObject$v = toObject$B;
var lengthOfArrayLike$u = lengthOfArrayLike$A;
var doesNotExceedSafeInteger$6 = doesNotExceedSafeInteger$7;
var createProperty$7 = createProperty$9;
var arraySpeciesCreate$4 = arraySpeciesCreate$6;
var arrayMethodHasSpeciesSupport$4 = arrayMethodHasSpeciesSupport$5;
var wellKnownSymbol$w = wellKnownSymbol$K;
var V8_VERSION$1 = engineV8Version;

var IS_CONCAT_SPREADABLE = wellKnownSymbol$w('isConcatSpreadable');

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION$1 >= 51 || !fails$14(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport$4('concat');

var isConcatSpreadable = function (O) {
  if (!isObject$s(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray$5(O);
};

var FORCED$o = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$$4I({ target: 'Array', proto: true, arity: 1, forced: FORCED$o }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  concat: function concat(arg) {
    var O = toObject$v(this);
    var A = arraySpeciesCreate$4(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = lengthOfArrayLike$u(E);
        doesNotExceedSafeInteger$6(n + len);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty$7(A, n, E[k]);
      } else {
        doesNotExceedSafeInteger$6(n + 1);
        createProperty$7(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

var tryToString$2 = tryToString$7;

var $TypeError$p = TypeError;

var deletePropertyOrThrow$4 = function (O, P) {
  if (!delete O[P]) throw $TypeError$p('Cannot delete property ' + tryToString$2(P) + ' of ' + tryToString$2(O));
};

var toObject$u = toObject$B;
var toAbsoluteIndex$8 = toAbsoluteIndex$b;
var lengthOfArrayLike$t = lengthOfArrayLike$A;
var deletePropertyOrThrow$3 = deletePropertyOrThrow$4;

var min$a = Math.min;

// `Array.prototype.copyWithin` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.copywithin
// eslint-disable-next-line es-x/no-array-prototype-copywithin -- safe
var arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject$u(this);
  var len = lengthOfArrayLike$t(O);
  var to = toAbsoluteIndex$8(target, len);
  var from = toAbsoluteIndex$8(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = min$a((end === undefined ? len : toAbsoluteIndex$8(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else deletePropertyOrThrow$3(O, to);
    to += inc;
    from += inc;
  } return O;
};

var $$4H = _export;
var copyWithin = arrayCopyWithin;
var addToUnscopables$l = addToUnscopables$n;

// `Array.prototype.copyWithin` method
// https://tc39.es/ecma262/#sec-array.prototype.copywithin
$$4H({ target: 'Array', proto: true }, {
  copyWithin: copyWithin
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables$l('copyWithin');

var fails$13 = fails$1m;

var arrayMethodIsStrict$b = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails$13(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};

var $$4G = _export;
var $every$2 = arrayIteration.every;
var arrayMethodIsStrict$a = arrayMethodIsStrict$b;

var STRICT_METHOD$8 = arrayMethodIsStrict$a('every');

// `Array.prototype.every` method
// https://tc39.es/ecma262/#sec-array.prototype.every
$$4G({ target: 'Array', proto: true, forced: !STRICT_METHOD$8 }, {
  every: function every(callbackfn /* , thisArg */) {
    return $every$2(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var toObject$t = toObject$B;
var toAbsoluteIndex$7 = toAbsoluteIndex$b;
var lengthOfArrayLike$s = lengthOfArrayLike$A;

// `Array.prototype.fill` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.fill
var arrayFill$1 = function fill(value /* , start = 0, end = @length */) {
  var O = toObject$t(this);
  var length = lengthOfArrayLike$s(O);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex$7(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex$7(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

var $$4F = _export;
var fill$1 = arrayFill$1;
var addToUnscopables$k = addToUnscopables$n;

// `Array.prototype.fill` method
// https://tc39.es/ecma262/#sec-array.prototype.fill
$$4F({ target: 'Array', proto: true }, {
  fill: fill$1
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables$k('fill');

var $$4E = _export;
var $filter$1 = arrayIteration.filter;
var arrayMethodHasSpeciesSupport$3 = arrayMethodHasSpeciesSupport$5;

var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport$3('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$$4E({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var $$4D = _export;
var $find$2 = arrayIteration.find;
var addToUnscopables$j = addToUnscopables$n;

var FIND = 'find';
var SKIPS_HOLES$1 = true;

// Shouldn't skip holes
if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES$1 = false; });

// `Array.prototype.find` method
// https://tc39.es/ecma262/#sec-array.prototype.find
$$4D({ target: 'Array', proto: true, forced: SKIPS_HOLES$1 }, {
  find: function find(callbackfn /* , that = undefined */) {
    return $find$2(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables$j(FIND);

var $$4C = _export;
var $findIndex$1 = arrayIteration.findIndex;
var addToUnscopables$i = addToUnscopables$n;

var FIND_INDEX = 'findIndex';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false; });

// `Array.prototype.findIndex` method
// https://tc39.es/ecma262/#sec-array.prototype.findindex
$$4C({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $findIndex$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables$i(FIND_INDEX);

var bind$r = functionBindContext;
var IndexedObject$5 = indexedObject;
var toObject$s = toObject$B;
var lengthOfArrayLike$r = lengthOfArrayLike$A;

// `Array.prototype.{ findLast, findLastIndex }` methods implementation
var createMethod$6 = function (TYPE) {
  var IS_FIND_LAST_INDEX = TYPE == 1;
  return function ($this, callbackfn, that) {
    var O = toObject$s($this);
    var self = IndexedObject$5(O);
    var boundFunction = bind$r(callbackfn, that);
    var index = lengthOfArrayLike$r(self);
    var value, result;
    while (index-- > 0) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (result) switch (TYPE) {
        case 0: return value; // findLast
        case 1: return index; // findLastIndex
      }
    }
    return IS_FIND_LAST_INDEX ? -1 : undefined;
  };
};

var arrayIterationFromLast = {
  // `Array.prototype.findLast` method
  // https://github.com/tc39/proposal-array-find-from-last
  findLast: createMethod$6(0),
  // `Array.prototype.findLastIndex` method
  // https://github.com/tc39/proposal-array-find-from-last
  findLastIndex: createMethod$6(1)
};

var $$4B = _export;
var $findLast$1 = arrayIterationFromLast.findLast;
var addToUnscopables$h = addToUnscopables$n;

// `Array.prototype.findLast` method
// https://github.com/tc39/proposal-array-find-from-last
$$4B({ target: 'Array', proto: true }, {
  findLast: function findLast(callbackfn /* , that = undefined */) {
    return $findLast$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

addToUnscopables$h('findLast');

var $$4A = _export;
var $findLastIndex$1 = arrayIterationFromLast.findLastIndex;
var addToUnscopables$g = addToUnscopables$n;

// `Array.prototype.findLastIndex` method
// https://github.com/tc39/proposal-array-find-from-last
$$4A({ target: 'Array', proto: true }, {
  findLastIndex: function findLastIndex(callbackfn /* , that = undefined */) {
    return $findLastIndex$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

addToUnscopables$g('findLastIndex');

var isArray$4 = isArray$8;
var lengthOfArrayLike$q = lengthOfArrayLike$A;
var doesNotExceedSafeInteger$5 = doesNotExceedSafeInteger$7;
var bind$q = functionBindContext;

// `FlattenIntoArray` abstract operation
// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var flattenIntoArray$2 = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? bind$q(mapper, thisArg) : false;
  var element, elementLen;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      if (depth > 0 && isArray$4(element)) {
        elementLen = lengthOfArrayLike$q(element);
        targetIndex = flattenIntoArray$2(target, original, element, elementLen, targetIndex, depth - 1) - 1;
      } else {
        doesNotExceedSafeInteger$5(targetIndex + 1);
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
};

var flattenIntoArray_1 = flattenIntoArray$2;

var $$4z = _export;
var flattenIntoArray$1 = flattenIntoArray_1;
var toObject$r = toObject$B;
var lengthOfArrayLike$p = lengthOfArrayLike$A;
var toIntegerOrInfinity$k = toIntegerOrInfinity$o;
var arraySpeciesCreate$3 = arraySpeciesCreate$6;

// `Array.prototype.flat` method
// https://tc39.es/ecma262/#sec-array.prototype.flat
$$4z({ target: 'Array', proto: true }, {
  flat: function flat(/* depthArg = 1 */) {
    var depthArg = arguments.length ? arguments[0] : undefined;
    var O = toObject$r(this);
    var sourceLen = lengthOfArrayLike$p(O);
    var A = arraySpeciesCreate$3(O, 0);
    A.length = flattenIntoArray$1(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toIntegerOrInfinity$k(depthArg));
    return A;
  }
});

var $$4y = _export;
var flattenIntoArray = flattenIntoArray_1;
var aCallable$T = aCallable$X;
var toObject$q = toObject$B;
var lengthOfArrayLike$o = lengthOfArrayLike$A;
var arraySpeciesCreate$2 = arraySpeciesCreate$6;

// `Array.prototype.flatMap` method
// https://tc39.es/ecma262/#sec-array.prototype.flatmap
$$4y({ target: 'Array', proto: true }, {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject$q(this);
    var sourceLen = lengthOfArrayLike$o(O);
    var A;
    aCallable$T(callbackfn);
    A = arraySpeciesCreate$2(O, 0);
    A.length = flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return A;
  }
});

var $forEach$2 = arrayIteration.forEach;
var arrayMethodIsStrict$9 = arrayMethodIsStrict$b;

var STRICT_METHOD$7 = arrayMethodIsStrict$9('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
var arrayForEach = !STRICT_METHOD$7 ? function forEach(callbackfn /* , thisArg */) {
  return $forEach$2(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es-x/no-array-prototype-foreach -- safe
} : [].forEach;

var $$4x = _export;
var forEach$2 = arrayForEach;

// `Array.prototype.forEach` method
// https://tc39.es/ecma262/#sec-array.prototype.foreach
// eslint-disable-next-line es-x/no-array-prototype-foreach -- safe
$$4x({ target: 'Array', proto: true, forced: [].forEach != forEach$2 }, {
  forEach: forEach$2
});

var anObject$1p = anObject$1A;
var iteratorClose$2 = iteratorClose$4;

// call something on iterator step with safe closing on error
var callWithSafeIterationClosing$3 = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject$1p(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose$2(iterator, 'throw', error);
  }
};

var bind$p = functionBindContext;
var call$W = functionCall;
var toObject$p = toObject$B;
var callWithSafeIterationClosing$2 = callWithSafeIterationClosing$3;
var isArrayIteratorMethod$1 = isArrayIteratorMethod$3;
var isConstructor$8 = isConstructor$a;
var lengthOfArrayLike$n = lengthOfArrayLike$A;
var createProperty$6 = createProperty$9;
var getIterator$9 = getIterator$b;
var getIteratorMethod$6 = getIteratorMethod$9;

var $Array$8 = Array;

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
var arrayFrom$1 = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject$p(arrayLike);
  var IS_CONSTRUCTOR = isConstructor$8(this);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  if (mapping) mapfn = bind$p(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
  var iteratorMethod = getIteratorMethod$6(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod && !(this === $Array$8 && isArrayIteratorMethod$1(iteratorMethod))) {
    iterator = getIterator$9(O, iteratorMethod);
    next = iterator.next;
    result = IS_CONSTRUCTOR ? new this() : [];
    for (;!(step = call$W(next, iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing$2(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty$6(result, index, value);
    }
  } else {
    length = lengthOfArrayLike$n(O);
    result = IS_CONSTRUCTOR ? new this(length) : $Array$8(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty$6(result, index, value);
    }
  }
  result.length = index;
  return result;
};

var wellKnownSymbol$v = wellKnownSymbol$K;

var ITERATOR$8 = wellKnownSymbol$v('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR$8] = function () {
    return this;
  };
  // eslint-disable-next-line es-x/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

var checkCorrectnessOfIteration$4 = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR$8] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

var $$4w = _export;
var from$4 = arrayFrom$1;
var checkCorrectnessOfIteration$3 = checkCorrectnessOfIteration$4;

var INCORRECT_ITERATION = !checkCorrectnessOfIteration$3(function (iterable) {
  // eslint-disable-next-line es-x/no-array-from -- required for testing
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.es/ecma262/#sec-array.from
$$4w({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from$4
});

var $$4v = _export;
var $includes$1 = arrayIncludes.includes;
var fails$12 = fails$1m;
var addToUnscopables$f = addToUnscopables$n;

// FF99+ bug
var BROKEN_ON_SPARSE = fails$12(function () {
  return !Array(1).includes();
});

// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
$$4v({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes$1(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables$f('includes');

/* eslint-disable es-x/no-array-prototype-indexof -- required for testing */
var $$4u = _export;
var uncurryThis$1a = functionUncurryThis;
var $IndexOf = arrayIncludes.indexOf;
var arrayMethodIsStrict$8 = arrayMethodIsStrict$b;

var un$IndexOf = uncurryThis$1a([].indexOf);

var NEGATIVE_ZERO$1 = !!un$IndexOf && 1 / un$IndexOf([1], 1, -0) < 0;
var STRICT_METHOD$6 = arrayMethodIsStrict$8('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
$$4u({ target: 'Array', proto: true, forced: NEGATIVE_ZERO$1 || !STRICT_METHOD$6 }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
    return NEGATIVE_ZERO$1
      // convert -0 to +0
      ? un$IndexOf(this, searchElement, fromIndex) || 0
      : $IndexOf(this, searchElement, fromIndex);
  }
});

var $$4t = _export;
var isArray$3 = isArray$8;

// `Array.isArray` method
// https://tc39.es/ecma262/#sec-array.isarray
$$4t({ target: 'Array', stat: true }, {
  isArray: isArray$3
});

var fails$11 = fails$1m;
var isCallable$m = isCallable$E;
var getPrototypeOf$c = objectGetPrototypeOf$1;
var defineBuiltIn$k = defineBuiltIn$p;
var wellKnownSymbol$u = wellKnownSymbol$K;

var ITERATOR$7 = wellKnownSymbol$u('iterator');
var BUGGY_SAFARI_ITERATORS$1 = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype$5, PrototypeOfArrayIteratorPrototype, arrayIterator$1;

/* eslint-disable es-x/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator$1 = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator$1)) BUGGY_SAFARI_ITERATORS$1 = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf$c(getPrototypeOf$c(arrayIterator$1));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$5 = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$5 == undefined || fails$11(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype$5[ITERATOR$7].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$5 = {};

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable$m(IteratorPrototype$5[ITERATOR$7])) {
  defineBuiltIn$k(IteratorPrototype$5, ITERATOR$7, function () {
    return this;
  });
}

var iteratorsCore = {
  IteratorPrototype: IteratorPrototype$5,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
};

var IteratorPrototype$4 = iteratorsCore.IteratorPrototype;
var create$c = objectCreate$1;
var createPropertyDescriptor$5 = createPropertyDescriptor$c;
var setToStringTag$a = setToStringTag$d;
var Iterators$2 = iterators;

var returnThis$1 = function () { return this; };

var createIteratorConstructor$7 = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create$c(IteratorPrototype$4, { next: createPropertyDescriptor$5(+!ENUMERABLE_NEXT, next) });
  setToStringTag$a(IteratorConstructor, TO_STRING_TAG, false);
  Iterators$2[TO_STRING_TAG] = returnThis$1;
  return IteratorConstructor;
};

var $$4s = _export;
var call$V = functionCall;
var FunctionName$1 = functionName;
var isCallable$l = isCallable$E;
var createIteratorConstructor$6 = createIteratorConstructor$7;
var getPrototypeOf$b = objectGetPrototypeOf$1;
var setPrototypeOf$5 = objectSetPrototypeOf$1;
var setToStringTag$9 = setToStringTag$d;
var createNonEnumerableProperty$c = createNonEnumerableProperty$i;
var defineBuiltIn$j = defineBuiltIn$p;
var wellKnownSymbol$t = wellKnownSymbol$K;
var Iterators$1 = iterators;
var IteratorsCore = iteratorsCore;

var PROPER_FUNCTION_NAME$3 = FunctionName$1.PROPER;
var CONFIGURABLE_FUNCTION_NAME$1 = FunctionName$1.CONFIGURABLE;
var IteratorPrototype$3 = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$6 = wellKnownSymbol$t('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

var defineIterator$3 = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor$6(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR$6]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf$b(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (getPrototypeOf$b(CurrentIteratorPrototype) !== IteratorPrototype$3) {
        if (setPrototypeOf$5) {
          setPrototypeOf$5(CurrentIteratorPrototype, IteratorPrototype$3);
        } else if (!isCallable$l(CurrentIteratorPrototype[ITERATOR$6])) {
          defineBuiltIn$j(CurrentIteratorPrototype, ITERATOR$6, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag$9(CurrentIteratorPrototype, TO_STRING_TAG, true);
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME$3 && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (CONFIGURABLE_FUNCTION_NAME$1) {
      createNonEnumerableProperty$c(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return call$V(nativeIterator, this); };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        defineBuiltIn$j(IterablePrototype, KEY, methods[KEY]);
      }
    } else $$4s({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  // define iterator
  if (IterablePrototype[ITERATOR$6] !== defaultIterator) {
    defineBuiltIn$j(IterablePrototype, ITERATOR$6, defaultIterator, { name: DEFAULT });
  }
  Iterators$1[NAME] = defaultIterator;

  return methods;
};

var toIndexedObject$d = toIndexedObject$k;
var addToUnscopables$e = addToUnscopables$n;
var Iterators = iterators;
var InternalStateModule$j = internalState;
var defineProperty$b = objectDefineProperty.f;
var defineIterator$2 = defineIterator$3;
var DESCRIPTORS$x = descriptors;

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState$i = InternalStateModule$j.set;
var getInternalState$g = InternalStateModule$j.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
var es_array_iterator = defineIterator$2(Array, 'Array', function (iterated, kind) {
  setInternalState$i(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject$d(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState$g(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
var values = Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables$e('keys');
addToUnscopables$e('values');
addToUnscopables$e('entries');

// V8 ~ Chrome 45- bug
if (DESCRIPTORS$x && values.name !== 'values') try {
  defineProperty$b(values, 'name', { value: 'values' });
} catch (error) { /* empty */ }

var $$4r = _export;
var uncurryThis$19 = functionUncurryThis;
var IndexedObject$4 = indexedObject;
var toIndexedObject$c = toIndexedObject$k;
var arrayMethodIsStrict$7 = arrayMethodIsStrict$b;

var un$Join = uncurryThis$19([].join);

var ES3_STRINGS = IndexedObject$4 != Object;
var STRICT_METHOD$5 = arrayMethodIsStrict$7('join', ',');

// `Array.prototype.join` method
// https://tc39.es/ecma262/#sec-array.prototype.join
$$4r({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$5 }, {
  join: function join(separator) {
    return un$Join(toIndexedObject$c(this), separator === undefined ? ',' : separator);
  }
});

/* eslint-disable es-x/no-array-prototype-lastindexof -- safe */
var apply$m = functionApply$1;
var toIndexedObject$b = toIndexedObject$k;
var toIntegerOrInfinity$j = toIntegerOrInfinity$o;
var lengthOfArrayLike$m = lengthOfArrayLike$A;
var arrayMethodIsStrict$6 = arrayMethodIsStrict$b;

var min$9 = Math.min;
var $lastIndexOf$1 = [].lastIndexOf;
var NEGATIVE_ZERO = !!$lastIndexOf$1 && 1 / [1].lastIndexOf(1, -0) < 0;
var STRICT_METHOD$4 = arrayMethodIsStrict$6('lastIndexOf');
var FORCED$n = NEGATIVE_ZERO || !STRICT_METHOD$4;

// `Array.prototype.lastIndexOf` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
var arrayLastIndexOf = FORCED$n ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
  // convert -0 to +0
  if (NEGATIVE_ZERO) return apply$m($lastIndexOf$1, this, arguments) || 0;
  var O = toIndexedObject$b(this);
  var length = lengthOfArrayLike$m(O);
  var index = length - 1;
  if (arguments.length > 1) index = min$9(index, toIntegerOrInfinity$j(arguments[1]));
  if (index < 0) index = length + index;
  for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
  return -1;
} : $lastIndexOf$1;

var $$4q = _export;
var lastIndexOf = arrayLastIndexOf;

// `Array.prototype.lastIndexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
// eslint-disable-next-line es-x/no-array-prototype-lastindexof -- required for testing
$$4q({ target: 'Array', proto: true, forced: lastIndexOf !== [].lastIndexOf }, {
  lastIndexOf: lastIndexOf
});

var $$4p = _export;
var $map$1 = arrayIteration.map;
var arrayMethodHasSpeciesSupport$2 = arrayMethodHasSpeciesSupport$5;

var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport$2('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
$$4p({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var $$4o = _export;
var fails$10 = fails$1m;
var isConstructor$7 = isConstructor$a;
var createProperty$5 = createProperty$9;

var $Array$7 = Array;

var ISNT_GENERIC = fails$10(function () {
  function F() { /* empty */ }
  // eslint-disable-next-line es-x/no-array-of -- safe
  return !($Array$7.of.call(F) instanceof F);
});

// `Array.of` method
// https://tc39.es/ecma262/#sec-array.of
// WebKit Array.of isn't generic
$$4o({ target: 'Array', stat: true, forced: ISNT_GENERIC }, {
  of: function of(/* ...args */) {
    var index = 0;
    var argumentsLength = arguments.length;
    var result = new (isConstructor$7(this) ? this : $Array$7)(argumentsLength);
    while (argumentsLength > index) createProperty$5(result, index, arguments[index++]);
    result.length = argumentsLength;
    return result;
  }
});

var $$4n = _export;
var toObject$o = toObject$B;
var lengthOfArrayLike$l = lengthOfArrayLike$A;
var doesNotExceedSafeInteger$4 = doesNotExceedSafeInteger$7;
var fails$$ = fails$1m;

var INCORRECT_TO_LENGTH = fails$$(function () {
  return [].push.call({ length: 0x100000000 }, 1) !== 4294967297;
});

// V8 and Safari <= 15.4, FF < 23 throws InternalError
// https://bugs.chromium.org/p/v8/issues/detail?id=12681
var SILENT_ON_NON_WRITABLE_LENGTH$1 = !function () {
  try {
    // eslint-disable-next-line es-x/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).push();
  } catch (error) {
    return error instanceof TypeError;
  }
}();

// `Array.prototype.push` method
// https://tc39.es/ecma262/#sec-array.prototype.push
$$4n({ target: 'Array', proto: true, arity: 1, forced: INCORRECT_TO_LENGTH || SILENT_ON_NON_WRITABLE_LENGTH$1 }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  push: function push(item) {
    var O = toObject$o(this);
    var len = lengthOfArrayLike$l(O);
    var argCount = arguments.length;
    doesNotExceedSafeInteger$4(len + argCount);
    for (var i = 0; i < argCount; i++) {
      O[len] = arguments[i];
      len++;
    }
    O.length = len;
    return len;
  }
});

var aCallable$S = aCallable$X;
var toObject$n = toObject$B;
var IndexedObject$3 = indexedObject;
var lengthOfArrayLike$k = lengthOfArrayLike$A;

var $TypeError$o = TypeError;

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod$5 = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aCallable$S(callbackfn);
    var O = toObject$n(that);
    var self = IndexedObject$3(O);
    var length = lengthOfArrayLike$k(O);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw $TypeError$o('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

var arrayReduce = {
  // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce
  left: createMethod$5(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
  right: createMethod$5(true)
};

var classof$f = classofRaw$1;
var global$N = global$$;

var engineIsNode = classof$f(global$N.process) == 'process';

var $$4m = _export;
var $reduce$1 = arrayReduce.left;
var arrayMethodIsStrict$5 = arrayMethodIsStrict$b;
var CHROME_VERSION$1 = engineV8Version;
var IS_NODE$7 = engineIsNode;

var STRICT_METHOD$3 = arrayMethodIsStrict$5('reduce');
// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG$1 = !IS_NODE$7 && CHROME_VERSION$1 > 79 && CHROME_VERSION$1 < 83;

// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
$$4m({ target: 'Array', proto: true, forced: !STRICT_METHOD$3 || CHROME_BUG$1 }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    var length = arguments.length;
    return $reduce$1(this, callbackfn, length, length > 1 ? arguments[1] : undefined);
  }
});

var $$4l = _export;
var $reduceRight$1 = arrayReduce.right;
var arrayMethodIsStrict$4 = arrayMethodIsStrict$b;
var CHROME_VERSION = engineV8Version;
var IS_NODE$6 = engineIsNode;

var STRICT_METHOD$2 = arrayMethodIsStrict$4('reduceRight');
// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !IS_NODE$6 && CHROME_VERSION > 79 && CHROME_VERSION < 83;

// `Array.prototype.reduceRight` method
// https://tc39.es/ecma262/#sec-array.prototype.reduceright
$$4l({ target: 'Array', proto: true, forced: !STRICT_METHOD$2 || CHROME_BUG }, {
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduceRight$1(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var $$4k = _export;
var uncurryThis$18 = functionUncurryThis;
var isArray$2 = isArray$8;

var un$Reverse = uncurryThis$18([].reverse);
var test$1 = [1, 2];

// `Array.prototype.reverse` method
// https://tc39.es/ecma262/#sec-array.prototype.reverse
// fix for Safari 12.0 bug
// https://bugs.webkit.org/show_bug.cgi?id=188794
$$4k({ target: 'Array', proto: true, forced: String(test$1) === String(test$1.reverse()) }, {
  reverse: function reverse() {
    // eslint-disable-next-line no-self-assign -- dirty hack
    if (isArray$2(this)) this.length = this.length;
    return un$Reverse(this);
  }
});

var $$4j = _export;
var isArray$1 = isArray$8;
var isConstructor$6 = isConstructor$a;
var isObject$r = isObject$C;
var toAbsoluteIndex$6 = toAbsoluteIndex$b;
var lengthOfArrayLike$j = lengthOfArrayLike$A;
var toIndexedObject$a = toIndexedObject$k;
var createProperty$4 = createProperty$9;
var wellKnownSymbol$s = wellKnownSymbol$K;
var arrayMethodHasSpeciesSupport$1 = arrayMethodHasSpeciesSupport$5;
var un$Slice = arraySlice$c;

var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport$1('slice');

var SPECIES$4 = wellKnownSymbol$s('species');
var $Array$6 = Array;
var max$7 = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$$4j({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
  slice: function slice(start, end) {
    var O = toIndexedObject$a(this);
    var length = lengthOfArrayLike$j(O);
    var k = toAbsoluteIndex$6(start, length);
    var fin = toAbsoluteIndex$6(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray$1(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (isConstructor$6(Constructor) && (Constructor === $Array$6 || isArray$1(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject$r(Constructor)) {
        Constructor = Constructor[SPECIES$4];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === $Array$6 || Constructor === undefined) {
        return un$Slice(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? $Array$6 : Constructor)(max$7(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty$4(result, n, O[k]);
    result.length = n;
    return result;
  }
});

var $$4i = _export;
var $some$2 = arrayIteration.some;
var arrayMethodIsStrict$3 = arrayMethodIsStrict$b;

var STRICT_METHOD$1 = arrayMethodIsStrict$3('some');

// `Array.prototype.some` method
// https://tc39.es/ecma262/#sec-array.prototype.some
$$4i({ target: 'Array', proto: true, forced: !STRICT_METHOD$1 }, {
  some: function some(callbackfn /* , thisArg */) {
    return $some$2(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var arraySlice$a = arraySliceSimple;

var floor$9 = Math.floor;

var mergeSort = function (array, comparefn) {
  var length = array.length;
  var middle = floor$9(length / 2);
  return length < 8 ? insertionSort(array, comparefn) : merge(
    array,
    mergeSort(arraySlice$a(array, 0, middle), comparefn),
    mergeSort(arraySlice$a(array, middle), comparefn),
    comparefn
  );
};

var insertionSort = function (array, comparefn) {
  var length = array.length;
  var i = 1;
  var element, j;

  while (i < length) {
    j = i;
    element = array[i];
    while (j && comparefn(array[j - 1], element) > 0) {
      array[j] = array[--j];
    }
    if (j !== i++) array[j] = element;
  } return array;
};

var merge = function (array, left, right, comparefn) {
  var llength = left.length;
  var rlength = right.length;
  var lindex = 0;
  var rindex = 0;

  while (lindex < llength || rindex < rlength) {
    array[lindex + rindex] = (lindex < llength && rindex < rlength)
      ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
      : lindex < llength ? left[lindex++] : right[rindex++];
  } return array;
};

var arraySort$1 = mergeSort;

var userAgent$6 = engineUserAgent;

var firefox = userAgent$6.match(/firefox\/(\d+)/i);

var engineFfVersion = !!firefox && +firefox[1];

var UA = engineUserAgent;

var engineIsIeOrEdge = /MSIE|Trident/.test(UA);

var userAgent$5 = engineUserAgent;

var webkit = userAgent$5.match(/AppleWebKit\/(\d+)\./);

var engineWebkitVersion = !!webkit && +webkit[1];

var $$4h = _export;
var uncurryThis$17 = functionUncurryThis;
var aCallable$R = aCallable$X;
var toObject$m = toObject$B;
var lengthOfArrayLike$i = lengthOfArrayLike$A;
var deletePropertyOrThrow$2 = deletePropertyOrThrow$4;
var toString$v = toString$z;
var fails$_ = fails$1m;
var internalSort$1 = arraySort$1;
var arrayMethodIsStrict$2 = arrayMethodIsStrict$b;
var FF$1 = engineFfVersion;
var IE_OR_EDGE$1 = engineIsIeOrEdge;
var V8$2 = engineV8Version;
var WEBKIT$2 = engineWebkitVersion;

var test = [];
var un$Sort$1 = uncurryThis$17(test.sort);
var push$i = uncurryThis$17(test.push);

// IE8-
var FAILS_ON_UNDEFINED = fails$_(function () {
  test.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails$_(function () {
  test.sort(null);
});
// Old WebKit
var STRICT_METHOD = arrayMethodIsStrict$2('sort');

var STABLE_SORT$1 = !fails$_(function () {
  // feature detection can be too slow, so check engines versions
  if (V8$2) return V8$2 < 70;
  if (FF$1 && FF$1 > 3) return;
  if (IE_OR_EDGE$1) return true;
  if (WEBKIT$2) return WEBKIT$2 < 603;

  var result = '';
  var code, chr, value, index;

  // generate an array with more 512 elements (Chakra and old V8 fails only in this case)
  for (code = 65; code < 76; code++) {
    chr = String.fromCharCode(code);

    switch (code) {
      case 66: case 69: case 70: case 72: value = 3; break;
      case 68: case 71: value = 4; break;
      default: value = 2;
    }

    for (index = 0; index < 47; index++) {
      test.push({ k: chr + index, v: value });
    }
  }

  test.sort(function (a, b) { return b.v - a.v; });

  for (index = 0; index < test.length; index++) {
    chr = test[index].k.charAt(0);
    if (result.charAt(result.length - 1) !== chr) result += chr;
  }

  return result !== 'DGBEFHACIJK';
});

var FORCED$m = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD || !STABLE_SORT$1;

var getSortCompare$1 = function (comparefn) {
  return function (x, y) {
    if (y === undefined) return -1;
    if (x === undefined) return 1;
    if (comparefn !== undefined) return +comparefn(x, y) || 0;
    return toString$v(x) > toString$v(y) ? 1 : -1;
  };
};

// `Array.prototype.sort` method
// https://tc39.es/ecma262/#sec-array.prototype.sort
$$4h({ target: 'Array', proto: true, forced: FORCED$m }, {
  sort: function sort(comparefn) {
    if (comparefn !== undefined) aCallable$R(comparefn);

    var array = toObject$m(this);

    if (STABLE_SORT$1) return comparefn === undefined ? un$Sort$1(array) : un$Sort$1(array, comparefn);

    var items = [];
    var arrayLength = lengthOfArrayLike$i(array);
    var itemsLength, index;

    for (index = 0; index < arrayLength; index++) {
      if (index in array) push$i(items, array[index]);
    }

    internalSort$1(items, getSortCompare$1(comparefn));

    itemsLength = items.length;
    index = 0;

    while (index < itemsLength) array[index] = items[index++];
    while (index < arrayLength) deletePropertyOrThrow$2(array, index++);

    return array;
  }
});

var getBuiltIn$z = getBuiltIn$L;
var definePropertyModule$6 = objectDefineProperty;
var wellKnownSymbol$r = wellKnownSymbol$K;
var DESCRIPTORS$w = descriptors;

var SPECIES$3 = wellKnownSymbol$r('species');

var setSpecies$7 = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn$z(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule$6.f;

  if (DESCRIPTORS$w && Constructor && !Constructor[SPECIES$3]) {
    defineProperty(Constructor, SPECIES$3, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

var setSpecies$6 = setSpecies$7;

// `Array[@@species]` getter
// https://tc39.es/ecma262/#sec-get-array-@@species
setSpecies$6('Array');

var $$4g = _export;
var toObject$l = toObject$B;
var toAbsoluteIndex$5 = toAbsoluteIndex$b;
var toIntegerOrInfinity$i = toIntegerOrInfinity$o;
var lengthOfArrayLike$h = lengthOfArrayLike$A;
var doesNotExceedSafeInteger$3 = doesNotExceedSafeInteger$7;
var arraySpeciesCreate$1 = arraySpeciesCreate$6;
var createProperty$3 = createProperty$9;
var deletePropertyOrThrow$1 = deletePropertyOrThrow$4;
var arrayMethodHasSpeciesSupport = arrayMethodHasSpeciesSupport$5;

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');

var max$6 = Math.max;
var min$8 = Math.min;

// `Array.prototype.splice` method
// https://tc39.es/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$$4g({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject$l(this);
    var len = lengthOfArrayLike$h(O);
    var actualStart = toAbsoluteIndex$5(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min$8(max$6(toIntegerOrInfinity$i(deleteCount), 0), len - actualStart);
    }
    doesNotExceedSafeInteger$3(len + insertCount - actualDeleteCount);
    A = arraySpeciesCreate$1(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty$3(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else deletePropertyOrThrow$1(O, to);
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) deletePropertyOrThrow$1(O, k - 1);
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else deletePropertyOrThrow$1(O, to);
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});

// this method was added to unscopables after implementation
// in popular engines, so it's moved to a separate module
var addToUnscopables$d = addToUnscopables$n;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables$d('flat');

// this method was added to unscopables after implementation
// in popular engines, so it's moved to a separate module
var addToUnscopables$c = addToUnscopables$n;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables$c('flatMap');

var $$4f = _export;
var toObject$k = toObject$B;
var lengthOfArrayLike$g = lengthOfArrayLike$A;
var deletePropertyOrThrow = deletePropertyOrThrow$4;
var doesNotExceedSafeInteger$2 = doesNotExceedSafeInteger$7;

// IE8-
var INCORRECT_RESULT = [].unshift(0) !== 1;

// V8 ~ Chrome < 71 and Safari <= 15.4, FF < 23 throws InternalError
var SILENT_ON_NON_WRITABLE_LENGTH = !function () {
  try {
    // eslint-disable-next-line es-x/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).unshift();
  } catch (error) {
    return error instanceof TypeError;
  }
}();

// `Array.prototype.unshift` method
// https://tc39.es/ecma262/#sec-array.prototype.unshift
$$4f({ target: 'Array', proto: true, arity: 1, forced: INCORRECT_RESULT || SILENT_ON_NON_WRITABLE_LENGTH }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  unshift: function unshift(item) {
    var O = toObject$k(this);
    var len = lengthOfArrayLike$g(O);
    var argCount = arguments.length;
    if (argCount) {
      doesNotExceedSafeInteger$2(len + argCount);
      var k = len;
      while (k--) {
        var to = k + argCount;
        if (k in O) O[to] = O[k];
        else deletePropertyOrThrow(O, to);
      }
      for (var j = 0; j < argCount; j++) {
        O[j] = arguments[j];
      }
    } return O.length = len + argCount;
  }
});

// eslint-disable-next-line es-x/no-typed-arrays -- safe
var arrayBufferNative = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';

var defineBuiltIn$i = defineBuiltIn$p;

var defineBuiltIns$9 = function (target, src, options) {
  for (var key in src) defineBuiltIn$i(target, key, src[key], options);
  return target;
};

var isPrototypeOf$7 = objectIsPrototypeOf;

var $TypeError$n = TypeError;

var anInstance$d = function (it, Prototype) {
  if (isPrototypeOf$7(Prototype, it)) return it;
  throw $TypeError$n('Incorrect invocation');
};

var toIntegerOrInfinity$h = toIntegerOrInfinity$o;
var toLength$b = toLength$d;

var $RangeError$b = RangeError;

// `ToIndex` abstract operation
// https://tc39.es/ecma262/#sec-toindex
var toIndex$2 = function (it) {
  if (it === undefined) return 0;
  var number = toIntegerOrInfinity$h(it);
  var length = toLength$b(number);
  if (number !== length) throw $RangeError$b('Wrong length or index');
  return length;
};

// IEEE754 conversions based on https://github.com/feross/ieee754
var $Array$5 = Array;
var abs$8 = Math.abs;
var pow$5 = Math.pow;
var floor$8 = Math.floor;
var log$8 = Math.log;
var LN2$2 = Math.LN2;

var pack = function (number, mantissaLength, bytes) {
  var buffer = $Array$5(bytes);
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var rt = mantissaLength === 23 ? pow$5(2, -24) - pow$5(2, -77) : 0;
  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
  var index = 0;
  var exponent, mantissa, c;
  number = abs$8(number);
  // eslint-disable-next-line no-self-compare -- NaN check
  if (number != number || number === Infinity) {
    // eslint-disable-next-line no-self-compare -- NaN check
    mantissa = number != number ? 1 : 0;
    exponent = eMax;
  } else {
    exponent = floor$8(log$8(number) / LN2$2);
    c = pow$5(2, -exponent);
    if (number * c < 1) {
      exponent--;
      c *= 2;
    }
    if (exponent + eBias >= 1) {
      number += rt / c;
    } else {
      number += rt * pow$5(2, 1 - eBias);
    }
    if (number * c >= 2) {
      exponent++;
      c /= 2;
    }
    if (exponent + eBias >= eMax) {
      mantissa = 0;
      exponent = eMax;
    } else if (exponent + eBias >= 1) {
      mantissa = (number * c - 1) * pow$5(2, mantissaLength);
      exponent = exponent + eBias;
    } else {
      mantissa = number * pow$5(2, eBias - 1) * pow$5(2, mantissaLength);
      exponent = 0;
    }
  }
  while (mantissaLength >= 8) {
    buffer[index++] = mantissa & 255;
    mantissa /= 256;
    mantissaLength -= 8;
  }
  exponent = exponent << mantissaLength | mantissa;
  exponentLength += mantissaLength;
  while (exponentLength > 0) {
    buffer[index++] = exponent & 255;
    exponent /= 256;
    exponentLength -= 8;
  }
  buffer[--index] |= sign * 128;
  return buffer;
};

var unpack = function (buffer, mantissaLength) {
  var bytes = buffer.length;
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var nBits = exponentLength - 7;
  var index = bytes - 1;
  var sign = buffer[index--];
  var exponent = sign & 127;
  var mantissa;
  sign >>= 7;
  while (nBits > 0) {
    exponent = exponent * 256 + buffer[index--];
    nBits -= 8;
  }
  mantissa = exponent & (1 << -nBits) - 1;
  exponent >>= -nBits;
  nBits += mantissaLength;
  while (nBits > 0) {
    mantissa = mantissa * 256 + buffer[index--];
    nBits -= 8;
  }
  if (exponent === 0) {
    exponent = 1 - eBias;
  } else if (exponent === eMax) {
    return mantissa ? NaN : sign ? -Infinity : Infinity;
  } else {
    mantissa = mantissa + pow$5(2, mantissaLength);
    exponent = exponent - eBias;
  } return (sign ? -1 : 1) * mantissa * pow$5(2, exponent - mantissaLength);
};

var ieee754 = {
  pack: pack,
  unpack: unpack
};

var global$M = global$$;
var uncurryThis$16 = functionUncurryThis;
var DESCRIPTORS$v = descriptors;
var NATIVE_ARRAY_BUFFER$2 = arrayBufferNative;
var FunctionName = functionName;
var createNonEnumerableProperty$b = createNonEnumerableProperty$i;
var defineBuiltIns$8 = defineBuiltIns$9;
var fails$Z = fails$1m;
var anInstance$c = anInstance$d;
var toIntegerOrInfinity$g = toIntegerOrInfinity$o;
var toLength$a = toLength$d;
var toIndex$1 = toIndex$2;
var IEEE754 = ieee754;
var getPrototypeOf$a = objectGetPrototypeOf$1;
var setPrototypeOf$4 = objectSetPrototypeOf$1;
var getOwnPropertyNames$4 = objectGetOwnPropertyNames.f;
var defineProperty$a = objectDefineProperty.f;
var arrayFill = arrayFill$1;
var arraySlice$9 = arraySliceSimple;
var setToStringTag$8 = setToStringTag$d;
var InternalStateModule$i = internalState;

var PROPER_FUNCTION_NAME$2 = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var getInternalState$f = InternalStateModule$i.get;
var setInternalState$h = InternalStateModule$i.set;
var ARRAY_BUFFER$1 = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH$1 = 'Wrong length';
var WRONG_INDEX = 'Wrong index';
var NativeArrayBuffer$1 = global$M[ARRAY_BUFFER$1];
var $ArrayBuffer = NativeArrayBuffer$1;
var ArrayBufferPrototype$1 = $ArrayBuffer && $ArrayBuffer[PROTOTYPE];
var $DataView = global$M[DATA_VIEW];
var DataViewPrototype$1 = $DataView && $DataView[PROTOTYPE];
var ObjectPrototype$2 = Object.prototype;
var Array$2 = global$M.Array;
var RangeError$4 = global$M.RangeError;
var fill = uncurryThis$16(arrayFill);
var reverse = uncurryThis$16([].reverse);

var packIEEE754 = IEEE754.pack;
var unpackIEEE754 = IEEE754.unpack;

var packInt8 = function (number) {
  return [number & 0xFF];
};

var packInt16 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF];
};

var packInt32 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
};

var unpackInt32 = function (buffer) {
  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
};

var packFloat32 = function (number) {
  return packIEEE754(number, 23, 4);
};

var packFloat64 = function (number) {
  return packIEEE754(number, 52, 8);
};

var addGetter$1 = function (Constructor, key) {
  defineProperty$a(Constructor[PROTOTYPE], key, { get: function () { return getInternalState$f(this)[key]; } });
};

var get$1 = function (view, count, index, isLittleEndian) {
  var intIndex = toIndex$1(index);
  var store = getInternalState$f(view);
  if (intIndex + count > store.byteLength) throw RangeError$4(WRONG_INDEX);
  var bytes = getInternalState$f(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = arraySlice$9(bytes, start, start + count);
  return isLittleEndian ? pack : reverse(pack);
};

var set$2 = function (view, count, index, conversion, value, isLittleEndian) {
  var intIndex = toIndex$1(index);
  var store = getInternalState$f(view);
  if (intIndex + count > store.byteLength) throw RangeError$4(WRONG_INDEX);
  var bytes = getInternalState$f(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = conversion(+value);
  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
};

if (!NATIVE_ARRAY_BUFFER$2) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance$c(this, ArrayBufferPrototype$1);
    var byteLength = toIndex$1(length);
    setInternalState$h(this, {
      bytes: fill(Array$2(byteLength), 0),
      byteLength: byteLength
    });
    if (!DESCRIPTORS$v) this.byteLength = byteLength;
  };

  ArrayBufferPrototype$1 = $ArrayBuffer[PROTOTYPE];

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance$c(this, DataViewPrototype$1);
    anInstance$c(buffer, ArrayBufferPrototype$1);
    var bufferLength = getInternalState$f(buffer).byteLength;
    var offset = toIntegerOrInfinity$g(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError$4('Wrong offset');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength$a(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError$4(WRONG_LENGTH$1);
    setInternalState$h(this, {
      buffer: buffer,
      byteLength: byteLength,
      byteOffset: offset
    });
    if (!DESCRIPTORS$v) {
      this.buffer = buffer;
      this.byteLength = byteLength;
      this.byteOffset = offset;
    }
  };

  DataViewPrototype$1 = $DataView[PROTOTYPE];

  if (DESCRIPTORS$v) {
    addGetter$1($ArrayBuffer, 'byteLength');
    addGetter$1($DataView, 'buffer');
    addGetter$1($DataView, 'byteLength');
    addGetter$1($DataView, 'byteOffset');
  }

  defineBuiltIns$8(DataViewPrototype$1, {
    getInt8: function getInt8(byteOffset) {
      return get$1(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get$1(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get$1(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
    },
    setInt8: function setInt8(byteOffset, value) {
      set$2(this, 1, byteOffset, packInt8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set$2(this, 1, byteOffset, packInt8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set$2(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set$2(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set$2(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set$2(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set$2(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set$2(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
    }
  });
} else {
  var INCORRECT_ARRAY_BUFFER_NAME = PROPER_FUNCTION_NAME$2 && NativeArrayBuffer$1.name !== ARRAY_BUFFER$1;
  /* eslint-disable no-new -- required for testing */
  if (!fails$Z(function () {
    NativeArrayBuffer$1(1);
  }) || !fails$Z(function () {
    new NativeArrayBuffer$1(-1);
  }) || fails$Z(function () {
    new NativeArrayBuffer$1();
    new NativeArrayBuffer$1(1.5);
    new NativeArrayBuffer$1(NaN);
    return INCORRECT_ARRAY_BUFFER_NAME && !CONFIGURABLE_FUNCTION_NAME;
  })) {
  /* eslint-enable no-new -- required for testing */
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance$c(this, ArrayBufferPrototype$1);
      return new NativeArrayBuffer$1(toIndex$1(length));
    };

    $ArrayBuffer[PROTOTYPE] = ArrayBufferPrototype$1;

    for (var keys$2 = getOwnPropertyNames$4(NativeArrayBuffer$1), j$1 = 0, key$3; keys$2.length > j$1;) {
      if (!((key$3 = keys$2[j$1++]) in $ArrayBuffer)) {
        createNonEnumerableProperty$b($ArrayBuffer, key$3, NativeArrayBuffer$1[key$3]);
      }
    }

    ArrayBufferPrototype$1.constructor = $ArrayBuffer;
  } else if (INCORRECT_ARRAY_BUFFER_NAME && CONFIGURABLE_FUNCTION_NAME) {
    createNonEnumerableProperty$b(NativeArrayBuffer$1, 'name', ARRAY_BUFFER$1);
  }

  // WebKit bug - the same parent prototype for typed arrays and data view
  if (setPrototypeOf$4 && getPrototypeOf$a(DataViewPrototype$1) !== ObjectPrototype$2) {
    setPrototypeOf$4(DataViewPrototype$1, ObjectPrototype$2);
  }

  // iOS Safari 7.x bug
  var testView = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = uncurryThis$16(DataViewPrototype$1.setInt8);
  testView.setInt8(0, 2147483648);
  testView.setInt8(1, 2147483649);
  if (testView.getInt8(0) || !testView.getInt8(1)) defineBuiltIns$8(DataViewPrototype$1, {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8(this, byteOffset, value << 24 >> 24);
    }
  }, { unsafe: true });
}

setToStringTag$8($ArrayBuffer, ARRAY_BUFFER$1);
setToStringTag$8($DataView, DATA_VIEW);

var arrayBuffer = {
  ArrayBuffer: $ArrayBuffer,
  DataView: $DataView
};

var $$4e = _export;
var global$L = global$$;
var arrayBufferModule = arrayBuffer;
var setSpecies$5 = setSpecies$7;

var ARRAY_BUFFER = 'ArrayBuffer';
var ArrayBuffer$4 = arrayBufferModule[ARRAY_BUFFER];
var NativeArrayBuffer = global$L[ARRAY_BUFFER];

// `ArrayBuffer` constructor
// https://tc39.es/ecma262/#sec-arraybuffer-constructor
$$4e({ global: true, constructor: true, forced: NativeArrayBuffer !== ArrayBuffer$4 }, {
  ArrayBuffer: ArrayBuffer$4
});

setSpecies$5(ARRAY_BUFFER);

var NATIVE_ARRAY_BUFFER$1 = arrayBufferNative;
var DESCRIPTORS$u = descriptors;
var global$K = global$$;
var isCallable$k = isCallable$E;
var isObject$q = isObject$C;
var hasOwn$l = hasOwnProperty_1;
var classof$e = classof$l;
var tryToString$1 = tryToString$7;
var createNonEnumerableProperty$a = createNonEnumerableProperty$i;
var defineBuiltIn$h = defineBuiltIn$p;
var defineProperty$9 = objectDefineProperty.f;
var isPrototypeOf$6 = objectIsPrototypeOf;
var getPrototypeOf$9 = objectGetPrototypeOf$1;
var setPrototypeOf$3 = objectSetPrototypeOf$1;
var wellKnownSymbol$q = wellKnownSymbol$K;
var uid$2 = uid$6;
var InternalStateModule$h = internalState;

var enforceInternalState$3 = InternalStateModule$h.enforce;
var getInternalState$e = InternalStateModule$h.get;
var Int8Array$4 = global$K.Int8Array;
var Int8ArrayPrototype$1 = Int8Array$4 && Int8Array$4.prototype;
var Uint8ClampedArray$1 = global$K.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray$1 && Uint8ClampedArray$1.prototype;
var TypedArray$1 = Int8Array$4 && getPrototypeOf$9(Int8Array$4);
var TypedArrayPrototype$2 = Int8ArrayPrototype$1 && getPrototypeOf$9(Int8ArrayPrototype$1);
var ObjectPrototype$1 = Object.prototype;
var TypeError$6 = global$K.TypeError;

var TO_STRING_TAG$5 = wellKnownSymbol$q('toStringTag');
var TYPED_ARRAY_TAG$1 = uid$2('TYPED_ARRAY_TAG');
var TYPED_ARRAY_CONSTRUCTOR = 'TypedArrayConstructor';
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS$3 = NATIVE_ARRAY_BUFFER$1 && !!setPrototypeOf$3 && classof$e(global$K.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQUIRED = false;
var NAME$1, Constructor, Prototype;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var BigIntArrayConstructorsList = {
  BigInt64Array: 8,
  BigUint64Array: 8
};

var isView = function isView(it) {
  if (!isObject$q(it)) return false;
  var klass = classof$e(it);
  return klass === 'DataView'
    || hasOwn$l(TypedArrayConstructorsList, klass)
    || hasOwn$l(BigIntArrayConstructorsList, klass);
};

var getTypedArrayConstructor$5 = function (it) {
  var proto = getPrototypeOf$9(it);
  if (!isObject$q(proto)) return;
  var state = getInternalState$e(proto);
  return (state && hasOwn$l(state, TYPED_ARRAY_CONSTRUCTOR)) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor$5(proto);
};

var isTypedArray$1 = function (it) {
  if (!isObject$q(it)) return false;
  var klass = classof$e(it);
  return hasOwn$l(TypedArrayConstructorsList, klass)
    || hasOwn$l(BigIntArrayConstructorsList, klass);
};

var aTypedArray$x = function (it) {
  if (isTypedArray$1(it)) return it;
  throw TypeError$6('Target is not a typed array');
};

var aTypedArrayConstructor$5 = function (C) {
  if (isCallable$k(C) && (!setPrototypeOf$3 || isPrototypeOf$6(TypedArray$1, C))) return C;
  throw TypeError$6(tryToString$1(C) + ' is not a typed array constructor');
};

var exportTypedArrayMethod$y = function (KEY, property, forced, options) {
  if (!DESCRIPTORS$u) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global$K[ARRAY];
    if (TypedArrayConstructor && hasOwn$l(TypedArrayConstructor.prototype, KEY)) try {
      delete TypedArrayConstructor.prototype[KEY];
    } catch (error) {
      // old WebKit bug - some methods are non-configurable
      try {
        TypedArrayConstructor.prototype[KEY] = property;
      } catch (error2) { /* empty */ }
    }
  }
  if (!TypedArrayPrototype$2[KEY] || forced) {
    defineBuiltIn$h(TypedArrayPrototype$2, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS$3 && Int8ArrayPrototype$1[KEY] || property, options);
  }
};

var exportTypedArrayStaticMethod$3 = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!DESCRIPTORS$u) return;
  if (setPrototypeOf$3) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global$K[ARRAY];
      if (TypedArrayConstructor && hasOwn$l(TypedArrayConstructor, KEY)) try {
        delete TypedArrayConstructor[KEY];
      } catch (error) { /* empty */ }
    }
    if (!TypedArray$1[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return defineBuiltIn$h(TypedArray$1, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS$3 && TypedArray$1[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global$K[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      defineBuiltIn$h(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME$1 in TypedArrayConstructorsList) {
  Constructor = global$K[NAME$1];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState$3(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
  else NATIVE_ARRAY_BUFFER_VIEWS$3 = false;
}

for (NAME$1 in BigIntArrayConstructorsList) {
  Constructor = global$K[NAME$1];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState$3(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS$3 || !isCallable$k(TypedArray$1) || TypedArray$1 === Function.prototype) {
  // eslint-disable-next-line no-shadow -- safe
  TypedArray$1 = function TypedArray() {
    throw TypeError$6('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS$3) for (NAME$1 in TypedArrayConstructorsList) {
    if (global$K[NAME$1]) setPrototypeOf$3(global$K[NAME$1], TypedArray$1);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS$3 || !TypedArrayPrototype$2 || TypedArrayPrototype$2 === ObjectPrototype$1) {
  TypedArrayPrototype$2 = TypedArray$1.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS$3) for (NAME$1 in TypedArrayConstructorsList) {
    if (global$K[NAME$1]) setPrototypeOf$3(global$K[NAME$1].prototype, TypedArrayPrototype$2);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS$3 && getPrototypeOf$9(Uint8ClampedArrayPrototype) !== TypedArrayPrototype$2) {
  setPrototypeOf$3(Uint8ClampedArrayPrototype, TypedArrayPrototype$2);
}

if (DESCRIPTORS$u && !hasOwn$l(TypedArrayPrototype$2, TO_STRING_TAG$5)) {
  TYPED_ARRAY_TAG_REQUIRED = true;
  defineProperty$9(TypedArrayPrototype$2, TO_STRING_TAG$5, { get: function () {
    return isObject$q(this) ? this[TYPED_ARRAY_TAG$1] : undefined;
  } });
  for (NAME$1 in TypedArrayConstructorsList) if (global$K[NAME$1]) {
    createNonEnumerableProperty$a(global$K[NAME$1], TYPED_ARRAY_TAG$1, NAME$1);
  }
}

var arrayBufferViewCore = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS$3,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG$1,
  aTypedArray: aTypedArray$x,
  aTypedArrayConstructor: aTypedArrayConstructor$5,
  exportTypedArrayMethod: exportTypedArrayMethod$y,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod$3,
  getTypedArrayConstructor: getTypedArrayConstructor$5,
  isView: isView,
  isTypedArray: isTypedArray$1,
  TypedArray: TypedArray$1,
  TypedArrayPrototype: TypedArrayPrototype$2
};

var $$4d = _export;
var ArrayBufferViewCore$B = arrayBufferViewCore;

var NATIVE_ARRAY_BUFFER_VIEWS$2 = ArrayBufferViewCore$B.NATIVE_ARRAY_BUFFER_VIEWS;

// `ArrayBuffer.isView` method
// https://tc39.es/ecma262/#sec-arraybuffer.isview
$$4d({ target: 'ArrayBuffer', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS$2 }, {
  isView: ArrayBufferViewCore$B.isView
});

var isConstructor$5 = isConstructor$a;
var tryToString = tryToString$7;

var $TypeError$m = TypeError;

// `Assert: IsConstructor(argument) is true`
var aConstructor$5 = function (argument) {
  if (isConstructor$5(argument)) return argument;
  throw $TypeError$m(tryToString(argument) + ' is not a constructor');
};

var anObject$1o = anObject$1A;
var aConstructor$4 = aConstructor$5;
var wellKnownSymbol$p = wellKnownSymbol$K;

var SPECIES$2 = wellKnownSymbol$p('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
var speciesConstructor$f = function (O, defaultConstructor) {
  var C = anObject$1o(O).constructor;
  var S;
  return C === undefined || (S = anObject$1o(C)[SPECIES$2]) == undefined ? defaultConstructor : aConstructor$4(S);
};

var $$4c = _export;
var uncurryThis$15 = functionUncurryThis;
var fails$Y = fails$1m;
var ArrayBufferModule$2 = arrayBuffer;
var anObject$1n = anObject$1A;
var toAbsoluteIndex$4 = toAbsoluteIndex$b;
var toLength$9 = toLength$d;
var speciesConstructor$e = speciesConstructor$f;

var ArrayBuffer$3 = ArrayBufferModule$2.ArrayBuffer;
var DataView$2 = ArrayBufferModule$2.DataView;
var DataViewPrototype = DataView$2.prototype;
var un$ArrayBufferSlice = uncurryThis$15(ArrayBuffer$3.prototype.slice);
var getUint8 = uncurryThis$15(DataViewPrototype.getUint8);
var setUint8 = uncurryThis$15(DataViewPrototype.setUint8);

var INCORRECT_SLICE = fails$Y(function () {
  return !new ArrayBuffer$3(2).slice(1, undefined).byteLength;
});

// `ArrayBuffer.prototype.slice` method
// https://tc39.es/ecma262/#sec-arraybuffer.prototype.slice
$$4c({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
  slice: function slice(start, end) {
    if (un$ArrayBufferSlice && end === undefined) {
      return un$ArrayBufferSlice(anObject$1n(this), start); // FF fix
    }
    var length = anObject$1n(this).byteLength;
    var first = toAbsoluteIndex$4(start, length);
    var fin = toAbsoluteIndex$4(end === undefined ? length : end, length);
    var result = new (speciesConstructor$e(this, ArrayBuffer$3))(toLength$9(fin - first));
    var viewSource = new DataView$2(this);
    var viewTarget = new DataView$2(result);
    var index = 0;
    while (first < fin) {
      setUint8(viewTarget, index++, getUint8(viewSource, first++));
    } return result;
  }
});

var $$4b = _export;
var ArrayBufferModule$1 = arrayBuffer;
var NATIVE_ARRAY_BUFFER = arrayBufferNative;

// `DataView` constructor
// https://tc39.es/ecma262/#sec-dataview-constructor
$$4b({ global: true, constructor: true, forced: !NATIVE_ARRAY_BUFFER }, {
  DataView: ArrayBufferModule$1.DataView
});

var $$4a = _export;
var uncurryThis$14 = functionUncurryThis;
var fails$X = fails$1m;

var FORCED$l = fails$X(function () {
  return new Date(16e11).getYear() !== 120;
});

var getFullYear = uncurryThis$14(Date.prototype.getFullYear);

// `Date.prototype.getYear` method
// https://tc39.es/ecma262/#sec-date.prototype.getyear
$$4a({ target: 'Date', proto: true, forced: FORCED$l }, {
  getYear: function getYear() {
    return getFullYear(this) - 1900;
  }
});

// TODO: Remove from `core-js@4`
var $$49 = _export;
var uncurryThis$13 = functionUncurryThis;

var $Date = Date;
var getTime$4 = uncurryThis$13($Date.prototype.getTime);

// `Date.now` method
// https://tc39.es/ecma262/#sec-date.now
$$49({ target: 'Date', stat: true }, {
  now: function now() {
    return getTime$4(new $Date());
  }
});

var $$48 = _export;
var uncurryThis$12 = functionUncurryThis;
var toIntegerOrInfinity$f = toIntegerOrInfinity$o;

var DatePrototype$3 = Date.prototype;
var getTime$3 = uncurryThis$12(DatePrototype$3.getTime);
var setFullYear = uncurryThis$12(DatePrototype$3.setFullYear);

// `Date.prototype.setYear` method
// https://tc39.es/ecma262/#sec-date.prototype.setyear
$$48({ target: 'Date', proto: true }, {
  setYear: function setYear(year) {
    // validate
    getTime$3(this);
    var yi = toIntegerOrInfinity$f(year);
    var yyyy = 0 <= yi && yi <= 99 ? yi + 1900 : yi;
    return setFullYear(this, yyyy);
  }
});

var $$47 = _export;

// `Date.prototype.toGMTString` method
// https://tc39.es/ecma262/#sec-date.prototype.togmtstring
$$47({ target: 'Date', proto: true }, {
  toGMTString: Date.prototype.toUTCString
});

var toIntegerOrInfinity$e = toIntegerOrInfinity$o;
var toString$u = toString$z;
var requireObjectCoercible$h = requireObjectCoercible$k;

var $RangeError$a = RangeError;

// `String.prototype.repeat` method implementation
// https://tc39.es/ecma262/#sec-string.prototype.repeat
var stringRepeat = function repeat(count) {
  var str = toString$u(requireObjectCoercible$h(this));
  var result = '';
  var n = toIntegerOrInfinity$e(count);
  if (n < 0 || n == Infinity) throw $RangeError$a('Wrong number of repetitions');
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
  return result;
};

// https://github.com/tc39/proposal-string-pad-start-end
var uncurryThis$11 = functionUncurryThis;
var toLength$8 = toLength$d;
var toString$t = toString$z;
var $repeat$2 = stringRepeat;
var requireObjectCoercible$g = requireObjectCoercible$k;

var repeat$3 = uncurryThis$11($repeat$2);
var stringSlice$f = uncurryThis$11(''.slice);
var ceil = Math.ceil;

// `String.prototype.{ padStart, padEnd }` methods implementation
var createMethod$4 = function (IS_END) {
  return function ($this, maxLength, fillString) {
    var S = toString$t(requireObjectCoercible$g($this));
    var intMaxLength = toLength$8(maxLength);
    var stringLength = S.length;
    var fillStr = fillString === undefined ? ' ' : toString$t(fillString);
    var fillLen, stringFiller;
    if (intMaxLength <= stringLength || fillStr == '') return S;
    fillLen = intMaxLength - stringLength;
    stringFiller = repeat$3(fillStr, ceil(fillLen / fillStr.length));
    if (stringFiller.length > fillLen) stringFiller = stringSlice$f(stringFiller, 0, fillLen);
    return IS_END ? S + stringFiller : stringFiller + S;
  };
};

var stringPad = {
  // `String.prototype.padStart` method
  // https://tc39.es/ecma262/#sec-string.prototype.padstart
  start: createMethod$4(false),
  // `String.prototype.padEnd` method
  // https://tc39.es/ecma262/#sec-string.prototype.padend
  end: createMethod$4(true)
};

var uncurryThis$10 = functionUncurryThis;
var fails$W = fails$1m;
var padStart = stringPad.start;

var $RangeError$9 = RangeError;
var abs$7 = Math.abs;
var DatePrototype$2 = Date.prototype;
var n$DateToISOString = DatePrototype$2.toISOString;
var getTime$2 = uncurryThis$10(DatePrototype$2.getTime);
var getUTCDate = uncurryThis$10(DatePrototype$2.getUTCDate);
var getUTCFullYear = uncurryThis$10(DatePrototype$2.getUTCFullYear);
var getUTCHours = uncurryThis$10(DatePrototype$2.getUTCHours);
var getUTCMilliseconds = uncurryThis$10(DatePrototype$2.getUTCMilliseconds);
var getUTCMinutes = uncurryThis$10(DatePrototype$2.getUTCMinutes);
var getUTCMonth = uncurryThis$10(DatePrototype$2.getUTCMonth);
var getUTCSeconds = uncurryThis$10(DatePrototype$2.getUTCSeconds);

// `Date.prototype.toISOString` method implementation
// https://tc39.es/ecma262/#sec-date.prototype.toisostring
// PhantomJS / old WebKit fails here:
var dateToIsoString = (fails$W(function () {
  return n$DateToISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails$W(function () {
  n$DateToISOString.call(new Date(NaN));
})) ? function toISOString() {
  if (!isFinite(getTime$2(this))) throw $RangeError$9('Invalid time value');
  var date = this;
  var year = getUTCFullYear(date);
  var milliseconds = getUTCMilliseconds(date);
  var sign = year < 0 ? '-' : year > 9999 ? '+' : '';
  return sign + padStart(abs$7(year), sign ? 6 : 4, 0) +
    '-' + padStart(getUTCMonth(date) + 1, 2, 0) +
    '-' + padStart(getUTCDate(date), 2, 0) +
    'T' + padStart(getUTCHours(date), 2, 0) +
    ':' + padStart(getUTCMinutes(date), 2, 0) +
    ':' + padStart(getUTCSeconds(date), 2, 0) +
    '.' + padStart(milliseconds, 3, 0) +
    'Z';
} : n$DateToISOString;

var $$46 = _export;
var toISOString = dateToIsoString;

// `Date.prototype.toISOString` method
// https://tc39.es/ecma262/#sec-date.prototype.toisostring
// PhantomJS / old WebKit has a broken implementations
$$46({ target: 'Date', proto: true, forced: Date.prototype.toISOString !== toISOString }, {
  toISOString: toISOString
});

var $$45 = _export;
var fails$V = fails$1m;
var toObject$j = toObject$B;
var toPrimitive$2 = toPrimitive$4;

var FORCED$k = fails$V(function () {
  return new Date(NaN).toJSON() !== null
    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
});

// `Date.prototype.toJSON` method
// https://tc39.es/ecma262/#sec-date.prototype.tojson
$$45({ target: 'Date', proto: true, arity: 1, forced: FORCED$k }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  toJSON: function toJSON(key) {
    var O = toObject$j(this);
    var pv = toPrimitive$2(O, 'number');
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

var anObject$1m = anObject$1A;
var ordinaryToPrimitive = ordinaryToPrimitive$2;

var $TypeError$l = TypeError;

// `Date.prototype[@@toPrimitive](hint)` method implementation
// https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
var dateToPrimitive$1 = function (hint) {
  anObject$1m(this);
  if (hint === 'string' || hint === 'default') hint = 'string';
  else if (hint !== 'number') throw $TypeError$l('Incorrect hint');
  return ordinaryToPrimitive(this, hint);
};

var hasOwn$k = hasOwnProperty_1;
var defineBuiltIn$g = defineBuiltIn$p;
var dateToPrimitive = dateToPrimitive$1;
var wellKnownSymbol$o = wellKnownSymbol$K;

var TO_PRIMITIVE = wellKnownSymbol$o('toPrimitive');
var DatePrototype$1 = Date.prototype;

// `Date.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
if (!hasOwn$k(DatePrototype$1, TO_PRIMITIVE)) {
  defineBuiltIn$g(DatePrototype$1, TO_PRIMITIVE, dateToPrimitive);
}

// TODO: Remove from `core-js@4`
var uncurryThis$$ = functionUncurryThis;
var defineBuiltIn$f = defineBuiltIn$p;

var DatePrototype = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING$1 = 'toString';
var un$DateToString = uncurryThis$$(DatePrototype[TO_STRING$1]);
var getTime$1 = uncurryThis$$(DatePrototype.getTime);

// `Date.prototype.toString` method
// https://tc39.es/ecma262/#sec-date.prototype.tostring
if (String(new Date(NaN)) != INVALID_DATE) {
  defineBuiltIn$f(DatePrototype, TO_STRING$1, function toString() {
    var value = getTime$1(this);
    // eslint-disable-next-line no-self-compare -- NaN check
    return value === value ? un$DateToString(this) : INVALID_DATE;
  });
}

var $$44 = _export;
var uncurryThis$_ = functionUncurryThis;
var toString$s = toString$z;

var charAt$g = uncurryThis$_(''.charAt);
var charCodeAt$4 = uncurryThis$_(''.charCodeAt);
var exec$a = uncurryThis$_(/./.exec);
var numberToString$2 = uncurryThis$_(1.0.toString);
var toUpperCase = uncurryThis$_(''.toUpperCase);

var raw = /[\w*+\-./@]/;

var hex$1 = function (code, length) {
  var result = numberToString$2(code, 16);
  while (result.length < length) result = '0' + result;
  return result;
};

// `escape` method
// https://tc39.es/ecma262/#sec-escape-string
$$44({ global: true }, {
  escape: function escape(string) {
    var str = toString$s(string);
    var result = '';
    var length = str.length;
    var index = 0;
    var chr, code;
    while (index < length) {
      chr = charAt$g(str, index++);
      if (exec$a(raw, chr)) {
        result += chr;
      } else {
        code = charCodeAt$4(chr, 0);
        if (code < 256) {
          result += '%' + hex$1(code, 2);
        } else {
          result += '%u' + toUpperCase(hex$1(code, 4));
        }
      }
    } return result;
  }
});

var uncurryThis$Z = functionUncurryThis;
var aCallable$Q = aCallable$X;
var isObject$p = isObject$C;
var hasOwn$j = hasOwnProperty_1;
var arraySlice$8 = arraySlice$c;
var NATIVE_BIND = functionBindNative;

var $Function = Function;
var concat$3 = uncurryThis$Z([].concat);
var join$7 = uncurryThis$Z([].join);
var factories = {};

var construct = function (C, argsLength, args) {
  if (!hasOwn$j(factories, argsLength)) {
    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
    factories[argsLength] = $Function('C,a', 'return new C(' + join$7(list, ',') + ')');
  } return factories[argsLength](C, args);
};

// `Function.prototype.bind` method implementation
// https://tc39.es/ecma262/#sec-function.prototype.bind
var functionBind = NATIVE_BIND ? $Function.bind : function bind(that /* , ...args */) {
  var F = aCallable$Q(this);
  var Prototype = F.prototype;
  var partArgs = arraySlice$8(arguments, 1);
  var boundFunction = function bound(/* args... */) {
    var args = concat$3(partArgs, arraySlice$8(arguments));
    return this instanceof boundFunction ? construct(F, args.length, args) : F.apply(that, args);
  };
  if (isObject$p(Prototype)) boundFunction.prototype = Prototype;
  return boundFunction;
};

// TODO: Remove from `core-js@4`
var $$43 = _export;
var bind$o = functionBind;

// `Function.prototype.bind` method
// https://tc39.es/ecma262/#sec-function.prototype.bind
$$43({ target: 'Function', proto: true, forced: Function.bind !== bind$o }, {
  bind: bind$o
});

var isCallable$j = isCallable$E;
var isObject$o = isObject$C;
var definePropertyModule$5 = objectDefineProperty;
var getPrototypeOf$8 = objectGetPrototypeOf$1;
var wellKnownSymbol$n = wellKnownSymbol$K;
var makeBuiltIn$1 = makeBuiltIn$4.exports;

var HAS_INSTANCE = wellKnownSymbol$n('hasInstance');
var FunctionPrototype$1 = Function.prototype;

// `Function.prototype[@@hasInstance]` method
// https://tc39.es/ecma262/#sec-function.prototype-@@hasinstance
if (!(HAS_INSTANCE in FunctionPrototype$1)) {
  definePropertyModule$5.f(FunctionPrototype$1, HAS_INSTANCE, { value: makeBuiltIn$1(function (O) {
    if (!isCallable$j(this) || !isObject$o(O)) return false;
    var P = this.prototype;
    if (!isObject$o(P)) return O instanceof this;
    // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
    while (O = getPrototypeOf$8(O)) if (P === O) return true;
    return false;
  }, HAS_INSTANCE) });
}

var DESCRIPTORS$t = descriptors;
var FUNCTION_NAME_EXISTS = functionName.EXISTS;
var uncurryThis$Y = functionUncurryThis;
var defineProperty$8 = objectDefineProperty.f;

var FunctionPrototype = Function.prototype;
var functionToString = uncurryThis$Y(FunctionPrototype.toString);
var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
var regExpExec$4 = uncurryThis$Y(nameRE.exec);
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (DESCRIPTORS$t && !FUNCTION_NAME_EXISTS) {
  defineProperty$8(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return regExpExec$4(nameRE, functionToString(this))[1];
      } catch (error) {
        return '';
      }
    }
  });
}

var $$42 = _export;
var global$J = global$$;

// `globalThis` object
// https://tc39.es/ecma262/#sec-globalthis
$$42({ global: true }, {
  globalThis: global$J
});

var global$I = global$$;
var setToStringTag$7 = setToStringTag$d;

// JSON[@@toStringTag] property
// https://tc39.es/ecma262/#sec-json-@@tostringtag
setToStringTag$7(global$I.JSON, 'JSON', true);

var internalMetadata = {exports: {}};

// FF26- bug: ArrayBuffers are non-extensible, but Object.isExtensible does not report it
var fails$U = fails$1m;

var arrayBufferNonExtensible = fails$U(function () {
  if (typeof ArrayBuffer == 'function') {
    var buffer = new ArrayBuffer(8);
    // eslint-disable-next-line es-x/no-object-isextensible, es-x/no-object-defineproperty -- safe
    if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', { value: 8 });
  }
});

var fails$T = fails$1m;
var isObject$n = isObject$C;
var classof$d = classofRaw$1;
var ARRAY_BUFFER_NON_EXTENSIBLE$2 = arrayBufferNonExtensible;

// eslint-disable-next-line es-x/no-object-isextensible -- safe
var $isExtensible$2 = Object.isExtensible;
var FAILS_ON_PRIMITIVES$9 = fails$T(function () { $isExtensible$2(1); });

// `Object.isExtensible` method
// https://tc39.es/ecma262/#sec-object.isextensible
var objectIsExtensible = (FAILS_ON_PRIMITIVES$9 || ARRAY_BUFFER_NON_EXTENSIBLE$2) ? function isExtensible(it) {
  if (!isObject$n(it)) return false;
  if (ARRAY_BUFFER_NON_EXTENSIBLE$2 && classof$d(it) == 'ArrayBuffer') return false;
  return $isExtensible$2 ? $isExtensible$2(it) : true;
} : $isExtensible$2;

var fails$S = fails$1m;

var freezing = !fails$S(function () {
  // eslint-disable-next-line es-x/no-object-isextensible, es-x/no-object-preventextensions -- required for testing
  return Object.isExtensible(Object.preventExtensions({}));
});

var $$41 = _export;
var uncurryThis$X = functionUncurryThis;
var hiddenKeys = hiddenKeys$6;
var isObject$m = isObject$C;
var hasOwn$i = hasOwnProperty_1;
var defineProperty$7 = objectDefineProperty.f;
var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
var getOwnPropertyNamesExternalModule = objectGetOwnPropertyNamesExternal;
var isExtensible$1 = objectIsExtensible;
var uid$1 = uid$6;
var FREEZING$4 = freezing;

var REQUIRED = false;
var METADATA = uid$1('meta');
var id$1 = 0;

var setMetadata = function (it) {
  defineProperty$7(it, METADATA, { value: {
    objectID: 'O' + id$1++, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey$1 = function (it, create) {
  // return a primitive with prefix
  if (!isObject$m(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!hasOwn$i(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible$1(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData$1 = function (it, create) {
  if (!hasOwn$i(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible$1(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze$3 = function (it) {
  if (FREEZING$4 && REQUIRED && isExtensible$1(it) && !hasOwn$i(it, METADATA)) setMetadata(it);
  return it;
};

var enable = function () {
  meta.enable = function () { /* empty */ };
  REQUIRED = true;
  var getOwnPropertyNames = getOwnPropertyNamesModule.f;
  var splice = uncurryThis$X([].splice);
  var test = {};
  test[METADATA] = 1;

  // prevent exposing of metadata key
  if (getOwnPropertyNames(test).length) {
    getOwnPropertyNamesModule.f = function (it) {
      var result = getOwnPropertyNames(it);
      for (var i = 0, length = result.length; i < length; i++) {
        if (result[i] === METADATA) {
          splice(result, i, 1);
          break;
        }
      } return result;
    };

    $$41({ target: 'Object', stat: true, forced: true }, {
      getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
    });
  }
};

var meta = internalMetadata.exports = {
  enable: enable,
  fastKey: fastKey$1,
  getWeakData: getWeakData$1,
  onFreeze: onFreeze$3
};

hiddenKeys[METADATA] = true;

var $$40 = _export;
var global$H = global$$;
var uncurryThis$W = functionUncurryThis;
var isForced$3 = isForced_1;
var defineBuiltIn$e = defineBuiltIn$p;
var InternalMetadataModule$1 = internalMetadata.exports;
var iterate$H = iterate$J;
var anInstance$b = anInstance$d;
var isCallable$i = isCallable$E;
var isObject$l = isObject$C;
var fails$R = fails$1m;
var checkCorrectnessOfIteration$2 = checkCorrectnessOfIteration$4;
var setToStringTag$6 = setToStringTag$d;
var inheritIfRequired$4 = inheritIfRequired$6;

var collection$4 = function (CONSTRUCTOR_NAME, wrapper, common) {
  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
  var ADDER = IS_MAP ? 'set' : 'add';
  var NativeConstructor = global$H[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var Constructor = NativeConstructor;
  var exported = {};

  var fixMethod = function (KEY) {
    var uncurriedNativeMethod = uncurryThis$W(NativePrototype[KEY]);
    defineBuiltIn$e(NativePrototype, KEY,
      KEY == 'add' ? function add(value) {
        uncurriedNativeMethod(this, value === 0 ? 0 : value);
        return this;
      } : KEY == 'delete' ? function (key) {
        return IS_WEAK && !isObject$l(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
      } : KEY == 'get' ? function get(key) {
        return IS_WEAK && !isObject$l(key) ? undefined : uncurriedNativeMethod(this, key === 0 ? 0 : key);
      } : KEY == 'has' ? function has(key) {
        return IS_WEAK && !isObject$l(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
      } : function set(key, value) {
        uncurriedNativeMethod(this, key === 0 ? 0 : key, value);
        return this;
      }
    );
  };

  var REPLACE = isForced$3(
    CONSTRUCTOR_NAME,
    !isCallable$i(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails$R(function () {
      new NativeConstructor().entries().next();
    }))
  );

  if (REPLACE) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    InternalMetadataModule$1.enable();
  } else if (isForced$3(CONSTRUCTOR_NAME, true)) {
    var instance = new Constructor();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails$R(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    // eslint-disable-next-line no-new -- required for testing
    var ACCEPT_ITERABLES = checkCorrectnessOfIteration$2(function (iterable) { new NativeConstructor(iterable); });
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails$R(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new NativeConstructor();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });

    if (!ACCEPT_ITERABLES) {
      Constructor = wrapper(function (dummy, iterable) {
        anInstance$b(dummy, NativePrototype);
        var that = inheritIfRequired$4(new NativeConstructor(), dummy, Constructor);
        if (iterable != undefined) iterate$H(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
        return that;
      });
      Constructor.prototype = NativePrototype;
      NativePrototype.constructor = Constructor;
    }

    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }

    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

    // weak collections should not contains .clear method
    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
  }

  exported[CONSTRUCTOR_NAME] = Constructor;
  $$40({ global: true, constructor: true, forced: Constructor != NativeConstructor }, exported);

  setToStringTag$6(Constructor, CONSTRUCTOR_NAME);

  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

  return Constructor;
};

var defineProperty$6 = objectDefineProperty.f;
var create$b = objectCreate$1;
var defineBuiltIns$7 = defineBuiltIns$9;
var bind$n = functionBindContext;
var anInstance$a = anInstance$d;
var iterate$G = iterate$J;
var defineIterator$1 = defineIterator$3;
var setSpecies$4 = setSpecies$7;
var DESCRIPTORS$s = descriptors;
var fastKey = internalMetadata.exports.fastKey;
var InternalStateModule$g = internalState;

var setInternalState$g = InternalStateModule$g.set;
var internalStateGetterFor$1 = InternalStateModule$g.getterFor;

var collectionStrong$2 = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var Constructor = wrapper(function (that, iterable) {
      anInstance$a(that, Prototype);
      setInternalState$g(that, {
        type: CONSTRUCTOR_NAME,
        index: create$b(null),
        first: undefined,
        last: undefined,
        size: 0
      });
      if (!DESCRIPTORS$s) that.size = 0;
      if (iterable != undefined) iterate$G(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
    });

    var Prototype = Constructor.prototype;

    var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var entry = getEntry(that, key);
      var previous, index;
      // change existing entry
      if (entry) {
        entry.value = value;
      // create new entry
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key: key,
          value: value,
          previous: previous = state.last,
          next: undefined,
          removed: false
        };
        if (!state.first) state.first = entry;
        if (previous) previous.next = entry;
        if (DESCRIPTORS$s) state.size++;
        else that.size++;
        // add to index
        if (index !== 'F') state.index[index] = entry;
      } return that;
    };

    var getEntry = function (that, key) {
      var state = getInternalState(that);
      // fast case
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return state.index[index];
      // frozen object case
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key == key) return entry;
      }
    };

    defineBuiltIns$7(Prototype, {
      // `{ Map, Set }.prototype.clear()` methods
      // https://tc39.es/ecma262/#sec-map.prototype.clear
      // https://tc39.es/ecma262/#sec-set.prototype.clear
      clear: function clear() {
        var that = this;
        var state = getInternalState(that);
        var data = state.index;
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous) entry.previous = entry.previous.next = undefined;
          delete data[entry.index];
          entry = entry.next;
        }
        state.first = state.last = undefined;
        if (DESCRIPTORS$s) state.size = 0;
        else that.size = 0;
      },
      // `{ Map, Set }.prototype.delete(key)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.delete
      // https://tc39.es/ecma262/#sec-set.prototype.delete
      'delete': function (key) {
        var that = this;
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev) prev.next = next;
          if (next) next.previous = prev;
          if (state.first == entry) state.first = next;
          if (state.last == entry) state.last = prev;
          if (DESCRIPTORS$s) state.size--;
          else that.size--;
        } return !!entry;
      },
      // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.foreach
      // https://tc39.es/ecma262/#sec-set.prototype.foreach
      forEach: function forEach(callbackfn /* , that = undefined */) {
        var state = getInternalState(this);
        var boundFunction = bind$n(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
        }
      },
      // `{ Map, Set}.prototype.has(key)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.has
      // https://tc39.es/ecma262/#sec-set.prototype.has
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });

    defineBuiltIns$7(Prototype, IS_MAP ? {
      // `Map.prototype.get(key)` method
      // https://tc39.es/ecma262/#sec-map.prototype.get
      get: function get(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      // `Map.prototype.set(key, value)` method
      // https://tc39.es/ecma262/#sec-map.prototype.set
      set: function set(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      // `Set.prototype.add(value)` method
      // https://tc39.es/ecma262/#sec-set.prototype.add
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (DESCRIPTORS$s) defineProperty$6(Prototype, 'size', {
      get: function () {
        return getInternalState(this).size;
      }
    });
    return Constructor;
  },
  setStrong: function (Constructor, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
    var getInternalCollectionState = internalStateGetterFor$1(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor$1(ITERATOR_NAME);
    // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
    // https://tc39.es/ecma262/#sec-map.prototype.entries
    // https://tc39.es/ecma262/#sec-map.prototype.keys
    // https://tc39.es/ecma262/#sec-map.prototype.values
    // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
    // https://tc39.es/ecma262/#sec-set.prototype.entries
    // https://tc39.es/ecma262/#sec-set.prototype.keys
    // https://tc39.es/ecma262/#sec-set.prototype.values
    // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
    defineIterator$1(Constructor, CONSTRUCTOR_NAME, function (iterated, kind) {
      setInternalState$g(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind: kind,
        last: undefined
      });
    }, function () {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      // revert to the last existing entry
      while (entry && entry.removed) entry = entry.previous;
      // get next entry
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        // or finish the iteration
        state.target = undefined;
        return { value: undefined, done: true };
      }
      // return step by kind
      if (kind == 'keys') return { value: entry.key, done: false };
      if (kind == 'values') return { value: entry.value, done: false };
      return { value: [entry.key, entry.value], done: false };
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // `{ Map, Set }.prototype[@@species]` accessors
    // https://tc39.es/ecma262/#sec-get-map-@@species
    // https://tc39.es/ecma262/#sec-get-set-@@species
    setSpecies$4(CONSTRUCTOR_NAME);
  }
};

var collection$3 = collection$4;
var collectionStrong$1 = collectionStrong$2;

// `Map` constructor
// https://tc39.es/ecma262/#sec-map-objects
collection$3('Map', function (init) {
  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong$1);

var log$7 = Math.log;

// `Math.log1p` method implementation
// https://tc39.es/ecma262/#sec-math.log1p
// eslint-disable-next-line es-x/no-math-log1p -- safe
var mathLog1p = Math.log1p || function log1p(x) {
  var n = +x;
  return n > -1e-8 && n < 1e-8 ? n - n * n / 2 : log$7(1 + n);
};

var $$3$ = _export;
var log1p$1 = mathLog1p;

// eslint-disable-next-line es-x/no-math-acosh -- required for testing
var $acosh = Math.acosh;
var log$6 = Math.log;
var sqrt$2 = Math.sqrt;
var LN2$1 = Math.LN2;

var FORCED$j = !$acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  || Math.floor($acosh(Number.MAX_VALUE)) != 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  || $acosh(Infinity) != Infinity;

// `Math.acosh` method
// https://tc39.es/ecma262/#sec-math.acosh
$$3$({ target: 'Math', stat: true, forced: FORCED$j }, {
  acosh: function acosh(x) {
    var n = +x;
    return n < 1 ? NaN : n > 94906265.62425156
      ? log$6(n) + LN2$1
      : log1p$1(n - 1 + sqrt$2(n - 1) * sqrt$2(n + 1));
  }
});

var $$3_ = _export;

// eslint-disable-next-line es-x/no-math-asinh -- required for testing
var $asinh = Math.asinh;
var log$5 = Math.log;
var sqrt$1 = Math.sqrt;

function asinh(x) {
  var n = +x;
  return !isFinite(n) || n == 0 ? n : n < 0 ? -asinh(-n) : log$5(n + sqrt$1(n * n + 1));
}

// `Math.asinh` method
// https://tc39.es/ecma262/#sec-math.asinh
// Tor Browser bug: Math.asinh(0) -> -0
$$3_({ target: 'Math', stat: true, forced: !($asinh && 1 / $asinh(0) > 0) }, {
  asinh: asinh
});

var $$3Z = _export;

// eslint-disable-next-line es-x/no-math-atanh -- required for testing
var $atanh = Math.atanh;
var log$4 = Math.log;

// `Math.atanh` method
// https://tc39.es/ecma262/#sec-math.atanh
// Tor Browser bug: Math.atanh(-0) -> 0
$$3Z({ target: 'Math', stat: true, forced: !($atanh && 1 / $atanh(-0) < 0) }, {
  atanh: function atanh(x) {
    var n = +x;
    return n == 0 ? n : log$4((1 + n) / (1 - n)) / 2;
  }
});

// `Math.sign` method implementation
// https://tc39.es/ecma262/#sec-math.sign
// eslint-disable-next-line es-x/no-math-sign -- safe
var mathSign = Math.sign || function sign(x) {
  var n = +x;
  // eslint-disable-next-line no-self-compare -- NaN check
  return n == 0 || n != n ? n : n < 0 ? -1 : 1;
};

var $$3Y = _export;
var sign$2 = mathSign;

var abs$6 = Math.abs;
var pow$4 = Math.pow;

// `Math.cbrt` method
// https://tc39.es/ecma262/#sec-math.cbrt
$$3Y({ target: 'Math', stat: true }, {
  cbrt: function cbrt(x) {
    var n = +x;
    return sign$2(n) * pow$4(abs$6(n), 1 / 3);
  }
});

var $$3X = _export;

var floor$7 = Math.floor;
var log$3 = Math.log;
var LOG2E = Math.LOG2E;

// `Math.clz32` method
// https://tc39.es/ecma262/#sec-math.clz32
$$3X({ target: 'Math', stat: true }, {
  clz32: function clz32(x) {
    var n = x >>> 0;
    return n ? 31 - floor$7(log$3(n + 0.5) * LOG2E) : 32;
  }
});

// eslint-disable-next-line es-x/no-math-expm1 -- safe
var $expm1 = Math.expm1;
var exp$2 = Math.exp;

// `Math.expm1` method implementation
// https://tc39.es/ecma262/#sec-math.expm1
var mathExpm1 = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x) {
  var n = +x;
  return n == 0 ? n : n > -1e-6 && n < 1e-6 ? n + n * n / 2 : exp$2(n) - 1;
} : $expm1;

var $$3W = _export;
var expm1$3 = mathExpm1;

// eslint-disable-next-line es-x/no-math-cosh -- required for testing
var $cosh = Math.cosh;
var abs$5 = Math.abs;
var E$1 = Math.E;

// `Math.cosh` method
// https://tc39.es/ecma262/#sec-math.cosh
$$3W({ target: 'Math', stat: true, forced: !$cosh || $cosh(710) === Infinity }, {
  cosh: function cosh(x) {
    var t = expm1$3(abs$5(x) - 1) + 1;
    return (t + 1 / (t * E$1 * E$1)) * (E$1 / 2);
  }
});

var $$3V = _export;
var expm1$2 = mathExpm1;

// `Math.expm1` method
// https://tc39.es/ecma262/#sec-math.expm1
// eslint-disable-next-line es-x/no-math-expm1 -- required for testing
$$3V({ target: 'Math', stat: true, forced: expm1$2 != Math.expm1 }, { expm1: expm1$2 });

var sign$1 = mathSign;

var abs$4 = Math.abs;
var pow$3 = Math.pow;
var EPSILON = pow$3(2, -52);
var EPSILON32 = pow$3(2, -23);
var MAX32 = pow$3(2, 127) * (2 - EPSILON32);
var MIN32 = pow$3(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

// `Math.fround` method implementation
// https://tc39.es/ecma262/#sec-math.fround
// eslint-disable-next-line es-x/no-math-fround -- safe
var mathFround = Math.fround || function fround(x) {
  var n = +x;
  var $abs = abs$4(n);
  var $sign = sign$1(n);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare -- NaN check
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};

var $$3U = _export;
var fround$1 = mathFround;

// `Math.fround` method
// https://tc39.es/ecma262/#sec-math.fround
$$3U({ target: 'Math', stat: true }, { fround: fround$1 });

var $$3T = _export;

// eslint-disable-next-line es-x/no-math-hypot -- required for testing
var $hypot = Math.hypot;
var abs$3 = Math.abs;
var sqrt = Math.sqrt;

// Chrome 77 bug
// https://bugs.chromium.org/p/v8/issues/detail?id=9546
var BUGGY = !!$hypot && $hypot(Infinity, NaN) !== Infinity;

// `Math.hypot` method
// https://tc39.es/ecma262/#sec-math.hypot
$$3T({ target: 'Math', stat: true, arity: 2, forced: BUGGY }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  hypot: function hypot(value1, value2) {
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs$3(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * sqrt(sum);
  }
});

var $$3S = _export;
var fails$Q = fails$1m;

// eslint-disable-next-line es-x/no-math-imul -- required for testing
var $imul = Math.imul;

var FORCED$i = fails$Q(function () {
  return $imul(0xFFFFFFFF, 5) != -5 || $imul.length != 2;
});

// `Math.imul` method
// https://tc39.es/ecma262/#sec-math.imul
// some WebKit versions fails with big numbers, some has wrong arity
$$3S({ target: 'Math', stat: true, forced: FORCED$i }, {
  imul: function imul(x, y) {
    var UINT16 = 0xFFFF;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

var log$2 = Math.log;
var LOG10E = Math.LOG10E;

// eslint-disable-next-line es-x/no-math-log10 -- safe
var mathLog10 = Math.log10 || function log10(x) {
  return log$2(x) * LOG10E;
};

var $$3R = _export;
var log10$1 = mathLog10;

// `Math.log10` method
// https://tc39.es/ecma262/#sec-math.log10
$$3R({ target: 'Math', stat: true }, {
  log10: log10$1
});

var $$3Q = _export;
var log1p = mathLog1p;

// `Math.log1p` method
// https://tc39.es/ecma262/#sec-math.log1p
$$3Q({ target: 'Math', stat: true }, { log1p: log1p });

var $$3P = _export;

var log$1 = Math.log;
var LN2 = Math.LN2;

// `Math.log2` method
// https://tc39.es/ecma262/#sec-math.log2
$$3P({ target: 'Math', stat: true }, {
  log2: function log2(x) {
    return log$1(x) / LN2;
  }
});

var $$3O = _export;
var sign = mathSign;

// `Math.sign` method
// https://tc39.es/ecma262/#sec-math.sign
$$3O({ target: 'Math', stat: true }, {
  sign: sign
});

var $$3N = _export;
var fails$P = fails$1m;
var expm1$1 = mathExpm1;

var abs$2 = Math.abs;
var exp$1 = Math.exp;
var E = Math.E;

var FORCED$h = fails$P(function () {
  // eslint-disable-next-line es-x/no-math-sinh -- required for testing
  return Math.sinh(-2e-17) != -2e-17;
});

// `Math.sinh` method
// https://tc39.es/ecma262/#sec-math.sinh
// V8 near Chromium 38 has a problem with very small numbers
$$3N({ target: 'Math', stat: true, forced: FORCED$h }, {
  sinh: function sinh(x) {
    var n = +x;
    return abs$2(n) < 1 ? (expm1$1(n) - expm1$1(-n)) / 2 : (exp$1(n - 1) - exp$1(-n - 1)) * (E / 2);
  }
});

var $$3M = _export;
var expm1 = mathExpm1;

var exp = Math.exp;

// `Math.tanh` method
// https://tc39.es/ecma262/#sec-math.tanh
$$3M({ target: 'Math', stat: true }, {
  tanh: function tanh(x) {
    var n = +x;
    var a = expm1(n);
    var b = expm1(-n);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(n) + exp(-n));
  }
});

var setToStringTag$5 = setToStringTag$d;

// Math[@@toStringTag] property
// https://tc39.es/ecma262/#sec-math-@@tostringtag
setToStringTag$5(Math, 'Math', true);

var $$3L = _export;
var trunc = mathTrunc;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
$$3L({ target: 'Math', stat: true }, {
  trunc: trunc
});

var uncurryThis$V = functionUncurryThis;

// `thisNumberValue` abstract operation
// https://tc39.es/ecma262/#sec-thisnumbervalue
var thisNumberValue$4 = uncurryThis$V(1.0.valueOf);

// a string of all valid unicode whitespaces
var whitespaces$5 = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var uncurryThis$U = functionUncurryThis;
var requireObjectCoercible$f = requireObjectCoercible$k;
var toString$r = toString$z;
var whitespaces$4 = whitespaces$5;

var replace$8 = uncurryThis$U(''.replace);
var whitespace = '[' + whitespaces$4 + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod$3 = function (TYPE) {
  return function ($this) {
    var string = toString$r(requireObjectCoercible$f($this));
    if (TYPE & 1) string = replace$8(string, ltrim, '');
    if (TYPE & 2) string = replace$8(string, rtrim, '');
    return string;
  };
};

var stringTrim = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
  start: createMethod$3(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimend
  end: createMethod$3(2),
  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  trim: createMethod$3(3)
};

var DESCRIPTORS$r = descriptors;
var global$G = global$$;
var uncurryThis$T = functionUncurryThis;
var isForced$2 = isForced_1;
var defineBuiltIn$d = defineBuiltIn$p;
var hasOwn$h = hasOwnProperty_1;
var inheritIfRequired$3 = inheritIfRequired$6;
var isPrototypeOf$5 = objectIsPrototypeOf;
var isSymbol$2 = isSymbol$7;
var toPrimitive$1 = toPrimitive$4;
var fails$O = fails$1m;
var getOwnPropertyNames$3 = objectGetOwnPropertyNames.f;
var getOwnPropertyDescriptor$8 = objectGetOwnPropertyDescriptor.f;
var defineProperty$5 = objectDefineProperty.f;
var thisNumberValue$3 = thisNumberValue$4;
var trim$2 = stringTrim.trim;

var NUMBER = 'Number';
var NativeNumber = global$G[NUMBER];
var NumberPrototype = NativeNumber.prototype;
var TypeError$5 = global$G.TypeError;
var arraySlice$7 = uncurryThis$T(''.slice);
var charCodeAt$3 = uncurryThis$T(''.charCodeAt);

// `ToNumeric` abstract operation
// https://tc39.es/ecma262/#sec-tonumeric
var toNumeric = function (value) {
  var primValue = toPrimitive$1(value, 'number');
  return typeof primValue == 'bigint' ? primValue : toNumber(primValue);
};

// `ToNumber` abstract operation
// https://tc39.es/ecma262/#sec-tonumber
var toNumber = function (argument) {
  var it = toPrimitive$1(argument, 'number');
  var first, third, radix, maxCode, digits, length, index, code;
  if (isSymbol$2(it)) throw TypeError$5('Cannot convert a Symbol value to a number');
  if (typeof it == 'string' && it.length > 2) {
    it = trim$2(it);
    first = charCodeAt$3(it, 0);
    if (first === 43 || first === 45) {
      third = charCodeAt$3(it, 2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (charCodeAt$3(it, 1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
        default: return +it;
      }
      digits = arraySlice$7(it, 2);
      length = digits.length;
      for (index = 0; index < length; index++) {
        code = charCodeAt$3(digits, index);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

// `Number` constructor
// https://tc39.es/ecma262/#sec-number-constructor
if (isForced$2(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
  var NumberWrapper = function Number(value) {
    var n = arguments.length < 1 ? 0 : NativeNumber(toNumeric(value));
    var dummy = this;
    // check on 1..constructor(foo) case
    return isPrototypeOf$5(NumberPrototype, dummy) && fails$O(function () { thisNumberValue$3(dummy); })
      ? inheritIfRequired$3(Object(n), dummy, NumberWrapper) : n;
  };
  for (var keys$1 = DESCRIPTORS$r ? getOwnPropertyNames$3(NativeNumber) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,' +
    // ESNext
    'fromString,range'
  ).split(','), j = 0, key$2; keys$1.length > j; j++) {
    if (hasOwn$h(NativeNumber, key$2 = keys$1[j]) && !hasOwn$h(NumberWrapper, key$2)) {
      defineProperty$5(NumberWrapper, key$2, getOwnPropertyDescriptor$8(NativeNumber, key$2));
    }
  }
  NumberWrapper.prototype = NumberPrototype;
  NumberPrototype.constructor = NumberWrapper;
  defineBuiltIn$d(global$G, NUMBER, NumberWrapper, { constructor: true });
}

var $$3K = _export;

// `Number.EPSILON` constant
// https://tc39.es/ecma262/#sec-number.epsilon
$$3K({ target: 'Number', stat: true, nonConfigurable: true, nonWritable: true }, {
  EPSILON: Math.pow(2, -52)
});

var global$F = global$$;

var globalIsFinite = global$F.isFinite;

// `Number.isFinite` method
// https://tc39.es/ecma262/#sec-number.isfinite
// eslint-disable-next-line es-x/no-number-isfinite -- safe
var numberIsFinite$2 = Number.isFinite || function isFinite(it) {
  return typeof it == 'number' && globalIsFinite(it);
};

var $$3J = _export;
var numberIsFinite$1 = numberIsFinite$2;

// `Number.isFinite` method
// https://tc39.es/ecma262/#sec-number.isfinite
$$3J({ target: 'Number', stat: true }, { isFinite: numberIsFinite$1 });

var isObject$k = isObject$C;

var floor$6 = Math.floor;

// `IsIntegralNumber` abstract operation
// https://tc39.es/ecma262/#sec-isintegralnumber
// eslint-disable-next-line es-x/no-number-isinteger -- safe
var isIntegralNumber$3 = Number.isInteger || function isInteger(it) {
  return !isObject$k(it) && isFinite(it) && floor$6(it) === it;
};

var $$3I = _export;
var isIntegralNumber$2 = isIntegralNumber$3;

// `Number.isInteger` method
// https://tc39.es/ecma262/#sec-number.isinteger
$$3I({ target: 'Number', stat: true }, {
  isInteger: isIntegralNumber$2
});

var $$3H = _export;

// `Number.isNaN` method
// https://tc39.es/ecma262/#sec-number.isnan
$$3H({ target: 'Number', stat: true }, {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare -- NaN check
    return number != number;
  }
});

var $$3G = _export;
var isIntegralNumber$1 = isIntegralNumber$3;

var abs$1 = Math.abs;

// `Number.isSafeInteger` method
// https://tc39.es/ecma262/#sec-number.issafeinteger
$$3G({ target: 'Number', stat: true }, {
  isSafeInteger: function isSafeInteger(number) {
    return isIntegralNumber$1(number) && abs$1(number) <= 0x1FFFFFFFFFFFFF;
  }
});

var $$3F = _export;

// `Number.MAX_SAFE_INTEGER` constant
// https://tc39.es/ecma262/#sec-number.max_safe_integer
$$3F({ target: 'Number', stat: true, nonConfigurable: true, nonWritable: true }, {
  MAX_SAFE_INTEGER: 0x1FFFFFFFFFFFFF
});

var $$3E = _export;

// `Number.MIN_SAFE_INTEGER` constant
// https://tc39.es/ecma262/#sec-number.min_safe_integer
$$3E({ target: 'Number', stat: true, nonConfigurable: true, nonWritable: true }, {
  MIN_SAFE_INTEGER: -0x1FFFFFFFFFFFFF
});

var global$E = global$$;
var fails$N = fails$1m;
var uncurryThis$S = functionUncurryThis;
var toString$q = toString$z;
var trim$1 = stringTrim.trim;
var whitespaces$3 = whitespaces$5;

var charAt$f = uncurryThis$S(''.charAt);
var n$ParseFloat = global$E.parseFloat;
var Symbol$2 = global$E.Symbol;
var ITERATOR$5 = Symbol$2 && Symbol$2.iterator;
var FORCED$g = 1 / n$ParseFloat(whitespaces$3 + '-0') !== -Infinity
  // MS Edge 18- broken with boxed symbols
  || (ITERATOR$5 && !fails$N(function () { n$ParseFloat(Object(ITERATOR$5)); }));

// `parseFloat` method
// https://tc39.es/ecma262/#sec-parsefloat-string
var numberParseFloat = FORCED$g ? function parseFloat(string) {
  var trimmedString = trim$1(toString$q(string));
  var result = n$ParseFloat(trimmedString);
  return result === 0 && charAt$f(trimmedString, 0) == '-' ? -0 : result;
} : n$ParseFloat;

var $$3D = _export;
var parseFloat$1 = numberParseFloat;

// `Number.parseFloat` method
// https://tc39.es/ecma262/#sec-number.parseFloat
// eslint-disable-next-line es-x/no-number-parsefloat -- required for testing
$$3D({ target: 'Number', stat: true, forced: Number.parseFloat != parseFloat$1 }, {
  parseFloat: parseFloat$1
});

var global$D = global$$;
var fails$M = fails$1m;
var uncurryThis$R = functionUncurryThis;
var toString$p = toString$z;
var trim = stringTrim.trim;
var whitespaces$2 = whitespaces$5;

var $parseInt$1 = global$D.parseInt;
var Symbol$1 = global$D.Symbol;
var ITERATOR$4 = Symbol$1 && Symbol$1.iterator;
var hex = /^[+-]?0x/i;
var exec$9 = uncurryThis$R(hex.exec);
var FORCED$f = $parseInt$1(whitespaces$2 + '08') !== 8 || $parseInt$1(whitespaces$2 + '0x16') !== 22
  // MS Edge 18- broken with boxed symbols
  || (ITERATOR$4 && !fails$M(function () { $parseInt$1(Object(ITERATOR$4)); }));

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
var numberParseInt = FORCED$f ? function parseInt(string, radix) {
  var S = trim(toString$p(string));
  return $parseInt$1(S, (radix >>> 0) || (exec$9(hex, S) ? 16 : 10));
} : $parseInt$1;

var $$3C = _export;
var parseInt$3 = numberParseInt;

// `Number.parseInt` method
// https://tc39.es/ecma262/#sec-number.parseint
// eslint-disable-next-line es-x/no-number-parseint -- required for testing
$$3C({ target: 'Number', stat: true, forced: Number.parseInt != parseInt$3 }, {
  parseInt: parseInt$3
});

var $$3B = _export;
var uncurryThis$Q = functionUncurryThis;
var toIntegerOrInfinity$d = toIntegerOrInfinity$o;
var thisNumberValue$2 = thisNumberValue$4;
var $repeat$1 = stringRepeat;
var log10 = mathLog10;
var fails$L = fails$1m;

var $RangeError$8 = RangeError;
var $String$1 = String;
var $isFinite = isFinite;
var abs = Math.abs;
var floor$5 = Math.floor;
var pow$2 = Math.pow;
var round$1 = Math.round;
var un$ToExponential = uncurryThis$Q(1.0.toExponential);
var repeat$2 = uncurryThis$Q($repeat$1);
var stringSlice$e = uncurryThis$Q(''.slice);

// Edge 17-
var ROUNDS_PROPERLY = un$ToExponential(-6.9e-11, 4) === '-6.9000e-11'
  // IE11- && Edge 14-
  && un$ToExponential(1.255, 2) === '1.25e+0'
  // FF86-, V8 ~ Chrome 49-50
  && un$ToExponential(12345, 3) === '1.235e+4'
  // FF86-, V8 ~ Chrome 49-50
  && un$ToExponential(25, 0) === '3e+1';

// IE8-
var THROWS_ON_INFINITY_FRACTION = fails$L(function () {
  un$ToExponential(1, Infinity);
}) && fails$L(function () {
  un$ToExponential(1, -Infinity);
});

// Safari <11 && FF <50
var PROPER_NON_FINITE_THIS_CHECK = !fails$L(function () {
  un$ToExponential(Infinity, Infinity);
}) && !fails$L(function () {
  un$ToExponential(NaN, Infinity);
});

var FORCED$e = !ROUNDS_PROPERLY || !THROWS_ON_INFINITY_FRACTION || !PROPER_NON_FINITE_THIS_CHECK;

// `Number.prototype.toExponential` method
// https://tc39.es/ecma262/#sec-number.prototype.toexponential
$$3B({ target: 'Number', proto: true, forced: FORCED$e }, {
  toExponential: function toExponential(fractionDigits) {
    var x = thisNumberValue$2(this);
    if (fractionDigits === undefined) return un$ToExponential(x);
    var f = toIntegerOrInfinity$d(fractionDigits);
    if (!$isFinite(x)) return String(x);
    // TODO: ES2018 increased the maximum number of fraction digits to 100, need to improve the implementation
    if (f < 0 || f > 20) throw $RangeError$8('Incorrect fraction digits');
    if (ROUNDS_PROPERLY) return un$ToExponential(x, f);
    var s = '';
    var m = '';
    var e = 0;
    var c = '';
    var d = '';
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x === 0) {
      e = 0;
      m = repeat$2('0', f + 1);
    } else {
      // this block is based on https://gist.github.com/SheetJSDev/1100ad56b9f856c95299ed0e068eea08
      // TODO: improve accuracy with big fraction digits
      var l = log10(x);
      e = floor$5(l);
      var n = 0;
      var w = pow$2(10, e - f);
      n = round$1(x / w);
      if (2 * x >= (2 * n + 1) * w) {
        n += 1;
      }
      if (n >= pow$2(10, f + 1)) {
        n /= 10;
        e += 1;
      }
      m = $String$1(n);
    }
    if (f !== 0) {
      m = stringSlice$e(m, 0, 1) + '.' + stringSlice$e(m, 1);
    }
    if (e === 0) {
      c = '+';
      d = '0';
    } else {
      c = e > 0 ? '+' : '-';
      d = $String$1(abs(e));
    }
    m += 'e' + c + d;
    return s + m;
  }
});

var $$3A = _export;
var uncurryThis$P = functionUncurryThis;
var toIntegerOrInfinity$c = toIntegerOrInfinity$o;
var thisNumberValue$1 = thisNumberValue$4;
var $repeat = stringRepeat;
var fails$K = fails$1m;

var $RangeError$7 = RangeError;
var $String = String;
var floor$4 = Math.floor;
var repeat$1 = uncurryThis$P($repeat);
var stringSlice$d = uncurryThis$P(''.slice);
var un$ToFixed = uncurryThis$P(1.0.toFixed);

var pow$1 = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow$1(x, n - 1, acc * x) : pow$1(x * x, n / 2, acc);
};

var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

var multiply = function (data, n, c) {
  var index = -1;
  var c2 = c;
  while (++index < 6) {
    c2 += n * data[index];
    data[index] = c2 % 1e7;
    c2 = floor$4(c2 / 1e7);
  }
};

var divide = function (data, n) {
  var index = 6;
  var c = 0;
  while (--index >= 0) {
    c += data[index];
    data[index] = floor$4(c / n);
    c = (c % n) * 1e7;
  }
};

var dataToString = function (data) {
  var index = 6;
  var s = '';
  while (--index >= 0) {
    if (s !== '' || index === 0 || data[index] !== 0) {
      var t = $String(data[index]);
      s = s === '' ? t : s + repeat$1('0', 7 - t.length) + t;
    }
  } return s;
};

var FORCED$d = fails$K(function () {
  return un$ToFixed(0.00008, 3) !== '0.000' ||
    un$ToFixed(0.9, 0) !== '1' ||
    un$ToFixed(1.255, 2) !== '1.25' ||
    un$ToFixed(1000000000000000128.0, 0) !== '1000000000000000128';
}) || !fails$K(function () {
  // V8 ~ Android 4.3-
  un$ToFixed({});
});

// `Number.prototype.toFixed` method
// https://tc39.es/ecma262/#sec-number.prototype.tofixed
$$3A({ target: 'Number', proto: true, forced: FORCED$d }, {
  toFixed: function toFixed(fractionDigits) {
    var number = thisNumberValue$1(this);
    var fractDigits = toIntegerOrInfinity$c(fractionDigits);
    var data = [0, 0, 0, 0, 0, 0];
    var sign = '';
    var result = '0';
    var e, z, j, k;

    // TODO: ES2018 increased the maximum number of fraction digits to 100, need to improve the implementation
    if (fractDigits < 0 || fractDigits > 20) throw $RangeError$7('Incorrect fraction digits');
    // eslint-disable-next-line no-self-compare -- NaN check
    if (number != number) return 'NaN';
    if (number <= -1e21 || number >= 1e21) return $String(number);
    if (number < 0) {
      sign = '-';
      number = -number;
    }
    if (number > 1e-21) {
      e = log(number * pow$1(2, 69, 1)) - 69;
      z = e < 0 ? number * pow$1(2, -e, 1) : number / pow$1(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(data, 0, z);
        j = fractDigits;
        while (j >= 7) {
          multiply(data, 1e7, 0);
          j -= 7;
        }
        multiply(data, pow$1(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(data, 1 << 23);
          j -= 23;
        }
        divide(data, 1 << j);
        multiply(data, 1, 1);
        divide(data, 2);
        result = dataToString(data);
      } else {
        multiply(data, 0, z);
        multiply(data, 1 << -e, 0);
        result = dataToString(data) + repeat$1('0', fractDigits);
      }
    }
    if (fractDigits > 0) {
      k = result.length;
      result = sign + (k <= fractDigits
        ? '0.' + repeat$1('0', fractDigits - k) + result
        : stringSlice$d(result, 0, k - fractDigits) + '.' + stringSlice$d(result, k - fractDigits));
    } else {
      result = sign + result;
    } return result;
  }
});

var $$3z = _export;
var uncurryThis$O = functionUncurryThis;
var fails$J = fails$1m;
var thisNumberValue = thisNumberValue$4;

var un$ToPrecision = uncurryThis$O(1.0.toPrecision);

var FORCED$c = fails$J(function () {
  // IE7-
  return un$ToPrecision(1, undefined) !== '1';
}) || !fails$J(function () {
  // V8 ~ Android 4.3-
  un$ToPrecision({});
});

// `Number.prototype.toPrecision` method
// https://tc39.es/ecma262/#sec-number.prototype.toprecision
$$3z({ target: 'Number', proto: true, forced: FORCED$c }, {
  toPrecision: function toPrecision(precision) {
    return precision === undefined
      ? un$ToPrecision(thisNumberValue(this))
      : un$ToPrecision(thisNumberValue(this), precision);
  }
});

var DESCRIPTORS$q = descriptors;
var uncurryThis$N = functionUncurryThis;
var call$U = functionCall;
var fails$I = fails$1m;
var objectKeys$3 = objectKeys$6;
var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
var propertyIsEnumerableModule = objectPropertyIsEnumerable;
var toObject$i = toObject$B;
var IndexedObject$2 = indexedObject;

// eslint-disable-next-line es-x/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
var defineProperty$4 = Object.defineProperty;
var concat$2 = uncurryThis$N([].concat);

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
var objectAssign = !$assign || fails$I(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS$q && $assign({ b: 1 }, $assign(defineProperty$4({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty$4(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es-x/no-symbol -- safe
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] != 7 || objectKeys$3($assign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject$i(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject$2(arguments[index++]);
    var keys = getOwnPropertySymbols ? concat$2(objectKeys$3(S), getOwnPropertySymbols(S)) : objectKeys$3(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS$q || call$U(propertyIsEnumerable, S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;

var $$3y = _export;
var assign$1 = objectAssign;

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
// eslint-disable-next-line es-x/no-object-assign -- required for testing
$$3y({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== assign$1 }, {
  assign: assign$1
});

// TODO: Remove from `core-js@4`
var $$3x = _export;
var DESCRIPTORS$p = descriptors;
var create$a = objectCreate$1;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
$$3x({ target: 'Object', stat: true, sham: !DESCRIPTORS$p }, {
  create: create$a
});

var global$C = global$$;
var fails$H = fails$1m;
var WEBKIT$1 = engineWebkitVersion;

// Forced replacement object prototype accessors methods
var objectPrototypeAccessorsForced = !fails$H(function () {
  // This feature detection crashes old WebKit
  // https://github.com/zloirock/core-js/issues/232
  if (WEBKIT$1 && WEBKIT$1 < 535) return;
  var key = Math.random();
  // In FF throws only define methods
  // eslint-disable-next-line no-undef, no-useless-call, es-x/no-legacy-object-prototype-accessor-methods -- required for testing
  __defineSetter__.call(null, key, function () { /* empty */ });
  delete global$C[key];
});

var $$3w = _export;
var DESCRIPTORS$o = descriptors;
var FORCED$b = objectPrototypeAccessorsForced;
var aCallable$P = aCallable$X;
var toObject$h = toObject$B;
var definePropertyModule$4 = objectDefineProperty;

// `Object.prototype.__defineGetter__` method
// https://tc39.es/ecma262/#sec-object.prototype.__defineGetter__
if (DESCRIPTORS$o) {
  $$3w({ target: 'Object', proto: true, forced: FORCED$b }, {
    __defineGetter__: function __defineGetter__(P, getter) {
      definePropertyModule$4.f(toObject$h(this), P, { get: aCallable$P(getter), enumerable: true, configurable: true });
    }
  });
}

var $$3v = _export;
var DESCRIPTORS$n = descriptors;
var defineProperties$1 = objectDefineProperties.f;

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es-x/no-object-defineproperties -- safe
$$3v({ target: 'Object', stat: true, forced: Object.defineProperties !== defineProperties$1, sham: !DESCRIPTORS$n }, {
  defineProperties: defineProperties$1
});

var $$3u = _export;
var DESCRIPTORS$m = descriptors;
var defineProperty$3 = objectDefineProperty.f;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
$$3u({ target: 'Object', stat: true, forced: Object.defineProperty !== defineProperty$3, sham: !DESCRIPTORS$m }, {
  defineProperty: defineProperty$3
});

var $$3t = _export;
var DESCRIPTORS$l = descriptors;
var FORCED$a = objectPrototypeAccessorsForced;
var aCallable$O = aCallable$X;
var toObject$g = toObject$B;
var definePropertyModule$3 = objectDefineProperty;

// `Object.prototype.__defineSetter__` method
// https://tc39.es/ecma262/#sec-object.prototype.__defineSetter__
if (DESCRIPTORS$l) {
  $$3t({ target: 'Object', proto: true, forced: FORCED$a }, {
    __defineSetter__: function __defineSetter__(P, setter) {
      definePropertyModule$3.f(toObject$g(this), P, { set: aCallable$O(setter), enumerable: true, configurable: true });
    }
  });
}

var DESCRIPTORS$k = descriptors;
var uncurryThis$M = functionUncurryThis;
var objectKeys$2 = objectKeys$6;
var toIndexedObject$9 = toIndexedObject$k;
var $propertyIsEnumerable = objectPropertyIsEnumerable.f;

var propertyIsEnumerable = uncurryThis$M($propertyIsEnumerable);
var push$h = uncurryThis$M([].push);

// `Object.{ entries, values }` methods implementation
var createMethod$2 = function (TO_ENTRIES) {
  return function (it) {
    var O = toIndexedObject$9(it);
    var keys = objectKeys$2(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!DESCRIPTORS$k || propertyIsEnumerable(O, key)) {
        push$h(result, TO_ENTRIES ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};

var objectToArray = {
  // `Object.entries` method
  // https://tc39.es/ecma262/#sec-object.entries
  entries: createMethod$2(true),
  // `Object.values` method
  // https://tc39.es/ecma262/#sec-object.values
  values: createMethod$2(false)
};

var $$3s = _export;
var $entries = objectToArray.entries;

// `Object.entries` method
// https://tc39.es/ecma262/#sec-object.entries
$$3s({ target: 'Object', stat: true }, {
  entries: function entries(O) {
    return $entries(O);
  }
});

var $$3r = _export;
var FREEZING$3 = freezing;
var fails$G = fails$1m;
var isObject$j = isObject$C;
var onFreeze$2 = internalMetadata.exports.onFreeze;

// eslint-disable-next-line es-x/no-object-freeze -- safe
var $freeze = Object.freeze;
var FAILS_ON_PRIMITIVES$8 = fails$G(function () { $freeze(1); });

// `Object.freeze` method
// https://tc39.es/ecma262/#sec-object.freeze
$$3r({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$8, sham: !FREEZING$3 }, {
  freeze: function freeze(it) {
    return $freeze && isObject$j(it) ? $freeze(onFreeze$2(it)) : it;
  }
});

var $$3q = _export;
var iterate$F = iterate$J;
var createProperty$2 = createProperty$9;

// `Object.fromEntries` method
// https://github.com/tc39/proposal-object-from-entries
$$3q({ target: 'Object', stat: true }, {
  fromEntries: function fromEntries(iterable) {
    var obj = {};
    iterate$F(iterable, function (k, v) {
      createProperty$2(obj, k, v);
    }, { AS_ENTRIES: true });
    return obj;
  }
});

var $$3p = _export;
var fails$F = fails$1m;
var toIndexedObject$8 = toIndexedObject$k;
var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
var DESCRIPTORS$j = descriptors;

var FAILS_ON_PRIMITIVES$7 = fails$F(function () { nativeGetOwnPropertyDescriptor$1(1); });
var FORCED$9 = !DESCRIPTORS$j || FAILS_ON_PRIMITIVES$7;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
$$3p({ target: 'Object', stat: true, forced: FORCED$9, sham: !DESCRIPTORS$j }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor$1(toIndexedObject$8(it), key);
  }
});

var $$3o = _export;
var DESCRIPTORS$i = descriptors;
var ownKeys$1 = ownKeys$3;
var toIndexedObject$7 = toIndexedObject$k;
var getOwnPropertyDescriptorModule$4 = objectGetOwnPropertyDescriptor;
var createProperty$1 = createProperty$9;

// `Object.getOwnPropertyDescriptors` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
$$3o({ target: 'Object', stat: true, sham: !DESCRIPTORS$i }, {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIndexedObject$7(object);
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule$4.f;
    var keys = ownKeys$1(O);
    var result = {};
    var index = 0;
    var key, descriptor;
    while (keys.length > index) {
      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
      if (descriptor !== undefined) createProperty$1(result, key, descriptor);
    }
    return result;
  }
});

var $$3n = _export;
var fails$E = fails$1m;
var getOwnPropertyNames$2 = objectGetOwnPropertyNamesExternal.f;

// eslint-disable-next-line es-x/no-object-getownpropertynames -- required for testing
var FAILS_ON_PRIMITIVES$6 = fails$E(function () { return !Object.getOwnPropertyNames(1); });

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
$$3n({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$6 }, {
  getOwnPropertyNames: getOwnPropertyNames$2
});

var $$3m = _export;
var fails$D = fails$1m;
var toObject$f = toObject$B;
var nativeGetPrototypeOf = objectGetPrototypeOf$1;
var CORRECT_PROTOTYPE_GETTER$1 = correctPrototypeGetter;

var FAILS_ON_PRIMITIVES$5 = fails$D(function () { nativeGetPrototypeOf(1); });

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
$$3m({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$5, sham: !CORRECT_PROTOTYPE_GETTER$1 }, {
  getPrototypeOf: function getPrototypeOf(it) {
    return nativeGetPrototypeOf(toObject$f(it));
  }
});

var $$3l = _export;
var hasOwn$g = hasOwnProperty_1;

// `Object.hasOwn` method
// https://github.com/tc39/proposal-accessible-object-hasownproperty
$$3l({ target: 'Object', stat: true }, {
  hasOwn: hasOwn$g
});

// `SameValue` abstract operation
// https://tc39.es/ecma262/#sec-samevalue
// eslint-disable-next-line es-x/no-object-is -- safe
var sameValue$1 = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare -- NaN check
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

var $$3k = _export;
var is = sameValue$1;

// `Object.is` method
// https://tc39.es/ecma262/#sec-object.is
$$3k({ target: 'Object', stat: true }, {
  is: is
});

var $$3j = _export;
var $isExtensible$1 = objectIsExtensible;

// `Object.isExtensible` method
// https://tc39.es/ecma262/#sec-object.isextensible
// eslint-disable-next-line es-x/no-object-isextensible -- safe
$$3j({ target: 'Object', stat: true, forced: Object.isExtensible !== $isExtensible$1 }, {
  isExtensible: $isExtensible$1
});

var $$3i = _export;
var fails$C = fails$1m;
var isObject$i = isObject$C;
var classof$c = classofRaw$1;
var ARRAY_BUFFER_NON_EXTENSIBLE$1 = arrayBufferNonExtensible;

// eslint-disable-next-line es-x/no-object-isfrozen -- safe
var $isFrozen = Object.isFrozen;
var FAILS_ON_PRIMITIVES$4 = fails$C(function () { $isFrozen(1); });

// `Object.isFrozen` method
// https://tc39.es/ecma262/#sec-object.isfrozen
$$3i({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$4 || ARRAY_BUFFER_NON_EXTENSIBLE$1 }, {
  isFrozen: function isFrozen(it) {
    if (!isObject$i(it)) return true;
    if (ARRAY_BUFFER_NON_EXTENSIBLE$1 && classof$c(it) == 'ArrayBuffer') return true;
    return $isFrozen ? $isFrozen(it) : false;
  }
});

var $$3h = _export;
var fails$B = fails$1m;
var isObject$h = isObject$C;
var classof$b = classofRaw$1;
var ARRAY_BUFFER_NON_EXTENSIBLE = arrayBufferNonExtensible;

// eslint-disable-next-line es-x/no-object-issealed -- safe
var $isSealed = Object.isSealed;
var FAILS_ON_PRIMITIVES$3 = fails$B(function () { $isSealed(1); });

// `Object.isSealed` method
// https://tc39.es/ecma262/#sec-object.issealed
$$3h({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$3 || ARRAY_BUFFER_NON_EXTENSIBLE }, {
  isSealed: function isSealed(it) {
    if (!isObject$h(it)) return true;
    if (ARRAY_BUFFER_NON_EXTENSIBLE && classof$b(it) == 'ArrayBuffer') return true;
    return $isSealed ? $isSealed(it) : false;
  }
});

var $$3g = _export;
var toObject$e = toObject$B;
var nativeKeys = objectKeys$6;
var fails$A = fails$1m;

var FAILS_ON_PRIMITIVES$2 = fails$A(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
$$3g({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2 }, {
  keys: function keys(it) {
    return nativeKeys(toObject$e(it));
  }
});

var $$3f = _export;
var DESCRIPTORS$h = descriptors;
var FORCED$8 = objectPrototypeAccessorsForced;
var toObject$d = toObject$B;
var toPropertyKey$4 = toPropertyKey$9;
var getPrototypeOf$7 = objectGetPrototypeOf$1;
var getOwnPropertyDescriptor$7 = objectGetOwnPropertyDescriptor.f;

// `Object.prototype.__lookupGetter__` method
// https://tc39.es/ecma262/#sec-object.prototype.__lookupGetter__
if (DESCRIPTORS$h) {
  $$3f({ target: 'Object', proto: true, forced: FORCED$8 }, {
    __lookupGetter__: function __lookupGetter__(P) {
      var O = toObject$d(this);
      var key = toPropertyKey$4(P);
      var desc;
      do {
        if (desc = getOwnPropertyDescriptor$7(O, key)) return desc.get;
      } while (O = getPrototypeOf$7(O));
    }
  });
}

var $$3e = _export;
var DESCRIPTORS$g = descriptors;
var FORCED$7 = objectPrototypeAccessorsForced;
var toObject$c = toObject$B;
var toPropertyKey$3 = toPropertyKey$9;
var getPrototypeOf$6 = objectGetPrototypeOf$1;
var getOwnPropertyDescriptor$6 = objectGetOwnPropertyDescriptor.f;

// `Object.prototype.__lookupSetter__` method
// https://tc39.es/ecma262/#sec-object.prototype.__lookupSetter__
if (DESCRIPTORS$g) {
  $$3e({ target: 'Object', proto: true, forced: FORCED$7 }, {
    __lookupSetter__: function __lookupSetter__(P) {
      var O = toObject$c(this);
      var key = toPropertyKey$3(P);
      var desc;
      do {
        if (desc = getOwnPropertyDescriptor$6(O, key)) return desc.set;
      } while (O = getPrototypeOf$6(O));
    }
  });
}

var $$3d = _export;
var isObject$g = isObject$C;
var onFreeze$1 = internalMetadata.exports.onFreeze;
var FREEZING$2 = freezing;
var fails$z = fails$1m;

// eslint-disable-next-line es-x/no-object-preventextensions -- safe
var $preventExtensions = Object.preventExtensions;
var FAILS_ON_PRIMITIVES$1 = fails$z(function () { $preventExtensions(1); });

// `Object.preventExtensions` method
// https://tc39.es/ecma262/#sec-object.preventextensions
$$3d({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1, sham: !FREEZING$2 }, {
  preventExtensions: function preventExtensions(it) {
    return $preventExtensions && isObject$g(it) ? $preventExtensions(onFreeze$1(it)) : it;
  }
});

var $$3c = _export;
var isObject$f = isObject$C;
var onFreeze = internalMetadata.exports.onFreeze;
var FREEZING$1 = freezing;
var fails$y = fails$1m;

// eslint-disable-next-line es-x/no-object-seal -- safe
var $seal = Object.seal;
var FAILS_ON_PRIMITIVES = fails$y(function () { $seal(1); });

// `Object.seal` method
// https://tc39.es/ecma262/#sec-object.seal
$$3c({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !FREEZING$1 }, {
  seal: function seal(it) {
    return $seal && isObject$f(it) ? $seal(onFreeze(it)) : it;
  }
});

var $$3b = _export;
var setPrototypeOf$2 = objectSetPrototypeOf$1;

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
$$3b({ target: 'Object', stat: true }, {
  setPrototypeOf: setPrototypeOf$2
});

var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;
var classof$a = classof$l;

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
var objectToString = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
  return '[object ' + classof$a(this) + ']';
};

var TO_STRING_TAG_SUPPORT = toStringTagSupport;
var defineBuiltIn$c = defineBuiltIn$p;
var toString$o = objectToString;

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  defineBuiltIn$c(Object.prototype, 'toString', toString$o, { unsafe: true });
}

var $$3a = _export;
var $values = objectToArray.values;

// `Object.values` method
// https://tc39.es/ecma262/#sec-object.values
$$3a({ target: 'Object', stat: true }, {
  values: function values(O) {
    return $values(O);
  }
});

var $$39 = _export;
var $parseFloat = numberParseFloat;

// `parseFloat` method
// https://tc39.es/ecma262/#sec-parsefloat-string
$$39({ global: true, forced: parseFloat != $parseFloat }, {
  parseFloat: $parseFloat
});

var $$38 = _export;
var $parseInt = numberParseInt;

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
$$38({ global: true, forced: parseInt != $parseInt }, {
  parseInt: $parseInt
});

var $TypeError$k = TypeError;

var validateArgumentsLength$8 = function (passed, required) {
  if (passed < required) throw $TypeError$k('Not enough arguments');
  return passed;
};

var userAgent$4 = engineUserAgent;

var engineIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent$4);

var global$B = global$$;
var apply$l = functionApply$1;
var bind$m = functionBindContext;
var isCallable$h = isCallable$E;
var hasOwn$f = hasOwnProperty_1;
var fails$x = fails$1m;
var html = html$2;
var arraySlice$6 = arraySlice$c;
var createElement = documentCreateElement$2;
var validateArgumentsLength$7 = validateArgumentsLength$8;
var IS_IOS$1 = engineIsIos;
var IS_NODE$5 = engineIsNode;

var set$1 = global$B.setImmediate;
var clear = global$B.clearImmediate;
var process$3 = global$B.process;
var Dispatch = global$B.Dispatch;
var Function$2 = global$B.Function;
var MessageChannel = global$B.MessageChannel;
var String$1 = global$B.String;
var counter = 0;
var queue$1 = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var location, defer, channel, port;

try {
  // Deno throws a ReferenceError on `location` access without `--location` flag
  location = global$B.location;
} catch (error) { /* empty */ }

var run = function (id) {
  if (hasOwn$f(queue$1, id)) {
    var fn = queue$1[id];
    delete queue$1[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global$B.postMessage(String$1(id), location.protocol + '//' + location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set$1 || !clear) {
  set$1 = function setImmediate(handler) {
    validateArgumentsLength$7(arguments.length, 1);
    var fn = isCallable$h(handler) ? handler : Function$2(handler);
    var args = arraySlice$6(arguments, 1);
    queue$1[++counter] = function () {
      apply$l(fn, undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue$1[id];
  };
  // Node.js 0.8-
  if (IS_NODE$5) {
    defer = function (id) {
      process$3.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS$1) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = bind$m(port.postMessage, port);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global$B.addEventListener &&
    isCallable$h(global$B.postMessage) &&
    !global$B.importScripts &&
    location && location.protocol !== 'file:' &&
    !fails$x(post)
  ) {
    defer = post;
    global$B.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

var task$1 = {
  set: set$1,
  clear: clear
};

var userAgent$3 = engineUserAgent;
var global$A = global$$;

var engineIsIosPebble = /ipad|iphone|ipod/i.test(userAgent$3) && global$A.Pebble !== undefined;

var userAgent$2 = engineUserAgent;

var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(userAgent$2);

var global$z = global$$;
var bind$l = functionBindContext;
var getOwnPropertyDescriptor$5 = objectGetOwnPropertyDescriptor.f;
var macrotask = task$1.set;
var IS_IOS = engineIsIos;
var IS_IOS_PEBBLE = engineIsIosPebble;
var IS_WEBOS_WEBKIT = engineIsWebosWebkit;
var IS_NODE$4 = engineIsNode;

var MutationObserver = global$z.MutationObserver || global$z.WebKitMutationObserver;
var document$2 = global$z.document;
var process$2 = global$z.process;
var Promise$4 = global$z.Promise;
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor$5(global$z, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify$1, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (IS_NODE$4 && (parent = process$2.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify$1();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
  if (!IS_IOS && !IS_NODE$4 && !IS_WEBOS_WEBKIT && MutationObserver && document$2) {
    toggle = true;
    node = document$2.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify$1 = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (!IS_IOS_PEBBLE && Promise$4 && Promise$4.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise$4.resolve(undefined);
    // workaround of WebKit ~ iOS Safari 10.1 bug
    promise.constructor = Promise$4;
    then = bind$l(promise.then, promise);
    notify$1 = function () {
      then(flush);
    };
  // Node.js without promises
  } else if (IS_NODE$4) {
    notify$1 = function () {
      process$2.nextTick(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessage
  // - onreadystatechange
  // - setTimeout
  } else {
    // strange IE + webpack dev server bug - use .bind(global)
    macrotask = bind$l(macrotask, global$z);
    notify$1 = function () {
      macrotask(flush);
    };
  }
}

var microtask$2 = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify$1();
  } last = task;
};

var global$y = global$$;

var hostReportErrors$2 = function (a, b) {
  var console = global$y.console;
  if (console && console.error) {
    arguments.length == 1 ? console.error(a) : console.error(a, b);
  }
};

var perform$6 = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};

var Queue$1 = function () {
  this.head = null;
  this.tail = null;
};

Queue$1.prototype = {
  add: function (item) {
    var entry = { item: item, next: null };
    if (this.head) this.tail.next = entry;
    else this.head = entry;
    this.tail = entry;
  },
  get: function () {
    var entry = this.head;
    if (entry) {
      this.head = entry.next;
      if (this.tail === entry) this.tail = null;
      return entry.item;
    }
  }
};

var queue = Queue$1;

var global$x = global$$;

var promiseNativeConstructor = global$x.Promise;

var engineIsBrowser = typeof window == 'object' && typeof Deno != 'object';

var global$w = global$$;
var NativePromiseConstructor$4 = promiseNativeConstructor;
var isCallable$g = isCallable$E;
var isForced$1 = isForced_1;
var inspectSource$1 = inspectSource$5;
var wellKnownSymbol$m = wellKnownSymbol$K;
var IS_BROWSER$1 = engineIsBrowser;
var V8_VERSION = engineV8Version;

NativePromiseConstructor$4 && NativePromiseConstructor$4.prototype;
var SPECIES$1 = wellKnownSymbol$m('species');
var SUBCLASSING = false;
var NATIVE_PROMISE_REJECTION_EVENT$1 = isCallable$g(global$w.PromiseRejectionEvent);

var FORCED_PROMISE_CONSTRUCTOR$5 = isForced$1('Promise', function () {
  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource$1(NativePromiseConstructor$4);
  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor$4);
  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
  // We can't detect it synchronously, so just check versions
  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (V8_VERSION >= 51 && /native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = new NativePromiseConstructor$4(function (resolve) { resolve(1); });
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES$1] = FakePromise;
  SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
  if (!SUBCLASSING) return true;
  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
  return !GLOBAL_CORE_JS_PROMISE && IS_BROWSER$1 && !NATIVE_PROMISE_REJECTION_EVENT$1;
});

var promiseConstructorDetection = {
  CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR$5,
  REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT$1,
  SUBCLASSING: SUBCLASSING
};

var newPromiseCapability$2 = {};

var aCallable$N = aCallable$X;

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aCallable$N(resolve);
  this.reject = aCallable$N(reject);
};

// `NewPromiseCapability` abstract operation
// https://tc39.es/ecma262/#sec-newpromisecapability
newPromiseCapability$2.f = function (C) {
  return new PromiseCapability(C);
};

var $$37 = _export;
var IS_NODE$3 = engineIsNode;
var global$v = global$$;
var call$T = functionCall;
var defineBuiltIn$b = defineBuiltIn$p;
var setPrototypeOf$1 = objectSetPrototypeOf$1;
var setToStringTag$4 = setToStringTag$d;
var setSpecies$3 = setSpecies$7;
var aCallable$M = aCallable$X;
var isCallable$f = isCallable$E;
var isObject$e = isObject$C;
var anInstance$9 = anInstance$d;
var speciesConstructor$d = speciesConstructor$f;
var task = task$1.set;
var microtask$1 = microtask$2;
var hostReportErrors$1 = hostReportErrors$2;
var perform$5 = perform$6;
var Queue = queue;
var InternalStateModule$f = internalState;
var NativePromiseConstructor$3 = promiseNativeConstructor;
var PromiseConstructorDetection = promiseConstructorDetection;
var newPromiseCapabilityModule$6 = newPromiseCapability$2;

var PROMISE = 'Promise';
var FORCED_PROMISE_CONSTRUCTOR$4 = PromiseConstructorDetection.CONSTRUCTOR;
var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
var NATIVE_PROMISE_SUBCLASSING = PromiseConstructorDetection.SUBCLASSING;
var getInternalPromiseState = InternalStateModule$f.getterFor(PROMISE);
var setInternalState$f = InternalStateModule$f.set;
var NativePromisePrototype$2 = NativePromiseConstructor$3 && NativePromiseConstructor$3.prototype;
var PromiseConstructor = NativePromiseConstructor$3;
var PromisePrototype = NativePromisePrototype$2;
var TypeError$4 = global$v.TypeError;
var document$1 = global$v.document;
var process$1 = global$v.process;
var newPromiseCapability$1 = newPromiseCapabilityModule$6.f;
var newGenericPromiseCapability = newPromiseCapability$1;

var DISPATCH_EVENT = !!(document$1 && document$1.createEvent && global$v.dispatchEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;

var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

// helpers
var isThenable = function (it) {
  var then;
  return isObject$e(it) && isCallable$f(then = it.then) ? then : false;
};

var callReaction = function (reaction, state) {
  var value = state.value;
  var ok = state.state == FULFILLED;
  var handler = ok ? reaction.ok : reaction.fail;
  var resolve = reaction.resolve;
  var reject = reaction.reject;
  var domain = reaction.domain;
  var result, then, exited;
  try {
    if (handler) {
      if (!ok) {
        if (state.rejection === UNHANDLED) onHandleUnhandled(state);
        state.rejection = HANDLED;
      }
      if (handler === true) result = value;
      else {
        if (domain) domain.enter();
        result = handler(value); // can throw
        if (domain) {
          domain.exit();
          exited = true;
        }
      }
      if (result === reaction.promise) {
        reject(TypeError$4('Promise-chain cycle'));
      } else if (then = isThenable(result)) {
        call$T(then, result, resolve, reject);
      } else resolve(result);
    } else reject(value);
  } catch (error) {
    if (domain && !exited) domain.exit();
    reject(error);
  }
};

var notify = function (state, isReject) {
  if (state.notified) return;
  state.notified = true;
  microtask$1(function () {
    var reactions = state.reactions;
    var reaction;
    while (reaction = reactions.get()) {
      callReaction(reaction, state);
    }
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document$1.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global$v.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = global$v['on' + name])) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors$1('Unhandled promise rejection', reason);
};

var onUnhandled = function (state) {
  call$T(task, global$v, function () {
    var promise = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform$5(function () {
        if (IS_NODE$3) {
          process$1.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE$3 || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (state) {
  call$T(task, global$v, function () {
    var promise = state.facade;
    if (IS_NODE$3) {
      process$1.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind$k = function (fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};

var internalReject = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(state, true);
};

var internalResolve = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value) throw TypeError$4("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask$1(function () {
        var wrapper = { done: false };
        try {
          call$T(then, value,
            bind$k(internalResolve, wrapper, state),
            bind$k(internalReject, wrapper, state)
          );
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(state, false);
    }
  } catch (error) {
    internalReject({ done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED_PROMISE_CONSTRUCTOR$4) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance$9(this, PromisePrototype);
    aCallable$M(executor);
    call$T(Internal, this);
    var state = getInternalPromiseState(this);
    try {
      executor(bind$k(internalResolve, state), bind$k(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };

  PromisePrototype = PromiseConstructor.prototype;

  // eslint-disable-next-line no-unused-vars -- required for `.length`
  Internal = function Promise(executor) {
    setInternalState$f(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: new Queue(),
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };

  // `Promise.prototype.then` method
  // https://tc39.es/ecma262/#sec-promise.prototype.then
  Internal.prototype = defineBuiltIn$b(PromisePrototype, 'then', function then(onFulfilled, onRejected) {
    var state = getInternalPromiseState(this);
    var reaction = newPromiseCapability$1(speciesConstructor$d(this, PromiseConstructor));
    state.parent = true;
    reaction.ok = isCallable$f(onFulfilled) ? onFulfilled : true;
    reaction.fail = isCallable$f(onRejected) && onRejected;
    reaction.domain = IS_NODE$3 ? process$1.domain : undefined;
    if (state.state == PENDING) state.reactions.add(reaction);
    else microtask$1(function () {
      callReaction(reaction, state);
    });
    return reaction.promise;
  });

  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalPromiseState(promise);
    this.promise = promise;
    this.resolve = bind$k(internalResolve, state);
    this.reject = bind$k(internalReject, state);
  };

  newPromiseCapabilityModule$6.f = newPromiseCapability$1 = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if (isCallable$f(NativePromiseConstructor$3) && NativePromisePrototype$2 !== Object.prototype) {
    nativeThen = NativePromisePrototype$2.then;

    if (!NATIVE_PROMISE_SUBCLASSING) {
      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
      defineBuiltIn$b(NativePromisePrototype$2, 'then', function then(onFulfilled, onRejected) {
        var that = this;
        return new PromiseConstructor(function (resolve, reject) {
          call$T(nativeThen, that, resolve, reject);
        }).then(onFulfilled, onRejected);
      // https://github.com/zloirock/core-js/issues/640
      }, { unsafe: true });
    }

    // make `.constructor === Promise` work for native promise-based APIs
    try {
      delete NativePromisePrototype$2.constructor;
    } catch (error) { /* empty */ }

    // make `instanceof Promise` work for native promise-based APIs
    if (setPrototypeOf$1) {
      setPrototypeOf$1(NativePromisePrototype$2, PromisePrototype);
    }
  }
}

$$37({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR$4 }, {
  Promise: PromiseConstructor
});

setToStringTag$4(PromiseConstructor, PROMISE, false);
setSpecies$3(PROMISE);

var NativePromiseConstructor$2 = promiseNativeConstructor;
var checkCorrectnessOfIteration$1 = checkCorrectnessOfIteration$4;
var FORCED_PROMISE_CONSTRUCTOR$3 = promiseConstructorDetection.CONSTRUCTOR;

var promiseStaticsIncorrectIteration = FORCED_PROMISE_CONSTRUCTOR$3 || !checkCorrectnessOfIteration$1(function (iterable) {
  NativePromiseConstructor$2.all(iterable).then(undefined, function () { /* empty */ });
});

var $$36 = _export;
var call$S = functionCall;
var aCallable$L = aCallable$X;
var newPromiseCapabilityModule$5 = newPromiseCapability$2;
var perform$4 = perform$6;
var iterate$E = iterate$J;
var PROMISE_STATICS_INCORRECT_ITERATION$1 = promiseStaticsIncorrectIteration;

// `Promise.all` method
// https://tc39.es/ecma262/#sec-promise.all
$$36({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION$1 }, {
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule$5.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform$4(function () {
      var $promiseResolve = aCallable$L(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate$E(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        call$S($promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

var $$35 = _export;
var FORCED_PROMISE_CONSTRUCTOR$2 = promiseConstructorDetection.CONSTRUCTOR;
var NativePromiseConstructor$1 = promiseNativeConstructor;
var getBuiltIn$y = getBuiltIn$L;
var isCallable$e = isCallable$E;
var defineBuiltIn$a = defineBuiltIn$p;

var NativePromisePrototype$1 = NativePromiseConstructor$1 && NativePromiseConstructor$1.prototype;

// `Promise.prototype.catch` method
// https://tc39.es/ecma262/#sec-promise.prototype.catch
$$35({ target: 'Promise', proto: true, forced: FORCED_PROMISE_CONSTRUCTOR$2, real: true }, {
  'catch': function (onRejected) {
    return this.then(undefined, onRejected);
  }
});

// makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
if (isCallable$e(NativePromiseConstructor$1)) {
  var method$1 = getBuiltIn$y('Promise').prototype['catch'];
  if (NativePromisePrototype$1['catch'] !== method$1) {
    defineBuiltIn$a(NativePromisePrototype$1, 'catch', method$1, { unsafe: true });
  }
}

var $$34 = _export;
var call$R = functionCall;
var aCallable$K = aCallable$X;
var newPromiseCapabilityModule$4 = newPromiseCapability$2;
var perform$3 = perform$6;
var iterate$D = iterate$J;
var PROMISE_STATICS_INCORRECT_ITERATION = promiseStaticsIncorrectIteration;

// `Promise.race` method
// https://tc39.es/ecma262/#sec-promise.race
$$34({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule$4.f(C);
    var reject = capability.reject;
    var result = perform$3(function () {
      var $promiseResolve = aCallable$K(C.resolve);
      iterate$D(iterable, function (promise) {
        call$R($promiseResolve, C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

var $$33 = _export;
var call$Q = functionCall;
var newPromiseCapabilityModule$3 = newPromiseCapability$2;
var FORCED_PROMISE_CONSTRUCTOR$1 = promiseConstructorDetection.CONSTRUCTOR;

// `Promise.reject` method
// https://tc39.es/ecma262/#sec-promise.reject
$$33({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR$1 }, {
  reject: function reject(r) {
    var capability = newPromiseCapabilityModule$3.f(this);
    call$Q(capability.reject, undefined, r);
    return capability.promise;
  }
});

var anObject$1l = anObject$1A;
var isObject$d = isObject$C;
var newPromiseCapability = newPromiseCapability$2;

var promiseResolve$2 = function (C, x) {
  anObject$1l(C);
  if (isObject$d(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var $$32 = _export;
var getBuiltIn$x = getBuiltIn$L;
var FORCED_PROMISE_CONSTRUCTOR = promiseConstructorDetection.CONSTRUCTOR;
var promiseResolve$1 = promiseResolve$2;

getBuiltIn$x('Promise');

// `Promise.resolve` method
// https://tc39.es/ecma262/#sec-promise.resolve
$$32({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
  resolve: function resolve(x) {
    return promiseResolve$1(this, x);
  }
});

var $$31 = _export;
var call$P = functionCall;
var aCallable$J = aCallable$X;
var newPromiseCapabilityModule$2 = newPromiseCapability$2;
var perform$2 = perform$6;
var iterate$C = iterate$J;

// `Promise.allSettled` method
// https://tc39.es/ecma262/#sec-promise.allsettled
$$31({ target: 'Promise', stat: true }, {
  allSettled: function allSettled(iterable) {
    var C = this;
    var capability = newPromiseCapabilityModule$2.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform$2(function () {
      var promiseResolve = aCallable$J(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate$C(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        call$P(promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'fulfilled', value: value };
          --remaining || resolve(values);
        }, function (error) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'rejected', reason: error };
          --remaining || resolve(values);
        });
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

var $$30 = _export;
var call$O = functionCall;
var aCallable$I = aCallable$X;
var getBuiltIn$w = getBuiltIn$L;
var newPromiseCapabilityModule$1 = newPromiseCapability$2;
var perform$1 = perform$6;
var iterate$B = iterate$J;

var PROMISE_ANY_ERROR = 'No one promise resolved';

// `Promise.any` method
// https://tc39.es/ecma262/#sec-promise.any
$$30({ target: 'Promise', stat: true }, {
  any: function any(iterable) {
    var C = this;
    var AggregateError = getBuiltIn$w('AggregateError');
    var capability = newPromiseCapabilityModule$1.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform$1(function () {
      var promiseResolve = aCallable$I(C.resolve);
      var errors = [];
      var counter = 0;
      var remaining = 1;
      var alreadyResolved = false;
      iterate$B(iterable, function (promise) {
        var index = counter++;
        var alreadyRejected = false;
        remaining++;
        call$O(promiseResolve, C, promise).then(function (value) {
          if (alreadyRejected || alreadyResolved) return;
          alreadyResolved = true;
          resolve(value);
        }, function (error) {
          if (alreadyRejected || alreadyResolved) return;
          alreadyRejected = true;
          errors[index] = error;
          --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
        });
      });
      --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

var $$2$ = _export;
var NativePromiseConstructor = promiseNativeConstructor;
var fails$w = fails$1m;
var getBuiltIn$v = getBuiltIn$L;
var isCallable$d = isCallable$E;
var speciesConstructor$c = speciesConstructor$f;
var promiseResolve = promiseResolve$2;
var defineBuiltIn$9 = defineBuiltIn$p;

var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
var NON_GENERIC = !!NativePromiseConstructor && fails$w(function () {
  // eslint-disable-next-line unicorn/no-thenable -- required for testing
  NativePromisePrototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
});

// `Promise.prototype.finally` method
// https://tc39.es/ecma262/#sec-promise.prototype.finally
$$2$({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
  'finally': function (onFinally) {
    var C = speciesConstructor$c(this, getBuiltIn$v('Promise'));
    var isFunction = isCallable$d(onFinally);
    return this.then(
      isFunction ? function (x) {
        return promiseResolve(C, onFinally()).then(function () { return x; });
      } : onFinally,
      isFunction ? function (e) {
        return promiseResolve(C, onFinally()).then(function () { throw e; });
      } : onFinally
    );
  }
});

// makes sure that native promise-based APIs `Promise#finally` properly works with patched `Promise#then`
if (isCallable$d(NativePromiseConstructor)) {
  var method = getBuiltIn$v('Promise').prototype['finally'];
  if (NativePromisePrototype['finally'] !== method) {
    defineBuiltIn$9(NativePromisePrototype, 'finally', method, { unsafe: true });
  }
}

var $$2_ = _export;
var functionApply = functionApply$1;
var aCallable$H = aCallable$X;
var anObject$1k = anObject$1A;
var fails$v = fails$1m;

// MS Edge argumentsList argument is optional
var OPTIONAL_ARGUMENTS_LIST = !fails$v(function () {
  // eslint-disable-next-line es-x/no-reflect -- required for testing
  Reflect.apply(function () { /* empty */ });
});

// `Reflect.apply` method
// https://tc39.es/ecma262/#sec-reflect.apply
$$2_({ target: 'Reflect', stat: true, forced: OPTIONAL_ARGUMENTS_LIST }, {
  apply: function apply(target, thisArgument, argumentsList) {
    return functionApply(aCallable$H(target), thisArgument, anObject$1k(argumentsList));
  }
});

var $$2Z = _export;
var getBuiltIn$u = getBuiltIn$L;
var apply$k = functionApply$1;
var bind$j = functionBind;
var aConstructor$3 = aConstructor$5;
var anObject$1j = anObject$1A;
var isObject$c = isObject$C;
var create$9 = objectCreate$1;
var fails$u = fails$1m;

var nativeConstruct = getBuiltIn$u('Reflect', 'construct');
var ObjectPrototype = Object.prototype;
var push$g = [].push;

// `Reflect.construct` method
// https://tc39.es/ecma262/#sec-reflect.construct
// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails$u(function () {
  function F() { /* empty */ }
  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
});

var ARGS_BUG = !fails$u(function () {
  nativeConstruct(function () { /* empty */ });
});

var FORCED$6 = NEW_TARGET_BUG || ARGS_BUG;

$$2Z({ target: 'Reflect', stat: true, forced: FORCED$6, sham: FORCED$6 }, {
  construct: function construct(Target, args /* , newTarget */) {
    aConstructor$3(Target);
    anObject$1j(args);
    var newTarget = arguments.length < 3 ? Target : aConstructor$3(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      apply$k(push$g, $args, args);
      return new (apply$k(bind$j, Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create$9(isObject$c(proto) ? proto : ObjectPrototype);
    var result = apply$k(Target, instance, args);
    return isObject$c(result) ? result : instance;
  }
});

var $$2Y = _export;
var DESCRIPTORS$f = descriptors;
var anObject$1i = anObject$1A;
var toPropertyKey$2 = toPropertyKey$9;
var definePropertyModule$2 = objectDefineProperty;
var fails$t = fails$1m;

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
var ERROR_INSTEAD_OF_FALSE = fails$t(function () {
  // eslint-disable-next-line es-x/no-reflect -- required for testing
  Reflect.defineProperty(definePropertyModule$2.f({}, 1, { value: 1 }), 1, { value: 2 });
});

// `Reflect.defineProperty` method
// https://tc39.es/ecma262/#sec-reflect.defineproperty
$$2Y({ target: 'Reflect', stat: true, forced: ERROR_INSTEAD_OF_FALSE, sham: !DESCRIPTORS$f }, {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject$1i(target);
    var key = toPropertyKey$2(propertyKey);
    anObject$1i(attributes);
    try {
      definePropertyModule$2.f(target, key, attributes);
      return true;
    } catch (error) {
      return false;
    }
  }
});

var $$2X = _export;
var anObject$1h = anObject$1A;
var getOwnPropertyDescriptor$4 = objectGetOwnPropertyDescriptor.f;

// `Reflect.deleteProperty` method
// https://tc39.es/ecma262/#sec-reflect.deleteproperty
$$2X({ target: 'Reflect', stat: true }, {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var descriptor = getOwnPropertyDescriptor$4(anObject$1h(target), propertyKey);
    return descriptor && !descriptor.configurable ? false : delete target[propertyKey];
  }
});

var hasOwn$e = hasOwnProperty_1;

var isDataDescriptor$2 = function (descriptor) {
  return descriptor !== undefined && (hasOwn$e(descriptor, 'value') || hasOwn$e(descriptor, 'writable'));
};

var $$2W = _export;
var call$N = functionCall;
var isObject$b = isObject$C;
var anObject$1g = anObject$1A;
var isDataDescriptor$1 = isDataDescriptor$2;
var getOwnPropertyDescriptorModule$3 = objectGetOwnPropertyDescriptor;
var getPrototypeOf$5 = objectGetPrototypeOf$1;

// `Reflect.get` method
// https://tc39.es/ecma262/#sec-reflect.get
function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var descriptor, prototype;
  if (anObject$1g(target) === receiver) return target[propertyKey];
  descriptor = getOwnPropertyDescriptorModule$3.f(target, propertyKey);
  if (descriptor) return isDataDescriptor$1(descriptor)
    ? descriptor.value
    : descriptor.get === undefined ? undefined : call$N(descriptor.get, receiver);
  if (isObject$b(prototype = getPrototypeOf$5(target))) return get(prototype, propertyKey, receiver);
}

$$2W({ target: 'Reflect', stat: true }, {
  get: get
});

var $$2V = _export;
var DESCRIPTORS$e = descriptors;
var anObject$1f = anObject$1A;
var getOwnPropertyDescriptorModule$2 = objectGetOwnPropertyDescriptor;

// `Reflect.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-reflect.getownpropertydescriptor
$$2V({ target: 'Reflect', stat: true, sham: !DESCRIPTORS$e }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return getOwnPropertyDescriptorModule$2.f(anObject$1f(target), propertyKey);
  }
});

var $$2U = _export;
var anObject$1e = anObject$1A;
var objectGetPrototypeOf = objectGetPrototypeOf$1;
var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;

// `Reflect.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-reflect.getprototypeof
$$2U({ target: 'Reflect', stat: true, sham: !CORRECT_PROTOTYPE_GETTER }, {
  getPrototypeOf: function getPrototypeOf(target) {
    return objectGetPrototypeOf(anObject$1e(target));
  }
});

var $$2T = _export;

// `Reflect.has` method
// https://tc39.es/ecma262/#sec-reflect.has
$$2T({ target: 'Reflect', stat: true }, {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});

var $$2S = _export;
var anObject$1d = anObject$1A;
var $isExtensible = objectIsExtensible;

// `Reflect.isExtensible` method
// https://tc39.es/ecma262/#sec-reflect.isextensible
$$2S({ target: 'Reflect', stat: true }, {
  isExtensible: function isExtensible(target) {
    anObject$1d(target);
    return $isExtensible(target);
  }
});

var $$2R = _export;
var ownKeys = ownKeys$3;

// `Reflect.ownKeys` method
// https://tc39.es/ecma262/#sec-reflect.ownkeys
$$2R({ target: 'Reflect', stat: true }, {
  ownKeys: ownKeys
});

var $$2Q = _export;
var getBuiltIn$t = getBuiltIn$L;
var anObject$1c = anObject$1A;
var FREEZING = freezing;

// `Reflect.preventExtensions` method
// https://tc39.es/ecma262/#sec-reflect.preventextensions
$$2Q({ target: 'Reflect', stat: true, sham: !FREEZING }, {
  preventExtensions: function preventExtensions(target) {
    anObject$1c(target);
    try {
      var objectPreventExtensions = getBuiltIn$t('Object', 'preventExtensions');
      if (objectPreventExtensions) objectPreventExtensions(target);
      return true;
    } catch (error) {
      return false;
    }
  }
});

var $$2P = _export;
var call$M = functionCall;
var anObject$1b = anObject$1A;
var isObject$a = isObject$C;
var isDataDescriptor = isDataDescriptor$2;
var fails$s = fails$1m;
var definePropertyModule$1 = objectDefineProperty;
var getOwnPropertyDescriptorModule$1 = objectGetOwnPropertyDescriptor;
var getPrototypeOf$4 = objectGetPrototypeOf$1;
var createPropertyDescriptor$4 = createPropertyDescriptor$c;

// `Reflect.set` method
// https://tc39.es/ecma262/#sec-reflect.set
function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDescriptor = getOwnPropertyDescriptorModule$1.f(anObject$1b(target), propertyKey);
  var existingDescriptor, prototype, setter;
  if (!ownDescriptor) {
    if (isObject$a(prototype = getPrototypeOf$4(target))) {
      return set(prototype, propertyKey, V, receiver);
    }
    ownDescriptor = createPropertyDescriptor$4(0);
  }
  if (isDataDescriptor(ownDescriptor)) {
    if (ownDescriptor.writable === false || !isObject$a(receiver)) return false;
    if (existingDescriptor = getOwnPropertyDescriptorModule$1.f(receiver, propertyKey)) {
      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
      existingDescriptor.value = V;
      definePropertyModule$1.f(receiver, propertyKey, existingDescriptor);
    } else definePropertyModule$1.f(receiver, propertyKey, createPropertyDescriptor$4(0, V));
  } else {
    setter = ownDescriptor.set;
    if (setter === undefined) return false;
    call$M(setter, receiver, V);
  } return true;
}

// MS Edge 17-18 Reflect.set allows setting the property to object
// with non-writable property on the prototype
var MS_EDGE_BUG = fails$s(function () {
  var Constructor = function () { /* empty */ };
  var object = definePropertyModule$1.f(new Constructor(), 'a', { configurable: true });
  // eslint-disable-next-line es-x/no-reflect -- required for testing
  return Reflect.set(Constructor.prototype, 'a', 1, object) !== false;
});

$$2P({ target: 'Reflect', stat: true, forced: MS_EDGE_BUG }, {
  set: set
});

var $$2O = _export;
var anObject$1a = anObject$1A;
var aPossiblePrototype = aPossiblePrototype$2;
var objectSetPrototypeOf = objectSetPrototypeOf$1;

// `Reflect.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-reflect.setprototypeof
if (objectSetPrototypeOf) $$2O({ target: 'Reflect', stat: true }, {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    anObject$1a(target);
    aPossiblePrototype(proto);
    try {
      objectSetPrototypeOf(target, proto);
      return true;
    } catch (error) {
      return false;
    }
  }
});

var $$2N = _export;
var global$u = global$$;
var setToStringTag$3 = setToStringTag$d;

$$2N({ global: true }, { Reflect: {} });

// Reflect[@@toStringTag] property
// https://tc39.es/ecma262/#sec-reflect-@@tostringtag
setToStringTag$3(global$u.Reflect, 'Reflect', true);

var isObject$9 = isObject$C;
var classof$9 = classofRaw$1;
var wellKnownSymbol$l = wellKnownSymbol$K;

var MATCH$2 = wellKnownSymbol$l('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
var isRegexp = function (it) {
  var isRegExp;
  return isObject$9(it) && ((isRegExp = it[MATCH$2]) !== undefined ? !!isRegExp : classof$9(it) == 'RegExp');
};

var anObject$19 = anObject$1A;

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
var regexpFlags$1 = function () {
  var that = anObject$19(this);
  var result = '';
  if (that.hasIndices) result += 'd';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.unicodeSets) result += 'v';
  if (that.sticky) result += 'y';
  return result;
};

var call$L = functionCall;
var hasOwn$d = hasOwnProperty_1;
var isPrototypeOf$4 = objectIsPrototypeOf;
var regExpFlags$1 = regexpFlags$1;

var RegExpPrototype$7 = RegExp.prototype;

var regexpGetFlags = function (R) {
  var flags = R.flags;
  return flags === undefined && !('flags' in RegExpPrototype$7) && !hasOwn$d(R, 'flags') && isPrototypeOf$4(RegExpPrototype$7, R)
    ? call$L(regExpFlags$1, R) : flags;
};

var fails$r = fails$1m;
var global$t = global$$;

// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
var $RegExp$2 = global$t.RegExp;

var UNSUPPORTED_Y$3 = fails$r(function () {
  var re = $RegExp$2('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

// UC Browser bug
// https://github.com/zloirock/core-js/issues/1008
var MISSED_STICKY$2 = UNSUPPORTED_Y$3 || fails$r(function () {
  return !$RegExp$2('a', 'y').sticky;
});

var BROKEN_CARET = UNSUPPORTED_Y$3 || fails$r(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = $RegExp$2('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

var regexpStickyHelpers = {
  BROKEN_CARET: BROKEN_CARET,
  MISSED_STICKY: MISSED_STICKY$2,
  UNSUPPORTED_Y: UNSUPPORTED_Y$3
};

var fails$q = fails$1m;
var global$s = global$$;

// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
var $RegExp$1 = global$s.RegExp;

var regexpUnsupportedDotAll = fails$q(function () {
  var re = $RegExp$1('.', 's');
  return !(re.dotAll && re.exec('\n') && re.flags === 's');
});

var fails$p = fails$1m;
var global$r = global$$;

// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
var $RegExp = global$r.RegExp;

var regexpUnsupportedNcg = fails$p(function () {
  var re = $RegExp('(?<a>b)', 'g');
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});

var DESCRIPTORS$d = descriptors;
var global$q = global$$;
var uncurryThis$L = functionUncurryThis;
var isForced = isForced_1;
var inheritIfRequired$2 = inheritIfRequired$6;
var createNonEnumerableProperty$9 = createNonEnumerableProperty$i;
var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
var isPrototypeOf$3 = objectIsPrototypeOf;
var isRegExp$4 = isRegexp;
var toString$n = toString$z;
var getRegExpFlags$4 = regexpGetFlags;
var stickyHelpers$2 = regexpStickyHelpers;
var proxyAccessor = proxyAccessor$2;
var defineBuiltIn$8 = defineBuiltIn$p;
var fails$o = fails$1m;
var hasOwn$c = hasOwnProperty_1;
var enforceInternalState$2 = internalState.enforce;
var setSpecies$2 = setSpecies$7;
var wellKnownSymbol$k = wellKnownSymbol$K;
var UNSUPPORTED_DOT_ALL$2 = regexpUnsupportedDotAll;
var UNSUPPORTED_NCG$1 = regexpUnsupportedNcg;

var MATCH$1 = wellKnownSymbol$k('match');
var NativeRegExp = global$q.RegExp;
var RegExpPrototype$6 = NativeRegExp.prototype;
var SyntaxError$2 = global$q.SyntaxError;
var exec$8 = uncurryThis$L(RegExpPrototype$6.exec);
var charAt$e = uncurryThis$L(''.charAt);
var replace$7 = uncurryThis$L(''.replace);
var stringIndexOf$4 = uncurryThis$L(''.indexOf);
var stringSlice$c = uncurryThis$L(''.slice);
// TODO: Use only proper RegExpIdentifierName
var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
var re1 = /a/g;
var re2 = /a/g;

// "new" should create a new object, old webkit bug
var CORRECT_NEW = new NativeRegExp(re1) !== re1;

var MISSED_STICKY$1 = stickyHelpers$2.MISSED_STICKY;
var UNSUPPORTED_Y$2 = stickyHelpers$2.UNSUPPORTED_Y;

var BASE_FORCED = DESCRIPTORS$d &&
  (!CORRECT_NEW || MISSED_STICKY$1 || UNSUPPORTED_DOT_ALL$2 || UNSUPPORTED_NCG$1 || fails$o(function () {
    re2[MATCH$1] = false;
    // RegExp constructor can alter flags and IsRegExp works correct with @@match
    return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
  }));

var handleDotAll = function (string) {
  var length = string.length;
  var index = 0;
  var result = '';
  var brackets = false;
  var chr;
  for (; index <= length; index++) {
    chr = charAt$e(string, index);
    if (chr === '\\') {
      result += chr + charAt$e(string, ++index);
      continue;
    }
    if (!brackets && chr === '.') {
      result += '[\\s\\S]';
    } else {
      if (chr === '[') {
        brackets = true;
      } else if (chr === ']') {
        brackets = false;
      } result += chr;
    }
  } return result;
};

var handleNCG = function (string) {
  var length = string.length;
  var index = 0;
  var result = '';
  var named = [];
  var names = {};
  var brackets = false;
  var ncg = false;
  var groupid = 0;
  var groupname = '';
  var chr;
  for (; index <= length; index++) {
    chr = charAt$e(string, index);
    if (chr === '\\') {
      chr = chr + charAt$e(string, ++index);
    } else if (chr === ']') {
      brackets = false;
    } else if (!brackets) switch (true) {
      case chr === '[':
        brackets = true;
        break;
      case chr === '(':
        if (exec$8(IS_NCG, stringSlice$c(string, index + 1))) {
          index += 2;
          ncg = true;
        }
        result += chr;
        groupid++;
        continue;
      case chr === '>' && ncg:
        if (groupname === '' || hasOwn$c(names, groupname)) {
          throw new SyntaxError$2('Invalid capture group name');
        }
        names[groupname] = true;
        named[named.length] = [groupname, groupid];
        ncg = false;
        groupname = '';
        continue;
    }
    if (ncg) groupname += chr;
    else result += chr;
  } return [result, named];
};

// `RegExp` constructor
// https://tc39.es/ecma262/#sec-regexp-constructor
if (isForced('RegExp', BASE_FORCED)) {
  var RegExpWrapper = function RegExp(pattern, flags) {
    var thisIsRegExp = isPrototypeOf$3(RegExpPrototype$6, this);
    var patternIsRegExp = isRegExp$4(pattern);
    var flagsAreUndefined = flags === undefined;
    var groups = [];
    var rawPattern = pattern;
    var rawFlags, dotAll, sticky, handled, result, state;

    if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
      return pattern;
    }

    if (patternIsRegExp || isPrototypeOf$3(RegExpPrototype$6, pattern)) {
      pattern = pattern.source;
      if (flagsAreUndefined) flags = getRegExpFlags$4(rawPattern);
    }

    pattern = pattern === undefined ? '' : toString$n(pattern);
    flags = flags === undefined ? '' : toString$n(flags);
    rawPattern = pattern;

    if (UNSUPPORTED_DOT_ALL$2 && 'dotAll' in re1) {
      dotAll = !!flags && stringIndexOf$4(flags, 's') > -1;
      if (dotAll) flags = replace$7(flags, /s/g, '');
    }

    rawFlags = flags;

    if (MISSED_STICKY$1 && 'sticky' in re1) {
      sticky = !!flags && stringIndexOf$4(flags, 'y') > -1;
      if (sticky && UNSUPPORTED_Y$2) flags = replace$7(flags, /y/g, '');
    }

    if (UNSUPPORTED_NCG$1) {
      handled = handleNCG(pattern);
      pattern = handled[0];
      groups = handled[1];
    }

    result = inheritIfRequired$2(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype$6, RegExpWrapper);

    if (dotAll || sticky || groups.length) {
      state = enforceInternalState$2(result);
      if (dotAll) {
        state.dotAll = true;
        state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
      }
      if (sticky) state.sticky = true;
      if (groups.length) state.groups = groups;
    }

    if (pattern !== rawPattern) try {
      // fails in old engines, but we have no alternatives for unsupported regex syntax
      createNonEnumerableProperty$9(result, 'source', rawPattern === '' ? '(?:)' : rawPattern);
    } catch (error) { /* empty */ }

    return result;
  };

  for (var keys = getOwnPropertyNames$1(NativeRegExp), index$1 = 0; keys.length > index$1;) {
    proxyAccessor(RegExpWrapper, NativeRegExp, keys[index$1++]);
  }

  RegExpPrototype$6.constructor = RegExpWrapper;
  RegExpWrapper.prototype = RegExpPrototype$6;
  defineBuiltIn$8(global$q, 'RegExp', RegExpWrapper, { constructor: true });
}

// https://tc39.es/ecma262/#sec-get-regexp-@@species
setSpecies$2('RegExp');

var makeBuiltIn = makeBuiltIn$4.exports;
var defineProperty$2 = objectDefineProperty;

var defineBuiltInAccessor$8 = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
  return defineProperty$2.f(target, name, descriptor);
};

var DESCRIPTORS$c = descriptors;
var UNSUPPORTED_DOT_ALL$1 = regexpUnsupportedDotAll;
var classof$8 = classofRaw$1;
var defineBuiltInAccessor$7 = defineBuiltInAccessor$8;
var getInternalState$d = internalState.get;

var RegExpPrototype$5 = RegExp.prototype;
var $TypeError$j = TypeError;

// `RegExp.prototype.dotAll` getter
// https://tc39.es/ecma262/#sec-get-regexp.prototype.dotall
if (DESCRIPTORS$c && UNSUPPORTED_DOT_ALL$1) {
  defineBuiltInAccessor$7(RegExpPrototype$5, 'dotAll', {
    configurable: true,
    get: function dotAll() {
      if (this === RegExpPrototype$5) return undefined;
      // We can't use InternalStateModule.getterFor because
      // we don't add metadata for regexps created by a literal.
      if (classof$8(this) === 'RegExp') {
        return !!getInternalState$d(this).dotAll;
      }
      throw $TypeError$j('Incompatible receiver, RegExp required');
    }
  });
}

/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */
var call$K = functionCall;
var uncurryThis$K = functionUncurryThis;
var toString$m = toString$z;
var regexpFlags = regexpFlags$1;
var stickyHelpers$1 = regexpStickyHelpers;
var shared$2 = shared$9.exports;
var create$8 = objectCreate$1;
var getInternalState$c = internalState.get;
var UNSUPPORTED_DOT_ALL = regexpUnsupportedDotAll;
var UNSUPPORTED_NCG = regexpUnsupportedNcg;

var nativeReplace = shared$2('native-string-replace', String.prototype.replace);
var nativeExec = RegExp.prototype.exec;
var patchedExec = nativeExec;
var charAt$d = uncurryThis$K(''.charAt);
var indexOf$1 = uncurryThis$K(''.indexOf);
var replace$6 = uncurryThis$K(''.replace);
var stringSlice$b = uncurryThis$K(''.slice);

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  call$K(nativeExec, re1, 'a');
  call$K(nativeExec, re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y$1 = stickyHelpers$1.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1 || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

if (PATCH) {
  patchedExec = function exec(string) {
    var re = this;
    var state = getInternalState$c(re);
    var str = toString$m(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;

    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = call$K(patchedExec, raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }

    var groups = state.groups;
    var sticky = UNSUPPORTED_Y$1 && re.sticky;
    var flags = call$K(regexpFlags, re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = replace$6(flags, 'y', '');
      if (indexOf$1(flags, 'g') === -1) {
        flags += 'g';
      }

      strCopy = stringSlice$b(str, re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt$d(str, re.lastIndex - 1) !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = call$K(nativeExec, sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = stringSlice$b(match.input, charsAdded);
        match[0] = stringSlice$b(match[0], charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn't work for /(.?)?/
      call$K(nativeReplace, match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    if (match && groups) {
      match.groups = object = create$8(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }

    return match;
  };
}

var regexpExec$3 = patchedExec;

var $$2M = _export;
var exec$7 = regexpExec$3;

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
$$2M({ target: 'RegExp', proto: true, forced: /./.exec !== exec$7 }, {
  exec: exec$7
});

var global$p = global$$;
var DESCRIPTORS$b = descriptors;
var defineBuiltInAccessor$6 = defineBuiltInAccessor$8;
var regExpFlags = regexpFlags$1;
var fails$n = fails$1m;

// babel-minify and Closure Compiler transpiles RegExp('.', 'd') -> /./d and it causes SyntaxError
var RegExp$2 = global$p.RegExp;
var RegExpPrototype$4 = RegExp$2.prototype;

var FORCED$5 = DESCRIPTORS$b && fails$n(function () {
  var INDICES_SUPPORT = true;
  try {
    RegExp$2('.', 'd');
  } catch (error) {
    INDICES_SUPPORT = false;
  }

  var O = {};
  // modern V8 bug
  var calls = '';
  var expected = INDICES_SUPPORT ? 'dgimsy' : 'gimsy';

  var addGetter = function (key, chr) {
    // eslint-disable-next-line es-x/no-object-defineproperty -- safe
    Object.defineProperty(O, key, { get: function () {
      calls += chr;
      return true;
    } });
  };

  var pairs = {
    dotAll: 's',
    global: 'g',
    ignoreCase: 'i',
    multiline: 'm',
    sticky: 'y'
  };

  if (INDICES_SUPPORT) pairs.hasIndices = 'd';

  for (var key in pairs) addGetter(key, pairs[key]);

  // eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
  var result = Object.getOwnPropertyDescriptor(RegExpPrototype$4, 'flags').get.call(O);

  return result !== expected || calls !== expected;
});

// `RegExp.prototype.flags` getter
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
if (FORCED$5) defineBuiltInAccessor$6(RegExpPrototype$4, 'flags', {
  configurable: true,
  get: regExpFlags
});

var DESCRIPTORS$a = descriptors;
var MISSED_STICKY = regexpStickyHelpers.MISSED_STICKY;
var classof$7 = classofRaw$1;
var defineBuiltInAccessor$5 = defineBuiltInAccessor$8;
var getInternalState$b = internalState.get;

var RegExpPrototype$3 = RegExp.prototype;
var $TypeError$i = TypeError;

// `RegExp.prototype.sticky` getter
// https://tc39.es/ecma262/#sec-get-regexp.prototype.sticky
if (DESCRIPTORS$a && MISSED_STICKY) {
  defineBuiltInAccessor$5(RegExpPrototype$3, 'sticky', {
    configurable: true,
    get: function sticky() {
      if (this === RegExpPrototype$3) return undefined;
      // We can't use InternalStateModule.getterFor because
      // we don't add metadata for regexps created by a literal.
      if (classof$7(this) === 'RegExp') {
        return !!getInternalState$b(this).sticky;
      }
      throw $TypeError$i('Incompatible receiver, RegExp required');
    }
  });
}

// TODO: Remove from `core-js@4` since it's moved to entry points

var $$2L = _export;
var call$J = functionCall;
var uncurryThis$J = functionUncurryThis;
var isCallable$c = isCallable$E;
var isObject$8 = isObject$C;

var DELEGATES_TO_EXEC = function () {
  var execCalled = false;
  var re = /[ac]/;
  re.exec = function () {
    execCalled = true;
    return /./.exec.apply(this, arguments);
  };
  return re.test('abc') === true && execCalled;
}();

var $TypeError$h = TypeError;
var un$Test = uncurryThis$J(/./.test);

// `RegExp.prototype.test` method
// https://tc39.es/ecma262/#sec-regexp.prototype.test
$$2L({ target: 'RegExp', proto: true, forced: !DELEGATES_TO_EXEC }, {
  test: function (str) {
    var exec = this.exec;
    if (!isCallable$c(exec)) return un$Test(this, str);
    var result = call$J(exec, this, str);
    if (result !== null && !isObject$8(result)) {
      throw new $TypeError$h('RegExp exec method returned something other than an Object or null');
    }
    return !!result;
  }
});

var PROPER_FUNCTION_NAME$1 = functionName.PROPER;
var defineBuiltIn$7 = defineBuiltIn$p;
var anObject$18 = anObject$1A;
var $toString$2 = toString$z;
var fails$m = fails$1m;
var getRegExpFlags$3 = regexpGetFlags;

var TO_STRING = 'toString';
var RegExpPrototype$2 = RegExp.prototype;
var n$ToString = RegExpPrototype$2[TO_STRING];

var NOT_GENERIC = fails$m(function () { return n$ToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = PROPER_FUNCTION_NAME$1 && n$ToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  defineBuiltIn$7(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject$18(this);
    var pattern = $toString$2(R.source);
    var flags = $toString$2(getRegExpFlags$3(R));
    return '/' + pattern + '/' + flags;
  }, { unsafe: true });
}

var collection$2 = collection$4;
var collectionStrong = collectionStrong$2;

// `Set` constructor
// https://tc39.es/ecma262/#sec-set-objects
collection$2('Set', function (init) {
  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);

var $$2K = _export;
var uncurryThis$I = functionUncurryThis;
var requireObjectCoercible$e = requireObjectCoercible$k;
var toIntegerOrInfinity$b = toIntegerOrInfinity$o;
var toString$l = toString$z;
var fails$l = fails$1m;

var charAt$c = uncurryThis$I(''.charAt);

var FORCED$4 = fails$l(function () {
  // eslint-disable-next-line es-x/no-array-string-prototype-at -- safe
  return '𠮷'.at(-2) !== '\uD842';
});

// `String.prototype.at` method
// https://github.com/tc39/proposal-relative-indexing-method
$$2K({ target: 'String', proto: true, forced: FORCED$4 }, {
  at: function at(index) {
    var S = toString$l(requireObjectCoercible$e(this));
    var len = S.length;
    var relativeIndex = toIntegerOrInfinity$b(index);
    var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
    return (k < 0 || k >= len) ? undefined : charAt$c(S, k);
  }
});

var uncurryThis$H = functionUncurryThis;
var toIntegerOrInfinity$a = toIntegerOrInfinity$o;
var toString$k = toString$z;
var requireObjectCoercible$d = requireObjectCoercible$k;

var charAt$b = uncurryThis$H(''.charAt);
var charCodeAt$2 = uncurryThis$H(''.charCodeAt);
var stringSlice$a = uncurryThis$H(''.slice);

var createMethod$1 = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString$k(requireObjectCoercible$d($this));
    var position = toIntegerOrInfinity$a(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt$2(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt$2(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt$b(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice$a(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

var stringMultibyte = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod$1(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod$1(true)
};

var $$2J = _export;
var codeAt$2 = stringMultibyte.codeAt;

// `String.prototype.codePointAt` method
// https://tc39.es/ecma262/#sec-string.prototype.codepointat
$$2J({ target: 'String', proto: true }, {
  codePointAt: function codePointAt(pos) {
    return codeAt$2(this, pos);
  }
});

var isRegExp$3 = isRegexp;

var $TypeError$g = TypeError;

var notARegexp = function (it) {
  if (isRegExp$3(it)) {
    throw $TypeError$g("The method doesn't accept regular expressions");
  } return it;
};

var wellKnownSymbol$j = wellKnownSymbol$K;

var MATCH = wellKnownSymbol$j('match');

var correctIsRegexpLogic = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (error1) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (error2) { /* empty */ }
  } return false;
};

var $$2I = _export;
var uncurryThis$G = functionUncurryThis;
var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;
var toLength$7 = toLength$d;
var toString$j = toString$z;
var notARegExp$2 = notARegexp;
var requireObjectCoercible$c = requireObjectCoercible$k;
var correctIsRegExpLogic$2 = correctIsRegexpLogic;

// eslint-disable-next-line es-x/no-string-prototype-endswith -- safe
var un$EndsWith = uncurryThis$G(''.endsWith);
var slice$2 = uncurryThis$G(''.slice);
var min$7 = Math.min;

var CORRECT_IS_REGEXP_LOGIC$1 = correctIsRegExpLogic$2('endsWith');
// https://github.com/zloirock/core-js/pull/702
var MDN_POLYFILL_BUG$1 = !CORRECT_IS_REGEXP_LOGIC$1 && !!function () {
  var descriptor = getOwnPropertyDescriptor$3(String.prototype, 'endsWith');
  return descriptor && !descriptor.writable;
}();

// `String.prototype.endsWith` method
// https://tc39.es/ecma262/#sec-string.prototype.endswith
$$2I({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG$1 && !CORRECT_IS_REGEXP_LOGIC$1 }, {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = toString$j(requireObjectCoercible$c(this));
    notARegExp$2(searchString);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = that.length;
    var end = endPosition === undefined ? len : min$7(toLength$7(endPosition), len);
    var search = toString$j(searchString);
    return un$EndsWith
      ? un$EndsWith(that, search, end)
      : slice$2(that, end - search.length, end) === search;
  }
});

var $$2H = _export;
var uncurryThis$F = functionUncurryThis;
var toAbsoluteIndex$3 = toAbsoluteIndex$b;

var $RangeError$6 = RangeError;
var fromCharCode$3 = String.fromCharCode;
// eslint-disable-next-line es-x/no-string-fromcodepoint -- required for testing
var $fromCodePoint = String.fromCodePoint;
var join$6 = uncurryThis$F([].join);

// length should be 1, old FF problem
var INCORRECT_LENGTH = !!$fromCodePoint && $fromCodePoint.length != 1;

// `String.fromCodePoint` method
// https://tc39.es/ecma262/#sec-string.fromcodepoint
$$2H({ target: 'String', stat: true, arity: 1, forced: INCORRECT_LENGTH }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  fromCodePoint: function fromCodePoint(x) {
    var elements = [];
    var length = arguments.length;
    var i = 0;
    var code;
    while (length > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex$3(code, 0x10FFFF) !== code) throw $RangeError$6(code + ' is not a valid code point');
      elements[i] = code < 0x10000
        ? fromCharCode$3(code)
        : fromCharCode$3(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00);
    } return join$6(elements, '');
  }
});

var $$2G = _export;
var uncurryThis$E = functionUncurryThis;
var notARegExp$1 = notARegexp;
var requireObjectCoercible$b = requireObjectCoercible$k;
var toString$i = toString$z;
var correctIsRegExpLogic$1 = correctIsRegexpLogic;

var stringIndexOf$3 = uncurryThis$E(''.indexOf);

// `String.prototype.includes` method
// https://tc39.es/ecma262/#sec-string.prototype.includes
$$2G({ target: 'String', proto: true, forced: !correctIsRegExpLogic$1('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~stringIndexOf$3(
      toString$i(requireObjectCoercible$b(this)),
      toString$i(notARegExp$1(searchString)),
      arguments.length > 1 ? arguments[1] : undefined
    );
  }
});

var charAt$a = stringMultibyte.charAt;
var toString$h = toString$z;
var InternalStateModule$e = internalState;
var defineIterator = defineIterator$3;

var STRING_ITERATOR$1 = 'String Iterator';
var setInternalState$e = InternalStateModule$e.set;
var getInternalState$a = InternalStateModule$e.getterFor(STRING_ITERATOR$1);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState$e(this, {
    type: STRING_ITERATOR$1,
    string: toString$h(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState$a(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt$a(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

// TODO: Remove from `core-js@4` since it's moved to entry points

var uncurryThis$D = functionUncurryThis;
var defineBuiltIn$6 = defineBuiltIn$p;
var regexpExec$2 = regexpExec$3;
var fails$k = fails$1m;
var wellKnownSymbol$i = wellKnownSymbol$K;
var createNonEnumerableProperty$8 = createNonEnumerableProperty$i;

var SPECIES = wellKnownSymbol$i('species');
var RegExpPrototype$1 = RegExp.prototype;

var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
  var SYMBOL = wellKnownSymbol$i(KEY);

  var DELEGATES_TO_SYMBOL = !fails$k(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails$k(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    FORCED
  ) {
    var uncurriedNativeRegExpMethod = uncurryThis$D(/./[SYMBOL]);
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      var uncurriedNativeMethod = uncurryThis$D(nativeMethod);
      var $exec = regexp.exec;
      if ($exec === regexpExec$2 || $exec === RegExpPrototype$1.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: uncurriedNativeRegExpMethod(regexp, str, arg2) };
        }
        return { done: true, value: uncurriedNativeMethod(str, regexp, arg2) };
      }
      return { done: false };
    });

    defineBuiltIn$6(String.prototype, KEY, methods[0]);
    defineBuiltIn$6(RegExpPrototype$1, SYMBOL, methods[1]);
  }

  if (SHAM) createNonEnumerableProperty$8(RegExpPrototype$1[SYMBOL], 'sham', true);
};

var charAt$9 = stringMultibyte.charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
var advanceStringIndex$4 = function (S, index, unicode) {
  return index + (unicode ? charAt$9(S, index).length : 1);
};

var call$I = functionCall;
var anObject$17 = anObject$1A;
var isCallable$b = isCallable$E;
var classof$6 = classofRaw$1;
var regexpExec$1 = regexpExec$3;

var $TypeError$f = TypeError;

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
var regexpExecAbstract = function (R, S) {
  var exec = R.exec;
  if (isCallable$b(exec)) {
    var result = call$I(exec, R, S);
    if (result !== null) anObject$17(result);
    return result;
  }
  if (classof$6(R) === 'RegExp') return call$I(regexpExec$1, R, S);
  throw $TypeError$f('RegExp#exec called on incompatible receiver');
};

var call$H = functionCall;
var fixRegExpWellKnownSymbolLogic$3 = fixRegexpWellKnownSymbolLogic;
var anObject$16 = anObject$1A;
var toLength$6 = toLength$d;
var toString$g = toString$z;
var requireObjectCoercible$a = requireObjectCoercible$k;
var getMethod$e = getMethod$i;
var advanceStringIndex$3 = advanceStringIndex$4;
var regExpExec$3 = regexpExecAbstract;

// @@match logic
fixRegExpWellKnownSymbolLogic$3('match', function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.es/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible$a(this);
      var matcher = regexp == undefined ? undefined : getMethod$e(regexp, MATCH);
      return matcher ? call$H(matcher, regexp, O) : new RegExp(regexp)[MATCH](toString$g(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
    function (string) {
      var rx = anObject$16(this);
      var S = toString$g(string);
      var res = maybeCallNative(nativeMatch, rx, S);

      if (res.done) return res.value;

      if (!rx.global) return regExpExec$3(rx, S);

      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec$3(rx, S)) !== null) {
        var matchStr = toString$g(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex$3(S, toLength$6(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

/* eslint-disable es-x/no-string-prototype-matchall -- safe */
var $$2F = _export;
var call$G = functionCall;
var uncurryThis$C = functionUncurryThis;
var createIteratorConstructor$5 = createIteratorConstructor$7;
var requireObjectCoercible$9 = requireObjectCoercible$k;
var toLength$5 = toLength$d;
var toString$f = toString$z;
var anObject$15 = anObject$1A;
var classof$5 = classofRaw$1;
var isRegExp$2 = isRegexp;
var getRegExpFlags$2 = regexpGetFlags;
var getMethod$d = getMethod$i;
var defineBuiltIn$5 = defineBuiltIn$p;
var fails$j = fails$1m;
var wellKnownSymbol$h = wellKnownSymbol$K;
var speciesConstructor$b = speciesConstructor$f;
var advanceStringIndex$2 = advanceStringIndex$4;
var regExpExec$2 = regexpExecAbstract;
var InternalStateModule$d = internalState;
var IS_PURE$2 = isPure;

var MATCH_ALL = wellKnownSymbol$h('matchAll');
var REGEXP_STRING = 'RegExp String';
var REGEXP_STRING_ITERATOR = REGEXP_STRING + ' Iterator';
var setInternalState$d = InternalStateModule$d.set;
var getInternalState$9 = InternalStateModule$d.getterFor(REGEXP_STRING_ITERATOR);
var RegExpPrototype = RegExp.prototype;
var $TypeError$e = TypeError;
var stringIndexOf$2 = uncurryThis$C(''.indexOf);
var un$MatchAll = uncurryThis$C(''.matchAll);

var WORKS_WITH_NON_GLOBAL_REGEX = !!un$MatchAll && !fails$j(function () {
  un$MatchAll('a', /./);
});

var $RegExpStringIterator = createIteratorConstructor$5(function RegExpStringIterator(regexp, string, $global, fullUnicode) {
  setInternalState$d(this, {
    type: REGEXP_STRING_ITERATOR,
    regexp: regexp,
    string: string,
    global: $global,
    unicode: fullUnicode,
    done: false
  });
}, REGEXP_STRING, function next() {
  var state = getInternalState$9(this);
  if (state.done) return { value: undefined, done: true };
  var R = state.regexp;
  var S = state.string;
  var match = regExpExec$2(R, S);
  if (match === null) return { value: undefined, done: state.done = true };
  if (state.global) {
    if (toString$f(match[0]) === '') R.lastIndex = advanceStringIndex$2(S, toLength$5(R.lastIndex), state.unicode);
    return { value: match, done: false };
  }
  state.done = true;
  return { value: match, done: false };
});

var $matchAll = function (string) {
  var R = anObject$15(this);
  var S = toString$f(string);
  var C = speciesConstructor$b(R, RegExp);
  var flags = toString$f(getRegExpFlags$2(R));
  var matcher, $global, fullUnicode;
  matcher = new C(C === RegExp ? R.source : R, flags);
  $global = !!~stringIndexOf$2(flags, 'g');
  fullUnicode = !!~stringIndexOf$2(flags, 'u');
  matcher.lastIndex = toLength$5(R.lastIndex);
  return new $RegExpStringIterator(matcher, S, $global, fullUnicode);
};

// `String.prototype.matchAll` method
// https://tc39.es/ecma262/#sec-string.prototype.matchall
$$2F({ target: 'String', proto: true, forced: WORKS_WITH_NON_GLOBAL_REGEX }, {
  matchAll: function matchAll(regexp) {
    var O = requireObjectCoercible$9(this);
    var flags, S, matcher, rx;
    if (regexp != null) {
      if (isRegExp$2(regexp)) {
        flags = toString$f(requireObjectCoercible$9(getRegExpFlags$2(regexp)));
        if (!~stringIndexOf$2(flags, 'g')) throw $TypeError$e('`.matchAll` does not allow non-global regexes');
      }
      if (WORKS_WITH_NON_GLOBAL_REGEX) return un$MatchAll(O, regexp);
      matcher = getMethod$d(regexp, MATCH_ALL);
      if (matcher === undefined && IS_PURE$2 && classof$5(regexp) == 'RegExp') matcher = $matchAll;
      if (matcher) return call$G(matcher, regexp, O);
    } else if (WORKS_WITH_NON_GLOBAL_REGEX) return un$MatchAll(O, regexp);
    S = toString$f(O);
    rx = new RegExp(regexp, 'g');
    return rx[MATCH_ALL](S);
  }
});

MATCH_ALL in RegExpPrototype || defineBuiltIn$5(RegExpPrototype, MATCH_ALL, $matchAll);

// https://github.com/zloirock/core-js/issues/280
var userAgent$1 = engineUserAgent;

var stringPadWebkitBug = /Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(userAgent$1);

var $$2E = _export;
var $padEnd = stringPad.end;
var WEBKIT_BUG$1 = stringPadWebkitBug;

// `String.prototype.padEnd` method
// https://tc39.es/ecma262/#sec-string.prototype.padend
$$2E({ target: 'String', proto: true, forced: WEBKIT_BUG$1 }, {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var $$2D = _export;
var $padStart = stringPad.start;
var WEBKIT_BUG = stringPadWebkitBug;

// `String.prototype.padStart` method
// https://tc39.es/ecma262/#sec-string.prototype.padstart
$$2D({ target: 'String', proto: true, forced: WEBKIT_BUG }, {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var $$2C = _export;
var uncurryThis$B = functionUncurryThis;
var toIndexedObject$6 = toIndexedObject$k;
var toObject$b = toObject$B;
var toString$e = toString$z;
var lengthOfArrayLike$f = lengthOfArrayLike$A;

var push$f = uncurryThis$B([].push);
var join$5 = uncurryThis$B([].join);

// `String.raw` method
// https://tc39.es/ecma262/#sec-string.raw
$$2C({ target: 'String', stat: true }, {
  raw: function raw(template) {
    var rawTemplate = toIndexedObject$6(toObject$b(template).raw);
    var literalSegments = lengthOfArrayLike$f(rawTemplate);
    var argumentsLength = arguments.length;
    var elements = [];
    var i = 0;
    while (literalSegments > i) {
      push$f(elements, toString$e(rawTemplate[i++]));
      if (i === literalSegments) return join$5(elements, '');
      if (i < argumentsLength) push$f(elements, toString$e(arguments[i]));
    }
  }
});

var $$2B = _export;
var repeat = stringRepeat;

// `String.prototype.repeat` method
// https://tc39.es/ecma262/#sec-string.prototype.repeat
$$2B({ target: 'String', proto: true }, {
  repeat: repeat
});

var uncurryThis$A = functionUncurryThis;
var toObject$a = toObject$B;

var floor$3 = Math.floor;
var charAt$8 = uncurryThis$A(''.charAt);
var replace$5 = uncurryThis$A(''.replace);
var stringSlice$9 = uncurryThis$A(''.slice);
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

// `GetSubstitution` abstract operation
// https://tc39.es/ecma262/#sec-getsubstitution
var getSubstitution$2 = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject$a(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace$5(replacement, symbols, function (match, ch) {
    var capture;
    switch (charAt$8(ch, 0)) {
      case '$': return '$';
      case '&': return matched;
      case '`': return stringSlice$9(str, 0, position);
      case "'": return stringSlice$9(str, tailPos);
      case '<':
        capture = namedCaptures[stringSlice$9(ch, 1, -1)];
        break;
      default: // \d\d?
        var n = +ch;
        if (n === 0) return match;
        if (n > m) {
          var f = floor$3(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? charAt$8(ch, 1) : captures[f - 1] + charAt$8(ch, 1);
          return match;
        }
        capture = captures[n - 1];
    }
    return capture === undefined ? '' : capture;
  });
};

var apply$j = functionApply$1;
var call$F = functionCall;
var uncurryThis$z = functionUncurryThis;
var fixRegExpWellKnownSymbolLogic$2 = fixRegexpWellKnownSymbolLogic;
var fails$i = fails$1m;
var anObject$14 = anObject$1A;
var isCallable$a = isCallable$E;
var toIntegerOrInfinity$9 = toIntegerOrInfinity$o;
var toLength$4 = toLength$d;
var toString$d = toString$z;
var requireObjectCoercible$8 = requireObjectCoercible$k;
var advanceStringIndex$1 = advanceStringIndex$4;
var getMethod$c = getMethod$i;
var getSubstitution$1 = getSubstitution$2;
var regExpExec$1 = regexpExecAbstract;
var wellKnownSymbol$g = wellKnownSymbol$K;

var REPLACE$1 = wellKnownSymbol$g('replace');
var max$5 = Math.max;
var min$6 = Math.min;
var concat$1 = uncurryThis$z([].concat);
var push$e = uncurryThis$z([].push);
var stringIndexOf$1 = uncurryThis$z(''.indexOf);
var stringSlice$8 = uncurryThis$z(''.slice);

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
  return 'a'.replace(/./, '$0') === '$0';
})();

// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE$1]) {
    return /./[REPLACE$1]('a', '$0') === '';
  }
  return false;
})();

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails$i(function () {
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
  return ''.replace(re, '$<a>') !== '7';
});

// @@replace logic
fixRegExpWellKnownSymbolLogic$2('replace', function (_, nativeReplace, maybeCallNative) {
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.es/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible$8(this);
      var replacer = searchValue == undefined ? undefined : getMethod$c(searchValue, REPLACE$1);
      return replacer
        ? call$F(replacer, searchValue, O, replaceValue)
        : call$F(nativeReplace, toString$d(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
    function (string, replaceValue) {
      var rx = anObject$14(this);
      var S = toString$d(string);

      if (
        typeof replaceValue == 'string' &&
        stringIndexOf$1(replaceValue, UNSAFE_SUBSTITUTE) === -1 &&
        stringIndexOf$1(replaceValue, '$<') === -1
      ) {
        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
        if (res.done) return res.value;
      }

      var functionalReplace = isCallable$a(replaceValue);
      if (!functionalReplace) replaceValue = toString$d(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec$1(rx, S);
        if (result === null) break;

        push$e(results, result);
        if (!global) break;

        var matchStr = toString$d(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex$1(S, toLength$4(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = toString$d(result[0]);
        var position = max$5(min$6(toIntegerOrInfinity$9(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) push$e(captures, maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = concat$1([matched], captures, position, S);
          if (namedCaptures !== undefined) push$e(replacerArgs, namedCaptures);
          var replacement = toString$d(apply$j(replaceValue, undefined, replacerArgs));
        } else {
          replacement = getSubstitution$1(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += stringSlice$8(S, nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + stringSlice$8(S, nextSourcePosition);
    }
  ];
}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

var $$2A = _export;
var call$E = functionCall;
var uncurryThis$y = functionUncurryThis;
var requireObjectCoercible$7 = requireObjectCoercible$k;
var isCallable$9 = isCallable$E;
var isRegExp$1 = isRegexp;
var toString$c = toString$z;
var getMethod$b = getMethod$i;
var getRegExpFlags$1 = regexpGetFlags;
var getSubstitution = getSubstitution$2;
var wellKnownSymbol$f = wellKnownSymbol$K;

var REPLACE = wellKnownSymbol$f('replace');
var $TypeError$d = TypeError;
var indexOf = uncurryThis$y(''.indexOf);
uncurryThis$y(''.replace);
var stringSlice$7 = uncurryThis$y(''.slice);
var max$4 = Math.max;

var stringIndexOf = function (string, searchValue, fromIndex) {
  if (fromIndex > string.length) return -1;
  if (searchValue === '') return fromIndex;
  return indexOf(string, searchValue, fromIndex);
};

// `String.prototype.replaceAll` method
// https://tc39.es/ecma262/#sec-string.prototype.replaceall
$$2A({ target: 'String', proto: true }, {
  replaceAll: function replaceAll(searchValue, replaceValue) {
    var O = requireObjectCoercible$7(this);
    var IS_REG_EXP, flags, replacer, string, searchString, functionalReplace, searchLength, advanceBy, replacement;
    var position = 0;
    var endOfLastMatch = 0;
    var result = '';
    if (searchValue != null) {
      IS_REG_EXP = isRegExp$1(searchValue);
      if (IS_REG_EXP) {
        flags = toString$c(requireObjectCoercible$7(getRegExpFlags$1(searchValue)));
        if (!~indexOf(flags, 'g')) throw $TypeError$d('`.replaceAll` does not allow non-global regexes');
      }
      replacer = getMethod$b(searchValue, REPLACE);
      if (replacer) {
        return call$E(replacer, searchValue, O, replaceValue);
      }
    }
    string = toString$c(O);
    searchString = toString$c(searchValue);
    functionalReplace = isCallable$9(replaceValue);
    if (!functionalReplace) replaceValue = toString$c(replaceValue);
    searchLength = searchString.length;
    advanceBy = max$4(1, searchLength);
    position = stringIndexOf(string, searchString, 0);
    while (position !== -1) {
      replacement = functionalReplace
        ? toString$c(replaceValue(searchString, position, string))
        : getSubstitution(searchString, string, position, [], undefined, replaceValue);
      result += stringSlice$7(string, endOfLastMatch, position) + replacement;
      endOfLastMatch = position + searchLength;
      position = stringIndexOf(string, searchString, position + advanceBy);
    }
    if (endOfLastMatch < string.length) {
      result += stringSlice$7(string, endOfLastMatch);
    }
    return result;
  }
});

var call$D = functionCall;
var fixRegExpWellKnownSymbolLogic$1 = fixRegexpWellKnownSymbolLogic;
var anObject$13 = anObject$1A;
var requireObjectCoercible$6 = requireObjectCoercible$k;
var sameValue = sameValue$1;
var toString$b = toString$z;
var getMethod$a = getMethod$i;
var regExpExec = regexpExecAbstract;

// @@search logic
fixRegExpWellKnownSymbolLogic$1('search', function (SEARCH, nativeSearch, maybeCallNative) {
  return [
    // `String.prototype.search` method
    // https://tc39.es/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = requireObjectCoercible$6(this);
      var searcher = regexp == undefined ? undefined : getMethod$a(regexp, SEARCH);
      return searcher ? call$D(searcher, regexp, O) : new RegExp(regexp)[SEARCH](toString$b(O));
    },
    // `RegExp.prototype[@@search]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@search
    function (string) {
      var rx = anObject$13(this);
      var S = toString$b(string);
      var res = maybeCallNative(nativeSearch, rx, S);

      if (res.done) return res.value;

      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regExpExec(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }
  ];
});

var apply$i = functionApply$1;
var call$C = functionCall;
var uncurryThis$x = functionUncurryThis;
var fixRegExpWellKnownSymbolLogic = fixRegexpWellKnownSymbolLogic;
var isRegExp = isRegexp;
var anObject$12 = anObject$1A;
var requireObjectCoercible$5 = requireObjectCoercible$k;
var speciesConstructor$a = speciesConstructor$f;
var advanceStringIndex = advanceStringIndex$4;
var toLength$3 = toLength$d;
var toString$a = toString$z;
var getMethod$9 = getMethod$i;
var arraySlice$5 = arraySliceSimple;
var callRegExpExec = regexpExecAbstract;
var regexpExec = regexpExec$3;
var stickyHelpers = regexpStickyHelpers;
var fails$h = fails$1m;

var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
var MAX_UINT32 = 0xFFFFFFFF;
var min$5 = Math.min;
var $push = [].push;
var exec$6 = uncurryThis$x(/./.exec);
var push$d = uncurryThis$x($push);
var stringSlice$6 = uncurryThis$x(''.slice);

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails$h(function () {
  // eslint-disable-next-line regexp/no-empty-group -- required for testing
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

// @@split logic
fixRegExpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    // eslint-disable-next-line regexp/no-empty-group -- required for testing
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = toString$a(requireObjectCoercible$5(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) {
        return call$C(nativeSplit, string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = call$C(regexpExec, separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          push$d(output, stringSlice$6(string, lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) apply$i($push, output, arraySlice$5(match, 1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !exec$6(separatorCopy, '')) push$d(output, '');
      } else push$d(output, stringSlice$6(string, lastLastIndex));
      return output.length > lim ? arraySlice$5(output, 0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : call$C(nativeSplit, this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.es/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible$5(this);
      var splitter = separator == undefined ? undefined : getMethod$9(separator, SPLIT);
      return splitter
        ? call$C(splitter, separator, O, limit)
        : call$C(internalSplit, toString$a(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (string, limit) {
      var rx = anObject$12(this);
      var S = toString$a(string);
      var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);

      if (res.done) return res.value;

      var C = speciesConstructor$a(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (UNSUPPORTED_Y ? 'g' : 'y');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(UNSUPPORTED_Y ? '^(?:' + rx.source + ')' : rx, flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
        var z = callRegExpExec(splitter, UNSUPPORTED_Y ? stringSlice$6(S, q) : S);
        var e;
        if (
          z === null ||
          (e = min$5(toLength$3(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          push$d(A, stringSlice$6(S, p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            push$d(A, z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      push$d(A, stringSlice$6(S, p));
      return A;
    }
  ];
}, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);

var $$2z = _export;
var uncurryThis$w = functionUncurryThis;
var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
var toLength$2 = toLength$d;
var toString$9 = toString$z;
var notARegExp = notARegexp;
var requireObjectCoercible$4 = requireObjectCoercible$k;
var correctIsRegExpLogic = correctIsRegexpLogic;

// eslint-disable-next-line es-x/no-string-prototype-startswith -- safe
var un$StartsWith = uncurryThis$w(''.startsWith);
var stringSlice$5 = uncurryThis$w(''.slice);
var min$4 = Math.min;

var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('startsWith');
// https://github.com/zloirock/core-js/pull/702
var MDN_POLYFILL_BUG = !CORRECT_IS_REGEXP_LOGIC && !!function () {
  var descriptor = getOwnPropertyDescriptor$2(String.prototype, 'startsWith');
  return descriptor && !descriptor.writable;
}();

// `String.prototype.startsWith` method
// https://tc39.es/ecma262/#sec-string.prototype.startswith
$$2z({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = toString$9(requireObjectCoercible$4(this));
    notARegExp(searchString);
    var index = toLength$2(min$4(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = toString$9(searchString);
    return un$StartsWith
      ? un$StartsWith(that, search, index)
      : stringSlice$5(that, index, index + search.length) === search;
  }
});

var $$2y = _export;
var uncurryThis$v = functionUncurryThis;
var requireObjectCoercible$3 = requireObjectCoercible$k;
var toIntegerOrInfinity$8 = toIntegerOrInfinity$o;
var toString$8 = toString$z;

var stringSlice$4 = uncurryThis$v(''.slice);
var max$3 = Math.max;
var min$3 = Math.min;

// eslint-disable-next-line unicorn/prefer-string-slice, es-x/no-string-prototype-substr -- required for testing
var FORCED$3 = !''.substr || 'ab'.substr(-1) !== 'b';

// `String.prototype.substr` method
// https://tc39.es/ecma262/#sec-string.prototype.substr
$$2y({ target: 'String', proto: true, forced: FORCED$3 }, {
  substr: function substr(start, length) {
    var that = toString$8(requireObjectCoercible$3(this));
    var size = that.length;
    var intStart = toIntegerOrInfinity$8(start);
    var intLength, intEnd;
    if (intStart === Infinity) intStart = 0;
    if (intStart < 0) intStart = max$3(size + intStart, 0);
    intLength = length === undefined ? size : toIntegerOrInfinity$8(length);
    if (intLength <= 0 || intLength === Infinity) return '';
    intEnd = min$3(intStart + intLength, size);
    return intStart >= intEnd ? '' : stringSlice$4(that, intStart, intEnd);
  }
});

var PROPER_FUNCTION_NAME = functionName.PROPER;
var fails$g = fails$1m;
var whitespaces$1 = whitespaces$5;

var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
var stringTrimForced = function (METHOD_NAME) {
  return fails$g(function () {
    return !!whitespaces$1[METHOD_NAME]()
      || non[METHOD_NAME]() !== non
      || (PROPER_FUNCTION_NAME && whitespaces$1[METHOD_NAME].name !== METHOD_NAME);
  });
};

var $$2x = _export;
var $trim = stringTrim.trim;
var forcedStringTrimMethod$2 = stringTrimForced;

// `String.prototype.trim` method
// https://tc39.es/ecma262/#sec-string.prototype.trim
$$2x({ target: 'String', proto: true, forced: forcedStringTrimMethod$2('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});

var $trimEnd = stringTrim.end;
var forcedStringTrimMethod$1 = stringTrimForced;

// `String.prototype.{ trimEnd, trimRight }` method
// https://tc39.es/ecma262/#sec-string.prototype.trimend
// https://tc39.es/ecma262/#String.prototype.trimright
var stringTrimEnd = forcedStringTrimMethod$1('trimEnd') ? function trimEnd() {
  return $trimEnd(this);
// eslint-disable-next-line es-x/no-string-prototype-trimstart-trimend -- safe
} : ''.trimEnd;

var $$2w = _export;
var trimEnd$1 = stringTrimEnd;

// `String.prototype.trimRight` method
// https://tc39.es/ecma262/#sec-string.prototype.trimend
// eslint-disable-next-line es-x/no-string-prototype-trimleft-trimright -- safe
$$2w({ target: 'String', proto: true, name: 'trimEnd', forced: ''.trimRight !== trimEnd$1 }, {
  trimRight: trimEnd$1
});

// TODO: Remove this line from `core-js@4`

var $$2v = _export;
var trimEnd = stringTrimEnd;

// `String.prototype.trimEnd` method
// https://tc39.es/ecma262/#sec-string.prototype.trimend
// eslint-disable-next-line es-x/no-string-prototype-trimstart-trimend -- safe
$$2v({ target: 'String', proto: true, name: 'trimEnd', forced: ''.trimEnd !== trimEnd }, {
  trimEnd: trimEnd
});

var $trimStart = stringTrim.start;
var forcedStringTrimMethod = stringTrimForced;

// `String.prototype.{ trimStart, trimLeft }` method
// https://tc39.es/ecma262/#sec-string.prototype.trimstart
// https://tc39.es/ecma262/#String.prototype.trimleft
var stringTrimStart = forcedStringTrimMethod('trimStart') ? function trimStart() {
  return $trimStart(this);
// eslint-disable-next-line es-x/no-string-prototype-trimstart-trimend -- safe
} : ''.trimStart;

var $$2u = _export;
var trimStart$1 = stringTrimStart;

// `String.prototype.trimLeft` method
// https://tc39.es/ecma262/#sec-string.prototype.trimleft
// eslint-disable-next-line es-x/no-string-prototype-trimleft-trimright -- safe
$$2u({ target: 'String', proto: true, name: 'trimStart', forced: ''.trimLeft !== trimStart$1 }, {
  trimLeft: trimStart$1
});

// TODO: Remove this line from `core-js@4`

var $$2t = _export;
var trimStart = stringTrimStart;

// `String.prototype.trimStart` method
// https://tc39.es/ecma262/#sec-string.prototype.trimstart
// eslint-disable-next-line es-x/no-string-prototype-trimstart-trimend -- safe
$$2t({ target: 'String', proto: true, name: 'trimStart', forced: ''.trimStart !== trimStart }, {
  trimStart: trimStart
});

var uncurryThis$u = functionUncurryThis;
var requireObjectCoercible$2 = requireObjectCoercible$k;
var toString$7 = toString$z;

var quot = /"/g;
var replace$4 = uncurryThis$u(''.replace);

// `CreateHTML` abstract operation
// https://tc39.es/ecma262/#sec-createhtml
var createHtml = function (string, tag, attribute, value) {
  var S = toString$7(requireObjectCoercible$2(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + replace$4(toString$7(value), quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};

var fails$f = fails$1m;

// check the existence of a method, lowercase
// of a tag and escaping quotes in arguments
var stringHtmlForced = function (METHOD_NAME) {
  return fails$f(function () {
    var test = ''[METHOD_NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  });
};

var $$2s = _export;
var createHTML$c = createHtml;
var forcedStringHTMLMethod$c = stringHtmlForced;

// `String.prototype.anchor` method
// https://tc39.es/ecma262/#sec-string.prototype.anchor
$$2s({ target: 'String', proto: true, forced: forcedStringHTMLMethod$c('anchor') }, {
  anchor: function anchor(name) {
    return createHTML$c(this, 'a', 'name', name);
  }
});

var $$2r = _export;
var createHTML$b = createHtml;
var forcedStringHTMLMethod$b = stringHtmlForced;

// `String.prototype.big` method
// https://tc39.es/ecma262/#sec-string.prototype.big
$$2r({ target: 'String', proto: true, forced: forcedStringHTMLMethod$b('big') }, {
  big: function big() {
    return createHTML$b(this, 'big', '', '');
  }
});

var $$2q = _export;
var createHTML$a = createHtml;
var forcedStringHTMLMethod$a = stringHtmlForced;

// `String.prototype.blink` method
// https://tc39.es/ecma262/#sec-string.prototype.blink
$$2q({ target: 'String', proto: true, forced: forcedStringHTMLMethod$a('blink') }, {
  blink: function blink() {
    return createHTML$a(this, 'blink', '', '');
  }
});

var $$2p = _export;
var createHTML$9 = createHtml;
var forcedStringHTMLMethod$9 = stringHtmlForced;

// `String.prototype.bold` method
// https://tc39.es/ecma262/#sec-string.prototype.bold
$$2p({ target: 'String', proto: true, forced: forcedStringHTMLMethod$9('bold') }, {
  bold: function bold() {
    return createHTML$9(this, 'b', '', '');
  }
});

var $$2o = _export;
var createHTML$8 = createHtml;
var forcedStringHTMLMethod$8 = stringHtmlForced;

// `String.prototype.fixed` method
// https://tc39.es/ecma262/#sec-string.prototype.fixed
$$2o({ target: 'String', proto: true, forced: forcedStringHTMLMethod$8('fixed') }, {
  fixed: function fixed() {
    return createHTML$8(this, 'tt', '', '');
  }
});

var $$2n = _export;
var createHTML$7 = createHtml;
var forcedStringHTMLMethod$7 = stringHtmlForced;

// `String.prototype.fontcolor` method
// https://tc39.es/ecma262/#sec-string.prototype.fontcolor
$$2n({ target: 'String', proto: true, forced: forcedStringHTMLMethod$7('fontcolor') }, {
  fontcolor: function fontcolor(color) {
    return createHTML$7(this, 'font', 'color', color);
  }
});

var $$2m = _export;
var createHTML$6 = createHtml;
var forcedStringHTMLMethod$6 = stringHtmlForced;

// `String.prototype.fontsize` method
// https://tc39.es/ecma262/#sec-string.prototype.fontsize
$$2m({ target: 'String', proto: true, forced: forcedStringHTMLMethod$6('fontsize') }, {
  fontsize: function fontsize(size) {
    return createHTML$6(this, 'font', 'size', size);
  }
});

var $$2l = _export;
var createHTML$5 = createHtml;
var forcedStringHTMLMethod$5 = stringHtmlForced;

// `String.prototype.italics` method
// https://tc39.es/ecma262/#sec-string.prototype.italics
$$2l({ target: 'String', proto: true, forced: forcedStringHTMLMethod$5('italics') }, {
  italics: function italics() {
    return createHTML$5(this, 'i', '', '');
  }
});

var $$2k = _export;
var createHTML$4 = createHtml;
var forcedStringHTMLMethod$4 = stringHtmlForced;

// `String.prototype.link` method
// https://tc39.es/ecma262/#sec-string.prototype.link
$$2k({ target: 'String', proto: true, forced: forcedStringHTMLMethod$4('link') }, {
  link: function link(url) {
    return createHTML$4(this, 'a', 'href', url);
  }
});

var $$2j = _export;
var createHTML$3 = createHtml;
var forcedStringHTMLMethod$3 = stringHtmlForced;

// `String.prototype.small` method
// https://tc39.es/ecma262/#sec-string.prototype.small
$$2j({ target: 'String', proto: true, forced: forcedStringHTMLMethod$3('small') }, {
  small: function small() {
    return createHTML$3(this, 'small', '', '');
  }
});

var $$2i = _export;
var createHTML$2 = createHtml;
var forcedStringHTMLMethod$2 = stringHtmlForced;

// `String.prototype.strike` method
// https://tc39.es/ecma262/#sec-string.prototype.strike
$$2i({ target: 'String', proto: true, forced: forcedStringHTMLMethod$2('strike') }, {
  strike: function strike() {
    return createHTML$2(this, 'strike', '', '');
  }
});

var $$2h = _export;
var createHTML$1 = createHtml;
var forcedStringHTMLMethod$1 = stringHtmlForced;

// `String.prototype.sub` method
// https://tc39.es/ecma262/#sec-string.prototype.sub
$$2h({ target: 'String', proto: true, forced: forcedStringHTMLMethod$1('sub') }, {
  sub: function sub() {
    return createHTML$1(this, 'sub', '', '');
  }
});

var $$2g = _export;
var createHTML = createHtml;
var forcedStringHTMLMethod = stringHtmlForced;

// `String.prototype.sup` method
// https://tc39.es/ecma262/#sec-string.prototype.sup
$$2g({ target: 'String', proto: true, forced: forcedStringHTMLMethod('sup') }, {
  sup: function sup() {
    return createHTML(this, 'sup', '', '');
  }
});

var typedArrayConstructor = {exports: {}};

/* eslint-disable no-new -- required for testing */

var global$o = global$$;
var fails$e = fails$1m;
var checkCorrectnessOfIteration = checkCorrectnessOfIteration$4;
var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

var ArrayBuffer$2 = global$o.ArrayBuffer;
var Int8Array$3 = global$o.Int8Array;

var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$1 || !fails$e(function () {
  Int8Array$3(1);
}) || !fails$e(function () {
  new Int8Array$3(-1);
}) || !checkCorrectnessOfIteration(function (iterable) {
  new Int8Array$3();
  new Int8Array$3(null);
  new Int8Array$3(1.5);
  new Int8Array$3(iterable);
}, true) || fails$e(function () {
  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
  return new Int8Array$3(new ArrayBuffer$2(2), 1, undefined).length !== 1;
});

var toIntegerOrInfinity$7 = toIntegerOrInfinity$o;

var $RangeError$5 = RangeError;

var toPositiveInteger$5 = function (it) {
  var result = toIntegerOrInfinity$7(it);
  if (result < 0) throw $RangeError$5("The argument can't be less than 0");
  return result;
};

var toPositiveInteger$4 = toPositiveInteger$5;

var $RangeError$4 = RangeError;

var toOffset$2 = function (it, BYTES) {
  var offset = toPositiveInteger$4(it);
  if (offset % BYTES) throw $RangeError$4('Wrong offset');
  return offset;
};

var bind$i = functionBindContext;
var call$B = functionCall;
var aConstructor$2 = aConstructor$5;
var toObject$9 = toObject$B;
var lengthOfArrayLike$e = lengthOfArrayLike$A;
var getIterator$8 = getIterator$b;
var getIteratorMethod$5 = getIteratorMethod$9;
var isArrayIteratorMethod = isArrayIteratorMethod$3;
var aTypedArrayConstructor$4 = arrayBufferViewCore.aTypedArrayConstructor;

var typedArrayFrom$2 = function from(source /* , mapfn, thisArg */) {
  var C = aConstructor$2(this);
  var O = toObject$9(source);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod$5(O);
  var i, length, result, step, iterator, next;
  if (iteratorMethod && !isArrayIteratorMethod(iteratorMethod)) {
    iterator = getIterator$8(O, iteratorMethod);
    next = iterator.next;
    O = [];
    while (!(step = call$B(next, iterator)).done) {
      O.push(step.value);
    }
  }
  if (mapping && argumentsLength > 2) {
    mapfn = bind$i(mapfn, arguments[2]);
  }
  length = lengthOfArrayLike$e(O);
  result = new (aTypedArrayConstructor$4(C))(length);
  for (i = 0; length > i; i++) {
    result[i] = mapping ? mapfn(O[i], i) : O[i];
  }
  return result;
};

var $$2f = _export;
var global$n = global$$;
var call$A = functionCall;
var DESCRIPTORS$9 = descriptors;
var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS$2 = typedArrayConstructorsRequireWrappers;
var ArrayBufferViewCore$A = arrayBufferViewCore;
var ArrayBufferModule = arrayBuffer;
var anInstance$8 = anInstance$d;
var createPropertyDescriptor$3 = createPropertyDescriptor$c;
var createNonEnumerableProperty$7 = createNonEnumerableProperty$i;
var isIntegralNumber = isIntegralNumber$3;
var toLength$1 = toLength$d;
var toIndex = toIndex$2;
var toOffset$1 = toOffset$2;
var toPropertyKey$1 = toPropertyKey$9;
var hasOwn$b = hasOwnProperty_1;
var classof$4 = classof$l;
var isObject$7 = isObject$C;
var isSymbol$1 = isSymbol$7;
var create$7 = objectCreate$1;
var isPrototypeOf$2 = objectIsPrototypeOf;
var setPrototypeOf = objectSetPrototypeOf$1;
var getOwnPropertyNames = objectGetOwnPropertyNames.f;
var typedArrayFrom$1 = typedArrayFrom$2;
var forEach$1 = arrayIteration.forEach;
var setSpecies$1 = setSpecies$7;
var definePropertyModule = objectDefineProperty;
var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
var InternalStateModule$c = internalState;
var inheritIfRequired$1 = inheritIfRequired$6;

var getInternalState$8 = InternalStateModule$c.get;
var setInternalState$c = InternalStateModule$c.set;
var enforceInternalState$1 = InternalStateModule$c.enforce;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var round = Math.round;
var RangeError$3 = global$n.RangeError;
var ArrayBuffer$1 = ArrayBufferModule.ArrayBuffer;
var ArrayBufferPrototype = ArrayBuffer$1.prototype;
var DataView$1 = ArrayBufferModule.DataView;
var NATIVE_ARRAY_BUFFER_VIEWS = ArrayBufferViewCore$A.NATIVE_ARRAY_BUFFER_VIEWS;
var TYPED_ARRAY_TAG = ArrayBufferViewCore$A.TYPED_ARRAY_TAG;
var TypedArray = ArrayBufferViewCore$A.TypedArray;
var TypedArrayPrototype$1 = ArrayBufferViewCore$A.TypedArrayPrototype;
var aTypedArrayConstructor$3 = ArrayBufferViewCore$A.aTypedArrayConstructor;
var isTypedArray = ArrayBufferViewCore$A.isTypedArray;
var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
var WRONG_LENGTH = 'Wrong length';

var fromList = function (C, list) {
  aTypedArrayConstructor$3(C);
  var index = 0;
  var length = list.length;
  var result = new C(length);
  while (length > index) result[index] = list[index++];
  return result;
};

var addGetter = function (it, key) {
  nativeDefineProperty(it, key, { get: function () {
    return getInternalState$8(this)[key];
  } });
};

var isArrayBuffer = function (it) {
  var klass;
  return isPrototypeOf$2(ArrayBufferPrototype, it) || (klass = classof$4(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
};

var isTypedArrayIndex = function (target, key) {
  return isTypedArray(target)
    && !isSymbol$1(key)
    && key in target
    && isIntegralNumber(+key)
    && key >= 0;
};

var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
  key = toPropertyKey$1(key);
  return isTypedArrayIndex(target, key)
    ? createPropertyDescriptor$3(2, target[key])
    : nativeGetOwnPropertyDescriptor(target, key);
};

var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
  key = toPropertyKey$1(key);
  if (isTypedArrayIndex(target, key)
    && isObject$7(descriptor)
    && hasOwn$b(descriptor, 'value')
    && !hasOwn$b(descriptor, 'get')
    && !hasOwn$b(descriptor, 'set')
    // TODO: add validation descriptor w/o calling accessors
    && !descriptor.configurable
    && (!hasOwn$b(descriptor, 'writable') || descriptor.writable)
    && (!hasOwn$b(descriptor, 'enumerable') || descriptor.enumerable)
  ) {
    target[key] = descriptor.value;
    return target;
  } return nativeDefineProperty(target, key, descriptor);
};

if (DESCRIPTORS$9) {
  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
    getOwnPropertyDescriptorModule.f = wrappedGetOwnPropertyDescriptor;
    definePropertyModule.f = wrappedDefineProperty;
    addGetter(TypedArrayPrototype$1, 'buffer');
    addGetter(TypedArrayPrototype$1, 'byteOffset');
    addGetter(TypedArrayPrototype$1, 'byteLength');
    addGetter(TypedArrayPrototype$1, 'length');
  }

  $$2f({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
    defineProperty: wrappedDefineProperty
  });

  typedArrayConstructor.exports = function (TYPE, wrapper, CLAMPED) {
    var BYTES = TYPE.match(/\d+$/)[0] / 8;
    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + TYPE;
    var SETTER = 'set' + TYPE;
    var NativeTypedArrayConstructor = global$n[CONSTRUCTOR_NAME];
    var TypedArrayConstructor = NativeTypedArrayConstructor;
    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
    var exported = {};

    var getter = function (that, index) {
      var data = getInternalState$8(that);
      return data.view[GETTER](index * BYTES + data.byteOffset, true);
    };

    var setter = function (that, index, value) {
      var data = getInternalState$8(that);
      if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
    };

    var addElement = function (that, index) {
      nativeDefineProperty(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };

    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
        anInstance$8(that, TypedArrayConstructorPrototype);
        var index = 0;
        var byteOffset = 0;
        var buffer, byteLength, length;
        if (!isObject$7(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new ArrayBuffer$1(byteLength);
        } else if (isArrayBuffer(data)) {
          buffer = data;
          byteOffset = toOffset$1(offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError$3(WRONG_LENGTH);
            byteLength = $len - byteOffset;
            if (byteLength < 0) throw RangeError$3(WRONG_LENGTH);
          } else {
            byteLength = toLength$1($length) * BYTES;
            if (byteLength + byteOffset > $len) throw RangeError$3(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (isTypedArray(data)) {
          return fromList(TypedArrayConstructor, data);
        } else {
          return call$A(typedArrayFrom$1, TypedArrayConstructor, data);
        }
        setInternalState$c(that, {
          buffer: buffer,
          byteOffset: byteOffset,
          byteLength: byteLength,
          length: length,
          view: new DataView$1(buffer)
        });
        while (index < length) addElement(that, index++);
      });

      if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = create$7(TypedArrayPrototype$1);
    } else if (TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS$2) {
      TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
        anInstance$8(dummy, TypedArrayConstructorPrototype);
        return inheritIfRequired$1(function () {
          if (!isObject$7(data)) return new NativeTypedArrayConstructor(toIndex(data));
          if (isArrayBuffer(data)) return $length !== undefined
            ? new NativeTypedArrayConstructor(data, toOffset$1(typedArrayOffset, BYTES), $length)
            : typedArrayOffset !== undefined
              ? new NativeTypedArrayConstructor(data, toOffset$1(typedArrayOffset, BYTES))
              : new NativeTypedArrayConstructor(data);
          if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
          return call$A(typedArrayFrom$1, TypedArrayConstructor, data);
        }(), dummy, TypedArrayConstructor);
      });

      if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
      forEach$1(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
        if (!(key in TypedArrayConstructor)) {
          createNonEnumerableProperty$7(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
        }
      });
      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
    }

    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
      createNonEnumerableProperty$7(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
    }

    enforceInternalState$1(TypedArrayConstructorPrototype).TypedArrayConstructor = TypedArrayConstructor;

    if (TYPED_ARRAY_TAG) {
      createNonEnumerableProperty$7(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
    }

    var FORCED = TypedArrayConstructor != NativeTypedArrayConstructor;

    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

    $$2f({ global: true, constructor: true, forced: FORCED, sham: !NATIVE_ARRAY_BUFFER_VIEWS }, exported);

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
      createNonEnumerableProperty$7(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
    }

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
      createNonEnumerableProperty$7(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
    }

    setSpecies$1(CONSTRUCTOR_NAME);
  };
} else typedArrayConstructor.exports = function () { /* empty */ };

var createTypedArrayConstructor$8 = typedArrayConstructor.exports;

// `Float32Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor$8('Float32', function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

var createTypedArrayConstructor$7 = typedArrayConstructor.exports;

// `Float64Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor$7('Float64', function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

var createTypedArrayConstructor$6 = typedArrayConstructor.exports;

// `Int8Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor$6('Int8', function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

var createTypedArrayConstructor$5 = typedArrayConstructor.exports;

// `Int16Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor$5('Int16', function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

var createTypedArrayConstructor$4 = typedArrayConstructor.exports;

// `Int32Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor$4('Int32', function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

var createTypedArrayConstructor$3 = typedArrayConstructor.exports;

// `Uint8Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor$3('Uint8', function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

var createTypedArrayConstructor$2 = typedArrayConstructor.exports;

// `Uint8ClampedArray` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor$2('Uint8', function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

var createTypedArrayConstructor$1 = typedArrayConstructor.exports;

// `Uint16Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor$1('Uint16', function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

var createTypedArrayConstructor = typedArrayConstructor.exports;

// `Uint32Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
createTypedArrayConstructor('Uint32', function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

var ArrayBufferViewCore$z = arrayBufferViewCore;
var lengthOfArrayLike$d = lengthOfArrayLike$A;
var toIntegerOrInfinity$6 = toIntegerOrInfinity$o;

var aTypedArray$w = ArrayBufferViewCore$z.aTypedArray;
var exportTypedArrayMethod$x = ArrayBufferViewCore$z.exportTypedArrayMethod;

// `%TypedArray%.prototype.at` method
// https://github.com/tc39/proposal-relative-indexing-method
exportTypedArrayMethod$x('at', function at(index) {
  var O = aTypedArray$w(this);
  var len = lengthOfArrayLike$d(O);
  var relativeIndex = toIntegerOrInfinity$6(index);
  var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
  return (k < 0 || k >= len) ? undefined : O[k];
});

var uncurryThis$t = functionUncurryThis;
var ArrayBufferViewCore$y = arrayBufferViewCore;
var $ArrayCopyWithin = arrayCopyWithin;

var u$ArrayCopyWithin = uncurryThis$t($ArrayCopyWithin);
var aTypedArray$v = ArrayBufferViewCore$y.aTypedArray;
var exportTypedArrayMethod$w = ArrayBufferViewCore$y.exportTypedArrayMethod;

// `%TypedArray%.prototype.copyWithin` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin
exportTypedArrayMethod$w('copyWithin', function copyWithin(target, start /* , end */) {
  return u$ArrayCopyWithin(aTypedArray$v(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
});

var ArrayBufferViewCore$x = arrayBufferViewCore;
var $every$1 = arrayIteration.every;

var aTypedArray$u = ArrayBufferViewCore$x.aTypedArray;
var exportTypedArrayMethod$v = ArrayBufferViewCore$x.exportTypedArrayMethod;

// `%TypedArray%.prototype.every` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.every
exportTypedArrayMethod$v('every', function every(callbackfn /* , thisArg */) {
  return $every$1(aTypedArray$u(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

var toPrimitive = toPrimitive$4;

var $TypeError$c = TypeError;

// `ToBigInt` abstract operation
// https://tc39.es/ecma262/#sec-tobigint
var toBigInt$2 = function (argument) {
  var prim = toPrimitive(argument, 'number');
  if (typeof prim == 'number') throw $TypeError$c("Can't convert number to bigint");
  // eslint-disable-next-line es-x/no-bigint -- safe
  return BigInt(prim);
};

var ArrayBufferViewCore$w = arrayBufferViewCore;
var $fill = arrayFill$1;
var toBigInt$1 = toBigInt$2;
var classof$3 = classof$l;
var call$z = functionCall;
var uncurryThis$s = functionUncurryThis;
var fails$d = fails$1m;

var aTypedArray$t = ArrayBufferViewCore$w.aTypedArray;
var exportTypedArrayMethod$u = ArrayBufferViewCore$w.exportTypedArrayMethod;
var slice$1 = uncurryThis$s(''.slice);

// V8 ~ Chrome < 59, Safari < 14.1, FF < 55, Edge <=18
var CONVERSION_BUG = fails$d(function () {
  var count = 0;
  // eslint-disable-next-line es-x/no-typed-arrays -- safe
  new Int8Array(2).fill({ valueOf: function () { return count++; } });
  return count !== 1;
});

// `%TypedArray%.prototype.fill` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
exportTypedArrayMethod$u('fill', function fill(value /* , start, end */) {
  var length = arguments.length;
  aTypedArray$t(this);
  var actualValue = slice$1(classof$3(this), 0, 3) === 'Big' ? toBigInt$1(value) : +value;
  return call$z($fill, this, actualValue, length > 1 ? arguments[1] : undefined, length > 2 ? arguments[2] : undefined);
}, CONVERSION_BUG);

var lengthOfArrayLike$c = lengthOfArrayLike$A;

var arrayFromConstructorAndList$5 = function (Constructor, list) {
  var index = 0;
  var length = lengthOfArrayLike$c(list);
  var result = new Constructor(length);
  while (length > index) result[index] = list[index++];
  return result;
};

var ArrayBufferViewCore$v = arrayBufferViewCore;
var speciesConstructor$9 = speciesConstructor$f;

var aTypedArrayConstructor$2 = ArrayBufferViewCore$v.aTypedArrayConstructor;
var getTypedArrayConstructor$4 = ArrayBufferViewCore$v.getTypedArrayConstructor;

// a part of `TypedArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#typedarray-species-create
var typedArraySpeciesConstructor$5 = function (originalArray) {
  return aTypedArrayConstructor$2(speciesConstructor$9(originalArray, getTypedArrayConstructor$4(originalArray)));
};

var arrayFromConstructorAndList$4 = arrayFromConstructorAndList$5;
var typedArraySpeciesConstructor$4 = typedArraySpeciesConstructor$5;

var typedArrayFromSpeciesAndList = function (instance, list) {
  return arrayFromConstructorAndList$4(typedArraySpeciesConstructor$4(instance), list);
};

var ArrayBufferViewCore$u = arrayBufferViewCore;
var $filter = arrayIteration.filter;
var fromSpeciesAndList$3 = typedArrayFromSpeciesAndList;

var aTypedArray$s = ArrayBufferViewCore$u.aTypedArray;
var exportTypedArrayMethod$t = ArrayBufferViewCore$u.exportTypedArrayMethod;

// `%TypedArray%.prototype.filter` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter
exportTypedArrayMethod$t('filter', function filter(callbackfn /* , thisArg */) {
  var list = $filter(aTypedArray$s(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  return fromSpeciesAndList$3(this, list);
});

var ArrayBufferViewCore$t = arrayBufferViewCore;
var $find$1 = arrayIteration.find;

var aTypedArray$r = ArrayBufferViewCore$t.aTypedArray;
var exportTypedArrayMethod$s = ArrayBufferViewCore$t.exportTypedArrayMethod;

// `%TypedArray%.prototype.find` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.find
exportTypedArrayMethod$s('find', function find(predicate /* , thisArg */) {
  return $find$1(aTypedArray$r(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

var ArrayBufferViewCore$s = arrayBufferViewCore;
var $findIndex = arrayIteration.findIndex;

var aTypedArray$q = ArrayBufferViewCore$s.aTypedArray;
var exportTypedArrayMethod$r = ArrayBufferViewCore$s.exportTypedArrayMethod;

// `%TypedArray%.prototype.findIndex` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex
exportTypedArrayMethod$r('findIndex', function findIndex(predicate /* , thisArg */) {
  return $findIndex(aTypedArray$q(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

var ArrayBufferViewCore$r = arrayBufferViewCore;
var $findLast = arrayIterationFromLast.findLast;

var aTypedArray$p = ArrayBufferViewCore$r.aTypedArray;
var exportTypedArrayMethod$q = ArrayBufferViewCore$r.exportTypedArrayMethod;

// `%TypedArray%.prototype.findLast` method
// https://github.com/tc39/proposal-array-find-from-last
exportTypedArrayMethod$q('findLast', function findLast(predicate /* , thisArg */) {
  return $findLast(aTypedArray$p(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

var ArrayBufferViewCore$q = arrayBufferViewCore;
var $findLastIndex = arrayIterationFromLast.findLastIndex;

var aTypedArray$o = ArrayBufferViewCore$q.aTypedArray;
var exportTypedArrayMethod$p = ArrayBufferViewCore$q.exportTypedArrayMethod;

// `%TypedArray%.prototype.findLastIndex` method
// https://github.com/tc39/proposal-array-find-from-last
exportTypedArrayMethod$p('findLastIndex', function findLastIndex(predicate /* , thisArg */) {
  return $findLastIndex(aTypedArray$o(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

var ArrayBufferViewCore$p = arrayBufferViewCore;
var $forEach$1 = arrayIteration.forEach;

var aTypedArray$n = ArrayBufferViewCore$p.aTypedArray;
var exportTypedArrayMethod$o = ArrayBufferViewCore$p.exportTypedArrayMethod;

// `%TypedArray%.prototype.forEach` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach
exportTypedArrayMethod$o('forEach', function forEach(callbackfn /* , thisArg */) {
  $forEach$1(aTypedArray$n(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS$1 = typedArrayConstructorsRequireWrappers;
var exportTypedArrayStaticMethod$2 = arrayBufferViewCore.exportTypedArrayStaticMethod;
var typedArrayFrom = typedArrayFrom$2;

// `%TypedArray%.from` method
// https://tc39.es/ecma262/#sec-%typedarray%.from
exportTypedArrayStaticMethod$2('from', typedArrayFrom, TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS$1);

var ArrayBufferViewCore$o = arrayBufferViewCore;
var $includes = arrayIncludes.includes;

var aTypedArray$m = ArrayBufferViewCore$o.aTypedArray;
var exportTypedArrayMethod$n = ArrayBufferViewCore$o.exportTypedArrayMethod;

// `%TypedArray%.prototype.includes` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes
exportTypedArrayMethod$n('includes', function includes(searchElement /* , fromIndex */) {
  return $includes(aTypedArray$m(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
});

var ArrayBufferViewCore$n = arrayBufferViewCore;
var $indexOf = arrayIncludes.indexOf;

var aTypedArray$l = ArrayBufferViewCore$n.aTypedArray;
var exportTypedArrayMethod$m = ArrayBufferViewCore$n.exportTypedArrayMethod;

// `%TypedArray%.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof
exportTypedArrayMethod$m('indexOf', function indexOf(searchElement /* , fromIndex */) {
  return $indexOf(aTypedArray$l(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
});

var global$m = global$$;
var fails$c = fails$1m;
var uncurryThis$r = functionUncurryThis;
var ArrayBufferViewCore$m = arrayBufferViewCore;
var ArrayIterators = es_array_iterator;
var wellKnownSymbol$e = wellKnownSymbol$K;

var ITERATOR$3 = wellKnownSymbol$e('iterator');
var Uint8Array$1 = global$m.Uint8Array;
var arrayValues = uncurryThis$r(ArrayIterators.values);
var arrayKeys = uncurryThis$r(ArrayIterators.keys);
var arrayEntries = uncurryThis$r(ArrayIterators.entries);
var aTypedArray$k = ArrayBufferViewCore$m.aTypedArray;
var exportTypedArrayMethod$l = ArrayBufferViewCore$m.exportTypedArrayMethod;
var TypedArrayPrototype = Uint8Array$1 && Uint8Array$1.prototype;

var GENERIC = !fails$c(function () {
  TypedArrayPrototype[ITERATOR$3].call([1]);
});

var ITERATOR_IS_VALUES = !!TypedArrayPrototype
  && TypedArrayPrototype.values
  && TypedArrayPrototype[ITERATOR$3] === TypedArrayPrototype.values
  && TypedArrayPrototype.values.name === 'values';

var typedArrayValues = function values() {
  return arrayValues(aTypedArray$k(this));
};

// `%TypedArray%.prototype.entries` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
exportTypedArrayMethod$l('entries', function entries() {
  return arrayEntries(aTypedArray$k(this));
}, GENERIC);
// `%TypedArray%.prototype.keys` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys
exportTypedArrayMethod$l('keys', function keys() {
  return arrayKeys(aTypedArray$k(this));
}, GENERIC);
// `%TypedArray%.prototype.values` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
exportTypedArrayMethod$l('values', typedArrayValues, GENERIC || !ITERATOR_IS_VALUES, { name: 'values' });
// `%TypedArray%.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator
exportTypedArrayMethod$l(ITERATOR$3, typedArrayValues, GENERIC || !ITERATOR_IS_VALUES, { name: 'values' });

var ArrayBufferViewCore$l = arrayBufferViewCore;
var uncurryThis$q = functionUncurryThis;

var aTypedArray$j = ArrayBufferViewCore$l.aTypedArray;
var exportTypedArrayMethod$k = ArrayBufferViewCore$l.exportTypedArrayMethod;
var $join = uncurryThis$q([].join);

// `%TypedArray%.prototype.join` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.join
exportTypedArrayMethod$k('join', function join(separator) {
  return $join(aTypedArray$j(this), separator);
});

var ArrayBufferViewCore$k = arrayBufferViewCore;
var apply$h = functionApply$1;
var $lastIndexOf = arrayLastIndexOf;

var aTypedArray$i = ArrayBufferViewCore$k.aTypedArray;
var exportTypedArrayMethod$j = ArrayBufferViewCore$k.exportTypedArrayMethod;

// `%TypedArray%.prototype.lastIndexOf` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof
exportTypedArrayMethod$j('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
  var length = arguments.length;
  return apply$h($lastIndexOf, aTypedArray$i(this), length > 1 ? [searchElement, arguments[1]] : [searchElement]);
});

var ArrayBufferViewCore$j = arrayBufferViewCore;
var $map = arrayIteration.map;
var typedArraySpeciesConstructor$3 = typedArraySpeciesConstructor$5;

var aTypedArray$h = ArrayBufferViewCore$j.aTypedArray;
var exportTypedArrayMethod$i = ArrayBufferViewCore$j.exportTypedArrayMethod;

// `%TypedArray%.prototype.map` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.map
exportTypedArrayMethod$i('map', function map(mapfn /* , thisArg */) {
  return $map(aTypedArray$h(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
    return new (typedArraySpeciesConstructor$3(O))(length);
  });
});

var ArrayBufferViewCore$i = arrayBufferViewCore;
var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = typedArrayConstructorsRequireWrappers;

var aTypedArrayConstructor$1 = ArrayBufferViewCore$i.aTypedArrayConstructor;
var exportTypedArrayStaticMethod$1 = ArrayBufferViewCore$i.exportTypedArrayStaticMethod;

// `%TypedArray%.of` method
// https://tc39.es/ecma262/#sec-%typedarray%.of
exportTypedArrayStaticMethod$1('of', function of(/* ...items */) {
  var index = 0;
  var length = arguments.length;
  var result = new (aTypedArrayConstructor$1(this))(length);
  while (length > index) result[index] = arguments[index++];
  return result;
}, TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS);

var ArrayBufferViewCore$h = arrayBufferViewCore;
var $reduce = arrayReduce.left;

var aTypedArray$g = ArrayBufferViewCore$h.aTypedArray;
var exportTypedArrayMethod$h = ArrayBufferViewCore$h.exportTypedArrayMethod;

// `%TypedArray%.prototype.reduce` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce
exportTypedArrayMethod$h('reduce', function reduce(callbackfn /* , initialValue */) {
  var length = arguments.length;
  return $reduce(aTypedArray$g(this), callbackfn, length, length > 1 ? arguments[1] : undefined);
});

var ArrayBufferViewCore$g = arrayBufferViewCore;
var $reduceRight = arrayReduce.right;

var aTypedArray$f = ArrayBufferViewCore$g.aTypedArray;
var exportTypedArrayMethod$g = ArrayBufferViewCore$g.exportTypedArrayMethod;

// `%TypedArray%.prototype.reduceRight` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright
exportTypedArrayMethod$g('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
  var length = arguments.length;
  return $reduceRight(aTypedArray$f(this), callbackfn, length, length > 1 ? arguments[1] : undefined);
});

var ArrayBufferViewCore$f = arrayBufferViewCore;

var aTypedArray$e = ArrayBufferViewCore$f.aTypedArray;
var exportTypedArrayMethod$f = ArrayBufferViewCore$f.exportTypedArrayMethod;
var floor$2 = Math.floor;

// `%TypedArray%.prototype.reverse` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse
exportTypedArrayMethod$f('reverse', function reverse() {
  var that = this;
  var length = aTypedArray$e(that).length;
  var middle = floor$2(length / 2);
  var index = 0;
  var value;
  while (index < middle) {
    value = that[index];
    that[index++] = that[--length];
    that[length] = value;
  } return that;
});

var global$l = global$$;
var call$y = functionCall;
var ArrayBufferViewCore$e = arrayBufferViewCore;
var lengthOfArrayLike$b = lengthOfArrayLike$A;
var toOffset = toOffset$2;
var toIndexedObject$5 = toObject$B;
var fails$b = fails$1m;

var RangeError$2 = global$l.RangeError;
var Int8Array$2 = global$l.Int8Array;
var Int8ArrayPrototype = Int8Array$2 && Int8Array$2.prototype;
var $set = Int8ArrayPrototype && Int8ArrayPrototype.set;
var aTypedArray$d = ArrayBufferViewCore$e.aTypedArray;
var exportTypedArrayMethod$e = ArrayBufferViewCore$e.exportTypedArrayMethod;

var WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS = !fails$b(function () {
  // eslint-disable-next-line es-x/no-typed-arrays -- required for testing
  var array = new Uint8ClampedArray(2);
  call$y($set, array, { length: 1, 0: 3 }, 1);
  return array[1] !== 3;
});

// https://bugs.chromium.org/p/v8/issues/detail?id=11294 and other
var TO_OBJECT_BUG = WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS && ArrayBufferViewCore$e.NATIVE_ARRAY_BUFFER_VIEWS && fails$b(function () {
  var array = new Int8Array$2(2);
  array.set(1);
  array.set('2', 1);
  return array[0] !== 0 || array[1] !== 2;
});

// `%TypedArray%.prototype.set` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
exportTypedArrayMethod$e('set', function set(arrayLike /* , offset */) {
  aTypedArray$d(this);
  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
  var src = toIndexedObject$5(arrayLike);
  if (WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS) return call$y($set, this, src, offset);
  var length = this.length;
  var len = lengthOfArrayLike$b(src);
  var index = 0;
  if (len + offset > length) throw RangeError$2('Wrong length');
  while (index < len) this[offset + index] = src[index++];
}, !WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS || TO_OBJECT_BUG);

var ArrayBufferViewCore$d = arrayBufferViewCore;
var typedArraySpeciesConstructor$2 = typedArraySpeciesConstructor$5;
var fails$a = fails$1m;
var arraySlice$4 = arraySlice$c;

var aTypedArray$c = ArrayBufferViewCore$d.aTypedArray;
var exportTypedArrayMethod$d = ArrayBufferViewCore$d.exportTypedArrayMethod;

var FORCED$2 = fails$a(function () {
  // eslint-disable-next-line es-x/no-typed-arrays -- required for testing
  new Int8Array(1).slice();
});

// `%TypedArray%.prototype.slice` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice
exportTypedArrayMethod$d('slice', function slice(start, end) {
  var list = arraySlice$4(aTypedArray$c(this), start, end);
  var C = typedArraySpeciesConstructor$2(this);
  var index = 0;
  var length = list.length;
  var result = new C(length);
  while (length > index) result[index] = list[index++];
  return result;
}, FORCED$2);

var ArrayBufferViewCore$c = arrayBufferViewCore;
var $some$1 = arrayIteration.some;

var aTypedArray$b = ArrayBufferViewCore$c.aTypedArray;
var exportTypedArrayMethod$c = ArrayBufferViewCore$c.exportTypedArrayMethod;

// `%TypedArray%.prototype.some` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.some
exportTypedArrayMethod$c('some', function some(callbackfn /* , thisArg */) {
  return $some$1(aTypedArray$b(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

var global$k = global$$;
var uncurryThis$p = functionUncurryThis;
var fails$9 = fails$1m;
var aCallable$G = aCallable$X;
var internalSort = arraySort$1;
var ArrayBufferViewCore$b = arrayBufferViewCore;
var FF = engineFfVersion;
var IE_OR_EDGE = engineIsIeOrEdge;
var V8$1 = engineV8Version;
var WEBKIT = engineWebkitVersion;

var aTypedArray$a = ArrayBufferViewCore$b.aTypedArray;
var exportTypedArrayMethod$b = ArrayBufferViewCore$b.exportTypedArrayMethod;
var Uint16Array = global$k.Uint16Array;
var un$Sort = Uint16Array && uncurryThis$p(Uint16Array.prototype.sort);

// WebKit
var ACCEPT_INCORRECT_ARGUMENTS = !!un$Sort && !(fails$9(function () {
  un$Sort(new Uint16Array(2), null);
}) && fails$9(function () {
  un$Sort(new Uint16Array(2), {});
}));

var STABLE_SORT = !!un$Sort && !fails$9(function () {
  // feature detection can be too slow, so check engines versions
  if (V8$1) return V8$1 < 74;
  if (FF) return FF < 67;
  if (IE_OR_EDGE) return true;
  if (WEBKIT) return WEBKIT < 602;

  var array = new Uint16Array(516);
  var expected = Array(516);
  var index, mod;

  for (index = 0; index < 516; index++) {
    mod = index % 4;
    array[index] = 515 - index;
    expected[index] = index - 2 * mod + 3;
  }

  un$Sort(array, function (a, b) {
    return (a / 4 | 0) - (b / 4 | 0);
  });

  for (index = 0; index < 516; index++) {
    if (array[index] !== expected[index]) return true;
  }
});

var getSortCompare = function (comparefn) {
  return function (x, y) {
    if (comparefn !== undefined) return +comparefn(x, y) || 0;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (y !== y) return -1;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (x !== x) return 1;
    if (x === 0 && y === 0) return 1 / x > 0 && 1 / y < 0 ? 1 : -1;
    return x > y;
  };
};

// `%TypedArray%.prototype.sort` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
exportTypedArrayMethod$b('sort', function sort(comparefn) {
  if (comparefn !== undefined) aCallable$G(comparefn);
  if (STABLE_SORT) return un$Sort(this, comparefn);

  return internalSort(aTypedArray$a(this), getSortCompare(comparefn));
}, !STABLE_SORT || ACCEPT_INCORRECT_ARGUMENTS);

var ArrayBufferViewCore$a = arrayBufferViewCore;
var toLength = toLength$d;
var toAbsoluteIndex$2 = toAbsoluteIndex$b;
var typedArraySpeciesConstructor$1 = typedArraySpeciesConstructor$5;

var aTypedArray$9 = ArrayBufferViewCore$a.aTypedArray;
var exportTypedArrayMethod$a = ArrayBufferViewCore$a.exportTypedArrayMethod;

// `%TypedArray%.prototype.subarray` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray
exportTypedArrayMethod$a('subarray', function subarray(begin, end) {
  var O = aTypedArray$9(this);
  var length = O.length;
  var beginIndex = toAbsoluteIndex$2(begin, length);
  var C = typedArraySpeciesConstructor$1(O);
  return new C(
    O.buffer,
    O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
    toLength((end === undefined ? length : toAbsoluteIndex$2(end, length)) - beginIndex)
  );
});

var global$j = global$$;
var apply$g = functionApply$1;
var ArrayBufferViewCore$9 = arrayBufferViewCore;
var fails$8 = fails$1m;
var arraySlice$3 = arraySlice$c;

var Int8Array$1 = global$j.Int8Array;
var aTypedArray$8 = ArrayBufferViewCore$9.aTypedArray;
var exportTypedArrayMethod$9 = ArrayBufferViewCore$9.exportTypedArrayMethod;
var $toLocaleString = [].toLocaleString;

// iOS Safari 6.x fails here
var TO_LOCALE_STRING_BUG = !!Int8Array$1 && fails$8(function () {
  $toLocaleString.call(new Int8Array$1(1));
});

var FORCED$1 = fails$8(function () {
  return [1, 2].toLocaleString() != new Int8Array$1([1, 2]).toLocaleString();
}) || !fails$8(function () {
  Int8Array$1.prototype.toLocaleString.call([1, 2]);
});

// `%TypedArray%.prototype.toLocaleString` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring
exportTypedArrayMethod$9('toLocaleString', function toLocaleString() {
  return apply$g(
    $toLocaleString,
    TO_LOCALE_STRING_BUG ? arraySlice$3(aTypedArray$8(this)) : aTypedArray$8(this),
    arraySlice$3(arguments)
  );
}, FORCED$1);

var exportTypedArrayMethod$8 = arrayBufferViewCore.exportTypedArrayMethod;
var fails$7 = fails$1m;
var global$i = global$$;
var uncurryThis$o = functionUncurryThis;

var Uint8Array = global$i.Uint8Array;
var Uint8ArrayPrototype = Uint8Array && Uint8Array.prototype || {};
var arrayToString = [].toString;
var join$4 = uncurryThis$o([].join);

if (fails$7(function () { arrayToString.call({}); })) {
  arrayToString = function toString() {
    return join$4(this);
  };
}

var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

// `%TypedArray%.prototype.toString` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tostring
exportTypedArrayMethod$8('toString', arrayToString, IS_NOT_ARRAY_METHOD);

var $$2e = _export;
var uncurryThis$n = functionUncurryThis;
var toString$6 = toString$z;

var fromCharCode$2 = String.fromCharCode;
var charAt$7 = uncurryThis$n(''.charAt);
var exec$5 = uncurryThis$n(/./.exec);
var stringSlice$3 = uncurryThis$n(''.slice);

var hex2 = /^[\da-f]{2}$/i;
var hex4 = /^[\da-f]{4}$/i;

// `unescape` method
// https://tc39.es/ecma262/#sec-unescape-string
$$2e({ global: true }, {
  unescape: function unescape(string) {
    var str = toString$6(string);
    var result = '';
    var length = str.length;
    var index = 0;
    var chr, part;
    while (index < length) {
      chr = charAt$7(str, index++);
      if (chr === '%') {
        if (charAt$7(str, index) === 'u') {
          part = stringSlice$3(str, index + 1, index + 5);
          if (exec$5(hex4, part)) {
            result += fromCharCode$2(parseInt(part, 16));
            index += 5;
            continue;
          }
        } else {
          part = stringSlice$3(str, index, index + 2);
          if (exec$5(hex2, part)) {
            result += fromCharCode$2(parseInt(part, 16));
            index += 2;
            continue;
          }
        }
      }
      result += chr;
    } return result;
  }
});

var uncurryThis$m = functionUncurryThis;
var defineBuiltIns$6 = defineBuiltIns$9;
var getWeakData = internalMetadata.exports.getWeakData;
var anObject$11 = anObject$1A;
var isObject$6 = isObject$C;
var anInstance$7 = anInstance$d;
var iterate$A = iterate$J;
var ArrayIterationModule = arrayIteration;
var hasOwn$a = hasOwnProperty_1;
var InternalStateModule$b = internalState;

var setInternalState$b = InternalStateModule$b.set;
var internalStateGetterFor = InternalStateModule$b.getterFor;
var find$1 = ArrayIterationModule.find;
var findIndex = ArrayIterationModule.findIndex;
var splice$1 = uncurryThis$m([].splice);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (store) {
  return store.frozen || (store.frozen = new UncaughtFrozenStore());
};

var UncaughtFrozenStore = function () {
  this.entries = [];
};

var findUncaughtFrozen = function (store, key) {
  return find$1(store.entries, function (it) {
    return it[0] === key;
  });
};

UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.entries.push([key, value]);
  },
  'delete': function (key) {
    var index = findIndex(this.entries, function (it) {
      return it[0] === key;
    });
    if (~index) splice$1(this.entries, index, 1);
    return !!~index;
  }
};

var collectionWeak$2 = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var Constructor = wrapper(function (that, iterable) {
      anInstance$7(that, Prototype);
      setInternalState$b(that, {
        type: CONSTRUCTOR_NAME,
        id: id++,
        frozen: undefined
      });
      if (iterable != undefined) iterate$A(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
    });

    var Prototype = Constructor.prototype;

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var data = getWeakData(anObject$11(key), true);
      if (data === true) uncaughtFrozenStore(state).set(key, value);
      else data[state.id] = value;
      return that;
    };

    defineBuiltIns$6(Prototype, {
      // `{ WeakMap, WeakSet }.prototype.delete(key)` methods
      // https://tc39.es/ecma262/#sec-weakmap.prototype.delete
      // https://tc39.es/ecma262/#sec-weakset.prototype.delete
      'delete': function (key) {
        var state = getInternalState(this);
        if (!isObject$6(key)) return false;
        var data = getWeakData(key);
        if (data === true) return uncaughtFrozenStore(state)['delete'](key);
        return data && hasOwn$a(data, state.id) && delete data[state.id];
      },
      // `{ WeakMap, WeakSet }.prototype.has(key)` methods
      // https://tc39.es/ecma262/#sec-weakmap.prototype.has
      // https://tc39.es/ecma262/#sec-weakset.prototype.has
      has: function has(key) {
        var state = getInternalState(this);
        if (!isObject$6(key)) return false;
        var data = getWeakData(key);
        if (data === true) return uncaughtFrozenStore(state).has(key);
        return data && hasOwn$a(data, state.id);
      }
    });

    defineBuiltIns$6(Prototype, IS_MAP ? {
      // `WeakMap.prototype.get(key)` method
      // https://tc39.es/ecma262/#sec-weakmap.prototype.get
      get: function get(key) {
        var state = getInternalState(this);
        if (isObject$6(key)) {
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state).get(key);
          return data ? data[state.id] : undefined;
        }
      },
      // `WeakMap.prototype.set(key, value)` method
      // https://tc39.es/ecma262/#sec-weakmap.prototype.set
      set: function set(key, value) {
        return define(this, key, value);
      }
    } : {
      // `WeakSet.prototype.add(value)` method
      // https://tc39.es/ecma262/#sec-weakset.prototype.add
      add: function add(value) {
        return define(this, value, true);
      }
    });

    return Constructor;
  }
};

var global$h = global$$;
var uncurryThis$l = functionUncurryThis;
var defineBuiltIns$5 = defineBuiltIns$9;
var InternalMetadataModule = internalMetadata.exports;
var collection$1 = collection$4;
var collectionWeak$1 = collectionWeak$2;
var isObject$5 = isObject$C;
var isExtensible = objectIsExtensible;
var enforceInternalState = internalState.enforce;
var NATIVE_WEAK_MAP = nativeWeakMap;

var IS_IE11 = !global$h.ActiveXObject && 'ActiveXObject' in global$h;
var InternalWeakMap;

var wrapper = function (init) {
  return function WeakMap() {
    return init(this, arguments.length ? arguments[0] : undefined);
  };
};

// `WeakMap` constructor
// https://tc39.es/ecma262/#sec-weakmap-constructor
var $WeakMap = collection$1('WeakMap', wrapper, collectionWeak$1);

// IE11 WeakMap frozen keys fix
// We can't use feature detection because it crash some old IE builds
// https://github.com/zloirock/core-js/issues/485
if (NATIVE_WEAK_MAP && IS_IE11) {
  InternalWeakMap = collectionWeak$1.getConstructor(wrapper, 'WeakMap', true);
  InternalMetadataModule.enable();
  var WeakMapPrototype = $WeakMap.prototype;
  var nativeDelete = uncurryThis$l(WeakMapPrototype['delete']);
  var nativeHas = uncurryThis$l(WeakMapPrototype.has);
  var nativeGet = uncurryThis$l(WeakMapPrototype.get);
  var nativeSet = uncurryThis$l(WeakMapPrototype.set);
  defineBuiltIns$5(WeakMapPrototype, {
    'delete': function (key) {
      if (isObject$5(key) && !isExtensible(key)) {
        var state = enforceInternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeDelete(this, key) || state.frozen['delete'](key);
      } return nativeDelete(this, key);
    },
    has: function has(key) {
      if (isObject$5(key) && !isExtensible(key)) {
        var state = enforceInternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeHas(this, key) || state.frozen.has(key);
      } return nativeHas(this, key);
    },
    get: function get(key) {
      if (isObject$5(key) && !isExtensible(key)) {
        var state = enforceInternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeHas(this, key) ? nativeGet(this, key) : state.frozen.get(key);
      } return nativeGet(this, key);
    },
    set: function set(key, value) {
      if (isObject$5(key) && !isExtensible(key)) {
        var state = enforceInternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        nativeHas(this, key) ? nativeSet(this, key, value) : state.frozen.set(key, value);
      } else nativeSet(this, key, value);
      return this;
    }
  });
}

var collection = collection$4;
var collectionWeak = collectionWeak$2;

// `WeakSet` constructor
// https://tc39.es/ecma262/#sec-weakset-constructor
collection('WeakSet', function (init) {
  return function WeakSet() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionWeak);

var global$g = global$$;
var shared$1 = sharedStore;
var isCallable$8 = isCallable$E;
var getPrototypeOf$3 = objectGetPrototypeOf$1;
var defineBuiltIn$4 = defineBuiltIn$p;
var wellKnownSymbol$d = wellKnownSymbol$K;

var USE_FUNCTION_CONSTRUCTOR = 'USE_FUNCTION_CONSTRUCTOR';
var ASYNC_ITERATOR$3 = wellKnownSymbol$d('asyncIterator');
var AsyncIterator = global$g.AsyncIterator;
var PassedAsyncIteratorPrototype = shared$1.AsyncIteratorPrototype;
var AsyncIteratorPrototype$4, prototype;

if (PassedAsyncIteratorPrototype) {
  AsyncIteratorPrototype$4 = PassedAsyncIteratorPrototype;
} else if (isCallable$8(AsyncIterator)) {
  AsyncIteratorPrototype$4 = AsyncIterator.prototype;
} else if (shared$1[USE_FUNCTION_CONSTRUCTOR] || global$g[USE_FUNCTION_CONSTRUCTOR]) {
  try {
    // eslint-disable-next-line no-new-func -- we have no alternatives without usage of modern syntax
    prototype = getPrototypeOf$3(getPrototypeOf$3(getPrototypeOf$3(Function('return async function*(){}()')())));
    if (getPrototypeOf$3(prototype) === Object.prototype) AsyncIteratorPrototype$4 = prototype;
  } catch (error) { /* empty */ }
}

if (!AsyncIteratorPrototype$4) AsyncIteratorPrototype$4 = {};

if (!isCallable$8(AsyncIteratorPrototype$4[ASYNC_ITERATOR$3])) {
  defineBuiltIn$4(AsyncIteratorPrototype$4, ASYNC_ITERATOR$3, function () {
    return this;
  });
}

var asyncIteratorPrototype = AsyncIteratorPrototype$4;

var apply$f = functionApply$1;
var anObject$10 = anObject$1A;
var create$6 = objectCreate$1;
var getMethod$8 = getMethod$i;
var defineBuiltIns$4 = defineBuiltIns$9;
var InternalStateModule$a = internalState;
var getBuiltIn$s = getBuiltIn$L;
var AsyncIteratorPrototype$3 = asyncIteratorPrototype;

var Promise$3 = getBuiltIn$s('Promise');

var ASYNC_FROM_SYNC_ITERATOR = 'AsyncFromSyncIterator';
var setInternalState$a = InternalStateModule$a.set;
var getInternalState$7 = InternalStateModule$a.getterFor(ASYNC_FROM_SYNC_ITERATOR);

var asyncFromSyncIteratorContinuation = function (result, resolve, reject) {
  var done = result.done;
  Promise$3.resolve(result.value).then(function (value) {
    resolve({ done: done, value: value });
  }, reject);
};

var AsyncFromSyncIterator$4 = function AsyncIterator(iterator) {
  setInternalState$a(this, {
    type: ASYNC_FROM_SYNC_ITERATOR,
    iterator: anObject$10(iterator),
    next: iterator.next
  });
};

AsyncFromSyncIterator$4.prototype = defineBuiltIns$4(create$6(AsyncIteratorPrototype$3), {
  next: function next(arg) {
    var state = getInternalState$7(this);
    var hasArg = !!arguments.length;
    return new Promise$3(function (resolve, reject) {
      var result = anObject$10(apply$f(state.next, state.iterator, hasArg ? [arg] : []));
      asyncFromSyncIteratorContinuation(result, resolve, reject);
    });
  },
  'return': function (arg) {
    var iterator = getInternalState$7(this).iterator;
    var hasArg = !!arguments.length;
    return new Promise$3(function (resolve, reject) {
      var $return = getMethod$8(iterator, 'return');
      if ($return === undefined) return resolve({ done: true, value: arg });
      var result = anObject$10(apply$f($return, iterator, hasArg ? [arg] : []));
      asyncFromSyncIteratorContinuation(result, resolve, reject);
    });
  },
  'throw': function (arg) {
    var iterator = getInternalState$7(this).iterator;
    var hasArg = !!arguments.length;
    return new Promise$3(function (resolve, reject) {
      var $throw = getMethod$8(iterator, 'throw');
      if ($throw === undefined) return reject(arg);
      var result = anObject$10(apply$f($throw, iterator, hasArg ? [arg] : []));
      asyncFromSyncIteratorContinuation(result, resolve, reject);
    });
  }
});

var asyncFromSyncIterator = AsyncFromSyncIterator$4;

var call$x = functionCall;
var AsyncFromSyncIterator$3 = asyncFromSyncIterator;
var anObject$$ = anObject$1A;
var getIterator$7 = getIterator$b;
var getMethod$7 = getMethod$i;
var wellKnownSymbol$c = wellKnownSymbol$K;

var ASYNC_ITERATOR$2 = wellKnownSymbol$c('asyncIterator');

var getAsyncIterator$3 = function (it, usingIterator) {
  var method = arguments.length < 2 ? getMethod$7(it, ASYNC_ITERATOR$2) : usingIterator;
  return method ? anObject$$(call$x(method, it)) : new AsyncFromSyncIterator$3(getIterator$7(it));
};

var global$f = global$$;

var entryVirtual = function (CONSTRUCTOR) {
  return global$f[CONSTRUCTOR].prototype;
};

var aCallable$F = aCallable$X;
var anObject$_ = anObject$1A;

var getIteratorDirect$m = function (obj) {
  return {
    iterator: obj,
    next: aCallable$F(anObject$_(obj).next)
  };
};

// https://github.com/tc39/proposal-iterator-helpers
// https://github.com/tc39/proposal-array-from-async
var call$w = functionCall;
var aCallable$E = aCallable$X;
var anObject$Z = anObject$1A;
var doesNotExceedSafeInteger$1 = doesNotExceedSafeInteger$7;
var getBuiltIn$r = getBuiltIn$L;
var getIteratorDirect$l = getIteratorDirect$m;
var getMethod$6 = getMethod$i;

var createMethod = function (TYPE) {
  var IS_TO_ARRAY = TYPE == 0;
  var IS_FOR_EACH = TYPE == 1;
  var IS_EVERY = TYPE == 2;
  var IS_SOME = TYPE == 3;
  return function (object, fn, target) {
    var record = getIteratorDirect$l(object);
    var Promise = getBuiltIn$r('Promise');
    var iterator = record.iterator;
    var next = record.next;
    var index = 0;
    var MAPPING = fn !== undefined;
    if (MAPPING || !IS_TO_ARRAY) aCallable$E(fn);

    return new Promise(function (resolve, reject) {
      var closeIteration = function (method, argument) {
        try {
          var returnMethod = getMethod$6(iterator, 'return');
          if (returnMethod) {
            return Promise.resolve(call$w(returnMethod, iterator)).then(function () {
              method(argument);
            }, function (error) {
              reject(error);
            });
          }
        } catch (error2) {
          return reject(error2);
        } method(argument);
      };

      var onError = function (error) {
        closeIteration(reject, error);
      };

      var loop = function () {
        try {
          if (IS_TO_ARRAY && MAPPING) doesNotExceedSafeInteger$1(index);
          Promise.resolve(anObject$Z(call$w(next, iterator))).then(function (step) {
            try {
              if (anObject$Z(step).done) {
                if (IS_TO_ARRAY) {
                  target.length = index;
                  resolve(target);
                } else resolve(IS_SOME ? false : IS_EVERY || undefined);
              } else {
                var value = step.value;
                if (MAPPING) {
                  Promise.resolve(IS_TO_ARRAY ? fn(value, index) : fn(value)).then(function (result) {
                    if (IS_FOR_EACH) {
                      loop();
                    } else if (IS_EVERY) {
                      result ? loop() : closeIteration(resolve, false);
                    } else if (IS_TO_ARRAY) {
                      target[index++] = result;
                      loop();
                    } else {
                      result ? closeIteration(resolve, IS_SOME || value) : loop();
                    }
                  }, onError);
                } else {
                  target[index++] = value;
                  loop();
                }
              }
            } catch (error) { onError(error); }
          }, onError);
        } catch (error2) { onError(error2); }
      };

      loop();
    });
  };
};

var asyncIteratorIteration = {
  toArray: createMethod(0),
  forEach: createMethod(1),
  every: createMethod(2),
  some: createMethod(3),
  find: createMethod(4)
};

var bind$h = functionBindContext;
var toObject$8 = toObject$B;
var isConstructor$4 = isConstructor$a;
var getAsyncIterator$2 = getAsyncIterator$3;
var getIterator$6 = getIterator$b;
var getIteratorMethod$4 = getIteratorMethod$9;
var getMethod$5 = getMethod$i;
var getVirtual$1 = entryVirtual;
var getBuiltIn$q = getBuiltIn$L;
var wellKnownSymbol$b = wellKnownSymbol$K;
var AsyncFromSyncIterator$2 = asyncFromSyncIterator;
var toArray = asyncIteratorIteration.toArray;

var ASYNC_ITERATOR$1 = wellKnownSymbol$b('asyncIterator');
var arrayIterator = getVirtual$1('Array').values;

// `Array.fromAsync` method implementation
// https://github.com/tc39/proposal-array-from-async
var arrayFromAsync$1 = function fromAsync(asyncItems /* , mapfn = undefined, thisArg = undefined */) {
  var C = this;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var thisArg = argumentsLength > 2 ? arguments[2] : undefined;
  return new (getBuiltIn$q('Promise'))(function (resolve) {
    var O = toObject$8(asyncItems);
    if (mapfn !== undefined) mapfn = bind$h(mapfn, thisArg);
    var usingAsyncIterator = getMethod$5(O, ASYNC_ITERATOR$1);
    var usingSyncIterator = usingAsyncIterator ? undefined : getIteratorMethod$4(O) || arrayIterator;
    var A = isConstructor$4(C) ? new C() : [];
    var iterator = usingAsyncIterator
      ? getAsyncIterator$2(O, usingAsyncIterator)
      : new AsyncFromSyncIterator$2(getIterator$6(O, usingSyncIterator));
    resolve(toArray(iterator, mapfn, A));
  });
};

var $$2d = _export;
var fromAsync = arrayFromAsync$1;

// `Array.fromAsync` method
// https://github.com/tc39/proposal-array-from-async
$$2d({ target: 'Array', stat: true, forced: true }, {
  fromAsync: fromAsync
});

// TODO: remove from `core-js@4`
var $$2c = _export;
var $filterReject$3 = arrayIteration.filterReject;
var addToUnscopables$b = addToUnscopables$n;

// `Array.prototype.filterOut` method
// https://github.com/tc39/proposal-array-filtering
$$2c({ target: 'Array', proto: true, forced: true }, {
  filterOut: function filterOut(callbackfn /* , thisArg */) {
    return $filterReject$3(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

addToUnscopables$b('filterOut');

var $$2b = _export;
var $filterReject$2 = arrayIteration.filterReject;
var addToUnscopables$a = addToUnscopables$n;

// `Array.prototype.filterReject` method
// https://github.com/tc39/proposal-array-filtering
$$2b({ target: 'Array', proto: true, forced: true }, {
  filterReject: function filterReject(callbackfn /* , thisArg */) {
    return $filterReject$2(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

addToUnscopables$a('filterReject');

var bind$g = functionBindContext;
var uncurryThis$k = functionUncurryThis;
var IndexedObject$1 = indexedObject;
var toObject$7 = toObject$B;
var toPropertyKey = toPropertyKey$9;
var lengthOfArrayLike$a = lengthOfArrayLike$A;
var objectCreate = objectCreate$1;
var arrayFromConstructorAndList$3 = arrayFromConstructorAndList$5;

var $Array$4 = Array;
var push$c = uncurryThis$k([].push);

var arrayGroup = function ($this, callbackfn, that, specificConstructor) {
  var O = toObject$7($this);
  var self = IndexedObject$1(O);
  var boundFunction = bind$g(callbackfn, that);
  var target = objectCreate(null);
  var length = lengthOfArrayLike$a(self);
  var index = 0;
  var Constructor, key, value;
  for (;length > index; index++) {
    value = self[index];
    key = toPropertyKey(boundFunction(value, index, O));
    // in some IE10 builds, `hasOwnProperty` returns incorrect result on integer keys
    // but since it's a `null` prototype object, we can safely use `in`
    if (key in target) push$c(target[key], value);
    else target[key] = [value];
  }
  // TODO: Remove this block from `core-js@4`
  if (specificConstructor) {
    Constructor = specificConstructor(O);
    if (Constructor !== $Array$4) {
      for (key in target) target[key] = arrayFromConstructorAndList$3(Constructor, target[key]);
    }
  } return target;
};

var $$2a = _export;
var $group$2 = arrayGroup;
var addToUnscopables$9 = addToUnscopables$n;

// `Array.prototype.group` method
// https://github.com/tc39/proposal-array-grouping
$$2a({ target: 'Array', proto: true }, {
  group: function group(callbackfn /* , thisArg */) {
    var thisArg = arguments.length > 1 ? arguments[1] : undefined;
    return $group$2(this, callbackfn, thisArg);
  }
});

addToUnscopables$9('group');

// TODO: Remove from `core-js@4`
var $$29 = _export;
var $group$1 = arrayGroup;
var arrayMethodIsStrict$1 = arrayMethodIsStrict$b;
var addToUnscopables$8 = addToUnscopables$n;

// `Array.prototype.groupBy` method
// https://github.com/tc39/proposal-array-grouping
// https://bugs.webkit.org/show_bug.cgi?id=236541
$$29({ target: 'Array', proto: true, forced: !arrayMethodIsStrict$1('groupBy') }, {
  groupBy: function groupBy(callbackfn /* , thisArg */) {
    var thisArg = arguments.length > 1 ? arguments[1] : undefined;
    return $group$1(this, callbackfn, thisArg);
  }
});

addToUnscopables$8('groupBy');

var getBuiltIn$p = getBuiltIn$L;
var bind$f = functionBindContext;
var uncurryThis$j = functionUncurryThis;
var IndexedObject = indexedObject;
var toObject$6 = toObject$B;
var lengthOfArrayLike$9 = lengthOfArrayLike$A;

var Map$5 = getBuiltIn$p('Map');
var MapPrototype$2 = Map$5.prototype;
var mapGet$1 = uncurryThis$j(MapPrototype$2.get);
var mapHas$2 = uncurryThis$j(MapPrototype$2.has);
var mapSet$2 = uncurryThis$j(MapPrototype$2.set);
var push$b = uncurryThis$j([].push);

// `Array.prototype.groupToMap` method
// https://github.com/tc39/proposal-array-grouping
var arrayGroupToMap = function groupToMap(callbackfn /* , thisArg */) {
  var O = toObject$6(this);
  var self = IndexedObject(O);
  var boundFunction = bind$f(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  var map = new Map$5();
  var length = lengthOfArrayLike$9(self);
  var index = 0;
  var key, value;
  for (;length > index; index++) {
    value = self[index];
    key = boundFunction(value, index, O);
    if (mapHas$2(map, key)) push$b(mapGet$1(map, key), value);
    else mapSet$2(map, key, [value]);
  } return map;
};

// TODO: Remove from `core-js@4`
var $$28 = _export;
var arrayMethodIsStrict = arrayMethodIsStrict$b;
var addToUnscopables$7 = addToUnscopables$n;
var $groupToMap$1 = arrayGroupToMap;

// `Array.prototype.groupByToMap` method
// https://github.com/tc39/proposal-array-grouping
// https://bugs.webkit.org/show_bug.cgi?id=236541
$$28({ target: 'Array', proto: true, name: 'groupToMap', forced: !arrayMethodIsStrict('groupByToMap') }, {
  groupByToMap: $groupToMap$1
});

addToUnscopables$7('groupByToMap');

var $$27 = _export;
var addToUnscopables$6 = addToUnscopables$n;
var $groupToMap = arrayGroupToMap;

// `Array.prototype.groupToMap` method
// https://github.com/tc39/proposal-array-grouping
$$27({ target: 'Array', proto: true }, {
  groupToMap: $groupToMap
});

addToUnscopables$6('groupToMap');

var $$26 = _export;
var isArray = isArray$8;

// eslint-disable-next-line es-x/no-object-isfrozen -- safe
var isFrozen = Object.isFrozen;

var isFrozenStringArray = function (array, allowUndefined) {
  if (!isFrozen || !isArray(array) || !isFrozen(array)) return false;
  var index = 0;
  var length = array.length;
  var element;
  while (index < length) {
    element = array[index++];
    if (!(typeof element == 'string' || (allowUndefined && typeof element == 'undefined'))) {
      return false;
    }
  } return length !== 0;
};

// `Array.isTemplateObject` method
// https://github.com/tc39/proposal-array-is-template-object
$$26({ target: 'Array', stat: true, sham: true, forced: true }, {
  isTemplateObject: function isTemplateObject(value) {
    if (!isFrozenStringArray(value, true)) return false;
    var raw = value.raw;
    return raw.length === value.length && isFrozenStringArray(raw, false);
  }
});

// TODO: Remove from `core-js@4`
var DESCRIPTORS$8 = descriptors;
var addToUnscopables$5 = addToUnscopables$n;
var toObject$5 = toObject$B;
var lengthOfArrayLike$8 = lengthOfArrayLike$A;
var defineBuiltInAccessor$4 = defineBuiltInAccessor$8;

// `Array.prototype.lastIndex` getter
// https://github.com/keithamus/proposal-array-last
if (DESCRIPTORS$8) {
  defineBuiltInAccessor$4(Array.prototype, 'lastIndex', {
    configurable: true,
    get: function lastIndex() {
      var O = toObject$5(this);
      var len = lengthOfArrayLike$8(O);
      return len == 0 ? 0 : len - 1;
    }
  });

  addToUnscopables$5('lastIndex');
}

// TODO: Remove from `core-js@4`
var DESCRIPTORS$7 = descriptors;
var addToUnscopables$4 = addToUnscopables$n;
var toObject$4 = toObject$B;
var lengthOfArrayLike$7 = lengthOfArrayLike$A;
var defineBuiltInAccessor$3 = defineBuiltInAccessor$8;

// `Array.prototype.lastIndex` accessor
// https://github.com/keithamus/proposal-array-last
if (DESCRIPTORS$7) {
  defineBuiltInAccessor$3(Array.prototype, 'lastItem', {
    configurable: true,
    get: function lastItem() {
      var O = toObject$4(this);
      var len = lengthOfArrayLike$7(O);
      return len == 0 ? undefined : O[len - 1];
    },
    set: function lastItem(value) {
      var O = toObject$4(this);
      var len = lengthOfArrayLike$7(O);
      return O[len == 0 ? 0 : len - 1] = value;
    }
  });

  addToUnscopables$4('lastItem');
}

var lengthOfArrayLike$6 = lengthOfArrayLike$A;

// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toReversed
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
var arrayToReversed$2 = function (O, C) {
  var len = lengthOfArrayLike$6(O);
  var A = new C(len);
  var k = 0;
  for (; k < len; k++) A[k] = O[len - k - 1];
  return A;
};

var $$25 = _export;
var arrayToReversed$1 = arrayToReversed$2;
var toIndexedObject$4 = toIndexedObject$k;
var addToUnscopables$3 = addToUnscopables$n;

var $Array$3 = Array;

// `Array.prototype.toReversed` method
// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toReversed
$$25({ target: 'Array', proto: true }, {
  toReversed: function toReversed() {
    return arrayToReversed$1(toIndexedObject$4(this), $Array$3);
  }
});

addToUnscopables$3('toReversed');

var $$24 = _export;
var uncurryThis$i = functionUncurryThis;
var aCallable$D = aCallable$X;
var toIndexedObject$3 = toIndexedObject$k;
var arrayFromConstructorAndList$2 = arrayFromConstructorAndList$5;
var getVirtual = entryVirtual;
var addToUnscopables$2 = addToUnscopables$n;

var $Array$2 = Array;
var sort$1 = uncurryThis$i(getVirtual('Array').sort);

// `Array.prototype.toSorted` method
// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toSorted
$$24({ target: 'Array', proto: true }, {
  toSorted: function toSorted(compareFn) {
    if (compareFn !== undefined) aCallable$D(compareFn);
    var O = toIndexedObject$3(this);
    var A = arrayFromConstructorAndList$2($Array$2, O);
    return sort$1(A, compareFn);
  }
});

addToUnscopables$2('toSorted');

var $$23 = _export;
var addToUnscopables$1 = addToUnscopables$n;
var doesNotExceedSafeInteger = doesNotExceedSafeInteger$7;
var lengthOfArrayLike$5 = lengthOfArrayLike$A;
var toAbsoluteIndex$1 = toAbsoluteIndex$b;
var toIndexedObject$2 = toIndexedObject$k;
var toIntegerOrInfinity$5 = toIntegerOrInfinity$o;

var $Array$1 = Array;
var max$2 = Math.max;
var min$2 = Math.min;

// `Array.prototype.toSpliced` method
// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toSpliced
$$23({ target: 'Array', proto: true }, {
  toSpliced: function toSpliced(start, deleteCount /* , ...items */) {
    var O = toIndexedObject$2(this);
    var len = lengthOfArrayLike$5(O);
    var actualStart = toAbsoluteIndex$1(start, len);
    var argumentsLength = arguments.length;
    var k = 0;
    var insertCount, actualDeleteCount, newLen, A;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min$2(max$2(toIntegerOrInfinity$5(deleteCount), 0), len - actualStart);
    }
    newLen = doesNotExceedSafeInteger(len + insertCount - actualDeleteCount);
    A = $Array$1(newLen);

    for (; k < actualStart; k++) A[k] = O[k];
    for (; k < actualStart + insertCount; k++) A[k] = arguments[k - actualStart + 2];
    for (; k < newLen; k++) A[k] = O[k + actualDeleteCount - insertCount];

    return A;
  }
});

addToUnscopables$1('toSpliced');

var getBuiltIn$o = getBuiltIn$L;
var uncurryThis$h = functionUncurryThis;
var aCallable$C = aCallable$X;
var lengthOfArrayLike$4 = lengthOfArrayLike$A;
var toObject$3 = toObject$B;
var arraySpeciesCreate = arraySpeciesCreate$6;

var Map$4 = getBuiltIn$o('Map');
var MapPrototype$1 = Map$4.prototype;
var mapForEach = uncurryThis$h(MapPrototype$1.forEach);
var mapHas$1 = uncurryThis$h(MapPrototype$1.has);
var mapSet$1 = uncurryThis$h(MapPrototype$1.set);
var push$a = uncurryThis$h([].push);

// `Array.prototype.uniqueBy` method
// https://github.com/tc39/proposal-array-unique
var arrayUniqueBy$2 = function uniqueBy(resolver) {
  var that = toObject$3(this);
  var length = lengthOfArrayLike$4(that);
  var result = arraySpeciesCreate(that, 0);
  var map = new Map$4();
  var resolverFunction = resolver != null ? aCallable$C(resolver) : function (value) {
    return value;
  };
  var index, item, key;
  for (index = 0; index < length; index++) {
    item = that[index];
    key = resolverFunction(item);
    if (!mapHas$1(map, key)) mapSet$1(map, key, item);
  }
  mapForEach(map, function (value) {
    push$a(result, value);
  });
  return result;
};

var $$22 = _export;
var addToUnscopables = addToUnscopables$n;
var uniqueBy = arrayUniqueBy$2;

// `Array.prototype.uniqueBy` method
// https://github.com/tc39/proposal-array-unique
$$22({ target: 'Array', proto: true, forced: true }, {
  uniqueBy: uniqueBy
});

addToUnscopables('uniqueBy');

var lengthOfArrayLike$3 = lengthOfArrayLike$A;
var toIntegerOrInfinity$4 = toIntegerOrInfinity$o;

var $RangeError$3 = RangeError;

// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.with
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
var arrayWith$2 = function (O, C, index, value) {
  var len = lengthOfArrayLike$3(O);
  var relativeIndex = toIntegerOrInfinity$4(index);
  var actualIndex = relativeIndex < 0 ? len + relativeIndex : relativeIndex;
  if (actualIndex >= len || actualIndex < 0) throw $RangeError$3('Incorrect index');
  var A = new C(len);
  var k = 0;
  for (; k < len; k++) A[k] = k === actualIndex ? value : O[k];
  return A;
};

var $$21 = _export;
var arrayWith$1 = arrayWith$2;
var toIndexedObject$1 = toIndexedObject$k;

var $Array = Array;

// `Array.prototype.with` method
// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.with
$$21({ target: 'Array', proto: true }, {
  'with': function (index, value) {
    return arrayWith$1(toIndexedObject$1(this), $Array, index, value);
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$20 = _export;
var anInstance$6 = anInstance$d;
var createNonEnumerableProperty$6 = createNonEnumerableProperty$i;
var hasOwn$9 = hasOwnProperty_1;
var wellKnownSymbol$a = wellKnownSymbol$K;
var AsyncIteratorPrototype$2 = asyncIteratorPrototype;
var IS_PURE$1 = isPure;

var TO_STRING_TAG$4 = wellKnownSymbol$a('toStringTag');

var AsyncIteratorConstructor = function AsyncIterator() {
  anInstance$6(this, AsyncIteratorPrototype$2);
};

AsyncIteratorConstructor.prototype = AsyncIteratorPrototype$2;

if (!hasOwn$9(AsyncIteratorPrototype$2, TO_STRING_TAG$4)) {
  createNonEnumerableProperty$6(AsyncIteratorPrototype$2, TO_STRING_TAG$4, 'AsyncIterator');
}

if (!hasOwn$9(AsyncIteratorPrototype$2, 'constructor') || AsyncIteratorPrototype$2.constructor === Object) {
  createNonEnumerableProperty$6(AsyncIteratorPrototype$2, 'constructor', AsyncIteratorConstructor);
}

$$20({ global: true, constructor: true, forced: IS_PURE$1 }, {
  AsyncIterator: AsyncIteratorConstructor
});

var call$v = functionCall;
var anObject$Y = anObject$1A;
var create$5 = objectCreate$1;
var createNonEnumerableProperty$5 = createNonEnumerableProperty$i;
var defineBuiltIns$3 = defineBuiltIns$9;
var wellKnownSymbol$9 = wellKnownSymbol$K;
var InternalStateModule$9 = internalState;
var getBuiltIn$n = getBuiltIn$L;
var getMethod$4 = getMethod$i;
var AsyncIteratorPrototype$1 = asyncIteratorPrototype;

var Promise$2 = getBuiltIn$n('Promise');

var ASYNC_ITERATOR_PROXY = 'AsyncIteratorProxy';
var setInternalState$9 = InternalStateModule$9.set;
var getInternalState$6 = InternalStateModule$9.getterFor(ASYNC_ITERATOR_PROXY);

var TO_STRING_TAG$3 = wellKnownSymbol$9('toStringTag');

var asyncIteratorCreateProxy = function (nextHandler, IS_ITERATOR) {
  var AsyncIteratorProxy = function AsyncIterator(record, state) {
    if (state) {
      state.iterator = record.iterator;
      state.next = record.next;
    } else state = record;
    state.type = ASYNC_ITERATOR_PROXY;
    state.done = false;
    state.ignoreArgument = !IS_ITERATOR;
    setInternalState$9(this, state);
  };

  AsyncIteratorProxy.prototype = defineBuiltIns$3(create$5(AsyncIteratorPrototype$1), {
    next: function next(arg) {
      var that = this;
      var hasArgument = !!arguments.length;
      return new Promise$2(function (resolve) {
        var state = getInternalState$6(that);
        var args = hasArgument ? [state.ignoreArgument ? undefined : arg] : IS_ITERATOR ? [] : [undefined];
        state.ignoreArgument = false;
        resolve(state.done ? { done: true, value: undefined } : anObject$Y(call$v(nextHandler, state, Promise$2, args)));
      });
    },
    'return': function (value) {
      var that = this;
      return new Promise$2(function (resolve, reject) {
        var state = getInternalState$6(that);
        var iterator = state.iterator;
        state.done = true;
        var $$return = getMethod$4(iterator, 'return');
        if ($$return === undefined) return resolve({ done: true, value: value });
        Promise$2.resolve(call$v($$return, iterator, value)).then(function (result) {
          anObject$Y(result);
          resolve({ done: true, value: value });
        }, reject);
      });
    },
    'throw': function (value) {
      var that = this;
      return new Promise$2(function (resolve, reject) {
        var state = getInternalState$6(that);
        var iterator = state.iterator;
        state.done = true;
        var $$throw = getMethod$4(iterator, 'throw');
        if ($$throw === undefined) return reject(value);
        resolve(call$v($$throw, iterator, value));
      });
    }
  });

  if (!IS_ITERATOR) {
    createNonEnumerableProperty$5(AsyncIteratorProxy.prototype, TO_STRING_TAG$3, 'Generator');
  }

  return AsyncIteratorProxy;
};

// https://github.com/tc39/proposal-iterator-helpers
var $$1$ = _export;
var apply$e = functionApply$1;
var anObject$X = anObject$1A;
var getIteratorDirect$k = getIteratorDirect$m;
var createAsyncIteratorProxy$6 = asyncIteratorCreateProxy;

var AsyncIteratorProxy$6 = createAsyncIteratorProxy$6(function (Promise, args) {
  var state = this;
  var iterator = state.iterator;

  return Promise.resolve(anObject$X(apply$e(state.next, iterator, args))).then(function (step) {
    if (anObject$X(step).done) {
      state.done = true;
      return { done: true, value: undefined };
    }
    return { done: false, value: [state.index++, step.value] };
  });
});

$$1$({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
  asIndexedPairs: function asIndexedPairs() {
    return new AsyncIteratorProxy$6(getIteratorDirect$k(this), {
      index: 0
    });
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1_ = _export;
var apply$d = functionApply$1;
var anObject$W = anObject$1A;
var getIteratorDirect$j = getIteratorDirect$m;
var toPositiveInteger$3 = toPositiveInteger$5;
var createAsyncIteratorProxy$5 = asyncIteratorCreateProxy;

var AsyncIteratorProxy$5 = createAsyncIteratorProxy$5(function (Promise, args) {
  var state = this;

  return new Promise(function (resolve, reject) {
    var loop = function () {
      try {
        Promise.resolve(
          anObject$W(apply$d(state.next, state.iterator, state.remaining ? [] : args))
        ).then(function (step) {
          try {
            if (anObject$W(step).done) {
              state.done = true;
              resolve({ done: true, value: undefined });
            } else if (state.remaining) {
              state.remaining--;
              loop();
            } else resolve({ done: false, value: step.value });
          } catch (err) { reject(err); }
        }, reject);
      } catch (error) { reject(error); }
    };

    loop();
  });
});

$$1_({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
  drop: function drop(limit) {
    return new AsyncIteratorProxy$5(getIteratorDirect$j(this), {
      remaining: toPositiveInteger$3(limit)
    });
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1Z = _export;
var $every = asyncIteratorIteration.every;

$$1Z({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
  every: function every(fn) {
    return $every(this, fn);
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1Y = _export;
var apply$c = functionApply$1;
var aCallable$B = aCallable$X;
var anObject$V = anObject$1A;
var getIteratorDirect$i = getIteratorDirect$m;
var createAsyncIteratorProxy$4 = asyncIteratorCreateProxy;

var AsyncIteratorProxy$4 = createAsyncIteratorProxy$4(function (Promise, args) {
  var state = this;
  var filterer = state.filterer;

  return new Promise(function (resolve, reject) {
    var loop = function () {
      try {
        Promise.resolve(anObject$V(apply$c(state.next, state.iterator, args))).then(function (step) {
          try {
            if (anObject$V(step).done) {
              state.done = true;
              resolve({ done: true, value: undefined });
            } else {
              var value = step.value;
              Promise.resolve(filterer(value)).then(function (selected) {
                selected ? resolve({ done: false, value: value }) : loop();
              }, reject);
            }
          } catch (err) { reject(err); }
        }, reject);
      } catch (error) { reject(error); }
    };

    loop();
  });
});

$$1Y({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
  filter: function filter(filterer) {
    return new AsyncIteratorProxy$4(getIteratorDirect$i(this), {
      filterer: aCallable$B(filterer)
    });
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1X = _export;
var $find = asyncIteratorIteration.find;

$$1X({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
  find: function find(fn) {
    return $find(this, fn);
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1W = _export;
var call$u = functionCall;
var aCallable$A = aCallable$X;
var anObject$U = anObject$1A;
var getIteratorDirect$h = getIteratorDirect$m;
var createAsyncIteratorProxy$3 = asyncIteratorCreateProxy;
var getAsyncIterator$1 = getAsyncIterator$3;

var AsyncIteratorProxy$3 = createAsyncIteratorProxy$3(function (Promise) {
  var state = this;
  var mapper = state.mapper;
  var innerIterator;

  return new Promise(function (resolve, reject) {
    var outerLoop = function () {
      try {
        Promise.resolve(anObject$U(call$u(state.next, state.iterator))).then(function (step) {
          try {
            if (anObject$U(step).done) {
              state.done = true;
              resolve({ done: true, value: undefined });
            } else {
              Promise.resolve(mapper(step.value)).then(function (mapped) {
                try {
                  state.innerIterator = innerIterator = getAsyncIterator$1(mapped);
                  state.innerNext = aCallable$A(innerIterator.next);
                  return innerLoop();
                } catch (error2) { reject(error2); }
              }, reject);
            }
          } catch (error1) { reject(error1); }
        }, reject);
      } catch (error) { reject(error); }
    };

    var innerLoop = function () {
      if (innerIterator = state.innerIterator) {
        try {
          Promise.resolve(anObject$U(call$u(state.innerNext, innerIterator))).then(function (result) {
            try {
              if (anObject$U(result).done) {
                state.innerIterator = state.innerNext = null;
                outerLoop();
              } else resolve({ done: false, value: result.value });
            } catch (error1) { reject(error1); }
          }, reject);
        } catch (error) { reject(error); }
      } else outerLoop();
    };

    innerLoop();
  });
});

$$1W({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
  flatMap: function flatMap(mapper) {
    return new AsyncIteratorProxy$3(getIteratorDirect$h(this), {
      mapper: aCallable$A(mapper),
      innerIterator: null,
      innerNext: null
    });
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1V = _export;
var $forEach = asyncIteratorIteration.forEach;

$$1V({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
  forEach: function forEach(fn) {
    return $forEach(this, fn);
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1U = _export;
var apply$b = functionApply$1;
var anObject$T = anObject$1A;
var toObject$2 = toObject$B;
var isPrototypeOf$1 = objectIsPrototypeOf;
var AsyncIteratorPrototype = asyncIteratorPrototype;
var createAsyncIteratorProxy$2 = asyncIteratorCreateProxy;
var getAsyncIterator = getAsyncIterator$3;
var getIterator$5 = getIterator$b;
var getIteratorDirect$g = getIteratorDirect$m;
var getIteratorMethod$3 = getIteratorMethod$9;
var getMethod$3 = getMethod$i;
var wellKnownSymbol$8 = wellKnownSymbol$K;
var AsyncFromSyncIterator$1 = asyncFromSyncIterator;

var ASYNC_ITERATOR = wellKnownSymbol$8('asyncIterator');

var AsyncIteratorProxy$2 = createAsyncIteratorProxy$2(function (Promise, args) {
  return anObject$T(apply$b(this.next, this.iterator, args));
}, true);

$$1U({ target: 'AsyncIterator', stat: true, forced: true }, {
  from: function from(O) {
    var object = toObject$2(O);
    var usingIterator = getMethod$3(object, ASYNC_ITERATOR);
    var iterator;
    if (usingIterator) {
      iterator = getAsyncIterator(object, usingIterator);
      if (isPrototypeOf$1(AsyncIteratorPrototype, iterator)) return iterator;
    }
    if (iterator === undefined) {
      usingIterator = getIteratorMethod$3(object);
      if (usingIterator) return new AsyncFromSyncIterator$1(getIterator$5(object, usingIterator));
    }
    return new AsyncIteratorProxy$2(getIteratorDirect$g(iterator !== undefined ? iterator : object));
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1T = _export;
var apply$a = functionApply$1;
var aCallable$z = aCallable$X;
var anObject$S = anObject$1A;
var getIteratorDirect$f = getIteratorDirect$m;
var createAsyncIteratorProxy$1 = asyncIteratorCreateProxy;

var AsyncIteratorProxy$1 = createAsyncIteratorProxy$1(function (Promise, args) {
  var state = this;
  var mapper = state.mapper;

  return Promise.resolve(anObject$S(apply$a(state.next, state.iterator, args))).then(function (step) {
    if (anObject$S(step).done) {
      state.done = true;
      return { done: true, value: undefined };
    }
    return Promise.resolve(mapper(step.value)).then(function (value) {
      return { done: false, value: value };
    });
  });
});

$$1T({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
  map: function map(mapper) {
    return new AsyncIteratorProxy$1(getIteratorDirect$f(this), {
      mapper: aCallable$z(mapper)
    });
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1S = _export;
var call$t = functionCall;
var aCallable$y = aCallable$X;
var anObject$R = anObject$1A;
var getBuiltIn$m = getBuiltIn$L;
var getIteratorDirect$e = getIteratorDirect$m;

var Promise$1 = getBuiltIn$m('Promise');
var $TypeError$b = TypeError;

$$1S({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
  reduce: function reduce(reducer /* , initialValue */) {
    var record = getIteratorDirect$e(this);
    var iterator = record.iterator;
    var next = record.next;
    var noInitial = arguments.length < 2;
    var accumulator = noInitial ? undefined : arguments[1];
    aCallable$y(reducer);

    return new Promise$1(function (resolve, reject) {
      var loop = function () {
        try {
          Promise$1.resolve(anObject$R(call$t(next, iterator))).then(function (step) {
            try {
              if (anObject$R(step).done) {
                noInitial ? reject($TypeError$b('Reduce of empty iterator with no initial value')) : resolve(accumulator);
              } else {
                var value = step.value;
                if (noInitial) {
                  noInitial = false;
                  accumulator = value;
                  loop();
                } else {
                  Promise$1.resolve(reducer(accumulator, value)).then(function (result) {
                    accumulator = result;
                    loop();
                  }, reject);
                }
              }
            } catch (err) { reject(err); }
          }, reject);
        } catch (error) { reject(error); }
      };

      loop();
    });
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1R = _export;
var $some = asyncIteratorIteration.some;

$$1R({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
  some: function some(fn) {
    return $some(this, fn);
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1Q = _export;
var apply$9 = functionApply$1;
var call$s = functionCall;
var getIteratorDirect$d = getIteratorDirect$m;
var toPositiveInteger$2 = toPositiveInteger$5;
var createAsyncIteratorProxy = asyncIteratorCreateProxy;

var AsyncIteratorProxy = createAsyncIteratorProxy(function (Promise, args) {
  var iterator = this.iterator;
  var returnMethod, result;
  if (!this.remaining--) {
    result = { done: true, value: undefined };
    this.done = true;
    returnMethod = iterator['return'];
    if (returnMethod !== undefined) {
      return Promise.resolve(call$s(returnMethod, iterator)).then(function () {
        return result;
      });
    }
    return result;
  } return apply$9(this.next, iterator, args);
});

$$1Q({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
  take: function take(limit) {
    return new AsyncIteratorProxy(getIteratorDirect$d(this), {
      remaining: toPositiveInteger$2(limit)
    });
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1P = _export;
var $toArray = asyncIteratorIteration.toArray;

$$1P({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
  toArray: function toArray() {
    return $toArray(this, undefined, []);
  }
});

var InternalStateModule$8 = internalState;
var createIteratorConstructor$4 = createIteratorConstructor$7;
var isObject$4 = isObject$C;
var defineProperties = objectDefineProperties.f;
var DESCRIPTORS$6 = descriptors;

var INCORRECT_RANGE = 'Incorrect Number.range arguments';
var NUMERIC_RANGE_ITERATOR = 'NumericRangeIterator';

var setInternalState$8 = InternalStateModule$8.set;
var getInternalState$5 = InternalStateModule$8.getterFor(NUMERIC_RANGE_ITERATOR);

var $RangeError$2 = RangeError;
var $TypeError$a = TypeError;

var $RangeIterator = createIteratorConstructor$4(function NumericRangeIterator(start, end, option, type, zero, one) {
  if (typeof start != type || (end !== Infinity && end !== -Infinity && typeof end != type)) {
    throw new $TypeError$a(INCORRECT_RANGE);
  }
  if (start === Infinity || start === -Infinity) {
    throw new $RangeError$2(INCORRECT_RANGE);
  }
  var ifIncrease = end > start;
  var inclusiveEnd = false;
  var step;
  if (option === undefined) {
    step = undefined;
  } else if (isObject$4(option)) {
    step = option.step;
    inclusiveEnd = !!option.inclusive;
  } else if (typeof option == type) {
    step = option;
  } else {
    throw new $TypeError$a(INCORRECT_RANGE);
  }
  if (step == null) {
    step = ifIncrease ? one : -one;
  }
  if (typeof step != type) {
    throw new $TypeError$a(INCORRECT_RANGE);
  }
  if (step === Infinity || step === -Infinity || (step === zero && start !== end)) {
    throw new $RangeError$2(INCORRECT_RANGE);
  }
  // eslint-disable-next-line no-self-compare -- NaN check
  var hitsEnd = start != start || end != end || step != step || (end > start) !== (step > zero);
  setInternalState$8(this, {
    type: NUMERIC_RANGE_ITERATOR,
    start: start,
    end: end,
    step: step,
    inclusiveEnd: inclusiveEnd,
    hitsEnd: hitsEnd,
    currentCount: zero,
    zero: zero
  });
  if (!DESCRIPTORS$6) {
    this.start = start;
    this.end = end;
    this.step = step;
    this.inclusive = inclusiveEnd;
  }
}, NUMERIC_RANGE_ITERATOR, function next() {
  var state = getInternalState$5(this);
  if (state.hitsEnd) return { value: undefined, done: true };
  var start = state.start;
  var end = state.end;
  var step = state.step;
  var currentYieldingValue = start + (step * state.currentCount++);
  if (currentYieldingValue === end) state.hitsEnd = true;
  var inclusiveEnd = state.inclusiveEnd;
  var endCondition;
  if (end > start) {
    endCondition = inclusiveEnd ? currentYieldingValue > end : currentYieldingValue >= end;
  } else {
    endCondition = inclusiveEnd ? end > currentYieldingValue : end >= currentYieldingValue;
  }
  if (endCondition) {
    return { value: undefined, done: state.hitsEnd = true };
  } return { value: currentYieldingValue, done: false };
});

var getter = function (fn) {
  return { get: fn, set: function () { /* empty */ }, configurable: true, enumerable: false };
};

if (DESCRIPTORS$6) {
  defineProperties($RangeIterator.prototype, {
    start: getter(function () {
      return getInternalState$5(this).start;
    }),
    end: getter(function () {
      return getInternalState$5(this).end;
    }),
    inclusive: getter(function () {
      return getInternalState$5(this).inclusiveEnd;
    }),
    step: getter(function () {
      return getInternalState$5(this).step;
    })
  });
}

var numericRangeIterator = $RangeIterator;

/* eslint-disable es-x/no-bigint -- safe */
var $$1O = _export;
var NumericRangeIterator$1 = numericRangeIterator;

// `BigInt.range` method
// https://github.com/tc39/proposal-Number.range
if (typeof BigInt == 'function') {
  $$1O({ target: 'BigInt', stat: true, forced: true }, {
    range: function range(start, end, option) {
      return new NumericRangeIterator$1(start, end, option, 'bigint', BigInt(0), BigInt(1));
    }
  });
}

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`


var getBuiltIn$l = getBuiltIn$L;
var create$4 = objectCreate$1;
var isObject$3 = isObject$C;

var $Object$1 = Object;
var $TypeError$9 = TypeError;
var Map$3 = getBuiltIn$l('Map');
var WeakMap$2 = getBuiltIn$l('WeakMap');

var Node = function () {
  // keys
  this.object = null;
  this.symbol = null;
  // child nodes
  this.primitives = null;
  this.objectsByIndex = create$4(null);
};

Node.prototype.get = function (key, initializer) {
  return this[key] || (this[key] = initializer());
};

Node.prototype.next = function (i, it, IS_OBJECT) {
  var store = IS_OBJECT
    ? this.objectsByIndex[i] || (this.objectsByIndex[i] = new WeakMap$2())
    : this.primitives || (this.primitives = new Map$3());
  var entry = store.get(it);
  if (!entry) store.set(it, entry = new Node());
  return entry;
};

var root = new Node();

var compositeKey = function () {
  var active = root;
  var length = arguments.length;
  var i, it;
  // for prevent leaking, start from objects
  for (i = 0; i < length; i++) {
    if (isObject$3(it = arguments[i])) active = active.next(i, it, true);
  }
  if (this === $Object$1 && active === root) throw $TypeError$9('Composite keys must contain a non-primitive component');
  for (i = 0; i < length; i++) {
    if (!isObject$3(it = arguments[i])) active = active.next(i, it, false);
  } return active;
};

var $$1N = _export;
var apply$8 = functionApply$1;
var getCompositeKeyNode$1 = compositeKey;
var getBuiltIn$k = getBuiltIn$L;
var create$3 = objectCreate$1;

var $Object = Object;

var initializer = function () {
  var freeze = getBuiltIn$k('Object', 'freeze');
  return freeze ? freeze(create$3(null)) : create$3(null);
};

// https://github.com/tc39/proposal-richer-keys/tree/master/compositeKey
$$1N({ global: true, forced: true }, {
  compositeKey: function compositeKey() {
    return apply$8(getCompositeKeyNode$1, $Object, arguments).get('object', initializer);
  }
});

var $$1M = _export;
var getCompositeKeyNode = compositeKey;
var getBuiltIn$j = getBuiltIn$L;
var apply$7 = functionApply$1;

// https://github.com/tc39/proposal-richer-keys/tree/master/compositeKey
$$1M({ global: true, forced: true }, {
  compositeSymbol: function compositeSymbol() {
    if (arguments.length == 1 && typeof arguments[0] == 'string') return getBuiltIn$j('Symbol')['for'](arguments[0]);
    return apply$7(getCompositeKeyNode, null, arguments).get('symbol', getBuiltIn$j('Symbol'));
  }
});

var $$1L = _export;
var uncurryThis$g = functionUncurryThis;
var $isCallable = isCallable$E;
var inspectSource = inspectSource$5;
var hasOwn$8 = hasOwnProperty_1;
var DESCRIPTORS$5 = descriptors;

// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
var classRegExp = /^\s*class\b/;
var exec$4 = uncurryThis$g(classRegExp.exec);

var isClassConstructor = function (argument) {
  try {
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    if (!DESCRIPTORS$5 || !exec$4(classRegExp, inspectSource(argument))) return false;
  } catch (error) { /* empty */ }
  var prototype = getOwnPropertyDescriptor$1(argument, 'prototype');
  return !!prototype && hasOwn$8(prototype, 'writable') && !prototype.writable;
};

// `Function.isCallable` method
// https://github.com/caitp/TC39-Proposals/blob/trunk/tc39-reflect-isconstructor-iscallable.md
$$1L({ target: 'Function', stat: true, sham: true, forced: true }, {
  isCallable: function isCallable(argument) {
    return $isCallable(argument) && !isClassConstructor(argument);
  }
});

var $$1K = _export;
var isConstructor$3 = isConstructor$a;

// `Function.isConstructor` method
// https://github.com/caitp/TC39-Proposals/blob/trunk/tc39-reflect-isconstructor-iscallable.md
$$1K({ target: 'Function', stat: true, forced: true }, {
  isConstructor: isConstructor$3
});

var $$1J = _export;
var uncurryThis$f = functionUncurryThis;
var aCallable$x = aCallable$X;

// `Function.prototype.unThis` method
// https://github.com/js-choi/proposal-function-un-this
$$1J({ target: 'Function', proto: true, forced: true }, {
  unThis: function unThis() {
    return uncurryThis$f(aCallable$x(this));
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1I = _export;
var global$e = global$$;
var anInstance$5 = anInstance$d;
var isCallable$7 = isCallable$E;
var createNonEnumerableProperty$4 = createNonEnumerableProperty$i;
var fails$6 = fails$1m;
var hasOwn$7 = hasOwnProperty_1;
var wellKnownSymbol$7 = wellKnownSymbol$K;
var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;

var TO_STRING_TAG$2 = wellKnownSymbol$7('toStringTag');

var NativeIterator = global$e.Iterator;

// FF56- have non-standard global helper `Iterator`
var FORCED = !isCallable$7(NativeIterator)
  || NativeIterator.prototype !== IteratorPrototype$2
  // FF44- non-standard `Iterator` passes previous tests
  || !fails$6(function () { NativeIterator({}); });

var IteratorConstructor = function Iterator() {
  anInstance$5(this, IteratorPrototype$2);
};

if (!hasOwn$7(IteratorPrototype$2, TO_STRING_TAG$2)) {
  createNonEnumerableProperty$4(IteratorPrototype$2, TO_STRING_TAG$2, 'Iterator');
}

if (FORCED || !hasOwn$7(IteratorPrototype$2, 'constructor') || IteratorPrototype$2.constructor === Object) {
  createNonEnumerableProperty$4(IteratorPrototype$2, 'constructor', IteratorConstructor);
}

IteratorConstructor.prototype = IteratorPrototype$2;

$$1I({ global: true, constructor: true, forced: FORCED }, {
  Iterator: IteratorConstructor
});

var call$r = functionCall;
var anObject$Q = anObject$1A;
var create$2 = objectCreate$1;
var createNonEnumerableProperty$3 = createNonEnumerableProperty$i;
var defineBuiltIns$2 = defineBuiltIns$9;
var wellKnownSymbol$6 = wellKnownSymbol$K;
var InternalStateModule$7 = internalState;
var getMethod$2 = getMethod$i;
var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;

var ITERATOR_PROXY = 'IteratorProxy';
var setInternalState$7 = InternalStateModule$7.set;
var getInternalState$4 = InternalStateModule$7.getterFor(ITERATOR_PROXY);

var TO_STRING_TAG$1 = wellKnownSymbol$6('toStringTag');

var iteratorCreateProxy = function (nextHandler, IS_ITERATOR) {
  var IteratorProxy = function Iterator(record, state) {
    if (state) {
      state.iterator = record.iterator;
      state.next = record.next;
    } else state = record;
    state.type = ITERATOR_PROXY;
    state.done = false;
    state.ignoreArg = !IS_ITERATOR;
    setInternalState$7(this, state);
  };

  IteratorProxy.prototype = defineBuiltIns$2(create$2(IteratorPrototype$1), {
    next: function next(arg) {
      var state = getInternalState$4(this);
      var args = arguments.length ? [state.ignoreArg ? undefined : arg] : IS_ITERATOR ? [] : [undefined];
      state.ignoreArg = false;
      var result = state.done ? undefined : call$r(nextHandler, state, args);
      return { done: state.done, value: result };
    },
    'return': function (value) {
      var state = getInternalState$4(this);
      var iterator = state.iterator;
      state.done = true;
      var $$return = getMethod$2(iterator, 'return');
      return { done: true, value: $$return ? anObject$Q(call$r($$return, iterator, value)).value : value };
    },
    'throw': function (value) {
      var state = getInternalState$4(this);
      var iterator = state.iterator;
      state.done = true;
      var $$throw = getMethod$2(iterator, 'throw');
      if ($$throw) return call$r($$throw, iterator, value);
      throw value;
    }
  });

  if (!IS_ITERATOR) {
    createNonEnumerableProperty$3(IteratorProxy.prototype, TO_STRING_TAG$1, 'Generator');
  }

  return IteratorProxy;
};

// https://github.com/tc39/proposal-iterator-helpers
var $$1H = _export;
var apply$6 = functionApply$1;
var anObject$P = anObject$1A;
var getIteratorDirect$c = getIteratorDirect$m;
var createIteratorProxy$6 = iteratorCreateProxy;

var IteratorProxy$6 = createIteratorProxy$6(function (args) {
  var result = anObject$P(apply$6(this.next, this.iterator, args));
  var done = this.done = !!result.done;
  if (!done) return [this.index++, result.value];
});

$$1H({ target: 'Iterator', proto: true, real: true, forced: true }, {
  asIndexedPairs: function asIndexedPairs() {
    return new IteratorProxy$6(getIteratorDirect$c(this), {
      index: 0
    });
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1G = _export;
var apply$5 = functionApply$1;
var call$q = functionCall;
var anObject$O = anObject$1A;
var getIteratorDirect$b = getIteratorDirect$m;
var toPositiveInteger$1 = toPositiveInteger$5;
var createIteratorProxy$5 = iteratorCreateProxy;

var IteratorProxy$5 = createIteratorProxy$5(function (args) {
  var iterator = this.iterator;
  var next = this.next;
  var result, done;
  while (this.remaining) {
    this.remaining--;
    result = anObject$O(call$q(next, iterator));
    done = this.done = !!result.done;
    if (done) return;
  }
  result = anObject$O(apply$5(next, iterator, args));
  done = this.done = !!result.done;
  if (!done) return result.value;
});

$$1G({ target: 'Iterator', proto: true, real: true, forced: true }, {
  drop: function drop(limit) {
    return new IteratorProxy$5(getIteratorDirect$b(this), {
      remaining: toPositiveInteger$1(limit)
    });
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1F = _export;
var iterate$z = iterate$J;
var aCallable$w = aCallable$X;
var getIteratorDirect$a = getIteratorDirect$m;

$$1F({ target: 'Iterator', proto: true, real: true, forced: true }, {
  every: function every(fn) {
    var record = getIteratorDirect$a(this);
    aCallable$w(fn);
    return !iterate$z(record, function (value, stop) {
      if (!fn(value)) return stop();
    }, { IS_RECORD: true, INTERRUPTED: true }).stopped;
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1E = _export;
var apply$4 = functionApply$1;
var aCallable$v = aCallable$X;
var anObject$N = anObject$1A;
var getIteratorDirect$9 = getIteratorDirect$m;
var createIteratorProxy$4 = iteratorCreateProxy;
var callWithSafeIterationClosing$1 = callWithSafeIterationClosing$3;

var IteratorProxy$4 = createIteratorProxy$4(function (args) {
  var iterator = this.iterator;
  var filterer = this.filterer;
  var next = this.next;
  var result, done, value;
  while (true) {
    result = anObject$N(apply$4(next, iterator, args));
    done = this.done = !!result.done;
    if (done) return;
    value = result.value;
    if (callWithSafeIterationClosing$1(iterator, filterer, value)) return value;
  }
});

$$1E({ target: 'Iterator', proto: true, real: true, forced: true }, {
  filter: function filter(filterer) {
    return new IteratorProxy$4(getIteratorDirect$9(this), {
      filterer: aCallable$v(filterer)
    });
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1D = _export;
var iterate$y = iterate$J;
var aCallable$u = aCallable$X;
var getIteratorDirect$8 = getIteratorDirect$m;

$$1D({ target: 'Iterator', proto: true, real: true, forced: true }, {
  find: function find(fn) {
    var record = getIteratorDirect$8(this);
    aCallable$u(fn);
    return iterate$y(record, function (value, stop) {
      if (fn(value)) return stop(value);
    }, { IS_RECORD: true, INTERRUPTED: true }).result;
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1C = _export;
var call$p = functionCall;
var aCallable$t = aCallable$X;
var anObject$M = anObject$1A;
var getIteratorDirect$7 = getIteratorDirect$m;
var getIteratorMethod$2 = getIteratorMethod$9;
var createIteratorProxy$3 = iteratorCreateProxy;
var iteratorClose$1 = iteratorClose$4;

var $TypeError$8 = TypeError;

var IteratorProxy$3 = createIteratorProxy$3(function () {
  var iterator = this.iterator;
  var mapper = this.mapper;
  var result, mapped, iteratorMethod, innerIterator;

  while (true) {
    try {
      if (innerIterator = this.innerIterator) {
        result = anObject$M(call$p(this.innerNext, innerIterator));
        if (!result.done) return result.value;
        this.innerIterator = this.innerNext = null;
      }

      result = anObject$M(call$p(this.next, iterator));

      if (this.done = !!result.done) return;

      mapped = mapper(result.value);
      iteratorMethod = getIteratorMethod$2(mapped);

      if (!iteratorMethod) {
        throw $TypeError$8('.flatMap callback should return an iterable object');
      }

      this.innerIterator = innerIterator = anObject$M(call$p(iteratorMethod, mapped));
      this.innerNext = aCallable$t(innerIterator.next);
    } catch (error) {
      iteratorClose$1(iterator, 'throw', error);
    }
  }
});

$$1C({ target: 'Iterator', proto: true, real: true, forced: true }, {
  flatMap: function flatMap(mapper) {
    return new IteratorProxy$3(getIteratorDirect$7(this), {
      mapper: aCallable$t(mapper),
      innerIterator: null,
      innerNext: null
    });
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1B = _export;
var iterate$x = iterate$J;
var getIteratorDirect$6 = getIteratorDirect$m;

$$1B({ target: 'Iterator', proto: true, real: true, forced: true }, {
  forEach: function forEach(fn) {
    iterate$x(getIteratorDirect$6(this), fn, { IS_RECORD: true });
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1A = _export;
var apply$3 = functionApply$1;
var anObject$L = anObject$1A;
var toObject$1 = toObject$B;
var isPrototypeOf = objectIsPrototypeOf;
var IteratorPrototype = iteratorsCore.IteratorPrototype;
var createIteratorProxy$2 = iteratorCreateProxy;
var getIterator$4 = getIterator$b;
var getIteratorDirect$5 = getIteratorDirect$m;
var getIteratorMethod$1 = getIteratorMethod$9;

var IteratorProxy$2 = createIteratorProxy$2(function (args) {
  var result = anObject$L(apply$3(this.next, this.iterator, args));
  var done = this.done = !!result.done;
  if (!done) return result.value;
}, true);

$$1A({ target: 'Iterator', stat: true, forced: true }, {
  from: function from(O) {
    var object = toObject$1(O);
    var usingIterator = getIteratorMethod$1(object);
    var iterator;
    if (usingIterator) {
      iterator = getIterator$4(object, usingIterator);
      if (isPrototypeOf(IteratorPrototype, iterator)) return iterator;
    } else {
      iterator = object;
    } return new IteratorProxy$2(getIteratorDirect$5(iterator));
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1z = _export;
var apply$2 = functionApply$1;
var aCallable$s = aCallable$X;
var anObject$K = anObject$1A;
var getIteratorDirect$4 = getIteratorDirect$m;
var createIteratorProxy$1 = iteratorCreateProxy;
var callWithSafeIterationClosing = callWithSafeIterationClosing$3;

var IteratorProxy$1 = createIteratorProxy$1(function (args) {
  var iterator = this.iterator;
  var result = anObject$K(apply$2(this.next, iterator, args));
  var done = this.done = !!result.done;
  if (!done) return callWithSafeIterationClosing(iterator, this.mapper, result.value);
});

$$1z({ target: 'Iterator', proto: true, real: true, forced: true }, {
  map: function map(mapper) {
    return new IteratorProxy$1(getIteratorDirect$4(this), {
      mapper: aCallable$s(mapper)
    });
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1y = _export;
var iterate$w = iterate$J;
var aCallable$r = aCallable$X;
var getIteratorDirect$3 = getIteratorDirect$m;

var $TypeError$7 = TypeError;

$$1y({ target: 'Iterator', proto: true, real: true, forced: true }, {
  reduce: function reduce(reducer /* , initialValue */) {
    var record = getIteratorDirect$3(this);
    aCallable$r(reducer);
    var noInitial = arguments.length < 2;
    var accumulator = noInitial ? undefined : arguments[1];
    iterate$w(record, function (value) {
      if (noInitial) {
        noInitial = false;
        accumulator = value;
      } else {
        accumulator = reducer(accumulator, value);
      }
    }, { IS_RECORD: true });
    if (noInitial) throw $TypeError$7('Reduce of empty iterator with no initial value');
    return accumulator;
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1x = _export;
var iterate$v = iterate$J;
var aCallable$q = aCallable$X;
var getIteratorDirect$2 = getIteratorDirect$m;

$$1x({ target: 'Iterator', proto: true, real: true, forced: true }, {
  some: function some(fn) {
    var record = getIteratorDirect$2(this);
    aCallable$q(fn);
    return iterate$v(record, function (value, stop) {
      if (fn(value)) return stop();
    }, { IS_RECORD: true, INTERRUPTED: true }).stopped;
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1w = _export;
var apply$1 = functionApply$1;
var anObject$J = anObject$1A;
var getIteratorDirect$1 = getIteratorDirect$m;
var toPositiveInteger = toPositiveInteger$5;
var createIteratorProxy = iteratorCreateProxy;
var iteratorClose = iteratorClose$4;

var IteratorProxy = createIteratorProxy(function (args) {
  var iterator = this.iterator;
  if (!this.remaining--) {
    this.done = true;
    return iteratorClose(iterator, 'normal', undefined);
  }
  var result = anObject$J(apply$1(this.next, iterator, args));
  var done = this.done = !!result.done;
  if (!done) return result.value;
});

$$1w({ target: 'Iterator', proto: true, real: true, forced: true }, {
  take: function take(limit) {
    return new IteratorProxy(getIteratorDirect$1(this), {
      remaining: toPositiveInteger(limit)
    });
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1v = _export;
var iterate$u = iterate$J;
var getIteratorDirect = getIteratorDirect$m;

var push$9 = [].push;

$$1v({ target: 'Iterator', proto: true, real: true, forced: true }, {
  toArray: function toArray() {
    var result = [];
    iterate$u(getIteratorDirect(this), push$9, { that: result, IS_RECORD: true });
    return result;
  }
});

// https://github.com/tc39/proposal-iterator-helpers
var $$1u = _export;
var AsyncFromSyncIterator = asyncFromSyncIterator;

$$1u({ target: 'Iterator', proto: true, real: true, forced: true }, {
  toAsync: function toAsync() {
    return new AsyncFromSyncIterator(this);
  }
});

var call$o = functionCall;
var aCallable$p = aCallable$X;
var anObject$I = anObject$1A;

// https://github.com/tc39/collection-methods
var collectionDeleteAll = function deleteAll(/* ...elements */) {
  var collection = anObject$I(this);
  var remover = aCallable$p(collection['delete']);
  var allDeleted = true;
  var wasDeleted;
  for (var k = 0, len = arguments.length; k < len; k++) {
    wasDeleted = call$o(remover, collection, arguments[k]);
    allDeleted = allDeleted && wasDeleted;
  }
  return !!allDeleted;
};

var $$1t = _export;
var deleteAll$3 = collectionDeleteAll;

// `Map.prototype.deleteAll` method
// https://github.com/tc39/proposal-collection-methods
$$1t({ target: 'Map', proto: true, real: true, forced: true }, {
  deleteAll: deleteAll$3
});

var call$n = functionCall;
var aCallable$o = aCallable$X;
var anObject$H = anObject$1A;

// `Map.prototype.emplace` method
// https://github.com/thumbsupep/proposal-upsert
var mapEmplace = function emplace(key, handler) {
  var map = anObject$H(this);
  var get = aCallable$o(map.get);
  var has = aCallable$o(map.has);
  var set = aCallable$o(map.set);
  var value, inserted;
  if (call$n(has, map, key)) {
    value = call$n(get, map, key);
    if ('update' in handler) {
      value = handler.update(value, key, map);
      call$n(set, map, key, value);
    } return value;
  }
  inserted = handler.insert(key, map);
  call$n(set, map, key, inserted);
  return inserted;
};

var $$1s = _export;
var emplace$1 = mapEmplace;

// `Map.prototype.emplace` method
// https://github.com/thumbsupep/proposal-upsert
$$1s({ target: 'Map', proto: true, real: true, forced: true }, {
  emplace: emplace$1
});

var call$m = functionCall;

var getMapIterator$a = function (it) {
  // eslint-disable-next-line es-x/no-map -- safe
  return call$m(Map.prototype.entries, it);
};

var $$1r = _export;
var anObject$G = anObject$1A;
var bind$e = functionBindContext;
var getMapIterator$9 = getMapIterator$a;
var iterate$t = iterate$J;

// `Map.prototype.every` method
// https://github.com/tc39/proposal-collection-methods
$$1r({ target: 'Map', proto: true, real: true, forced: true }, {
  every: function every(callbackfn /* , thisArg */) {
    var map = anObject$G(this);
    var iterator = getMapIterator$9(map);
    var boundFunction = bind$e(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return !iterate$t(iterator, function (key, value, stop) {
      if (!boundFunction(value, key, map)) return stop();
    }, { AS_ENTRIES: true, IS_ITERATOR: true, INTERRUPTED: true }).stopped;
  }
});

var $$1q = _export;
var getBuiltIn$i = getBuiltIn$L;
var bind$d = functionBindContext;
var call$l = functionCall;
var aCallable$n = aCallable$X;
var anObject$F = anObject$1A;
var speciesConstructor$8 = speciesConstructor$f;
var getMapIterator$8 = getMapIterator$a;
var iterate$s = iterate$J;

// `Map.prototype.filter` method
// https://github.com/tc39/proposal-collection-methods
$$1q({ target: 'Map', proto: true, real: true, forced: true }, {
  filter: function filter(callbackfn /* , thisArg */) {
    var map = anObject$F(this);
    var iterator = getMapIterator$8(map);
    var boundFunction = bind$d(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var newMap = new (speciesConstructor$8(map, getBuiltIn$i('Map')))();
    var setter = aCallable$n(newMap.set);
    iterate$s(iterator, function (key, value) {
      if (boundFunction(value, key, map)) call$l(setter, newMap, key, value);
    }, { AS_ENTRIES: true, IS_ITERATOR: true });
    return newMap;
  }
});

var $$1p = _export;
var anObject$E = anObject$1A;
var bind$c = functionBindContext;
var getMapIterator$7 = getMapIterator$a;
var iterate$r = iterate$J;

// `Map.prototype.find` method
// https://github.com/tc39/proposal-collection-methods
$$1p({ target: 'Map', proto: true, real: true, forced: true }, {
  find: function find(callbackfn /* , thisArg */) {
    var map = anObject$E(this);
    var iterator = getMapIterator$7(map);
    var boundFunction = bind$c(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return iterate$r(iterator, function (key, value, stop) {
      if (boundFunction(value, key, map)) return stop(value);
    }, { AS_ENTRIES: true, IS_ITERATOR: true, INTERRUPTED: true }).result;
  }
});

var $$1o = _export;
var anObject$D = anObject$1A;
var bind$b = functionBindContext;
var getMapIterator$6 = getMapIterator$a;
var iterate$q = iterate$J;

// `Map.prototype.findKey` method
// https://github.com/tc39/proposal-collection-methods
$$1o({ target: 'Map', proto: true, real: true, forced: true }, {
  findKey: function findKey(callbackfn /* , thisArg */) {
    var map = anObject$D(this);
    var iterator = getMapIterator$6(map);
    var boundFunction = bind$b(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return iterate$q(iterator, function (key, value, stop) {
      if (boundFunction(value, key, map)) return stop(key);
    }, { AS_ENTRIES: true, IS_ITERATOR: true, INTERRUPTED: true }).result;
  }
});

// https://tc39.github.io/proposal-setmap-offrom/
var bind$a = functionBindContext;
var call$k = functionCall;
var aCallable$m = aCallable$X;
var aConstructor$1 = aConstructor$5;
var iterate$p = iterate$J;

var push$8 = [].push;

var collectionFrom = function from(source /* , mapFn, thisArg */) {
  var length = arguments.length;
  var mapFn = length > 1 ? arguments[1] : undefined;
  var mapping, array, n, boundFunction;
  aConstructor$1(this);
  mapping = mapFn !== undefined;
  if (mapping) aCallable$m(mapFn);
  if (source == undefined) return new this();
  array = [];
  if (mapping) {
    n = 0;
    boundFunction = bind$a(mapFn, length > 2 ? arguments[2] : undefined);
    iterate$p(source, function (nextItem) {
      call$k(push$8, array, boundFunction(nextItem, n++));
    });
  } else {
    iterate$p(source, push$8, { that: array });
  }
  return new this(array);
};

var $$1n = _export;
var from$3 = collectionFrom;

// `Map.from` method
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
$$1n({ target: 'Map', stat: true, forced: true }, {
  from: from$3
});

var $$1m = _export;
var call$j = functionCall;
var uncurryThis$e = functionUncurryThis;
var aCallable$l = aCallable$X;
var getIterator$3 = getIterator$b;
var iterate$o = iterate$J;

var push$7 = uncurryThis$e([].push);

// `Map.groupBy` method
// https://github.com/tc39/proposal-collection-methods
$$1m({ target: 'Map', stat: true, forced: true }, {
  groupBy: function groupBy(iterable, keyDerivative) {
    aCallable$l(keyDerivative);
    var iterator = getIterator$3(iterable);
    var newMap = new this();
    var has = aCallable$l(newMap.has);
    var get = aCallable$l(newMap.get);
    var set = aCallable$l(newMap.set);
    iterate$o(iterator, function (element) {
      var derivedKey = keyDerivative(element);
      if (!call$j(has, newMap, derivedKey)) call$j(set, newMap, derivedKey, [element]);
      else push$7(call$j(get, newMap, derivedKey), element);
    }, { IS_ITERATOR: true });
    return newMap;
  }
});

// `SameValueZero` abstract operation
// https://tc39.es/ecma262/#sec-samevaluezero
var sameValueZero$1 = function (x, y) {
  // eslint-disable-next-line no-self-compare -- NaN check
  return x === y || x != x && y != y;
};

var $$1l = _export;
var anObject$C = anObject$1A;
var getMapIterator$5 = getMapIterator$a;
var sameValueZero = sameValueZero$1;
var iterate$n = iterate$J;

// `Map.prototype.includes` method
// https://github.com/tc39/proposal-collection-methods
$$1l({ target: 'Map', proto: true, real: true, forced: true }, {
  includes: function includes(searchElement) {
    return iterate$n(getMapIterator$5(anObject$C(this)), function (key, value, stop) {
      if (sameValueZero(value, searchElement)) return stop();
    }, { AS_ENTRIES: true, IS_ITERATOR: true, INTERRUPTED: true }).stopped;
  }
});

var $$1k = _export;
var call$i = functionCall;
var iterate$m = iterate$J;
var aCallable$k = aCallable$X;

// `Map.keyBy` method
// https://github.com/tc39/proposal-collection-methods
$$1k({ target: 'Map', stat: true, forced: true }, {
  keyBy: function keyBy(iterable, keyDerivative) {
    var newMap = new this();
    aCallable$k(keyDerivative);
    var setter = aCallable$k(newMap.set);
    iterate$m(iterable, function (element) {
      call$i(setter, newMap, keyDerivative(element), element);
    });
    return newMap;
  }
});

var $$1j = _export;
var anObject$B = anObject$1A;
var getMapIterator$4 = getMapIterator$a;
var iterate$l = iterate$J;

// `Map.prototype.keyOf` method
// https://github.com/tc39/proposal-collection-methods
$$1j({ target: 'Map', proto: true, real: true, forced: true }, {
  keyOf: function keyOf(searchElement) {
    return iterate$l(getMapIterator$4(anObject$B(this)), function (key, value, stop) {
      if (value === searchElement) return stop(key);
    }, { AS_ENTRIES: true, IS_ITERATOR: true, INTERRUPTED: true }).result;
  }
});

var $$1i = _export;
var getBuiltIn$h = getBuiltIn$L;
var bind$9 = functionBindContext;
var call$h = functionCall;
var aCallable$j = aCallable$X;
var anObject$A = anObject$1A;
var speciesConstructor$7 = speciesConstructor$f;
var getMapIterator$3 = getMapIterator$a;
var iterate$k = iterate$J;

// `Map.prototype.mapKeys` method
// https://github.com/tc39/proposal-collection-methods
$$1i({ target: 'Map', proto: true, real: true, forced: true }, {
  mapKeys: function mapKeys(callbackfn /* , thisArg */) {
    var map = anObject$A(this);
    var iterator = getMapIterator$3(map);
    var boundFunction = bind$9(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var newMap = new (speciesConstructor$7(map, getBuiltIn$h('Map')))();
    var setter = aCallable$j(newMap.set);
    iterate$k(iterator, function (key, value) {
      call$h(setter, newMap, boundFunction(value, key, map), value);
    }, { AS_ENTRIES: true, IS_ITERATOR: true });
    return newMap;
  }
});

var $$1h = _export;
var getBuiltIn$g = getBuiltIn$L;
var bind$8 = functionBindContext;
var call$g = functionCall;
var aCallable$i = aCallable$X;
var anObject$z = anObject$1A;
var speciesConstructor$6 = speciesConstructor$f;
var getMapIterator$2 = getMapIterator$a;
var iterate$j = iterate$J;

// `Map.prototype.mapValues` method
// https://github.com/tc39/proposal-collection-methods
$$1h({ target: 'Map', proto: true, real: true, forced: true }, {
  mapValues: function mapValues(callbackfn /* , thisArg */) {
    var map = anObject$z(this);
    var iterator = getMapIterator$2(map);
    var boundFunction = bind$8(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var newMap = new (speciesConstructor$6(map, getBuiltIn$g('Map')))();
    var setter = aCallable$i(newMap.set);
    iterate$j(iterator, function (key, value) {
      call$g(setter, newMap, key, boundFunction(value, key, map));
    }, { AS_ENTRIES: true, IS_ITERATOR: true });
    return newMap;
  }
});

var $$1g = _export;
var aCallable$h = aCallable$X;
var anObject$y = anObject$1A;
var iterate$i = iterate$J;

// `Map.prototype.merge` method
// https://github.com/tc39/proposal-collection-methods
$$1g({ target: 'Map', proto: true, real: true, arity: 1, forced: true }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  merge: function merge(iterable /* ...iterables */) {
    var map = anObject$y(this);
    var setter = aCallable$h(map.set);
    var argumentsLength = arguments.length;
    var i = 0;
    while (i < argumentsLength) {
      iterate$i(arguments[i++], setter, { that: map, AS_ENTRIES: true });
    }
    return map;
  }
});

var arraySlice$2 = arraySlice$c;

// https://tc39.github.io/proposal-setmap-offrom/
var collectionOf = function of() {
  return new this(arraySlice$2(arguments));
};

var $$1f = _export;
var of$3 = collectionOf;

// `Map.of` method
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
$$1f({ target: 'Map', stat: true, forced: true }, {
  of: of$3
});

var $$1e = _export;
var anObject$x = anObject$1A;
var aCallable$g = aCallable$X;
var getMapIterator$1 = getMapIterator$a;
var iterate$h = iterate$J;

var $TypeError$6 = TypeError;

// `Map.prototype.reduce` method
// https://github.com/tc39/proposal-collection-methods
$$1e({ target: 'Map', proto: true, real: true, forced: true }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    var map = anObject$x(this);
    var iterator = getMapIterator$1(map);
    var noInitial = arguments.length < 2;
    var accumulator = noInitial ? undefined : arguments[1];
    aCallable$g(callbackfn);
    iterate$h(iterator, function (key, value) {
      if (noInitial) {
        noInitial = false;
        accumulator = value;
      } else {
        accumulator = callbackfn(accumulator, value, key, map);
      }
    }, { AS_ENTRIES: true, IS_ITERATOR: true });
    if (noInitial) throw $TypeError$6('Reduce of empty map with no initial value');
    return accumulator;
  }
});

var $$1d = _export;
var anObject$w = anObject$1A;
var bind$7 = functionBindContext;
var getMapIterator = getMapIterator$a;
var iterate$g = iterate$J;

// `Set.prototype.some` method
// https://github.com/tc39/proposal-collection-methods
$$1d({ target: 'Map', proto: true, real: true, forced: true }, {
  some: function some(callbackfn /* , thisArg */) {
    var map = anObject$w(this);
    var iterator = getMapIterator(map);
    var boundFunction = bind$7(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return iterate$g(iterator, function (key, value, stop) {
      if (boundFunction(value, key, map)) return stop();
    }, { AS_ENTRIES: true, IS_ITERATOR: true, INTERRUPTED: true }).stopped;
  }
});

var $$1c = _export;
var call$f = functionCall;
var anObject$v = anObject$1A;
var aCallable$f = aCallable$X;

var $TypeError$5 = TypeError;

// `Set.prototype.update` method
// https://github.com/tc39/proposal-collection-methods
$$1c({ target: 'Map', proto: true, real: true, forced: true }, {
  update: function update(key, callback /* , thunk */) {
    var map = anObject$v(this);
    var get = aCallable$f(map.get);
    var has = aCallable$f(map.has);
    var set = aCallable$f(map.set);
    var length = arguments.length;
    aCallable$f(callback);
    var isPresentInMap = call$f(has, map, key);
    if (!isPresentInMap && length < 3) {
      throw $TypeError$5('Updating absent value');
    }
    var value = isPresentInMap ? call$f(get, map, key) : aCallable$f(length > 2 ? arguments[2] : undefined)(key, map);
    call$f(set, map, key, callback(value, key, map));
    return map;
  }
});

var call$e = functionCall;
var aCallable$e = aCallable$X;
var isCallable$6 = isCallable$E;
var anObject$u = anObject$1A;

var $TypeError$4 = TypeError;

// `Map.prototype.upsert` method
// https://github.com/thumbsupep/proposal-upsert
var mapUpsert = function upsert(key, updateFn /* , insertFn */) {
  var map = anObject$u(this);
  var get = aCallable$e(map.get);
  var has = aCallable$e(map.has);
  var set = aCallable$e(map.set);
  var insertFn = arguments.length > 2 ? arguments[2] : undefined;
  var value;
  if (!isCallable$6(updateFn) && !isCallable$6(insertFn)) {
    throw $TypeError$4('At least one callback required');
  }
  if (call$e(has, map, key)) {
    value = call$e(get, map, key);
    if (isCallable$6(updateFn)) {
      value = updateFn(value);
      call$e(set, map, key, value);
    }
  } else if (isCallable$6(insertFn)) {
    value = insertFn();
    call$e(set, map, key, value);
  } return value;
};

// TODO: remove from `core-js@4`
var $$1b = _export;
var upsert$2 = mapUpsert;

// `Map.prototype.updateOrInsert` method (replaced by `Map.prototype.emplace`)
// https://github.com/thumbsupep/proposal-upsert
$$1b({ target: 'Map', proto: true, real: true, name: 'upsert', forced: true }, {
  updateOrInsert: upsert$2
});

// TODO: remove from `core-js@4`
var $$1a = _export;
var upsert$1 = mapUpsert;

// `Map.prototype.upsert` method (replaced by `Map.prototype.emplace`)
// https://github.com/thumbsupep/proposal-upsert
$$1a({ target: 'Map', proto: true, real: true, forced: true }, {
  upsert: upsert$1
});

var $$19 = _export;

var min$1 = Math.min;
var max$1 = Math.max;

// `Math.clamp` method
// https://rwaldron.github.io/proposal-math-extensions/
$$19({ target: 'Math', stat: true, forced: true }, {
  clamp: function clamp(x, lower, upper) {
    return min$1(upper, max$1(lower, x));
  }
});

var $$18 = _export;

// `Math.DEG_PER_RAD` constant
// https://rwaldron.github.io/proposal-math-extensions/
$$18({ target: 'Math', stat: true, nonConfigurable: true, nonWritable: true }, {
  DEG_PER_RAD: Math.PI / 180
});

var $$17 = _export;

var RAD_PER_DEG = 180 / Math.PI;

// `Math.degrees` method
// https://rwaldron.github.io/proposal-math-extensions/
$$17({ target: 'Math', stat: true, forced: true }, {
  degrees: function degrees(radians) {
    return radians * RAD_PER_DEG;
  }
});

// `Math.scale` method implementation
// https://rwaldron.github.io/proposal-math-extensions/
var mathScale = Math.scale || function scale(x, inLow, inHigh, outLow, outHigh) {
  var nx = +x;
  var nInLow = +inLow;
  var nInHigh = +inHigh;
  var nOutLow = +outLow;
  var nOutHigh = +outHigh;
  // eslint-disable-next-line no-self-compare -- NaN check
  if (nx != nx || nInLow != nInLow || nInHigh != nInHigh || nOutLow != nOutLow || nOutHigh != nOutHigh) return NaN;
  if (nx === Infinity || nx === -Infinity) return nx;
  return (nx - nInLow) * (nOutHigh - nOutLow) / (nInHigh - nInLow) + nOutLow;
};

var $$16 = _export;

var scale$1 = mathScale;
var fround = mathFround;

// `Math.fscale` method
// https://rwaldron.github.io/proposal-math-extensions/
$$16({ target: 'Math', stat: true, forced: true }, {
  fscale: function fscale(x, inLow, inHigh, outLow, outHigh) {
    return fround(scale$1(x, inLow, inHigh, outLow, outHigh));
  }
});

var $$15 = _export;

// `Math.iaddh` method
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
// TODO: Remove from `core-js@4`
$$15({ target: 'Math', stat: true, forced: true }, {
  iaddh: function iaddh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});

var $$14 = _export;

// `Math.imulh` method
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
// TODO: Remove from `core-js@4`
$$14({ target: 'Math', stat: true, forced: true }, {
  imulh: function imulh(u, v) {
    var UINT16 = 0xFFFF;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >> 16;
    var v1 = $v >> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});

var $$13 = _export;

// `Math.isubh` method
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
// TODO: Remove from `core-js@4`
$$13({ target: 'Math', stat: true, forced: true }, {
  isubh: function isubh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});

var $$12 = _export;

// `Math.RAD_PER_DEG` constant
// https://rwaldron.github.io/proposal-math-extensions/
$$12({ target: 'Math', stat: true, nonConfigurable: true, nonWritable: true }, {
  RAD_PER_DEG: 180 / Math.PI
});

var $$11 = _export;

var DEG_PER_RAD = Math.PI / 180;

// `Math.radians` method
// https://rwaldron.github.io/proposal-math-extensions/
$$11({ target: 'Math', stat: true, forced: true }, {
  radians: function radians(degrees) {
    return degrees * DEG_PER_RAD;
  }
});

var $$10 = _export;
var scale = mathScale;

// `Math.scale` method
// https://rwaldron.github.io/proposal-math-extensions/
$$10({ target: 'Math', stat: true, forced: true }, {
  scale: scale
});

var $$$ = _export;
var anObject$t = anObject$1A;
var numberIsFinite = numberIsFinite$2;
var createIteratorConstructor$3 = createIteratorConstructor$7;
var InternalStateModule$6 = internalState;

var SEEDED_RANDOM = 'Seeded Random';
var SEEDED_RANDOM_GENERATOR = SEEDED_RANDOM + ' Generator';
var SEED_TYPE_ERROR = 'Math.seededPRNG() argument should have a "seed" field with a finite value.';
var setInternalState$6 = InternalStateModule$6.set;
var getInternalState$3 = InternalStateModule$6.getterFor(SEEDED_RANDOM_GENERATOR);
var $TypeError$3 = TypeError;

var $SeededRandomGenerator = createIteratorConstructor$3(function SeededRandomGenerator(seed) {
  setInternalState$6(this, {
    type: SEEDED_RANDOM_GENERATOR,
    seed: seed % 2147483647
  });
}, SEEDED_RANDOM, function next() {
  var state = getInternalState$3(this);
  var seed = state.seed = (state.seed * 1103515245 + 12345) % 2147483647;
  return { value: (seed & 1073741823) / 1073741823, done: false };
});

// `Math.seededPRNG` method
// https://github.com/tc39/proposal-seeded-random
// based on https://github.com/tc39/proposal-seeded-random/blob/78b8258835b57fc2100d076151ab506bc3202ae6/demo.html
$$$({ target: 'Math', stat: true, forced: true }, {
  seededPRNG: function seededPRNG(it) {
    var seed = anObject$t(it).seed;
    if (!numberIsFinite(seed)) throw $TypeError$3(SEED_TYPE_ERROR);
    return new $SeededRandomGenerator(seed);
  }
});

var $$_ = _export;

// `Math.signbit` method
// https://github.com/tc39/proposal-Math.signbit
$$_({ target: 'Math', stat: true, forced: true }, {
  signbit: function signbit(x) {
    var n = +x;
    // eslint-disable-next-line no-self-compare -- NaN check
    return n == n && n == 0 ? 1 / n == -Infinity : n < 0;
  }
});

var $$Z = _export;

// `Math.umulh` method
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
// TODO: Remove from `core-js@4`
$$Z({ target: 'Math', stat: true, forced: true }, {
  umulh: function umulh(u, v) {
    var UINT16 = 0xFFFF;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >>> 16;
    var v1 = $v >>> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});

var $$Y = _export;
var uncurryThis$d = functionUncurryThis;
var toIntegerOrInfinity$3 = toIntegerOrInfinity$o;
var parseInt$2 = numberParseInt;

var INVALID_NUMBER_REPRESENTATION = 'Invalid number representation';
var INVALID_RADIX = 'Invalid radix';
var $RangeError$1 = RangeError;
var $SyntaxError = SyntaxError;
var $TypeError$2 = TypeError;
var valid = /^[\da-z]+$/;
var charAt$6 = uncurryThis$d(''.charAt);
var exec$3 = uncurryThis$d(valid.exec);
var numberToString$1 = uncurryThis$d(1.0.toString);
var stringSlice$2 = uncurryThis$d(''.slice);

// `Number.fromString` method
// https://github.com/tc39/proposal-number-fromstring
$$Y({ target: 'Number', stat: true, forced: true }, {
  fromString: function fromString(string, radix) {
    var sign = 1;
    var R, mathNum;
    if (typeof string != 'string') throw $TypeError$2(INVALID_NUMBER_REPRESENTATION);
    if (!string.length) throw $SyntaxError(INVALID_NUMBER_REPRESENTATION);
    if (charAt$6(string, 0) == '-') {
      sign = -1;
      string = stringSlice$2(string, 1);
      if (!string.length) throw $SyntaxError(INVALID_NUMBER_REPRESENTATION);
    }
    R = radix === undefined ? 10 : toIntegerOrInfinity$3(radix);
    if (R < 2 || R > 36) throw $RangeError$1(INVALID_RADIX);
    if (!exec$3(valid, string) || numberToString$1(mathNum = parseInt$2(string, R), R) !== string) {
      throw $SyntaxError(INVALID_NUMBER_REPRESENTATION);
    }
    return sign * mathNum;
  }
});

var $$X = _export;
var NumericRangeIterator = numericRangeIterator;

// `Number.range` method
// https://github.com/tc39/proposal-Number.range
$$X({ target: 'Number', stat: true, forced: true }, {
  range: function range(start, end, option) {
    return new NumericRangeIterator(start, end, option, 'number', 0, 1);
  }
});

var InternalStateModule$5 = internalState;
var createIteratorConstructor$2 = createIteratorConstructor$7;
var hasOwn$6 = hasOwnProperty_1;
var objectKeys$1 = objectKeys$6;
var toObject = toObject$B;

var OBJECT_ITERATOR = 'Object Iterator';
var setInternalState$5 = InternalStateModule$5.set;
var getInternalState$2 = InternalStateModule$5.getterFor(OBJECT_ITERATOR);

var objectIterator = createIteratorConstructor$2(function ObjectIterator(source, mode) {
  var object = toObject(source);
  setInternalState$5(this, {
    type: OBJECT_ITERATOR,
    mode: mode,
    object: object,
    keys: objectKeys$1(object),
    index: 0
  });
}, 'Object', function next() {
  var state = getInternalState$2(this);
  var keys = state.keys;
  while (true) {
    if (keys === null || state.index >= keys.length) {
      state.object = state.keys = null;
      return { value: undefined, done: true };
    }
    var key = keys[state.index++];
    var object = state.object;
    if (!hasOwn$6(object, key)) continue;
    switch (state.mode) {
      case 'keys': return { value: key, done: false };
      case 'values': return { value: object[key], done: false };
    } /* entries */ return { value: [key, object[key]], done: false };
  }
});

// TODO: Remove from `core-js@4`
var $$W = _export;
var ObjectIterator$2 = objectIterator;

// `Object.iterateEntries` method
// https://github.com/tc39/proposal-object-iteration
$$W({ target: 'Object', stat: true, forced: true }, {
  iterateEntries: function iterateEntries(object) {
    return new ObjectIterator$2(object, 'entries');
  }
});

// TODO: Remove from `core-js@4`
var $$V = _export;
var ObjectIterator$1 = objectIterator;

// `Object.iterateKeys` method
// https://github.com/tc39/proposal-object-iteration
$$V({ target: 'Object', stat: true, forced: true }, {
  iterateKeys: function iterateKeys(object) {
    return new ObjectIterator$1(object, 'keys');
  }
});

// TODO: Remove from `core-js@4`
var $$U = _export;
var ObjectIterator = objectIterator;

// `Object.iterateValues` method
// https://github.com/tc39/proposal-object-iteration
$$U({ target: 'Object', stat: true, forced: true }, {
  iterateValues: function iterateValues(object) {
    return new ObjectIterator(object, 'values');
  }
});

var global$d = global$$;
var isCallable$5 = isCallable$E;
var wellKnownSymbol$5 = wellKnownSymbol$K;

var $$OBSERVABLE$2 = wellKnownSymbol$5('observable');
var NativeObservable = global$d.Observable;
var NativeObservablePrototype = NativeObservable && NativeObservable.prototype;

var observableForced = !isCallable$5(NativeObservable)
  || !isCallable$5(NativeObservable.from)
  || !isCallable$5(NativeObservable.of)
  || !isCallable$5(NativeObservablePrototype.subscribe)
  || !isCallable$5(NativeObservablePrototype[$$OBSERVABLE$2]);

// https://github.com/tc39/proposal-observable
var $$T = _export;
var call$d = functionCall;
var DESCRIPTORS$4 = descriptors;
var setSpecies = setSpecies$7;
var aCallable$d = aCallable$X;
var isCallable$4 = isCallable$E;
var anObject$s = anObject$1A;
var isObject$2 = isObject$C;
var anInstance$4 = anInstance$d;
var getMethod$1 = getMethod$i;
var defineBuiltIn$3 = defineBuiltIn$p;
var defineBuiltIns$1 = defineBuiltIns$9;
var defineBuiltInAccessor$2 = defineBuiltInAccessor$8;
var hostReportErrors = hostReportErrors$2;
var wellKnownSymbol$4 = wellKnownSymbol$K;
var InternalStateModule$4 = internalState;
var OBSERVABLE_FORCED$2 = observableForced;

var $$OBSERVABLE$1 = wellKnownSymbol$4('observable');
var OBSERVABLE = 'Observable';
var SUBSCRIPTION = 'Subscription';
var SUBSCRIPTION_OBSERVER = 'SubscriptionObserver';
var getterFor$1 = InternalStateModule$4.getterFor;
var setInternalState$4 = InternalStateModule$4.set;
var getObservableInternalState = getterFor$1(OBSERVABLE);
var getSubscriptionInternalState = getterFor$1(SUBSCRIPTION);
var getSubscriptionObserverInternalState = getterFor$1(SUBSCRIPTION_OBSERVER);

var SubscriptionState = function (observer) {
  this.observer = anObject$s(observer);
  this.cleanup = undefined;
  this.subscriptionObserver = undefined;
};

SubscriptionState.prototype = {
  type: SUBSCRIPTION,
  clean: function () {
    var cleanup = this.cleanup;
    if (cleanup) {
      this.cleanup = undefined;
      try {
        cleanup();
      } catch (error) {
        hostReportErrors(error);
      }
    }
  },
  close: function () {
    if (!DESCRIPTORS$4) {
      var subscription = this.facade;
      var subscriptionObserver = this.subscriptionObserver;
      subscription.closed = true;
      if (subscriptionObserver) subscriptionObserver.closed = true;
    } this.observer = undefined;
  },
  isClosed: function () {
    return this.observer === undefined;
  }
};

var Subscription = function (observer, subscriber) {
  var subscriptionState = setInternalState$4(this, new SubscriptionState(observer));
  var start;
  if (!DESCRIPTORS$4) this.closed = false;
  try {
    if (start = getMethod$1(observer, 'start')) call$d(start, observer, this);
  } catch (error) {
    hostReportErrors(error);
  }
  if (subscriptionState.isClosed()) return;
  var subscriptionObserver = subscriptionState.subscriptionObserver = new SubscriptionObserver(subscriptionState);
  try {
    var cleanup = subscriber(subscriptionObserver);
    var subscription = cleanup;
    if (cleanup != null) subscriptionState.cleanup = isCallable$4(cleanup.unsubscribe)
      ? function () { subscription.unsubscribe(); }
      : aCallable$d(cleanup);
  } catch (error) {
    subscriptionObserver.error(error);
    return;
  } if (subscriptionState.isClosed()) subscriptionState.clean();
};

Subscription.prototype = defineBuiltIns$1({}, {
  unsubscribe: function unsubscribe() {
    var subscriptionState = getSubscriptionInternalState(this);
    if (!subscriptionState.isClosed()) {
      subscriptionState.close();
      subscriptionState.clean();
    }
  }
});

if (DESCRIPTORS$4) defineBuiltInAccessor$2(Subscription.prototype, 'closed', {
  configurable: true,
  get: function closed() {
    return getSubscriptionInternalState(this).isClosed();
  }
});

var SubscriptionObserver = function (subscriptionState) {
  setInternalState$4(this, {
    type: SUBSCRIPTION_OBSERVER,
    subscriptionState: subscriptionState
  });
  if (!DESCRIPTORS$4) this.closed = false;
};

SubscriptionObserver.prototype = defineBuiltIns$1({}, {
  next: function next(value) {
    var subscriptionState = getSubscriptionObserverInternalState(this).subscriptionState;
    if (!subscriptionState.isClosed()) {
      var observer = subscriptionState.observer;
      try {
        var nextMethod = getMethod$1(observer, 'next');
        if (nextMethod) call$d(nextMethod, observer, value);
      } catch (error) {
        hostReportErrors(error);
      }
    }
  },
  error: function error(value) {
    var subscriptionState = getSubscriptionObserverInternalState(this).subscriptionState;
    if (!subscriptionState.isClosed()) {
      var observer = subscriptionState.observer;
      subscriptionState.close();
      try {
        var errorMethod = getMethod$1(observer, 'error');
        if (errorMethod) call$d(errorMethod, observer, value);
        else hostReportErrors(value);
      } catch (err) {
        hostReportErrors(err);
      } subscriptionState.clean();
    }
  },
  complete: function complete() {
    var subscriptionState = getSubscriptionObserverInternalState(this).subscriptionState;
    if (!subscriptionState.isClosed()) {
      var observer = subscriptionState.observer;
      subscriptionState.close();
      try {
        var completeMethod = getMethod$1(observer, 'complete');
        if (completeMethod) call$d(completeMethod, observer);
      } catch (error) {
        hostReportErrors(error);
      } subscriptionState.clean();
    }
  }
});

if (DESCRIPTORS$4) defineBuiltInAccessor$2(SubscriptionObserver.prototype, 'closed', {
  configurable: true,
  get: function closed() {
    return getSubscriptionObserverInternalState(this).subscriptionState.isClosed();
  }
});

var $Observable = function Observable(subscriber) {
  anInstance$4(this, ObservablePrototype);
  setInternalState$4(this, {
    type: OBSERVABLE,
    subscriber: aCallable$d(subscriber)
  });
};

var ObservablePrototype = $Observable.prototype;

defineBuiltIns$1(ObservablePrototype, {
  subscribe: function subscribe(observer) {
    var length = arguments.length;
    return new Subscription(isCallable$4(observer) ? {
      next: observer,
      error: length > 1 ? arguments[1] : undefined,
      complete: length > 2 ? arguments[2] : undefined
    } : isObject$2(observer) ? observer : {}, getObservableInternalState(this).subscriber);
  }
});

defineBuiltIn$3(ObservablePrototype, $$OBSERVABLE$1, function () { return this; });

$$T({ global: true, constructor: true, forced: OBSERVABLE_FORCED$2 }, {
  Observable: $Observable
});

setSpecies(OBSERVABLE);

var $$S = _export;
var getBuiltIn$f = getBuiltIn$L;
var call$c = functionCall;
var anObject$r = anObject$1A;
var isConstructor$2 = isConstructor$a;
var getIterator$2 = getIterator$b;
var getMethod = getMethod$i;
var iterate$f = iterate$J;
var wellKnownSymbol$3 = wellKnownSymbol$K;
var OBSERVABLE_FORCED$1 = observableForced;

var $$OBSERVABLE = wellKnownSymbol$3('observable');

// `Observable.from` method
// https://github.com/tc39/proposal-observable
$$S({ target: 'Observable', stat: true, forced: OBSERVABLE_FORCED$1 }, {
  from: function from(x) {
    var C = isConstructor$2(this) ? this : getBuiltIn$f('Observable');
    var observableMethod = getMethod(anObject$r(x), $$OBSERVABLE);
    if (observableMethod) {
      var observable = anObject$r(call$c(observableMethod, x));
      return observable.constructor === C ? observable : new C(function (observer) {
        return observable.subscribe(observer);
      });
    }
    var iterator = getIterator$2(x);
    return new C(function (observer) {
      iterate$f(iterator, function (it, stop) {
        observer.next(it);
        if (observer.closed) return stop();
      }, { IS_ITERATOR: true, INTERRUPTED: true });
      observer.complete();
    });
  }
});

var $$R = _export;
var getBuiltIn$e = getBuiltIn$L;
var isConstructor$1 = isConstructor$a;
var OBSERVABLE_FORCED = observableForced;

var Array$1 = getBuiltIn$e('Array');

// `Observable.of` method
// https://github.com/tc39/proposal-observable
$$R({ target: 'Observable', stat: true, forced: OBSERVABLE_FORCED }, {
  of: function of() {
    var C = isConstructor$1(this) ? this : getBuiltIn$e('Observable');
    var length = arguments.length;
    var items = Array$1(length);
    var index = 0;
    while (index < length) items[index] = arguments[index++];
    return new C(function (observer) {
      for (var i = 0; i < length; i++) {
        observer.next(items[i]);
        if (observer.closed) return;
      } observer.complete();
    });
  }
});

// TODO: Remove from `core-js@4`
var $$Q = _export;
var newPromiseCapabilityModule = newPromiseCapability$2;
var perform = perform$6;

// `Promise.try` method
// https://github.com/tc39/proposal-promise-try
$$Q({ target: 'Promise', stat: true, forced: true }, {
  'try': function (callbackfn) {
    var promiseCapability = newPromiseCapabilityModule.f(this);
    var result = perform(callbackfn);
    (result.error ? promiseCapability.reject : promiseCapability.resolve)(result.value);
    return promiseCapability.promise;
  }
});

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`


var getBuiltIn$d = getBuiltIn$L;
var uncurryThis$c = functionUncurryThis;
var shared = shared$9.exports;

var Map$2 = getBuiltIn$d('Map');
var WeakMap$1 = getBuiltIn$d('WeakMap');
var push$6 = uncurryThis$c([].push);

var metadata = shared('metadata');
var store$1 = metadata.store || (metadata.store = new WeakMap$1());

var getOrCreateMetadataMap$1 = function (target, targetKey, create) {
  var targetMetadata = store$1.get(target);
  if (!targetMetadata) {
    if (!create) return;
    store$1.set(target, targetMetadata = new Map$2());
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if (!keyMetadata) {
    if (!create) return;
    targetMetadata.set(targetKey, keyMetadata = new Map$2());
  } return keyMetadata;
};

var ordinaryHasOwnMetadata$3 = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap$1(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};

var ordinaryGetOwnMetadata$2 = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap$1(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};

var ordinaryDefineOwnMetadata$2 = function (MetadataKey, MetadataValue, O, P) {
  getOrCreateMetadataMap$1(O, P, true).set(MetadataKey, MetadataValue);
};

var ordinaryOwnMetadataKeys$2 = function (target, targetKey) {
  var metadataMap = getOrCreateMetadataMap$1(target, targetKey, false);
  var keys = [];
  if (metadataMap) metadataMap.forEach(function (_, key) { push$6(keys, key); });
  return keys;
};

var toMetadataKey$9 = function (it) {
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};

var reflectMetadata = {
  store: store$1,
  getMap: getOrCreateMetadataMap$1,
  has: ordinaryHasOwnMetadata$3,
  get: ordinaryGetOwnMetadata$2,
  set: ordinaryDefineOwnMetadata$2,
  keys: ordinaryOwnMetadataKeys$2,
  toKey: toMetadataKey$9
};

// TODO: Remove from `core-js@4`
var $$P = _export;
var ReflectMetadataModule$8 = reflectMetadata;
var anObject$q = anObject$1A;

var toMetadataKey$8 = ReflectMetadataModule$8.toKey;
var ordinaryDefineOwnMetadata$1 = ReflectMetadataModule$8.set;

// `Reflect.defineMetadata` method
// https://github.com/rbuckton/reflect-metadata
$$P({ target: 'Reflect', stat: true }, {
  defineMetadata: function defineMetadata(metadataKey, metadataValue, target /* , targetKey */) {
    var targetKey = arguments.length < 4 ? undefined : toMetadataKey$8(arguments[3]);
    ordinaryDefineOwnMetadata$1(metadataKey, metadataValue, anObject$q(target), targetKey);
  }
});

var $$O = _export;
var ReflectMetadataModule$7 = reflectMetadata;
var anObject$p = anObject$1A;

var toMetadataKey$7 = ReflectMetadataModule$7.toKey;
var getOrCreateMetadataMap = ReflectMetadataModule$7.getMap;
var store = ReflectMetadataModule$7.store;

// `Reflect.deleteMetadata` method
// https://github.com/rbuckton/reflect-metadata
$$O({ target: 'Reflect', stat: true }, {
  deleteMetadata: function deleteMetadata(metadataKey, target /* , targetKey */) {
    var targetKey = arguments.length < 3 ? undefined : toMetadataKey$7(arguments[2]);
    var metadataMap = getOrCreateMetadataMap(anObject$p(target), targetKey, false);
    if (metadataMap === undefined || !metadataMap['delete'](metadataKey)) return false;
    if (metadataMap.size) return true;
    var targetMetadata = store.get(target);
    targetMetadata['delete'](targetKey);
    return !!targetMetadata.size || store['delete'](target);
  }
});

// TODO: Remove from `core-js@4`
var $$N = _export;
var ReflectMetadataModule$6 = reflectMetadata;
var anObject$o = anObject$1A;
var getPrototypeOf$2 = objectGetPrototypeOf$1;

var ordinaryHasOwnMetadata$2 = ReflectMetadataModule$6.has;
var ordinaryGetOwnMetadata$1 = ReflectMetadataModule$6.get;
var toMetadataKey$6 = ReflectMetadataModule$6.toKey;

var ordinaryGetMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata$2(MetadataKey, O, P);
  if (hasOwn) return ordinaryGetOwnMetadata$1(MetadataKey, O, P);
  var parent = getPrototypeOf$2(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

// `Reflect.getMetadata` method
// https://github.com/rbuckton/reflect-metadata
$$N({ target: 'Reflect', stat: true }, {
  getMetadata: function getMetadata(metadataKey, target /* , targetKey */) {
    var targetKey = arguments.length < 3 ? undefined : toMetadataKey$6(arguments[2]);
    return ordinaryGetMetadata(metadataKey, anObject$o(target), targetKey);
  }
});

// TODO: Remove from `core-js@4`
var $$M = _export;
var uncurryThis$b = functionUncurryThis;
var ReflectMetadataModule$5 = reflectMetadata;
var anObject$n = anObject$1A;
var getPrototypeOf$1 = objectGetPrototypeOf$1;
var $arrayUniqueBy$1 = arrayUniqueBy$2;

var arrayUniqueBy$1 = uncurryThis$b($arrayUniqueBy$1);
var concat = uncurryThis$b([].concat);
var ordinaryOwnMetadataKeys$1 = ReflectMetadataModule$5.keys;
var toMetadataKey$5 = ReflectMetadataModule$5.toKey;

var ordinaryMetadataKeys = function (O, P) {
  var oKeys = ordinaryOwnMetadataKeys$1(O, P);
  var parent = getPrototypeOf$1(O);
  if (parent === null) return oKeys;
  var pKeys = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? arrayUniqueBy$1(concat(oKeys, pKeys)) : pKeys : oKeys;
};

// `Reflect.getMetadataKeys` method
// https://github.com/rbuckton/reflect-metadata
$$M({ target: 'Reflect', stat: true }, {
  getMetadataKeys: function getMetadataKeys(target /* , targetKey */) {
    var targetKey = arguments.length < 2 ? undefined : toMetadataKey$5(arguments[1]);
    return ordinaryMetadataKeys(anObject$n(target), targetKey);
  }
});

// TODO: Remove from `core-js@4`
var $$L = _export;
var ReflectMetadataModule$4 = reflectMetadata;
var anObject$m = anObject$1A;

var ordinaryGetOwnMetadata = ReflectMetadataModule$4.get;
var toMetadataKey$4 = ReflectMetadataModule$4.toKey;

// `Reflect.getOwnMetadata` method
// https://github.com/rbuckton/reflect-metadata
$$L({ target: 'Reflect', stat: true }, {
  getOwnMetadata: function getOwnMetadata(metadataKey, target /* , targetKey */) {
    var targetKey = arguments.length < 3 ? undefined : toMetadataKey$4(arguments[2]);
    return ordinaryGetOwnMetadata(metadataKey, anObject$m(target), targetKey);
  }
});

// TODO: Remove from `core-js@4`
var $$K = _export;
var ReflectMetadataModule$3 = reflectMetadata;
var anObject$l = anObject$1A;

var ordinaryOwnMetadataKeys = ReflectMetadataModule$3.keys;
var toMetadataKey$3 = ReflectMetadataModule$3.toKey;

// `Reflect.getOwnMetadataKeys` method
// https://github.com/rbuckton/reflect-metadata
$$K({ target: 'Reflect', stat: true }, {
  getOwnMetadataKeys: function getOwnMetadataKeys(target /* , targetKey */) {
    var targetKey = arguments.length < 2 ? undefined : toMetadataKey$3(arguments[1]);
    return ordinaryOwnMetadataKeys(anObject$l(target), targetKey);
  }
});

// TODO: Remove from `core-js@4`
var $$J = _export;
var ReflectMetadataModule$2 = reflectMetadata;
var anObject$k = anObject$1A;
var getPrototypeOf = objectGetPrototypeOf$1;

var ordinaryHasOwnMetadata$1 = ReflectMetadataModule$2.has;
var toMetadataKey$2 = ReflectMetadataModule$2.toKey;

var ordinaryHasMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata$1(MetadataKey, O, P);
  if (hasOwn) return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

// `Reflect.hasMetadata` method
// https://github.com/rbuckton/reflect-metadata
$$J({ target: 'Reflect', stat: true }, {
  hasMetadata: function hasMetadata(metadataKey, target /* , targetKey */) {
    var targetKey = arguments.length < 3 ? undefined : toMetadataKey$2(arguments[2]);
    return ordinaryHasMetadata(metadataKey, anObject$k(target), targetKey);
  }
});

// TODO: Remove from `core-js@4`
var $$I = _export;
var ReflectMetadataModule$1 = reflectMetadata;
var anObject$j = anObject$1A;

var ordinaryHasOwnMetadata = ReflectMetadataModule$1.has;
var toMetadataKey$1 = ReflectMetadataModule$1.toKey;

// `Reflect.hasOwnMetadata` method
// https://github.com/rbuckton/reflect-metadata
$$I({ target: 'Reflect', stat: true }, {
  hasOwnMetadata: function hasOwnMetadata(metadataKey, target /* , targetKey */) {
    var targetKey = arguments.length < 3 ? undefined : toMetadataKey$1(arguments[2]);
    return ordinaryHasOwnMetadata(metadataKey, anObject$j(target), targetKey);
  }
});

var $$H = _export;
var ReflectMetadataModule = reflectMetadata;
var anObject$i = anObject$1A;

var toMetadataKey = ReflectMetadataModule.toKey;
var ordinaryDefineOwnMetadata = ReflectMetadataModule.set;

// `Reflect.metadata` method
// https://github.com/rbuckton/reflect-metadata
$$H({ target: 'Reflect', stat: true }, {
  metadata: function metadata(metadataKey, metadataValue) {
    return function decorator(target, key) {
      ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject$i(target), toMetadataKey(key));
    };
  }
});

var call$b = functionCall;
var aCallable$c = aCallable$X;
var anObject$h = anObject$1A;

// https://github.com/tc39/collection-methods
var collectionAddAll = function addAll(/* ...elements */) {
  var set = anObject$h(this);
  var adder = aCallable$c(set.add);
  for (var k = 0, len = arguments.length; k < len; k++) {
    call$b(adder, set, arguments[k]);
  }
  return set;
};

var $$G = _export;
var addAll$1 = collectionAddAll;

// `Set.prototype.addAll` method
// https://github.com/tc39/proposal-collection-methods
$$G({ target: 'Set', proto: true, real: true, forced: true }, {
  addAll: addAll$1
});

var $$F = _export;
var deleteAll$2 = collectionDeleteAll;

// `Set.prototype.deleteAll` method
// https://github.com/tc39/proposal-collection-methods
$$F({ target: 'Set', proto: true, real: true, forced: true }, {
  deleteAll: deleteAll$2
});

var $$E = _export;
var getBuiltIn$c = getBuiltIn$L;
var call$a = functionCall;
var aCallable$b = aCallable$X;
var anObject$g = anObject$1A;
var speciesConstructor$5 = speciesConstructor$f;
var iterate$e = iterate$J;

// `Set.prototype.difference` method
// https://github.com/tc39/proposal-set-methods
$$E({ target: 'Set', proto: true, real: true, forced: true }, {
  difference: function difference(iterable) {
    var set = anObject$g(this);
    var newSet = new (speciesConstructor$5(set, getBuiltIn$c('Set')))(set);
    var remover = aCallable$b(newSet['delete']);
    iterate$e(iterable, function (value) {
      call$a(remover, newSet, value);
    });
    return newSet;
  }
});

var call$9 = functionCall;

var getSetIterator$7 = function (it) {
  // eslint-disable-next-line es-x/no-set -- safe
  return call$9(Set.prototype.values, it);
};

var $$D = _export;
var anObject$f = anObject$1A;
var bind$6 = functionBindContext;
var getSetIterator$6 = getSetIterator$7;
var iterate$d = iterate$J;

// `Set.prototype.every` method
// https://github.com/tc39/proposal-collection-methods
$$D({ target: 'Set', proto: true, real: true, forced: true }, {
  every: function every(callbackfn /* , thisArg */) {
    var set = anObject$f(this);
    var iterator = getSetIterator$6(set);
    var boundFunction = bind$6(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return !iterate$d(iterator, function (value, stop) {
      if (!boundFunction(value, value, set)) return stop();
    }, { IS_ITERATOR: true, INTERRUPTED: true }).stopped;
  }
});

var $$C = _export;
var getBuiltIn$b = getBuiltIn$L;
var call$8 = functionCall;
var aCallable$a = aCallable$X;
var anObject$e = anObject$1A;
var bind$5 = functionBindContext;
var speciesConstructor$4 = speciesConstructor$f;
var getSetIterator$5 = getSetIterator$7;
var iterate$c = iterate$J;

// `Set.prototype.filter` method
// https://github.com/tc39/proposal-collection-methods
$$C({ target: 'Set', proto: true, real: true, forced: true }, {
  filter: function filter(callbackfn /* , thisArg */) {
    var set = anObject$e(this);
    var iterator = getSetIterator$5(set);
    var boundFunction = bind$5(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var newSet = new (speciesConstructor$4(set, getBuiltIn$b('Set')))();
    var adder = aCallable$a(newSet.add);
    iterate$c(iterator, function (value) {
      if (boundFunction(value, value, set)) call$8(adder, newSet, value);
    }, { IS_ITERATOR: true });
    return newSet;
  }
});

var $$B = _export;
var anObject$d = anObject$1A;
var bind$4 = functionBindContext;
var getSetIterator$4 = getSetIterator$7;
var iterate$b = iterate$J;

// `Set.prototype.find` method
// https://github.com/tc39/proposal-collection-methods
$$B({ target: 'Set', proto: true, real: true, forced: true }, {
  find: function find(callbackfn /* , thisArg */) {
    var set = anObject$d(this);
    var iterator = getSetIterator$4(set);
    var boundFunction = bind$4(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return iterate$b(iterator, function (value, stop) {
      if (boundFunction(value, value, set)) return stop(value);
    }, { IS_ITERATOR: true, INTERRUPTED: true }).result;
  }
});

var $$A = _export;
var from$2 = collectionFrom;

// `Set.from` method
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
$$A({ target: 'Set', stat: true, forced: true }, {
  from: from$2
});

var $$z = _export;
var getBuiltIn$a = getBuiltIn$L;
var call$7 = functionCall;
var aCallable$9 = aCallable$X;
var anObject$c = anObject$1A;
var speciesConstructor$3 = speciesConstructor$f;
var iterate$a = iterate$J;

// `Set.prototype.intersection` method
// https://github.com/tc39/proposal-set-methods
$$z({ target: 'Set', proto: true, real: true, forced: true }, {
  intersection: function intersection(iterable) {
    var set = anObject$c(this);
    var newSet = new (speciesConstructor$3(set, getBuiltIn$a('Set')))();
    var hasCheck = aCallable$9(set.has);
    var adder = aCallable$9(newSet.add);
    iterate$a(iterable, function (value) {
      if (call$7(hasCheck, set, value)) call$7(adder, newSet, value);
    });
    return newSet;
  }
});

var $$y = _export;
var call$6 = functionCall;
var aCallable$8 = aCallable$X;
var anObject$b = anObject$1A;
var iterate$9 = iterate$J;

// `Set.prototype.isDisjointFrom` method
// https://tc39.github.io/proposal-set-methods/#Set.prototype.isDisjointFrom
$$y({ target: 'Set', proto: true, real: true, forced: true }, {
  isDisjointFrom: function isDisjointFrom(iterable) {
    var set = anObject$b(this);
    var hasCheck = aCallable$8(set.has);
    return !iterate$9(iterable, function (value, stop) {
      if (call$6(hasCheck, set, value) === true) return stop();
    }, { INTERRUPTED: true }).stopped;
  }
});

var $$x = _export;
var getBuiltIn$9 = getBuiltIn$L;
var call$5 = functionCall;
var aCallable$7 = aCallable$X;
var isCallable$3 = isCallable$E;
var anObject$a = anObject$1A;
var getIterator$1 = getIterator$b;
var iterate$8 = iterate$J;

// `Set.prototype.isSubsetOf` method
// https://tc39.github.io/proposal-set-methods/#Set.prototype.isSubsetOf
$$x({ target: 'Set', proto: true, real: true, forced: true }, {
  isSubsetOf: function isSubsetOf(iterable) {
    var iterator = getIterator$1(this);
    var otherSet = anObject$a(iterable);
    var hasCheck = otherSet.has;
    if (!isCallable$3(hasCheck)) {
      otherSet = new (getBuiltIn$9('Set'))(iterable);
      hasCheck = aCallable$7(otherSet.has);
    }
    return !iterate$8(iterator, function (value, stop) {
      if (call$5(hasCheck, otherSet, value) === false) return stop();
    }, { IS_ITERATOR: true, INTERRUPTED: true }).stopped;
  }
});

var $$w = _export;
var call$4 = functionCall;
var aCallable$6 = aCallable$X;
var anObject$9 = anObject$1A;
var iterate$7 = iterate$J;

// `Set.prototype.isSupersetOf` method
// https://tc39.github.io/proposal-set-methods/#Set.prototype.isSupersetOf
$$w({ target: 'Set', proto: true, real: true, forced: true }, {
  isSupersetOf: function isSupersetOf(iterable) {
    var set = anObject$9(this);
    var hasCheck = aCallable$6(set.has);
    return !iterate$7(iterable, function (value, stop) {
      if (call$4(hasCheck, set, value) === false) return stop();
    }, { INTERRUPTED: true }).stopped;
  }
});

var $$v = _export;
var uncurryThis$a = functionUncurryThis;
var anObject$8 = anObject$1A;
var toString$5 = toString$z;
var getSetIterator$3 = getSetIterator$7;
var iterate$6 = iterate$J;

var arrayJoin = uncurryThis$a([].join);
var push$5 = [].push;

// `Set.prototype.join` method
// https://github.com/tc39/proposal-collection-methods
$$v({ target: 'Set', proto: true, real: true, forced: true }, {
  join: function join(separator) {
    var set = anObject$8(this);
    var iterator = getSetIterator$3(set);
    var sep = separator === undefined ? ',' : toString$5(separator);
    var result = [];
    iterate$6(iterator, push$5, { that: result, IS_ITERATOR: true });
    return arrayJoin(result, sep);
  }
});

var $$u = _export;
var getBuiltIn$8 = getBuiltIn$L;
var bind$3 = functionBindContext;
var call$3 = functionCall;
var aCallable$5 = aCallable$X;
var anObject$7 = anObject$1A;
var speciesConstructor$2 = speciesConstructor$f;
var getSetIterator$2 = getSetIterator$7;
var iterate$5 = iterate$J;

// `Set.prototype.map` method
// https://github.com/tc39/proposal-collection-methods
$$u({ target: 'Set', proto: true, real: true, forced: true }, {
  map: function map(callbackfn /* , thisArg */) {
    var set = anObject$7(this);
    var iterator = getSetIterator$2(set);
    var boundFunction = bind$3(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var newSet = new (speciesConstructor$2(set, getBuiltIn$8('Set')))();
    var adder = aCallable$5(newSet.add);
    iterate$5(iterator, function (value) {
      call$3(adder, newSet, boundFunction(value, value, set));
    }, { IS_ITERATOR: true });
    return newSet;
  }
});

var $$t = _export;
var of$2 = collectionOf;

// `Set.of` method
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
$$t({ target: 'Set', stat: true, forced: true }, {
  of: of$2
});

var $$s = _export;
var aCallable$4 = aCallable$X;
var anObject$6 = anObject$1A;
var getSetIterator$1 = getSetIterator$7;
var iterate$4 = iterate$J;

var $TypeError$1 = TypeError;

// `Set.prototype.reduce` method
// https://github.com/tc39/proposal-collection-methods
$$s({ target: 'Set', proto: true, real: true, forced: true }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    var set = anObject$6(this);
    var iterator = getSetIterator$1(set);
    var noInitial = arguments.length < 2;
    var accumulator = noInitial ? undefined : arguments[1];
    aCallable$4(callbackfn);
    iterate$4(iterator, function (value) {
      if (noInitial) {
        noInitial = false;
        accumulator = value;
      } else {
        accumulator = callbackfn(accumulator, value, value, set);
      }
    }, { IS_ITERATOR: true });
    if (noInitial) throw $TypeError$1('Reduce of empty set with no initial value');
    return accumulator;
  }
});

var $$r = _export;
var anObject$5 = anObject$1A;
var bind$2 = functionBindContext;
var getSetIterator = getSetIterator$7;
var iterate$3 = iterate$J;

// `Set.prototype.some` method
// https://github.com/tc39/proposal-collection-methods
$$r({ target: 'Set', proto: true, real: true, forced: true }, {
  some: function some(callbackfn /* , thisArg */) {
    var set = anObject$5(this);
    var iterator = getSetIterator(set);
    var boundFunction = bind$2(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return iterate$3(iterator, function (value, stop) {
      if (boundFunction(value, value, set)) return stop();
    }, { IS_ITERATOR: true, INTERRUPTED: true }).stopped;
  }
});

var $$q = _export;
var getBuiltIn$7 = getBuiltIn$L;
var call$2 = functionCall;
var aCallable$3 = aCallable$X;
var anObject$4 = anObject$1A;
var speciesConstructor$1 = speciesConstructor$f;
var iterate$2 = iterate$J;

// `Set.prototype.symmetricDifference` method
// https://github.com/tc39/proposal-set-methods
$$q({ target: 'Set', proto: true, real: true, forced: true }, {
  symmetricDifference: function symmetricDifference(iterable) {
    var set = anObject$4(this);
    var newSet = new (speciesConstructor$1(set, getBuiltIn$7('Set')))(set);
    var remover = aCallable$3(newSet['delete']);
    var adder = aCallable$3(newSet.add);
    iterate$2(iterable, function (value) {
      call$2(remover, newSet, value) || call$2(adder, newSet, value);
    });
    return newSet;
  }
});

var $$p = _export;
var getBuiltIn$6 = getBuiltIn$L;
var aCallable$2 = aCallable$X;
var anObject$3 = anObject$1A;
var speciesConstructor = speciesConstructor$f;
var iterate$1 = iterate$J;

// `Set.prototype.union` method
// https://github.com/tc39/proposal-set-methods
$$p({ target: 'Set', proto: true, real: true, forced: true }, {
  union: function union(iterable) {
    var set = anObject$3(this);
    var newSet = new (speciesConstructor(set, getBuiltIn$6('Set')))(set);
    iterate$1(iterable, aCallable$2(newSet.add), { that: newSet });
    return newSet;
  }
});

// TODO: Remove from `core-js@4`
var $$o = _export;
var charAt$5 = stringMultibyte.charAt;
var requireObjectCoercible$1 = requireObjectCoercible$k;
var toIntegerOrInfinity$2 = toIntegerOrInfinity$o;
var toString$4 = toString$z;

// `String.prototype.at` method
// https://github.com/mathiasbynens/String.prototype.at
$$o({ target: 'String', proto: true, forced: true }, {
  at: function at(index) {
    var S = toString$4(requireObjectCoercible$1(this));
    var len = S.length;
    var relativeIndex = toIntegerOrInfinity$2(index);
    var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
    return (k < 0 || k >= len) ? undefined : charAt$5(S, k);
  }
});

var $$n = _export;
var uncurryThis$9 = functionUncurryThis;
var toIndexedObject = toIndexedObject$k;
var toString$3 = toString$z;
var lengthOfArrayLike$2 = lengthOfArrayLike$A;

var $TypeError = TypeError;
var ArrayPrototype = Array.prototype;
var push$4 = uncurryThis$9(ArrayPrototype.push);
var join$3 = uncurryThis$9(ArrayPrototype.join);

// `String.cooked` method
// https://github.com/tc39/proposal-string-cooked
$$n({ target: 'String', stat: true, forced: true }, {
  cooked: function cooked(template /* , ...substitutions */) {
    var cookedTemplate = toIndexedObject(template);
    var literalSegments = lengthOfArrayLike$2(cookedTemplate);
    var argumentsLength = arguments.length;
    var elements = [];
    var i = 0;
    while (literalSegments > i) {
      var nextVal = cookedTemplate[i++];
      if (nextVal === undefined) throw $TypeError('Incorrect template');
      push$4(elements, toString$3(nextVal));
      if (i === literalSegments) return join$3(elements, '');
      if (i < argumentsLength) push$4(elements, toString$3(arguments[i]));
    }
  }
});

var $$m = _export;
var createIteratorConstructor$1 = createIteratorConstructor$7;
var requireObjectCoercible = requireObjectCoercible$k;
var toString$2 = toString$z;
var InternalStateModule$3 = internalState;
var StringMultibyteModule = stringMultibyte;

var codeAt$1 = StringMultibyteModule.codeAt;
var charAt$4 = StringMultibyteModule.charAt;
var STRING_ITERATOR = 'String Iterator';
var setInternalState$3 = InternalStateModule$3.set;
var getInternalState$1 = InternalStateModule$3.getterFor(STRING_ITERATOR);

// TODO: unify with String#@@iterator
var $StringIterator = createIteratorConstructor$1(function StringIterator(string) {
  setInternalState$3(this, {
    type: STRING_ITERATOR,
    string: string,
    index: 0
  });
}, 'String', function next() {
  var state = getInternalState$1(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt$4(string, index);
  state.index += point.length;
  return { value: { codePoint: codeAt$1(point, 0), position: index }, done: false };
});

// `String.prototype.codePoints` method
// https://github.com/tc39/proposal-string-prototype-codepoints
$$m({ target: 'String', proto: true, forced: true }, {
  codePoints: function codePoints() {
    return new $StringIterator(toString$2(requireObjectCoercible(this)));
  }
});

var defineWellKnownSymbol$7 = defineWellKnownSymbol$m;

// `Symbol.asyncDispose` well-known symbol
// https://github.com/tc39/proposal-using-statement
defineWellKnownSymbol$7('asyncDispose');

var defineWellKnownSymbol$6 = defineWellKnownSymbol$m;

// `Symbol.dispose` well-known symbol
// https://github.com/tc39/proposal-using-statement
defineWellKnownSymbol$6('dispose');

var defineWellKnownSymbol$5 = defineWellKnownSymbol$m;

// `Symbol.matcher` well-known symbol
// https://github.com/tc39/proposal-pattern-matching
defineWellKnownSymbol$5('matcher');

// TODO: Remove from `core-js@4`
var defineWellKnownSymbol$4 = defineWellKnownSymbol$m;

// `Symbol.metadata` well-known symbol
// https://github.com/tc39/proposal-decorators
defineWellKnownSymbol$4('metadata');

var defineWellKnownSymbol$3 = defineWellKnownSymbol$m;

// `Symbol.metadataKey` well-known symbol
// https://github.com/tc39/proposal-decorator-metadata
defineWellKnownSymbol$3('metadataKey');

var defineWellKnownSymbol$2 = defineWellKnownSymbol$m;

// `Symbol.observable` well-known symbol
// https://github.com/tc39/proposal-observable
defineWellKnownSymbol$2('observable');

// TODO: remove from `core-js@4`
var defineWellKnownSymbol$1 = defineWellKnownSymbol$m;

// `Symbol.patternMatch` well-known symbol
// https://github.com/tc39/proposal-pattern-matching
defineWellKnownSymbol$1('patternMatch');

// TODO: remove from `core-js@4`
var defineWellKnownSymbol = defineWellKnownSymbol$m;

defineWellKnownSymbol('replaceAll');

// TODO: Remove from `core-js@4`
var getBuiltIn$5 = getBuiltIn$L;
var aConstructor = aConstructor$5;
var arrayFromAsync = arrayFromAsync$1;
var ArrayBufferViewCore$8 = arrayBufferViewCore;
var arrayFromConstructorAndList$1 = arrayFromConstructorAndList$5;

var aTypedArrayConstructor = ArrayBufferViewCore$8.aTypedArrayConstructor;
var exportTypedArrayStaticMethod = ArrayBufferViewCore$8.exportTypedArrayStaticMethod;

// `%TypedArray%.fromAsync` method
// https://github.com/tc39/proposal-array-from-async
exportTypedArrayStaticMethod('fromAsync', function fromAsync(asyncItems /* , mapfn = undefined, thisArg = undefined */) {
  var C = this;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var thisArg = argumentsLength > 2 ? arguments[2] : undefined;
  return new (getBuiltIn$5('Promise'))(function (resolve) {
    aConstructor(C);
    resolve(arrayFromAsync(asyncItems, mapfn, thisArg));
  }).then(function (list) {
    return arrayFromConstructorAndList$1(aTypedArrayConstructor(C), list);
  });
}, true);

// TODO: Remove from `core-js@4`
var ArrayBufferViewCore$7 = arrayBufferViewCore;
var $filterReject$1 = arrayIteration.filterReject;
var fromSpeciesAndList$2 = typedArrayFromSpeciesAndList;

var aTypedArray$7 = ArrayBufferViewCore$7.aTypedArray;
var exportTypedArrayMethod$7 = ArrayBufferViewCore$7.exportTypedArrayMethod;

// `%TypedArray%.prototype.filterOut` method
// https://github.com/tc39/proposal-array-filtering
exportTypedArrayMethod$7('filterOut', function filterOut(callbackfn /* , thisArg */) {
  var list = $filterReject$1(aTypedArray$7(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  return fromSpeciesAndList$2(this, list);
}, true);

var ArrayBufferViewCore$6 = arrayBufferViewCore;
var $filterReject = arrayIteration.filterReject;
var fromSpeciesAndList$1 = typedArrayFromSpeciesAndList;

var aTypedArray$6 = ArrayBufferViewCore$6.aTypedArray;
var exportTypedArrayMethod$6 = ArrayBufferViewCore$6.exportTypedArrayMethod;

// `%TypedArray%.prototype.filterReject` method
// https://github.com/tc39/proposal-array-filtering
exportTypedArrayMethod$6('filterReject', function filterReject(callbackfn /* , thisArg */) {
  var list = $filterReject(aTypedArray$6(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  return fromSpeciesAndList$1(this, list);
}, true);

// TODO: Remove from `core-js@4`
var ArrayBufferViewCore$5 = arrayBufferViewCore;
var $group = arrayGroup;
var typedArraySpeciesConstructor = typedArraySpeciesConstructor$5;

var aTypedArray$5 = ArrayBufferViewCore$5.aTypedArray;
var exportTypedArrayMethod$5 = ArrayBufferViewCore$5.exportTypedArrayMethod;

// `%TypedArray%.prototype.groupBy` method
// https://github.com/tc39/proposal-array-grouping
exportTypedArrayMethod$5('groupBy', function groupBy(callbackfn /* , thisArg */) {
  var thisArg = arguments.length > 1 ? arguments[1] : undefined;
  return $group(aTypedArray$5(this), callbackfn, thisArg, typedArraySpeciesConstructor);
}, true);

var arrayToReversed = arrayToReversed$2;
var ArrayBufferViewCore$4 = arrayBufferViewCore;

var aTypedArray$4 = ArrayBufferViewCore$4.aTypedArray;
var exportTypedArrayMethod$4 = ArrayBufferViewCore$4.exportTypedArrayMethod;
var getTypedArrayConstructor$3 = ArrayBufferViewCore$4.getTypedArrayConstructor;

// `%TypedArray%.prototype.toReversed` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
exportTypedArrayMethod$4('toReversed', function toReversed() {
  return arrayToReversed(aTypedArray$4(this), getTypedArrayConstructor$3(this));
});

var ArrayBufferViewCore$3 = arrayBufferViewCore;
var uncurryThis$8 = functionUncurryThis;
var aCallable$1 = aCallable$X;
var arrayFromConstructorAndList = arrayFromConstructorAndList$5;

var aTypedArray$3 = ArrayBufferViewCore$3.aTypedArray;
var getTypedArrayConstructor$2 = ArrayBufferViewCore$3.getTypedArrayConstructor;
var exportTypedArrayMethod$3 = ArrayBufferViewCore$3.exportTypedArrayMethod;
var sort = uncurryThis$8(ArrayBufferViewCore$3.TypedArrayPrototype.sort);

// `%TypedArray%.prototype.toSorted` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toSorted
exportTypedArrayMethod$3('toSorted', function toSorted(compareFn) {
  if (compareFn !== undefined) aCallable$1(compareFn);
  var O = aTypedArray$3(this);
  var A = arrayFromConstructorAndList(getTypedArrayConstructor$2(O), O);
  return sort(A, compareFn);
});

var ArrayBufferViewCore$2 = arrayBufferViewCore;
var lengthOfArrayLike$1 = lengthOfArrayLike$A;
var toAbsoluteIndex = toAbsoluteIndex$b;
var toIntegerOrInfinity$1 = toIntegerOrInfinity$o;
var fails$5 = fails$1m;

var aTypedArray$2 = ArrayBufferViewCore$2.aTypedArray;
var getTypedArrayConstructor$1 = ArrayBufferViewCore$2.getTypedArrayConstructor;
var exportTypedArrayMethod$2 = ArrayBufferViewCore$2.exportTypedArrayMethod;
var max = Math.max;
var min = Math.min;

// some early implementations, like WebKit, does not follow the final semantic
var PROPER_ORDER$1 = !fails$5(function () {
  // eslint-disable-next-line es-x/no-typed-arrays -- required for testing
  var array = new Int8Array([1]);

  var spliced = array.toSpliced(1, 0, {
    valueOf: function () {
      array[0] = 2;
      return 3;
    }
  });

  return spliced[0] !== 2 || spliced[1] !== 3;
});

// `%TypedArray%.prototype.toSpliced` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toSpliced
exportTypedArrayMethod$2('toSpliced', function toSpliced(start, deleteCount /* , ...items */) {
  var O = aTypedArray$2(this);
  var C = getTypedArrayConstructor$1(O);
  var len = lengthOfArrayLike$1(O);
  var actualStart = toAbsoluteIndex(start, len);
  var argumentsLength = arguments.length;
  var k = 0;
  var insertCount, actualDeleteCount, convertedItems, newLen, A;
  if (argumentsLength === 0) {
    insertCount = actualDeleteCount = 0;
  } else if (argumentsLength === 1) {
    insertCount = 0;
    actualDeleteCount = len - actualStart;
  } else {
    actualDeleteCount = min(max(toIntegerOrInfinity$1(deleteCount), 0), len - actualStart);
    insertCount = argumentsLength - 2;
    if (insertCount) {
      convertedItems = new C(insertCount);
      for (var i = 2; i < argumentsLength; i++) {
        convertedItems[i - 2] = arguments[i];
      }
    }
  }
  newLen = len + insertCount - actualDeleteCount;
  A = new C(newLen);

  for (; k < actualStart; k++) A[k] = O[k];
  for (; k < actualStart + insertCount; k++) A[k] = convertedItems[k - actualStart];
  for (; k < newLen; k++) A[k] = O[k + actualDeleteCount - insertCount];

  return A;
}, !PROPER_ORDER$1);

var uncurryThis$7 = functionUncurryThis;
var ArrayBufferViewCore$1 = arrayBufferViewCore;
var $arrayUniqueBy = arrayUniqueBy$2;
var fromSpeciesAndList = typedArrayFromSpeciesAndList;

var aTypedArray$1 = ArrayBufferViewCore$1.aTypedArray;
var exportTypedArrayMethod$1 = ArrayBufferViewCore$1.exportTypedArrayMethod;
var arrayUniqueBy = uncurryThis$7($arrayUniqueBy);

// `%TypedArray%.prototype.uniqueBy` method
// https://github.com/tc39/proposal-array-unique
exportTypedArrayMethod$1('uniqueBy', function uniqueBy(resolver) {
  return fromSpeciesAndList(this, arrayUniqueBy(aTypedArray$1(this), resolver));
}, true);

var classof$2 = classof$l;
var uncurryThis$6 = functionUncurryThis;

var slice = uncurryThis$6(''.slice);

var isBigIntArray$1 = function (it) {
  return slice(classof$2(it), 0, 3) === 'Big';
};

var arrayWith = arrayWith$2;
var ArrayBufferViewCore = arrayBufferViewCore;
var isBigIntArray = isBigIntArray$1;
var toIntegerOrInfinity = toIntegerOrInfinity$o;
var toBigInt = toBigInt$2;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

var PROPER_ORDER = !!function () {
  try {
    // eslint-disable-next-line no-throw-literal, es-x/no-typed-arrays -- required for testing
    new Int8Array(1)['with'](2, { valueOf: function () { throw 8; } });
  } catch (error) {
    // some early implementations, like WebKit, does not follow the final semantic
    // https://github.com/tc39/proposal-change-array-by-copy/pull/86
    return error === 8;
  }
}();

// `%TypedArray%.prototype.with` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
exportTypedArrayMethod('with', { 'with': function (index, value) {
  var O = aTypedArray(this);
  var relativeIndex = toIntegerOrInfinity(index);
  var actualValue = isBigIntArray(O) ? toBigInt(value) : +value;
  return arrayWith(O, getTypedArrayConstructor(O), relativeIndex, actualValue);
} }['with'], !PROPER_ORDER);

var $$l = _export;
var deleteAll$1 = collectionDeleteAll;

// `WeakMap.prototype.deleteAll` method
// https://github.com/tc39/proposal-collection-methods
$$l({ target: 'WeakMap', proto: true, real: true, forced: true }, {
  deleteAll: deleteAll$1
});

var $$k = _export;
var from$1 = collectionFrom;

// `WeakMap.from` method
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.from
$$k({ target: 'WeakMap', stat: true, forced: true }, {
  from: from$1
});

var $$j = _export;
var of$1 = collectionOf;

// `WeakMap.of` method
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.of
$$j({ target: 'WeakMap', stat: true, forced: true }, {
  of: of$1
});

var $$i = _export;
var emplace = mapEmplace;

// `WeakMap.prototype.emplace` method
// https://github.com/tc39/proposal-upsert
$$i({ target: 'WeakMap', proto: true, real: true, forced: true }, {
  emplace: emplace
});

// TODO: remove from `core-js@4`
var $$h = _export;
var upsert = mapUpsert;

// `WeakMap.prototype.upsert` method (replaced by `WeakMap.prototype.emplace`)
// https://github.com/tc39/proposal-upsert
$$h({ target: 'WeakMap', proto: true, real: true, forced: true }, {
  upsert: upsert
});

var $$g = _export;
var addAll = collectionAddAll;

// `WeakSet.prototype.addAll` method
// https://github.com/tc39/proposal-collection-methods
$$g({ target: 'WeakSet', proto: true, real: true, forced: true }, {
  addAll: addAll
});

var $$f = _export;
var deleteAll = collectionDeleteAll;

// `WeakSet.prototype.deleteAll` method
// https://github.com/tc39/proposal-collection-methods
$$f({ target: 'WeakSet', proto: true, real: true, forced: true }, {
  deleteAll: deleteAll
});

var $$e = _export;
var from = collectionFrom;

// `WeakSet.from` method
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.from
$$e({ target: 'WeakSet', stat: true, forced: true }, {
  from: from
});

var $$d = _export;
var of = collectionOf;

// `WeakSet.of` method
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.of
$$d({ target: 'WeakSet', stat: true, forced: true }, {
  of: of
});

var itoc$1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var ctoi$1 = {};

for (var index = 0; index < 66; index++) ctoi$1[itoc$1.charAt(index)] = index;

var base64Map = {
  itoc: itoc$1,
  ctoi: ctoi$1
};

var $$c = _export;
var getBuiltIn$4 = getBuiltIn$L;
var uncurryThis$5 = functionUncurryThis;
var fails$4 = fails$1m;
var toString$1 = toString$z;
var hasOwn$5 = hasOwnProperty_1;
var validateArgumentsLength$6 = validateArgumentsLength$8;
var ctoi = base64Map.ctoi;

var disallowed = /[^\d+/a-z]/i;
var whitespaces = /[\t\n\f\r ]+/g;
var finalEq = /[=]+$/;

var $atob = getBuiltIn$4('atob');
var fromCharCode$1 = String.fromCharCode;
var charAt$3 = uncurryThis$5(''.charAt);
var replace$3 = uncurryThis$5(''.replace);
var exec$2 = uncurryThis$5(disallowed.exec);

var NO_SPACES_IGNORE = fails$4(function () {
  return $atob(' ') !== '';
});

var NO_ENCODING_CHECK = !fails$4(function () {
  $atob('a');
});

var NO_ARG_RECEIVING_CHECK$1 = !NO_SPACES_IGNORE && !NO_ENCODING_CHECK && !fails$4(function () {
  $atob();
});

var WRONG_ARITY$1 = !NO_SPACES_IGNORE && !NO_ENCODING_CHECK && $atob.length !== 1;

// `atob` method
// https://html.spec.whatwg.org/multipage/webappapis.html#dom-atob
$$c({ global: true, enumerable: true, forced: NO_SPACES_IGNORE || NO_ENCODING_CHECK || NO_ARG_RECEIVING_CHECK$1 || WRONG_ARITY$1 }, {
  atob: function atob(data) {
    validateArgumentsLength$6(arguments.length, 1);
    if (NO_ARG_RECEIVING_CHECK$1 || WRONG_ARITY$1) return $atob(data);
    var string = replace$3(toString$1(data), whitespaces, '');
    var output = '';
    var position = 0;
    var bc = 0;
    var chr, bs;
    if (string.length % 4 == 0) {
      string = replace$3(string, finalEq, '');
    }
    if (string.length % 4 == 1 || exec$2(disallowed, string)) {
      throw new (getBuiltIn$4('DOMException'))('The string is not correctly encoded', 'InvalidCharacterError');
    }
    while (chr = charAt$3(string, position++)) {
      if (hasOwn$5(ctoi, chr)) {
        bs = bc % 4 ? bs * 64 + ctoi[chr] : ctoi[chr];
        if (bc++ % 4) output += fromCharCode$1(255 & bs >> (-2 * bc & 6));
      }
    } return output;
  }
});

var $$b = _export;
var getBuiltIn$3 = getBuiltIn$L;
var uncurryThis$4 = functionUncurryThis;
var fails$3 = fails$1m;
var toString = toString$z;
var validateArgumentsLength$5 = validateArgumentsLength$8;
var itoc = base64Map.itoc;

var $btoa = getBuiltIn$3('btoa');
var charAt$2 = uncurryThis$4(''.charAt);
var charCodeAt$1 = uncurryThis$4(''.charCodeAt);

var NO_ARG_RECEIVING_CHECK = !!$btoa && !fails$3(function () {
  $btoa();
});

var WRONG_ARG_CONVERSION = !!$btoa && fails$3(function () {
  return $btoa(null) !== 'bnVsbA==';
});

var WRONG_ARITY = !!$btoa && $btoa.length !== 1;

// `btoa` method
// https://html.spec.whatwg.org/multipage/webappapis.html#dom-btoa
$$b({ global: true, enumerable: true, forced: NO_ARG_RECEIVING_CHECK || WRONG_ARG_CONVERSION || WRONG_ARITY }, {
  btoa: function btoa(data) {
    validateArgumentsLength$5(arguments.length, 1);
    if (NO_ARG_RECEIVING_CHECK || WRONG_ARG_CONVERSION || WRONG_ARITY) return $btoa(toString(data));
    var string = toString(data);
    var output = '';
    var position = 0;
    var map = itoc;
    var block, charCode;
    while (charAt$2(string, position) || (map = '=', position % 1)) {
      charCode = charCodeAt$1(string, position += 3 / 4);
      if (charCode > 0xFF) {
        throw new (getBuiltIn$3('DOMException'))('The string contains characters outside of the Latin1 range', 'InvalidCharacterError');
      }
      block = block << 8 | charCode;
      output += charAt$2(map, 63 & block >> 8 - position % 1 * 8);
    } return output;
  }
});

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
var documentCreateElement = documentCreateElement$2;

var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype$2 = classList && classList.constructor && classList.constructor.prototype;

var domTokenListPrototype = DOMTokenListPrototype$2 === Object.prototype ? undefined : DOMTokenListPrototype$2;

var global$c = global$$;
var DOMIterables$1 = domIterables;
var DOMTokenListPrototype$1 = domTokenListPrototype;
var forEach = arrayForEach;
var createNonEnumerableProperty$2 = createNonEnumerableProperty$i;

var handlePrototype$1 = function (CollectionPrototype) {
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty$2(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
};

for (var COLLECTION_NAME$1 in DOMIterables$1) {
  if (DOMIterables$1[COLLECTION_NAME$1]) {
    handlePrototype$1(global$c[COLLECTION_NAME$1] && global$c[COLLECTION_NAME$1].prototype);
  }
}

handlePrototype$1(DOMTokenListPrototype$1);

var global$b = global$$;
var DOMIterables = domIterables;
var DOMTokenListPrototype = domTokenListPrototype;
var ArrayIteratorMethods = es_array_iterator;
var createNonEnumerableProperty$1 = createNonEnumerableProperty$i;
var wellKnownSymbol$2 = wellKnownSymbol$K;

var ITERATOR$2 = wellKnownSymbol$2('iterator');
var TO_STRING_TAG = wellKnownSymbol$2('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR$2] !== ArrayValues) try {
      createNonEnumerableProperty$1(CollectionPrototype, ITERATOR$2, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR$2] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty$1(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty$1(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  handlePrototype(global$b[COLLECTION_NAME] && global$b[COLLECTION_NAME].prototype, COLLECTION_NAME);
}

handlePrototype(DOMTokenListPrototype, 'DOMTokenList');

var IS_NODE$2 = engineIsNode;

var tryNodeRequire$1 = function (name) {
  try {
    // eslint-disable-next-line no-new-func -- safe
    if (IS_NODE$2) return Function('return require("' + name + '")')();
  } catch (error) { /* empty */ }
};

var domExceptionConstants = {
  IndexSizeError: { s: 'INDEX_SIZE_ERR', c: 1, m: 1 },
  DOMStringSizeError: { s: 'DOMSTRING_SIZE_ERR', c: 2, m: 0 },
  HierarchyRequestError: { s: 'HIERARCHY_REQUEST_ERR', c: 3, m: 1 },
  WrongDocumentError: { s: 'WRONG_DOCUMENT_ERR', c: 4, m: 1 },
  InvalidCharacterError: { s: 'INVALID_CHARACTER_ERR', c: 5, m: 1 },
  NoDataAllowedError: { s: 'NO_DATA_ALLOWED_ERR', c: 6, m: 0 },
  NoModificationAllowedError: { s: 'NO_MODIFICATION_ALLOWED_ERR', c: 7, m: 1 },
  NotFoundError: { s: 'NOT_FOUND_ERR', c: 8, m: 1 },
  NotSupportedError: { s: 'NOT_SUPPORTED_ERR', c: 9, m: 1 },
  InUseAttributeError: { s: 'INUSE_ATTRIBUTE_ERR', c: 10, m: 1 },
  InvalidStateError: { s: 'INVALID_STATE_ERR', c: 11, m: 1 },
  SyntaxError: { s: 'SYNTAX_ERR', c: 12, m: 1 },
  InvalidModificationError: { s: 'INVALID_MODIFICATION_ERR', c: 13, m: 1 },
  NamespaceError: { s: 'NAMESPACE_ERR', c: 14, m: 1 },
  InvalidAccessError: { s: 'INVALID_ACCESS_ERR', c: 15, m: 1 },
  ValidationError: { s: 'VALIDATION_ERR', c: 16, m: 0 },
  TypeMismatchError: { s: 'TYPE_MISMATCH_ERR', c: 17, m: 1 },
  SecurityError: { s: 'SECURITY_ERR', c: 18, m: 1 },
  NetworkError: { s: 'NETWORK_ERR', c: 19, m: 1 },
  AbortError: { s: 'ABORT_ERR', c: 20, m: 1 },
  URLMismatchError: { s: 'URL_MISMATCH_ERR', c: 21, m: 1 },
  QuotaExceededError: { s: 'QUOTA_EXCEEDED_ERR', c: 22, m: 1 },
  TimeoutError: { s: 'TIMEOUT_ERR', c: 23, m: 1 },
  InvalidNodeTypeError: { s: 'INVALID_NODE_TYPE_ERR', c: 24, m: 1 },
  DataCloneError: { s: 'DATA_CLONE_ERR', c: 25, m: 1 }
};

var $$a = _export;
var tryNodeRequire = tryNodeRequire$1;
var getBuiltIn$2 = getBuiltIn$L;
var fails$2 = fails$1m;
var create$1 = objectCreate$1;
var createPropertyDescriptor$2 = createPropertyDescriptor$c;
var defineProperty$1 = objectDefineProperty.f;
var defineBuiltIn$2 = defineBuiltIn$p;
var defineBuiltInAccessor$1 = defineBuiltInAccessor$8;
var hasOwn$4 = hasOwnProperty_1;
var anInstance$3 = anInstance$d;
var anObject$2 = anObject$1A;
var errorToString = errorToString$2;
var normalizeStringArgument$1 = normalizeStringArgument$5;
var DOMExceptionConstants$1 = domExceptionConstants;
var clearErrorStack$1 = clearErrorStack$4;
var InternalStateModule$2 = internalState;
var DESCRIPTORS$3 = descriptors;

var DOM_EXCEPTION$2 = 'DOMException';
var DATA_CLONE_ERR = 'DATA_CLONE_ERR';
var Error$3 = getBuiltIn$2('Error');
// NodeJS < 17.0 does not expose `DOMException` to global
var NativeDOMException$1 = getBuiltIn$2(DOM_EXCEPTION$2) || (function () {
  try {
    // NodeJS < 15.0 does not expose `MessageChannel` to global
    var MessageChannel = getBuiltIn$2('MessageChannel') || tryNodeRequire('worker_threads').MessageChannel;
    // eslint-disable-next-line es-x/no-weak-map, unicorn/require-post-message-target-origin -- safe
    new MessageChannel().port1.postMessage(new WeakMap());
  } catch (error) {
    if (error.name == DATA_CLONE_ERR && error.code == 25) return error.constructor;
  }
})();
var NativeDOMExceptionPrototype = NativeDOMException$1 && NativeDOMException$1.prototype;
var ErrorPrototype = Error$3.prototype;
var setInternalState$2 = InternalStateModule$2.set;
var getInternalState = InternalStateModule$2.getterFor(DOM_EXCEPTION$2);
var HAS_STACK = 'stack' in Error$3(DOM_EXCEPTION$2);

var codeFor = function (name) {
  return hasOwn$4(DOMExceptionConstants$1, name) && DOMExceptionConstants$1[name].m ? DOMExceptionConstants$1[name].c : 0;
};

var $DOMException$1 = function DOMException() {
  anInstance$3(this, DOMExceptionPrototype$1);
  var argumentsLength = arguments.length;
  var message = normalizeStringArgument$1(argumentsLength < 1 ? undefined : arguments[0]);
  var name = normalizeStringArgument$1(argumentsLength < 2 ? undefined : arguments[1], 'Error');
  var code = codeFor(name);
  setInternalState$2(this, {
    type: DOM_EXCEPTION$2,
    name: name,
    message: message,
    code: code
  });
  if (!DESCRIPTORS$3) {
    this.name = name;
    this.message = message;
    this.code = code;
  }
  if (HAS_STACK) {
    var error = Error$3(message);
    error.name = DOM_EXCEPTION$2;
    defineProperty$1(this, 'stack', createPropertyDescriptor$2(1, clearErrorStack$1(error.stack, 1)));
  }
};

var DOMExceptionPrototype$1 = $DOMException$1.prototype = create$1(ErrorPrototype);

var createGetterDescriptor = function (get) {
  return { enumerable: true, configurable: true, get: get };
};

var getterFor = function (key) {
  return createGetterDescriptor(function () {
    return getInternalState(this)[key];
  });
};

if (DESCRIPTORS$3) {
  defineBuiltInAccessor$1(DOMExceptionPrototype$1, 'code', getterFor('code'));
  defineBuiltInAccessor$1(DOMExceptionPrototype$1, 'message', getterFor('message'));
  defineBuiltInAccessor$1(DOMExceptionPrototype$1, 'name', getterFor('name'));
}

defineProperty$1(DOMExceptionPrototype$1, 'constructor', createPropertyDescriptor$2(1, $DOMException$1));

// FF36- DOMException is a function, but can't be constructed
var INCORRECT_CONSTRUCTOR = fails$2(function () {
  return !(new NativeDOMException$1() instanceof Error$3);
});

// Safari 10.1 / Chrome 32- / IE8- DOMException.prototype.toString bugs
var INCORRECT_TO_STRING = INCORRECT_CONSTRUCTOR || fails$2(function () {
  return ErrorPrototype.toString !== errorToString || String(new NativeDOMException$1(1, 2)) !== '2: 1';
});

// Deno 1.6.3- DOMException.prototype.code just missed
var INCORRECT_CODE = INCORRECT_CONSTRUCTOR || fails$2(function () {
  return new NativeDOMException$1(1, 'DataCloneError').code !== 25;
});

// Deno 1.6.3- DOMException constants just missed
INCORRECT_CONSTRUCTOR
  || NativeDOMException$1[DATA_CLONE_ERR] !== 25
  || NativeDOMExceptionPrototype[DATA_CLONE_ERR] !== 25;

var FORCED_CONSTRUCTOR$1 = INCORRECT_CONSTRUCTOR;

// `DOMException` constructor
// https://webidl.spec.whatwg.org/#idl-DOMException
$$a({ global: true, constructor: true, forced: FORCED_CONSTRUCTOR$1 }, {
  DOMException: FORCED_CONSTRUCTOR$1 ? $DOMException$1 : NativeDOMException$1
});

var PolyfilledDOMException$1 = getBuiltIn$2(DOM_EXCEPTION$2);
var PolyfilledDOMExceptionPrototype$1 = PolyfilledDOMException$1.prototype;

if (INCORRECT_TO_STRING && (NativeDOMException$1 === PolyfilledDOMException$1)) {
  defineBuiltIn$2(PolyfilledDOMExceptionPrototype$1, 'toString', errorToString);
}

if (INCORRECT_CODE && DESCRIPTORS$3 && NativeDOMException$1 === PolyfilledDOMException$1) {
  defineBuiltInAccessor$1(PolyfilledDOMExceptionPrototype$1, 'code', createGetterDescriptor(function () {
    return codeFor(anObject$2(this).name);
  }));
}

for (var key$1 in DOMExceptionConstants$1) if (hasOwn$4(DOMExceptionConstants$1, key$1)) {
  var constant$1 = DOMExceptionConstants$1[key$1];
  var constantName$1 = constant$1.s;
  var descriptor$1 = createPropertyDescriptor$2(6, constant$1.c);
  if (!hasOwn$4(PolyfilledDOMException$1, constantName$1)) {
    defineProperty$1(PolyfilledDOMException$1, constantName$1, descriptor$1);
  }
  if (!hasOwn$4(PolyfilledDOMExceptionPrototype$1, constantName$1)) {
    defineProperty$1(PolyfilledDOMExceptionPrototype$1, constantName$1, descriptor$1);
  }
}

var $$9 = _export;
var global$a = global$$;
var getBuiltIn$1 = getBuiltIn$L;
var createPropertyDescriptor$1 = createPropertyDescriptor$c;
var defineProperty = objectDefineProperty.f;
var hasOwn$3 = hasOwnProperty_1;
var anInstance$2 = anInstance$d;
var inheritIfRequired = inheritIfRequired$6;
var normalizeStringArgument = normalizeStringArgument$5;
var DOMExceptionConstants = domExceptionConstants;
var clearErrorStack = clearErrorStack$4;
var DESCRIPTORS$2 = descriptors;

var DOM_EXCEPTION$1 = 'DOMException';
var Error$2 = getBuiltIn$1('Error');
var NativeDOMException = getBuiltIn$1(DOM_EXCEPTION$1);

var $DOMException = function DOMException() {
  anInstance$2(this, DOMExceptionPrototype);
  var argumentsLength = arguments.length;
  var message = normalizeStringArgument(argumentsLength < 1 ? undefined : arguments[0]);
  var name = normalizeStringArgument(argumentsLength < 2 ? undefined : arguments[1], 'Error');
  var that = new NativeDOMException(message, name);
  var error = Error$2(message);
  error.name = DOM_EXCEPTION$1;
  defineProperty(that, 'stack', createPropertyDescriptor$1(1, clearErrorStack(error.stack, 1)));
  inheritIfRequired(that, this, $DOMException);
  return that;
};

var DOMExceptionPrototype = $DOMException.prototype = NativeDOMException.prototype;

var ERROR_HAS_STACK = 'stack' in Error$2(DOM_EXCEPTION$1);
var DOM_EXCEPTION_HAS_STACK = 'stack' in new NativeDOMException(1, 2);

// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var descriptor = NativeDOMException && DESCRIPTORS$2 && Object.getOwnPropertyDescriptor(global$a, DOM_EXCEPTION$1);

// Bun ~ 0.1.1 DOMException have incorrect descriptor and we can't redefine it
// https://github.com/Jarred-Sumner/bun/issues/399
var BUGGY_DESCRIPTOR = !!descriptor && !(descriptor.writable && descriptor.configurable);

var FORCED_CONSTRUCTOR = ERROR_HAS_STACK && !BUGGY_DESCRIPTOR && !DOM_EXCEPTION_HAS_STACK;

// `DOMException` constructor patch for `.stack` where it's required
// https://webidl.spec.whatwg.org/#es-DOMException-specialness
$$9({ global: true, constructor: true, forced: FORCED_CONSTRUCTOR }, { // TODO: fix export logic
  DOMException: FORCED_CONSTRUCTOR ? $DOMException : NativeDOMException
});

var PolyfilledDOMException = getBuiltIn$1(DOM_EXCEPTION$1);
var PolyfilledDOMExceptionPrototype = PolyfilledDOMException.prototype;

if (PolyfilledDOMExceptionPrototype.constructor !== PolyfilledDOMException) {
  {
    defineProperty(PolyfilledDOMExceptionPrototype, 'constructor', createPropertyDescriptor$1(1, PolyfilledDOMException));
  }

  for (var key in DOMExceptionConstants) if (hasOwn$3(DOMExceptionConstants, key)) {
    var constant = DOMExceptionConstants[key];
    var constantName = constant.s;
    if (!hasOwn$3(PolyfilledDOMException, constantName)) {
      defineProperty(PolyfilledDOMException, constantName, createPropertyDescriptor$1(6, constant.c));
    }
  }
}

var getBuiltIn = getBuiltIn$L;
var setToStringTag$2 = setToStringTag$d;

var DOM_EXCEPTION = 'DOMException';

setToStringTag$2(getBuiltIn(DOM_EXCEPTION), DOM_EXCEPTION);

var $$8 = _export;
var global$9 = global$$;
var clearImmediate = task$1.clear;

// `clearImmediate` method
// http://w3c.github.io/setImmediate/#si-clearImmediate
$$8({ global: true, bind: true, enumerable: true, forced: global$9.clearImmediate !== clearImmediate }, {
  clearImmediate: clearImmediate
});

var $$7 = _export;
var global$8 = global$$;
var setImmediate = task$1.set;

// `setImmediate` method
// http://w3c.github.io/setImmediate/#si-setImmediate
$$7({ global: true, bind: true, enumerable: true, forced: global$8.setImmediate !== setImmediate }, {
  setImmediate: setImmediate
});

var $$6 = _export;
var global$7 = global$$;
var microtask = microtask$2;
var aCallable = aCallable$X;
var validateArgumentsLength$4 = validateArgumentsLength$8;
var IS_NODE$1 = engineIsNode;

var process = global$7.process;

// `queueMicrotask` method
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask
$$6({ global: true, enumerable: true, dontCallGetSet: true }, {
  queueMicrotask: function queueMicrotask(fn) {
    validateArgumentsLength$4(arguments.length, 1);
    aCallable(fn);
    var domain = IS_NODE$1 && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});

/* global Deno -- Deno case */

var engineIsDeno = typeof Deno == 'object' && Deno && typeof Deno.version == 'object';

var $$5 = _export;
var global$6 = global$$;
var getBuiltin = getBuiltIn$L;
var uncurryThis$3 = functionUncurryThis;
var fails$1 = fails$1m;
var uid = uid$6;
var isCallable$2 = isCallable$E;
var isConstructor = isConstructor$a;
var isObject$1 = isObject$C;
var isSymbol = isSymbol$7;
var iterate = iterate$J;
var anObject$1 = anObject$1A;
var classof$1 = classof$l;
var hasOwn$2 = hasOwnProperty_1;
var createProperty = createProperty$9;
var createNonEnumerableProperty = createNonEnumerableProperty$i;
var lengthOfArrayLike = lengthOfArrayLike$A;
var validateArgumentsLength$3 = validateArgumentsLength$8;
var getRegExpFlags = regexpGetFlags;
var ERROR_STACK_INSTALLABLE = errorStackInstallable;
var V8 = engineV8Version;
var IS_BROWSER = engineIsBrowser;
var IS_DENO = engineIsDeno;
var IS_NODE = engineIsNode;

var Object$1 = global$6.Object;
var Date$1 = global$6.Date;
var Error$1 = global$6.Error;
var EvalError = global$6.EvalError;
var RangeError$1 = global$6.RangeError;
var ReferenceError = global$6.ReferenceError;
var SyntaxError$1 = global$6.SyntaxError;
var TypeError$3 = global$6.TypeError;
var URIError = global$6.URIError;
var PerformanceMark = global$6.PerformanceMark;
var WebAssembly = global$6.WebAssembly;
var CompileError = WebAssembly && WebAssembly.CompileError || Error$1;
var LinkError = WebAssembly && WebAssembly.LinkError || Error$1;
var RuntimeError = WebAssembly && WebAssembly.RuntimeError || Error$1;
var DOMException = getBuiltin('DOMException');
var Set$1 = getBuiltin('Set');
var Map$1 = getBuiltin('Map');
var MapPrototype = Map$1.prototype;
var mapHas = uncurryThis$3(MapPrototype.has);
var mapGet = uncurryThis$3(MapPrototype.get);
var mapSet = uncurryThis$3(MapPrototype.set);
var setAdd = uncurryThis$3(Set$1.prototype.add);
var objectKeys = getBuiltin('Object', 'keys');
var push$3 = uncurryThis$3([].push);
var booleanValueOf = uncurryThis$3(true.valueOf);
var numberValueOf = uncurryThis$3(1.0.valueOf);
var stringValueOf = uncurryThis$3(''.valueOf);
var getTime = uncurryThis$3(Date$1.prototype.getTime);
var PERFORMANCE_MARK = uid('structuredClone');
var DATA_CLONE_ERROR = 'DataCloneError';
var TRANSFERRING = 'Transferring';

var checkBasicSemantic = function (structuredCloneImplementation) {
  return !fails$1(function () {
    var set1 = new global$6.Set([7]);
    var set2 = structuredCloneImplementation(set1);
    var number = structuredCloneImplementation(Object$1(7));
    return set2 == set1 || !set2.has(7) || typeof number != 'object' || number != 7;
  }) && structuredCloneImplementation;
};

var checkErrorsCloning = function (structuredCloneImplementation, $Error) {
  return !fails$1(function () {
    var error = new $Error();
    var test = structuredCloneImplementation({ a: error, b: error });
    return !(test && test.a === test.b && test.a instanceof $Error && test.a.stack === error.stack);
  });
};

// https://github.com/whatwg/html/pull/5749
var checkNewErrorsCloningSemantic = function (structuredCloneImplementation) {
  return !fails$1(function () {
    var test = structuredCloneImplementation(new global$6.AggregateError([1], PERFORMANCE_MARK, { cause: 3 }));
    return test.name != 'AggregateError' || test.errors[0] != 1 || test.message != PERFORMANCE_MARK || test.cause != 3;
  });
};

// FF94+, Safari 15.4+, Chrome 98+, NodeJS 17.0+, Deno 1.13+
// FF<103 and Safari implementations can't clone errors
// https://bugzilla.mozilla.org/show_bug.cgi?id=1556604
// FF103 can clone errors, but `.stack` of clone is an empty string
// https://bugzilla.mozilla.org/show_bug.cgi?id=1778762
// FF104+ fixed it on usual errors, but not on DOMExceptions
// https://bugzilla.mozilla.org/show_bug.cgi?id=1777321
// Chrome <102 returns `null` if cloned object contains multiple references to one error
// https://bugs.chromium.org/p/v8/issues/detail?id=12542
// NodeJS implementation can't clone DOMExceptions
// https://github.com/nodejs/node/issues/41038
// only FF103+ supports new (html/5749) error cloning semantic
var nativeStructuredClone = global$6.structuredClone;

var FORCED_REPLACEMENT = !checkErrorsCloning(nativeStructuredClone, Error$1)
  || !checkErrorsCloning(nativeStructuredClone, DOMException)
  || !checkNewErrorsCloningSemantic(nativeStructuredClone);

// Chrome 82+, Safari 14.1+, Deno 1.11+
// Chrome 78-81 implementation swaps `.name` and `.message` of cloned `DOMException`
// Chrome returns `null` if cloned object contains multiple references to one error
// Safari 14.1 implementation doesn't clone some `RegExp` flags, so requires a workaround
// Safari implementation can't clone errors
// Deno 1.2-1.10 implementations too naive
// NodeJS 16.0+ does not have `PerformanceMark` constructor
// NodeJS <17.2 structured cloning implementation from `performance.mark` is too naive
// and can't clone, for example, `RegExp` or some boxed primitives
// https://github.com/nodejs/node/issues/40840
// no one of those implementations supports new (html/5749) error cloning semantic
var structuredCloneFromMark = !nativeStructuredClone && checkBasicSemantic(function (value) {
  return new PerformanceMark(PERFORMANCE_MARK, { detail: value }).detail;
});

var nativeRestrictedStructuredClone = checkBasicSemantic(nativeStructuredClone) || structuredCloneFromMark;

var throwUncloneable = function (type) {
  throw new DOMException('Uncloneable type: ' + type, DATA_CLONE_ERROR);
};

var throwUnpolyfillable = function (type, kind) {
  throw new DOMException((kind || 'Cloning') + ' of ' + type + ' cannot be properly polyfilled in this engine', DATA_CLONE_ERROR);
};

var structuredCloneInternal = function (value, map) {
  if (isSymbol(value)) throwUncloneable('Symbol');
  if (!isObject$1(value)) return value;
  // effectively preserves circular references
  if (map) {
    if (mapHas(map, value)) return mapGet(map, value);
  } else map = new Map$1();

  var type = classof$1(value);
  var deep = false;
  var C, name, cloned, dataTransfer, i, length, keys, key, source, target;

  switch (type) {
    case 'Array':
      cloned = [];
      deep = true;
      break;
    case 'Object':
      cloned = {};
      deep = true;
      break;
    case 'Map':
      cloned = new Map$1();
      deep = true;
      break;
    case 'Set':
      cloned = new Set$1();
      deep = true;
      break;
    case 'RegExp':
      // in this block because of a Safari 14.1 bug
      // old FF does not clone regexes passed to the constructor, so get the source and flags directly
      cloned = new RegExp(value.source, getRegExpFlags(value));
      break;
    case 'Error':
      name = value.name;
      switch (name) {
        case 'AggregateError':
          cloned = getBuiltin('AggregateError')([]);
          break;
        case 'EvalError':
          cloned = EvalError();
          break;
        case 'RangeError':
          cloned = RangeError$1();
          break;
        case 'ReferenceError':
          cloned = ReferenceError();
          break;
        case 'SyntaxError':
          cloned = SyntaxError$1();
          break;
        case 'TypeError':
          cloned = TypeError$3();
          break;
        case 'URIError':
          cloned = URIError();
          break;
        case 'CompileError':
          cloned = CompileError();
          break;
        case 'LinkError':
          cloned = LinkError();
          break;
        case 'RuntimeError':
          cloned = RuntimeError();
          break;
        default:
          cloned = Error$1();
      }
      deep = true;
      break;
    case 'DOMException':
      cloned = new DOMException(value.message, value.name);
      deep = true;
      break;
    case 'DataView':
    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
    case 'BigInt64Array':
    case 'BigUint64Array':
      C = global$6[type];
      // in some old engines like Safari 9, typeof C is 'object'
      // on Uint8ClampedArray or some other constructors
      if (!isObject$1(C)) throwUnpolyfillable(type);
      cloned = new C(
        // this is safe, since arraybuffer cannot have circular references
        structuredCloneInternal(value.buffer, map),
        value.byteOffset,
        type === 'DataView' ? value.byteLength : value.length
      );
      break;
    case 'DOMQuad':
      try {
        cloned = new DOMQuad(
          structuredCloneInternal(value.p1, map),
          structuredCloneInternal(value.p2, map),
          structuredCloneInternal(value.p3, map),
          structuredCloneInternal(value.p4, map)
        );
      } catch (error) {
        if (nativeRestrictedStructuredClone) {
          cloned = nativeRestrictedStructuredClone(value);
        } else throwUnpolyfillable(type);
      }
      break;
    case 'FileList':
      C = global$6.DataTransfer;
      if (isConstructor(C)) {
        dataTransfer = new C();
        for (i = 0, length = lengthOfArrayLike(value); i < length; i++) {
          dataTransfer.items.add(structuredCloneInternal(value[i], map));
        }
        cloned = dataTransfer.files;
      } else if (nativeRestrictedStructuredClone) {
        cloned = nativeRestrictedStructuredClone(value);
      } else throwUnpolyfillable(type);
      break;
    case 'ImageData':
      // Safari 9 ImageData is a constructor, but typeof ImageData is 'object'
      try {
        cloned = new ImageData(
          structuredCloneInternal(value.data, map),
          value.width,
          value.height,
          { colorSpace: value.colorSpace }
        );
      } catch (error) {
        if (nativeRestrictedStructuredClone) {
          cloned = nativeRestrictedStructuredClone(value);
        } else throwUnpolyfillable(type);
      } break;
    default:
      if (nativeRestrictedStructuredClone) {
        cloned = nativeRestrictedStructuredClone(value);
      } else switch (type) {
        case 'BigInt':
          // can be a 3rd party polyfill
          cloned = Object$1(value.valueOf());
          break;
        case 'Boolean':
          cloned = Object$1(booleanValueOf(value));
          break;
        case 'Number':
          cloned = Object$1(numberValueOf(value));
          break;
        case 'String':
          cloned = Object$1(stringValueOf(value));
          break;
        case 'Date':
          cloned = new Date$1(getTime(value));
          break;
        case 'ArrayBuffer':
          C = global$6.DataView;
          // `ArrayBuffer#slice` is not available in IE10
          // `ArrayBuffer#slice` and `DataView` are not available in old FF
          if (!C && typeof value.slice != 'function') throwUnpolyfillable(type);
          // detached buffers throws in `DataView` and `.slice`
          try {
            if (typeof value.slice == 'function') {
              cloned = value.slice(0);
            } else {
              length = value.byteLength;
              cloned = new ArrayBuffer(length);
              source = new C(value);
              target = new C(cloned);
              for (i = 0; i < length; i++) {
                target.setUint8(i, source.getUint8(i));
              }
            }
          } catch (error) {
            throw new DOMException('ArrayBuffer is detached', DATA_CLONE_ERROR);
          } break;
        case 'SharedArrayBuffer':
          // SharedArrayBuffer should use shared memory, we can't polyfill it, so return the original
          cloned = value;
          break;
        case 'Blob':
          try {
            cloned = value.slice(0, value.size, value.type);
          } catch (error) {
            throwUnpolyfillable(type);
          } break;
        case 'DOMPoint':
        case 'DOMPointReadOnly':
          C = global$6[type];
          try {
            cloned = C.fromPoint
              ? C.fromPoint(value)
              : new C(value.x, value.y, value.z, value.w);
          } catch (error) {
            throwUnpolyfillable(type);
          } break;
        case 'DOMRect':
        case 'DOMRectReadOnly':
          C = global$6[type];
          try {
            cloned = C.fromRect
              ? C.fromRect(value)
              : new C(value.x, value.y, value.width, value.height);
          } catch (error) {
            throwUnpolyfillable(type);
          } break;
        case 'DOMMatrix':
        case 'DOMMatrixReadOnly':
          C = global$6[type];
          try {
            cloned = C.fromMatrix
              ? C.fromMatrix(value)
              : new C(value);
          } catch (error) {
            throwUnpolyfillable(type);
          } break;
        case 'AudioData':
        case 'VideoFrame':
          if (!isCallable$2(value.clone)) throwUnpolyfillable(type);
          try {
            cloned = value.clone();
          } catch (error) {
            throwUncloneable(type);
          } break;
        case 'File':
          try {
            cloned = new File([value], value.name, value);
          } catch (error) {
            throwUnpolyfillable(type);
          } break;
        case 'CryptoKey':
        case 'GPUCompilationMessage':
        case 'GPUCompilationInfo':
        case 'ImageBitmap':
        case 'RTCCertificate':
        case 'WebAssembly.Module':
          throwUnpolyfillable(type);
          // break omitted
        default:
          throwUncloneable(type);
      }
  }

  mapSet(map, value, cloned);

  if (deep) switch (type) {
    case 'Array':
    case 'Object':
      keys = objectKeys(value);
      for (i = 0, length = lengthOfArrayLike(keys); i < length; i++) {
        key = keys[i];
        createProperty(cloned, key, structuredCloneInternal(value[key], map));
      } break;
    case 'Map':
      value.forEach(function (v, k) {
        mapSet(cloned, structuredCloneInternal(k, map), structuredCloneInternal(v, map));
      });
      break;
    case 'Set':
      value.forEach(function (v) {
        setAdd(cloned, structuredCloneInternal(v, map));
      });
      break;
    case 'Error':
      createNonEnumerableProperty(cloned, 'message', structuredCloneInternal(value.message, map));
      if (hasOwn$2(value, 'cause')) {
        createNonEnumerableProperty(cloned, 'cause', structuredCloneInternal(value.cause, map));
      }
      if (name == 'AggregateError') {
        cloned.errors = structuredCloneInternal(value.errors, map);
      } // break omitted
    case 'DOMException':
      if (ERROR_STACK_INSTALLABLE) {
        createNonEnumerableProperty(cloned, 'stack', structuredCloneInternal(value.stack, map));
      }
  }

  return cloned;
};

var PROPER_TRANSFER = nativeStructuredClone && !fails$1(function () {
  // prevent V8 ArrayBufferDetaching protector cell invalidation and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if ((IS_DENO && V8 > 92) || (IS_NODE && V8 > 94) || (IS_BROWSER && V8 > 97)) return false;
  var buffer = new ArrayBuffer(8);
  var clone = nativeStructuredClone(buffer, { transfer: [buffer] });
  return buffer.byteLength != 0 || clone.byteLength != 8;
});

var tryToTransfer = function (rawTransfer, map) {
  if (!isObject$1(rawTransfer)) throw TypeError$3('Transfer option cannot be converted to a sequence');

  var transfer = [];

  iterate(rawTransfer, function (value) {
    push$3(transfer, anObject$1(value));
  });

  var i = 0;
  var length = lengthOfArrayLike(transfer);
  var value, type, C, transferredArray, transferred, canvas, context;

  if (PROPER_TRANSFER) {
    transferredArray = nativeStructuredClone(transfer, { transfer: transfer });
    while (i < length) mapSet(map, transfer[i], transferredArray[i++]);
  } else while (i < length) {
    value = transfer[i++];
    if (mapHas(map, value)) throw new DOMException('Duplicate transferable', DATA_CLONE_ERROR);

    type = classof$1(value);

    switch (type) {
      case 'ImageBitmap':
        C = global$6.OffscreenCanvas;
        if (!isConstructor(C)) throwUnpolyfillable(type, TRANSFERRING);
        try {
          canvas = new C(value.width, value.height);
          context = canvas.getContext('bitmaprenderer');
          context.transferFromImageBitmap(value);
          transferred = canvas.transferToImageBitmap();
        } catch (error) { /* empty */ }
        break;
      case 'AudioData':
      case 'VideoFrame':
        if (!isCallable$2(value.clone) || !isCallable$2(value.close)) throwUnpolyfillable(type, TRANSFERRING);
        try {
          transferred = value.clone();
          value.close();
        } catch (error) { /* empty */ }
        break;
      case 'ArrayBuffer':
      case 'MessagePort':
      case 'OffscreenCanvas':
      case 'ReadableStream':
      case 'TransformStream':
      case 'WritableStream':
        throwUnpolyfillable(type, TRANSFERRING);
    }

    if (transferred === undefined) throw new DOMException('This object cannot be transferred: ' + type, DATA_CLONE_ERROR);
    mapSet(map, value, transferred);
  }
};

$$5({ global: true, enumerable: true, sham: !PROPER_TRANSFER, forced: FORCED_REPLACEMENT }, {
  structuredClone: function structuredClone(value /* , { transfer } */) {
    var options = validateArgumentsLength$3(arguments.length, 1) > 1 && arguments[1] != null ? anObject$1(arguments[1]) : undefined;
    var transfer = options ? options.transfer : undefined;
    var map;

    if (transfer !== undefined) {
      map = new Map$1();
      tryToTransfer(transfer, map);
    }

    return structuredCloneInternal(value, map);
  }
});

var global$5 = global$$;
var apply = functionApply$1;
var isCallable$1 = isCallable$E;
var userAgent = engineUserAgent;
var arraySlice$1 = arraySlice$c;
var validateArgumentsLength$2 = validateArgumentsLength$8;

var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check
var Function$1 = global$5.Function;

var wrap = function (scheduler) {
  return MSIE ? function (handler, timeout /* , ...arguments */) {
    var boundArgs = validateArgumentsLength$2(arguments.length, 1) > 2;
    var fn = isCallable$1(handler) ? handler : Function$1(handler);
    var args = boundArgs ? arraySlice$1(arguments, 2) : undefined;
    return scheduler(boundArgs ? function () {
      apply(fn, this, args);
    } : fn, timeout);
  } : scheduler;
};

// ie9- setTimeout & setInterval additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
var schedulersFix = {
  // `setTimeout` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
  setTimeout: wrap(global$5.setTimeout),
  // `setInterval` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
  setInterval: wrap(global$5.setInterval)
};

var $$4 = _export;
var global$4 = global$$;
var setInterval = schedulersFix.setInterval;

// ie9- setInterval additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
$$4({ global: true, bind: true, forced: global$4.setInterval !== setInterval }, {
  setInterval: setInterval
});

var $$3 = _export;
var global$3 = global$$;
var setTimeout$1 = schedulersFix.setTimeout;

// ie9- setTimeout additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
$$3({ global: true, bind: true, forced: global$3.setTimeout !== setTimeout$1 }, {
  setTimeout: setTimeout$1
});

var fails = fails$1m;
var wellKnownSymbol$1 = wellKnownSymbol$K;
var IS_PURE = isPure;

var ITERATOR$1 = wellKnownSymbol$1('iterator');

var nativeUrl = !fails(function () {
  // eslint-disable-next-line unicorn/relative-url-style -- required for testing
  var url = new URL('b?a=1&b=2&c=3', 'http://a');
  var searchParams = url.searchParams;
  var result = '';
  url.pathname = 'c%20d';
  searchParams.forEach(function (value, key) {
    searchParams['delete']('b');
    result += key + value;
  });
  return (IS_PURE && !url.toJSON)
    || !searchParams.sort
    || url.href !== 'http://a/c%20d?a=1&c=3'
    || searchParams.get('c') !== '3'
    || String(new URLSearchParams('?a=1')) !== 'a=1'
    || !searchParams[ITERATOR$1]
    // throws in Edge
    || new URL('https://a@b').username !== 'a'
    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
    // not punycoded in Edge
    || new URL('http://тест').host !== 'xn--e1aybc'
    // not escaped in Chrome 62-
    || new URL('http://a#б').hash !== '#%D0%B1'
    // fails in Chrome 66-
    || result !== 'a1c3'
    // throws in Safari
    || new URL('http://x', undefined).host !== 'x';
});

// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var uncurryThis$2 = functionUncurryThis;

var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;

var $RangeError = RangeError;
var exec$1 = uncurryThis$2(regexSeparators.exec);
var floor$1 = Math.floor;
var fromCharCode = String.fromCharCode;
var charCodeAt = uncurryThis$2(''.charCodeAt);
var join$2 = uncurryThis$2([].join);
var push$2 = uncurryThis$2([].push);
var replace$2 = uncurryThis$2(''.replace);
var split$2 = uncurryThis$2(''.split);
var toLowerCase$1 = uncurryThis$2(''.toLowerCase);

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = charCodeAt(string, counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = charCodeAt(string, counter++);
      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
        push$2(output, ((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        push$2(output, value);
        counter--;
      }
    } else {
      push$2(output, value);
    }
  }
  return output;
};

/**
 * Converts a digit/integer into a basic code point.
 */
var digitToBasic = function (digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function (delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor$1(delta / damp) : delta >> 1;
  delta += floor$1(delta / numPoints);
  while (delta > baseMinusTMin * tMax >> 1) {
    delta = floor$1(delta / baseMinusTMin);
    k += base;
  }
  return floor$1(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
var encode = function (input) {
  var output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  input = ucs2decode(input);

  // Cache the length.
  var inputLength = input.length;

  // Initialize the state.
  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue;

  // Handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentValue = input[i];
    if (currentValue < 0x80) {
      push$2(output, fromCharCode(currentValue));
    }
  }

  var basicLength = output.length; // number of basic code points.
  var handledCPCount = basicLength; // number of code points that have been handled;

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    push$2(output, delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor$1((maxInt - delta) / handledCPCountPlusOne)) {
      throw $RangeError(OVERFLOW_ERROR);
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < n && ++delta > maxInt) {
        throw $RangeError(OVERFLOW_ERROR);
      }
      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;
        var k = base;
        while (true) {
          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          push$2(output, fromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor$1(qMinusT / baseMinusT);
          k += base;
        }

        push$2(output, fromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        handledCPCount++;
      }
    }

    delta++;
    n++;
  }
  return join$2(output, '');
};

var stringPunycodeToAscii = function (input) {
  var encoded = [];
  var labels = split$2(replace$2(toLowerCase$1(input), regexSeparators, '\u002E'), '.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    push$2(encoded, exec$1(regexNonASCII, label) ? 'xn--' + encode(label) : label);
  }
  return join$2(encoded, '.');
};

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`

var $$2 = _export;
var global$2 = global$$;
var call$1 = functionCall;
var uncurryThis$1 = functionUncurryThis;
var DESCRIPTORS$1 = descriptors;
var USE_NATIVE_URL$1 = nativeUrl;
var defineBuiltIn$1 = defineBuiltIn$p;
var defineBuiltIns = defineBuiltIns$9;
var setToStringTag$1 = setToStringTag$d;
var createIteratorConstructor = createIteratorConstructor$7;
var InternalStateModule$1 = internalState;
var anInstance$1 = anInstance$d;
var isCallable = isCallable$E;
var hasOwn$1 = hasOwnProperty_1;
var bind$1 = functionBindContext;
var classof = classof$l;
var anObject = anObject$1A;
var isObject = isObject$C;
var $toString$1 = toString$z;
var create = objectCreate$1;
var createPropertyDescriptor = createPropertyDescriptor$c;
var getIterator = getIterator$b;
var getIteratorMethod = getIteratorMethod$9;
var validateArgumentsLength$1 = validateArgumentsLength$8;
var wellKnownSymbol = wellKnownSymbol$K;
var arraySort = arraySort$1;

var ITERATOR = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState$1 = InternalStateModule$1.set;
var getInternalParamsState = InternalStateModule$1.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = InternalStateModule$1.getterFor(URL_SEARCH_PARAMS_ITERATOR);
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Avoid NodeJS experimental warning
var safeGetBuiltIn = function (name) {
  if (!DESCRIPTORS$1) return global$2[name];
  var descriptor = getOwnPropertyDescriptor(global$2, name);
  return descriptor && descriptor.value;
};

var nativeFetch = safeGetBuiltIn('fetch');
var NativeRequest = safeGetBuiltIn('Request');
var Headers = safeGetBuiltIn('Headers');
var RequestPrototype = NativeRequest && NativeRequest.prototype;
var HeadersPrototype = Headers && Headers.prototype;
var RegExp$1 = global$2.RegExp;
var TypeError$2 = global$2.TypeError;
var decodeURIComponent = global$2.decodeURIComponent;
var encodeURIComponent$1 = global$2.encodeURIComponent;
var charAt$1 = uncurryThis$1(''.charAt);
var join$1 = uncurryThis$1([].join);
var push$1 = uncurryThis$1([].push);
var replace$1 = uncurryThis$1(''.replace);
var shift$1 = uncurryThis$1([].shift);
var splice = uncurryThis$1([].splice);
var split$1 = uncurryThis$1(''.split);
var stringSlice$1 = uncurryThis$1(''.slice);

var plus = /\+/g;
var sequences = Array(4);

var percentSequence = function (bytes) {
  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp$1('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
};

var percentDecode = function (sequence) {
  try {
    return decodeURIComponent(sequence);
  } catch (error) {
    return sequence;
  }
};

var deserialize = function (it) {
  var result = replace$1(it, plus, ' ');
  var bytes = 4;
  try {
    return decodeURIComponent(result);
  } catch (error) {
    while (bytes) {
      result = replace$1(result, percentSequence(bytes--), percentDecode);
    }
    return result;
  }
};

var find = /[!'()~]|%20/g;

var replacements = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};

var replacer = function (match) {
  return replacements[match];
};

var serialize = function (it) {
  return replace$1(encodeURIComponent$1(it), find, replacer);
};

var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState$1(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    iterator: getIterator(getInternalParamsState(params).entries),
    kind: kind
  });
}, 'Iterator', function next() {
  var state = getInternalIteratorState(this);
  var kind = state.kind;
  var step = state.iterator.next();
  var entry = step.value;
  if (!step.done) {
    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
  } return step;
}, true);

var URLSearchParamsState = function (init) {
  this.entries = [];
  this.url = null;

  if (init !== undefined) {
    if (isObject(init)) this.parseObject(init);
    else this.parseQuery(typeof init == 'string' ? charAt$1(init, 0) === '?' ? stringSlice$1(init, 1) : init : $toString$1(init));
  }
};

URLSearchParamsState.prototype = {
  type: URL_SEARCH_PARAMS,
  bindURL: function (url) {
    this.url = url;
    this.update();
  },
  parseObject: function (object) {
    var iteratorMethod = getIteratorMethod(object);
    var iterator, next, step, entryIterator, entryNext, first, second;

    if (iteratorMethod) {
      iterator = getIterator(object, iteratorMethod);
      next = iterator.next;
      while (!(step = call$1(next, iterator)).done) {
        entryIterator = getIterator(anObject(step.value));
        entryNext = entryIterator.next;
        if (
          (first = call$1(entryNext, entryIterator)).done ||
          (second = call$1(entryNext, entryIterator)).done ||
          !call$1(entryNext, entryIterator).done
        ) throw TypeError$2('Expected sequence with length 2');
        push$1(this.entries, { key: $toString$1(first.value), value: $toString$1(second.value) });
      }
    } else for (var key in object) if (hasOwn$1(object, key)) {
      push$1(this.entries, { key: key, value: $toString$1(object[key]) });
    }
  },
  parseQuery: function (query) {
    if (query) {
      var attributes = split$1(query, '&');
      var index = 0;
      var attribute, entry;
      while (index < attributes.length) {
        attribute = attributes[index++];
        if (attribute.length) {
          entry = split$1(attribute, '=');
          push$1(this.entries, {
            key: deserialize(shift$1(entry)),
            value: deserialize(join$1(entry, '='))
          });
        }
      }
    }
  },
  serialize: function () {
    var entries = this.entries;
    var result = [];
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      push$1(result, serialize(entry.key) + '=' + serialize(entry.value));
    } return join$1(result, '&');
  },
  update: function () {
    this.entries.length = 0;
    this.parseQuery(this.url.query);
  },
  updateURL: function () {
    if (this.url) this.url.update();
  }
};

// `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
  anInstance$1(this, URLSearchParamsPrototype);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  setInternalState$1(this, new URLSearchParamsState(init));
};

var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

defineBuiltIns(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.append` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    validateArgumentsLength$1(arguments.length, 2);
    var state = getInternalParamsState(this);
    push$1(state.entries, { key: $toString$1(name), value: $toString$1(value) });
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function (name) {
    validateArgumentsLength$1(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var key = $toString$1(name);
    var index = 0;
    while (index < entries.length) {
      if (entries[index].key === key) splice(entries, index, 1);
      else index++;
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    validateArgumentsLength$1(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = $toString$1(name);
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    validateArgumentsLength$1(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = $toString$1(name);
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) push$1(result, entries[index].value);
    }
    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name) {
    validateArgumentsLength$1(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = $toString$1(name);
    var index = 0;
    while (index < entries.length) {
      if (entries[index++].key === key) return true;
    }
    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    validateArgumentsLength$1(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var found = false;
    var key = $toString$1(name);
    var val = $toString$1(value);
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) splice(entries, index--, 1);
        else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) push$1(entries, { key: key, value: val });
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    arraySort(state.entries, function (a, b) {
      return a.key > b.key ? 1 : -1;
    });
    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback /* , thisArg */) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = bind$1(callback, arguments.length > 1 ? arguments[1] : undefined);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, { enumerable: true });

// `URLSearchParams.prototype[@@iterator]` method
defineBuiltIn$1(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries, { name: 'entries' });

// `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
defineBuiltIn$1(URLSearchParamsPrototype, 'toString', function toString() {
  return getInternalParamsState(this).serialize();
}, { enumerable: true });

setToStringTag$1(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

$$2({ global: true, constructor: true, forced: !USE_NATIVE_URL$1 }, {
  URLSearchParams: URLSearchParamsConstructor
});

// Wrap `fetch` and `Request` for correct work with polyfilled `URLSearchParams`
if (!USE_NATIVE_URL$1 && isCallable(Headers)) {
  var headersHas = uncurryThis$1(HeadersPrototype.has);
  var headersSet = uncurryThis$1(HeadersPrototype.set);

  var wrapRequestOptions = function (init) {
    if (isObject(init)) {
      var body = init.body;
      var headers;
      if (classof(body) === URL_SEARCH_PARAMS) {
        headers = init.headers ? new Headers(init.headers) : new Headers();
        if (!headersHas(headers, 'content-type')) {
          headersSet(headers, 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
        return create(init, {
          body: createPropertyDescriptor(0, $toString$1(body)),
          headers: createPropertyDescriptor(0, headers)
        });
      }
    } return init;
  };

  if (isCallable(nativeFetch)) {
    $$2({ global: true, enumerable: true, dontCallGetSet: true, forced: true }, {
      fetch: function fetch(input /* , init */) {
        return nativeFetch(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
      }
    });
  }

  if (isCallable(NativeRequest)) {
    var RequestConstructor = function Request(input /* , init */) {
      anInstance$1(this, RequestPrototype);
      return new NativeRequest(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
    };

    RequestPrototype.constructor = RequestConstructor;
    RequestConstructor.prototype = RequestPrototype;

    $$2({ global: true, constructor: true, dontCallGetSet: true, forced: true }, {
      Request: RequestConstructor
    });
  }
}

var web_urlSearchParams_constructor = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`

var $$1 = _export;
var DESCRIPTORS = descriptors;
var USE_NATIVE_URL = nativeUrl;
var global$1 = global$$;
var bind = functionBindContext;
var uncurryThis = functionUncurryThis;
var defineBuiltIn = defineBuiltIn$p;
var defineBuiltInAccessor = defineBuiltInAccessor$8;
var anInstance = anInstance$d;
var hasOwn = hasOwnProperty_1;
var assign = objectAssign;
var arrayFrom = arrayFrom$1;
var arraySlice = arraySliceSimple;
var codeAt = stringMultibyte.codeAt;
var toASCII = stringPunycodeToAscii;
var $toString = toString$z;
var setToStringTag = setToStringTag$d;
var validateArgumentsLength = validateArgumentsLength$8;
var URLSearchParamsModule = web_urlSearchParams_constructor;
var InternalStateModule = internalState;

var setInternalState = InternalStateModule.set;
var getInternalURLState = InternalStateModule.getterFor('URL');
var URLSearchParams$1 = URLSearchParamsModule.URLSearchParams;
var getInternalSearchParamsState = URLSearchParamsModule.getState;

var NativeURL = global$1.URL;
var TypeError$1 = global$1.TypeError;
var parseInt$1 = global$1.parseInt;
var floor = Math.floor;
var pow = Math.pow;
var charAt = uncurryThis(''.charAt);
var exec = uncurryThis(/./.exec);
var join = uncurryThis([].join);
var numberToString = uncurryThis(1.0.toString);
var pop = uncurryThis([].pop);
var push = uncurryThis([].push);
var replace = uncurryThis(''.replace);
var shift = uncurryThis([].shift);
var split = uncurryThis(''.split);
var stringSlice = uncurryThis(''.slice);
var toLowerCase = uncurryThis(''.toLowerCase);
var unshift = uncurryThis([].unshift);

var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';

var ALPHA = /[a-z]/i;
// eslint-disable-next-line regexp/no-obscure-range -- safe
var ALPHANUMERIC = /[\d+-.a-z]/i;
var DIGIT = /\d/;
var HEX_START = /^0x/i;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\da-f]+$/i;
/* eslint-disable regexp/no-control-character -- safe */
var FORBIDDEN_HOST_CODE_POINT = /[\0\t\n\r #%/:<>?@[\\\]^|]/;
var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\0\t\n\r #/:<>?@[\\\]^|]/;
var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u0020]+|[\u0000-\u0020]+$/g;
var TAB_AND_NEW_LINE = /[\t\n\r]/g;
/* eslint-enable regexp/no-control-character -- safe */
var EOF;

// https://url.spec.whatwg.org/#ipv4-number-parser
var parseIPv4 = function (input) {
  var parts = split(input, '.');
  var partsLength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] == '') {
    parts.length--;
  }
  partsLength = parts.length;
  if (partsLength > 4) return input;
  numbers = [];
  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part == '') return input;
    radix = 10;
    if (part.length > 1 && charAt(part, 0) == '0') {
      radix = exec(HEX_START, part) ? 16 : 8;
      part = stringSlice(part, radix == 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!exec(radix == 10 ? DEC : radix == 8 ? OCT : HEX, part)) return input;
      number = parseInt$1(part, radix);
    }
    push(numbers, number);
  }
  for (index = 0; index < partsLength; index++) {
    number = numbers[index];
    if (index == partsLength - 1) {
      if (number >= pow(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = pop(numbers);
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }
  return ipv4;
};

// https://url.spec.whatwg.org/#concept-ipv6-parser
// eslint-disable-next-line max-statements -- TODO
var parseIPv6 = function (input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

  var chr = function () {
    return charAt(input, pointer);
  };

  if (chr() == ':') {
    if (charAt(input, 1) != ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (chr()) {
    if (pieceIndex == 8) return;
    if (chr() == ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    value = length = 0;
    while (length < 4 && exec(HEX, chr())) {
      value = value * 16 + parseInt$1(chr(), 16);
      pointer++;
      length++;
    }
    if (chr() == '.') {
      if (length == 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;
      while (chr()) {
        ipv4Piece = null;
        if (numbersSeen > 0) {
          if (chr() == '.' && numbersSeen < 4) pointer++;
          else return;
        }
        if (!exec(DIGIT, chr())) return;
        while (exec(DIGIT, chr())) {
          number = parseInt$1(chr(), 10);
          if (ipv4Piece === null) ipv4Piece = number;
          else if (ipv4Piece == 0) return;
          else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
      }
      if (numbersSeen != 4) return;
      break;
    } else if (chr() == ':') {
      pointer++;
      if (!chr()) return;
    } else if (chr()) return;
    address[pieceIndex++] = value;
  }
  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex != 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex != 8) return;
  return address;
};

var findLongestZeroSequence = function (ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }
      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }
  if (currLength > maxLength) {
    maxIndex = currStart;
    maxLength = currLength;
  }
  return maxIndex;
};

// https://url.spec.whatwg.org/#host-serializing
var serializeHost = function (host) {
  var result, index, compress, ignore0;
  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      unshift(result, host % 256);
      host = floor(host / 256);
    } return join(result, '.');
  // ipv6
  } else if (typeof host == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += numberToString(host[index], 16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  } return host;
};

var C0ControlPercentEncodeSet = {};
var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
});
var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
  '#': 1, '?': 1, '{': 1, '}': 1
});
var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
});

var percentEncode = function (chr, set) {
  var code = codeAt(chr, 0);
  return code > 0x20 && code < 0x7F && !hasOwn(set, chr) ? chr : encodeURIComponent(chr);
};

// https://url.spec.whatwg.org/#special-scheme
var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

// https://url.spec.whatwg.org/#windows-drive-letter
var isWindowsDriveLetter = function (string, normalized) {
  var second;
  return string.length == 2 && exec(ALPHA, charAt(string, 0))
    && ((second = charAt(string, 1)) == ':' || (!normalized && second == '|'));
};

// https://url.spec.whatwg.org/#start-with-a-windows-drive-letter
var startsWithWindowsDriveLetter = function (string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(stringSlice(string, 0, 2)) && (
    string.length == 2 ||
    ((third = charAt(string, 2)) === '/' || third === '\\' || third === '?' || third === '#')
  );
};

// https://url.spec.whatwg.org/#single-dot-path-segment
var isSingleDot = function (segment) {
  return segment === '.' || toLowerCase(segment) === '%2e';
};

// https://url.spec.whatwg.org/#double-dot-path-segment
var isDoubleDot = function (segment) {
  segment = toLowerCase(segment);
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// States:
var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {};

var URLState = function (url, isBase, base) {
  var urlString = $toString(url);
  var baseState, failure, searchParams;
  if (isBase) {
    failure = this.parse(urlString);
    if (failure) throw TypeError$1(failure);
    this.searchParams = null;
  } else {
    if (base !== undefined) baseState = new URLState(base, true);
    failure = this.parse(urlString, null, baseState);
    if (failure) throw TypeError$1(failure);
    searchParams = getInternalSearchParamsState(new URLSearchParams$1());
    searchParams.bindURL(this);
    this.searchParams = searchParams;
  }
};

URLState.prototype = {
  type: 'URL',
  // https://url.spec.whatwg.org/#url-parsing
  // eslint-disable-next-line max-statements -- TODO
  parse: function (input, stateOverride, base) {
    var url = this;
    var state = stateOverride || SCHEME_START;
    var pointer = 0;
    var buffer = '';
    var seenAt = false;
    var seenBracket = false;
    var seenPasswordToken = false;
    var codePoints, chr, bufferCodePoints, failure;

    input = $toString(input);

    if (!stateOverride) {
      url.scheme = '';
      url.username = '';
      url.password = '';
      url.host = null;
      url.port = null;
      url.path = [];
      url.query = null;
      url.fragment = null;
      url.cannotBeABaseURL = false;
      input = replace(input, LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
    }

    input = replace(input, TAB_AND_NEW_LINE, '');

    codePoints = arrayFrom(input);

    while (pointer <= codePoints.length) {
      chr = codePoints[pointer];
      switch (state) {
        case SCHEME_START:
          if (chr && exec(ALPHA, chr)) {
            buffer += toLowerCase(chr);
            state = SCHEME;
          } else if (!stateOverride) {
            state = NO_SCHEME;
            continue;
          } else return INVALID_SCHEME;
          break;

        case SCHEME:
          if (chr && (exec(ALPHANUMERIC, chr) || chr == '+' || chr == '-' || chr == '.')) {
            buffer += toLowerCase(chr);
          } else if (chr == ':') {
            if (stateOverride && (
              (url.isSpecial() != hasOwn(specialSchemes, buffer)) ||
              (buffer == 'file' && (url.includesCredentials() || url.port !== null)) ||
              (url.scheme == 'file' && !url.host)
            )) return;
            url.scheme = buffer;
            if (stateOverride) {
              if (url.isSpecial() && specialSchemes[url.scheme] == url.port) url.port = null;
              return;
            }
            buffer = '';
            if (url.scheme == 'file') {
              state = FILE;
            } else if (url.isSpecial() && base && base.scheme == url.scheme) {
              state = SPECIAL_RELATIVE_OR_AUTHORITY;
            } else if (url.isSpecial()) {
              state = SPECIAL_AUTHORITY_SLASHES;
            } else if (codePoints[pointer + 1] == '/') {
              state = PATH_OR_AUTHORITY;
              pointer++;
            } else {
              url.cannotBeABaseURL = true;
              push(url.path, '');
              state = CANNOT_BE_A_BASE_URL_PATH;
            }
          } else if (!stateOverride) {
            buffer = '';
            state = NO_SCHEME;
            pointer = 0;
            continue;
          } else return INVALID_SCHEME;
          break;

        case NO_SCHEME:
          if (!base || (base.cannotBeABaseURL && chr != '#')) return INVALID_SCHEME;
          if (base.cannotBeABaseURL && chr == '#') {
            url.scheme = base.scheme;
            url.path = arraySlice(base.path);
            url.query = base.query;
            url.fragment = '';
            url.cannotBeABaseURL = true;
            state = FRAGMENT;
            break;
          }
          state = base.scheme == 'file' ? FILE : RELATIVE;
          continue;

        case SPECIAL_RELATIVE_OR_AUTHORITY:
          if (chr == '/' && codePoints[pointer + 1] == '/') {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
            pointer++;
          } else {
            state = RELATIVE;
            continue;
          } break;

        case PATH_OR_AUTHORITY:
          if (chr == '/') {
            state = AUTHORITY;
            break;
          } else {
            state = PATH;
            continue;
          }

        case RELATIVE:
          url.scheme = base.scheme;
          if (chr == EOF) {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            url.query = base.query;
          } else if (chr == '/' || (chr == '\\' && url.isSpecial())) {
            state = RELATIVE_SLASH;
          } else if (chr == '?') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            url.query = '';
            state = QUERY;
          } else if (chr == '#') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            url.path.length--;
            state = PATH;
            continue;
          } break;

        case RELATIVE_SLASH:
          if (url.isSpecial() && (chr == '/' || chr == '\\')) {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          } else if (chr == '/') {
            state = AUTHORITY;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            state = PATH;
            continue;
          } break;

        case SPECIAL_AUTHORITY_SLASHES:
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          if (chr != '/' || charAt(buffer, pointer + 1) != '/') continue;
          pointer++;
          break;

        case SPECIAL_AUTHORITY_IGNORE_SLASHES:
          if (chr != '/' && chr != '\\') {
            state = AUTHORITY;
            continue;
          } break;

        case AUTHORITY:
          if (chr == '@') {
            if (seenAt) buffer = '%40' + buffer;
            seenAt = true;
            bufferCodePoints = arrayFrom(buffer);
            for (var i = 0; i < bufferCodePoints.length; i++) {
              var codePoint = bufferCodePoints[i];
              if (codePoint == ':' && !seenPasswordToken) {
                seenPasswordToken = true;
                continue;
              }
              var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
              if (seenPasswordToken) url.password += encodedCodePoints;
              else url.username += encodedCodePoints;
            }
            buffer = '';
          } else if (
            chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
            (chr == '\\' && url.isSpecial())
          ) {
            if (seenAt && buffer == '') return INVALID_AUTHORITY;
            pointer -= arrayFrom(buffer).length + 1;
            buffer = '';
            state = HOST;
          } else buffer += chr;
          break;

        case HOST:
        case HOSTNAME:
          if (stateOverride && url.scheme == 'file') {
            state = FILE_HOST;
            continue;
          } else if (chr == ':' && !seenBracket) {
            if (buffer == '') return INVALID_HOST;
            failure = url.parseHost(buffer);
            if (failure) return failure;
            buffer = '';
            state = PORT;
            if (stateOverride == HOSTNAME) return;
          } else if (
            chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
            (chr == '\\' && url.isSpecial())
          ) {
            if (url.isSpecial() && buffer == '') return INVALID_HOST;
            if (stateOverride && buffer == '' && (url.includesCredentials() || url.port !== null)) return;
            failure = url.parseHost(buffer);
            if (failure) return failure;
            buffer = '';
            state = PATH_START;
            if (stateOverride) return;
            continue;
          } else {
            if (chr == '[') seenBracket = true;
            else if (chr == ']') seenBracket = false;
            buffer += chr;
          } break;

        case PORT:
          if (exec(DIGIT, chr)) {
            buffer += chr;
          } else if (
            chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
            (chr == '\\' && url.isSpecial()) ||
            stateOverride
          ) {
            if (buffer != '') {
              var port = parseInt$1(buffer, 10);
              if (port > 0xFFFF) return INVALID_PORT;
              url.port = (url.isSpecial() && port === specialSchemes[url.scheme]) ? null : port;
              buffer = '';
            }
            if (stateOverride) return;
            state = PATH_START;
            continue;
          } else return INVALID_PORT;
          break;

        case FILE:
          url.scheme = 'file';
          if (chr == '/' || chr == '\\') state = FILE_SLASH;
          else if (base && base.scheme == 'file') {
            if (chr == EOF) {
              url.host = base.host;
              url.path = arraySlice(base.path);
              url.query = base.query;
            } else if (chr == '?') {
              url.host = base.host;
              url.path = arraySlice(base.path);
              url.query = '';
              state = QUERY;
            } else if (chr == '#') {
              url.host = base.host;
              url.path = arraySlice(base.path);
              url.query = base.query;
              url.fragment = '';
              state = FRAGMENT;
            } else {
              if (!startsWithWindowsDriveLetter(join(arraySlice(codePoints, pointer), ''))) {
                url.host = base.host;
                url.path = arraySlice(base.path);
                url.shortenPath();
              }
              state = PATH;
              continue;
            }
          } else {
            state = PATH;
            continue;
          } break;

        case FILE_SLASH:
          if (chr == '/' || chr == '\\') {
            state = FILE_HOST;
            break;
          }
          if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(join(arraySlice(codePoints, pointer), ''))) {
            if (isWindowsDriveLetter(base.path[0], true)) push(url.path, base.path[0]);
            else url.host = base.host;
          }
          state = PATH;
          continue;

        case FILE_HOST:
          if (chr == EOF || chr == '/' || chr == '\\' || chr == '?' || chr == '#') {
            if (!stateOverride && isWindowsDriveLetter(buffer)) {
              state = PATH;
            } else if (buffer == '') {
              url.host = '';
              if (stateOverride) return;
              state = PATH_START;
            } else {
              failure = url.parseHost(buffer);
              if (failure) return failure;
              if (url.host == 'localhost') url.host = '';
              if (stateOverride) return;
              buffer = '';
              state = PATH_START;
            } continue;
          } else buffer += chr;
          break;

        case PATH_START:
          if (url.isSpecial()) {
            state = PATH;
            if (chr != '/' && chr != '\\') continue;
          } else if (!stateOverride && chr == '?') {
            url.query = '';
            state = QUERY;
          } else if (!stateOverride && chr == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (chr != EOF) {
            state = PATH;
            if (chr != '/') continue;
          } break;

        case PATH:
          if (
            chr == EOF || chr == '/' ||
            (chr == '\\' && url.isSpecial()) ||
            (!stateOverride && (chr == '?' || chr == '#'))
          ) {
            if (isDoubleDot(buffer)) {
              url.shortenPath();
              if (chr != '/' && !(chr == '\\' && url.isSpecial())) {
                push(url.path, '');
              }
            } else if (isSingleDot(buffer)) {
              if (chr != '/' && !(chr == '\\' && url.isSpecial())) {
                push(url.path, '');
              }
            } else {
              if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
                if (url.host) url.host = '';
                buffer = charAt(buffer, 0) + ':'; // normalize windows drive letter
              }
              push(url.path, buffer);
            }
            buffer = '';
            if (url.scheme == 'file' && (chr == EOF || chr == '?' || chr == '#')) {
              while (url.path.length > 1 && url.path[0] === '') {
                shift(url.path);
              }
            }
            if (chr == '?') {
              url.query = '';
              state = QUERY;
            } else if (chr == '#') {
              url.fragment = '';
              state = FRAGMENT;
            }
          } else {
            buffer += percentEncode(chr, pathPercentEncodeSet);
          } break;

        case CANNOT_BE_A_BASE_URL_PATH:
          if (chr == '?') {
            url.query = '';
            state = QUERY;
          } else if (chr == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (chr != EOF) {
            url.path[0] += percentEncode(chr, C0ControlPercentEncodeSet);
          } break;

        case QUERY:
          if (!stateOverride && chr == '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (chr != EOF) {
            if (chr == "'" && url.isSpecial()) url.query += '%27';
            else if (chr == '#') url.query += '%23';
            else url.query += percentEncode(chr, C0ControlPercentEncodeSet);
          } break;

        case FRAGMENT:
          if (chr != EOF) url.fragment += percentEncode(chr, fragmentPercentEncodeSet);
          break;
      }

      pointer++;
    }
  },
  // https://url.spec.whatwg.org/#host-parsing
  parseHost: function (input) {
    var result, codePoints, index;
    if (charAt(input, 0) == '[') {
      if (charAt(input, input.length - 1) != ']') return INVALID_HOST;
      result = parseIPv6(stringSlice(input, 1, -1));
      if (!result) return INVALID_HOST;
      this.host = result;
    // opaque host
    } else if (!this.isSpecial()) {
      if (exec(FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT, input)) return INVALID_HOST;
      result = '';
      codePoints = arrayFrom(input);
      for (index = 0; index < codePoints.length; index++) {
        result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
      }
      this.host = result;
    } else {
      input = toASCII(input);
      if (exec(FORBIDDEN_HOST_CODE_POINT, input)) return INVALID_HOST;
      result = parseIPv4(input);
      if (result === null) return INVALID_HOST;
      this.host = result;
    }
  },
  // https://url.spec.whatwg.org/#cannot-have-a-username-password-port
  cannotHaveUsernamePasswordPort: function () {
    return !this.host || this.cannotBeABaseURL || this.scheme == 'file';
  },
  // https://url.spec.whatwg.org/#include-credentials
  includesCredentials: function () {
    return this.username != '' || this.password != '';
  },
  // https://url.spec.whatwg.org/#is-special
  isSpecial: function () {
    return hasOwn(specialSchemes, this.scheme);
  },
  // https://url.spec.whatwg.org/#shorten-a-urls-path
  shortenPath: function () {
    var path = this.path;
    var pathSize = path.length;
    if (pathSize && (this.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
      path.length--;
    }
  },
  // https://url.spec.whatwg.org/#concept-url-serializer
  serialize: function () {
    var url = this;
    var scheme = url.scheme;
    var username = url.username;
    var password = url.password;
    var host = url.host;
    var port = url.port;
    var path = url.path;
    var query = url.query;
    var fragment = url.fragment;
    var output = scheme + ':';
    if (host !== null) {
      output += '//';
      if (url.includesCredentials()) {
        output += username + (password ? ':' + password : '') + '@';
      }
      output += serializeHost(host);
      if (port !== null) output += ':' + port;
    } else if (scheme == 'file') output += '//';
    output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
    if (query !== null) output += '?' + query;
    if (fragment !== null) output += '#' + fragment;
    return output;
  },
  // https://url.spec.whatwg.org/#dom-url-href
  setHref: function (href) {
    var failure = this.parse(href);
    if (failure) throw TypeError$1(failure);
    this.searchParams.update();
  },
  // https://url.spec.whatwg.org/#dom-url-origin
  getOrigin: function () {
    var scheme = this.scheme;
    var port = this.port;
    if (scheme == 'blob') try {
      return new URLConstructor(scheme.path[0]).origin;
    } catch (error) {
      return 'null';
    }
    if (scheme == 'file' || !this.isSpecial()) return 'null';
    return scheme + '://' + serializeHost(this.host) + (port !== null ? ':' + port : '');
  },
  // https://url.spec.whatwg.org/#dom-url-protocol
  getProtocol: function () {
    return this.scheme + ':';
  },
  setProtocol: function (protocol) {
    this.parse($toString(protocol) + ':', SCHEME_START);
  },
  // https://url.spec.whatwg.org/#dom-url-username
  getUsername: function () {
    return this.username;
  },
  setUsername: function (username) {
    var codePoints = arrayFrom($toString(username));
    if (this.cannotHaveUsernamePasswordPort()) return;
    this.username = '';
    for (var i = 0; i < codePoints.length; i++) {
      this.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
    }
  },
  // https://url.spec.whatwg.org/#dom-url-password
  getPassword: function () {
    return this.password;
  },
  setPassword: function (password) {
    var codePoints = arrayFrom($toString(password));
    if (this.cannotHaveUsernamePasswordPort()) return;
    this.password = '';
    for (var i = 0; i < codePoints.length; i++) {
      this.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
    }
  },
  // https://url.spec.whatwg.org/#dom-url-host
  getHost: function () {
    var host = this.host;
    var port = this.port;
    return host === null ? ''
      : port === null ? serializeHost(host)
      : serializeHost(host) + ':' + port;
  },
  setHost: function (host) {
    if (this.cannotBeABaseURL) return;
    this.parse(host, HOST);
  },
  // https://url.spec.whatwg.org/#dom-url-hostname
  getHostname: function () {
    var host = this.host;
    return host === null ? '' : serializeHost(host);
  },
  setHostname: function (hostname) {
    if (this.cannotBeABaseURL) return;
    this.parse(hostname, HOSTNAME);
  },
  // https://url.spec.whatwg.org/#dom-url-port
  getPort: function () {
    var port = this.port;
    return port === null ? '' : $toString(port);
  },
  setPort: function (port) {
    if (this.cannotHaveUsernamePasswordPort()) return;
    port = $toString(port);
    if (port == '') this.port = null;
    else this.parse(port, PORT);
  },
  // https://url.spec.whatwg.org/#dom-url-pathname
  getPathname: function () {
    var path = this.path;
    return this.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
  },
  setPathname: function (pathname) {
    if (this.cannotBeABaseURL) return;
    this.path = [];
    this.parse(pathname, PATH_START);
  },
  // https://url.spec.whatwg.org/#dom-url-search
  getSearch: function () {
    var query = this.query;
    return query ? '?' + query : '';
  },
  setSearch: function (search) {
    search = $toString(search);
    if (search == '') {
      this.query = null;
    } else {
      if ('?' == charAt(search, 0)) search = stringSlice(search, 1);
      this.query = '';
      this.parse(search, QUERY);
    }
    this.searchParams.update();
  },
  // https://url.spec.whatwg.org/#dom-url-searchparams
  getSearchParams: function () {
    return this.searchParams.facade;
  },
  // https://url.spec.whatwg.org/#dom-url-hash
  getHash: function () {
    var fragment = this.fragment;
    return fragment ? '#' + fragment : '';
  },
  setHash: function (hash) {
    hash = $toString(hash);
    if (hash == '') {
      this.fragment = null;
      return;
    }
    if ('#' == charAt(hash, 0)) hash = stringSlice(hash, 1);
    this.fragment = '';
    this.parse(hash, FRAGMENT);
  },
  update: function () {
    this.query = this.searchParams.serialize() || null;
  }
};

// `URL` constructor
// https://url.spec.whatwg.org/#url-class
var URLConstructor = function URL(url /* , base */) {
  var that = anInstance(this, URLPrototype);
  var base = validateArgumentsLength(arguments.length, 1) > 1 ? arguments[1] : undefined;
  var state = setInternalState(that, new URLState(url, false, base));
  if (!DESCRIPTORS) {
    that.href = state.serialize();
    that.origin = state.getOrigin();
    that.protocol = state.getProtocol();
    that.username = state.getUsername();
    that.password = state.getPassword();
    that.host = state.getHost();
    that.hostname = state.getHostname();
    that.port = state.getPort();
    that.pathname = state.getPathname();
    that.search = state.getSearch();
    that.searchParams = state.getSearchParams();
    that.hash = state.getHash();
  }
};

var URLPrototype = URLConstructor.prototype;

var accessorDescriptor = function (getter, setter) {
  return {
    get: function () {
      return getInternalURLState(this)[getter]();
    },
    set: setter && function (value) {
      return getInternalURLState(this)[setter](value);
    },
    configurable: true,
    enumerable: true
  };
};

if (DESCRIPTORS) {
  // `URL.prototype.href` accessors pair
  // https://url.spec.whatwg.org/#dom-url-href
  defineBuiltInAccessor(URLPrototype, 'href', accessorDescriptor('serialize', 'setHref'));
  // `URL.prototype.origin` getter
  // https://url.spec.whatwg.org/#dom-url-origin
  defineBuiltInAccessor(URLPrototype, 'origin', accessorDescriptor('getOrigin'));
  // `URL.prototype.protocol` accessors pair
  // https://url.spec.whatwg.org/#dom-url-protocol
  defineBuiltInAccessor(URLPrototype, 'protocol', accessorDescriptor('getProtocol', 'setProtocol'));
  // `URL.prototype.username` accessors pair
  // https://url.spec.whatwg.org/#dom-url-username
  defineBuiltInAccessor(URLPrototype, 'username', accessorDescriptor('getUsername', 'setUsername'));
  // `URL.prototype.password` accessors pair
  // https://url.spec.whatwg.org/#dom-url-password
  defineBuiltInAccessor(URLPrototype, 'password', accessorDescriptor('getPassword', 'setPassword'));
  // `URL.prototype.host` accessors pair
  // https://url.spec.whatwg.org/#dom-url-host
  defineBuiltInAccessor(URLPrototype, 'host', accessorDescriptor('getHost', 'setHost'));
  // `URL.prototype.hostname` accessors pair
  // https://url.spec.whatwg.org/#dom-url-hostname
  defineBuiltInAccessor(URLPrototype, 'hostname', accessorDescriptor('getHostname', 'setHostname'));
  // `URL.prototype.port` accessors pair
  // https://url.spec.whatwg.org/#dom-url-port
  defineBuiltInAccessor(URLPrototype, 'port', accessorDescriptor('getPort', 'setPort'));
  // `URL.prototype.pathname` accessors pair
  // https://url.spec.whatwg.org/#dom-url-pathname
  defineBuiltInAccessor(URLPrototype, 'pathname', accessorDescriptor('getPathname', 'setPathname'));
  // `URL.prototype.search` accessors pair
  // https://url.spec.whatwg.org/#dom-url-search
  defineBuiltInAccessor(URLPrototype, 'search', accessorDescriptor('getSearch', 'setSearch'));
  // `URL.prototype.searchParams` getter
  // https://url.spec.whatwg.org/#dom-url-searchparams
  defineBuiltInAccessor(URLPrototype, 'searchParams', accessorDescriptor('getSearchParams'));
  // `URL.prototype.hash` accessors pair
  // https://url.spec.whatwg.org/#dom-url-hash
  defineBuiltInAccessor(URLPrototype, 'hash', accessorDescriptor('getHash', 'setHash'));
}

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
defineBuiltIn(URLPrototype, 'toJSON', function toJSON() {
  return getInternalURLState(this).serialize();
}, { enumerable: true });

// `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior
defineBuiltIn(URLPrototype, 'toString', function toString() {
  return getInternalURLState(this).serialize();
}, { enumerable: true });

if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
  // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  if (nativeCreateObjectURL) defineBuiltIn(URLConstructor, 'createObjectURL', bind(nativeCreateObjectURL, NativeURL));
  // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  if (nativeRevokeObjectURL) defineBuiltIn(URLConstructor, 'revokeObjectURL', bind(nativeRevokeObjectURL, NativeURL));
}

setToStringTag(URLConstructor, 'URL');

$$1({ global: true, constructor: true, forced: !USE_NATIVE_URL, sham: !DESCRIPTORS }, {
  URL: URLConstructor
});

var $ = _export;
var call = functionCall;

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
$({ target: 'URL', proto: true, enumerable: true }, {
  toJSON: function toJSON() {
    return call(URL.prototype.toString, this);
  }
});

(function (module) {
	module.exports = path$1;
} (full));

(function (module) {
	module.exports = full.exports;
} (features));

(function (module) {
	module.exports = features.exports;
} (coreJs));
