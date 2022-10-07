import process from 'process';
import ms from 'pretty-ms';
import { rollup } from '../../src/node-entry';
import type { MergedRollupOptions } from '../../src/rollup/types';
import { bold, cyan, green } from '../../src/utils/colors';
import relativeId from '../../src/utils/relativeId';
import { SOURCEMAPPING_URL } from '../../src/utils/sourceMappingURL';
import { handleError, stderr } from '../logging';
import type { BatchWarnings } from './batchWarnings';
import { printTimings } from './timings';

/**
 * 根据 inputOptions 执行构建任务
 * @param inputOptions
 * @param warnings
 * @param silent 是否不要向控制台打印警告
 * @returns
 */
export default async function build(
	inputOptions: MergedRollupOptions,
	warnings: BatchWarnings,
	silent = false
): Promise<unknown> {
	// 输出配置
	const outputOptions = inputOptions.output;
	const useStdout = !outputOptions[0].file && !outputOptions[0].dir; // 是否从 stdin 中读取内容
	const start = Date.now();
	const files = useStdout ? ['stdout'] : outputOptions.map(t => relativeId(t.file || t.dir!));
	if (!silent) {
		let inputFiles: string | undefined;
		if (typeof inputOptions.input === 'string') {
			inputFiles = inputOptions.input;
		} else if (inputOptions.input instanceof Array) {
			inputFiles = inputOptions.input.join(', ');
		} else if (typeof inputOptions.input === 'object' && inputOptions.input !== null) {
			inputFiles = Object.values(inputOptions.input).join(', ');
		}
		// 输出构建的信息如： cli/run/loadConfigFile.ts, src/node-entry.ts → dist...
		stderr(cyan(`\n${bold(inputFiles!)} → ${bold(files.join(', '))}...`));
	}

	// create a bundle
	const bundle = await rollup(inputOptions as any);
	console.log('[DEBUG]: useStdout', useStdout);
	if (useStdout) {
		const output = outputOptions[0];
		if (output.sourcemap && output.sourcemap !== 'inline') {
			handleError({
				code: 'ONLY_INLINE_SOURCEMAPS',
				message: 'Only inline sourcemaps are supported when bundling to stdout.'
			});
		}

		// stdin 输入流执行 generate 不需要生成磁盘文件
		const { output: outputs } = await bundle.generate(output);
		for (const file of outputs) {
			let source: string | Uint8Array;
			if (file.type === 'asset') {
				source = file.source;
			} else {
				source = file.code;
				if (output.sourcemap === 'inline') {
					source += `\n//# ${SOURCEMAPPING_URL}=${file.map!.toUrl()}\n`;
				}
			}
			if (outputs.length > 1) process.stdout.write(`\n${cyan(bold(`//→ ${file.fileName}:`))}\n`);
			// 将生成的 code 通过 process.stdout 输出
			process.stdout.write(source as Buffer);
		}
		if (!silent) {
			warnings.flush();
		}
		return;
	}

	// 正常情况下直接将输出的 code 写入到对应的磁盘文件中
	await Promise.all(outputOptions.map(bundle.write));
	// closes the bundle
	await bundle.close();
	if (!silent) {
		warnings.flush();
		stderr(green(`created ${bold(files.join(', '))} in ${bold(ms(Date.now() - start))}`));
		// 打印日志：created dist in 4s
		if (bundle && bundle.getTimings) {
			printTimings(bundle.getTimings());
		}
	}
}
