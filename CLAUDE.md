# Genesis: Session State

> Read this first every session. Fetch detail from `docs/` on demand. Do NOT re-read the
> full build spec each session. Keep this file ~a screen; compress if it grows past ~150 lines.

## Current phase & task
**All 7 build-spec phases shipped.** P1 POC · P2 pipeline · P3 six cradles · P4 scriptural layer
(toggle + chronology + 4-view spectrum) · P5 timeline depth (time-scaled fuzziness + 25 eras incl.
1700 Ottoman) · P6 antique scans (opt-in overlay capability, no scan bundled: D-011/RL-007) ·
P7 polish (confidence legend, About/credits modal, mobile layout, accessibility). All DOM/eval-verified;
the WebGL render was also seen good on the frames the flaky preview painted (1700-crisp vs deep-antiquity
fuzzy; Eden zone+rivers; legend). **Two infra items remain deferred (not blocking):** PMTiles tiling
(Windows Tippecanoe blocker: consolidated 8.6 MB is the stopgap) and self-hosting the OFL fonts.

## Next 1–3 actions
1. User: real-browser pass: scrub timeline (borders blur into antiquity, 1700 = Ottomans), toggle
   lenses, open the legend + "About & sources", resize to a phone width. Flag anything off.
2. If/when WSL/Docker available: PMTiles tiling to serve the full 48-era set (D-008 path).
3. Optional: wire a rights-cleared antique overlay via `overlaySource.ts` (mechanism ready, D-011).

## Open loops (RESEARCH_LOG.md by ID)
- None: RL-001..007 all resolved. (RL-007: antique-scan rights mixed/coverage poor → Phase 6 ships
  opt-in with no bundled scan.)

## Key decisions (DECISIONS.md)
- D-001 Vite+TS+MapLibre, map kept outside any framework.
- D-002 Boundary source swappable; LOCKED to historical-basemaps (GPL-3.0); geoBoundaries fallback ready.
- D-003 Timeline = one tileset, GPU-filtered by year; never file-swap.
- D-004 Dates = proleptic Gregorian decimal, no year zero; all math in `era.ts`.
- D-005 Fuzzy frontiers from BORDERPRECISION; deep-time blob feathering ✅ (now time-scaled, see D-010).
- D-008 One consolidated GeoJSON (no PMTiles yet); CONSOLIDATED 25 snapshots ≈ 8.6 MB (at ceiling).
- D-009 "First state" = first integration of the cradle's CORE region (not imperial unification); applied to all six.
- D-010 Phase 5: time-scaled fuzziness in-style (zero for CE eras); era coverage curated to 25 (modern stays sparse until PMTiles).
- D-011 Phase 6 = opt-in overlay (`overlaySource.ts`, off by default; no scan bundled: RL-007); Phase 7 polish shipped; PMTiles + font self-host deferred.

## Gotchas
- Tippecanoe has no Windows build: pipeline is mapshaper-only; PMTiles = future.
- Single consolidated GeoJSON scales with feature count (~16 MB for all 48 snapshots): curate or tile.
- In-IDE preview can't render WebGL → MapLibre screenshots blank, `isStyleLoaded()` stays false; verify in a
  real browser. DOM/console eval DOES work (markers, panels, perf). MapLibre loads GeoJSON in a worker.
- MapLibre style: never set `glyphs: undefined`: omit it. Year-zero: 1 BCE = `0.0`; use `era.ts` / `axisOf()`.
- MapLibre v4 sets an **inline `opacity`** (and `transform`) on every Marker element (occlusion).
  CSS opacity on markers therefore needs `!important` to win: the timeline fade gate relies on it
  (`app.css` marker rules). The lens gate uses `display:none`, which beats inline opacity without it.
  Don't `!important` marker `transform`: MapLibre owns it for positioning.
- The in-IDE WebGL preview renders **intermittently** (some screenshots paint the map, some come back
  blank parchment). DOM/eval state (layer visibility, `querySourceFeatures`, computed marker opacity)
  is the reliable check; treat a blank screenshot as a flaky frame, not a bug.

## Status
Phases 1–7 ✅ all shipped (POC · pipeline · six cradles · scriptural layer · timeline depth ·
opt-in antique overlay · polish: legend, About/credits, mobile, a11y). Deferred infra only: PMTiles
tiling (Windows tooling) + OFL font self-hosting. Build green; DOM-verified. Next: user browser pass.
