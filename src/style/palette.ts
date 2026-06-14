/**
 * Antique cartographic palette (§8). These are the *map* colors (consumed by MapLibre paint
 * properties in JS). UI-chrome colors mirror these as CSS variables in app.css: keep the two
 * in sync if you retune the look.
 */
export const palette = {
  /** Aged paper used for the sea: antique maps often leave water as bare parchment. */
  sea: "#e8dcc1",
  /** Slightly warmer, darker parchment for land. */
  land: "#dccca2",
  /** Crisp sepia coastline ink. */
  coastInk: "#5a4327",
  /** Soft bleed under the coast that mimics copperplate hatching. */
  coastBleed: "#917150",
  /** Faded ink-blue for river centerlines. */
  river: "#6d7f92",
  /** Muted madder wash for political areas. */
  boundaryWash: "#ad6a4f",
  /** Darker frontier ink. */
  boundaryInk: "#7c3f29",

  /* Scriptural lens (§10). A separate ink so the two lenses read as distinct hands on the
     same parchment: indigo for the secure (solid) Eden rivers, gilt amber for the contested
     features (matching the confidence system's --conf-contested). */
  /** Indigo ink for solid scriptural rivers (Tigris/Euphrates). */
  scriptureRiver: "#3f4f7a",
  /** Gilt amber for contested scriptural features (paleo-rivers + the Eden zone). */
  scriptureContested: "#9a6b1e",
} as const;
