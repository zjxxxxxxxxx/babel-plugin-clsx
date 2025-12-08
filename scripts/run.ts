import { execSync, type ExecSyncOptions } from 'node:child_process';
import { consola } from 'consola';

export function run(file: string, args: (string | string[])[] = [], options: ExecSyncOptions = {}) {
  try {
    return execSync([file, args].flat(2).join(' '), {
      stdio: 'inherit',
      encoding: 'utf-8',
      ...options,
    });
  } catch (err) {
    consola.error(err);
    throw err;
  }
}
