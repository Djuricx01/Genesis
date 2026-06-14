// Consolidate the downloaded snapshots into ONE boundaries GeoJSON for the timeline filter:
//   1. order the snapshots present on disk by AxisYear,
//   2. tag every feature with [start_year, end_year) from the snapshot sequence,
//   3. normalize properties (NAME → name, BORDERPRECISION → numeric borderprecision),
//   4. merge, then simplify with mapshaper (Visvalingam) into the served file.
// Run from the project root: `npm run data:build` (or `npm run data:all` to download + build).

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { CONSOLIDATED, axisOf } from "./snapshots.mjs";

const FAR_FUTURE = 9999; // modern borders persist to "now"
const MERGED = "data/processed/boundaries.merged.geojson";
const OUT = "public/basemap/boundaries.geojson";

const present = CONSOLIDATED.filter((s) => existsSync(`data/raw/${s}.geojson`))
  .map((s) => ({ snapshot: s, axis: axisOf(s) }))
  .sort((a, b) => a.axis - b.axis);

if (present.length === 0) {
  console.error("No snapshots in data/raw/. Run `npm run data:download` first.");
  process.exit(1);
}

const features = [];
for (let i = 0; i < present.length; i++) {
  const { snapshot, axis } = present[i];
  const startYear = axis;
  const endYear = i + 1 < present.length ? present[i + 1].axis : FAR_FUTURE;

  const doc = JSON.parse(await readFile(`data/raw/${snapshot}.geojson`, "utf8"));
  for (const ft of doc.features) {
    if (!ft.geometry) continue;
    const p = ft.properties || {};
    let bp = Number(p.BORDERPRECISION);
    if (!Number.isFinite(bp)) bp = axis < 0 ? 1 : 3; // default fuzzy for antiquity
    features.push({
      type: "Feature",
      properties: {
        name: p.NAME || p.name || "",
        start_year: startYear,
        end_year: endYear,
        borderprecision: bp,
        layer: "scientific",
      },
      geometry: ft.geometry,
    });
  }
}

await mkdir("data/processed", { recursive: true });
await writeFile(MERGED, JSON.stringify({ type: "FeatureCollection", features }));
console.log(`Merged ${features.length} features from ${present.length} snapshots → ${MERGED}`);

// Simplify (Visvalingam) and round coordinates to shrink the served file. No -clean: it would
// dissolve the deliberate overlaps between different eras. The map is deliberately fuzzy, so we
// can simplify hard — this keeps the curated 29-era set to a reasonable single-download size
// (until PMTiles tiling, D-008 / Phase 7, lets us serve the full snapshot set at any resolution).
execSync(
  `npx mapshaper "${MERGED}" -simplify visvalingam 6% keep-shapes -o "${OUT}" force precision=0.02`,
  { stdio: "inherit" },
);
console.log(`Wrote ${OUT}`);
