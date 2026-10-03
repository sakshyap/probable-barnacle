/**
 * Parses every JavaScript file the server ships and fails on the first syntax
 * error. `node --check` on one file misses typos in the rest of the project,
 * and the admin panels are plain .js files served straight to the browser.
 *
 *   npm run check
 */
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// The root is walked recursively and SKIP keeps the noise out, so these are
// only here to document intent - '.' alone covers all of them.
const DIRECTORIES = ['.'];
const SKIP = new Set(['node_modules', 'dist', 'build', '.git', '.vite']);

function collect(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;

    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collect(full, files);
    } else if (entry.name.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
}

const targets = DIRECTORIES.filter((dir) => fs.existsSync(path.join(root, dir)))
  .flatMap((dir) => collect(path.join(root, dir)))
  .sort();

const failures = [];

for (const file of targets) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (err) {
    failures.push({ file: path.relative(root, file), output: String(err.stderr || err.message).trim() });
  }
}

if (failures.length) {
  console.error(`✖ Syntax errors in ${failures.length} of ${targets.length} file(s):\n`);
  for (const failure of failures) {
    console.error(`--- ${failure.file}`);
    console.error(`${failure.output}\n`);
  }
  process.exit(1);
}

console.log(`✔ Syntax OK for all ${targets.length} JavaScript files.`);
