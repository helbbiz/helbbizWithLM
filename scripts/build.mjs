import { cp, mkdir, access, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const requiredFiles = ['index.html', 'styles.css', 'app.js'];
for (const name of requiredFiles) {
  const source = path.join(root, name);
  try {
    await access(source);
  } catch {
    throw new Error('Required website file is missing: ' + name);
  }
  await cp(source, path.join(output, name));
}

const optionalFiles = ['features.js', 'favicon.svg', 'robots.txt', 'sitemap.xml'];
for (const name of optionalFiles) {
  const source = path.join(root, name);
  try {
    await access(source);
    await cp(source, path.join(output, name));
  } catch {
    // Optional files are copied only when they exist.
  }
}

for (const directory of ['assets', 'images', 'fonts']) {
  const source = path.join(root, directory);
  try {
    await access(source);
    await cp(source, path.join(output, directory), { recursive: true });
  } catch {
    // Optional asset directories are copied only when present.
  }
}

console.log('Build complete: website files copied to dist/.');
