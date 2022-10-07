import { execSync } from 'child_process';
import type { RollupWatchHooks } from '../../src/rollup/types';
import { bold, cyan } from '../../src/utils/colors';
import { stderr } from '../logging';

function extractWatchHooks(
	command: Record<string, any>
): Partial<Record<RollupWatchHooks, string>> {
	if (!Array.isArray(command.watch)) return {};

	// command.watch 数组中筛选出是对象的
	return command.watch
		.filter(value => typeof value === 'object')
		.reduce((acc, keyValueOption) => ({ ...acc, ...keyValueOption }), {});
}

export function createWatchHooks(command: Record<string, any>): (hook: RollupWatchHooks) => void {
	const watchHooks = extractWatchHooks(command); // 一个对象

	return function (hook: RollupWatchHooks): void {
		if (watchHooks[hook]) {
			// 拿到命令
			const cmd = watchHooks[hook]!;

			if (!command.silent) {
				stderr(cyan(`watch.${hook} ${bold(`$ ${cmd}`)}`));
			}

			try {
				// !! important - use stderr for all writes from execSync
				const stdio = [process.stdin, process.stderr, process.stderr];
				// 子进程的形式执行该命令
				execSync(cmd, { stdio: command.silent ? 'ignore' : stdio });
			} catch (e) {
				stderr((e as Error).message);
			}
		}
	};
}
