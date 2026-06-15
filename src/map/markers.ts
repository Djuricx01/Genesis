import maplibregl from "maplibre-gl";
import type { Confidence } from "../types";

/** The minimum a thing needs to be a map marker. Cradles and scriptural sites both satisfy it. */
export interface MarkerItem {
  id: string;
  name: string;
  /** [lng, lat] */
  coordinates: [number, number];
  /** AxisYear at which the marker illuminates on the timeline. */
  appearsAt: number;
  confidence?: Confidence;
  kind?: string;
}

export interface MarkerLayer {
  /** Timeline gate: illuminate markers whose `appearsAt` the year has reached. */
  update: (year: number) => void;
  /** Lens gate: show this group only when its perspective is the active one (§10). */
  setActive: (active: boolean) => void;
}

/**
 * Generic HTML-marker layer. Markers are HTML (not a GeoJSON layer) so we get period styling
 * and rich interaction without a glyph server. Each one fades in when the timeline reaches the
 * moment it emerges (§1), and a second gate hides the whole group when its lens is inactive,
 * which is what lets the two perspectives share one base map (§10).
 *
 * `variant` namespaces the CSS classes: "cradle" → .cradle-marker/.cradle-dot/.cradle-label,
 * "scripture" → .scripture-marker/etc.
 */
export function addMarkers<T extends MarkerItem>(
  map: maplibregl.Map,
  items: T[],
  variant: "cradle" | "scripture",
  onSelect: (item: T) => void,
): MarkerLayer {
  const els: { el: HTMLElement; item: T }[] = [];

  for (const item of items) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = `${variant}-marker`;
    if (item.confidence) el.classList.add(`conf-${item.confidence}`);
    if (item.kind) el.classList.add(`is-${item.kind}`);
    el.setAttribute("aria-label", `${item.name}, open details`);
    el.innerHTML = `<span class="${variant}-dot"></span><span class="${variant}-label">${item.name}</span>`;
    el.addEventListener("click", (ev) => {
      ev.stopPropagation();
      onSelect(item);
    });

    // Anchor the DOT on the coordinate, not the whole [dot][label] pill. With anchor:"center"
    // the pill's midpoint sat on the point, shoving the dot ~half-a-label-width WEST — a fixed
    // pixel offset, so zoomed in it looked roughly right but zoomed out it drifted hundreds of km
    // (Caral-Supe, on the Peru coast, landed in the Pacific). anchor:"left" puts the dot's left
    // edge on the point; the -6.5px offset (half the 13px dot) centers the dot exactly on it.
    new maplibregl.Marker({ element: el, anchor: "left", offset: [-6.5, 0] })
      .setLngLat(item.coordinates)
      .addTo(map);
    els.push({ el, item });
  }

  const update = (year: number): void => {
    for (const { el, item } of els) el.classList.toggle("is-present", year >= item.appearsAt);
  };

  const setActive = (active: boolean): void => {
    for (const { el } of els) el.classList.toggle("lens-active", active);
  };

  return { update, setActive };
}
