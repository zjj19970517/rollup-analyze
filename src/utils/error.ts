import { locate } from 'locate-character';
import type Module from '../Module';
import type {
	NormalizedInputOptions,
	RollupError,
	RollupLogProps,
	RollupWarning,
	WarningHandler
} from '../rollup/types';
import getCodeFrame from './getCodeFrame';
import { printQuotedStringList } from './printStringList';
import relativeId from './relativeId';

export function error(base: Error | RollupError): never {
	if (!(base instanceof Error)) base = Object.assign(new Error(base.message), base);
	throw base;
}

export function augmentCodeLocation(
	props: RollupLogProps,
	pos: number | { column: number; line: number },
	source: string,
	id: string
): void {
	if (typeof pos === 'object') {
		const { line, column } = pos;
		props.loc = { column, file: id, line };
	} else {
		props.pos = pos;
		const { line, column } = locate(source, pos, { offsetLine: 1 });
		props.loc = { column, file: id, line };
	}

	if (props.frame === undefined) {
		const { line, column } = props.loc;
		props.frame = getCodeFrame(source, line, column);
	}
}

export const enum Errors {
	ALREADY_CLOSED = 'ALREADY_CLOSED',
	ASSET_NOT_FINALISED = 'ASSET_NOT_FINALISED',
	ASSET_NOT_FOUND = 'ASSET_NOT_FOUND',
	ASSET_SOURCE_ALREADY_SET = 'ASSET_SOURCE_ALREADY_SET',
	ASSET_SOURCE_MISSING = 'ASSET_SOURCE_MISSING',
	BAD_LOADER = 'BAD_LOADER',
	CANNOT_EMIT_FROM_OPTIONS_HOOK = 'CANNOT_EMIT_FROM_OPTIONS_HOOK',
	CHUNK_NOT_GENERATED = 'CHUNK_NOT_GENERATED',
	CHUNK_INVALID = 'CHUNK_INVALID',
	CIRCULAR_REEXPORT = 'CIRCULAR_REEXPORT',
	CYCLIC_CROSS_CHUNK_REEXPORT = 'CYCLIC_CROSS_CHUNK_REEXPORT',
	DEPRECATED_FEATURE = 'DEPRECATED_FEATURE',
	EXTERNAL_SYNTHETIC_EXPORTS = 'EXTERNAL_SYNTHETIC_EXPORTS',
	FILE_NAME_CONFLICT = 'FILE_NAME_CONFLICT',
	FILE_NOT_FOUND = 'FILE_NOT_FOUND',
	INPUT_HOOK_IN_OUTPUT_PLUGIN = 'INPUT_HOOK_IN_OUTPUT_PLUGIN',
	INVALID_CHUNK = 'INVALID_CHUNK',
	INVALID_EXPORT_OPTION = 'INVALID_EXPORT_OPTION',
	INVALID_EXTERNAL_ID = 'INVALID_EXTERNAL_ID',
	INVALID_OPTION = 'INVALID_OPTION',
	INVALID_PLUGIN_HOOK = 'INVALID_PLUGIN_HOOK',
	INVALID_ROLLUP_PHASE = 'INVALID_ROLLUP_PHASE',
	MISSING_EXPORT = 'MISSING_EXPORT',
	MISSING_IMPLICIT_DEPENDANT = 'MISSING_IMPLICIT_DEPENDANT',
	MIXED_EXPORTS = 'MIXED_EXPORTS',
	NAMESPACE_CONFLICT = 'NAMESPACE_CONFLICT',
	AMBIGUOUS_EXTERNAL_NAMESPACES = 'AMBIGUOUS_EXTERNAL_NAMESPACES',
	NO_TRANSFORM_MAP_OR_AST_WITHOUT_CODE = 'NO_TRANSFORM_MAP_OR_AST_WITHOUT_CODE',
	PLUGIN_ERROR = 'PLUGIN_ERROR',
	PREFER_NAMED_EXPORTS = 'PREFER_NAMED_EXPORTS',
	SYNTHETIC_NAMED_EXPORTS_NEED_NAMESPACE_EXPORT = 'SYNTHETIC_NAMED_EXPORTS_NEED_NAMESPACE_EXPORT',
	UNEXPECTED_NAMED_IMPORT = 'UNEXPECTED_NAMED_IMPORT',
	UNRESOLVED_ENTRY = 'UNRESOLVED_ENTRY',
	UNRESOLVED_IMPORT = 'UNRESOLVED_IMPORT',
	VALIDATION_ERROR = 'VALIDATION_ERROR'
}

