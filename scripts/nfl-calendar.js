/**
 * NFL Team Calendar Picker
 * Fetches real-time schedules from the ESPN public API (no key needed)
 * and generates ICS files for any selected teams.
 */
document.addEventListener("DOMContentLoaded", () => {
  // ─── Team roster with ESPN IDs ────────────────────────────────────────────
  const NFL_TEAMS = [
    { id: "22", name: "Arizona Cardinals",    abbr: "ARI", color: "#97233F", division: "NFC West"  },
    { id: "1",  name: "Atlanta Falcons",      abbr: "ATL", color: "#A71930", division: "NFC South" },
    { id: "33", name: "Baltimore Ravens",     abbr: "BAL", color: "#241773", division: "AFC North" },
    { id: "2",  name: "Buffalo Bills",        abbr: "BUF", color: "#00338D", division: "AFC East"  },
    { id: "29", name: "Carolina Panthers",    abbr: "CAR", color: "#0085CA", division: "NFC South" },
    { id: "3",  name: "Chicago Bears",        abbr: "CHI", color: "#C83803", division: "NFC North" },
    { id: "4",  name: "Cincinnati Bengals",   abbr: "CIN", color: "#FB4F14", division: "AFC North" },
    { id: "5",  name: "Cleveland Browns",     abbr: "CLE", color: "#FF3C00", division: "AFC North" },
    { id: "6",  name: "Dallas Cowboys",       abbr: "DAL", color: "#003594", division: "NFC East"  },
    { id: "7",  name: "Denver Broncos",       abbr: "DEN", color: "#FB4F14", division: "AFC West"  },
    { id: "8",  name: "Detroit Lions",        abbr: "DET", color: "#0076B6", division: "NFC North" },
    { id: "9",  name: "Green Bay Packers",    abbr: "GB",  color: "#203731", division: "NFC North" },
    { id: "34", name: "Houston Texans",       abbr: "HOU", color: "#03202F", division: "AFC South" },
    { id: "11", name: "Indianapolis Colts",   abbr: "IND", color: "#002C5F", division: "AFC South" },
    { id: "30", name: "Jacksonville Jaguars", abbr: "JAX", color: "#006778", division: "AFC South" },
    { id: "12", name: "Kansas City Chiefs",   abbr: "KC",  color: "#E31837", division: "AFC West"  },
    { id: "13", name: "Las Vegas Raiders",    abbr: "LV",  color: "#A5ACAF", division: "AFC West"  },
    { id: "24", name: "Los Angeles Chargers", abbr: "LAC", color: "#0080C6", division: "AFC West"  },
    { id: "14", name: "Los Angeles Rams",     abbr: "LAR", color: "#003594", division: "NFC West"  },
    { id: "15", name: "Miami Dolphins",       abbr: "MIA", color: "#008E97", division: "AFC East"  },
    { id: "16", name: "Minnesota Vikings",    abbr: "MIN", color: "#4F2683", division: "NFC North" },
    { id: "17", name: "New England Patriots", abbr: "NE",  color: "#002244", division: "AFC East"  },
    { id: "18", name: "New Orleans Saints",   abbr: "NO",  color: "#D3BC8D", division: "NFC South" },
    { id: "19", name: "New York Giants",      abbr: "NYG", color: "#0B2265", division: "NFC East"  },
    { id: "20", name: "New York Jets",        abbr: "NYJ", color: "#125740", division: "AFC East"  },
    { id: "21", name: "Philadelphia Eagles",  abbr: "PHI", color: "#004C54", division: "NFC East"  },
    { id: "23", name: "Pittsburgh Steelers",  abbr: "PIT", color: "#FFB612", division: "AFC North" },
    { id: "25", name: "San Francisco 49ers",  abbr: "SF",  color: "#AA0000", division: "NFC West"  },
    { id: "26", name: "Seattle Seahawks",     abbr: "SEA", color: "#002244", division: "NFC West"  },
    { id: "27", name: "Tampa Bay Buccaneers", abbr: "TB",  color: "#D50A0A", division: "NFC South" },
    { id: "10", name: "Tennessee Titans",     abbr: "TEN", color: "#4B92DB", division: "AFC South" },
    { id: "28", name: "Washington Commanders",abbr: "WAS", color: "#5A1414", division: "NFC East"  },
  ];

  const DIVISIONS = [
    "AFC East","AFC North","AFC South","AFC West",
    "NFC East","NFC North","NFC South","NFC West",
  ];

  // ─── DOM refs ─────────────────────────────────────────────────────────────
  const grid          = document.getElementById("nfl-teams-grid");
  const downloadBtn   = document.getElementById("nfl-download-ics");
  const clearBtn      = document.getElementById("nfl-clear-btn");
  const selectAllBtn  = document.getElementById("nfl-select-all-btn");
  const statusEl      = document.getElementById("nfl-status");
  const countLabel    = document.getElementById("nfl-selected-count");
  const importGuide   = document.getElementById("nfl-import-guide");

  if (!grid) return;

  // ─── State ────────────────────────────────────────────────────────────────
  const selected = new Set();

  // ─── Render team grid grouped by division ─────────────────────────────────
  DIVISIONS.forEach((division) => {
    const teamsInDiv = NFL_TEAMS.filter((t) => t.division === division);

    const divWrapper = document.createElement("div");
    divWrapper.className = "nfl-division-group";

    const divTitle = document.createElement("h4");
    divTitle.className = "nfl-division-title";
    divTitle.textContent = division;
    divWrapper.appendChild(divTitle);

    const teamRow = document.createElement("div");
    teamRow.className = "nfl-division-teams";

    teamsInDiv.forEach((team) => {
      const card = document.createElement("button");
      card.className = "nfl-team-card";
      card.dataset.id = team.id;
      card.style.setProperty("--tc", team.color);
      card.title = team.name;
      card.innerHTML = `
        <span class="nfl-check-icon"><i class="fas fa-check"></i></span>
        <img
          src="https://a.espncdn.com/i/teamlogos/nfl/500/${team.abbr.toLowerCase()}.png"
          alt="${team.name} logo"
          class="nfl-logo"
          loading="lazy"
          onerror="this.src=''"
        />
        <span class="nfl-abbr">${team.abbr}</span>
      `;
      card.addEventListener("click", () => toggleTeam(team, card));
      teamRow.appendChild(card);
    });

    divWrapper.appendChild(teamRow);
    grid.appendChild(divWrapper);
  });

  // ─── Toggle selection ─────────────────────────────────────────────────────
  function toggleTeam(team, card) {
    if (selected.has(team.id)) {
      selected.delete(team.id);
      card.classList.remove("nfl-selected");
    } else {
      selected.add(team.id);
      card.classList.add("nfl-selected");
    }
    refreshUI();
  }

  function refreshUI() {
    const n = selected.size;
    countLabel.textContent =
      n === 0 ? "No teams selected" : `${n} team${n !== 1 ? "s" : ""} selected`;
    downloadBtn.disabled = n === 0;
    if (statusEl) statusEl.textContent = "";
    if (importGuide) importGuide.hidden = true;
  }

  // ─── Select all / clear ───────────────────────────────────────────────────
  selectAllBtn?.addEventListener("click", () => {
    NFL_TEAMS.forEach((team) => {
      selected.add(team.id);
      grid
        .querySelector(`[data-id="${team.id}"]`)
        ?.classList.add("nfl-selected");
    });
    refreshUI();
  });

  function clearAll() {
    selected.clear();
    grid
      .querySelectorAll(".nfl-team-card.nfl-selected")
      .forEach((c) => c.classList.remove("nfl-selected"));
    refreshUI();
  }

  clearBtn?.addEventListener("click", clearAll);
  document.getElementById("nfl-clear-btn-2")?.addEventListener("click", clearAll);

  // ─── ESPN API helpers ─────────────────────────────────────────────────────
  async function fetchTeamSchedule(teamId) {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamId}/schedule`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`ESPN API ${res.status} for team ${teamId}`);
    return res.json();
  }

  function parseGames(data, teamName) {
    return (data.events || [])
      .filter((e) => e.competitions?.[0])
      .map((e) => {
        const comp = e.competitions[0];
        const home = comp.competitors?.find((c) => c.homeAway === "home");
        const away = comp.competitors?.find((c) => c.homeAway === "away");
        const venue = comp.venue || {};
        const homeAbbr = home?.team?.abbreviation ?? "HOME";
        const awayAbbr = away?.team?.abbreviation ?? "AWAY";
        return {
          uid: e.id,
          start: new Date(e.date),
          summary: `🏈 ${awayAbbr} @ ${homeAbbr}`,
          description: `NFL ${e.season?.year ?? ""} — ${teamName}\n${e.name ?? ""}`,
          location: [venue.fullName, venue.address?.city, venue.address?.state]
            .filter(Boolean)
            .join(", "),
        };
      });
  }

  // ─── ICS builder ──────────────────────────────────────────────────────────
  function toUTC(date) {
    return date.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  }

  function buildICS(games) {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//NFL Schedule 2025//AK Portfolio//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:NFL Schedule 2025",
      "X-WR-TIMEZONE:America/New_York",
    ];

    games.forEach((g) => {
      const end = new Date(g.start.getTime() + 3 * 60 * 60 * 1000);
      lines.push(
        "BEGIN:VEVENT",
        `UID:${g.uid}@nfl-ak-portfolio`,
        `DTSTART:${toUTC(g.start)}`,
        `DTEND:${toUTC(end)}`,
        `SUMMARY:${g.summary}`,
        `DESCRIPTION:${g.description.replace(/\n/g, "\\n")}`,
        `LOCATION:${g.location}`,
        "END:VEVENT"
      );
    });

    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  }

  function triggerDownload(content, filename) {
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: filename,
    });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function setStatus(msg, type = "info") {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = `nfl-status-msg nfl-status-${type}`;
  }

  // ─── Download handler ─────────────────────────────────────────────────────
  downloadBtn?.addEventListener("click", async () => {
    const teamIds = [...selected];
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Fetching from ESPN…`;
    setStatus("⏳ Fetching live schedule data from ESPN…", "loading");

    try {
      const results = await Promise.all(
        teamIds.map((id) => {
          const team = NFL_TEAMS.find((t) => t.id === id);
          return fetchTeamSchedule(id).then((data) =>
            parseGames(data, team.name)
          );
        })
      );

      // Deduplicate by uid (shared games appear in both teams' schedules)
      const seen = new Set();
      const unique = results
        .flat()
        .filter((g) => {
          if (seen.has(g.uid)) return false;
          seen.add(g.uid);
          return true;
        })
        .sort((a, b) => a.start - b.start);

      if (unique.length === 0) {
        setStatus("No upcoming games found for the selected teams.", "error");
        return;
      }

      const ics = buildICS(unique);
      const teamNames = teamIds
        .map((id) => NFL_TEAMS.find((t) => t.id === id)?.abbr)
        .join("-");
      triggerDownload(ics, `nfl-schedule-${teamNames}-2025.ics`);

      setStatus(
        `✅ Downloaded ${unique.length} game${unique.length !== 1 ? "s" : ""} for ${teamIds.length} team${teamIds.length !== 1 ? "s" : ""}!`,
        "success"
      );
      if (importGuide) importGuide.hidden = false;
    } catch (err) {
      console.error("NFL schedule fetch error:", err);
      setStatus("❌ Could not fetch schedules from ESPN. Try again shortly.", "error");
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = `<i class="fas fa-download"></i> Download .ics`;
      downloadBtn.disabled = selected.size === 0;
    }
  });

  refreshUI();
});
