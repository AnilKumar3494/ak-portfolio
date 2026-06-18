/**
 * Visitor Tracker
 * - Tracks per-device visit count & first-visit date via localStorage
 * - Attempts a global hit count via CountAPI (free, no auth)
 * - Renders a subtle badge in the footer area
 */
(function initVisitorTracker() {
  // ── Per-device stats ──────────────────────────────────────────────────────
  const VISIT_KEY       = "ak_portfolio_visits";
  const FIRST_VISIT_KEY = "ak_portfolio_first_visit";

  const now       = new Date();
  const firstVisit = localStorage.getItem(FIRST_VISIT_KEY) || now.toISOString();
  const visits     = parseInt(localStorage.getItem(VISIT_KEY) || "0", 10) + 1;

  localStorage.setItem(VISIT_KEY, visits);
  if (!localStorage.getItem(FIRST_VISIT_KEY)) {
    localStorage.setItem(FIRST_VISIT_KEY, firstVisit);
  }

  const firstDate = new Date(firstVisit);
  const firstStr  = firstDate.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  // ── Inject badge ──────────────────────────────────────────────────────────
  const badge = document.createElement("div");
  badge.id = "visitor-badge";
  badge.className = "visitor-badge";
  badge.innerHTML = `
    <span class="vb-pulse"></span>
    <span class="vb-text">
      Your visit <strong>#${visits}</strong>
      <span class="vb-sep">·</span>
      <span class="vb-global" id="vb-global" title="Total page views">
        <i class="fas fa-globe" style="font-size:0.75rem;margin-right:2px;"></i>
        <span id="vb-global-count">…</span> visitors
      </span>
    </span>
  `;
  document.body.appendChild(badge);

  // First-visit tooltip
  if (visits === 1) {
    const tip = document.createElement("div");
    tip.className = "vb-welcome-tip";
    tip.textContent = "👋 Welcome! First time here?";
    document.body.appendChild(tip);
    setTimeout(() => tip.classList.add("vb-welcome-show"), 200);
    setTimeout(() => {
      tip.classList.remove("vb-welcome-show");
      setTimeout(() => tip.remove(), 500);
    }, 4000);
  }

  // ── Global counter via CountAPI ───────────────────────────────────────────
  // Free tier — namespace + key uniquely identify this counter
  const globalCountEl = document.getElementById("vb-global-count");
  fetch("https://api.countapi.xyz/hit/ak-portfolio-anil-kumar-2025/visitors")
    .then((r) => r.json())
    .then((data) => {
      if (data?.value && globalCountEl) {
        globalCountEl.textContent = data.value.toLocaleString();
      }
    })
    .catch(() => {
      // silently fall back — don't show broken UI
      const globalEl = document.getElementById("vb-global");
      if (globalEl) globalEl.style.display = "none";
    });

  // ── Hide after scroll (unobtrusive) ──────────────────────────────────────
  let hidden = false;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300 && !hidden) {
      badge.classList.add("vb-faded");
      hidden = true;
    } else if (window.scrollY <= 100 && hidden) {
      badge.classList.remove("vb-faded");
      hidden = false;
    }
  }, { passive: true });
})();
