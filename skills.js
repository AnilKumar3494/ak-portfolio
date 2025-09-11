document.addEventListener("DOMContentLoaded", () => {
    const skillsData = {
        "Frontend Development": [
            { name: "React", desc: "A library for building modern, interactive user interfaces, much like the dynamic parts of this page." },
            { name: "JavaScript", desc: "The core programming language of the web, making websites interactive and functional." },
            { name: "TypeScript", desc: "A superset of JavaScript that adds types, helping to write more robust and error-free code." },
            { name: "Next.js", desc: "A React framework for building fast, server-rendered websites and applications." },
            { name: "HTML5", desc: "The standard language for creating the structure and content of web pages." },
            { name: "CSS3", desc: "The language used to style and design web pages, from colors and fonts to complex layouts." },
            { name: "TailwindCSS", desc: "A utility-first CSS framework that allows for rapid and custom user interface design." },
        ],
        "Backend & APIs": [
            { name: "Node.js", desc: "Allows running JavaScript on the server, perfect for building fast and scalable network applications." },
            { name: "Python", desc: "A versatile language used for web development, data analysis, and automation." },
            { name: "Express.js", desc: "A minimal and flexible Node.js web application framework that provides a robust set of features." },
            { name: "Java", desc: "A robust, object-oriented programming language widely used for backend development and enterprise applications." },
            { name: "Spring Boot", desc: "A Java-based framework used for creating stand-alone, production-grade applications." },
            { name: "REST APIs", desc: "A standard way for different software applications to communicate with each other over the internet." },


        ],
        "Databases & DevOps": [
            { name: "PostgreSQL", desc: "A powerful, open-source object-relational database system known for its reliability." },
            { name: "MongoDB", desc: "A NoSQL database that stores data in flexible, JSON-like documents, ideal for a variety of applications." },
            { name: "Redis", desc: "An in-memory data store used as a database, cache, and message broker for high-speed operations." },
            { name: "Docker", desc: "A platform for developing, shipping, and running applications in containers, ensuring consistency across environments." },
            { name: "AWS", desc: "Amazon Web Services, a cloud computing platform providing a wide range of services like hosting and storage." },
            { name: "Git", desc: "A version control system for tracking changes in code, essential for collaborative software development." },
        ],
        "Testing": [
            { name: "Unit Testing", desc: "The practice of testing individual components of an application to ensure they work correctly." },
            { name: "RTL", desc: "React Testing Library, a tool for testing React components in a way that resembles how users interact with them." },
            { name: "TDD", desc: "Test-Driven Development, a process where tests are written before the actual code to guide development." },
        ],
    };

    const bookshelf = document.getElementById("bookshelf");
    const descriptionPanel = document.getElementById("skill-description-panel");
    const initialPanelText = descriptionPanel.innerHTML;

    const bookColors = ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6", "#1abc9c", "#e67e22"];
    let bookColorIndex = 0;
    let totalBookIndex = 0;

    for (const category in skillsData) {

        const shelfContainer = document.createElement('div');
        shelfContainer.className = 'shelf-container';

        const shelfTitle = document.createElement("h3");
        shelfTitle.className = "shelf-title";
        shelfTitle.textContent = category;

        const shelf = document.createElement("div");
        shelf.className = "shelf";

        skillsData[category].forEach((skill) => {
            const book = document.createElement("div");
            book.className = "book";
            book.textContent = skill.name;
            book.style.setProperty('--book-color', bookColors[bookColorIndex % bookColors.length]);
            book.style.animationDelay = `${totalBookIndex * 0.05}s`;

            book.addEventListener("mouseover", () => {
                descriptionPanel.innerHTML = `<span class="skill-name">${skill.name}</span>${skill.desc}`;
            });

            book.addEventListener('click', () => {
                const currentActive = document.querySelector('.book.is-active');
                if (currentActive) {
                    currentActive.classList.remove('is-active');
                }
                book.classList.add('is-active');
            });

            shelf.appendChild(book);
            bookColorIndex++;
            totalBookIndex++;
        });

        shelfContainer.appendChild(shelfTitle);
        shelfContainer.appendChild(shelf);
        bookshelf.appendChild(shelfContainer);
    }

    bookshelf.addEventListener('mouseleave', () => {
        descriptionPanel.innerHTML = initialPanelText;
        const currentActive = document.querySelector('.book.is-active');
        if (currentActive) {
            currentActive.classList.remove('is-active');
        }
    });
});