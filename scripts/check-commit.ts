import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { consola } from 'consola';
import metadata from './metadata';

const msgPath = resolve('.git/COMMIT_EDITMSG');
const msg = readFileSync(msgPath, 'utf-8').trim();

const types = metadata.map((item) => item.type + ':').join('|');
const commitRE = new RegExp(`^(${types}) .{1,100}$`);

if (!commitRE.test(msg)) {
  consola.error('Use [pnpm cz] to create a commit message in the correct format');
  process.exit(1);
}
