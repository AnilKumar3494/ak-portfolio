/**
 * Eagles Calendar Invite
 * Primary:   Download an ICS file built in real-time from ESPN's public API
 * Secondary: Email invite via Google Apps Script (requires user email)
 */
document.addEventListener("DOMContentLoaded", () => {
  // ── Email-based invite (secondary path) ──────────────────────────────────
  const form               = document.getElementById("inviteForm");
  const emailInput         = document.getElementById("email");
  const submitButton       = document.getElementById("submitButton");
  const formGroup          = document.getElementById("formGroup");
  const responseMessageDiv = document.getElementById("responseMessage");
  const responseIcon       = document.getElementById("responseIcon");
  const responseText       = document.getElementById("responseText");

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
  const EAGLES_TEAM_ID = "21";

  // Current NFL season — labeled by its starting year (2026 season = Sept 2026
  // → Feb 2027). Roll back before ~March while last season's playoffs finish.
  const SEASON = (() => {
    const now = new Date();
    return now.getMonth() >= 2 ? now.getFullYear() : now.getFullYear() - 1;
  })();

  // Keep the card heading in sync with the live season (e.g. "2026-27").
  const calTitle = document.getElementById("eagles-cal-title");
  if (calTitle) {
    calTitle.textContent =
      `Add All Eagles ${SEASON}-${String((SEASON + 1) % 100).padStart(2, "0")} Games to Calendar`;
  }

  const directBtn     = document.getElementById("eagles-direct-ics");
  const btnLabel      = document.getElementById("eagles-btn-label");
  const gameCountEl   = document.getElementById("eagles-game-count");
  const statusMsg     = document.getElementById("eagles-direct-status");
  const calShortcuts  = document.getElementById("eagles-cal-shortcuts");
  const step1         = document.getElementById("estep-1");
  const step2         = document.getElementById("estep-2");
  const step3         = document.getElementById("estep-3");

  if (!directBtn) return;

  // Cache fetched games so the download is instant on click
  let cachedGames = null;
  let fetchFailed = false;

  // ── Pre-fetch on page load ────────────────────────────────────────────────
  (async () => {
    try {
      const data  = await fetchEaglesSchedule();
      cachedGames = parseEaglesGames(data);

      if (cachedGames.length === 0) {
        setBtnReady(0, true);
        showStatus("No upcoming games found — check back closer to the season.", "error");
        return;
      }

      setBtnReady(cachedGames.length, false);
    } catch (err) {
      console.error("Eagles pre-fetch error:", err);
      fetchFailed = true;
      setBtnReady(0, true);
      showStatus("Couldn't reach ESPN. Click the button to retry.", "error");
    }
  })();

  // ── Click handler ─────────────────────────────────────────────────────────
  directBtn.addEventListener("click", async () => {
    // Retry fetch if it previously failed
    if (fetchFailed || !cachedGames) {
      directBtn.disabled = true;
      setBtnLoading(true);
      try {
        const data  = await fetchEaglesSchedule();
        cachedGames = parseEaglesGames(data);
        fetchFailed = false;
        setBtnReady(cachedGames.length, false);
      } catch (err) {
        showStatus("❌ Still can't reach ESPN. Check your connection.", "error");
        setBtnReady(0, true);
        return;
      } finally {
        directBtn.disabled = false;
        setBtnLoading(false);
      }
    }

    if (!cachedGames || cachedGames.length === 0) return;

    // Trigger download
    const ics = buildICS(cachedGames);
    triggerDownload(ics, `eagles-${SEASON}-schedule.ics`);

    // Advance step 1 → step 2
    if (step1) step1.classList.add("completed");
    if (step2) step2.classList.add("active");

    showStatus(`✅ ${cachedGames.length} Eagles games downloaded!`, "success");

    // Reveal calendar import shortcuts
    if (calShortcuts) calShortcuts.hidden = false;

    // After a short delay, tick off step 2 and hint at step 3
    setTimeout(() => {
      if (step2) step2.classList.add("completed");
      if (step3) step3.classList.add("active");
    }, 2500);
  });

  // ── UI helpers ────────────────────────────────────────────────────────────
  function setBtnLoading(on) {
    const spinner = directBtn.querySelector(".eagles-dl-spinner");
    const icon    = directBtn.querySelector(".eagles-dl-icon");
    if (spinner) spinner.style.display = on ? "" : "none";
    if (icon)    icon.style.display    = on ? "none" : "";
  }

  function setBtnReady(count, disabled) {
    directBtn.disabled = disabled;
    setBtnLoading(false);

    if (count > 0) {
      if (btnLabel)    btnLabel.textContent = `Download ${count} Eagles Games (.ics)`;
      if (gameCountEl) gameCountEl.textContent = "";
    } else {
      if (btnLabel)    btnLabel.textContent = "Download Eagles Schedule (.ics)";
      if (gameCountEl) gameCountEl.textContent = "";
    }
  }

  function showStatus(msg, type) {
    if (!statusMsg) return;
    statusMsg.textContent = msg;
    statusMsg.className   = `eagles-status-msg status-${type}`;
    statusMsg.hidden      = false;
  }

  // ── ESPN helpers ──────────────────────────────────────────────────────────
  async function fetchEaglesSchedule() {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${EAGLES_TEAM_ID}/schedule?season=${SEASON}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`ESPN API ${res.status}`);
    return res.json();
  }

  function parseEaglesGames(data) {
    return (data.events || [])
      .filter((e) => e.competitions?.[0])
      .map((e) => {
        const comp     = e.competitions[0];
        const home     = comp.competitors?.find((c) => c.homeAway === "home");
        const away     = comp.competitors?.find((c) => c.homeAway === "away");
        const venue    = comp.venue || {};
        const homeAbbr = home?.team?.abbreviation ?? "HOME";
        const awayAbbr = away?.team?.abbreviation ?? "AWAY";
        const isHomeGame = home?.team?.id === String(EAGLES_TEAM_ID);
        return {
          uid:         e.id,
          start:       new Date(e.date),
          summary:     `🦅 Eagles: ${awayAbbr} @ ${homeAbbr}${isHomeGame ? " 🏟" : ""}`,
          description: `Philadelphia Eagles — ${e.season?.year ?? SEASON} NFL Season\n${e.name ?? ""}`,
          location:    [venue.fullName, venue.address?.city, venue.address?.state]
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
      `PRODID:-//Eagles ${SEASON} Schedule//AK Portfolio//EN`,
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:🦅 Eagles ${SEASON} Season`,
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
