/**
 * The perspective toggle (§10): two lenses on the same ground. It owns no map state: it just
 * reports which lens is active; main.ts wires that to layer visibility and marker groups. The
 * base map, timeline, and panel are shared, so switching lenses never reloads anything.
 */
export type Lens = "science" | "scripture";

export interface PerspectiveToggle {
  element: HTMLElement;
  set: (lens: Lens) => void;
}

interface PerspectiveOptions {
  initial: Lens;
  onChange: (lens: Lens) => void;
}

const LENSES: { id: Lens; label: string }[] = [
  { id: "science", label: "Scientific" },
  { id: "scripture", label: "Scriptural" },
];

export function createPerspectiveToggle(opts: PerspectiveOptions): PerspectiveToggle {
  let active = opts.initial;

  const root = document.createElement("div");
  root.className = "perspective";
  root.setAttribute("role", "radiogroup");
  root.setAttribute("aria-label", "Perspective");

  const buttons = LENSES.map(({ id, label }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "perspective-option";
    btn.dataset.lens = id;
    btn.textContent = label;
    btn.setAttribute("role", "radio");
    btn.addEventListener("click", () => set(id));
    root.appendChild(btn);
    return btn;
  });

  const render = (): void => {
    for (const btn of buttons) {
      const on = btn.dataset.lens === active;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-checked", String(on));
    }
  };

  const set = (lens: Lens): void => {
    if (lens === active) return;
    active = lens;
    render();
    opts.onChange(lens);
  };

  render();
  return { element: root, set };
}
