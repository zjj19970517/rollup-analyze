import * as acorn from 'acorn';
import ExternalModule from './ExternalModule';
import type Graph from './Graph';
import Module, { type DynamicImport } from './Module';
import type {
	CustomPluginOptions,
	EmittedChunk,
	HasModuleSideEffects,
	LoadResult,
	ModuleInfo,
	ModuleOptions,
	NormalizedInputOptions,
	PartialNull,
	Plugin,
	ResolvedId,
	ResolveIdResult
} from './rollup/types';
import type { PluginDriver } from './utils/PluginDriver';
import { EMPTY_OBJECT } from './utils/blank';
import {
	errBadLoader,
	errEntryCannotBeExternal,
	errExternalSyntheticExports,
	errImplicitDependantCannotBeExternal,
	errInternalIdCannotBeExternal,
	error,
	errUnresolvedEntry,
	errUnresolvedImplicitDependant,
	errUnresolvedImport,
	errUnresolvedImportTreatedAsExternal
} from './utils/error';
import { promises as fs } from './utils/fs';
import { isAbsolute, isRelative, resolve } from './utils/path';
import relativeId from './utils/relativeId';
import { resolveId } from './utils/resolveId';
import { timeEnd, timeStart } from './utils/timers';
import transform from './utils/transform';

export interface UnresolvedModule {
	fileName: string | null;
	id: string;
	importer: string | undefined;
	name: string | null;
}

type NormalizedResolveIdWithoutDefaults = Partial<PartialNull<ModuleOptions>> & {
	external?: boolean | 'absolute';
	id: string;
};

type ResolveStaticDependencyPromise = Promise<[source: string, resolvedId: ResolvedId]>;
type ResolveDynamicDependencyPromise = Promise<
	[dynamicImport: DynamicImport, resolvedId: ResolvedId | string | null]
>;
type LoadModulePromise = Promise<
	[
		resolveStaticDependencies: ResolveStaticDependencyPromise[],
		resolveDynamicDependencies: ResolveDynamicDependencyPromise[],
		loadAndResolveDependencies: Promise<void>
	]
>;
type PreloadType = boolean | 'resolveDependencies';
const RESOLVE_DEPENDENCIES: PreloadType = 'resolveDependencies';

export class ModuleLoader {
	private readonly hasModuleSideEffects: HasModuleSideEffects;
	private readonly implicitEntryModules = new Set<Module>();
	private readonly indexedEntryModules: { index: number; module: Module }[] = [];
	private latestLoadModulesPromise: Promise<unknown> = Promise.resolve();
	private readonly moduleLoadPromises = new Map<Module, LoadModulePromise>();
	private readonly modulesWithLoadedDependencies = new Set<Module>();
	private nextChunkNamePriority = 0;
	private nextEntryModuleIndex = 0;

	constructor(
		private readonly graph: Graph,
		private readonly modulesById: Map<string, Module | ExternalModule>,
		private readonly options: NormalizedInputOptions,
		private readonly pluginDriver: PluginDriver
	) {
		this.hasModuleSideEffects = options.treeshake
			? options.treeshake.moduleSideEffects
			: () => true;
	}

	async addAdditionalModules(unresolvedModules: readonly string[]): Promise<Module[]> {
		const result = this.extendLoadModulesPromise(
			Promise.all(unresolvedModules.map(id => this.loadEntryModule(id, false, undefined, null)))
		);
		await this.awaitLoadModulesPromise();
		return result;
	}

