/**
 * Swappable boundary source (decision D-002: the GPL-3.0 hedge).
 *
 * The whole app reads its boundary dataset through this one module. To change datasets (e.g.
 * if the GPL-3.0 question forces a move to the CC-BY fallback before a public release), point
 * ACTIVE at a different source here: nothing in the map/render code needs to change.
 */
export interface BoundarySource {
  id: string;
  /** Path (resolved against Vite's base) to the consolidated boundaries GeoJSON. */
  url: string;
  /** Attribution string shown in the map's attribution control. */
  attribution: string;
  /** License of the underlying data: surfaced for the credits UI and our own clarity. */
  license: string;
}

/** Primary: purpose-built historical boundaries. Copyleft: see docs/DATA_SOURCES.md. */
export const HISTORICAL_BASEMAPS: BoundarySource = {
  id: "historical-basemaps",
  url: "basemap/boundaries.geojson",
  attribution:
    'Historical boundaries: <a href="https://github.com/aourednik/historical-basemaps" target="_blank" rel="noopener">historical-basemaps</a> (GPL-3.0)',
  license: "GPL-3.0",
};

/**
 * Fallback: permissive modern boundaries + (eventually) independently traced antiquity zones.
 * Not built yet: its file would be produced by a parallel pipeline. Kept here so the swap is
 * a one-line change when/if needed.
 */
export const GEOBOUNDARIES_FALLBACK: BoundarySource = {
  id: "geoboundaries",
  url: "basemap/boundaries.fallback.geojson",
  attribution:
    'Boundaries: <a href="https://www.geoboundaries.org/" target="_blank" rel="noopener">geoBoundaries</a> (CC-BY 4.0)',
  license: "CC-BY-4.0",
};

/** The active source. Swap this single binding to change datasets app-wide. */
export const ACTIVE_BOUNDARY_SOURCE: BoundarySource = HISTORICAL_BASEMAPS;
