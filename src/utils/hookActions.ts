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
// 我们不直接侦听进程，以避免对复杂的构建进程发出最大侦听器警告
// 当 Node.js 清空其事件循环并且没有额外的工作要安排时，则会触发 'beforeExit' 事件。
// 通常情况下，当没有工作要调度时，Node.js 进程会退出，但是注册在 'beforeExit' 事件上的监听器可以进行异步的调用，从而使 Node.js 进程继续。
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
			console.log('[ROLLUP_DEBUG]: beforeExit ');
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

	// emptyEventLoopPromise：一个空的 Promise 异步任务，只会 reject
	// 只有进程 beforeExit 事件触发后，才会 reject

	// 这里的目的是：Exit 触发后 callback 就不需要再继续执行下去了
	const result = await Promise.race([callback(), emptyEventLoopPromise]);
	beforeExitEmitter.off(beforeExitEvent, handleEmptyEventLoop!);
	return result;
}
