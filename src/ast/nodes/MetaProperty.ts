import type MagicString from 'magic-string';
import type { InternalModuleFormat } from '../../rollup/types';
import type { PluginDriver } from '../../utils/PluginDriver';
import { warnDeprecation } from '../../utils/error';
import type { GenerateCodeSnippets } from '../../utils/generateCodeSnippets';
import { dirname, normalize, relative } from '../../utils/path';
import { INTERACTION_ACCESSED, NodeInteraction } from '../NodeInteractions';
import type ChildScope from '../scopes/ChildScope';
import type { ObjectPath } from '../utils/PathTracker';
import type Identifier from './Identifier';
import MemberExpression from './MemberExpression';
import type * as NodeType from './NodeType';
import { NodeBase } from './shared/Node';

const ASSET_PREFIX = 'ROLLUP_ASSET_URL_';
const CHUNK_PREFIX = 'ROLLUP_CHUNK_URL_';
const FILE_PREFIX = 'ROLLUP_FILE_URL_';

export default class MetaProperty extends NodeBase {
	declare meta: Identifier;
	declare property: Identifier;
	declare type: NodeType.tMetaProperty;

	private declare metaProperty?: string | null;

	addAccessedGlobals(
		format: InternalModuleFormat,
		accessedGlobalsByScope: Map<ChildScope, Set<string>>
	): void {
		const metaProperty = this.metaProperty;
		const accessedGlobals = (
			metaProperty &&
			(metaProperty.startsWith(FILE_PREFIX) ||
				metaProperty.startsWith(ASSET_PREFIX) ||
				metaProperty.startsWith(CHUNK_PREFIX))
				? accessedFileUrlGlobals
				: accessedMetaUrlGlobals
		)[format];
		if (accessedGlobals.length > 0) {
			this.scope.addAccessedGlobals(accessedGlobals, accessedGlobalsByScope);
		}
	}

	getReferencedFileName(outputPluginDriver: PluginDriver): string | null {
		const metaProperty = this.metaProperty as string | null;
		if (metaProperty && metaProperty.startsWith(FILE_PREFIX)) {
			return outputPluginDriver.getFileName(metaProperty.substring(FILE_PREFIX.length));
		}
		return null;
	}

	hasEffects(): boolean {
		return false;
	}

	hasEffectsOnInteractionAtPath(path: ObjectPath, { type }: NodeInteraction): boolean {
		return path.length > 1 || type !== INTERACTION_ACCESSED;
	}

	include(): void {
		if (!this.included) {
			this.included = true;
			if (this.meta.name === 'import') {
				this.context.addImportMeta(this);
				const parent = this.parent;
				this.metaProperty =
					parent instanceof MemberExpression && typeof parent.propertyKey === 'string'
						? parent.propertyKey
						: null;
			}
		}
	}

	renderFinalMechanism(
		code: MagicString,
		chunkId: string,
		format: InternalModuleFormat,
		snippets: GenerateCodeSnippets,
		outputPluginDriver: PluginDriver
	): void {
		const parent = this.parent;
		const metaProperty = this.metaProperty as string | null;

		if (
			metaProperty &&
			(metaProperty.startsWith(FILE_PREFIX) ||
				metaProperty.startsWith(ASSET_PREFIX) ||
				metaProperty.startsWith(CHUNK_PREFIX))
		) {
			let referenceId: string | null = null;
			let assetReferenceId: string | null = null;
			let chunkReferenceId: string | null = null;
			let fileName: string;
			if (metaProperty.startsWith(FILE_PREFIX)) {
				referenceId = metaProperty.substring(FILE_PREFIX.length);
				fileName = outputPluginDriver.getFileName(referenceId);
			} else if (metaProperty.startsWith(ASSET_PREFIX)) {
				warnDeprecation(
					`Using the "${ASSET_PREFIX}" prefix to reference files is deprecated. Use the "${FILE_PREFIX}" prefix instead.`,
					true,
					this.context.options
				);
				assetReferenceId = metaProperty.substring(ASSET_PREFIX.length);
				fileName = outputPluginDriver.getFileName(assetReferenceId);
			} else {
				warnDeprecation(
					`Using the "${CHUNK_PREFIX}" prefix to reference files is deprecated. Use the "${FILE_PREFIX}" prefix instead.`,
					true,
					this.context.options
				);
				chunkReferenceId = metaProperty.substring(CHUNK_PREFIX.length);
				fileName = outputPluginDriver.getFileName(chunkReferenceId);
			}
			const relativePath = normalize(relative(dirname(chunkId), fileName));
			let replacement;
			if (assetReferenceId !== null) {
				replacement = outputPluginDriver.hookFirstSync('resolveAssetUrl', [
					{
						assetFileName: fileName,
						chunkId,
						format,
						moduleId: this.context.module.id,
						relativeAssetPath: relativePath
					}
				]);
			}
			if (!replacement) {
				replacement =
					outputPluginDriver.hookFirstSync('resolveFileUrl', [
						{
							assetReferenceId,
							chunkId,
							chunkReferenceId,
							fileName,
							format,
							moduleId: this.context.module.id,
							referenceId: referenceId || assetReferenceId || chunkReferenceId!,
							relativePath
						}
					]) || relativeUrlMechanisms[format](relativePath);
			}

			code.overwrite(
				(parent as MemberExpression).start,
				(parent as MemberExpression).end,
				replacement,
				{ contentOnly: true }
			);
			return;
		}

		const replacement =
			outputPluginDriver.hookFirstSync('resolveImportMeta', [
				metaProperty,
				{
					chunkId,
					format,
					moduleId: this.context.module.id
				}
			]) || importMetaMechanisms[format]?.(metaProperty, { chunkId, snippets });
		if (typeof replacement === 'string') {
			if (parent instanceof MemberExpression) {
				code.overwrite(parent.start, parent.end, replacement, { contentOnly: true });
			} else {
				code.overwrite(this.start, this.end, replacement, { contentOnly: true });
			}
		}
	}
}

