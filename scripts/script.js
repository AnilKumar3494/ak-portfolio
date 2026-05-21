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
