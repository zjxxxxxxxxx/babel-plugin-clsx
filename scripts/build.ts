import { join } from 'node:path';
import { cpSync, rmSync } from 'node:fs';
import { consola } from 'consola';
import { run } from './run';

runBuild();

function runBuild() {
  try {
    const rootDir = process.cwd();
    const libDir = join(rootDir, './lib');
    const jsxDir = join(rootDir, './jsx');

    consola.info('Run Build Plugin...');
    run('tsc -p tsconfig.build.json');
    cpSync(libDir, rootDir, { recursive: true, force: true });
    rmSync(libDir, { recursive: true });

    consola.info('Run Build Jsx...');
    cpSync(jsxDir, rootDir, { recursive: true, force: true });

    consola.success('Build Success');
  } catch (err) {
    consola.error('Build Failed', err);
  }
}
