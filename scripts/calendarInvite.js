/**
 * Eagles Calendar Invite
 * Primary:   Download an ICS file built in real-time from ESPN's public API
 * Secondary: Email invite via Google Apps Script (requires user email)
 */
document.addEventListener("DOMContentLoaded", () => {
  // ── Email-based invite (secondary path) ──────────────────────────────────
  const form              = document.getElementById("inviteForm");
  const emailInput        = document.getElementById("email");
  const submitButton      = document.getElementById("submitButton");
  const formGroup         = document.getElementById("formGroup");
  const responseMessageDiv = document.getElementById("responseMessage");
  const responseIcon      = document.getElementById("responseIcon");
  const responseText      = document.getElementById("responseText");

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyYmu3bPV2n79YBC1uSPphErMxAGGrAmwLbR-QzqLtu71LrxemqDldZaj0K-w-FVciFVg/exec";

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      submitButton.disabled = true;
      submitButton.classList.add("loading");
      formGroup.classList.add("loading");
      emailInput.disabled = true;
      responseMessageDiv.classList.remove("visible", "success", "error");

      fetch(SCRIPT_URL, {
        method: "POST",
        redirect: "follow",
        body: new URLSearchParams({ email: emailInput.value }),
      })
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((data) => {
          responseText.textContent = data.message;
          responseIcon.className =
            data.status === "success"
              ? "fa-solid fa-circle-check"
              : "fa-solid fa-circle-xmark";
          responseMessageDiv.classList.add(
            data.status === "success" ? "success" : "error"
          );
          if (data.status === "success") form.reset();
        })
        .catch(() => {
          responseMessageDiv.classList.add("error");
          responseIcon.className = "fa-solid fa-triangle-exclamation";
          responseText.textContent =
            "Couldn't reach the server. Try the direct download below instead!";
        })
        .finally(() => {
          submitButton.disabled = false;
          submitButton.classList.remove("loading");
          formGroup.classList.remove("loading");
          emailInput.disabled = false;
          responseMessageDiv.classList.add("visible");
        });
    });
  }

  // ── Direct ICS download (primary path) ───────────────────────────────────
  const EAGLES_TEAM_ID = "21"; // ESPN team ID for Philadelphia Eagles

  const directBtn   = document.getElementById("eagles-direct-ics");
  const directStatus = document.getElementById("eagles-direct-status");

  if (!directBtn) return;

  directBtn.addEventListener("click", async () => {
    directBtn.disabled = true;
    directBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Fetching schedule…`;
    setDirectStatus("Fetching live schedule from ESPN…", "loading");

    try {
      const data  = await fetchEaglesSchedule();
      const games = parseEaglesGames(data);

      if (games.length === 0) {
        setDirectStatus("No upcoming games found. Check back later!", "error");
        return;
      }

      const ics = buildICS(games);
      triggerDownload(ics, "eagles-2025-schedule.ics");
      setDirectStatus(
        `✅ Downloaded ${games.length} Eagles games! Import the file into your calendar app.`,
        "success"
      );

      // Show import guide
      const guide = document.getElementById("eagles-import-guide");
      if (guide) guide.hidden = false;
    } catch (err) {
      console.error("Eagles ICS error:", err);
      setDirectStatus(
        "❌ Could not reach ESPN. Check your connection and try again.",
        "error"
      );
    } finally {
      directBtn.disabled = false;
      directBtn.innerHTML = `<i class="fas fa-download"></i> Download Eagles Schedule (.ics)`;
    }
  });

  function setDirectStatus(msg, type) {
    if (!directStatus) return;
    directStatus.textContent = msg;
    directStatus.className = `eagles-direct-status status-${type}`;
  }

  // ── ESPN helpers ──────────────────────────────────────────────────────────
  async function fetchEaglesSchedule() {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${EAGLES_TEAM_ID}/schedule`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`ESPN API ${res.status}`);
    return res.json();
  }

  function parseEaglesGames(data) {
    return (data.events || [])
      .filter((e) => e.competitions?.[0])
      .map((e) => {
        const comp    = e.competitions[0];
        const home    = comp.competitors?.find((c) => c.homeAway === "home");
        const away    = comp.competitors?.find((c) => c.homeAway === "away");
        const venue   = comp.venue || {};
        const homeAbbr = home?.team?.abbreviation ?? "HOME";
        const awayAbbr = away?.team?.abbreviation ?? "AWAY";
        const isHomeGame = home?.team?.id === EAGLES_TEAM_ID;
        return {
          uid:      e.id,
          start:    new Date(e.date),
          summary:  `🦅 Eagles: ${awayAbbr} @ ${homeAbbr}${isHomeGame ? " 🏟" : ""}`,
          description: `Philadelphia Eagles — ${e.season?.year ?? "2025"} NFL Season\n${e.name ?? ""}`,
          location: [venue.fullName, venue.address?.city, venue.address?.state]
            .filter(Boolean)
            .join(", "),
        };
      });
  }

  // ── ICS builder ───────────────────────────────────────────────────────────
  function toUTC(date) {
    return date.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  }

  function buildICS(games) {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Eagles 2025 Schedule//AK Portfolio//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:🦅 Eagles 2025 Season",
      "X-WR-TIMEZONE:America/New_York",
    ];

    games.forEach((g) => {
      const end = new Date(g.start.getTime() + 3 * 60 * 60 * 1000);
      lines.push(
        "BEGIN:VEVENT",
        `UID:${g.uid}@eagles-ak-portfolio`,
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
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), {
      href: url, download: filename,
    });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
});
