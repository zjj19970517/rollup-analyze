import type ExternalModule from '../ExternalModule';
import Module from '../Module';
import relativeId from './relativeId';

interface OrderedExecutionUnit {
	execIndex: number;
}

const compareExecIndex = <T extends OrderedExecutionUnit>(unitA: T, unitB: T) =>
	unitA.execIndex > unitB.execIndex ? 1 : -1;

export function sortByExecutionOrder(units: OrderedExecutionUnit[]): void {
	units.sort(compareExecIndex);
}

export function analyseModuleExecution(entryModules: readonly Module[]): {
	cyclePaths: string[][];
	orderedModules: Module[];
} {
	let nextExecIndex = 0;
	const cyclePaths: string[][] = [];
	const analysedModules = new Set<Module | ExternalModule>(); // 存储已经分析过的模块
	const dynamicImports = new Set<Module>(); // 存储动态导入的模块
	const parents = new Map<Module | ExternalModule, Module | null>(); //
	const orderedModules: Module[] = [];

	// 用来分析模块的方法，改方法会被重复递归执行
	const analyseModule = (module: Module | ExternalModule) => {
		if (module instanceof Module) {
			// 先遍历处理模块的直接依赖 module.dependencies
			// 这里的依赖指的是该模块中的 所有同步 import
			for (const dependency of module.dependencies) {
				if (parents.has(dependency)) {
					// 如果没有分析过该依赖Module
					if (!analysedModules.has(dependency)) {
						cyclePaths.push(getCyclePath(dependency as Module, module, parents));
					}
					continue;
				}
				parents.set(dependency, module);
				analyseModule(dependency);
			}

			for (const dependency of module.implicitlyLoadedBefore) {
				// 动态导入的模块
				dynamicImports.add(dependency);
			}

			for (const { resolution } of module.dynamicImports) {
				if (resolution instanceof Module) {
					dynamicImports.add(resolution);
				}
			}
			orderedModules.push(module);
		}

		module.execIndex = nextExecIndex++;
		analysedModules.add(module);
	};

	// 遍历入口模块
	for (const curEntry of entryModules) {
		if (!parents.has(curEntry)) {
			parents.set(curEntry, null); // parents 记录父子关系
			analyseModule(curEntry); // 分析改模块
		}
	}

	// 动态引入的模块
	for (const curEntry of dynamicImports) {
		if (!parents.has(curEntry)) {
			parents.set(curEntry, null);
			analyseModule(curEntry);
		}
	}

	return { cyclePaths, orderedModules };
}

function getCyclePath(
	module: Module,
	parent: Module,
	parents: ReadonlyMap<Module | ExternalModule, Module | null>
): string[] {
	const cycleSymbol = Symbol(module.id);
	const path = [relativeId(module.id)];
	let nextModule = parent;
	module.cycles.add(cycleSymbol);
	while (nextModule !== module) {
		nextModule.cycles.add(cycleSymbol);
		path.push(relativeId(nextModule.id));
		nextModule = parents.get(nextModule)!;
	}
	path.push(path[0]);
	path.reverse();
	return path;
}