	async addEntryModules(
		unresolvedEntryModules: readonly UnresolvedModule[],
		isUserDefined: boolean // 是否是用户定义的
	): Promise<{
		entryModules: Module[];
		implicitEntryModules: Module[];
		newEntryModules: Module[];
	}> {
		// 这些索引可能是用于排序使用
		const firstEntryModuleIndex = this.nextEntryModuleIndex;
		this.nextEntryModuleIndex += unresolvedEntryModules.length;
		const firstChunkNamePriority = this.nextChunkNamePriority;
		this.nextChunkNamePriority += unresolvedEntryModules.length;

		const newEntryModules = await this.extendLoadModulesPromise(
			Promise.all(
				// 并行加载入口模块
				unresolvedEntryModules.map(({ id, importer }) =>
					// 加载入口模块
					this.loadEntryModule(id, true, importer, null)
				)
			).then(entryModules => {
				// 所有入口模块加载完毕后
				// console.log('[DEBUG]: 所有入口模块加载完毕后 entryModules', entryModules);
				for (let index = 0; index < entryModules.length; index++) {
					const entryModule = entryModules[index];

					// 是否为用户定义的 EntryPoint
					entryModule.isUserDefinedEntryPoint =
						entryModule.isUserDefinedEntryPoint || isUserDefined;

					// 处理 ChunkName
					// 更新 module 的这两个字段：module.chunkFileNames 和 module.chunkNames
					// 方便后续使用
					addChunkNamesToModule(
						entryModule,
						unresolvedEntryModules[index],
						isUserDefined,
						firstChunkNamePriority + index
					);

					// indexedEntryModules 存储所有 EntryModule 的 索引
					// existingIndexedModule 表示是否存在
					const existingIndexedModule = this.indexedEntryModules.find(
						indexedModule => indexedModule.module === entryModule
					);

					if (!existingIndexedModule) {
						// 不存在，插入一条
						this.indexedEntryModules.push({
							index: firstEntryModuleIndex + index,
							module: entryModule
						});
					} else {
						// 存在的话，更新 index
						existingIndexedModule.index = Math.min(
							existingIndexedModule.index,
							firstEntryModuleIndex + index
						);
					}
				}

				// entryModule 排序
				this.indexedEntryModules.sort(({ index: indexA }, { index: indexB }) =>
					indexA > indexB ? 1 : -1
				);

				// 然后将 entryModules 返回
				return entryModules;
			})
		);

		// 这里可以不用太关注，主要是为了确保 .then 也执行完毕
		// 确保最终拿到的 entryModules 是处理完毕后的
		await this.awaitLoadModulesPromise();

		// console.log(
		// 	'[DEBUG]: addEntryModules 后的返回值',
		// 	this.indexedEntryModules.map(({ module }) => module),
		// 	this.implicitEntryModules,
		// 	newEntryModules
		// );

		return {
			entryModules: this.indexedEntryModules.map(({ module }) => module),
			implicitEntryModules: [...this.implicitEntryModules],
			newEntryModules
		};
	}

	async emitChunk({
		fileName,
		id,
		importer,
		name,
		implicitlyLoadedAfterOneOf,
		preserveSignature
	}: EmittedChunk): Promise<Module> {
		const unresolvedModule: UnresolvedModule = {
			fileName: fileName || null,
			id,
			importer,
			name: name || null
		};
		const module = implicitlyLoadedAfterOneOf
			? await this.addEntryWithImplicitDependants(unresolvedModule, implicitlyLoadedAfterOneOf)
			: (await this.addEntryModules([unresolvedModule], false)).newEntryModules[0];
		if (preserveSignature != null) {
			module.preserveSignature = preserveSignature;
		}
		return module;
	}

	public async preloadModule(
		resolvedId: { id: string; resolveDependencies?: boolean } & Partial<PartialNull<ModuleOptions>>
	): Promise<ModuleInfo> {
		const module = await this.fetchModule(
			this.getResolvedIdWithDefaults(resolvedId)!,
			undefined,
			false,
			resolvedId.resolveDependencies ? RESOLVE_DEPENDENCIES : true
		);
		return module.info;
	}

	resolveId = async (
		source: string,
		importer: string | undefined,
		customOptions: CustomPluginOptions | undefined,
		isEntry: boolean | undefined,
		skip: readonly { importer: string | undefined; plugin: Plugin; source: string }[] | null = null
	): Promise<ResolvedId | null> => {
		return this.getResolvedIdWithDefaults(
			this.getNormalizedResolvedIdWithoutDefaults(
				this.options.external(source, importer, false)
					? false
					: await resolveId(
							source,
							importer,
							this.options.preserveSymlinks,
							this.pluginDriver,
							this.resolveId,
							skip,
							customOptions,
							typeof isEntry === 'boolean' ? isEntry : !importer
					  ),

				importer,
				source
			)
		);
	};

