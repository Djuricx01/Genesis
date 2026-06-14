import type { InterpretiveSpectrum, SpectrumView } from "../types";

/**
 * The interpretive spectrum (Phase 4 part C): four positions on how the scientific and scriptural
 * timelines relate, each shown with its strength AND its strain ("show the tensions": none
 * endorsed, per §2). A dismissible overlay so it doesn't compete with the map chrome.
 */
export interface SpectrumPanel {
  element: HTMLElement;
  open: () => void;
  close: () => void;
}

function viewCard(v: SpectrumView): string {
  return `
    <article class="spectrum-view">
      <header class="spectrum-view-head">
        <h3>${v.name}</h3>
        <span class="spectrum-chrono">${v.chronology}</span>
      </header>
      <p class="spectrum-reads">${v.reads}</p>
      <p class="spectrum-strength"><span>Strength</span> ${v.strength}</p>
      <p class="spectrum-strain"><span>Strain</span> ${v.strain}</p>
    </article>`;
}

export function createSpectrumPanel(spectrum: InterpretiveSpectrum): SpectrumPanel {
  const root = document.createElement("div");
  root.className = "spectrum-overlay";
  root.innerHTML = `
    <div class="spectrum-card" role="dialog" aria-modal="true" aria-label="Interpretive spectrum">
      <button class="spectrum-close" type="button" aria-label="Close">×</button>
      <h2 class="spectrum-title">Reading the two timelines</h2>
      <p class="spectrum-intro">${spectrum.intro}</p>
      <div class="spectrum-views">${spectrum.views.map(viewCard).join("")}</div>
      <section class="spectrum-convergence">
        <div class="spectrum-convergence-head">⟡ Where they come closest</div>
        <p>${spectrum.convergence}</p>
      </section>
    </div>`;

  const close = (): void => root.classList.remove("is-open");
  const open = (): void => root.classList.add("is-open");

  root.querySelector(".spectrum-close")?.addEventListener("click", close);
  // Backdrop click (but not clicks inside the card) closes.
  root.addEventListener("click", (e) => {
    if (e.target === root) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  return { element: root, open, close };
}
