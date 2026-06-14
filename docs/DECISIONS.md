# Decisions Log

Architectural & editorial decisions with rationale. One section per decision. Newest on top.
`CLAUDE.md` carries the one-line summaries; full reasoning lives here.

---

## D-011: Phase 6 ships as an opt-in overlay capability; Phase 7 polish; PMTiles still deferred
**2026-06-13.** **Phase 6 (antique scans):** built as an OFF-by-default, swappable raster overlay
(`src/map/overlaySource.ts`, `ACTIVE_OVERLAY = null`): the map adds a blendable raster layer +
`setOverlayOpacity` hook only when a source is configured. **No scan is bundled**, by design:
RL-007 found rights are mixed (David Rumsey = CC-NC + credit, commercial needs permission) and
coverage is Euro-centric/absent for the deep cradles (D-006). The antique *look* is already the
styling backbone (D-006 path "a"), so this is a clean extension point (same hedge as D-002), not a
shipped feature: wiring a rights-cleared Allmaps/IIIF source later is a one-line config + a small
opacity UI. **Phase 7 polish shipped:** confidence legend (`panels/legend.ts`), About/credits modal
(`panels/aboutPanel.ts`), mobile/narrow-screen layout (media queries, verified at 375px: legend
lifts above the timeline, controls compact, drawer full-width), and accessibility (`:focus-visible`
ring, `prefers-reduced-motion` zeroing CSS transitions AND the map camera eases, Esc-to-close on all
panels/modals, ARIA roles). **Still deferred:** PMTiles tiling (Tippecanoe has no Windows build:
needs WSL/Docker or a JS tiler; the consolidated 8.6 MB file is the working stopgap, D-008/D-010) and
self-hosting the two OFL fonts (minor perf/offline nicety, currently via Google Fonts).

## D-010: Phase 5: time-scaled fuzziness in-style; era coverage curated, not exhaustive
**2026-06-13.** Two-part timeline-depth work. **(a) Fuzziness now scales with time, not just
precision.** `borderprecision` alone left every antiquity polity equally fuzzy (it defaults to 1
for `axis < 0`). Added a second input, `start_year`, to the boundary paint in `src/map/style.ts`:
`line-blur`, `line-width`, `fill-opacity`, and `line-opacity` each combine a precision term with an
age term that is **zero for CE-era features** (so the modern/verified look is untouched) and grows
the deeper in time you scrub. Deep antiquity (≤8000 BCE) feathers into a soft blob: `blur ≈ 12`,
faint wide outline, slightly stronger fill = the "core → buffer" feel of D-005. True per-feature
radial gradients aren't expressible in MapLibre paint, so this feathered approximation stands in.
Done in-style (no data re-bake) so it applies to data already shipped. **(b) Era coverage expanded
20 → 25** (`CONSOLIDATED` in `snapshots.mjs`): added cheap deep-time steps (bc5000/bc1500/bc700/
bc200: few features, where the cradles live) and the `1700` pivot so the spec's "Ottoman in 1700"
resolves correctly (was bucketed into 1600). Dense **modern** eras were deliberately *not* all
added: they are feature-count-heavy (the served file floor is feature count, not vertex detail, so
simplification can't shrink them) and pushed the file to 10–20 MB. Settled at **~8.6 MB / 25 eras**
at the proven `visvalingam 6% precision=0.02`. Full modern resolution waits on PMTiles tiling
(D-008, Phase 7): the consolidated single-file approach is at its practical ceiling.

## D-009: "First state" = first integration of the cradle's CORE region (not imperial unification)
**2026-06-13.** The fourth milestone, "First state," is defined consistently across all six
cradles as *the earliest state-level polity to politically integrate the cradle's core
heartland*: not later pan-regional/imperial unification, which is noted separately where it is
a distinct, famous event. So: Mesopotamia → Akkad (~2334 BCE) over the Sumerian city-states;
Egypt → Narmer's unification of Upper & Lower (~3150 BCE); China → first state-level society in
the Central Plains (Erlitou / early Shang, ~1900–1500 BCE), with imperial unification of all
China (Qin, 221 BCE) noted as a separate, later milestone; Indus, Olmec, and Caral-Supe → no
consensus on a unifying state (decentralized / peer-polity / cooperative networks), shown as
such. **Why:** treating "empire" as the civilization threshold is Mesopotamia-centric and
anachronistic; this honors §2's "each cradle on its own terms" while staying consistent.
Per-cradle confidence is tagged (e.g. Erlitou-as-state is `contested`).

## D-008: Phase 2: serve one consolidated GeoJSON (no PMTiles yet); curate snapshots for size
**2026-06-13.** The pipeline (`data/pipeline/`) consolidates historical-basemaps year-snapshots
into a single GeoJSON, each feature tagged `[start_year, end_year)` from the snapshot sequence,
then simplified with mapshaper (Visvalingam 6%, coord precision 0.02). We serve that file
directly and filter client-side: **no Tippecanoe/PMTiles**. Consequence: file size scales with
*feature count*; all 48 snapshots land ≈16 MB (too heavy for one download, and simplification %
barely helps past a floor). So `snapshots.mjs` splits `SNAPSHOTS` (everything downloaded) from
`CONSOLIDATED` (a curated ~20 baked into the served file ≈6 MB). **Why:** keeps build fully
Windows-native (mapshaper only) and the app snappy now; the full dense set is exactly the case
PMTiles tiling solves, so that's the documented upgrade path (Phase 5/7). Source is **locked to
historical-basemaps as primary**, still swappable via `src/map/boundarySource.ts` (D-002).

## D-007: Phase 1 uses a hand-made boundary set, no tile pipeline yet
**2026-06-13.** Phase 1 (proof of concept) ships a tiny hand-authored GeoJSON with
`start_year`/`end_year` on each feature, served as a static file and filtered on the GPU.
The full `raw → mapshaper → TopoJSON → Tippecanoe → PMTiles` pipeline is deferred to Phase 2.
**Why:** the POC's job is to prove the *interaction* (parchment + timeline filter + cradles
feel good) before investing in tooling. Also de-risks Windows: **Tippecanoe has no native
Windows build** (needs WSL or Docker), so we don't want it on the critical path for "see
something real." See Gotchas in CLAUDE.md.

