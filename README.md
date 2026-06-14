# Genesis

An interactive, pan/zoom antique-style world map for exploring **how and where civilization
began**, told through two parallel lenses on the same ground: the **scientific /
archaeological** account and the **scriptural / Abrahamic (Genesis)** account.

A timeline scrubs across millennia; cradles of civilization illuminate as they emerge;
political geography shifts to period-appropriate configurations. Ancient frontiers render as
**fuzzy zones**, modern borders as crisp lines. Honesty about uncertainty is the point.

> The two accounts are usually framed as enemies. On a map they substantially **converge on
> the same ground**: Mesopotamia, the Tigris–Euphrates, the Fertile Crescent. Genesis lets
> you *see* that convergence, and is honest about where the accounts agree and where they
> genuinely diverge. It maps what each tradition claims and how confident anyone can be. It
> does not adjudicate truth.

## Stack
- **MapLibre GL JS**: vector rendering, GPU style-expression filtering for the timeline.
- **Vite + TypeScript**: vanilla component layer; the map is *not* owned by a framework.
- Boundary data behind a **swappable loader** (see `docs/DATA_SOURCES.md` for the GPL-3.0 posture).

## Run it
```bash
npm install
npm run dev      # Vite dev server with hot reload
npm run build    # static production build → dist/
```

## Project docs (read these, not the whole spec, when resuming)
- `CLAUDE.md`: live session state & next actions (read first every session).
- `docs/DECISIONS.md`: architectural & editorial decisions + rationale.
- `docs/DATA_SOURCES.md`: datasets, licenses, verification status.
- `docs/RESEARCH_LOG.md`: every `[VERIFY]` claim (question, sources, finding, confidence).

## Date convention
Proleptic Gregorian decimal, **no year zero**: `1.0` = 1 CE, `0.0` = 1 BCE, `-3000.0` = 3001 BCE.
All conversion/display lives in `src/timeline/era.ts`. Never hand-roll year math elsewhere.

## License
Source code is **MIT** (see [`LICENSE`](LICENSE)): anyone can use it for anything, no strings attached.

The map *data* keeps its own licenses. The historical boundary data
([aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps)) is **GPL-3.0**;
the other datasets are listed in [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md). Donations
(e.g. Buy Me a Coffee) are voluntary appreciation and do not affect any of this.
