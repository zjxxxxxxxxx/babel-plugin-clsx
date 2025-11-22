import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { cpSync } from 'node:fs';
import consola from 'consola';

runBuild();

function runBuild() {
  try {
    const destDir = process.cwd();
    const srcDir = join(destDir, './jsx');

    console.log();
    consola.info('Run Build Plugin...');
    execSync('tsc -p tsconfig.build.json --module commonjs --outDir ./lib', {
      stdio: 'inherit',
      encoding: 'utf-8',
    });

    console.log();
    consola.info('Run Build Jsx...');
    cpSync(srcDir, destDir, { recursive: true, force: true });

    console.log();
    consola.success('Build Success');
  } catch (err) {
    console.log();
    consola.error('Build Failed', err);
  }
}
