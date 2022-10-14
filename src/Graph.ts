import * as acorn from 'acorn';
import type ExternalModule from './ExternalModule';
import Module from './Module';
import { ModuleLoader, type UnresolvedModule } from './ModuleLoader';
import GlobalScope from './ast/scopes/GlobalScope';
import { PathTracker } from './ast/utils/PathTracker';
import type {
	ModuleInfo,
	ModuleJSON,
	NormalizedInputOptions,
	RollupCache,
	RollupWatcher,
	SerializablePluginCache,
	WatchChangeHook
} from './rollup/types';
import { PluginDriver } from './utils/PluginDriver';
import Queue from './utils/Queue';
import { BuildPhase } from './utils/buildPhase';
import { errImplicitDependantIsNotIncluded, error } from './utils/error';
import { analyseModuleExecution } from './utils/executionOrder';
import { addAnnotations } from './utils/pureComments';
import relativeId from './utils/relativeId';
import { timeEnd, timeStart } from './utils/timers';
import { markModuleAndImpureDependenciesAsExecuted } from './utils/traverseStaticDependencies';

/**
 * 规范化处理入口模块
 * @param entryModules 入口配置（数组、对象）
 * @returns
 */
function normalizeEntryModules(
	entryModules: readonly string[] | Record<string, string>
): UnresolvedModule[] {
	// 数组形式
	if (Array.isArray(entryModules)) {
		return entryModules.map(id => ({
			fileName: null,
			id, // 模块 ID
			implicitlyLoadedAfter: [],
			importer: undefined,
			name: null
		}));
	}

	// 对象形式
	return Object.entries(entryModules).map(([name, id]) => ({
		fileName: null,
		id, // 模块 ID
		implicitlyLoadedAfter: [],
		importer: undefined,
		name
	}));
}

export default class Graph {
	readonly acornParser: typeof acorn.Parser;
	readonly cachedModules = new Map<string, ModuleJSON>();
	readonly deoptimizationTracker = new PathTracker();
	entryModules: Module[] = [];
	readonly fileOperationQueue: Queue;
	readonly moduleLoader: ModuleLoader;

	// Map 的形式存储所有收集到的 Module，key 为 moduleId，方便后续查找
	readonly modulesById = new Map<string, Module | ExternalModule>();
	needsTreeshakingPass = false;
	phase: BuildPhase = BuildPhase.LOAD_AND_PARSE;
	readonly pluginDriver: PluginDriver;
	readonly scope = new GlobalScope();
	readonly watchFiles: Record<string, true> = Object.create(null);
	watchMode = false;

	private readonly externalModules: ExternalModule[] = [];
	private implicitEntryModules: Module[] = [];
	private modules: Module[] = [];
	private declare pluginCache?: Record<string, SerializablePluginCache>;

	constructor(private readonly options: NormalizedInputOptions, watcher: RollupWatcher | null) {
		// 处理缓存
		// cache: RollupCache | false
		if (options.cache !== false) {
			// 使用缓存加快构建
			if (options.cache?.modules) {
				for (const module of options.cache.modules) this.cachedModules.set(module.id, module);
			}
			this.pluginCache = options.cache?.plugins || Object.create(null);

			// increment access counter
			for (const name in this.pluginCache) {
				const cache = this.pluginCache[name];
				for (const value of Object.values(cache)) value[0]++;
			}
		}

		// watch 模式下 watcher 才有值
		if (watcher) {
			this.watchMode = true;
			const handleChange = (...args: Parameters<WatchChangeHook>) =>
				this.pluginDriver.hookParallel('watchChange', args);
			const handleClose = () => this.pluginDriver.hookParallel('closeWatcher', []);
			watcher.onCurrentAwaited('change', handleChange);
			watcher.onCurrentAwaited('close', handleClose);
		}

		// 实例化 PluginDriver 插件驱动器
		this.pluginDriver = new PluginDriver(this, options, options.plugins, this.pluginCache);
		// acorn 是一个 JavaScript 语法解析器，它将 JavaScript 字符串解析成语法抽象树 AST
		this.acornParser = acorn.Parser.extend(...(options.acornInjectPlugins as any));
		// 实例化 moduleLoader 模块加载器
		// 将 modulesById 传递下去，ModuleLoader 内部会给其赋值
		this.moduleLoader = new ModuleLoader(this, this.modulesById, this.options, this.pluginDriver);
		// 文件操作队列
		this.fileOperationQueue = new Queue(options.maxParallelFileOps);
	}

	async build(): Promise<void> {
		timeStart('generate module graph', 2);
		// 生成模块依赖图
		await this.generateModuleGraph();
		timeEnd('generate module graph', 2);

		timeStart('sort modules', 2);
		this.phase = BuildPhase.ANALYSE;
		// 对模块进行排序
		this.sortModules();
		timeEnd('sort modules', 2);

		timeStart('mark included statements', 2);
		// 标记需要包含进来的语句 statements
		this.includeStatements();
		timeEnd('mark included statements', 2);

		this.phase = BuildPhase.GENERATE;
	}