	private addEntryWithImplicitDependants(
		unresolvedModule: UnresolvedModule,
		implicitlyLoadedAfter: readonly string[]
	): Promise<Module> {
		const chunkNamePriority = this.nextChunkNamePriority++;
		return this.extendLoadModulesPromise(
			this.loadEntryModule(unresolvedModule.id, false, unresolvedModule.importer, null).then(
				async entryModule => {
					addChunkNamesToModule(entryModule, unresolvedModule, false, chunkNamePriority);
					if (!entryModule.info.isEntry) {
						this.implicitEntryModules.add(entryModule);
						const implicitlyLoadedAfterModules = await Promise.all(
							implicitlyLoadedAfter.map(id =>
								this.loadEntryModule(id, false, unresolvedModule.importer, entryModule.id)
							)
						);
						for (const module of implicitlyLoadedAfterModules) {
							entryModule.implicitlyLoadedAfter.add(module);
						}
						for (const dependant of entryModule.implicitlyLoadedAfter) {
							dependant.implicitlyLoadedBefore.add(entryModule);
						}
					}
					return entryModule;
				}
			)
		);
	}

	private async addModuleSource(
		id: string,
		importer: string | undefined,
		module: Module
	): Promise<void> {
		timeStart('load modules', 3);
		let source: LoadResult;
		try {
			// source 是解析后的模块源码内容

			// fileOperationQueue 是一个异步任务执行队列
			// this.pluginDriver.hookFirst('load', [id])) 调用所有监听有 load 事件的插件执行 ==> 插件会返回处理后的结果
			// 如果没有插件 fs.readFile(id, 'utf8') 直接读取文件内容作为源码
			source = await this.graph.fileOperationQueue.run(
				async () =>
					(await this.pluginDriver.hookFirst('load', [id])) ?? (await fs.readFile(id, 'utf8'))
			);
		} catch (err: any) {
			timeEnd('load modules', 3);
			let msg = `Could not load ${id}`;
			if (importer) msg += ` (imported by ${relativeId(importer)})`;
			msg += `: ${err.message}`;
			err.message = msg;
			throw err;
		}
		timeEnd('load modules', 3);

		// 构造 sourceDescription 对象  { code: source }
		const sourceDescription =
			typeof source === 'string'
				? { code: source }
				: source != null && typeof source === 'object' && typeof source.code === 'string'
				? source
				: error(errBadLoader(id));
		const cachedModule = this.graph.cachedModules.get(id);
		if (
			cachedModule &&
			!cachedModule.customTransformCache &&
			cachedModule.originalCode === sourceDescription.code &&
			!(await this.pluginDriver.hookFirst('shouldTransformCachedModule', [
				{
					ast: cachedModule.ast,
					code: cachedModule.code,
					id: cachedModule.id,
					meta: cachedModule.meta,
					moduleSideEffects: cachedModule.moduleSideEffects,
					resolvedSources: cachedModule.resolvedIds,
					syntheticNamedExports: cachedModule.syntheticNamedExports
				}
			]))
		) {
			if (cachedModule.transformFiles) {
				for (const emittedFile of cachedModule.transformFiles)
					this.pluginDriver.emitFile(emittedFile);
			}
			module.setSource(cachedModule);
		} else {
			// 重点看这里
			module.updateOptions(sourceDescription);

			// 完成模块源码的转换 transform
			const transformSource = await transform(
				sourceDescription,
				module,
				this.pluginDriver,
				this.options.onwarn
			);
			// 将 transform 后的源码内容更新到 module 中
			module.setSource(transformSource);
		}
	}

	private async awaitLoadModulesPromise(): Promise<void> {
		let startingPromise;
		do {
			startingPromise = this.latestLoadModulesPromise;
			await startingPromise;
		} while (startingPromise !== this.latestLoadModulesPromise);
	}

