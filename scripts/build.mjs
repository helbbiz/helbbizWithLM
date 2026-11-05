import { access, copyFile, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const output = resolve(root, "dist");
const siteFiles = ["index.html", "styles.css", "features.css", "features.js", "app.js"];

for (const file of siteFiles) {
  await access(resolve(root, file));
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const file of siteFiles) {
  await copyFile(resolve(root, file), resolve(output, file));
}

console.log(`Built ${siteFiles.length} static site files into dist/.`);
