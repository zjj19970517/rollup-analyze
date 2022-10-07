const assert = require('assert');
const {
	closeSync,
	fsyncSync,
	openSync,
	readdirSync,
	renameSync,
	unlinkSync,
	writeFileSync,
	writeSync
} = require('fs');
const { basename, join } = require('path');
const { platform, version } = require('process');
const fixturify = require('fixturify');
const { removeSync } = require('fs-extra');

exports.wait = function wait(ms) {
	return new Promise(fulfil => {
		setTimeout(fulfil, ms);
	});
};

function normaliseError(error) {
	delete error.stack;
	delete error.toString;
	if (error.watchFiles) {
		error.watchFiles.sort();
	}
	return { ...error, message: error.message };
}

exports.compareError = function compareError(actual, expected) {
	actual = normaliseError(actual);

	if (actual.parserError) {
		actual.parserError = normaliseError(actual.parserError);
	}

	if (actual.frame) {
		actual.frame = actual.frame.replace(/\s+$/gm, '');
	}

	if (expected.frame) {
		expected.frame = deindent(expected.frame);
	}

	assert.deepEqual(actual, expected);
};

exports.compareWarnings = function compareWarnings(actual, expected) {
	assert.deepEqual(
		actual.map(warning => {
			const clone = { ...warning };
			delete clone.toString;

			if (clone.frame) {
				clone.frame = clone.frame.replace(/\s+$/gm, '');
			}

			return clone;
		}),
		expected.map(warning => {
			if (warning.frame) {
				warning.frame = deindent(warning.frame);
			}
			return warning;
		})
	);
};

function deindent(str) {
	return str.slice(1).replace(/^\t+/gm, '').replace(/\s+$/gm, '').trim();
}

exports.deindent = deindent;

exports.executeBundle = async function executeBundle(bundle, require) {
	const {
		output: [cjs]
	} = await bundle.generate({
		exports: 'auto',
		format: 'cjs'
	});
	const wrapper = new Function('module', 'exports', 'require', cjs.code);
	const module = { exports: {} };
	wrapper(module, module.exports, require);
	return module.exports;
};

exports.getObject = function getObject(entries) {
	const object = {};
	for (const [key, value] of entries) {
		object[key] = value;
	}
	return object;
};

exports.loader = function loader(modules) {
	modules = Object.assign(Object.create(null), modules);
	return {
		resolveId(id) {
			return id in modules ? id : null;
		},

		load(id) {
			return modules[id];
		}
	};
};

exports.normaliseOutput = function normaliseOutput(code) {
	return code.toString().trim().replace(/\r\n/g, '\n');
};

function runTestSuiteWithSamples(suiteName, samplesDir, runTest, onTeardown) {
	describe(suiteName, () => runSamples(samplesDir, runTest, onTeardown));
}

// You can run only or skip certain kinds of tests by appending .only or .skip
runTestSuiteWithSamples.only = function (suiteName, samplesDir, runTest, onTeardown) {
	describe.only(suiteName, () => runSamples(samplesDir, runTest, onTeardown));
};

runTestSuiteWithSamples.skip = function (suiteName) {
	describe.skip(suiteName, () => {});
};

exports.runTestSuiteWithSamples = runTestSuiteWithSamples;

function runSamples(samplesDir, runTest, onTeardown) {
	if (onTeardown) {
		afterEach(onTeardown);
	}

	readdirSync(samplesDir)
		.filter(name => name[0] !== '.')
		.sort()
		.forEach(fileName => runTestsInDir(join(samplesDir, fileName), runTest));
}

function runTestsInDir(dir, runTest) {
	const fileNames = getFileNamesAndRemoveOutput(dir);
	if (fileNames.includes('_config.js')) {
		loadConfigAndRunTest(dir, runTest);
	} else if (fileNames.length === 0) {
		console.warn(`Removing empty test directory ${dir}`);
		removeSync(dir);
	} else {
		describe(basename(dir), () => {
			fileNames
				.filter(name => name[0] !== '.')
				.sort()
				.forEach(fileName => runTestsInDir(join(dir, fileName), runTest));
		});
	}
}

