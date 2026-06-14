# Data Sources

Every dataset Genesis uses, its license, verification status, and how we handle it.
Status legend: ✅ verified by reading the primary source · 🔶 needs verification · ⛔ blocking issue.

---

## ⚠️ License posture (read this first)

Genesis renders historical political boundaries. The best open historical-boundary
dataset (`aourednik/historical-basemaps`) is **GPL-3.0**, a copyleft license. Because
copyleft *may* obligate releasing this entire app under GPL-3.0, we treat the boundary
source as a **swappable component** (see DECISIONS.md → "Swappable boundary source").

**Open legal question: NOT resolved here, flagged for the project owner / an IP lawyer:**
Whether GPL-3.0 "reaches" an application that merely *loads a GeoJSON data file at runtime*
(as opposed to linking GPL code) is legally unsettled. The data-vs-code copyleft boundary
is a genuine grey area. Do not treat any statement in this repo as legal advice. Before any
public or commercial release, the owner should take this to a qualified IP lawyer.

What we do about it as engineers: build so the boundary dataset can be replaced without
touching rendering code. If the owner cannot accept copyleft, the fallback path
(geoBoundaries + independently traced antiquity zones) is ready to drop in.

---

## Dataset roster

| Source | Role | License | Status | Notes |
|---|---|---|---|---|
| **historical-basemaps** (aourednik) | Primary historical boundaries | **GPL-3.0** | ✅ verified 2026-06-13 (read raw `LICENSE`) | Copyleft: see posture above. Has a `BORDERPRECISION` field → wire to fuzzy styling (§8). Irregular time snapshots. |
| **geoBoundaries** | Modern boundaries / **fallback** | CC-BY 4.0 | 🔶 confirm attribution string | CGAZ composite resolves overlapping claims. Attribution required. |
| **Natural Earth** | Physical basemap (coast, rivers, terrain) | Public domain | 🔶 confirm edition | Modern reference only; ideal antique-styled base. |
| **CHGIS** (Harvard/Fudan) | China detail, 221 BCE–1911 CE | Academic/open | 🔶 verify commercial terms | Mostly points, not polygons. |
| **AWMC / Pleiades** | Ancient Mediterranean sites/borders | Open (CC) | 🔶 verify per layer | Good for Mesopotamia/Egypt fringes & site points. |
| **David Rumsey Map Collection** | Antique scans (optional georeferencing) | Per-scan | 🔶 verify per scan | Physical maps PD; specific digitizations may carry terms. |

---

## Verification log

### historical-basemaps license: ✅ RESOLVED 2026-06-13
- **Method:** fetched the raw `LICENSE` file directly from the repository (master branch).
- **Finding:** GNU General Public License **Version 3, 29 June 2007**: verbatim opening:
  "GNU GENERAL PUBLIC LICENSE / Version 3, 29 June 2007 / Copyright (C) 2007 Free Software
  Foundation, Inc." Confirmed copyleft (GPLv3 §5 requires modified versions carry the same terms).
- **Consequence:** boundary source is treated as swappable; data-vs-code reach flagged for a
  lawyer (above). See RESEARCH_LOG.md → RL-001.

### historical-basemaps in use: ✅ Phase 2 (2026-06-13)
Primary source wired in. Pipeline (`data/pipeline/`) consolidates year-snapshots → one
year-tagged GeoJSON, simplified with mapshaper (Visvalingam 6%, precision 0.02). Observed
`BORDERPRECISION` values ≈ 1 (approximate) and 3 (more precise) → bound to fuzzy `line-blur` /
`fill-opacity`. Served file ≈ 6 MB (curated ~20-snapshot subset; see DECISIONS.md D-008). The
attribution string lives in `src/map/boundarySource.ts` and renders in the map's credits control.

### geoBoundaries / Natural Earth / others: 🔶 pending
Verify before any of these ships in a panel or layer. Attribution strings to be captured here.
