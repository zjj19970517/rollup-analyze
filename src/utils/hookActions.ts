import { EventEmitter } from 'events';
import process from 'process';
import { HookAction, PluginDriver } from './PluginDriver';

function formatAction([pluginName, hookName, args]: HookAction): string {
	const action = `(${pluginName}) ${hookName}`;
	const s = JSON.stringify;
	switch (hookName) {
		case 'resolveId':
			return `${action} ${s(args[0])} ${s(args[1])}`;
		case 'load':
			return `${action} ${s(args[0])}`;
		case 'transform':
			return `${action} ${s(args[1])}`;
		case 'shouldTransformCachedModule':
			return `${action} ${s((args[0] as { id: string }).id)}`;
		case 'moduleParsed':
			return `${action} ${s((args[0] as { id: string }).id)}`;
	}
	return action;
}

// We do not directly listen on process to avoid max listeners warnings for
// complicated build processes
const beforeExitEvent = 'beforeExit';
const beforeExitEmitter = new EventEmitter();
beforeExitEmitter.setMaxListeners(0);
process.on(beforeExitEvent, () => beforeExitEmitter.emit(beforeExitEvent));

export async function catchUnfinishedHookActions<T>(
	pluginDriver: PluginDriver,
	callback: () => Promise<T>
): Promise<T> {
	let handleEmptyEventLoop: () => void;
	const emptyEventLoopPromise = new Promise<T>((_, reject) => {
		handleEmptyEventLoop = () => {
			const unfulfilledActions = pluginDriver.getUnfulfilledHookActions();
			reject(
				new Error(
					`Unexpected early exit. This happens when Promises returned by plugins cannot resolve. Unfinished hook action(s) on exit:\n` +
						[...unfulfilledActions].map(formatAction).join('\n')
				)
			);
		};
		beforeExitEmitter.once(beforeExitEvent, handleEmptyEventLoop);
	});

	const result = await Promise.race([callback(), emptyEventLoopPromise]);
	beforeExitEmitter.off(beforeExitEvent, handleEmptyEventLoop!);
	return result;
}