export function errAssetNotFinalisedForFileName(name: string): RollupLogProps {
	return {
		code: Errors.ASSET_NOT_FINALISED,
		message: `Plugin error - Unable to get file name for asset "${name}". Ensure that the source is set and that generate is called first.`
	};
}

export function errCannotEmitFromOptionsHook(): RollupLogProps {
	return {
		code: Errors.CANNOT_EMIT_FROM_OPTIONS_HOOK,
		message: `Cannot emit files or set asset sources in the "outputOptions" hook, use the "renderStart" hook instead.`
	};
}

export function errChunkNotGeneratedForFileName(name: string): RollupLogProps {
	return {
		code: Errors.CHUNK_NOT_GENERATED,
		message: `Plugin error - Unable to get file name for chunk "${name}". Ensure that generate is called first.`
	};
}

export function errChunkInvalid(
	{ fileName, code }: { code: string; fileName: string },
	exception: { loc: { column: number; line: number }; message: string }
): RollupLogProps {
	const errorProps = {
		code: Errors.CHUNK_INVALID,
		message: `Chunk "${fileName}" is not valid JavaScript: ${exception.message}.`
	};
	augmentCodeLocation(errorProps, exception.loc, code, fileName);
	return errorProps;
}

export function errCircularReexport(exportName: string, importedModule: string): RollupLogProps {
	return {
		code: Errors.CIRCULAR_REEXPORT,
		id: importedModule,
		message: `"${exportName}" cannot be exported from ${relativeId(
			importedModule
		)} as it is a reexport that references itself.`
	};
}

export function errCyclicCrossChunkReexport(
	exportName: string,
	exporter: string,
	reexporter: string,
	importer: string
): RollupWarning {
	return {
		code: Errors.CYCLIC_CROSS_CHUNK_REEXPORT,
		exporter,
		importer,
		message: `Export "${exportName}" of module ${relativeId(
			exporter
		)} was reexported through module ${relativeId(
			reexporter
		)} while both modules are dependencies of each other and will end up in different chunks by current Rollup settings. This scenario is not well supported at the moment as it will produce a circular dependency between chunks and will likely lead to broken execution order.\nEither change the import in ${relativeId(
			importer
		)} to point directly to the exporting module or do not use "preserveModules" to ensure these modules end up in the same chunk.`,
		reexporter
	};
}

export function errAssetReferenceIdNotFoundForSetSource(assetReferenceId: string): RollupLogProps {
	return {
		code: Errors.ASSET_NOT_FOUND,
		message: `Plugin error - Unable to set the source for unknown asset "${assetReferenceId}".`
	};
}

export function errAssetSourceAlreadySet(name: string): RollupLogProps {
	return {
		code: Errors.ASSET_SOURCE_ALREADY_SET,
		message: `Unable to set the source for asset "${name}", source already set.`
	};
}

export function errNoAssetSourceSet(assetName: string): RollupLogProps {
	return {
		code: Errors.ASSET_SOURCE_MISSING,
		message: `Plugin error creating asset "${assetName}" - no asset source set.`
	};
}

export function errBadLoader(id: string): RollupLogProps {
	return {
		code: Errors.BAD_LOADER,
		message: `Error loading ${relativeId(
			id
		)}: plugin load hook should return a string, a { code, map } object, or nothing/null`
	};
}

export function errDeprecation(deprecation: string | RollupWarning): RollupLogProps {
	return {
		code: Errors.DEPRECATED_FEATURE,
		...(typeof deprecation === 'string' ? { message: deprecation } : deprecation)
	};
}

export function errFileReferenceIdNotFoundForFilename(assetReferenceId: string): RollupLogProps {
	return {
		code: Errors.FILE_NOT_FOUND,
		message: `Plugin error - Unable to get file name for unknown file "${assetReferenceId}".`
	};
}

