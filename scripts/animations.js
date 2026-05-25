/* animations.js — cursor, particles, section dots, ripple, count-up, timeline */

(function () {
  "use strict";

  const reduced  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch  = window.matchMedia("(pointer: coarse)").matches;
  const isDesktop = window.matchMedia("(min-width: 1261px)").matches;

  // ── Custom Cursor ────────────────────────────────────────────────────────────
  const dot  = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");

  if (!isTouch && !reduced && dot && ring) {
    let mx = -100, my = -100, rx = -100, ry = -100;
    let rafCursor;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top  = my + "px";
    });

    function lerpRing() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.left = rx + "px";
      ring.style.top  = ry + "px";
      rafCursor = requestAnimationFrame(lerpRing);
    }
    lerpRing();

    const hoverSel = "a, button, [role='button'], .card-btn, .filter-btn, .project-card, .section-dot, .style-switcher-toggler, input, .nav_toggler";

    function onEnter() { dot.classList.add("cur-hover"); ring.classList.add("cur-hover"); }
    function onLeave() { dot.classList.remove("cur-hover"); ring.classList.remove("cur-hover"); }

    function attachCursorHover(el) {
      if (el._cursorBound) return;
      el._cursorBound = true;
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    }

    document.querySelectorAll(hoverSel).forEach(attachCursorHover);

    // Pick up dynamically-added project cards
    const pgrid = document.getElementById("projects-grid");
    if (pgrid) {
      new MutationObserver(() => {
        pgrid.querySelectorAll(".project-card").forEach(attachCursorHover);
      }).observe(pgrid, { childList: true });
    }

    document.addEventListener("mouseleave", () => { dot.classList.add("cur-gone"); ring.classList.add("cur-gone"); });
    document.addEventListener("mouseenter", () => { dot.classList.remove("cur-gone"); ring.classList.remove("cur-gone"); });
  }

  // ── Hero Particles ────────────────────────────────────────────────────────────
  if (!reduced) {
    const canvas = document.getElementById("hero-particles");
    if (canvas) {
      const ctx   = canvas.getContext("2d");
      const COUNT = isDesktop ? 55 : 28;
      const DIST  = 120;
      let W, H, particles = [];
      let pmx = 0, pmy = 0;

      function resize() {
        const parent = canvas.parentElement;
        W = canvas.width  = parent.offsetWidth;
        H = canvas.height = parent.offsetHeight;
        pmx = W / 2; pmy = H / 2;
      }

      resize();
      window.addEventListener("resize", resize, { passive: true });

      canvas.parentElement.addEventListener("mousemove", (e) => {
        const r = canvas.getBoundingClientRect();
        pmx = e.clientX - r.left;
        pmy = e.clientY - r.top;
      }, { passive: true });

      function mkParticle() {
        return {
          x:  Math.random() * W,
          y:  Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r:  Math.random() * 1.4 + 0.5,
          a:  Math.random() * 0.5 + 0.2,
        };
      }

      for (let i = 0; i < COUNT; i++) particles.push(mkParticle());

      function tick() {
        ctx.clearRect(0, 0, W, H);
        const dark  = document.body.classList.contains("dark");
        const base  = dark ? "255,255,255" : "100,100,120";

        for (let i = 0; i < particles.length; i++) {
          const p  = particles[i];
          const dx = p.x - pmx, dy = p.y - pmy;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) { p.vx += (dx / d) * 0.06; p.vy += (dy / d) * 0.06; }
          const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (spd > 1.1) { p.vx /= spd; p.vy /= spd; }
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${base},${p.a})`;
          ctx.fill();

          for (let j = i + 1; j < particles.length; j++) {
            const q   = particles[j];
            const ddx = p.x - q.x, ddy = p.y - q.y;
            const dd  = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dd < DIST) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(${base},${(1 - dd / DIST) * 0.12})`;
              ctx.lineWidth   = 0.5;
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(tick);
      }
      tick();
    }
  }

  // ── Section Progress Dots ─────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("section-dots");
    if (!container) return;

    const SECTIONS = [
      { id: "home",      label: "Home" },
      { id: "portfolio", label: "Projects" },
      { id: "about",     label: "About" },
    ];

    SECTIONS.forEach(({ id, label }) => {
      const d = document.createElement("div");
      d.className       = "section-dot";
      d.dataset.target  = id;
      d.dataset.label   = label;
      d.title           = label;
      d.addEventListener("click", () => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      });
      container.appendChild(d);
    });

    const allDots = container.querySelectorAll(".section-dot");

    function sync() {
      let cur = SECTIONS[0].id;
      SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 220) cur = id;
      });
      allDots.forEach((d) => d.classList.toggle("sd-active", d.dataset.target === cur));
    }

    window.addEventListener("scroll", sync, { passive: true });
    sync();
  });

  // ── Button Ripple ─────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    const SEL = ".btn, .card-btn, .filter-btn, .eagles-download-btn, .nfl-btn";

    function addRipple(btn) {
      if (btn._rippleBound) return;
      btn._rippleBound = true;
      btn.addEventListener("click", (e) => {
        const r    = btn.getBoundingClientRect();
        const size = Math.max(r.width, r.height);
        const span = document.createElement("span");
        span.className  = "ripple";
        span.style.cssText = `
          width:${size}px;height:${size}px;
          left:${e.clientX - r.left - size/2}px;
          top:${e.clientY - r.top  - size/2}px;
        `;
        btn.appendChild(span);
        setTimeout(() => span.remove(), 620);
      });
    }

    document.querySelectorAll(SEL).forEach(addRipple);

    // Pick up dynamically added buttons (NFL team cards, project buttons)
    new MutationObserver(() => {
      document.querySelectorAll(SEL).forEach(addRipple);
    }).observe(document.body, { childList: true, subtree: true });
  });

  // ── Timeline Entrance ─────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".timeline_item");
    if (!items.length || reduced) {
      items.forEach((el) => el.classList.add("tl-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("tl-visible"); io.unobserve(e.target); }
      }),
      { threshold: 0.25 }
    );
    items.forEach((el) => io.observe(el));
  });

  // ── CRL Stats Count-up ────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    const card = document.querySelector(".crl_card");
    if (!card || reduced) return;

    function runCountUp() {
      card.querySelectorAll(".crl_value").forEach((el) => {
        if (el._counted) return;
        const raw = el.textContent.trim();
        const num = parseFloat(raw.replace(/,/g, ""));
        if (isNaN(num) || num === 0) return;
        el._counted  = true;
        el.classList.add("crl-counting");
        const start = performance.now();
        const DUR   = 1100;
        function step(now) {
          const t = Math.min((now - start) / DUR, 1);
          const e = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(e * num).toLocaleString();
          if (t < 1) requestAnimationFrame(step);
          else { el.textContent = raw; el.classList.remove("crl-counting"); }
        }
        requestAnimationFrame(step);
      });
    }

    const io = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { runCountUp(); io.disconnect(); } },
      { threshold: 0.5 }
    );
    io.observe(card);

    // Also trigger if already in view when stats load (Clash Royale fetch)
    const crlObserver = new MutationObserver(() => {
      const val = card.querySelector(".crl_value");
      if (val && val.textContent !== "Loading..." && val.textContent !== "N/A") {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight) runCountUp();
      }
    });
    crlObserver.observe(card, { subtree: true, childList: true, characterData: true });
  });

  // ── Magnetic effect on hero CTA ───────────────────────────────────────────────
  if (!isTouch && isDesktop && !reduced) {
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll(".btn, .open-to-work-badge").forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
          const r  = btn.getBoundingClientRect();
          const cx = r.left + r.width  / 2;
          const cy = r.top  + r.height / 2;
          const dx = (e.clientX - cx) * 0.25;
          const dy = (e.clientY - cy) * 0.25;
          btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        btn.addEventListener("mouseleave", () => {
          btn.style.transform = "";
        });
      });
    });
  }

})();
