// Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. CONFIGURATION ---
  const NICHE_TAGS_TO_HIDE = new Set(["Pinned"]);
  const COMMON_TAGS_TO_HIDE = new Set([
    "Web App",
    "JavaScript",
    "HTML/CSS",
    "Responsive Design",
    "UI/UX",
    "Maps",
    "Desktop App",
    "Node.js",
    "OAuth",
    "Full Stack",
    "MySQL",
  ]);

  // --- 2. SELECT DOM ELEMENTS ---
  const grid = document.getElementById("projects-grid");
  const filterContainer = document.getElementById("filter-container");
  const filterMainContainer = document.getElementById("filter-main-group");
  const filterTagsContainer = document.getElementById("filter-tags-group");

  let allProjects = [];

  // --- 3. FETCH PROJECT DATA ---
  async function fetchProjects() {
    try {
      const response = await fetch("projects/updatedProjects.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      allProjects = await response.json();

      createFilterButtons();

      const pinnedProjects = allProjects.filter((p) =>
        p.tags.includes("Pinned")
      );

      if (pinnedProjects.length > 0) {
        renderProjects(pinnedProjects);
      } else {
        renderProjects(allProjects);
      }
    } catch (error) {
      console.error("Could not fetch projects:", error);
      grid.innerHTML =
        '<p style="color: #ff9a9a; grid-column: 1 / -1;">Failed to load projects. Please try again later.</p>';
    }
  }

  // --- 4. RENDER FUNCTIONS ---

  function renderProjects(projectsToRender) {
    grid.innerHTML = "";
    if (projectsToRender.length === 0) {
      grid.innerHTML =
        '<p class="projects-empty-msg">No projects found for this filter.</p>';
      return;
    }

    projectsToRender.forEach((project, index) => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.style.animationDelay = `${index * 0.07}s`;

      const tagsHtml = project.tags
        .filter((tag) => !NICHE_TAGS_TO_HIDE.has(tag))
        .map((tag) => `<span class="card-tag">${tag}</span>`)
        .join("");

      const isPinned = project.tags.includes("Pinned");
      if (isPinned) card.classList.add("is-pinned");

      const hasLive = !!project.links.live;

      const quickLookBtn = hasLive
        ? `<button class="card-btn btn-primary btn-quick-look" data-url="${project.links.live}" data-title="${project.title}"><i class="fas fa-eye" style="margin-right:0.35rem;font-size:0.85em;"></i>Quick Look</button>`
        : "";

      const cardBackHtml = hasLive
        ? `
        <div class="card-back">
          <div class="card-back-bar">
            <button class="card-flip-close" aria-label="Back to project">
              <i class="fas fa-arrow-left"></i> Back
            </button>
            <span class="card-back-title">${project.title}</span>
            <a class="card-back-open" href="${project.links.live}" target="_blank" rel="noopener noreferrer" title="Open site in new tab">
              <i class="fas fa-up-right-from-square"></i>
            </a>
          </div>
          <div class="card-back-body">
            <div class="card-back-loader"></div>
            <iframe class="card-back-frame" src="" frameborder="0" title="${project.title} preview"></iframe>
          </div>
        </div>`
        : "";

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            ${isPinned ? '<span class="card-pinned-ribbon" title="Featured project">📌</span>' : ""}
            <div class="card-image-container">
              <img src="${project.image}" alt="${project.title} Preview" loading="lazy">
            </div>
            <div class="card-content">
              <h3 class="card-title">${project.title}</h3>
              <p class="card-description">${project.description}</p>
              <div class="card-tags">
                ${tagsHtml}
              </div>
              <div class="card-links">
                <a href="${project.links.github}" class="card-btn btn-secondary" target="_blank" rel="noopener noreferrer"><i class="fab fa-github" style="margin-right:0.35rem;"></i>View Code</a>
                ${quickLookBtn}
              </div>
            </div>
          </div>
          ${cardBackHtml}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function createFilterButtons() {
    const allTags = new Set();
    allProjects.forEach((project) => {
      project.tags.forEach((tag) => allTags.add(tag));
    });

    const tagCounts = {};
    allProjects.forEach((p) => {
      p.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const tagsToExclude = new Set([
      ...NICHE_TAGS_TO_HIDE,
      ...COMMON_TAGS_TO_HIDE,
    ]);

    const filteredTags = [...allTags]
      .filter((tag) => !tagsToExclude.has(tag))
      .sort();

    const hasPinned = allProjects.some((p) => p.tags.includes("Pinned"));
    const defaultActive = hasPinned ? "Pinned" : "All";
    const pinnedCount = tagCounts["Pinned"] || 0;

    let mainButtonsHtml = [];
    if (hasPinned) {
      mainButtonsHtml.push(`
        <button class="filter-btn ${defaultActive === "Pinned" ? "active" : ""}" data-filter="Pinned">
          Pinned <span class="filter-count">${pinnedCount}</span>
        </button>
      `);
    }
    mainButtonsHtml.push(`
      <button class="filter-btn ${defaultActive === "All" ? "active" : ""}" data-filter="All">
        All <span class="filter-count">${allProjects.length}</span>
      </button>
    `);

    filterMainContainer.innerHTML = mainButtonsHtml.join("");

    const tagsHtml = filteredTags
      .map(
        (tag) => `
          <button class="filter-btn" data-filter="${tag}">
            ${tag} <span class="filter-count">${tagCounts[tag] || 0}</span>
          </button>
        `
      )
      .join("");

    filterTagsContainer.innerHTML = tagsHtml;
  }

  // --- 5. CARD FLIP QUICK LOOK ---

  function flipCard(card, url) {
    const inner = card.querySelector(".card-inner");
    const frame = card.querySelector(".card-back-frame");
    const loader = card.querySelector(".card-back-loader");

    if (!inner || !frame) return;

    frame.classList.remove("loaded");
    if (loader) loader.style.display = "block";

    frame.src = url;

    frame.onload = () => {
      if (loader) loader.style.display = "none";
      frame.classList.add("loaded");
    };

    inner.classList.add("flipped");
    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function unflipCard(card) {
    const inner = card.querySelector(".card-inner");
    const frame = card.querySelector(".card-back-frame");

    if (!inner) return;
    inner.classList.remove("flipped");

    setTimeout(() => {
      if (frame && !inner.classList.contains("flipped")) {
        frame.src = "";
        frame.classList.remove("loaded");
        const loader = card.querySelector(".card-back-loader");
        if (loader) loader.style.display = "block";
      }
    }, 700);
  }

  // --- 6. EVENT LISTENERS ---

  filterContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-btn")) {
      filterMainContainer
        .querySelectorAll(".filter-btn.active")
        .forEach((btn) => btn.classList.remove("active"));
      filterTagsContainer
        .querySelectorAll(".filter-btn.active")
        .forEach((btn) => btn.classList.remove("active"));

      e.target.classList.add("active");

      const filter = e.target.dataset.filter;
      let filteredProjects;

      if (filter === "All") {
        filteredProjects = allProjects;
      } else if (filter === "Pinned") {
        filteredProjects = allProjects.filter((project) =>
          project.tags.includes("Pinned")
        );
      } else {
        filteredProjects = allProjects.filter((project) =>
          project.tags.includes(filter)
        );
      }

      renderProjects(filteredProjects);
    }
  });

  grid.addEventListener("click", (e) => {
    const quickLookBtn = e.target.closest(".btn-quick-look");
    if (quickLookBtn) {
      const card = quickLookBtn.closest(".project-card");
      const url = quickLookBtn.dataset.url;
      flipCard(card, url);
      return;
    }

    const flipClose = e.target.closest(".card-flip-close");
    if (flipClose) {
      const card = flipClose.closest(".project-card");
      unflipCard(card);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".card-inner.flipped").forEach((inner) => {
        unflipCard(inner.closest(".project-card"));
      });
    }
  });

  // --- 7. INITIALIZE ---
  fetchProjects();
});
