import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { expect, test } from '@jest/globals';
import { transformSync } from '@babel/core';
import { format, resolveConfig } from 'prettier';
import clsx from '../src/index';

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
    execSync(`pnpm tsc --project ${typesPath}/${name}/tsconfig.json`);
  });
}

function getCodes(name: string) {
  const options = JSON.parse(readCodeString(name, 'options.json'));
  const input = readCodeString(name, 'input.jsx');
  const output = readCodeString(name, 'output.jsx');
  const result =
    transformSync(input, {
      plugins: [[clsx, options]],
    })?.code ?? '';

  return {
    actual: format(result, formatConfig),
    expected: format(output, formatConfig),
  };
}

function readCodeString(name: string, filename: string) {
  return readFileSync(`${fixturesPath}/${name}/${filename}`, 'utf-8');
}
