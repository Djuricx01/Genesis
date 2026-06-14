# Research Log

Every `[VERIFY]` item and every sub-`solid` claim: the question, sources, finding, date
range, and assigned confidence. Content does not ship until its entry here is complete.

Confidence tags: `solid` · `contested` · `weak`.

---

## RL-001, historical-basemaps license, ✅ RESOLVED
- **Question:** what license (and version) governs `aourednik/historical-basemaps`, and is it copyleft?
- **Source:** raw `LICENSE` file from the repository, fetched 2026-06-13.
- **Finding:** GNU GPL **v3** (29 June 2007). Copyleft confirmed. The *data-vs-code reach*
  of GPL at runtime is legally unsettled: flagged for IP counsel, not resolved here.
- **Confidence:** `solid` (on the license fact). The legal-reach question is explicitly left open.
- **Action:** swappable boundary source (DECISIONS.md D-002).

## RL-002, Caral-Supe maritime-vs-agriculture (MFAC), ✅ RESEARCHED · ships as `contested`
- **Question:** is Moseley's Maritime Foundations hypothesis "resolved" by recent isotope work, or still open?
- **Sources:** Pezo-Lanfranco, Machacuay et al. (2023), "The diet at the onset of the Andean
  Civilization: New stable isotope data from Caral and Áspero," *Am. J. Biological Anthropology*:
  https://pubmed.ncbi.nlm.nih.gov/36787651/ · https://onlinelibrary.wiley.com/doi/abs/10.1002/ajpa.24445 ;
  overview: https://www.newworldencyclopedia.org/entry/Norte_Chico_civilization
- **Finding:** 52 individuals (70 samples), Bayesian mixing models. High C3-carbohydrate intake:
  >70% of calories at inland Caral, 55–68% at coastal Áspero; marine protein more important at
  coastal Áspero and declining at Caral over time. Authors: MFAC "does not completely account for"
  the data; crop-focused agriculture predominant.
- **Confidence:** `contested`. Per spec, report the isotope findings *as recent findings*; the
  debate has shifted toward agriculture but is treated as evolving, NOT closed.
- **Status:** RESEARCHED: cited in dossier (`caral-supe.contested`).

## RL-003, Chinese oracle-bone writing date, ✅ RESOLVED (~1250 BCE, not 1600)
- **Question:** earliest attested Chinese writing: ~1250 vs ~1600 BCE?
- **Sources:** https://en.wikipedia.org/wiki/Oracle_bone_script ;
  https://www.historyofinformation.com/detail.php?id=1282 ;
  Scientific Data (2024): https://www.nature.com/articles/s41597-024-03807-x
- **Finding:** oracle-bone script = earliest indisputable Chinese writing, late 13th c. BCE;
  Wu Ding-reign bones radiocarbon-dated ~1254–1197 BCE (±10). Shang dynasty starts ~1600 BCE, but
  attested writing is ~1250 BCE under Wu Ding. Use ~1250 for the writing milestone; 1600 = dynasty start.
- **Confidence:** `solid`.

## RL-004, Egyptian farming date framing, ✅ RESOLVED (~5500 BCE settled farming)
- **Question:** reconcile ~5500 vs ~7000 BCE for Egyptian agriculture.
- **Sources:** https://en.wikipedia.org/wiki/Ancient_Egyptian_agriculture ;
  Britannica, Nile valley: https://www.britannica.com/topic/agriculture/The-Nile-valley ;
  Nile Delta Neolithic: https://www.sciencedirect.com/science/article/abs/pii/S027737912500188X
- **Finding:** settled Nile-valley crop agriculture (Faiyum A: emmer, barley, flax) ~5500–4000 BCE.
  Earlier ~7th-millennium-BP dates refer to PASTORALISM (sheep/goats from SW Asia), not settled
  valley farming. The two figures count different things: the spec's framing holds.
- **Confidence:** `solid` (with the pastoralism-vs-farming distinction made explicit).

## RL-005, Cascajal Block authenticity/dating, ✅ RESEARCHED · ships as `contested`
- **Question:** is the Cascajal Block (~900 BCE) securely the "oldest New World writing"?
- **Sources:** Cambridge, *Ancient Mesoamerica*: archaeometric analysis:
  https://www.cambridge.org/core/journals/ancient-mesoamerica/article/digital-imaging-and-archaeometric-analysis-of-the-cascajal-block-establishing-context-and-authenticity-for-the-earliest-known-olmec-text/42B1EB580DAA062892886EA04F115046 ;
  https://en.wikipedia.org/wiki/Olmec_hieroglyphs ; Skidmore (Mesoweb): https://www.mesoweb.com/reports/Cascajal.pdf
