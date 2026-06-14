import maplibregl from "maplibre-gl";
import { buildStyle } from "./style";
import { ACTIVE_BOUNDARY_SOURCE } from "./boundarySource";
import { formatYear } from "../timeline/era";
import type { Lens } from "../perspective";

/**
 * Map a boundary's `borderprecision` (1 = approximate ... 5 = surveyed) to an honest label and a
 * confidence tier that reuses the legend's chip colors (conf-solid / conf-contested / conf-weak).
 * historical-basemaps features carry `borderprecision`, not a `confidence` field; reading the
 * absent `confidence` is what produced the "undefined confidence" popup. The cutoffs and wording
 * below are the one editorial choice here, so tweak them freely (the live data only uses 1 and 3).
 */
function frontierLabel(borderprecision: unknown): { text: string; tier: "solid" | "contested" | "weak" } {
  const p = Number(borderprecision);
  if (p >= 4) return { text: "surveyed border", tier: "solid" };
  if (p >= 2) return { text: "inferred frontier", tier: "contested" };
  return { text: "approximate frontier", tier: "weak" };
}

/** Thematic layers owned by each lens: toggled (not reloaded) when the perspective switches. */
const SCIENCE_LAYERS = ["boundaries-fill", "boundaries-outline"];
const SCRIPTURE_LAYERS = [
  "eden-zone-fill",
  "eden-zone-line",
  "scriptural-rivers-solid",
  "scriptural-rivers-contested",
];

export interface GenesisMap {
  map: maplibregl.Map;
  /** Filter boundaries to those active at `year` (AxisYear). The timeline's core call. */
  setYear: (year: number) => void;
  /** Show one lens's thematic layers, hide the other's. Base map is shared (§10). */
  setLens: (lens: Lens) => void;
  /** Set the antique-overlay blend opacity [0..1] (no-op unless an overlay is configured, Phase 6). */
  setOverlayOpacity: (opacity: number) => void;
}

export function createGenesisMap(containerId: string): GenesisMap {
  const map = new maplibregl.Map({
    container: containerId,
    style: buildStyle(),
    center: [42, 33], // Fertile Crescent: the convergence anchor (§6.2).
    zoom: 3.2,
    minZoom: 1.5,
    maxZoom: 7,
    attributionControl: false,
    dragRotate: false,
    pitchWithRotate: false,
  });

  map.addControl(
    new maplibregl.AttributionControl({
      compact: true,
      customAttribution: `Basemap: Natural Earth (public domain). ${ACTIVE_BOUNDARY_SOURCE.attribution}`,
    }),
    "bottom-right",
  );
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");

  // The timeline filter (§3). Swaps which polities are visible without re-fetching anything.
  let lastFilterYear: number | null = null;
  const setYear = (year: number): void => {
    if (!map.getLayer("boundaries-fill")) return;
    if (year === lastFilterYear) return; // skip redundant re-filters (cheap playback guard)
    lastFilterYear = year;
    const filter: maplibregl.FilterSpecification = [
      "all",
      ["<=", ["get", "start_year"], year],
      [">", ["get", "end_year"], year],
    ];
    map.setFilter("boundaries-fill", filter);
    map.setFilter("boundaries-outline", filter);
  };

  // Lens switch (§10): flip layer visibility, no source teardown, no re-fetch, and frame the
  // lens. The scientific cradles are global; the scriptural story is regional (all in the Fertile
  // Crescent), so entering the scriptural lens zooms to the Eden geography: otherwise its zone +
  // rivers are sub-pixel at the global anchor zoom. Returning to the scientific lens restores the
  // convergence anchor (§6.2).
  const setLens = (lens: Lens): void => {
    const setVis = (ids: string[], visible: boolean): void => {
      for (const id of ids) {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", visible ? "visible" : "none");
      }
    };
    const science = lens === "science";
    setVis(SCIENCE_LAYERS, science);
    setVis(SCRIPTURE_LAYERS, !science);

    // Honor "reduce motion": jump instead of glide for users who ask for it (a11y, Phase 7).
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 0 : 1000;
    if (science) {
      map.easeTo({ center: [42, 33], zoom: 3.2, duration });
    } else {
      // Frame Eden + the four rivers + Babel + Ararat, fitting any screen.
      map.fitBounds(
        [
          [37, 24],
          [53, 41],
        ],
        { padding: window.matchMedia("(max-width: 640px)").matches ? 30 : 80, duration },
      );
    }
  };

  // Hover popup on political areas: names the polity and is honest about its confidence/era.
  const popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    className: "genesis-popup",
  });

  map.on("mousemove", "boundaries-fill", (e) => {
    map.getCanvas().style.cursor = "pointer";
    const f = e.features?.[0];
    if (!f) return;
    const p = f.properties as Record<string, unknown>;
    const start = formatYear(Number(p.start_year));
    const end = formatYear(Number(p.end_year));
    const frontier = frontierLabel(p.borderprecision);
    popup
      .setLngLat(e.lngLat)
      .setHTML(
        `<strong>${p.name}</strong><br><span class="popup-era">${start} – ${end}</span>` +
          `<br><span class="popup-conf conf-${frontier.tier}">${frontier.text}</span>`,
      )
      .addTo(map);
  });
  map.on("mouseleave", "boundaries-fill", () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });

  // Antique-overlay opacity hook (Phase 6): no-op until an overlay layer exists (overlaySource.ts).
  const setOverlayOpacity = (opacity: number): void => {
    if (map.getLayer("antique-overlay")) map.setPaintProperty("antique-overlay", "raster-opacity", opacity);
  };

  return { map, setYear, setLens, setOverlayOpacity };
}
