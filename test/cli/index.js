const assert = require('assert');
const { exec } = require('child_process');
const { existsSync, readFileSync } = require('fs');
const { basename, resolve, sep } = require('path');
const process = require('process');
const { copySync, removeSync, statSync } = require('fs-extra');
const {
	normaliseOutput,
	runTestSuiteWithSamples,
	assertDirectoriesAreEqual,
	getFileNamesAndRemoveOutput
} = require('../utils.js');

const cwd = process.cwd();

removeSync(resolve(__dirname, 'node_modules'));
copySync(resolve(__dirname, 'node_modules_rename_me'), resolve(__dirname, 'node_modules'));

runTestSuiteWithSamples(
	'cli',
	resolve(__dirname, 'samples'),
	(dir, config) => {
		// allow to repeat flaky tests for debugging on CLI
		for (let pass = 0; pass < (config.repeat || 1); pass++) {
			runTest(dir, config, pass);
		}
	},
	() => process.chdir(cwd)
);

function runTest(dir, config, pass) {
	const name = basename(dir) + ': ' + config.description;
	(config.skip ? it.skip : config.solo ? it.only : it)(
		pass > 0 ? `${name} (pass ${pass + 1})` : name,
		done => {
			process.chdir(config.cwd || dir);
			if (pass > 0) {
				getFileNamesAndRemoveOutput(dir);
			}
			const command = config.command.replace(
				/(^| )rollup($| )/g,
				`node ${resolve(__dirname, '../../dist/bin')}${sep}rollup `
			);

			Promise.resolve(config.before && config.before()).then(() => {
				const childProcess = exec(
					command,
					{
						timeout: 40000,
						env: { ...process.env, FORCE_COLOR: '0', ...config.env }
					},
					(err, code, stderr) => {
						if (config.after) config.after(err, code, stderr);
						if (err && !err.killed) {
							if (config.error) {
								const shouldContinue = config.error(err);
								if (!shouldContinue) return done();
							} else {
								throw err;
							}
						}

						if ('stderr' in config) {
							const shouldContinue = config.stderr(stderr);
							if (!shouldContinue) return done();
						} else if (stderr) {
							console.error(stderr);
						}

						let unintendedError;

						if (config.execute) {
							try {
								const fn = new Function('require', 'module', 'exports', 'assert', code);
								const module = {
									exports: {}
								};
								fn(require, module, module.exports, assert);

								if (config.error) {
									unintendedError = new Error('Expected an error while executing output');
								}

								if (config.exports) {
									config.exports(module.exports);
								}
							} catch (err) {
								if (config.error) {
									config.error(err);
								} else {
									unintendedError = err;
								}
							}

							if (config.show || unintendedError) {
								console.log(code + '\n\n\n');
							}

							if (config.solo) console.groupEnd();

							unintendedError ? done(unintendedError) : done();
						} else if (config.result) {
							try {
								config.result(code);
								done();
							} catch (err) {
								done(err);
							}
						} else if (config.test) {
							try {
								config.test();
								done();
							} catch (err) {
								done(err);
							}
						} else if (existsSync('_expected') && statSync('_expected').isDirectory()) {
							try {
								assertDirectoriesAreEqual('_actual', '_expected');
								done();
							} catch (err) {
								done(err);
							}
						} else {
							const expected = readFileSync('_expected.js', 'utf8');
							try {
								assert.equal(normaliseOutput(code), normaliseOutput(expected));
								done();
							} catch (err) {
								done(err);
							}
						}
					}
				);

				childProcess.stderr.on('data', async data => {
					if (config.abortOnStderr) {
						try {
							if (await config.abortOnStderr(data)) {
								childProcess.kill('SIGTERM');
							}
						} catch (err) {
							childProcess.kill('SIGTERM');
							done(err);
						}
					}
				});
			});
		}
	).timeout(50000);
}