function getFileNamesAndRemoveOutput(dir) {
	try {
		return readdirSync(dir).filter(fileName => {
			if (fileName === '_actual') {
				removeSync(join(dir, '_actual'));
				return false;
			}
			if (fileName === '_actual.js') {
				unlinkSync(join(dir, '_actual.js'));
				return false;
			}
			return true;
		});
	} catch (error) {
		if (error.code === 'ENOTDIR') {
			throw new Error(
				`${dir} is not located next to a "_config.js" file but is not a directory or old test output either. Please inspect and consider removing the file.`
			);
		}
		throw error;
	}
}

exports.getFileNamesAndRemoveOutput = getFileNamesAndRemoveOutput;

function loadConfigAndRunTest(dir, runTest) {
	const configFile = join(dir, '_config.js');
	const config = require(configFile);
	if (!config || !config.description) {
		throw new Error(`Found invalid config without description: ${configFile}`);
	}
	if (
		(!config.skipIfWindows || platform !== 'win32') &&
		(!config.onlyWindows || platform === 'win32') &&
		(!config.minNodeVersion || config.minNodeVersion <= Number(/^v(\d+)/.exec(version)[1]))
	) {
		runTest(dir, config);
	}
}

exports.assertDirectoriesAreEqual = function assertDirectoriesAreEqual(actualDir, expectedDir) {
	const actualFiles = fixturify.readSync(actualDir);

	let expectedFiles;
	try {
		expectedFiles = fixturify.readSync(expectedDir);
	} catch (err) {
		expectedFiles = [];
	}
	assertFilesAreEqual(actualFiles, expectedFiles);
};

function assertFilesAreEqual(actualFiles, expectedFiles, dirs = []) {
	Object.keys({ ...actualFiles, ...expectedFiles }).forEach(fileName => {
		const pathSegments = dirs.concat(fileName);
		if (typeof actualFiles[fileName] === 'object' && typeof expectedFiles[fileName] === 'object') {
			return assertFilesAreEqual(actualFiles[fileName], expectedFiles[fileName], pathSegments);
		}

		const shortName = pathSegments.join('/');
		assert.strictEqual(
			`${shortName}: ${actualFiles[fileName]}`,
			`${shortName}: ${expectedFiles[fileName]}`
		);
	});
}

exports.assertFilesAreEqual = assertFilesAreEqual;

exports.assertIncludes = function assertIncludes(actual, expected) {
	try {
		assert.ok(
			actual.includes(expected),
			`${JSON.stringify(actual)}\nshould include\n${JSON.stringify(expected)}`
		);
	} catch (err) {
		err.actual = actual;
		err.expected = expected;
		throw err;
	}
};

exports.assertDoesNotInclude = function assertDoesNotInclude(actual, expected) {
	try {
		assert.ok(
			!actual.includes(expected),
			`${JSON.stringify(actual)}\nshould not include\n${JSON.stringify(expected)}`
		);
	} catch (err) {
		err.actual = actual;
		err.expected = expected;
		throw err;
	}
};

// Workaround a race condition in fs.writeFileSync that temporarily creates
// an empty file for a brief moment which may be read by rollup watch - even
// if the content being overwritten is identical.
function atomicWriteFileSync(filePath, contents) {
	const stagingPath = filePath + '_';
	writeFileSync(stagingPath, contents);
	renameSync(stagingPath, filePath);
}

exports.atomicWriteFileSync = atomicWriteFileSync;

// It appears that on MacOS, it sometimes takes long for the file system to update
exports.writeAndSync = function writeAndSync(filePath, contents) {
	const file = openSync(filePath, 'w');
	writeSync(file, contents);
	fsyncSync(file);
	closeSync(file);
};

// Sometimes, watchers on MacOS do not seem to fire. In those cases, it helps
// to write the same content again. This function returns a callback to stop
// further updates.
function writeAndRetry(filePath, contents) {
	let retries = 0;
	let updateRetryTimeout;

	const writeFile = () => {
		if (retries > 0) {
			console.error(`RETRIED writeFile (${retries})`);
		}
		retries++;
		atomicWriteFileSync(filePath, contents);
		updateRetryTimeout = setTimeout(writeFile, 1000);
	};

	writeFile();
	return () => clearTimeout(updateRetryTimeout);
}

exports.writeAndRetry = writeAndRetry;