	private extendLoadModulesPromise<T>(loadNewModulesPromise: Promise<T>): Promise<T> {
		this.latestLoadModulesPromise = Promise.all([
			loadNewModulesPromise,
			this.latestLoadModulesPromise
		]);
		this.latestLoadModulesPromise.catch(() => {
			/* Avoid unhandled Promise rejections */
		});
		return loadNewModulesPromise;
	}

	// 解析异步依赖
	private async fetchDynamicDependencies(
		module: Module,
		resolveDynamicImportPromises: readonly ResolveDynamicDependencyPromise[]
	): Promise<void> {
		const dependencies = await Promise.all(
			resolveDynamicImportPromises.map(resolveDynamicImportPromise =>
				resolveDynamicImportPromise.then(async ([dynamicImport, resolvedId]) => {
					// dynamicImport：动态导入对象
					// resolvedId resolve 后的产物
					if (resolvedId === null) return null;
					if (typeof resolvedId === 'string') {
						dynamicImport.resolution = resolvedId;
						return null;
					}

					// 解析 Resolve 过后的 依赖
					return (dynamicImport.resolution = await this.fetchResolvedDependency(
						relativeId(resolvedId.id),
						module.id,
						resolvedId
					));
				})
			)
		);

		// 遍历所有的异步依赖
		for (const dependency of dependencies) {
			if (dependency) {
				// module 和 dynamicDependencies 建立关系
				module.dynamicDependencies.add(dependency);
				dependency.dynamicImporters.push(module.id);
			}
		}
	}

	// If this is a preload, then this method always waits for the dependencies of the module to be resolved.
	// Otherwise if the module does not exist, it waits for the module and all its dependencies to be loaded.
	// Otherwise it returns immediately.
	private async fetchModule(
		{ id, meta, moduleSideEffects, syntheticNamedExports }: ResolvedId,
		importer: string | undefined,
		isEntry: boolean,
		isPreload: PreloadType
	): Promise<Module> {
		// 通过模块ID找到对应的 Module
		const existingModule = this.modulesById.get(id);

		// 如果已经 load 过了就直接返回
		if (existingModule instanceof Module) {
			await this.handleExistingModule(existingModule, isEntry, isPreload);
			return existingModule;
		}

		// 新实例化一个 Module
		const module = new Module(
			this.graph,
			id,
			this.options,
			isEntry,
			moduleSideEffects,
			syntheticNamedExports,
			meta
		);

		// modulesById 中记录下
		this.modulesById.set(id, module);
		this.graph.watchFiles[id] = true;

		// 先执行 addModuleSource
		// addModuleSource 顾名思义，就是添加源码的意思
		// addModuleSource 内部其实就是赋值 module.info.code 等
		// addModuleSource 拿到源码和 transform 后的代码后，执行 .then 后面的任务
		const loadPromise: LoadModulePromise = this.addModuleSource(id, importer, module).then(() => {
			// 完成对模块所有静态依赖的 resolve
			const StaticDependency = this.getResolveStaticDependencyPromises(module);
			// 完成对模块所有异步依赖的 resolve
			const DynamicImport = this.getResolveDynamicImportPromises(module);
			return [StaticDependency, DynamicImport, loadAndResolveDependenciesPromise];
		});

		const loadAndResolveDependenciesPromise = waitForDependencyResolution(loadPromise).then(() => {
			// loadPromise 执行完毕后
			// 回调插件钩子函数 moduleParsed，表示模块解析完毕
			// hookParallel 会获取到所有监听了 moduleParsed 的插件列表
			// 调用 pluginDriver.runHook 执行插件的代码，最终的到的是一个 parallelPromises 异步任务
			return this.pluginDriver.hookParallel('moduleParsed', [module.info]);
		});

		loadAndResolveDependenciesPromise.catch(() => {
			/* avoid unhandled promise rejections */
		});

		this.moduleLoadPromises.set(module, loadPromise);

		const resolveDependencyPromises = await loadPromise;

		// resolveDependencyPromises 得到的是
		// Promise<
		//   [
		//     resolveStaticDependencies: ResolveStaticDependencyPromise[],
		//     resolveDynamicDependencies: ResolveDynamicDependencyPromise[],
		//     loadAndResolveDependencies: Promise<void>
		//   ]
		// >

		if (!isPreload) {
			// 当前模块解析完毕后，开始解析其依赖
			await this.fetchModuleDependencies(module, ...resolveDependencyPromises);
		} else if (isPreload === RESOLVE_DEPENDENCIES) {
			await loadAndResolveDependenciesPromise;
		}
		return module;
	}

