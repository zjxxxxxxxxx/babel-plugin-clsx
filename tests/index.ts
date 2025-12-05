import { readdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { exec } from 'node:child_process';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { expect, test, describe } from '@jest/globals';
import { transformAsync } from '@babel/core';
import { format, resolveConfig } from 'prettier';
import clsx from '../src/index';

const fixturesPath = resolve('fixtures');
const typesPath = resolve('types');
const execAsync = promisify(exec);
const formatConfigPromise = resolveConfig(process.cwd()).then((config) =>
  Object.assign({}, config ?? {}, {
    parser: 'babel',
  }),
);

describe('fixtures tests', () => {
  test.each(readdirSync(fixturesPath))('%s', async (name) => {
    const { actual, expected } = await getCodes(name);
    expect(actual).toBe(expected);
  });
});

describe('error tests', () => {
  test('throws error if _clsx variable already exists', async () => {
    const code = `
      const _clsx = 123;
      <div className={['c1', 'c2']} />;
    `;

    await expect(
      transformAsync(code, {
        filename: 'example.jsx',
        plugins: [[clsx]],
      }),
    ).rejects.toThrow(/\[babel-plugin-clsx\]: '_clsx' is a reserved identifier for clsx import\. Do not declare or use '_clsx' in this file\./);
  });
});

describe('types tests', () => {
  test.each(readdirSync(typesPath))('%s', async (name) => {
    await execAsync(`tsc --project ${typesPath}/${name}/tsconfig.json`);
  });
});

async function getCodes(name: string) {
  const [options, input, output, formatConfig] = await Promise.all([
    readCodeString(name, 'options.json'),
    readCodeString(name, 'input.jsx'),
    readCodeString(name, 'output.jsx'),
    formatConfigPromise,
  ]);
  const result =
    (
      await transformAsync(input, {
        filename: resolve(fixturesPath, name, 'input.jsx'),
        plugins: [[clsx, JSON.parse(options)]],
      })
    )?.code ?? '';

  return {
    actual: format(result, formatConfig),
    expected: format(output, formatConfig),
  };
}

function readCodeString(name: string, filename: string) {
  return readFile(resolve(fixturesPath, name, filename), 'utf-8');
}
