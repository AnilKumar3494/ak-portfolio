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
  const filterContainer = document.getElementById("filter-container"); // The main parent

  // (MODIFIED) Select the two new child containers
  const filterMainContainer = document.getElementById("filter-main-group");
  const filterTagsContainer = document.getElementById("filter-tags-group");

  const qlPreview   = document.getElementById("ql-preview");
  const qlTitle     = document.getElementById("ql-preview-title");
  const qlBackBtn   = document.getElementById("ql-back-btn");
  const qlOpenNew   = document.getElementById("ql-open-new");
  const qlLoader    = document.getElementById("ql-preview-loader");
  const qlIframe    = document.getElementById("ql-preview-frame");

  let allProjects = [];

  // --- 3. FETCH PROJECT DATA ---
  async function fetchProjects() {
    try {
      const response = await fetch("projects/updatedProjects.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      allProjects = await response.json();

      // --- INITIALIZATION (MODIFIED) ---

      // 1. Create the filter buttons. This function now populates both
      // containers and sets the default active button ("Pinned" or "All").
      createFilterButtons();

      // 2. Check for "Pinned" projects
      const pinnedProjects = allProjects.filter((p) =>
        p.tags.includes("Pinned")
      );

      if (pinnedProjects.length > 0) {
        // 3a. If we have pinned projects, render them.
        // The "Pinned" button is already set to active by createFilterButtons.
        renderProjects(pinnedProjects);
      } else {
        // 3b. Otherwise, render all.
        // The "All" button is already set to active by createFilterButtons.
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

      const quickLookBtn = project.links.live
        ? `<button class="card-btn btn-primary btn-quick-look" data-url="${project.links.live}" data-title="${project.title}"><i class="fas fa-eye" style="margin-right:0.35rem;font-size:0.85em;"></i>Quick Look</button>`
        : "";

      card.innerHTML = `
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
      `;
      grid.appendChild(card);
    });
  }

  /**
   * (MODIFIED) Creates filter buttons dynamically and puts them
   * into their respective 'main' and 'tags' containers.
   */
  function createFilterButtons() {
    const allTags = new Set();
    allProjects.forEach((project) => {
      project.tags.forEach((tag) => allTags.add(tag));
    });

    // Build a count map: tag → number of projects with that tag
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

    // --- Generate Main Buttons (Pinned/All) ---
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

    // --- Generate Tag Buttons (skill tags) ---
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

  // --- 5. INLINE QUICK LOOK PREVIEW ---
  // The preview takes the grid's place in the page instead of a floating modal.

  function openPreview(url, title) {
    qlTitle.textContent = title;
    qlOpenNew.href = url;

    qlIframe.classList.remove("loaded");
    qlLoader.style.display = "block";
    const existingErr = qlIframe.parentElement.querySelector(".iframe-error");
    if (existingErr) existingErr.remove();

    qlIframe.src = url;

    qlIframe.onload = () => {
      qlLoader.style.display = "none";
      qlIframe.classList.add("loaded");
    };
    qlIframe.onerror = () => {
      qlLoader.style.display = "none";
      if (!qlIframe.parentElement.querySelector(".iframe-error")) {
        const errorP = document.createElement("p");
        errorP.className = "iframe-error";
        errorP.textContent = "Sorry, this site can't be previewed here — use “Open site”.";
        qlIframe.parentElement.appendChild(errorP);
      }
    };

    // Hide the grid + filters, reveal the preview in their place
    grid.hidden = true;
    filterContainer.hidden = true;
    qlPreview.hidden = false;

    qlPreview.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closePreview() {
    qlPreview.hidden = true;
    grid.hidden = false;
    filterContainer.hidden = false;
    qlIframe.src = "about:blank";
    qlTitle.textContent = "";
  }

  // --- 6. EVENT LISTENERS ---

  /**
   * (MODIFIED) The parent container still catches all clicks, but the
   * logic for setting the 'active' class is updated to handle two groups.
   */
  filterContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-btn")) {
      // --- New Active State Logic ---
      // 1. Remove 'active' from all buttons in *both* containers
      filterMainContainer
        .querySelectorAll(".filter-btn.active")
        .forEach((btn) => btn.classList.remove("active"));
      filterTagsContainer
        .querySelectorAll(".filter-btn.active")
        .forEach((btn) => btn.classList.remove("active"));

      // 2. Add 'active' to the *clicked* button
      e.target.classList.add("active");
      // --- End New Logic ---

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
      const url = quickLookBtn.dataset.url;
      const title = quickLookBtn.dataset.title;
      openPreview(url, title);
    }
  });

  qlBackBtn.addEventListener("click", closePreview);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !qlPreview.hidden) {
      closePreview();
    }
  });

  // --- 7. INITIALIZE ---
  fetchProjects();
});
