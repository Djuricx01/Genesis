// The curated set of historical-basemaps world snapshots Genesis consolidates, in chronological
// order. Each is a still photo of the world at one year; the build script infers each feature's
// lifespan as [this snapshot, next snapshot). Edit this list to add/remove eras, then re-run
// `npm run data:all`. (Full available set is larger — see the repo's /geojson directory.)

export const SNAPSHOTS = [
  "world_bc10000",
  "world_bc8000",
  "world_bc5000",
  "world_bc4000",
  "world_bc3000",
  "world_bc2000",
  "world_bc1500",
  "world_bc1000",
  "world_bc700",
  "world_bc500",
  "world_bc400",
  "world_bc323",
  "world_bc300",
  "world_bc200",
  "world_bc100",
  "world_bc1",
  "world_100",
  "world_200",
  "world_300",
  "world_400",
  "world_500",
  "world_600",
  "world_700",
  "world_800",
  "world_900",
  "world_1000",
  "world_1100",
  "world_1200",
  "world_1279",
  "world_1300",
  "world_1400",
  "world_1492",
  "world_1500",
  "world_1530",
  "world_1600",
  "world_1650",
  "world_1700",
  "world_1715",
  "world_1783",
  "world_1800",
  "world_1815",
  "world_1880",
  "world_1900",
  "world_1914",
  "world_1920",
  "world_1945",
  "world_1960",
  "world_2010",
];

// The subset actually baked into the single served GeoJSON. A consolidated all-eras file scales
// with feature count, and all 48 snapshots land ~16 MB — too heavy for one download. Until we add
// PMTiles tiling (deferred, see DECISIONS.md D-008), we consolidate a curated spread: strong
// antiquity coverage (the app's focus, and cheap), key historical pivots, a few modern. The full
// set stays downloaded for when tiling lets us use all of it.
// Curated for the app's antiquity focus. Deep-time steps are cheap (few features each) and where
// the cradles live, so we add them generously; modern eras are feature-dense (hundreds of small
// states) and dominate file size, so we add only high-value pivots. The dense modern record is the
// exact case PMTiles tiling solves — see DECISIONS.md D-008 (Phase 7).
export const CONSOLIDATED = [
  "world_bc10000",
  "world_bc8000",
  "world_bc5000", // fills the long bc8000→bc4000 gap
  "world_bc4000",
  "world_bc3000",
  "world_bc2000",
  "world_bc1500", // bronze-age step (bc2000→bc1000)
  "world_bc1000",
  "world_bc700", // iron-age step (bc1000→bc500)
  "world_bc500",
  "world_bc323",
  "world_bc200", // Roman/Hellenistic expansion (bc323→bc1)
  "world_bc1",
  "world_100",
  "world_500",
  "world_1000",
  "world_1279",
  "world_1492",
  "world_1600",
  "world_1700", // the "Ottoman in 1700" case (was 1600→1715)
  "world_1715",
  "world_1815",
  "world_1914",
  "world_1945",
  "world_2010",
];

/**
 * Parse a snapshot base name to an AxisYear (proleptic Gregorian decimal, no year zero).
 * "world_bc2000" → 1 - 2000 = -1999 · "world_1000" → 1000 · "world_bc1" → 0.
 * Mirrors the bce()/ce() logic in src/timeline/era.ts — keep them consistent.
 */
export function axisOf(snapshot) {
  const m = snapshot.match(/^world_(bc)?(\d+)$/);
  if (!m) throw new Error(`Unrecognized snapshot name: ${snapshot}`);
  const isBce = Boolean(m[1]);
  const year = Number(m[2]);
  return isBce ? 1 - year : year;
}
