import { expect, test } from '@jest/globals';
import { readFileSync, readdirSync } from 'fs';
import { format, resolveConfig } from 'prettier';
import { transformSync } from '@babel/core';
import transformClsx from '../src/index';

const fixturesPath = `${process.cwd()}/test/fixtures`;
const formatConfig = Object.assign({}, resolveConfig.sync(process.cwd()), {
  parser: 'babel',
});


runner();

 

function runner() {
  test.each(readdirSync(fixturesPath))('%s', (name) => {
    const { actual, expected } = getCodes(name);
    expect(actual).toBe(expected);
  });
}

function getCodes(name: string) {
  const options = JSON.parse(readCode(name, 'options.json'));
  const input = readCode(name, 'input.jsx');
  const output = readCode(name, 'output.jsx');
  const result = transformSync(input, {
    babelrc: true,
    plugins: [[transformClsx, options]],
  });
  const resultCode = result ? result.code || '' : '';

  return {
    actual: format(output, formatConfig),
    expected: format(resultCode, formatConfig),
  };
}

function readCode(name: string, filename: string) {
  const path = `${fixturesPath}/${name}/${filename}`;
  return readFileSync(path).toString('utf-8');
}
