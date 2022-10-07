import { extname, isAbsolute } from 'path';
import { version } from 'process';
import { pathToFileURL } from 'url';
import * as rollup from '../../src/node-entry';
import type { MergedRollupOptions } from '../../src/rollup/types';
import { bold } from '../../src/utils/colors';
import { error } from '../../src/utils/error';
import { mergeOptions } from '../../src/utils/options/mergeOptions';
import type { GenericConfigObject } from '../../src/utils/options/options';
import relativeId from '../../src/utils/relativeId';
import { stderr } from '../logging';
import batchWarnings, { type BatchWarnings } from './batchWarnings';
import { addCommandPluginsToInputOptions, addPluginsFromCommandOption } from './commandPlugins';

function supportsNativeESM(): boolean {
	return Number(/^v(\d+)/.exec(version)![1]) >= 13;
}

interface NodeModuleWithCompile extends NodeModule {
	_compile(code: string, filename: string): any;
}

export default async function loadAndParseConfigFile(
	fileName: string,
	commandOptions: any = {}
): Promise<{ options: MergedRollupOptions[]; warnings: BatchWarnings }> {
	// 读取自定义配置文件的内容
	// 可能指定多个配置，因此 configs 是数组 GenericConfigObject[]
	const configs = await loadConfigFile(fileName, commandOptions);
	// console.log('[DEBUG]: 自定义配置文件内容', configs);

	// 警告信息对象
	const warnings = batchWarnings();
	try {
		// 存储规范化处理后的配置对象
		const normalizedConfigs: MergedRollupOptions[] = [];

		// 遍历配置
		for (const config of configs) {
			// 合并选项：自定义配置文件中的选项 与 命令行中的配置项进行合并
			const options = mergeOptions(config, commandOptions, warnings.add);
			// 将命令行参数参数中指定的 plugin 参数合并入 options.plugins 中
			// 同时一些特殊的配置项，也需要添加对应的插件入 options.plugins
			await addCommandPluginsToInputOptions(options, commandOptions);
			normalizedConfigs.push(options);
		}

		return { options: normalizedConfigs, warnings };
	} catch (err) {
		warnings.flush();
		throw err;
	}
}

async function loadConfigFile(
	fileName: string,
	commandOptions: Record<string, unknown>
): Promise<GenericConfigObject[]> {
	const extension = extname(fileName);

	// 1. rollup.config.js ==> getDefaultFromTranspiledConfigFile(fileName, commandOptions)
	// 2. rollup.config.cjs ===> getDefaultFromCjs(require(fileName))
	// 3. rollup.config.mjs  ===> import(pathToFileURL(fileName).href)).default
	// 4. 只要配置了 configPlugin ===> getDefaultFromTranspiledConfigFile(fileName, commandOptions)

	const configFileExport =
		commandOptions.configPlugin ||
		!(extension === '.cjs' || (extension === '.mjs' && supportsNativeESM()))
			? await getDefaultFromTranspiledConfigFile(fileName, commandOptions)
			: extension === '.cjs'
			? getDefaultFromCjs(require(fileName))
			: (await import(pathToFileURL(fileName).href)).default;
	console.log('[DEBUG]: configFileExport', configFileExport);

	// configFileExport 是文件导出的内容，可能是 对象 也可能是一个 函数
	return getConfigList(configFileExport, commandOptions);
}

function getDefaultFromCjs(namespace: GenericConfigObject): unknown {
	return namespace.__esModule ? namespace.default : namespace;
}

async function getDefaultFromTranspiledConfigFile(
	fileName: string,
	commandOptions: Record<string, unknown>
): Promise<unknown> {
	const warnings = batchWarnings();
	const inputOptions = {
		external: (id: string) =>
			(id[0] !== '.' && !isAbsolute(id)) || id.slice(-5, id.length) === '.json',
		input: fileName,
		onwarn: warnings.add,
		plugins: [],
		treeshake: false
	};
	await addPluginsFromCommandOption(commandOptions.configPlugin, inputOptions);
	const bundle = await rollup.rollup(inputOptions);
	if (!commandOptions.silent && warnings.count > 0) {
		stderr(bold(`loaded ${relativeId(fileName)} with warnings`));
		warnings.flush();
	}
	const {
		output: [{ code }]
	} = await bundle.generate({
		exports: 'named',
		format: 'cjs',
		plugins: [
			{
				name: 'transpile-import-meta',
				resolveImportMeta(property, { moduleId }) {
					if (property === 'url') {
						return `'${pathToFileURL(moduleId).href}'`;
					}
					if (property == null) {
						return `{url:'${pathToFileURL(moduleId).href}'}`;
					}
				}
			}
		]
	});
	return loadConfigFromBundledFile(fileName, code);
}

function loadConfigFromBundledFile(fileName: string, bundledCode: string): unknown {
	const resolvedFileName = require.resolve(fileName);
	const extension = extname(resolvedFileName);
	const defaultLoader = require.extensions[extension];
	require.extensions[extension] = (module: NodeModule, requiredFileName: string) => {
		if (requiredFileName === resolvedFileName) {
			(module as NodeModuleWithCompile)._compile(bundledCode, requiredFileName);
		} else {
			if (defaultLoader) {
				defaultLoader(module, requiredFileName);
			}
		}
	};
	delete require.cache[resolvedFileName];
	try {
		const config = getDefaultFromCjs(require(fileName));
		require.extensions[extension] = defaultLoader;
		return config;
	} catch (err: any) {
		if (err.code === 'ERR_REQUIRE_ESM') {
			return error({
				code: 'TRANSPILED_ESM_CONFIG',
				message: `While loading the Rollup configuration from "${relativeId(
					fileName
				)}", Node tried to require an ES module from a CommonJS file, which is not supported. A common cause is if there is a package.json file with "type": "module" in the same folder. You can try to fix this by changing the extension of your configuration file to ".cjs" or ".mjs" depending on the content, which will prevent Rollup from trying to preprocess the file but rather hand it to Node directly.`,
				url: 'https://rollupjs.org/guide/en/#using-untranspiled-config-files'
			});
		}
		throw err;
	}
}

async function getConfigList(configFileExport: any, commandOptions: any): Promise<any[]> {
	// configFileExport 可能是 函数  也可能是 对象，还可能是其他
	// 这里就告诉我们其实 rollup.config.js 中是可以导出一个函数的，函数的入参就是命令行参数对象
	const config = await (typeof configFileExport === 'function'
		? configFileExport(commandOptions)
		: configFileExport);
	if (Object.keys(config).length === 0) {
		return error({
			code: 'MISSING_CONFIG',
			message: 'Config file must export an options object, or an array of options objects',
			url: 'https://rollupjs.org/guide/en/#configuration-files'
		});
	}
	// 统一返回的是数组，因为有多入口同时打包的情况
	return Array.isArray(config) ? config : [config];
}