export function errFileNameConflict(fileName: string): RollupLogProps {
	return {
		code: Errors.FILE_NAME_CONFLICT,
		message: `The emitted file "${fileName}" overwrites a previously emitted file of the same name.`
	};
}

export function errInputHookInOutputPlugin(pluginName: string, hookName: string): RollupLogProps {
	return {
		code: Errors.INPUT_HOOK_IN_OUTPUT_PLUGIN,
		message: `The "${hookName}" hook used by the output plugin ${pluginName} is a build time hook and will not be run for that plugin. Either this plugin cannot be used as an output plugin, or it should have an option to configure it as an output plugin.`
	};
}

export function errCannotAssignModuleToChunk(
	moduleId: string,
	assignToAlias: string,
	currentAlias: string
): RollupLogProps {
	return {
		code: Errors.INVALID_CHUNK,
		message: `Cannot assign ${relativeId(
			moduleId
		)} to the "${assignToAlias}" chunk as it is already in the "${currentAlias}" chunk.`
	};
}

export function errInvalidExportOptionValue(optionValue: string): RollupLogProps {
	return {
		code: Errors.INVALID_EXPORT_OPTION,
		message: `"output.exports" must be "default", "named", "none", "auto", or left unspecified (defaults to "auto"), received "${optionValue}"`,
		url: `https://rollupjs.org/guide/en/#outputexports`
	};
}

export function errIncompatibleExportOptionValue(
	optionValue: string,
	keys: readonly string[],
	entryModule: string
): RollupLogProps {
	return {
		code: 'INVALID_EXPORT_OPTION',
		message: `"${optionValue}" was specified for "output.exports", but entry module "${relativeId(
			entryModule
		)}" has the following exports: ${keys.join(', ')}`
	};
}

export function errInternalIdCannotBeExternal(source: string, importer: string): RollupLogProps {
	return {
		code: Errors.INVALID_EXTERNAL_ID,
		message: `'${source}' is imported as an external by ${relativeId(
			importer
		)}, but is already an existing non-external module id.`
	};
}

export function errInvalidOption(
	option: string,
	urlHash: string,
	explanation: string,
	value?: string | boolean | null
): RollupLogProps {
	return {
		code: Errors.INVALID_OPTION,
		message: `Invalid value ${
			value !== undefined ? `${JSON.stringify(value)} ` : ''
		}for option "${option}" - ${explanation}.`,
		url: `https://rollupjs.org/guide/en/#${urlHash}`
	};
}

export function errInvalidAddonPluginHook(hook: string, plugin: string): RollupLogProps {
	return {
		code: Errors.INVALID_PLUGIN_HOOK,
		hook,
		message: `Error running plugin hook ${hook} for plugin ${plugin}, expected a string, a function hook or an object with a "handler" string or function.`,
		plugin
	};
}

export function errInvalidFunctionPluginHook(hook: string, plugin: string): RollupLogProps {
	return {
		code: Errors.INVALID_PLUGIN_HOOK,
		hook,
		message: `Error running plugin hook ${hook} for plugin ${plugin}, expected a function hook or an object with a "handler" function.`,
		plugin
	};
}

export function errInvalidRollupPhaseForAddWatchFile(): RollupLogProps {
	return {
		code: Errors.INVALID_ROLLUP_PHASE,
		message: `Cannot call addWatchFile after the build has finished.`
	};
}

export function errInvalidRollupPhaseForChunkEmission(): RollupLogProps {
	return {
		code: Errors.INVALID_ROLLUP_PHASE,
		message: `Cannot emit chunks after module loading has finished.`
	};
}

export function errMissingExport(
	exportName: string,
	importingModule: string,
	importedModule: string
): RollupLogProps {
	return {
		code: Errors.MISSING_EXPORT,
		message: `'${exportName}' is not exported by ${relativeId(
			importedModule
		)}, imported by ${relativeId(importingModule)}`,
		url: `https://rollupjs.org/guide/en/#error-name-is-not-exported-by-module`
	};
}

