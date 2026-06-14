/** Shared content types, mirroring the structure of data/dossier/*.json. */

export type Confidence = "solid" | "contested" | "weak";

export interface Milestone {
  key: string;
  label: string;
  display: string;
  /** AxisYear when this milestone illuminates, or null if not placeable in time. */
  appearsAt: number | null;
  confidence: Confidence;
  source: string;
}

export interface ContestedNote {
  id: string;
  title: string;
  summary: string;
  status: string;
  confidence: Confidence;
}

export interface Cradle {
  id: string;
  name: string;
  subtitle: string;
  /** [lng, lat] */
  coordinates: [number, number];
  riverSystem: string;
  /** AxisYear when the cradle first becomes visible on the timeline. */
  appearsAt: number;
  milestones: Milestone[];
  how: string;
  onItsOwnTerms: string;
  contested?: ContestedNote;
  sources: string[];
}

export interface CradlesDoc {
  cradles: Cradle[];
}

/* ────────────────────────────────────────────────────────────────────────────
 * Scriptural layer (Phase 4). The §10 discipline: the scriptural lens carries the
 * SAME honesty machinery as the scientific one: every claim is confidence-tagged
 * and sourced, contested identifications render as contested, never as settled fact.
 * ──────────────────────────────────────────────────────────────────────────── */

/** A chronology for reading the scriptural timeline (genealogical date systems). */
export interface Chronology {
  /** Stable key, also used to look up per-event dates in `ScripturalSite.appearsAt`. */
  id: string;
  label: string;
  /** Calendar year BCE assigned to Creation (e.g. Ussher 4004, LXX ~5500). */
  creationBCE: number;
  note: string;
}

/** One of the four rivers of Eden (Genesis 2:10–14): metadata for the panel/legend. */
export interface EdenRiver {
  /** Modern/working name, e.g. "Tigris". */
  name: string;
  /** Hebrew/biblical name, e.g. "Hiddekel". */
  biblicalName: string;
  /** What the text says it "compasses", e.g. "Havilah (gold)". */
  compasses: string;
  /** Scholarly identification, e.g. "Wadi al-Batin paleochannel". */
  identifiedAs: string;
  confidence: Confidence;
}

/**
 * A scriptural place. Structurally parallel to a Cradle so it can feed the same panel:
 * `identifications` ≈ `milestones` (labelled, confidence-tagged rows); the two prose
 * blocks map onto "how"/"onItsOwnTerms".
 */
export interface ScripturalSite {
  id: string;
  name: string;
  subtitle: string;
  /** Scripture reference, e.g. "Genesis 2:10–14". */
  scripture: string;
  /** [lng, lat]: a representative point even for a fuzzy zone. */
  coordinates: [number, number];
  /** "zone" (fuzzy region) | "site" (settlement) | "mountain". Drives marker styling. */
  kind: "zone" | "site" | "mountain";
  /** Overall confidence in locating this place at all. */
  confidence: Confidence;
  /** AxisYear the place enters the timeline, keyed by chronology id (e.g. ussher/lxx). */
  appearsAt: Record<string, number>;
  /** Candidate identifications (label + display + confidence): the milestone analogue. */
  identifications: { label: string; display: string; confidence: Confidence }[];
  /** How the tradition reads the place (the "on its own terms" analogue). */
  reads: string;
  /** What the geography/archaeology shows (the "how it happened" analogue). */
  evidence: string;
  contested?: ContestedNote;
  sources: string[];
}

/** One position on the interpretive spectrum: fair on its strengths AND its strains. */
export interface SpectrumView {
  name: string;
  /** Which chronology / age-of-earth stance this view tends to take. */
  chronology: string;
  /** How it reads the relationship between the two timelines. */
  reads: string;
  /** Where the view is strong. */
  strength: string;
  /** Where it strains against the text or the evidence. */
  strain: string;
}

export interface InterpretiveSpectrum {
  intro: string;
  views: SpectrumView[];
  /** The LXX↔Egypt point where the two chronologies come closest. */
  convergence: string;
}

export interface ScripturalDoc {
  chronologies: Chronology[];
  rivers: EdenRiver[];
  sites: ScripturalSite[];
  spectrum: InterpretiveSpectrum;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Generic dossier shape: the shared panel renders THIS, so the scientific and
 * scriptural lenses get identical depth and styling (§10 full parity). Adapters
 * map Cradle → Dossier and ScripturalSite → Dossier (see panels/dossierPanel.ts).
 * ──────────────────────────────────────────────────────────────────────────── */

export interface DossierPoint {
  label: string;
  value: string;
  confidence: Confidence;
}

export interface DossierProse {
  title: string;
  body: string;
}

export interface Dossier {
  /** Which lens: drives the panel's accent color. */
  lens: "science" | "scripture";
  name: string;
  subtitle: string;
  /** Single key/value under the header: "River system" | "Scripture". */
  meta: { label: string; value: string };
  /** Heading for the confidence-tagged list: "Where & when" | "Candidate identifications". */
  pointsTitle: string;
  points: DossierPoint[];
  prose: DossierProse[];
  contested?: ContestedNote;
  sources: string[];
}
