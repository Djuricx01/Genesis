/**
 * Antique-scan overlay (Phase 6): an OPT-IN, swappable raster layer, off by default.
 *
 * Real georeferenced antique scans are rights-mixed and Euro-centric/absent for the deep cradles
 * (see RESEARCH_LOG.md RL-007, DECISIONS.md D-011), so Genesis does NOT bundle one: the antique
 * *look* is delivered by styling instead (D-006 path "a"). This module is the clean extension point:
 * set `ACTIVE_OVERLAY` to a rights-cleared source and the map wires up a blendable raster layer +
 * an opacity control automatically. Mirrors the swappable-source hedge of D-002 (boundarySource).
 */
export interface AntiqueOverlay {
  id: string;
  /** XYZ raster tile URL templates (e.g. an Allmaps tile-server URL, or a self-hosted tileset). */
  tiles: string[];
  /** Native tile size; 256 unless the source says otherwise. */
  tileSize: number;
  /** Initial blend opacity [0..1]. */
  defaultOpacity: number;
  /** Credit line: REQUIRED for most antique sources (e.g. David Rumsey / Stanford). */
  attribution: string;
  /** License / permission basis, for our own clarity and the credits UI. */
  license: string;
}

/**
 * Example of how to enable an overlay (commented out: wire a rights-cleared source here):
 *
 * export const ALLMAPS_EXAMPLE: AntiqueOverlay = {
 *   id: "allmaps-example",
 *   tiles: ["https://allmaps.xyz/maps/<annotation-id>/{z}/{x}/{y}.png"],
 *   tileSize: 256,
 *   defaultOpacity: 0.6,
 *   attribution: "Antique scan: David Rumsey Map Collection, Stanford Libraries (CC BY-NC)",
 *   license: "CC-BY-NC (non-commercial; commercial use needs permission: RL-007)",
 * };
 */

/** The active overlay, or `null` to ship without one (default). */
export const ACTIVE_OVERLAY: AntiqueOverlay | null = null;
