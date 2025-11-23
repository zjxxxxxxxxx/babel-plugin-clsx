import { execSync, type ExecSyncOptions } from 'node:child_process';
import { consola } from 'consola';

export function run(command: string, options: ExecSyncOptions = {}) {
  try {
    return execSync(command, {
      stdio: 'inherit',
      encoding: 'utf-8',
      ...options,
    });
  } catch (err) {
    consola.error(err);
    throw err;
  }
}
