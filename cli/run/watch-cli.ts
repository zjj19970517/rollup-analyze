import { promises as fs, type FSWatcher } from 'fs';
import process from 'process';
import chokidar from 'chokidar';
import dateTime from 'date-time';
import ms from 'pretty-ms';
import onExit from 'signal-exit';
import * as rollup from '../../src/node-entry';
import type { MergedRollupOptions, RollupWatcher } from '../../src/rollup/types';
import { bold, cyan, green, underline } from '../../src/utils/colors';
import relativeId from '../../src/utils/relativeId';
import { handleError, stderr } from '../logging';
import type { BatchWarnings } from './batchWarnings';
import { getConfigPath } from './getConfigPath';
import loadAndParseConfigFile from './loadConfigFile';
import loadConfigFromCommand from './loadConfigFromCommand';
import { getResetScreen } from './resetScreen';
import { printTimings } from './timings';
import { createWatchHooks } from './watchHooks';

export async function watch(command: Record<string, any>): Promise<void> {
	process.env.ROLLUP_WATCH = 'true';
	const isTTY = process.stderr.isTTY;
	const silent = command.silent;
	let watcher: RollupWatcher;
	let configWatcher: FSWatcher;
	let resetScreen: (heading: string) => void;
	// 配置文件
	const configFile = command.config ? await getConfigPath(command.config) : null;
	const runWatchHook = createWatchHooks(command);

	// 退出时，关闭 watcher
	onExit(close);
	// 监听到未捕获的异常，关闭 watcher
	process.on('uncaughtException', close);

	// 接受输入流内容的情况
	if (!process.stdin.isTTY) {
		process.stdin.on('end', close);
		process.stdin.resume();
	}

	async function loadConfigFromFileAndTrack(configFile: string): Promise<void> {
		let configFileData: string | null = null;
		let configFileRevision = 0;

		// 基于 chokidar 开启对配置文件的 watch
		configWatcher = chokidar.watch(configFile).on('change', reloadConfigFile);

		// 默认先加载一次配置文件
		await reloadConfigFile();

		async function reloadConfigFile() {
			try {
				const newConfigFileData = await fs.readFile(configFile, 'utf8');
				if (newConfigFileData === configFileData) {
					// 新文件内容和旧缓存文件内容一致
					return;
				}
				configFileRevision++;
				const currentConfigFileRevision = configFileRevision;
				if (configFileData) {
					// 打印重新跟新配置的日志
					stderr(`\nReloading updated config...`);
				}
				// 更新缓存
				configFileData = newConfigFileData;
				// 加载并解析配置文件
				const { options, warnings } = await loadAndParseConfigFile(configFile, command);
				if (currentConfigFileRevision !== configFileRevision) {
					return;
				}
				// 如果已经创建有了 watcher 监听器，先关闭前一个监听器
				if (watcher) {
					await watcher.close();
				}
				// 开始一次新的兼容任务
				start(options, warnings);
			} catch (err: any) {
				handleError(err, true);
			}
		}
	}

	if (configFile) {
		// 存在配置文件

		// 首先加载配置文件并开启文件变更追踪
		await loadConfigFromFileAndTrack(configFile);
	} else {
		// 从命令行加载配置
		const { options, warnings } = await loadConfigFromCommand(command);
		// 执行 start 开始监听
		start(options, warnings);
	}

	function start(configs: MergedRollupOptions[], warnings: BatchWarnings): void {
		try {
			// rollup.watch 监听，创建 watcher 监听器
			watcher = rollup.watch(configs as any);
		} catch (err: any) {
			return handleError(err);
		}

		watcher.on('event', event => {
			switch (event.code) {
				case 'ERROR':
					// 产生异常了
					warnings.flush();
					handleError(event.error, true);
					// 执行 watch 模式的 onError 钩子函数
					runWatchHook('onError');
					break;

				case 'START':
					if (!silent) {
						if (!resetScreen) {
							resetScreen = getResetScreen(configs, isTTY);
						}
						resetScreen(underline(`rollup v${rollup.VERSION}`));
					}
					// 执行 watch 模式的 onStart 钩子函数
					runWatchHook('onStart');

					break;

				case 'BUNDLE_START':
					if (!silent) {
						let input = event.input;
						if (typeof input !== 'string') {
							input = Array.isArray(input)
								? input.join(', ')
								: Object.values(input as Record<string, string>).join(', ');
						}
						stderr(
							cyan(`bundles ${bold(input)} → ${bold(event.output.map(relativeId).join(', '))}...`)
						);
					}
					runWatchHook('onBundleStart');
					break;

				case 'BUNDLE_END':
					warnings.flush();
					if (!silent)
						stderr(
							green(
								`created ${bold(event.output.map(relativeId).join(', '))} in ${bold(
									ms(event.duration)
								)}`
							)
						);
					runWatchHook('onBundleEnd');
					if (event.result && event.result.getTimings) {
						printTimings(event.result.getTimings());
					}
					break;

				case 'END':
					runWatchHook('onEnd');
					if (!silent && isTTY) {
						stderr(`\n[${dateTime()}] waiting for changes...`);
					}
			}

			if ('result' in event && event.result) {
				event.result.close().catch(error => handleError(error, true));
			}
		});
	}

	async function close(code: number | null): Promise<void> {
		process.removeListener('uncaughtException', close);
		// removing a non-existent listener is a no-op
		process.stdin.removeListener('end', close);

		if (watcher) await watcher.close();
		if (configWatcher) configWatcher.close();

		if (code) {
			process.exit(code);
		}
	}
}
