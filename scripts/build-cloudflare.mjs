import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });

for (const directory of ["assets", "pages"]) {
  await fs.cp(path.join(root, directory), path.join(dist, directory), {
    recursive: true,
  });
}

for (const file of [
  "index.html",
  "google-merchant-feed.xml",
  "pinterest-catalog.xml",
  "robots.txt",
  "sitemap.xml",
]) {
  await fs.copyFile(path.join(root, file), path.join(dist, file));
}

console.log("Cloudflare static bundle created in dist/");
