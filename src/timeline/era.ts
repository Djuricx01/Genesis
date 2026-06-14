/**
 * era.ts: the single source of truth for time in Genesis.
 *
 * CONVENTION: proleptic Gregorian decimal, NO YEAR ZERO.
 *   axis  1.0  = 1 Jan 1 CE
 *   axis  0.0  = 1 Jan 1 BCE      (there is no year 0: 1 BCE sits at the origin)
 *   axis -3000.0 = 1 Jan 3001 BCE
 *
 * So each calendar year occupies a unit interval on the axis:
 *   1 CE   = [1.0, 2.0)
 *   1 BCE  = [0.0, 1.0)
 *   2 BCE  = [-1.0, 0.0)
 *
 * Why a continuous decimal instead of a signed integer year? Because historians skip year 0
 * while the math axis must not: putting the discontinuity in *display* (where humans read it)
 * and keeping the *axis* continuous means the timeline slider never hits an off-by-one cliff
 * at the BCE/CE boundary. Every conversion lives here; nothing else should do year math.
 */

/** A point on the time axis (proleptic Gregorian decimal, no year zero). */
export type AxisYear = number;

/** Authoring helper: BCE calendar year → axis. `bce(2334)` === -2333. `bce(1)` === 0. */
export function bce(calendarYear: number): AxisYear {
  if (calendarYear < 1) throw new Error(`bce() expects a positive year; got ${calendarYear}`);
  return 1 - calendarYear;
}

/** Authoring helper: CE calendar year → axis. `ce(1700)` === 1700. `ce(1)` === 1. */
export function ce(calendarYear: number): AxisYear {
  if (calendarYear < 1) throw new Error(`ce() expects a positive year; got ${calendarYear}`);
  return calendarYear;
}

/**
 * Format an axis value for humans, e.g. -2333 → "2334 BCE", 1700 → "1700 CE".
 * The floor() handles fractional axis positions (the slider may land mid-year).
 */
export function formatYear(axis: AxisYear): string {
  if (axis >= 1) return `${Math.floor(axis)} CE`;
  // Below 1.0 we are in BCE. 1 - floor(axis) inverts the axis back to a calendar year:
  //   axis 0.0  → 1 - 0  = 1 BCE
  //   axis -1.0 → 1 - -1 = 2 BCE
  return `${1 - Math.floor(axis)} BCE`;
}

/** Compact label for tight UI (no "CE" suffix on positive years): "2334 BCE", "1700". */
export function formatYearCompact(axis: AxisYear): string {
  return axis >= 1 ? `${Math.floor(axis)}` : `${1 - Math.floor(axis)} BCE`;
}

/** Clamp an axis value into [min, max]. */
export function clampYear(axis: AxisYear, min: AxisYear, max: AxisYear): AxisYear {
  return Math.min(max, Math.max(min, axis));
}

/** Default span for the POC timeline: 10000 BCE → 2025 CE. */
export const TIMELINE_MIN: AxisYear = bce(10000); // -9999
export const TIMELINE_MAX: AxisYear = ce(2025); //  2025
