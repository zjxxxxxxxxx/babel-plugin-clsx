import { execSync, type ExecSyncOptions } from 'node:child_process';

export function exec(command: string, options: ExecSyncOptions = {}) {
  return execSync(command, {
    stdio: 'inherit',
    encoding: 'utf-8',
    ...options,
  });
}
