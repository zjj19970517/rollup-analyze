import { env } from 'process';
import type { MergedRollupOptions } from '../../src/rollup/types';
import { isWatchEnabled } from '../../src/utils/options/mergeOptions';
import { getAliasName } from '../../src/utils/relativeId';
import { loadFsEvents } from '../../src/watch/fsevents-importer';
import { handleError } from '../logging';
import type { BatchWarnings } from './batchWarnings';
import build from './build';
import { getConfigPath } from './getConfigPath';
import loadAndParseConfigFile from './loadConfigFile';
import loadConfigFromCommand from './loadConfigFromCommand';

export default async function runRollup(command: Record<string, any>): Promise<void> {
	let inputSource;
	if (command._.length > 0) {
		// 当前情况下是：rollup main.js
		// command { _: [ 'main.js' ] }
		if (command.input) {
			// 处理 rollup index.js -i main.js 这种异常情况
			handleError({
				code: 'DUPLICATE_IMPORT_OPTIONS',
				message: 'Either use --input, or pass input path as argument'
			});
		}
		// 源码输入入口
		inputSource = command._;
	} else if (typeof command.input === 'string') {
		// 处理只有一个 input 的情况 rollup --input src/entry1.js
		inputSource = [command.input];
	} else {
		// 处理只有多个 input 的情况 rollup --input src/entry1.js --input src/entry2.js
		inputSource = command.input;
	}

	// 最终的 inputSource 是一个数组

	if (inputSource && inputSource.length > 0) {
		if (inputSource.some((input: string) => input.includes('='))) {
			// 如果存在 = 的情况：rollup main=src/entry1.js other=src/entry2.js
			// 入口包含命名的情况，以对象的形式进行存储
			command.input = {};
			inputSource.forEach((input: string) => {
				const equalsIndex = input.indexOf('=');
				const value = input.substring(equalsIndex + 1);
				const key = input.substring(0, equalsIndex) || getAliasName(input);
				command.input[key] = value;
			});
		} else {
			// 不存在 = 的情况
			command.input = inputSource;
		}
	}

	// 处理命令行参数 environment
	// 指定环境变量值
	if (command.environment) {
		const environment = Array.isArray(command.environment)
			? command.environment
			: [command.environment];

		// rollup --environment INCLUDE_DEPS,BUILD:production
		// process.env.INCLUDE_DEPS = 'true'
		// process.env.BUILD = 'production'
		environment.forEach((arg: string) => {
			arg.split(',').forEach((pair: string) => {
				const [key, ...value] = pair.split(':');
				env[key] = value.length === 0 ? String(true) : value.join(':');
			});
		});
	}

	if (isWatchEnabled(command.watch)) {
		// 开启监听模式
		await loadFsEvents();
		const { watch } = await import('./watch-cli');
		watch(command);
	} else {
		// 非监听模式
		try {
			// 解析配置项
			const { options, warnings } = await getConfigs(command);
			try {
				for (const inputOptions of options) {
					await build(inputOptions, warnings, command.silent);
				}
				if (command.failAfterWarnings && warnings.warningOccurred) {
					warnings.flush();
					handleError({
						code: 'FAIL_AFTER_WARNINGS',
						message: 'Warnings occurred and --failAfterWarnings flag present'
					});
				}
			} catch (err: any) {
				warnings.flush();
				handleError(err);
			}
		} catch (err: any) {
			handleError(err);
		}
	}
}

async function getConfigs(
	command: any
): Promise<{ options: MergedRollupOptions[]; warnings: BatchWarnings }> {
	if (command.config) {
		// 有指定自定义配置文件

		// 找到配置文件
		const configFile = await getConfigPath(command.config);
		// 加载并解析配置文件
		const { options, warnings } = await loadAndParseConfigFile(configFile, command);
		// 将解析结果返回
		return { options, warnings };
	}

	// 未指定自定义配置文件，找默认路径找配置文件
	return await loadConfigFromCommand(command);
}
