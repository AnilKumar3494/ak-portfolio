/**
 * GitHub Contribution Graph
 * Pulls the last year of public contributions from a token-free public API
 * and renders a themed heatmap plus a few fun stats. Fails quietly to a link
 * if the API can't be reached.
 */
document.addEventListener("DOMContentLoaded", () => {
  const USERNAME = "AnilKumar3494";
  const API = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`;

  const root = document.getElementById("gh-graph");
  if (!root) return;

  const gridEl   = document.getElementById("gh-grid");
  const totalEl  = document.getElementById("gh-total");
  const curEl    = document.getElementById("gh-current-streak");
  const longEl   = document.getElementById("gh-longest-streak");
  const bestEl   = document.getElementById("gh-best-day");
  const noteEl   = document.getElementById("gh-note");
  const statusEl = document.getElementById("gh-status");

  const fmtDate = (iso) =>
    new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

  function computeStats(days) {
    const total = days.reduce((s, d) => s + d.count, 0);

    // Longest run of consecutive active days anywhere in the range.
    let longest = 0, run = 0;
    for (const d of days) {
      run = d.count > 0 ? run + 1 : 0;
      if (run > longest) longest = run;
    }

    // Current streak = consecutive active days counting back from the end.
    let current = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) current++;
      else break;
    }

    const best = days.reduce(
      (m, d) => (d.count > m.count ? d : m),
      { count: 0, date: null }
    );

    return { total, longest, current, best };
  }

  function flavor(total, current) {
    if (current >= 14) return "🔥 On an absolute tear right now.";
    if (current >= 5)  return "🔥 Keeping the streak alive!";
    if (total >= 1000) return "🚀 A very busy year of shipping.";
    if (total >= 300)  return "🌱 Steady and consistent — the good kind of busy.";
    return "🧑‍💻 Building in public, one commit at a time.";
  }

  function renderGrid(days) {
    gridEl.innerHTML = "";
    // Pad the first column so weekdays line up (0 = Sunday).
    const firstWeekday = new Date(days[0].date + "T00:00:00").getDay();
    let col;
    const newCol = () => {
      col = document.createElement("div");
      col.className = "gh-col";
      gridEl.appendChild(col);
      return col;
    };
    newCol();
    for (let i = 0; i < firstWeekday; i++) {
      const pad = document.createElement("span");
      pad.className = "gh-cell gh-pad";
      col.appendChild(pad);
    }

    days.forEach((d) => {
      const weekday = new Date(d.date + "T00:00:00").getDay();
      if (weekday === 0 && col.children.length > 0) newCol();
      const cell = document.createElement("span");
      cell.className = "gh-cell";
      cell.dataset.level = d.level;
      cell.title = `${d.count} contribution${d.count !== 1 ? "s" : ""} on ${fmtDate(d.date)}`;
      col.appendChild(cell);
    });
  }

  (async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const days = (data.contributions || []).filter((d) => d && d.date);
      if (!days.length) throw new Error("no contribution data");

      renderGrid(days);
      const { total, longest, current, best } = computeStats(days);

      totalEl.textContent = total.toLocaleString();
      curEl.textContent   = `${current} day${current !== 1 ? "s" : ""}`;
      longEl.textContent  = `${longest} day${longest !== 1 ? "s" : ""}`;
      bestEl.textContent  = best.date ? `${best.count} · ${fmtDate(best.date)}` : "—";
      if (noteEl) noteEl.textContent = flavor(total, current);
      if (statusEl) statusEl.hidden = true;
      root.classList.add("gh-ready");
    } catch (err) {
      console.error("GitHub contributions fetch failed:", err);
      if (statusEl) {
        statusEl.innerHTML =
          `Couldn't load the live graph right now — ` +
          `<a href="https://github.com/${USERNAME}" target="_blank" rel="noopener">see it on GitHub →</a>`;
      }
    }
  })();
});
