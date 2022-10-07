import ExternalVariable from './ast/variables/ExternalVariable';
import type {
	CustomPluginOptions,
	ModuleInfo,
	NormalizedInputOptions,
	NormalizedOutputOptions
} from './rollup/types';
import { EMPTY_ARRAY } from './utils/blank';
import { warnDeprecation } from './utils/error';
import { makeLegal } from './utils/identifierHelpers';
import { normalize, relative } from './utils/path';
import { printQuotedStringList } from './utils/printStringList';
import relativeId from './utils/relativeId';

export default class ExternalModule {
	readonly declarations = new Map<string, ExternalVariable>();
	defaultVariableName = '';
	readonly dynamicImporters: string[] = [];
	execIndex = Infinity;
	readonly exportedVariables = new Map<ExternalVariable, string>();
	readonly importers: string[] = [];
	readonly info: ModuleInfo;
	mostCommonSuggestion = 0;
	readonly nameSuggestions = new Map<string, number>();
	namespaceVariableName = '';
	reexported = false;
	renderPath: string = undefined as never;
	suggestedVariableName: string;
	used = false;
	variableName = '';

	constructor(
		private readonly options: NormalizedInputOptions,
		public readonly id: string,
		moduleSideEffects: boolean | 'no-treeshake',
		meta: CustomPluginOptions,
		public readonly renormalizeRenderPath: boolean
	) {
		this.suggestedVariableName = makeLegal(id.split(/[\\/]/).pop()!);

		const { importers, dynamicImporters } = this;
		const info: ModuleInfo = (this.info = {
			ast: null,
			code: null,
			dynamicallyImportedIdResolutions: EMPTY_ARRAY,
			dynamicallyImportedIds: EMPTY_ARRAY,
			get dynamicImporters() {
				return dynamicImporters.sort();
			},
			hasDefaultExport: null,
			get hasModuleSideEffects() {
				warnDeprecation(
					'Accessing ModuleInfo.hasModuleSideEffects from plugins is deprecated. Please use ModuleInfo.moduleSideEffects instead.',
					false,
					options
				);
				return info.moduleSideEffects;
			},
			id,
			implicitlyLoadedAfterOneOf: EMPTY_ARRAY,
			implicitlyLoadedBefore: EMPTY_ARRAY,
			importedIdResolutions: EMPTY_ARRAY,
			importedIds: EMPTY_ARRAY,
			get importers() {
				return importers.sort();
			},
			isEntry: false,
			isExternal: true,
			isIncluded: null,
			meta,
			moduleSideEffects,
			syntheticNamedExports: false
		});
		// Hide the deprecated key so that it only warns when accessed explicitly
		Object.defineProperty(this.info, 'hasModuleSideEffects', {
			enumerable: false
		});
	}

	getVariableForExportName(name: string): [variable: ExternalVariable] {
		const declaration = this.declarations.get(name);
		if (declaration) return [declaration];
		const externalVariable = new ExternalVariable(this, name);

		this.declarations.set(name, externalVariable);
		this.exportedVariables.set(externalVariable, name);
		return [externalVariable];
	}

	setRenderPath(options: NormalizedOutputOptions, inputBase: string): void {
		this.renderPath =
			typeof options.paths === 'function' ? options.paths(this.id) : options.paths[this.id];
		if (!this.renderPath) {
			this.renderPath = this.renormalizeRenderPath
				? normalize(relative(inputBase, this.id))
				: this.id;
		}
	}

	suggestName(name: string): void {
		const value = (this.nameSuggestions.get(name) ?? 0) + 1;
		this.nameSuggestions.set(name, value);

		if (value > this.mostCommonSuggestion) {
			this.mostCommonSuggestion = value;
			this.suggestedVariableName = name;
		}
	}

	warnUnusedImports(): void {
		const unused = Array.from(this.declarations)
			.filter(
				([name, declaration]) =>
					name !== '*' && !declaration.included && !this.reexported && !declaration.referenced
			)
			.map(([name]) => name);

		if (unused.length === 0) return;

		const importersSet = new Set<string>();
		for (const name of unused) {
			for (const importer of this.declarations.get(name)!.module.importers) {
				importersSet.add(importer);
			}
		}
		const importersArray = [...importersSet];
		this.options.onwarn({
			code: 'UNUSED_EXTERNAL_IMPORT',
			message: `${printQuotedStringList(unused, ['is', 'are'])} imported from external module "${
				this.id
			}" but never used in ${printQuotedStringList(
				importersArray.map(importer => relativeId(importer))
			)}.`,
			names: unused,
			source: this.id,
			sources: importersArray
		});
	}
}
