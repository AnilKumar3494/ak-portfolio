document.addEventListener("DOMContentLoaded", () => {
    const NICHE_TAGS_TO_HIDE = new Set([
        'Pinned'
    ]);
    const COMMON_TAGS_TO_HIDE = new Set([
        'Web App',
        'JavaScript',
        'HTML/CSS',
        'Responsive Design',
        'UI/UX',
        'Maps',
        'Desktop App'
    ]);

    const grid = document.getElementById('projects-grid');
    const filterContainer = document.getElementById('filter-container');
    const filterMainContainer = document.getElementById('filter-main-group');
    const filterTagsContainer = document.getElementById('filter-tags-group');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalLoader = document.getElementById('modal-loader');
    const modalIframe = document.getElementById('modal-iframe');

    let allProjects = [];

    async function fetchProjects() {
        try {
            const response = await fetch('projects/updatedProjects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allProjects = await response.json();
            createFilterButtons();
            const pinnedProjects = allProjects.filter(p => p.tags.includes('Pinned'));
            if (pinnedProjects.length > 0) {
                renderProjects(pinnedProjects);
            } else {
                renderProjects(allProjects);
            }
        } catch (error) {
            console.error("Could not fetch projects:", error);
            grid.innerHTML = '<p style="color: #ff9a9a; grid-column: 1 / -1;">Failed to load projects. Please try again later.</p>';
        }
    }

    function renderProjects(projectsToRender) {
        grid.innerHTML = '';
        if (projectsToRender.length === 0) {
            grid.innerHTML = '<p style="color: #999; grid-column: 1 / -1;">No projects found for this filter.</p>';
            return;
        }
        projectsToRender.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            const tagsHtml = project.tags
                .filter(tag => !NICHE_TAGS_TO_HIDE.has(tag))
                .map(tag => `<span class="card-tag">${tag}</span>`)
                .join('');
            const quickLookBtn = project.links.live
                ? `<button class="card-btn btn-primary btn-quick-look" data-url="${project.links.live}" data-title="${project.title}">Quick Look</button>`
                : '';
            card.innerHTML = `
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
            <a href="${project.links.github}" class="card-btn btn-secondary" target="_blank" rel="noopener noreferrer">View Code</a>
            ${quickLookBtn}
          </div>
        </div>
      `;
            grid.appendChild(card);
        });
    }

    function createFilterButtons() {
        const allTags = new Set();
        allProjects.forEach(project => {
            project.tags.forEach(tag => allTags.add(tag));
        });
        const tagsToExclude = new Set([...NICHE_TAGS_TO_HIDE, ...COMMON_TAGS_TO_HIDE]);
        const filteredTags = [...allTags]
            .filter(tag => !tagsToExclude.has(tag))
            .sort();
        const hasPinned = allProjects.some(p => p.tags.includes('Pinned'));
        const defaultActive = hasPinned ? 'Pinned' : 'All';
        let mainButtonsHtml = [];
        if (hasPinned) {
            mainButtonsHtml.push(`
                <button class="filter-btn ${defaultActive === 'Pinned' ? 'active' : ''}" data-filter="Pinned">Pinned</button>
            `);
        }
        mainButtonsHtml.push(`
            <button class="filter-btn ${defaultActive === 'All' ? 'active' : ''}" data-filter="All">All</button>
        `);
        filterMainContainer.innerHTML = mainButtonsHtml.join('');
        const tagsHtml = filteredTags.map(tag => `
            <button class="filter-btn" data-filter="${tag}">${tag}</button>
        `).join('');
        filterTagsContainer.innerHTML = tagsHtml;
    }

    function openModal(url, title) {
        modalTitle.textContent = title;
        modalIframe.src = url;
        modalIframe.classList.remove('loaded');
        modalLoader.style.display = 'block';
        modalOverlay.classList.add('show');
        modalIframe.onload = () => {
            modalLoader.style.display = 'none';
            modalIframe.classList.add('loaded');
        };
        modalIframe.onerror = () => {
            modalLoader.style.display = 'none';
            const errorP = document.createElement('p');
            errorP.className = 'iframe-error';
            errorP.style.color = '#ff9a9a';
            errorP.style.textAlign = 'center';
            errorP.textContent = 'Sorry, this site cannot be previewed here.';
            if (!modalIframe.parentElement.querySelector('.iframe-error')) {
                modalIframe.parentElement.appendChild(errorP);
            }
        };
    }

    function closeModal() {
        modalOverlay.classList.remove('show');
        setTimeout(() => {
            modalIframe.src = 'about:blank';
            modalTitle.textContent = 'Loading Project...';
            const errorMsg = modalIframe.parentElement.querySelector('.iframe-error');
            if (errorMsg) errorMsg.remove();
        }, 300);
    }

    filterContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            filterMainContainer.querySelectorAll('.filter-btn.active').forEach(btn => btn.classList.remove('active'));
            filterTagsContainer.querySelectorAll('.filter-btn.active').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            const filter = e.target.dataset.filter;
            let filteredProjects;
            if (filter === 'All') {
                filteredProjects = allProjects;
            } else if (filter === 'Pinned') {
                filteredProjects = allProjects.filter(project => project.tags.includes('Pinned'));
            } else {
                filteredProjects = allProjects.filter(project => project.tags.includes(filter));
            }
            renderProjects(filteredProjects);
        }
    });

    grid.addEventListener('click', (e) => {
        const quickLookBtn = e.target.closest('.btn-quick-look');
        if (quickLookBtn) {
            const url = quickLookBtn.dataset.url;
            const title = quickLookBtn.dataset.title;
            openModal(url, title);
        }
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('show')) {
            closeModal();
        }
    });

    fetchProjects();
});
