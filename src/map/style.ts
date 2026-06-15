import type { StyleSpecification, ExpressionSpecification } from "maplibre-gl";
import { palette } from "../style/palette";
import { ACTIVE_BOUNDARY_SOURCE } from "./boundarySource";
import { ACTIVE_OVERLAY } from "./overlaySource";

/** Resolve a /public asset path against Vite's base (works in dev "/" and built "./"). */
function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}

/**
 * The antique base style (§8). No glyphs/sprite: the POC labels cradles with HTML markers,
 * so we don't need a font server. Layer order is bottom → top.
 *
 * Fuzzy frontiers are data-driven: `line-blur` and `fill-opacity` interpolate on each
 * boundary's `borderprecision` (1 = approximate → soft/feathered; 5 = surveyed → crisp).
 * That single binding is what makes "honesty about uncertainty" visible (§2, D-005).
 */
export function buildStyle(): StyleSpecification {
  // Fuzziness has TWO inputs (D-005, Phase 5):
  //   1. borderprecision: how surveyed a frontier is (per feature; modern = crisp).
  //   2. start_year: how deep in time it sits. Antiquity grows progressively vaguer the further
  //      back you scrub, so an 8000 BCE polity feathers into a soft blob while a 1700 CE border
  //      stays sharp. The age terms are 0 for CE-era features, so the modern look is unchanged.
  // True per-feature radial gradients aren't expressible in MapLibre paint, so the deep-time
  // "core → buffer" look is approximated: a faint, slightly stronger fill (the core) under a wide,
  // heavily blurred, faint outline (the buffer).
  const sum = (a: ExpressionSpecification, b: ExpressionSpecification): ExpressionSpecification =>
    ["+", a, b];
  const byPrecision = (lo: number, mid: number, hi: number): ExpressionSpecification =>
    ["interpolate", ["linear"], ["get", "borderprecision"], 1, lo, 3, mid, 5, hi];
  // start_year stops run deep→recent; all clamp to 0 at/after 1 CE, leaving CE eras untouched.
  const byAge = (deep: number, mid: number): ExpressionSpecification =>
    ["interpolate", ["linear"], ["get", "start_year"], -8000, deep, -1000, mid, 0, 0];

  const fillOpacity = sum(byPrecision(0.12, 0.24, 0.3), byAge(0.08, 0.03));
  const lineWidth = sum(byPrecision(1, 1.4, 1.6), byAge(2.5, 0.8));
  const lineBlur = sum(byPrecision(3.5, 0.6, 0), [
    "interpolate",
    ["linear"],
    ["get", "start_year"],
    -8000, 9,
    -3000, 5,
    -1000, 2,
    0, 0,
  ]);
  const lineOpacity: ExpressionSpecification = [
    "interpolate",
    ["linear"],
    ["get", "start_year"],
    -8000, 0.38,
    -2000, 0.55,
    -500, 0.7,
    0, 0.8,
  ];

  const style: StyleSpecification = {
    version: 8,
    // No `glyphs` key: the POC has no text layers (cradles use HTML markers), and MapLibre's
    // validator rejects `glyphs: undefined`: the key must be a string URL or absent entirely.
    sources: {
      land: { type: "geojson", data: asset("basemap/ne_50m_land.json") },
      rivers: { type: "geojson", data: asset("basemap/ne_10m_rivers.json") },
      boundaries: { type: "geojson", data: asset(ACTIVE_BOUNDARY_SOURCE.url) },
      // Scriptural lens (§10): the Eden zone + the four rivers (Phase 4). Hand-authored,
      // illustrative geometry: see public/scriptural/eden.geojson.
      scriptural: { type: "geojson", data: asset("scriptural/eden.geojson") },
    },
    layers: [
      // Sea = bare parchment.
      {
        id: "sea",
        type: "background",
        paint: { "background-color": palette.sea },
      },
      // Land fill.
      {
        id: "land-fill",
        type: "fill",
        source: "land",
        paint: { "fill-color": palette.land },
      },
      // Soft bleed under the coast (engraved-hatching feel).
      {
        id: "coast-bleed",
        type: "line",
        source: "land",
        paint: {
          "line-color": palette.coastBleed,
          "line-width": 3,
          "line-blur": 3,
          "line-opacity": 0.35,
        },
      },
      // Crisp coast ink on top of the bleed.
      {
        id: "coast-ink",
        type: "line",
        source: "land",
        paint: {
          "line-color": palette.coastInk,
          "line-width": 0.9,
          "line-opacity": 0.85,
        },
      },
      // Rivers: the spine of the river-valley thesis.
      {
        id: "rivers",
        type: "line",
        source: "rivers",
        paint: {
          "line-color": palette.river,
          "line-width": ["interpolate", ["linear"], ["zoom"], 2, 0.5, 7, 1.6],
          "line-opacity": 0.7,
        },
      },
      // Political area wash: opacity scales with border precision AND era (deeper = a touch
      // stronger to read as a soft core, since its outline all but dissolves).
      {
        id: "boundaries-fill",
        type: "fill",
        source: "boundaries",
        paint: {
          "fill-color": palette.boundaryWash,
          "fill-opacity": fillOpacity,
        },
      },
      // Frontier line: blur grows (and the line widens + fades) with both low precision and deep
      // antiquity, so ancient frontiers feather into buffers while modern borders stay crisp.
      {
        id: "boundaries-outline",
        type: "line",
        source: "boundaries",
        paint: {
          "line-color": palette.boundaryInk,
          "line-width": lineWidth,
          "line-blur": lineBlur,
          "line-opacity": lineOpacity,
        },
      },

      /* ── Scriptural lens layers (§10) ──────────────────────────────────────────────
         Hidden by default; the perspective toggle flips `visibility`. Same honesty model
         as the political boundaries: confidence drives the look. The Eden zone and the two
         contested paleo-rivers (Pishon/Gihon) render fuzzy/dashed; the two secure rivers
         (Tigris/Euphrates) render crisp. dasharray can't be data-driven in MapLibre, so the
         rivers are split into two confidence-filtered layers rather than one. */

      // Eden zone: soft gilt wash (contested → faint, like a low-precision frontier).
      {
        id: "eden-zone-fill",
        type: "fill",
        source: "scriptural",
        filter: ["==", ["get", "kind"], "zone"],
        layout: { visibility: "none" },
        paint: { "fill-color": palette.scriptureContested, "fill-opacity": 0.22 },
      },
      // Eden zone edge: dashed + blurred: a proposed region, never a surveyed border.
      {
        id: "eden-zone-line",
        type: "line",
        source: "scriptural",
        filter: ["==", ["get", "kind"], "zone"],
        layout: { visibility: "none", "line-cap": "round" },
        paint: {
          "line-color": palette.scriptureContested,
          "line-width": 2,
          "line-blur": 1.6,
          "line-dasharray": [2, 2.5],
          "line-opacity": 0.95,
        },
      },
      // Secure rivers (Tigris, Euphrates): crisp indigo ink.
      {
        id: "scriptural-rivers-solid",
        type: "line",
        source: "scriptural",
        filter: ["all", ["==", ["get", "kind"], "river"], ["==", ["get", "confidence"], "solid"]],
        layout: { visibility: "none", "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": palette.scriptureRiver,
          "line-width": ["interpolate", ["linear"], ["zoom"], 2, 1.6, 7, 3.4],
          "line-opacity": 0.95,
        },
      },
      // Contested paleo-rivers (Pishon, Gihon): dashed + blurred indigo: proposed, not proven.
      {
        id: "scriptural-rivers-contested",
        type: "line",
        source: "scriptural",
        filter: ["all", ["==", ["get", "kind"], "river"], ["==", ["get", "confidence"], "contested"]],
        layout: { visibility: "none", "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": palette.scriptureRiver,
          "line-width": ["interpolate", ["linear"], ["zoom"], 2, 1.4, 7, 3.0],
          "line-blur": 1.4,
          "line-dasharray": [2, 2],
          "line-opacity": 0.8,
        },
      },
    ],
  };

  // Phase 6 (opt-in): if an antique-scan overlay is configured, blend it over the base map but
  // beneath the thematic layers (boundaries/scriptural) so markers + frontiers stay legible.
  // Off by default (ACTIVE_OVERLAY === null): see overlaySource.ts / RL-007.
  if (ACTIVE_OVERLAY) {
    style.sources.antique = {
      type: "raster",
      tiles: ACTIVE_OVERLAY.tiles,
      tileSize: ACTIVE_OVERLAY.tileSize,
      attribution: ACTIVE_OVERLAY.attribution,
    };
    const beforeIdx = style.layers.findIndex((l) => l.id === "boundaries-fill");
    style.layers.splice(beforeIdx, 0, {
      id: "antique-overlay",
      type: "raster",
      source: "antique",
      paint: { "raster-opacity": ACTIVE_OVERLAY.defaultOpacity },
    });
  }

  return style;
}
