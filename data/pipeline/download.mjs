// Download the curated historical-basemaps snapshots into data/raw/ (skips files already present).
// Source: https://github.com/aourednik/historical-basemaps (GPL-3.0 — see docs/DATA_SOURCES.md).
// Run from the project root: `npm run data:download`.

import { writeFile, mkdir, access } from "node:fs/promises";
import { SNAPSHOTS } from "./snapshots.mjs";

const BASE = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson";

await mkdir("data/raw", { recursive: true });

let got = 0;
let skipped = 0;
const failed = [];

for (const snapshot of SNAPSHOTS) {
  const file = `data/raw/${snapshot}.geojson`;
  try {
    await access(file);
    skipped++;
    continue;
  } catch {
    /* not present — download it */
  }

  try {
    const res = await fetch(`${BASE}/${snapshot}.geojson`);
    if (!res.ok) {
      failed.push(`${snapshot} (HTTP ${res.status})`);
      continue;
    }
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
    got++;
    process.stdout.write(".");
  } catch (err) {
    failed.push(`${snapshot} (${err.message})`);
  }
}

console.log(`\nDownloaded ${got}, skipped ${skipped} already present.`);
if (failed.length) console.error(`Failed: ${failed.join(", ")}`);
