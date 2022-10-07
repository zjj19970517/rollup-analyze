import ExternalModule from '../ExternalModule';
import Module from '../Module';
import { getOrCreate } from './getOrCreate';

type DependentModuleMap = Map<Module, Set<Module>>;
type ChunkDefinitions = { alias: string | null; modules: Module[] }[];

export function getChunkAssignments(
	entryModules: readonly Module[],
	manualChunkAliasByEntry: ReadonlyMap<Module, string>
): ChunkDefinitions {
	const chunkDefinitions: ChunkDefinitions = [];
	const modulesInManualChunks = new Set(manualChunkAliasByEntry.keys());
	const manualChunkModulesByAlias: Record<string, Module[]> = Object.create(null);
	for (const [entry, alias] of manualChunkAliasByEntry) {
		const chunkModules = (manualChunkModulesByAlias[alias] =
			manualChunkModulesByAlias[alias] || []);
		addStaticDependenciesToManualChunk(entry, chunkModules, modulesInManualChunks);
	}
	for (const [alias, modules] of Object.entries(manualChunkModulesByAlias)) {
		chunkDefinitions.push({ alias, modules });
	}

	const assignedEntryPointsByModule: DependentModuleMap = new Map();
	const { dependentEntryPointsByModule, dynamicEntryModules } = analyzeModuleGraph(entryModules);
	const dynamicallyDependentEntryPointsByDynamicEntry: DependentModuleMap =
		getDynamicDependentEntryPoints(dependentEntryPointsByModule, dynamicEntryModules);
	const staticEntries = new Set(entryModules);

	function assignEntryToStaticDependencies(
		entry: Module,
		dynamicDependentEntryPoints: ReadonlySet<Module> | null
	) {
		const modulesToHandle = new Set([entry]);
		for (const module of modulesToHandle) {
			const assignedEntryPoints = getOrCreate(assignedEntryPointsByModule, module, () => new Set());
			if (
				dynamicDependentEntryPoints &&
				areEntryPointsContainedOrDynamicallyDependent(
					dynamicDependentEntryPoints,
					dependentEntryPointsByModule.get(module)!
				)
			) {
				continue;
			} else {
				assignedEntryPoints.add(entry);
			}
			for (const dependency of module.getDependenciesToBeIncluded()) {
				if (!(dependency instanceof ExternalModule || modulesInManualChunks.has(dependency))) {
					modulesToHandle.add(dependency);
				}
			}
		}
	}

	function areEntryPointsContainedOrDynamicallyDependent(
		entryPoints: ReadonlySet<Module>,
		containedIn: ReadonlySet<Module>
	): boolean {
		const entriesToCheck = new Set(entryPoints);
		for (const entry of entriesToCheck) {
			if (!containedIn.has(entry)) {
				if (staticEntries.has(entry)) return false;
				const dynamicallyDependentEntryPoints =
					dynamicallyDependentEntryPointsByDynamicEntry.get(entry)!;
				for (const dependentEntry of dynamicallyDependentEntryPoints) {
					entriesToCheck.add(dependentEntry);
				}
			}
		}
		return true;
	}

	for (const entry of entryModules) {
		if (!modulesInManualChunks.has(entry)) {
			assignEntryToStaticDependencies(entry, null);
		}
	}

	for (const entry of dynamicEntryModules) {
		if (!modulesInManualChunks.has(entry)) {
			assignEntryToStaticDependencies(
				entry,
				dynamicallyDependentEntryPointsByDynamicEntry.get(entry)!
			);
		}
	}

	chunkDefinitions.push(
		...createChunks([...entryModules, ...dynamicEntryModules], assignedEntryPointsByModule)
	);
	return chunkDefinitions;
}

function addStaticDependenciesToManualChunk(
	entry: Module,
	manualChunkModules: Module[],
	modulesInManualChunks: Set<Module>
): void {
	const modulesToHandle = new Set([entry]);
	for (const module of modulesToHandle) {
		modulesInManualChunks.add(module);
		manualChunkModules.push(module);
		for (const dependency of module.dependencies) {
			if (!(dependency instanceof ExternalModule || modulesInManualChunks.has(dependency))) {
				modulesToHandle.add(dependency);
			}
		}
	}
}

function analyzeModuleGraph(entryModules: readonly Module[]): {
	dependentEntryPointsByModule: DependentModuleMap;
	dynamicEntryModules: Set<Module>;
} {
	const dynamicEntryModules = new Set<Module>();
	const dependentEntryPointsByModule: DependentModuleMap = new Map();
	const entriesToHandle = new Set(entryModules);
	for (const currentEntry of entriesToHandle) {
		const modulesToHandle = new Set([currentEntry]);
		for (const module of modulesToHandle) {
			getOrCreate(dependentEntryPointsByModule, module, () => new Set()).add(currentEntry);
			for (const dependency of module.getDependenciesToBeIncluded()) {
				if (!(dependency instanceof ExternalModule)) {
					modulesToHandle.add(dependency);
				}
			}
			for (const { resolution } of module.dynamicImports) {
				if (resolution instanceof Module && resolution.includedDynamicImporters.length > 0) {
					dynamicEntryModules.add(resolution);
					entriesToHandle.add(resolution);
				}
			}
			for (const dependency of module.implicitlyLoadedBefore) {
				dynamicEntryModules.add(dependency);
				entriesToHandle.add(dependency);
			}
		}
	}
	return { dependentEntryPointsByModule, dynamicEntryModules };
}

function getDynamicDependentEntryPoints(
	dependentEntryPointsByModule: DependentModuleMap,
	dynamicEntryModules: ReadonlySet<Module>
): DependentModuleMap {
	const dynamicallyDependentEntryPointsByDynamicEntry: DependentModuleMap = new Map();
	for (const dynamicEntry of dynamicEntryModules) {
		const dynamicDependentEntryPoints = getOrCreate(
			dynamicallyDependentEntryPointsByDynamicEntry,
			dynamicEntry,
			() => new Set()
		);
		for (const importer of [
			...dynamicEntry.includedDynamicImporters,
			...dynamicEntry.implicitlyLoadedAfter
		]) {
			for (const entryPoint of dependentEntryPointsByModule.get(importer)!) {
				dynamicDependentEntryPoints.add(entryPoint);
			}
		}
	}
	return dynamicallyDependentEntryPointsByDynamicEntry;
}

function createChunks(
	allEntryPoints: readonly Module[],
	assignedEntryPointsByModule: DependentModuleMap
): ChunkDefinitions {
	const chunkModules: { [chunkSignature: string]: Module[] } = Object.create(null);
	for (const [module, assignedEntryPoints] of assignedEntryPointsByModule) {
		let chunkSignature = '';
		for (const entry of allEntryPoints) {
			chunkSignature += assignedEntryPoints.has(entry) ? 'X' : '_';
		}
		const chunk = chunkModules[chunkSignature];
		if (chunk) {
			chunk.push(module);
		} else {
			chunkModules[chunkSignature] = [module];
		}
	}
	return Object.values(chunkModules).map(modules => ({
		alias: null,
		modules
	}));
}
