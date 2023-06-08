import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from '@jest/globals';
import { transformSync } from '@babel/core';
import { format, resolveConfig } from 'prettier';
import clsx from '../src';
import { execSync } from 'node:child_process';

const fixturesPath = path.resolve('test/fixtures');
const typesPath = path.resolve('test/types');
const formatConfig = Object.assign({}, resolveConfig.sync(process.cwd()), {
  parser: 'babel',
});

tester();

function tester() {
  test.each(readdirSync(fixturesPath))('%s', (name) => {
    const { actual, expected } = getCodes(name);
    expect(actual).toBe(expected);
  });
  test.each(readdirSync(typesPath))('%s', (name) => {
    const tsconfig = resolveTypesFileName(name, 'tsconfig.json');
    execSync(`pnpm tsc --project ${tsconfig}`);
  });
}

function getCodes(name: string) {
  const options = JSON.parse(readCode(name, 'options.json'));
  const input = readCode(name, 'input.jsx');
  const output = readCode(name, 'output.jsx');
  const result = transformSync(input, {
    plugins: [[clsx, options]],
  });
  const resultCode = result ? result.code || '' : '';

  return {
    actual: format(output, formatConfig),
    expected: format(resultCode, formatConfig),
  };
}

function readCode(name: string, filename: string) {
  const path = `${fixturesPath}/${name}/${filename}`;
  return readFileSync(path, 'utf-8');
}

function resolveTypesFileName(name: string, filename: string) {
  return `${typesPath}/${name}/${filename}`;
}
