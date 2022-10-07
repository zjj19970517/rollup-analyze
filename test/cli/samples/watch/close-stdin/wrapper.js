#!/usr/bin/env node

const stream = require('stream');
const { mkdirSync, readFileSync, writeFileSync } = require('fs');
const chokidar = require('chokidar');
const path = require('path');

delete process.stdin;
process.stdin = new stream.Readable({
	encoding: 'utf8',
	read() {
		return null;
	}
});

const outputDir = path.resolve(__dirname, '_actual');
mkdirSync(outputDir);
const outputFile = path.resolve(outputDir, 'out.js');
const INITIAL_OUTPUT = 'NOT WRITTEN';
writeFileSync(outputFile, INITIAL_OUTPUT);

const watcher = chokidar.watch(outputFile).on('change', () => {
	if (readFileSync(outputFile, 'utf8') !== INITIAL_OUTPUT) {
		watcher.close();
		// This closes stdin
		process.stdin.push(null);
	}
});

require('../../../../../dist/bin/rollup');
