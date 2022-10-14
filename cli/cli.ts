import process from 'process';
import help from 'help.md';
import { version } from 'package.json';
import argParser from 'yargs-parser';
import { commandAliases } from '../src/utils/options/mergeOptions';
import run from './run/index';

// commandAliases 别名映射
// command 为解析后的 command 对象
const command = argParser(process.argv.slice(2), {
	alias: commandAliases,
	configuration: { 'camel-case-expansion': false }
});

// console.log('[DeBUG]: command', command, process.argv);

if (command.help || (process.argv.length <= 2 && process.stdin.isTTY)) {
	// help 命令 或者 未输入任何命令参数
	// 打印 help 内容
	console.log(`\n${help.replace('__VERSION__', version)}\n`);
} else if (command.version) {
	// -v 命令输出版本信息
	console.log(`rollup v${version}`);
} else {
	try {
		// 添加 sourcemap 支持
		require('source-map-support').install();
	} catch {
		// do nothing
	}

	// 这里是命令的执行入口
	run(command);
}