	contextParse(code: string, options: Partial<acorn.Options> = {}): acorn.Node {
		const onCommentOrig = options.onComment;
		const comments: acorn.Comment[] = [];

		if (onCommentOrig && typeof onCommentOrig == 'function') {
			options.onComment = (block, text, start, end, ...args) => {
				comments.push({ end, start, type: block ? 'Block' : 'Line', value: text });
				return onCommentOrig.call(options, block, text, start, end, ...args);
			};
		} else {
			options.onComment = comments;
		}

		const ast = this.acornParser.parse(code, {
			...(this.options.acorn as unknown as acorn.Options),
			...options
		});

		if (typeof onCommentOrig == 'object') {
			onCommentOrig.push(...comments);
		}

		options.onComment = onCommentOrig;

		addAnnotations(comments, ast, code);

		return ast;
	}

	getCache(): RollupCache {
		// handle plugin cache eviction
		for (const name in this.pluginCache) {
			const cache = this.pluginCache[name];
			let allDeleted = true;
			for (const [key, value] of Object.entries(cache)) {
				if (value[0] >= this.options.experimentalCacheExpiry) delete cache[key];
				else allDeleted = false;
			}
			if (allDeleted) delete this.pluginCache[name];
		}

		return {
			modules: this.modules.map(module => module.toJSON()),
			plugins: this.pluginCache
		};
	}

	getModuleInfo = (moduleId: string): ModuleInfo | null => {
		const foundModule = this.modulesById.get(moduleId);
		if (!foundModule) return null;
		return foundModule.info;
	};

	private async generateModuleGraph(): Promise<void> {
		// 调用模块加载器完成入口依赖的收集
		({ entryModules: this.entryModules, implicitEntryModules: this.implicitEntryModules } =
			await this.moduleLoader.addEntryModules(normalizeEntryModules(this.options.input), true));

		if (this.entryModules.length === 0) {
			throw new Error('You must supply options.input to rollup');
		}

		debugger;
		// console.log('[DEBUG]: 收集到', this.modulesById);
		// addEntryModules 完成后， this.modulesById 就有值了，modulesById 收集的是整个程序所有的 Modules
		// modulesById 以 Map 的形式存储所有收集到的 Module，key 为 moduleId
		// 用 this.modules 先收集一波所有的 Module
		// 后续还会对 this.modules 进行一波处理
		for (const module of this.modulesById.values()) {
			if (module instanceof Module) {
				this.modules.push(module);
			} else {
				this.externalModules.push(module);
			}
		}
	}

	private includeStatements(): void {
		for (const module of [...this.entryModules, ...this.implicitEntryModules]) {
			markModuleAndImpureDependenciesAsExecuted(module);
		}
		if (this.options.treeshake) {
			let treeshakingPass = 1;
			do {
				timeStart(`treeshaking pass ${treeshakingPass}`, 3);
				this.needsTreeshakingPass = false;
				for (const module of this.modules) {
					if (module.isExecuted) {
						if (module.info.moduleSideEffects === 'no-treeshake') {
							module.includeAllInBundle();
						} else {
							module.include();
						}
					}
				}
				if (treeshakingPass === 1) {
					// We only include exports after the first pass to avoid issues with
					// the TDZ detection logic
					for (const module of [...this.entryModules, ...this.implicitEntryModules]) {
						if (module.preserveSignature !== false) {
							module.includeAllExports(false);
							this.needsTreeshakingPass = true;
						}
					}
				}
				timeEnd(`treeshaking pass ${treeshakingPass++}`, 3);
			} while (this.needsTreeshakingPass);
		} else {
			for (const module of this.modules) module.includeAllInBundle();
		}
		for (const externalModule of this.externalModules) externalModule.warnUnusedImports();
		for (const module of this.implicitEntryModules) {
			for (const dependant of module.implicitlyLoadedAfter) {
				if (!(dependant.info.isEntry || dependant.isIncluded())) {
					error(errImplicitDependantIsNotIncluded(dependant));
				}
			}
		}
	}

	private sortModules(): void {
		// 分析所有 Module
		// 从入口模块开始递归处理，完成模块间父子关系的收集和排序
		// 得到排序后的 orderedModules 列表
		const { orderedModules, cyclePaths } = analyseModuleExecution(this.entryModules);
		for (const cyclePath of cyclePaths) {
			this.options.onwarn({
				code: 'CIRCULAR_DEPENDENCY',
				cycle: cyclePath,
				importer: cyclePath[0],
				message: `Circular dependency: ${cyclePath.join(' -> ')}`
			});
		}
		// this.modules 是有顺序的列表了
		this.modules = orderedModules;
		// 遍历所有的模块，完成各个模块的 bindReferences 操作
		for (const module of this.modules) {
			module.bindReferences();
		}

		// 警告处理可以不用管先
		this.warnForMissingExports();
	}

	private warnForMissingExports(): void {
		for (const module of this.modules) {
			for (const importDescription of module.importDescriptions.values()) {
				if (
					importDescription.name !== '*' &&
					!importDescription.module.getVariableForExportName(importDescription.name)[0]
				) {
					module.warn(
						{
							code: 'NON_EXISTENT_EXPORT',
							message: `Non-existent export '${
								importDescription.name
							}' is imported from ${relativeId(importDescription.module.id)}`,
							name: importDescription.name,
							source: importDescription.module.id
						},
						importDescription.start
					);
				}
			}
		}
	}
}
