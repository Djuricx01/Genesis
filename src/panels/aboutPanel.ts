/**
 * About & credits (Phase 7). A dismissible modal that states what the project is, its editorial
 * discipline (honesty about uncertainty, each tradition on its own terms), and full data/source
 * provenance with licenses: the credits UI the spec asks for, beyond the map's compact attribution.
 */
export interface AboutPanel {
  element: HTMLElement;
  open: () => void;
  close: () => void;
}

export function createAboutPanel(): AboutPanel {
  const root = document.createElement("div");
  root.className = "about-overlay";
  root.innerHTML = `
    <div class="about-card" role="dialog" aria-modal="true" aria-label="About Genesis">
      <button class="about-close" type="button" aria-label="Close">×</button>
      <h2 class="about-title">About Genesis</h2>
      <p class="about-intro">
        An antique-style map of where and how civilization began, told through two lenses on the
        same ground: the <strong>scientific</strong> record of the cradles, and the
        <strong>scriptural</strong> geography of Genesis. Each is shown on its own terms; every dated
        claim carries a confidence tag and a source, and nothing genuinely disputed is presented as
        settled fact in either lens.
      </p>

      <div class="about-grid">
        <section class="about-section">
          <h3>Reading the map</h3>
          <p>Frontiers feather with age: ancient borders are guesses and look like it; modern ones
          are sharp. Confidence is tagged <em>solid / contested / weak</em> throughout. Open the
          <em>“How to read this map”</em> key (bottom-left) for the full visual grammar.</p>
        </section>

        <section class="about-section">
          <h3>Base map &amp; boundaries</h3>
          <ul>
            <li>Coastlines &amp; rivers: <strong>Natural Earth</strong> (public domain).</li>
            <li>Historical boundaries: <strong>historical-basemaps</strong>, A. Ourednik
            (<strong>GPL-3.0</strong>); the dataset is kept swappable.</li>
            <li>Snapshots consolidated &amp; simplified with mapshaper; filtered by year on the GPU.</li>
          </ul>
        </section>

        <section class="about-section">
          <h3>The scientific lens</h3>
          <p>Six cradles (Mesopotamia, Caral-Supe, Egypt, Indus, China, Mesoamerica), each with the
          four-milestone model (farming · cities · writing · state) kept separate on purpose.
          Contested points (Caral’s maritime debate, the Olmec Cascajal Block) ship as contested.
          Per-claim sources appear in each cradle’s panel.</p>
        </section>

        <section class="about-section">
          <h3>The scriptural lens</h3>
          <p>Genesis geography (Eden and its four rivers, Ararat, Shinar &amp; Babel), with the
          Tigris/Euphrates secure and Pishon/Gihon/Eden’s location shown as reasoned, contested
          candidates (Zarins; Sauer; El-Baz). Both chronologies (Ussher ~4004 BCE, Septuagint
          ~5500 BCE) and a four-view interpretive spectrum are included.</p>
        </section>

        <section class="about-section">
          <h3>Type &amp; build</h3>
          <p>Set in <strong>IM Fell English</strong> and <strong>EB Garamond</strong>. Built with
          MapLibre GL JS, Vite, and TypeScript. Prose is original and neutral: no lifted
          encyclopedia text, no “myth/legend” framing.</p>
        </section>
      </div>
    </div>
  `;

  const close = (): void => root.classList.remove("is-open");
  const open = (): void => root.classList.add("is-open");

  root.querySelector(".about-close")?.addEventListener("click", close);
  root.addEventListener("click", (e) => {
    if (e.target === root) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  return { element: root, open, close };
}
