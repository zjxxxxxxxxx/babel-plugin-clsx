import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test } from '@jest/globals';
import { transformSync } from '@babel/core';
import { format, resolveConfig } from 'prettier';
import { run } from '../scripts/run';
import clsx from '../src/index';

const fixturesPath = resolve('fixtures');
const typesPath = resolve('types');
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
    run(`tsc --project ${typesPath}/${name}/tsconfig.json`);
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
