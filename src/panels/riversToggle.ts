/**
 * Rivers visibility toggle (temporary control).
 *
 * The 10m river network is dense — great for the river-valley thesis, but it can read as busy.
 * This pill lets the viewer hide/show the `rivers` layer so they can judge the map both ways.
 * Like the other controls it owns no map state: it just reports the desired visibility and main.ts
 * wires that to the layer. Marked "temporary" per the design call — fold into the legend or retire
 * once the river styling is settled.
 */
export interface RiversToggle {
  element: HTMLElement;
  set: (visible: boolean) => void;
}

interface RiversToggleOptions {
  initial: boolean;
  onChange: (visible: boolean) => void;
}

export function createRiversToggle(opts: RiversToggleOptions): RiversToggle {
  let visible = opts.initial;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "rivers-toggle";

  const render = (): void => {
    btn.classList.toggle("is-active", visible);
    btn.setAttribute("aria-pressed", String(visible));
    // The squiggle glyph reads as a river at a glance; the label states what it does.
    btn.innerHTML = `<span class="rivers-toggle-glyph" aria-hidden="true">≈</span>${visible ? "Rivers" : "Rivers off"}`;
  };

  const set = (next: boolean): void => {
    if (next === visible) return;
    visible = next;
    render();
    opts.onChange(visible);
  };

  btn.addEventListener("click", () => set(!visible));

  render();
  return { element: btn, set };
}
