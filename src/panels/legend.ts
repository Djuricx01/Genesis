/**
 * The "how to read this map" legend (Phase 7 slice). The whole product encodes uncertainty in its
 * styling, confidence chips, frontiers that feather with age, two lenses, solid-vs-dashed rivers,
 * but none of that teaches itself. This collapsible key, anchored bottom-left, names the visual
 * grammar so a first-time viewer can actually read it. The swatches are CSS that mirror the real
 * map paint, so the legend stays honest if the styling is retuned (keep them in sync).
 */
export interface Legend {
  element: HTMLElement;
}

export function createLegend(): Legend {
  const root = document.createElement("div");
  root.className = "legend";

  root.innerHTML = `
    <button class="legend-toggle" type="button" aria-expanded="false">How to read this map</button>
    <div class="legend-card" role="region" aria-label="Map legend">
      <div class="legend-group">
        <div class="legend-group-title">Confidence</div>
        <ul>
          <li><span class="conf-chip conf-solid">solid</span> well attested</li>
          <li><span class="conf-chip conf-contested">contested</span> genuinely disputed</li>
          <li><span class="conf-chip conf-weak">weak</span> little evidence</li>
        </ul>
      </div>

      <div class="legend-group">
        <div class="legend-group-title">Borders fade with age</div>
        <ul>
          <li><span class="swatch swatch-border-sharp"></span> modern, surveyed: sharp</li>
          <li><span class="swatch swatch-border-fuzzy"></span> ancient, inferred: feathered (the deeper in time, the fuzzier)</li>
        </ul>
      </div>

      <div class="legend-group">
        <div class="legend-group-title">Two lenses, same ground</div>
        <ul>
          <li><span class="swatch swatch-dot-science"></span> Scientific: cradles of civilization</li>
          <li><span class="swatch swatch-dot-scripture"></span> Scriptural: Genesis geography</li>
          <li><span class="swatch swatch-river-solid"></span> river named in the text (secure)</li>
          <li><span class="swatch swatch-river-dashed"></span> proposed identification (contested)</li>
          <li><span class="swatch swatch-eden-zone"></span> a proposed zone, not a surveyed area</li>
        </ul>
      </div>
    </div>
  `;

  const toggle = root.querySelector(".legend-toggle") as HTMLButtonElement;
  toggle.addEventListener("click", () => {
    const open = root.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  return { element: root };
}
