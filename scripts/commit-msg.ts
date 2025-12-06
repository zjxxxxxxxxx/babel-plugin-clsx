import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { consola } from 'consola';

const types = ['feat', 'fix', 'perf', 'test', 'chore'];

const msg = readFileSync(resolve('.git/COMMIT_EDITMSG'), 'utf-8').trim();

// Allow type + colon + space + 1~60 characters
const commitRE = new RegExp(`^(${types.map((type) => type + ':').join('|')}) .{1,60}$`);

if (!commitRE.test(msg)) {
  consola.error(`
❌ Commit message "${msg}" does not follow the conventional format.
Expected format: <type>: <description>
Where <type> is one of: ${types.join(', ')}, and the description should be 1-60 characters.
  `);
  process.exit(1);
}