export function errImplicitDependantCannotBeExternal(
	unresolvedId: string,
	implicitlyLoadedBefore: string
): RollupLogProps {
	return {
		code: Errors.MISSING_IMPLICIT_DEPENDANT,
		message: `Module "${relativeId(
			unresolvedId
		)}" that should be implicitly loaded before "${relativeId(
			implicitlyLoadedBefore
		)}" cannot be external.`
	};
}

export function errUnresolvedImplicitDependant(
	unresolvedId: string,
	implicitlyLoadedBefore: string
): RollupLogProps {
	return {
		code: Errors.MISSING_IMPLICIT_DEPENDANT,
		message: `Module "${relativeId(
			unresolvedId
		)}" that should be implicitly loaded before "${relativeId(
			implicitlyLoadedBefore
		)}" could not be resolved.`
	};
}

export function errImplicitDependantIsNotIncluded(module: Module): RollupLogProps {
	const implicitDependencies = Array.from(module.implicitlyLoadedBefore, dependency =>
		relativeId(dependency.id)
	).sort();
	return {
		code: Errors.MISSING_IMPLICIT_DEPENDANT,
		message: `Module "${relativeId(
			module.id
		)}" that should be implicitly loaded before ${printQuotedStringList(
			implicitDependencies
		)} is not included in the module graph. Either it was not imported by an included module or only via a tree-shaken dynamic import, or no imported bindings were used and it had otherwise no side-effects.`
	};
}

export function errMixedExport(facadeModuleId: string, name?: string): RollupLogProps {
	return {
		code: Errors.MIXED_EXPORTS,
		id: facadeModuleId,
		message: `Entry module "${relativeId(
			facadeModuleId
		)}" is using named and default exports together. Consumers of your bundle will have to use \`${
			name || 'chunk'
		}["default"]\` to access the default export, which may not be what you want. Use \`output.exports: "named"\` to disable this warning`,
		url: `https://rollupjs.org/guide/en/#outputexports`
	};
}

export function errNamespaceConflict(
	name: string,
	reexportingModuleId: string,
	sources: string[]
): RollupWarning {
	return {
		code: Errors.NAMESPACE_CONFLICT,
		message: `Conflicting namespaces: "${relativeId(
			reexportingModuleId
		)}" re-exports "${name}" from one of the modules ${printQuotedStringList(
			sources.map(moduleId => relativeId(moduleId))
		)} (will be ignored)`,
		name,
		reexporter: reexportingModuleId,
		sources
	};
}

export function errAmbiguousExternalNamespaces(
	name: string,
	reexportingModule: string,
	usedModule: string,
	sources: string[]
): RollupWarning {
	return {
		code: Errors.AMBIGUOUS_EXTERNAL_NAMESPACES,
		message: `Ambiguous external namespace resolution: "${relativeId(
			reexportingModule
		)}" re-exports "${name}" from one of the external modules ${printQuotedStringList(
			sources.map(module => relativeId(module))
		)}, guessing "${relativeId(usedModule)}".`,
		name,
		reexporter: reexportingModule,
		sources
	};
}

export function errNoTransformMapOrAstWithoutCode(pluginName: string): RollupLogProps {
	return {
		code: Errors.NO_TRANSFORM_MAP_OR_AST_WITHOUT_CODE,
		message:
			`The plugin "${pluginName}" returned a "map" or "ast" without returning ` +
			'a "code". This will be ignored.'
	};
}

export function errPreferNamedExports(facadeModuleId: string): RollupLogProps {
	const file = relativeId(facadeModuleId);
	return {
		code: Errors.PREFER_NAMED_EXPORTS,
		id: facadeModuleId,
		message: `Entry module "${file}" is implicitly using "default" export mode, which means for CommonJS output that its default export is assigned to "module.exports". For many tools, such CommonJS output will not be interchangeable with the original ES module. If this is intended, explicitly set "output.exports" to either "auto" or "default", otherwise you might want to consider changing the signature of "${file}" to use named exports only.`,
		url: `https://rollupjs.org/guide/en/#outputexports`
	};
}