	private async fetchModuleDependencies(
		module: Module,
		resolveStaticDependencyPromises: readonly ResolveStaticDependencyPromise[],
		resolveDynamicDependencyPromises: readonly ResolveDynamicDependencyPromise[],
		loadAndResolveDependenciesPromise: Promise<void>
	): Promise<void> {
		if (this.modulesWithLoadedDependencies.has(module)) {
			return;
		}
		this.modulesWithLoadedDependencies.add(module);
		// 并行完成静态依赖和异步依赖的解析工作
		await Promise.all([
			// 解析静态依赖
			this.fetchStaticDependencies(module, resolveStaticDependencyPromises),
			// 解析异步依赖
			this.fetchDynamicDependencies(module, resolveDynamicDependencyPromises)
		]);

		module.linkImports();
		// To handle errors when resolving dependencies or in moduleParsed
		await loadAndResolveDependenciesPromise;
	}

	// 解析 resolve 后的 依赖
	private fetchResolvedDependency(
		source: string,
		importer: string,
		resolvedId: ResolvedId
	): Promise<Module | ExternalModule> {
		if (resolvedId.external) {
			// 外部的依赖
			const { external, id, moduleSideEffects, meta } = resolvedId;
			if (!this.modulesById.has(id)) {
				this.modulesById.set(
					id,
					// 实例化 ExternalModule
					new ExternalModule(
						this.options,
						id,
						moduleSideEffects,
						meta,
						external !== 'absolute' && isAbsolute(id)
					)
				);
			}

			const externalModule = this.modulesById.get(id);
			if (!(externalModule instanceof ExternalModule)) {
				return error(errInternalIdCannotBeExternal(source, importer));
			}

			// 最后直接将实例化后的 ExternalModule 返回即可
			return Promise.resolve(externalModule);
		}

		// 非外部依赖
		// 也是调用 fetchModule 完成模块的递归解析
		// fetchModule 内部会 new Module 实例化一个正常的 Module
		return this.fetchModule(resolvedId, importer, false, false);
	}

	// 解析静态依赖
	private async fetchStaticDependencies(
		module: Module,
		resolveStaticDependencyPromises: readonly ResolveStaticDependencyPromise[]
	): Promise<void> {
		const dependencies = await Promise.all(
			resolveStaticDependencyPromises.map(resolveStaticDependencyPromise =>
				resolveStaticDependencyPromise.then(([source, resolvedId]) => {
					// source 是文件名，'./default'
					// resolvedId 是 resolve 后的产物
					// {
					//   external: false,
					//   id: "/Users/zhangjinjie/workspace/meils/github-projectx/rollup/examples/demo/default.js",
					//   meta: {},
					//   moduleSideEffects: true,
					//   syntheticNamedExports: false,
					// }

					// 解析 Resolve 过后的 依赖
					return this.fetchResolvedDependency(source, module.id, resolvedId);
				})
			)
		);

		for (const dependency of dependencies) {
			// module 和 dependency 之间的关系
			module.dependencies.add(dependency);
			dependency.importers.push(module.id);
		}

		if (!this.options.treeshake || module.info.moduleSideEffects === 'no-treeshake') {
			// 不需要开启 treeshake 的情况
			for (const dependency of module.dependencies) {
				if (dependency instanceof Module) {
					// 给依赖打标记 importedFromNotTreeshaken
					dependency.importedFromNotTreeshaken = true;
				}
			}
		}
	}

