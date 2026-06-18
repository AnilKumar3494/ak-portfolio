/**
 * Easter Eggs 🥚
 * 1. Console art on load
 * 2. Konami Code → confetti party
 * 3. Logo clicked 5× → "HIRE ME" overlay
 * 4. Idle 45s → cheeky message
 * 5. Secret word "hire" typed anywhere → flash animation
 */

// ─── 1. Console art ───────────────────────────────────────────────────────────
(function printConsoleArt() {
  const gold  = "color:#dfa70a;font-weight:bold;";
  const white = "color:#e9e9e9;font-size:13px;";
  const cyan  = "color:#00bfff;font-size:13px;";
  const green = "color:#33ff99;font-size:13px;font-weight:bold;";

  console.log(
    "%c" +
    "    _    _  __\n" +
    "   / \\  | |/ /\n" +
    "  / _ \\ | ' / \n" +
    " / ___ \\| . \\ \n" +
    "/_/   \\_\\_|\\_\\\n",
    "color:#dfa70a;font-family:monospace;font-size:16px;font-weight:bold;"
  );
  console.log("%c👀 Oh hey, you found the DevTools — respect.", white);
  console.log("%c🚀 Built by Anil Kumar — Full Stack & DevOps Engineer", green);
  console.log("%c📧 karapaanilkumar@gmail.com", cyan);
  console.log(
    "%c🔗 linkedin.com/in/anil-kumar-karapa/",
    cyan
  );
  console.log(
    "%c💡 Pro tip: try the Konami code on this page ↑↑↓↓←→←→BA",
    gold
  );
})();

// ─── 1.5. Ballmer "Developers!" GIF — click/tap to toggle ─────────────────────
(function ballmerEasterEgg() {
  document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.getElementById("hover-trigger");
    const popup   = document.getElementById("image-popup");
    if (!trigger || !popup) return;

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      popup.classList.toggle("show");
    });

    // Keyboard accessible: Enter/Space toggles too
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        popup.classList.toggle("show");
      }
    });

    // Tap/click anywhere else closes it
    document.addEventListener("click", (e) => {
      if (e.target !== trigger && !popup.contains(e.target)) {
        popup.classList.remove("show");
      }
    });
  });
})();

// ─── 2. Konami Code ───────────────────────────────────────────────────────────
(function konamiCode() {
  const SEQUENCE = [
    "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
    "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
    "b","a",
  ];
  let idx = 0;

  document.addEventListener("keydown", (e) => {
    if (e.key === SEQUENCE[idx]) {
      idx++;
      if (idx === SEQUENCE.length) {
        idx = 0;
        triggerPartyMode();
      }
    } else {
      idx = e.key === SEQUENCE[0] ? 1 : 0;
    }
  });

  function triggerPartyMode() {
    // Toast
    const toast = document.createElement("div");
    toast.className = "ee-toast";
    toast.innerHTML =
      "<span>🎉 DEVELOPER MODE ACTIVATED 🎉</span><br><small>Konami code unlocked!</small>";
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("ee-toast-show"), 10);
    setTimeout(() => {
      toast.classList.remove("ee-toast-show");
      setTimeout(() => toast.remove(), 400);
    }, 3000);

    // Big confetti burst
    burstConfetti(120);
  }
})();

