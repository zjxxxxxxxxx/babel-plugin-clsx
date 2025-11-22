import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import enquirer from 'enquirer';
import { consola } from 'consola';
import { exec } from './exec';

main();

async function main() {
  try {
    const examplesName = 'examples';

    const examplesPath = resolve(examplesName);
    const examples = readdirSync(examplesPath).filter((i) => i !== '.DS_Store');
    const { example } = await enquirer.prompt<{
      example: string;
    }>({
      type: 'select',
      name: 'example',
      message: 'Please select the example',
      choices: examples,
    });

    const packagePath = resolve(examplesName, example, 'package.json');
    const { scripts } = require(packagePath);
    const { script } = await enquirer.prompt<{
      script: string;
    }>({
      type: 'select',
      name: 'script',
      message: 'Please select script',
      choices: Object.entries(scripts).map(([name, content]) => ({
        name: name,
        value: name,
        message: `${(name + ':').padEnd(9)}${content}`,
      })),
    });

    consola.info(`Run ${example}:${script}`);
    exec(`pnpm -C ${examplesName}/${example} link ${resolve()}`);
    exec(`pnpm --filter @examples/${example} ${script}`);
  } catch {
    consola.error('exit');
    process.exit();
  }
}