	private getNormalizedResolvedIdWithoutDefaults(
		resolveIdResult: ResolveIdResult,
		importer: string | undefined,
		source: string
	): NormalizedResolveIdWithoutDefaults | null {
		const { makeAbsoluteExternalsRelative } = this.options;
		if (resolveIdResult) {
			if (typeof resolveIdResult === 'object') {
				const external =
					resolveIdResult.external || this.options.external(resolveIdResult.id, importer, true);
				return {
					...resolveIdResult,
					external:
						external &&
						(external === 'relative' ||
							!isAbsolute(resolveIdResult.id) ||
							(external === true &&
								isNotAbsoluteExternal(resolveIdResult.id, source, makeAbsoluteExternalsRelative)) ||
							'absolute')
				};
			}

			const external = this.options.external(resolveIdResult, importer, true);
			return {
				external:
					external &&
					(isNotAbsoluteExternal(resolveIdResult, source, makeAbsoluteExternalsRelative) ||
						'absolute'),
				id:
					external && makeAbsoluteExternalsRelative
						? normalizeRelativeExternalId(resolveIdResult, importer)
						: resolveIdResult
			};
		}

		const id = makeAbsoluteExternalsRelative
			? normalizeRelativeExternalId(source, importer)
			: source;
		if (resolveIdResult !== false && !this.options.external(id, importer, true)) {
			return null;
		}
		return {
			external: isNotAbsoluteExternal(id, source, makeAbsoluteExternalsRelative) || 'absolute',
			id
		};
	}

	private getResolveDynamicImportPromises(module: Module): ResolveDynamicDependencyPromise[] {
		return module.dynamicImports.map(async dynamicImport => {
			const resolvedId = await this.resolveDynamicImport(
				module,
				typeof dynamicImport.argument === 'string'
					? dynamicImport.argument
					: dynamicImport.argument.esTreeNode,
				module.id
			);
			if (resolvedId && typeof resolvedId === 'object') {
				dynamicImport.id = resolvedId.id;
			}
			return [dynamicImport, resolvedId] as [DynamicImport, ResolvedId | string | null];
		});
	}

	private getResolveStaticDependencyPromises(module: Module): ResolveStaticDependencyPromise[] {
		return Array.from(
			module.sources,
			async source =>
				[
					source,
					(module.resolvedIds[source] =
						module.resolvedIds[source] ||
						this.handleResolveId(
							await this.resolveId(source, module.id, EMPTY_OBJECT, false),
							source,
							module.id
						))
				] as [string, ResolvedId]
		);
	}

	private getResolvedIdWithDefaults(
		resolvedId: NormalizedResolveIdWithoutDefaults | null
	): ResolvedId | null {
		if (!resolvedId) {
			return null;
		}
		const external = resolvedId.external || false;
		return {
			external,
			id: resolvedId.id,
			meta: resolvedId.meta || {},
			moduleSideEffects:
				resolvedId.moduleSideEffects ?? this.hasModuleSideEffects(resolvedId.id, !!external),
			syntheticNamedExports: resolvedId.syntheticNamedExports ?? false
		};
	}

	private async handleExistingModule(module: Module, isEntry: boolean, isPreload: PreloadType) {
		const loadPromise = this.moduleLoadPromises.get(module)!;
		if (isPreload) {
			return isPreload === RESOLVE_DEPENDENCIES
				? waitForDependencyResolution(loadPromise)
				: loadPromise;
		}
		if (isEntry) {
			module.info.isEntry = true;
			this.implicitEntryModules.delete(module);
			for (const dependant of module.implicitlyLoadedAfter) {
				dependant.implicitlyLoadedBefore.delete(module);
			}
			module.implicitlyLoadedAfter.clear();
		}
		return this.fetchModuleDependencies(module, ...(await loadPromise));
	}

	private handleResolveId(
		resolvedId: ResolvedId | null,
		source: string,
		importer: string
	): ResolvedId {
		if (resolvedId === null) {
			if (isRelative(source)) {
				return error(errUnresolvedImport(source, importer));
			}
			this.options.onwarn(errUnresolvedImportTreatedAsExternal(source, importer));
			return {
				external: true,
				id: source,
				meta: {},
				moduleSideEffects: this.hasModuleSideEffects(source, true),
				syntheticNamedExports: false
			};
		} else if (resolvedId.external && resolvedId.syntheticNamedExports) {
			this.options.onwarn(errExternalSyntheticExports(source, importer));
		}
		return resolvedId;
	}

