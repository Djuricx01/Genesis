import type { Cradle, Dossier, DossierPoint, ScripturalSite } from "../types";

export interface DossierPanel {
  element: HTMLElement;
  show: (d: Dossier) => void;
  hide: () => void;
}

/** A labelled, confidence-tagged row: a cradle milestone or a scriptural identification. */
function pointRow(p: DossierPoint): string {
  return `
    <li class="milestone">
      <div class="milestone-head">
        <span class="milestone-label">${p.label}</span>
        <span class="conf-chip conf-${p.confidence}">${p.confidence}</span>
      </div>
      <div class="milestone-value">${p.value}</div>
    </li>`;
}

function contestedBlock(d: Dossier): string {
  if (!d.contested) return "";
  const c = d.contested;
  return `
    <section class="contested-note">
      <div class="contested-head">⚖︎ Contested: ${c.title}</div>
      <p>${c.summary}</p>
      <p class="contested-status">${c.status}</p>
    </section>`;
}

/**
 * The shared detail panel. BOTH lenses render through this one component (§10 full parity):
 * the scientific lens leads with the four developmental milestones, the scriptural lens with
 * candidate identifications: structurally the same confidence-tagged rows, the same prose
 * sections, the same contested callout. Only the accent color (`lens-*`) differs.
 */
export function createDossierPanel(): DossierPanel {
  const root = document.createElement("aside");
  root.className = "dossier-panel";

  const hide = (): void => root.classList.remove("is-open");

  // Esc closes the drawer too (keyboard parity with the modals).
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("is-open")) hide();
  });

  const show = (d: Dossier): void => {
    root.className = `dossier-panel lens-${d.lens}`;
    root.innerHTML = `
      <button class="panel-close" type="button" aria-label="Close">×</button>
      <header class="panel-header">
        <h2>${d.name}</h2>
        <p class="panel-subtitle">${d.subtitle}</p>
        <p class="panel-river"><span>${d.meta.label}</span> ${d.meta.value}</p>
      </header>

      <h3 class="panel-section-title">${d.pointsTitle}</h3>
      <ul class="milestones">${d.points.map(pointRow).join("")}</ul>

      ${d.prose
        .map(
          (pr) =>
            `<h3 class="panel-section-title">${pr.title}</h3><p class="panel-prose">${pr.body}</p>`,
        )
        .join("")}

      ${contestedBlock(d)}

      <h3 class="panel-section-title">Sources</h3>
      <ul class="panel-sources">${d.sources.map((s) => `<li>${s}</li>`).join("")}</ul>
    `;
    root.querySelector(".panel-close")?.addEventListener("click", hide);
    root.classList.add("is-open");
  };

  return { element: root, show, hide };
}

/* ── Adapters: each lens maps its content onto the shared Dossier shape. ──────────────── */

export function cradleToDossier(c: Cradle): Dossier {
  return {
    lens: "science",
    name: c.name,
    subtitle: c.subtitle,
    meta: { label: "River system", value: c.riverSystem },
    pointsTitle: "Where & when",
    points: c.milestones.map((m) => ({ label: m.label, value: m.display, confidence: m.confidence })),
    prose: [
      { title: "How it happened", body: c.how },
      { title: "On its own terms", body: c.onItsOwnTerms },
    ],
    contested: c.contested,
    sources: c.sources,
  };
}

export function siteToDossier(s: ScripturalSite): Dossier {
  return {
    lens: "scripture",
    name: s.name,
    subtitle: s.subtitle,
    meta: { label: "Scripture", value: s.scripture },
    pointsTitle: s.identifications.length > 1 ? "Candidate identifications" : "Identification",
    points: s.identifications.map((i) => ({ label: i.label, value: i.display, confidence: i.confidence })),
    prose: [
      { title: "What the geography shows", body: s.evidence },
      { title: "How the tradition reads it", body: s.reads },
    ],
    contested: s.contested,
    sources: s.sources,
  };
}
