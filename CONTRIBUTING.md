# Contributing to Genesis

Thank you for your interest in Genesis! This guide will get you set up and explain how we
work: both the code conventions and the editorial discipline that makes this project
different from a typical map app.

## Quick start

```bash
git clone https://github.com/<your-username>/genesis.git
cd genesis
npm install
npm run dev          # → http://localhost:5173
```

Open the URL in a real browser (not an in-IDE preview): MapLibre needs WebGL.

## Project structure

```
src/
  main.ts              Entry point: wires map, panels, timeline, perspective toggle
  types.ts             Shared TypeScript interfaces (Cradle, ScripturalSite, Dossier, …)
  map/                 MapLibre map, style, markers, boundary/overlay sources
  panels/              Dossier drawer, About modal, legend, interpretive spectrum
  perspective.ts       Scientific ⟷ Scriptural lens toggle
  chronology.ts        Ussher ⟷ LXX chronology toggle (scriptural lens only)
  timeline/            Timeline slider + era.ts (all date math lives here)
  style/               app.css + palette.ts (map colors)
data/
  dossier/             Content JSON: cradles.json, scriptural.json
  pipeline/            Node scripts that download + consolidate boundary GeoJSON
docs/
  DECISIONS.md         Architectural & editorial decisions with rationale
  DATA_SOURCES.md      Datasets, licenses, verification status
  RESEARCH_LOG.md      Every verified claim: question → sources → finding → confidence
```

## The rules

### 1. Every claim needs a confidence tag

Genesis shows two lenses on the same ground. **Neither lens gets special treatment.**
Every dated claim, every identification, every boundary carries one of:

| Tag | Meaning |
|-----|---------|
| `solid` | Well attested: mainstream consensus, multiple independent sources |
| `contested` | Genuinely disputed: active scholarly debate, conflicting evidence |
| `weak` | Little evidence: speculative, single-source, or poorly attested |

If you add content (a new cradle, a new scriptural site, a new milestone), you **must**:
- Assign a confidence tag
- Add an entry to `docs/RESEARCH_LOG.md` with the question, sources, finding, and confidence
- Cite at least one primary or peer-reviewed source

**We do not adjudicate truth between the lenses. We map what each tradition claims and how
confident anyone can be.**

### 2. All date math goes through `era.ts`

We use proleptic Gregorian decimal with **no year zero**: `1.0` = 1 CE, `0.0` = 1 BCE,
`-3000.0` = 3001 BCE. The helpers `bce()`, `ce()`, `formatYear()` live in
[`src/timeline/era.ts`](src/timeline/era.ts). **Never hand-roll year arithmetic elsewhere.**

### 3. The boundary source stays swappable

The historical boundary data is GPL-3.0 (see `docs/DATA_SOURCES.md`). All boundary access
goes through [`src/map/boundarySource.ts`](src/map/boundarySource.ts). Don't hardcode paths
to boundary files: use the `ACTIVE_BOUNDARY_SOURCE` binding.

### 4. The map stays outside any framework

MapLibre owns the canvas directly (no React/Vue wrapper). UI components are vanilla TS that
create and return DOM elements. This is intentional: a framework's re-render cycle fights
MapLibre's imperative API. See `docs/DECISIONS.md` → D-001.

## Code style

- **TypeScript**: strict mode, no `any` unless absolutely necessary (and commented why).
- **No classes for UI components**: use factory functions that return a typed interface
  (see `createTimeline()`, `createDossierPanel()`, etc.).
- **CSS**: vanilla CSS with custom properties defined in `:root`. No utility frameworks.
  Map colors live in `palette.ts`; UI colors live in `app.css`: keep them in sync.
- **Comments**: preserve existing comments. Add comments for non-obvious decisions.
  Reference spec section numbers (§1, §2, etc.) and decision IDs (D-001, D-002, etc.)
  where relevant.

## How to contribute

### Reporting bugs

Open an issue with:
- What you expected
- What happened
- Browser + OS
- A screenshot if it's visual

### Adding content (cradles, sites, milestones)

This is where help is most valuable. To add or improve content:

1. **Research first**: read `docs/RESEARCH_LOG.md` for the standard we hold ourselves to.
2. **Add data**: edit `data/dossier/cradles.json` or `data/dossier/scriptural.json`.
3. **Log it**: add an entry to `docs/RESEARCH_LOG.md` with sources and confidence.
4. **Open a PR**: title it like `content: add [thing]` or `research: verify [claim]`.

### Code changes

1. Fork and create a feature branch (`git checkout -b feature/my-change`).
2. Make your changes. Run `npm run build` to check for TypeScript errors.
3. Test in a real browser: scrub the timeline, switch lenses, open panels, resize to mobile.
4. Open a PR with a clear description of what and why.

### Help wanted 🙏

These are the open items where contributions would have the most impact:

- **PMTiles tiling**: the consolidated 8.6 MB GeoJSON is at its ceiling. Tippecanoe needs
  WSL/Docker on Windows, or a JS-based tiler. See `docs/DECISIONS.md` → D-008.
- **More era snapshots**: adding boundary data for additional time periods (the pipeline
  supports it, the file size is the constraint until PMTiles lands).
- **Self-hosted OFL fonts**: IM Fell English + EB Garamond are currently loaded from
  Google Fonts. Bundling them improves offline support and privacy.
- **Tests**: especially for `era.ts` (the BCE/CE conversion logic).
- **Content verification**: independently verify claims in the research log, or research
  new ones.

## PR checklist

- [ ] `npm run build` passes (no TypeScript errors)
- [ ] Tested in a real browser (not just the IDE preview)
- [ ] Timeline scrubbing works smoothly
- [ ] Both lenses (Scientific / Scriptural) render correctly
- [ ] Mobile layout checked (resize to ~375px width)
- [ ] Any new content has a `RESEARCH_LOG.md` entry with sources
- [ ] Existing comments and documentation are preserved

## Code of conduct

Be respectful. Genesis covers topics (religion, history, origins) where people hold strong
views. This project exists precisely because two accounts that are "usually framed as
enemies" substantially converge on the same ground. Bring that same spirit to contributions:
show the evidence, tag the confidence, respect the other lens.
