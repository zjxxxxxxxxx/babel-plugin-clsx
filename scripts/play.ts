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

const examplesName = 'examples';

main();

async function main() {
  try {
    const example = await selectExample(examplesName);
    const script = await selectScript(example);

    buildIfNeeded();
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

/** Build the project if index.js does not exist */
function buildIfNeeded() {
  const indexPath = resolve('./index.js');
  if (!existsSync(indexPath)) {
    consola.info('Run Build');
    run('pnpm build');
  }
}

/** Install the current package into the example's node_modules */
function installModule(example: string) {
  const pkgPath = resolve('./package.json');
  const { name: pkgName, files: pkgFiles } = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const pkgModulePath = resolve(examplesName, example, 'node_modules', pkgName);

  consola.info(`Install ${pkgName}`);

  if (existsSync(pkgModulePath)) {
    const stat = lstatSync(pkgModulePath);
    if (stat.isSymbolicLink()) {
      rmSync(pkgModulePath);
    } else {
      rmSync(pkgModulePath, { recursive: true, force: true });
    }
  }

  mkdirSync(pkgModulePath);

  // Copy package files into the module directory
  const pkgModuleFilePaths: string[] = [...pkgFiles, 'package.json'];
  pkgModuleFilePaths.forEach((file) => {
    copyFileSync(resolve(file), resolve(pkgModulePath, file));
  });
}