- **Finding:** ~900 BCE, Olmec, recovered ~1990s from a gravel quarry in Veracruz: NOT in situ
  (no stratigraphy). Critiques: unique, unusual horizontal rows, oddly crisp engraving. Support:
  archaeometric/digital-imaging analysis finds symbols, material, manufacture consistent with
  Formative-period Olmec work. Net: probably authentic, weak provenance: present as disputed.
- **Confidence:** `contested`.

## RL-006, Eden river candidates (Pishon, Gihon), ✅ RESEARCHED · ships as `contested`
- **Question:** Genesis 2:10–14 names four rivers flowing from Eden. Two are unambiguous:
  Hiddekel (Tigris) and Perath (Euphrates). What are the candidate identifications for the other
  two, Pishon and Gihon, and on what evidentiary basis? Can the garden itself be located?
- **Sources:**
  - James A. Sauer, "The River Runs Dry: Biblical Story Preserves Historical Memory,"
    *Biblical Archaeology Review* 22:4 (1996): the Pishon = Wadi al-Batin argument.
  - Juris Zarins, Persian-Gulf-oasis hypothesis, popularized in Dora Jane Hamblin,
    "Has the Garden of Eden been located at last?," *Smithsonian* 18:2 (May 1987):
    https://www.ldolphin.org/eden/
  - Farouk El-Baz, Boston U.: Space Shuttle (SIR-C) radar of a fossil "Kuwait River" channel
    crossing N. Arabia, dried ~3500–2000 BCE.
  - Mainstream framing: National Geographic, "Was the Garden of Eden real?":
    https://www.nationalgeographic.com/history/article/where-is-garden-of-eden-location ;
    Wikipedia, *Gihon* (https://en.wikipedia.org/wiki/Gihon) and *Wadi al-Batin*
    (https://en.wikipedia.org/wiki/Wadi_al-Batin).
- **Finding:** the leading (but unproven) reconstruction places Eden at the head of the Persian
  Gulf, submerged after post-glacial sea-level rise (~the Gulf flooded by ~4000 BCE), with the
  four rivers converging there:
  - **Pishon** ("compasses Havilah, where there is gold") → the now-dry **Wadi al-Batin /
    Rimah–Batin** paleochannel draining central Arabia. Sauer/El-Baz: a real fossil river,
    gold-bearing Arabian shield upstream fits "Havilah." Evidence is geomorphological, not textual-archaeological.
  - **Gihon** ("compasses Cush") → the **Karun** (SW Iran), per Zarins. Complication: Hebrew
    *Kush/Gush* is elsewhere Nubia (KJV "Ethiopia"), which is geographically impossible at a
    Mesopotamian confluence; the Eden Kush is read instead as a Mesopotamian/Kassite *Kaššu* or
    the land east of the Tigris. Unsettled.
  - Alternative for the 4th river: the **Karkheh** rather than the Karun.
- **Confidence:** `contested`. No marine archaeology has tested the submerged-Eden claim; the
  identifications rest on satellite geomorphology + philology, with live disagreement. Per the
  spec's discipline, present Tigris/Euphrates as `solid` and Pishon/Gihon/the Eden zone itself as
  `contested`: candidates and reasoning shown, never asserted as located fact.
- **Status:** RESEARCHED: drives `data/dossier/scriptural.json` (Eden zone + four rivers).

---

## RL-007, Antique-scan overlay rights & availability, ✅ RESEARCHED · Phase 6 ships as opt-in, no default scan
- **Question:** can real georeferenced antique map scans be blended in as a raster overlay, and on
  what rights basis? (Phase 6.)
- **Sources:** David Rumsey Map Collection, Copyright & Permissions:
  https://www.davidrumsey.com/about/copyright-and-permissions ; Allmaps (georeferenced IIIF for
  MapLibre): https://allmaps.org/ and `@allmaps/maplibre`; Map Warper (Tim Waters, open georectify).
- **Finding:** rights are **mixed, not blanket-open**. Rumsey: licensed works are CC
  *non-commercial* with required credit ("David Rumsey Map Collection, David Rumsey Map Center,
  Stanford Libraries"); public-domain status varies per scan; **commercial use needs written
  permission** (carto@davidrumsey.com). Technically, Allmaps' MapLibre package + tile server can
  warp georeferenced IIIF scans into XYZ overlays, a clean path, but each underlying scan keeps
  its own rights. Coverage is **Euro-centric and absent for the deep cradles** (matches D-006), so
  the value for an ancient-cradles map is low.
- **Confidence:** `solid` (on the rights/coverage facts).
- **Decision:** ship Phase 6 as an **opt-in, swappable overlay capability** (`src/map/overlaySource.ts`,
  default `null`): the map plumbing + opacity control exist, but no rights-encumbered scan is bundled.
  The antique *look* is already delivered via styling (D-006 path "a"). See DECISIONS.md D-011.

---

## Still open
- (none: RL-001..007 all resolved)
