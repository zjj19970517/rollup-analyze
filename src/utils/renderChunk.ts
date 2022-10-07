import type {
	DecodedSourceMapOrMissing,
	NormalizedOutputOptions,
	Plugin,
	RenderedChunk,
	SourceMapInput
} from '../rollup/types';
import type { PluginDriver } from './PluginDriver';
import { decodedSourcemap } from './decodedSourcemap';

export default function renderChunk({
	code,
	options,
	outputPluginDriver,
	renderChunk,
	sourcemapChain
}: {
	code: string;
	options: NormalizedOutputOptions;
	outputPluginDriver: PluginDriver;
	renderChunk: RenderedChunk;
	sourcemapChain: DecodedSourceMapOrMissing[];
}): Promise<string> {
	const renderChunkReducer = (
		code: string,
		result: { code: string; map?: SourceMapInput } | string | null | undefined,
		plugin: Plugin
	): string => {
		if (result == null) return code;

		if (typeof result === 'string')
			result = {
				code: result,
				map: undefined
			};

		// strict null check allows 'null' maps to not be pushed to the chain, while 'undefined' gets the missing map warning
		if (result.map !== null) {
			const map = decodedSourcemap(result.map);
			sourcemapChain.push(map || { missing: true, plugin: plugin.name });
		}

		return result.code;
	};

	return outputPluginDriver.hookReduceArg0(
		'renderChunk',
		[code, renderChunk, options],
		renderChunkReducer
	);
}
