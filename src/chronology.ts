import type { Chronology } from "./types";

/**
 * The chronology toggle (Phase 4 part C). Only meaningful under the scriptural lens: it chooses
 * which genealogical date system places the scriptural events on the timeline (Ussher ~4004 BCE
 * vs. the Septuagint's longer ~5500 BCE). Switching it re-gates the scriptural markers: the data
 * already carries both dates (scriptural.json `appearsAt.{ussher,lxx}`).
 */
export interface ChronologyToggle {
  element: HTMLElement;
  set: (id: string) => void;
}

interface ChronologyOptions {
  chronologies: Chronology[];
  initial: string;
  onChange: (id: string) => void;
}

export function createChronologyToggle(opts: ChronologyOptions): ChronologyToggle {
  const { chronologies } = opts;
  let active = opts.initial;

  const root = document.createElement("div");
  root.className = "chronology";

  const label = document.createElement("span");
  label.className = "chronology-label";
  label.textContent = "Chronology";

  const group = document.createElement("div");
  group.className = "chronology-group";
  group.setAttribute("role", "radiogroup");
  group.setAttribute("aria-label", "Chronology");

  const buttons = chronologies.map((c) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chronology-option";
    btn.dataset.chrono = c.id;
    btn.textContent = c.label;
    btn.title = c.note;
    btn.setAttribute("role", "radio");
    btn.addEventListener("click", () => set(c.id));
    group.appendChild(btn);
    return btn;
  });

  const caption = document.createElement("p");
  caption.className = "chronology-caption";

  root.append(label, group, caption);

  const render = (): void => {
    const chrono = chronologies.find((c) => c.id === active);
    for (const btn of buttons) {
      const on = btn.dataset.chrono === active;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-checked", String(on));
    }
    // The LXX caption surfaces the convergence; Ussher just states its date.
    if (chrono) {
      caption.textContent =
        chrono.id === "lxx"
          ? `Creation ~${chrono.creationBCE} BCE: brushes Egypt's first farming`
          : `Creation ${chrono.creationBCE} BCE`;
    }
  };

  const set = (id: string): void => {
    if (id === active) return;
    active = id;
    render();
    opts.onChange(id);
  };

  render();
  return { element: root, set };
}
