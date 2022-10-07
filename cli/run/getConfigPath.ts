import { promises as fs } from 'fs';
import { resolve } from 'path';
import { cwd } from 'process';
import { handleError } from '../logging';

const DEFAULT_CONFIG_BASE = 'rollup.config';

/**
 * 获取配置文件的路径
 * @param commandConfig
 * @returns
 */
export async function getConfigPath(commandConfig: string | true): Promise<string> {
	if (commandConfig === true) {
		// 处理没指定配置文件的情况： rollup -c
		return resolve(await findConfigFileNameInCwd());
	}
	if (commandConfig.slice(0, 5) === 'node:') {
		// 从 npm package 加载，必须以 node: 开头
		const pkgName = commandConfig.slice(5);
		try {
			// node:my-config
			// 读取 rollup-config-my-config package
			return require.resolve(`rollup-config-${pkgName}`, { paths: [cwd()] });
		} catch {
			// 读取失败后，尝试去读取 my-config package
			try {
				return require.resolve(pkgName, { paths: [cwd()] });
			} catch (err: any) {
				if (err.code === 'MODULE_NOT_FOUND') {
					handleError({
						code: 'MISSING_EXTERNAL_CONFIG',
						message: `Could not resolve config file "${commandConfig}"`
					});
				}
				throw err;
			}
		}
	}

	// 处理 rollup -c rollup.config.js 的情况
	return resolve(commandConfig);
}

async function findConfigFileNameInCwd(): Promise<string> {
	// 从命令执行的当前目录下找寻 rollup.config.(mjs|cjs|ts)
	const filesInWorkingDir = new Set(await fs.readdir(cwd()));
	for (const extension of ['mjs', 'cjs', 'ts']) {
		const fileName = `${DEFAULT_CONFIG_BASE}.${extension}`;
		if (filesInWorkingDir.has(fileName)) return fileName;
	}
	// 最后兜底找 rollup.config.js
	return `${DEFAULT_CONFIG_BASE}.js`;
}
