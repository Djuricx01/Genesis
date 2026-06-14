import { formatYear, formatYearCompact } from "./era";

export interface Timeline {
  element: HTMLElement;
  setValue: (year: number) => void;
}

interface TimelineOptions {
  min: number;
  max: number;
  initial: number;
  onChange: (year: number) => void;
}

/**
 * The timeline slider. Operates directly in AxisYear (no year-zero discontinuity to special-case
 *: see era.ts). The Play button animates the year forward so you can *watch* polities hand off
 * over the same ground; every tick is just a GPU filter update, never a re-fetch.
 */
export function createTimeline(opts: TimelineOptions): Timeline {
  const { min, max, onChange } = opts;
  let value = opts.initial;

  const root = document.createElement("div");
  root.className = "timeline";

  const readout = document.createElement("div");
  readout.className = "timeline-readout";

  const controls = document.createElement("div");
  controls.className = "timeline-controls";

  const playBtn = document.createElement("button");
  playBtn.className = "timeline-play";
  playBtn.type = "button";

  const slider = document.createElement("input");
  slider.type = "range";
  slider.className = "timeline-slider";
  slider.min = String(min);
  slider.max = String(max);
  slider.step = "1";

  const ends = document.createElement("div");
  ends.className = "timeline-ends";
  ends.innerHTML = `<span>${formatYearCompact(min)}</span><span>${formatYearCompact(max)}</span>`;

  controls.append(playBtn, slider);
  root.append(readout, controls, ends);

  const render = (): void => {
    readout.textContent = formatYear(value);
    slider.value = String(value);
  };

  // Apply a year. `emit` runs the (expensive) onChange: which re-filters the ~9k-feature boundary
  // layer and repaints blurred frontiers. During playback we render the slider/readout every frame
  // (smooth + cheap) but THROTTLE emits, because doing that heavy work 60×/s pins the GPU (fan spin,
  // dropped frames). Manual scrubs and pause/end emit immediately so the map always matches the readout.
  const EMIT_THROTTLE_MS = 120; // ~8 map updates/sec during playback
  let lastEmit = 0;
  const setValue = (year: number, emit = true): void => {
    value = Math.min(max, Math.max(min, Math.round(year)));
    render();
    if (emit) {
      onChange(value);
      lastEmit = performance.now();
    }
  };

  // --- playback ---
  let playing = false;
  let raf = 0;
  // Cross the whole span in ~35s.
  const perFrame = Math.max(1, Math.round((max - min) / (60 * 35)));

  const tick = (): void => {
    if (!playing) return;
    if (value >= max) {
      setValue(max, true); // land exactly on the end, applied
      stop();
      return;
    }
    setValue(value + perFrame, performance.now() - lastEmit >= EMIT_THROTTLE_MS);
    raf = requestAnimationFrame(tick);
  };
  const play = (): void => {
    if (value >= max) setValue(min, true); // replay from the start
    playing = true;
    playBtn.classList.add("is-playing");
    lastEmit = 0; // force an emit on the first tick
    raf = requestAnimationFrame(tick);
  };
  function stop(): void {
    playing = false;
    playBtn.classList.remove("is-playing");
    cancelAnimationFrame(raf);
  }

  playBtn.addEventListener("click", () => {
    if (playing) {
      stop();
      setValue(value, true); // pause → snap the map to the readout
    } else {
      play();
    }
  });
  slider.addEventListener("input", () => {
    stop();
    setValue(Number(slider.value), true);
  });

  render();
  return { element: root, setValue };
}