export function errSyntheticNamedExportsNeedNamespaceExport(
	id: string,
	syntheticNamedExportsOption: boolean | string
): RollupLogProps {
	return {
		code: Errors.SYNTHETIC_NAMED_EXPORTS_NEED_NAMESPACE_EXPORT,
		id,
		message: `Module "${relativeId(
			id
		)}" that is marked with 'syntheticNamedExports: ${JSON.stringify(
			syntheticNamedExportsOption
		)}' needs ${
			typeof syntheticNamedExportsOption === 'string' && syntheticNamedExportsOption !== 'default'
				? `an explicit export named "${syntheticNamedExportsOption}"`
				: 'a default export'
		} that does not reexport an unresolved named export of the same module.`
	};
}

export function errUnexpectedNamedImport(
	id: string,
	imported: string,
	isReexport: boolean
): RollupLogProps {
	const importType = isReexport ? 'reexport' : 'import';
	return {
		code: Errors.UNEXPECTED_NAMED_IMPORT,
		id,
		message: `The named export "${imported}" was ${importType}ed from the external module ${relativeId(
			id
		)} even though its interop type is "defaultOnly". Either remove or change this ${importType} or change the value of the "output.interop" option.`,
		url: 'https://rollupjs.org/guide/en/#outputinterop'
	};
}

export function errUnexpectedNamespaceReexport(id: string): RollupLogProps {
	return {
		code: Errors.UNEXPECTED_NAMED_IMPORT,
		id,
		message: `There was a namespace "*" reexport from the external module ${relativeId(
			id
		)} even though its interop type is "defaultOnly". This will be ignored as namespace reexports only reexport named exports. If this is not intended, either remove or change this reexport or change the value of the "output.interop" option.`,
		url: 'https://rollupjs.org/guide/en/#outputinterop'
	};
}

export function errEntryCannotBeExternal(unresolvedId: string): RollupLogProps {
	return {
		code: Errors.UNRESOLVED_ENTRY,
		message: `Entry module cannot be external (${relativeId(unresolvedId)}).`
	};
}

export function errUnresolvedEntry(unresolvedId: string): RollupLogProps {
	return {
		code: Errors.UNRESOLVED_ENTRY,
		message: `Could not resolve entry module (${relativeId(unresolvedId)}).`
	};
}

export function errUnresolvedImport(source: string, importer: string): RollupLogProps {
	return {
		code: Errors.UNRESOLVED_IMPORT,
		message: `Could not resolve '${source}' from ${relativeId(importer)}`
	};
}

export function errUnresolvedImportTreatedAsExternal(
	source: string,
	importer: string
): RollupWarning {
	return {
		code: Errors.UNRESOLVED_IMPORT,
		importer: relativeId(importer),
		message: `'${source}' is imported by ${relativeId(
			importer
		)}, but could not be resolved – treating it as an external dependency`,
		source,
		url: 'https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency'
	};
}

export function errExternalSyntheticExports(source: string, importer: string): RollupWarning {
	return {
		code: Errors.EXTERNAL_SYNTHETIC_EXPORTS,
		importer: relativeId(importer),
		message: `External '${source}' can not have 'syntheticNamedExports' enabled.`,
		source
	};
}

export function errFailedValidation(message: string): RollupLogProps {
	return {
		code: Errors.VALIDATION_ERROR,
		message
	};
}

export function errAlreadyClosed(): RollupLogProps {
	return {
		code: Errors.ALREADY_CLOSED,
		message: 'Bundle is already closed, no more calls to "generate" or "write" are allowed.'
	};
}

export function warnDeprecation(
	deprecation: string | RollupWarning,
	activeDeprecation: boolean,
	options: NormalizedInputOptions
): void {
	warnDeprecationWithOptions(
		deprecation,
		activeDeprecation,
		options.onwarn,
		options.strictDeprecations
	);
}

export function warnDeprecationWithOptions(
	deprecation: string | RollupWarning,
	activeDeprecation: boolean,
	warn: WarningHandler,
	strictDeprecations: boolean
): void {
	if (activeDeprecation || strictDeprecations) {
		const warning = errDeprecation(deprecation);
		if (strictDeprecations) {
			return error(warning);
		}
		warn(warning);
	}
}