	private async loadEntryModule(
		unresolvedId: string,
		isEntry: boolean,
		importer: string | undefined,
		implicitlyLoadedBefore: string | null
	): Promise<Module> {
		// resolve 模块 ID
		const resolveIdResult = await resolveId(
			unresolvedId,
			importer,
			this.options.preserveSymlinks,
			this.pluginDriver,
			this.resolveId,
			null,
			EMPTY_OBJECT,
			true
		);

		// resolve 失败的情况
		if (resolveIdResult == null) {
			return error(
				implicitlyLoadedBefore === null
					? errUnresolvedEntry(unresolvedId)
					: errUnresolvedImplicitDependant(unresolvedId, implicitlyLoadedBefore)
			);
		}
		if (
			resolveIdResult === false ||
			(typeof resolveIdResult === 'object' && resolveIdResult.external)
		) {
			return error(
				implicitlyLoadedBefore === null
					? errEntryCannotBeExternal(unresolvedId)
					: errImplicitDependantCannotBeExternal(unresolvedId, implicitlyLoadedBefore)
			);
		}

		// resolve success

		// 从模块文件的绝对路径开始解析
		return this.fetchModule(
			this.getResolvedIdWithDefaults(
				typeof resolveIdResult === 'object'
					? (resolveIdResult as NormalizedResolveIdWithoutDefaults)
					: { id: resolveIdResult }
			)!,
			undefined,
			isEntry,
			false
		);
	}

	private async resolveDynamicImport(
		module: Module,
		specifier: string | acorn.Node,
		importer: string
	): Promise<ResolvedId | string | null> {
		const resolution = await this.pluginDriver.hookFirst('resolveDynamicImport', [
			specifier,
			importer
		]);
		if (typeof specifier !== 'string') {
			if (typeof resolution === 'string') {
				return resolution;
			}
			if (!resolution) {
				return null;
			}
			return {
				external: false,
				moduleSideEffects: true,
				...resolution
			} as ResolvedId;
		}
		if (resolution == null) {
			return (module.resolvedIds[specifier] ??= this.handleResolveId(
				await this.resolveId(specifier, module.id, EMPTY_OBJECT, false),
				specifier,
				module.id
			));
		}
		return this.handleResolveId(
			this.getResolvedIdWithDefaults(
				this.getNormalizedResolvedIdWithoutDefaults(resolution, importer, specifier)
			),
			specifier,
			importer
		);
	}
}

function normalizeRelativeExternalId(source: string, importer: string | undefined): string {
	return isRelative(source)
		? importer
			? resolve(importer, '..', source)
			: resolve(source)
		: source;
}

function addChunkNamesToModule(
	module: Module,
	{ fileName, name }: UnresolvedModule,
	isUserDefined: boolean,
	priority: number
): void {
	if (fileName !== null) {
		module.chunkFileNames.add(fileName);
	} else if (name !== null) {
		// Always keep chunkNames sorted by priority
		let namePosition = 0;
		while (module.chunkNames[namePosition]?.priority < priority) namePosition++;
		module.chunkNames.splice(namePosition, 0, { isUserDefined, name, priority });
	}
}

function isNotAbsoluteExternal(
	id: string,
	source: string,
	makeAbsoluteExternalsRelative: boolean | 'ifRelativeSource'
): boolean {
	return (
		makeAbsoluteExternalsRelative === true ||
		(makeAbsoluteExternalsRelative === 'ifRelativeSource' && isRelative(source)) ||
		!isAbsolute(id)
	);
}

async function waitForDependencyResolution(loadPromise: LoadModulePromise) {
	const [resolveStaticDependencyPromises, resolveDynamicImportPromises] = await loadPromise;
	return Promise.all([...resolveStaticDependencyPromises, ...resolveDynamicImportPromises]);
}
