import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ExecSyncOptions, execSync } from 'node:child_process';
import path from 'node:path';
import semver from 'semver';
import enquirer from 'enquirer';
import consola from 'consola';

export const __dirname = fileURLToPath(new URL('../', import.meta.url));
export const pkgPath = path.resolve(__dirname, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
const { version: currentVersion } = pkg;

main().catch((err) => exit(err.message));

async function main() {
  checkBranch();

  const version = await inputVersion();

  consola.info(`Update version ${currentVersion} -> ${version}`);
  updateVersion(version);

  consola.info('Changelog');
  exec('pnpm changelog');

  consola.info('Git add');
  exec('git add .');
  exec(`git commit -m "chore: release v${version}"`);
  exec(`git tag -a v${version} -m "v${version}"`);

  consola.info('Git push');
  exec('git push');

  consola.info('Git push tag');
  exec(`git push origin v${version}`);
}

function checkBranch() {
  const releaseBranch = 'main';
  const currentBranch = exec('git branch --show-current', {
    stdio: 'pipe',
  })
    .toString()
    .trim();

  if (currentBranch !== releaseBranch) {
    exit(`Please switch back to ${releaseBranch} branch for distribution.`);
  }
}

async function inputVersion() {
  const releases = createReleases();
  let targetVersion: string;

  const { release } = await enquirer.prompt<{ release: string }>({
    type: 'select',
    name: 'release',
    message: 'Please select the version type',
    choices: [...releases, 'custom'],
  });

  if (release === 'custom') {
    const { version } = await enquirer.prompt<{
      version: string;
    }>({
      type: 'input',
      name: 'version',
      message: 'Enter a custom version number',
      initial: currentVersion,
    });
    targetVersion = version;
  } else {
    targetVersion = (release.match(/\((.+)\)/) as string[])[1];
  }

  if (
    !semver.valid(targetVersion) ||
    !semver.lt(currentVersion, targetVersion)
  ) {
    exit(`Invalid version number: ${targetVersion}`);
  }

  const { yes: confirmRelease } = await enquirer.prompt<{ yes: boolean }>({
    type: 'confirm',
    name: 'yes',
    message: `Confirm release: v${targetVersion} ？`,
  });

  if (!confirmRelease) {
    exit(`Cancel release: v${targetVersion}`);
  }

  return targetVersion;
}

function createReleases() {
  const types = [
    ['patch'],
    ['minor'],
    ['major'],
    ['prepatch', 'beta'],
    ['preminor', 'beta'],
    ['premajor', 'beta'],
    ['prerelease', 'beta'],
  ];
  const releases: string[] = [];
  for (const [type, preid] of types) {
    releases.push(`${type} (${semver.inc(currentVersion, type, preid)})`);
  }
  return releases;
}

function exit(msg: string) {
  updateVersion(currentVersion);
  consola.error(msg || 'exit');
  process.exit();
}

function updateVersion(version: string) {
  pkg.version = version;

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

function exec(command: string, options: ExecSyncOptions = {}) {
  return execSync(command, {
    stdio: 'inherit',
    encoding: 'utf-8',
    ...options,
  });
}