const accessedMetaUrlGlobals = {
	amd: ['document', 'module', 'URL'],
	cjs: ['document', 'require', 'URL'],
	es: [],
	iife: ['document', 'URL'],
	system: ['module'],
	umd: ['document', 'require', 'URL']
};

const accessedFileUrlGlobals = {
	amd: ['document', 'require', 'URL'],
	cjs: ['document', 'require', 'URL'],
	es: [],
	iife: ['document', 'URL'],
	system: ['module', 'URL'],
	umd: ['document', 'require', 'URL']
};

const getResolveUrl = (path: string, URL = 'URL') => `new ${URL}(${path}).href`;

const getRelativeUrlFromDocument = (relativePath: string, umd = false) =>
	getResolveUrl(
		`'${relativePath}', ${
			umd ? `typeof document === 'undefined' ? location.href : ` : ''
		}document.currentScript && document.currentScript.src || document.baseURI`
	);

const getGenericImportMetaMechanism =
	(getUrl: (chunkId: string) => string) =>
	(prop: string | null, { chunkId }: { chunkId: string }) => {
		const urlMechanism = getUrl(chunkId);
		return prop === null
			? `({ url: ${urlMechanism} })`
			: prop === 'url'
			? urlMechanism
			: 'undefined';
	};

const getUrlFromDocument = (chunkId: string, umd = false) =>
	`${
		umd ? `typeof document === 'undefined' ? location.href : ` : ''
	}(document.currentScript && document.currentScript.src || new URL('${chunkId}', document.baseURI).href)`;

const relativeUrlMechanisms: Record<InternalModuleFormat, (relativePath: string) => string> = {
	amd: relativePath => {
		if (relativePath[0] !== '.') relativePath = './' + relativePath;
		return getResolveUrl(`require.toUrl('${relativePath}'), document.baseURI`);
	},
	cjs: relativePath =>
		`(typeof document === 'undefined' ? ${getResolveUrl(
			`'file:' + __dirname + '/${relativePath}'`,
			`(require('u' + 'rl').URL)`
		)} : ${getRelativeUrlFromDocument(relativePath)})`,
	es: relativePath => getResolveUrl(`'${relativePath}', import.meta.url`),
	iife: relativePath => getRelativeUrlFromDocument(relativePath),
	system: relativePath => getResolveUrl(`'${relativePath}', module.meta.url`),
	umd: relativePath =>
		`(typeof document === 'undefined' && typeof location === 'undefined' ? ${getResolveUrl(
			`'file:' + __dirname + '/${relativePath}'`,
			`(require('u' + 'rl').URL)`
		)} : ${getRelativeUrlFromDocument(relativePath, true)})`
};

const importMetaMechanisms: Record<
	string,
	(prop: string | null, options: { chunkId: string; snippets: GenerateCodeSnippets }) => string
> = {
	amd: getGenericImportMetaMechanism(() => getResolveUrl(`module.uri, document.baseURI`)),
	cjs: getGenericImportMetaMechanism(
		chunkId =>
			`(typeof document === 'undefined' ? ${getResolveUrl(
				`'file:' + __filename`,
				`(require('u' + 'rl').URL)`
			)} : ${getUrlFromDocument(chunkId)})`
	),
	iife: getGenericImportMetaMechanism(chunkId => getUrlFromDocument(chunkId)),
	system: (prop, { snippets: { getPropertyAccess } }) =>
		prop === null ? `module.meta` : `module.meta${getPropertyAccess(prop)}`,
	umd: getGenericImportMetaMechanism(
		chunkId =>
			`(typeof document === 'undefined' && typeof location === 'undefined' ? ${getResolveUrl(
				`'file:' + __filename`,
				`(require('u' + 'rl').URL)`
			)} : ${getUrlFromDocument(chunkId, true)})`
	)
};
