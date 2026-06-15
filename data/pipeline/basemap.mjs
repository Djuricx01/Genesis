// Download + simplify the Natural Earth basemap layers (land + rivers) into public/basemap/.
// Source: Natural Earth (public domain), via the nvkelso/natural-earth-vector GeoJSON mirror.
// Run from the project root: `npm run data:basemap`.
//
// Why these resolutions (the Reddit feedback, June 2026):
//   - Land/coast at 50m (was 110m): the 110m coastline is generalized so far inland that
//     coastal sites — Caral-Supe on the Peruvian coast — render in the painted sea. 50m puts
//     the coast back where it belongs and reads as a real engraved coastline, not a blocky one.
//   - Rivers at 10m (was 110m, ~13 rivers worldwide): 10m carries the tributaries that make
//     the river-valley / floodplain thesis legible (Mesopotamia, the Nile, China, the Indus).
// Both are simplified + precision-trimmed so the web payload stays small (production gzip then
// compresses GeoJSON ~6-8x on top of this).

import { writeFile, mkdir, access } from "node:fs/promises";
import mapshaper from "mapshaper";

const BASE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson";

// Each layer: the Natural Earth source file, the simplified output, and its mapshaper recipe.
const LAYERS = [
  {
    source: "ne_50m_land.geojson",
    out: "public/basemap/ne_50m_land.json",
    // Light simplification: keep the coast honest (over-simplifying would re-sink Caral).
    // keep-shapes stops small islands from being dropped entirely.
    recipe: "-simplify 55% keep-shapes -o precision=0.001 format=geojson",
  },
  {
    source: "ne_10m_rivers_lake_centerlines.geojson",
    out: "public/basemap/ne_10m_rivers.json",
    // Lines tolerate heavy simplification: the network stays readable while the payload shrinks.
    recipe: "-simplify 20% keep-shapes -o precision=0.001 format=geojson",
  },
];

await mkdir("data/raw", { recursive: true });

/** Promise wrapper over mapshaper's callback API (stable across 0.7.x). */
const run = (cmd) =>
  new Promise((resolve, reject) => mapshaper.runCommands(cmd, (err) => (err ? reject(err) : resolve())));

for (const layer of LAYERS) {
  const raw = `data/raw/${layer.source}`;

  // Download the raw Natural Earth file once (skip if already fetched).
  try {
    await access(raw);
    console.log(`• ${layer.source} already downloaded`);
  } catch {
    process.stdout.write(`• downloading ${layer.source} … `);
    const res = await fetch(`${BASE}/${layer.source}`);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${layer.source}`);
    await writeFile(raw, Buffer.from(await res.arrayBuffer()));
    console.log("done");
  }

  // Simplify → public/basemap/.
  process.stdout.write(`  simplifying → ${layer.out} … `);
  await run(`-i ${raw} ${layer.recipe} ${layer.out}`);
  console.log("done");
}

console.log("\nBasemap rebuilt. Update src/map/style.ts source paths if the filenames changed.");
