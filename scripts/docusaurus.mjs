import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const args = process.argv.slice(2).filter((arg) => arg !== '--');
const commandArgs = args.length > 0 ? args : ['start'];
const docusaurusBin = fileURLToPath(new URL('../node_modules/.bin/docusaurus', import.meta.url));

const child = spawn(docusaurusBin, commandArgs, {
  stdio: 'inherit',
  env: process.env,
});

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
