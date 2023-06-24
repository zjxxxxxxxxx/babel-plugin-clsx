import { readdirSync } from 'node:fs';
import path from 'node:path';
import enquirer from 'enquirer';
import consola from 'consola';
import { execSync } from 'node:child_process';

main();

async function main() {
  try {
    const examples = readdirSync(path.resolve('./examples'));
    const { example } = await enquirer.prompt<{
      example: string;
    }>({
      type: 'select',
      name: 'example',
      message: 'Please select the example',
      choices: examples,
    });

    const scripts = require(path.resolve(
      './examples',
      example,
      'package.json',
    )).scripts;
    const { script } = await enquirer.prompt<{
      script: string;
    }>({
      type: 'select',
      name: 'script',
      message: 'Please select script',
      choices: Object.entries(scripts).map(([name, content]) => ({
        name: name,
        value: name,
        message: `${(name + ':').padEnd(10)}${content}`,
      })),
    });

    consola.info(`Run ${example}:${script}`);
    execSync(`pnpm -C examples/${example} ${script}`, {
      stdio: 'inherit',
      encoding: 'utf-8',
    });
  } catch {
    consola.error('exit');
    process.exit();
  }
}
