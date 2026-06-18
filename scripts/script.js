// Mobile nav toggle — opens/closes the slide-down nav at <860px
function asideNavBar() {
  const nav     = document.querySelector(".aside .nav");
  const toggler = document.querySelector(".aside .nav_toggler");
  if (!nav) return;
  nav.classList.toggle("nav_transform");
  if (toggler) toggler.classList.toggle("is-open");
}

// Close nav when a link is clicked (mobile)
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".aside .nav li a").forEach((link) => {
    link.addEventListener("click", () => {
      const nav = document.querySelector(".aside .nav");
      const toggler = document.querySelector(".aside .nav_toggler");
      if (nav) nav.classList.remove("nav_transform");
      if (toggler) toggler.classList.remove("is-open");
    });
  });
});

// Scroll-to-top button
document.addEventListener("DOMContentLoaded", function () {
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    });
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

// Nav scroll spy — highlights active link based on scroll position
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".aside .nav li a");
  const sectionIds = ["home", "portfolio", "about"];

  const onScroll = () => {
    let current = "";
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section && window.scrollY >= section.offsetTop - 150) {
        current = id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
});

// ─── 3D tilt on project cards ──────────────────────────────────────────────
// Runs after projects are injected into the DOM via MutationObserver
(function initCardTilt() {
  const MAX_TILT = 7;

  function applyTilt(card) {
    card.addEventListener("mousemove", (e) => {
      const r   = card.getBoundingClientRect();
      const x   = e.clientX - r.left;
      const y   = e.clientY - r.top;
      const rx  = ((y / r.height) - 0.5) * -MAX_TILT * 2;
      const ry  = ((x / r.width)  - 0.5) *  MAX_TILT * 2;
      card.style.transform = `translateY(-10px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  }

  // Apply to existing cards and any added later
  function attachAll() {
    document.querySelectorAll(".project-card:not([data-tilt])").forEach((c) => {
      c.dataset.tilt = "1";
      applyTilt(c);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    attachAll();
    const grid = document.getElementById("projects-grid");
    if (grid) {
      new MutationObserver(attachAll).observe(grid, { childList: true });
    }
  });
})();

// ─── IntersectionObserver scroll-reveal ────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const revealEls = document.querySelectorAll(
    ".section, .skill-bookshelf-section, .about_content, .crl_card, .nfl-calendar-section"
  );
  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  revealEls.forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });
});

// ─── Typed.js ───────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  const typingElement = document.querySelector(".typing");

  if (typingElement) {
    const restartTypingAnimation = (instance) => {
      if (!instance.typing) {
        instance.reset();
      }
    };

    // Initialize Typed.js
    const typedInstance = new Typed(".typing", {
      strings: [
        "working on CI/CD Pipelines with Jenkins and EKS",
        "that ohhh .. you still here 🤩🤩 ",
        "building products that make a positive impact :-)",
      ],
      typeSpeed: 50,
      backSpeed: 35,
      loop: true,
      loopCount: Infinity,

      onComplete: (self) => {
        typingElement.addEventListener("mouseover", () =>
          restartTypingAnimation(self)
        );
        typingElement.addEventListener("click", () =>
          restartTypingAnimation(self)
        );
      },
    });
  }
});