// ─── 3. Logo 5× click ─────────────────────────────────────────────────────────
(function logoClickEasterEgg() {
  const logo = document.querySelector(".aside .logo a");
  if (!logo) return;

  let clicks = 0;
  let timer;

  logo.addEventListener("click", (e) => {
    e.preventDefault();
    clicks++;
    clearTimeout(timer);
    timer = setTimeout(() => (clicks = 0), 1200);

    if (clicks >= 5) {
      clicks = 0;
      showHireMeOverlay();
    }
  });

  function showHireMeOverlay() {
    if (document.getElementById("hire-me-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "hire-me-overlay";
    overlay.innerHTML = `
      <div class="hire-me-box">
        <div class="hire-me-emoji">🚀</div>
        <h2 class="hire-me-title">HIRE ME!</h2>
        <p class="hire-me-subtitle">Seriously though 🥺</p>
        <p class="hire-me-sub2">Full Stack · DevOps · Cloud · Enthusiastic Human</p>
        <a href="mailto:karapaanilkumar@gmail.com" class="hire-me-btn">
          📧 Let's Talk
        </a>
        <button class="hire-me-close" id="hire-me-close">Maybe later</button>
      </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add("hire-me-visible"), 10);
    burstConfetti(80);

    document.getElementById("hire-me-close").addEventListener("click", () => {
      overlay.classList.remove("hire-me-visible");
      setTimeout(() => overlay.remove(), 400);
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("hire-me-visible");
        setTimeout(() => overlay.remove(), 400);
      }
    });
  }
})();

// ─── 4. Idle message ──────────────────────────────────────────────────────────
(function idleMessage() {
  const IDLE_MS = 45000;
  const MESSAGES = [
    "👀 Still here? I like your dedication.",
    "☕ Go grab a coffee — I'll still be here.",
    "🤔 Thinking about reaching out?",
    "🎯 Psst… the email link is right up top.",
    "💡 Fun fact: This site runs on 0 frameworks. Just vibes.",
  ];
  let idleTimer;
  let toast;
  let msgIdx = 0;

  function resetIdle() {
    clearTimeout(idleTimer);
    if (toast) {
      toast.classList.remove("ee-toast-show");
    }
    idleTimer = setTimeout(showIdleMsg, IDLE_MS);
  }

  function showIdleMsg() {
    if (document.hidden) return;
    if (toast) toast.remove();
    toast = document.createElement("div");
    toast.className = "ee-toast ee-idle-toast";
    toast.textContent = MESSAGES[msgIdx % MESSAGES.length];
    msgIdx++;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("ee-toast-show"), 10);
    setTimeout(() => {
      toast.classList.remove("ee-toast-show");
      setTimeout(() => { if (toast) toast.remove(); toast = null; }, 400);
    }, 4500);
  }

  ["mousemove","keydown","scroll","click","touchstart"].forEach((ev) =>
    document.addEventListener(ev, resetIdle, { passive: true })
  );
  resetIdle();
})();

// ─── 5. Secret word "hire" typed anywhere ─────────────────────────────────────
(function secretWordEgg() {
  const TARGET = "hire";
  let buf = "";

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    buf = (buf + e.key).slice(-TARGET.length).toLowerCase();
    if (buf === TARGET) {
      buf = "";
      flashHireGlow();
    }
  });

  function flashHireGlow() {
    const flash = document.createElement("div");
    flash.className = "ee-hire-flash";
    flash.textContent = "💼 Hiring? Let's connect!";
    document.body.appendChild(flash);
    setTimeout(() => flash.classList.add("ee-hire-flash-show"), 10);
    setTimeout(() => {
      flash.classList.remove("ee-hire-flash-show");
      setTimeout(() => flash.remove(), 600);
    }, 2200);
  }
})();

// ─── Shared confetti helper ────────────────────────────────────────────────────
function burstConfetti(count = 60) {
  const colors = [
    "#dfa70a","#ff6b6b","#4ecdc4","#45b7d1","#f9ca24",
    "#6c5ce7","#fd79a8","#00b894","#e17055","#74b9ff",
  ];
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("div");
    dot.className = "ee-confetti-dot";
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist  = 150 + Math.random() * 250;
    const tx    = Math.cos(angle) * dist;
    const ty    = Math.sin(angle) * dist;
    const size  = 6 + Math.random() * 8;

    Object.assign(dot.style, {
      left: cx + "px",
      top:  cy + "px",
      width: size + "px",
      height: size + "px",
      background: color,
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      "--tx": tx + "px",
      "--ty": ty + "px",
    });
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 1400);
  }
}
