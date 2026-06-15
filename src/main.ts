import "maplibre-gl/dist/maplibre-gl.css";
import "./style/app.css";
import { inject } from "@vercel/analytics";

import { createGenesisMap } from "./map";
import { addMarkers } from "./map/markers";
import { createTimeline } from "./timeline/slider";
import { createDossierPanel, cradleToDossier, siteToDossier } from "./panels/dossierPanel";
import { createSpectrumPanel } from "./panels/spectrumPanel";
import { createLegend } from "./panels/legend";
import { createRiversToggle } from "./panels/riversToggle";
import { createAboutPanel } from "./panels/aboutPanel";
import { createPerspectiveToggle, type Lens } from "./perspective";
import { createChronologyToggle } from "./chronology";
import { TIMELINE_MIN, TIMELINE_MAX } from "./timeline/era";
import type { CradlesDoc, ScripturalDoc } from "./types";
import cradlesDoc from "../data/dossier/cradles.json";
import scripturalDoc from "../data/dossier/scriptural.json";

// Initialize Vercel Web Analytics
inject();

const app = document.getElementById("app") as HTMLElement;
const { cradles } = cradlesDoc as unknown as CradlesDoc;
const { sites, chronologies, spectrum } = scripturalDoc as unknown as ScripturalDoc;

const INITIAL_LENS: Lens = "science";
let activeChrono = "ussher"; // which genealogical chronology dates the scriptural events
let currentYear = -2300; // tracked so a chronology switch can re-gate at the current moment

// Title cartouche (top-left), with an About & sources trigger.
const aboutPanel = createAboutPanel();
app.appendChild(aboutPanel.element);

const title = document.createElement("div");
title.className = "genesis-title";
title.innerHTML = `<h1>Genesis</h1><p>Where civilization began. Two lenses on the same ground.</p><button class="title-about" type="button">About &amp; sources</button>`;
title.querySelector(".title-about")?.addEventListener("click", () => aboutPanel.open());
app.appendChild(title);

const { map, setYear, setLens, setRiversVisible } = createGenesisMap("map");

const panel = createDossierPanel();
app.appendChild(panel.element);

const spectrumPanel = createSpectrumPanel(spectrum);
app.appendChild(spectrumPanel.element);

const legend = createLegend();
app.appendChild(legend.element);

// Temporary rivers on/off control (top-right). Default on, to honor the "more rivers" request.
const riversToggle = createRiversToggle({ initial: true, onChange: setRiversVisible });
app.appendChild(riversToggle.element);

// Two marker groups over the same ground. Each carries a timeline gate (appearsAt) and a lens
// gate (only the active perspective's group is shown).
const cradleMarkers = addMarkers(map, cradles, "cradle", (c) => panel.show(cradleToDossier(c)));

const scriptureItems = sites.map((s) => ({
  id: s.id,
  name: s.name,
  coordinates: s.coordinates,
  appearsAt: s.appearsAt[activeChrono],
  confidence: s.confidence,
  kind: s.kind,
  site: s,
}));
const scriptureMarkers = addMarkers(map, scriptureItems, "scripture", (it) =>
  panel.show(siteToDossier(it.site)),
);

// Switching lens flips map layers + marker groups, shows the scriptural-only controls, and closes
// any open panel (its content belonged to the lens we just left). Nothing is re-fetched.
const applyLens = (lens: Lens): void => {
  setLens(lens);
  cradleMarkers.setActive(lens === "science");
  scriptureMarkers.setActive(lens === "scripture");
  scripturalControls.classList.toggle("is-shown", lens === "scripture");
  panel.hide();
};

const perspective = createPerspectiveToggle({ initial: INITIAL_LENS, onChange: applyLens });
app.appendChild(perspective.element);

// Scriptural-only controls (shown under the scriptural lens): the chronology toggle + a button
// that opens the interpretive spectrum.
const scripturalControls = document.createElement("div");
scripturalControls.className = "scriptural-controls";

const chronology = createChronologyToggle({
  chronologies,
  initial: activeChrono,
  onChange: (id) => {
    activeChrono = id;
    // The marker layer holds these item objects by reference, so re-pointing appearsAt and
    // re-running the timeline gate at the current year is all that's needed: no rebuild.
    for (const it of scriptureItems) it.appearsAt = it.site.appearsAt[activeChrono];
    scriptureMarkers.update(currentYear);
  },
});
scripturalControls.appendChild(chronology.element);

const spectrumBtn = document.createElement("button");
spectrumBtn.type = "button";
spectrumBtn.className = "spectrum-trigger";
spectrumBtn.textContent = "Reading the two timelines ▸";
spectrumBtn.addEventListener("click", () => spectrumPanel.open());
scripturalControls.appendChild(spectrumBtn);

app.appendChild(scripturalControls);

// Set the marker lens gate immediately so there's no flash before the style loads.
const startScience = INITIAL_LENS === "science";
cradleMarkers.setActive(startScience);
scriptureMarkers.setActive(!startScience);
scripturalControls.classList.toggle("is-shown", !startScience);

const timeline = createTimeline({
  min: TIMELINE_MIN,
  max: TIMELINE_MAX,
  initial: currentYear,
  onChange: (year) => {
    currentYear = year;
    setYear(year);
    cradleMarkers.update(year);
    scriptureMarkers.update(year);
  },
});
app.appendChild(timeline.element);

// Marker gating is pure DOM: illuminate them at the initial year now, without waiting on the
// GL context (the `load` event below also re-runs this; it's idempotent).
cradleMarkers.update(currentYear);
scriptureMarkers.update(currentYear);

// Map filters / layer visibility, by contrast, need the style loaded: do those on `load`.
map.on("load", () => {
  setYear(currentYear);
  cradleMarkers.update(currentYear);
  scriptureMarkers.update(currentYear);
  applyLens(INITIAL_LENS);
});

// Dev-only handle for debugging/introspection from the console.
if (import.meta.env.DEV) {
  (window as unknown as { genesis: unknown }).genesis = { map, setYear, setLens, perspective, chronology };
}