## D-006: Antique look = style over accurate vector data (path "a"), scans optional later
**2026-06-13.** Default to an antique *style* (parchment, ink coasts, period type) applied to
modern-accurate vector data. Georeferenced real antique scans (path "b") are a Phase 6
enhancement, never the backbone: coverage is patchy/Euro-centric and absent for the deep
cradles.

## D-005: Fuzzy frontiers driven by data, hard borders only post-1648
**2026-06-13.** `BORDERPRECISION` (or our own confidence field) binds to `line-blur` and
`fill-opacity`. Pre-1000 BCE polities render as radial-gradient core→buffer, not polygons.
Crisp polygons are an anachronism before the Peace of Westphalia (1648). This is an editorial
*and* technical decision: honesty about uncertainty is the product (§2).

## D-004: Date convention: proleptic Gregorian decimal, no year zero
**2026-06-13.** `1.0` = 1 Jan 1 CE, `0.0` = 1 BCE, `-3000.0` = 3001 BCE. One helper module
owns all conversion and display (`src/timeline/era.ts`). **Why:** off-by-one year-zero bugs
are the single most common history-app defect; centralizing the convention kills them at the
source. Astronomers use year zero; historians don't: we follow the historian convention in
display but store a continuous decimal so the slider math has no discontinuity at 1 BCE/1 CE.

## D-003: Timeline = one consolidated tileset, GPU-filtered; never file-swapped
**2026-06-13.** Every boundary feature carries `start_year`/`end_year`; the slider sets a
MapLibre style-expression filter. **Why:** swapping files per tick forces DOM/source teardown
and kills frame rate. Filtering is a GPU attribute test → smooth 60fps scrubbing (§3, §10).

## D-002: Swappable boundary source (the GPL-3.0 hedge)
**2026-06-13.** The historical-boundary dataset sits behind a small loader interface so it can
be replaced without touching map/render code. Primary = historical-basemaps (GPL-3.0);
fallback = geoBoundaries (CC-BY 4.0) + independently traced antiquity zones. **Why:** the
GPL-3.0 "reach" question is legally unsettled (see DATA_SOURCES.md); we must not weld the app
to a copyleft source before a lawyer rules. Architecture buys the owner that option.

## D-001: Stack: Vite + TypeScript + MapLibre GL JS, map kept out of any framework
**2026-06-13.** Vanilla TS component layer; MapLibre owns the canvas directly (no React
wrapper). **Why:** spec §3: a framework's re-render cycle fights MapLibre's imperative API.
Vite gives fast dev/HMR and a static-site build; PMTiles can later be served as static files
with no tile server.
