import type { Bundle, Bundle as MagicStringBundle } from 'magic-string';
import type { ChunkDependencies } from '../Chunk';
import type { NormalizedOutputOptions } from '../rollup/types';
import type { GenerateCodeSnippets } from '../utils/generateCodeSnippets';
import { getExportBlock, getNamespaceMarkers } from './shared/getExportBlock';
import getInteropBlock from './shared/getInteropBlock';
import type { FinaliserOptions } from './index';

export default function cjs(
	magicString: MagicStringBundle,
	{
		accessedGlobals,
		dependencies,
		exports,
		hasExports,
		indent: t,
		intro,
		isEntryFacade,
		isModuleFacade,
		namedExportsMode,
		outro,
		snippets
	}: FinaliserOptions,
	{
		compact,
		esModule,
		externalLiveBindings,
		freeze,
		interop,
		namespaceToStringTag,
		strict
	}: NormalizedOutputOptions
): Bundle {
	const { _, n } = snippets;

	const useStrict = strict ? `'use strict';${n}${n}` : '';
	let namespaceMarkers = getNamespaceMarkers(
		namedExportsMode && hasExports,
		isEntryFacade && esModule,
		isModuleFacade && namespaceToStringTag,
		snippets
	);
	if (namespaceMarkers) {
		namespaceMarkers += n + n;
	}
	const importBlock = getImportBlock(dependencies, snippets, compact);
	const interopBlock = getInteropBlock(
		dependencies,
		interop,
		externalLiveBindings,
		freeze,
		namespaceToStringTag,
		accessedGlobals,
		t,
		snippets
	);

	magicString.prepend(`${useStrict}${intro}${namespaceMarkers}${importBlock}${interopBlock}`);

	const exportBlock = getExportBlock(
		exports,
		dependencies,
		namedExportsMode,
		interop,
		snippets,
		t,
		externalLiveBindings,
		`module.exports${_}=${_}`
	);

	return magicString.append(`${exportBlock}${outro}`);
}

function getImportBlock(
	dependencies: ChunkDependencies,
	{ _, cnst, n }: GenerateCodeSnippets,
	compact: boolean
): string {
	let importBlock = '';
	let definingVariable = false;
	for (const { id, name, reexports, imports } of dependencies) {
		if (!reexports && !imports) {
			if (importBlock) {
				importBlock += compact && !definingVariable ? ',' : `;${n}`;
			}
			definingVariable = false;
			importBlock += `require('${id}')`;
		} else {
			importBlock += compact && definingVariable ? ',' : `${importBlock ? `;${n}` : ''}${cnst} `;
			definingVariable = true;
			importBlock += `${name}${_}=${_}require('${id}')`;
		}
	}
	if (importBlock) {
		return `${importBlock};${n}${n}`;
	}
	return '';
}
