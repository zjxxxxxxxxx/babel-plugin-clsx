import { execSync } from 'node:child_process';
import enquirer from 'enquirer';
import consola from 'consola';
import metadata from './commit-metadata';

main();

async function main() {
  try {
    const { type } = await enquirer.prompt<{ type: string }>({
      type: 'select',
      name: 'type',
      message: 'Select the commit type',
      choices: metadata.map((item) => ({
        name: item.type,
        value: item.type,
        message: `${(item.type + ':').padEnd(8)}${item.section}`,
      })),
    });

    const { content } = await enquirer.prompt<{
      content: string;
    }>({
      type: 'input',
      name: 'content',
      message: 'Please enter the change description',
    });

    if (!content.trim()) {
      consola.error('The change description cannot be empty');
      process.exit();
    }

    consola.info('Git commit');
    execSync(`git commit -m '${type}: ${content}'`, {
      stdio: 'inherit',
    });
  } catch {
    consola.error('exit');
    process.exit();
  }
}
