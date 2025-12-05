import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { resolve } from 'node:path';
import enquirer from 'enquirer';
import { consola } from 'consola';
import { run } from './run';

const { name, version, files } = JSON.parse(readFileSync(resolve('./package.json'), 'utf-8'));
const examplesName = 'examples';

main();

async function main() {
  try {
    const example = await selectExample(examplesName);
    const script = await selectScript(example);

    consola.info(`Run Build ${name}@${version}`);
    run('pnpm build');

    consola.info(`Install ${name}@${version} to ${example}`);
    installModule(example);

    consola.info(`Run ${example}:${script}`);
    run(`pnpm --filter @${examplesName}/${example} ${script}`);
  } catch (err) {
    consola.error('Process exited', err);
    process.exit(1);
  }
}

/** Prompt the user to select an example */
async function selectExample(examplesName: string) {
  const examples = readdirSync(resolve(examplesName), { withFileTypes: true }).filter((dirent) =>
    dirent.isDirectory(),
  );
  const { example } = await enquirer.prompt<{ example: string }>({
    type: 'select',
    name: 'example',
    message: 'Please select the example',
    choices: examples,
  });

  return example;
}

/** Prompt the user to select a script from package.json */
async function selectScript(example: string) {
  const { scripts } = require(resolve(examplesName, example, 'package.json'));
  const { script } = await enquirer.prompt<{ script: string }>({
    type: 'select',
    name: 'script',
    message: 'Please select script',
    choices: Object.entries(scripts).map(([name, content]) => ({
      name,
      value: name,
      message: `${(name + ':').padEnd(9)}${content}`,
    })),
  });

  return script;
}

/** Install the current package into the example's node_modules */
function installModule(example: string) {
  const modPath = resolve(examplesName, example, 'node_modules', name);
  if (existsSync(modPath)) {
    const stat = lstatSync(modPath);
    if (stat.isSymbolicLink()) {
      rmSync(modPath);
    } else {
      rmSync(modPath, { recursive: true, force: true });
    }
  }
  mkdirSync(modPath);

  // Copy package files into the module directory
  const modFilePaths: string[] = [...files, 'package.json'];
  modFilePaths.forEach((filePath) => {
    copyFileSync(resolve(filePath), resolve(modPath, filePath));
  });
}
