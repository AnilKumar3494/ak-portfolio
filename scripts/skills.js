document.addEventListener("DOMContentLoaded", () => {
  const skillsData = {
    "Frontend Development": [
      {
        name: "JavaScript",
        desc: "The core programming language of the web, making websites interactive and functional. I 💖 JS",
      },
      {
        name: "TypeScript",
        desc: "More lines of JavaScript that adds types and more squiggly line but kinda non breakble code iykyk!",
      },
      {
        name: "React",
        desc: "A library for building modern, interactive user interfaces, much like the dynamic parts of this page.",
      },
      {
        name: "Next.js",
        desc: "A React framework for building fast, server-rendered websites and applications.",
      },
      {
        name: "HTML5",
        desc: "A bunch of standard characters for creating the structure and content of web pages.",
      },
      {
        name: "CSS3",
        desc: "The language? maybe but it is used to style and design web pages into complex layouts.",
      },
      {
        name: "TailwindCSS",
        desc: "A utility-first CSS framework that allows for rapid and not so custom user interface design.",
      },
    ],
    "Backend & APIs": [
      {
        name: "Node.js",
        desc: "Allows running JavaScript on the server, it is NOT perfect for that case but we use it anyways.",
      },
      {
        name: "Python",
        desc: "A language used that can be used for everything .. even speaking!",
      },
      {
        name: "Express.js",
        desc: "A flexible Node.js framework that provides some features.",
      },
      {
        name: "RESTful APIs",
        desc: "An OG way for software applications to communicate with each other over the internet.",
      },
    ],
    "Databases & DevOps": [
      {
        name: "PostgreSQL",
        desc: "An open-source object-relational database system known for its reliability.",
      },
      {
        name: "MongoDB",
        desc: "A NoSQL database that stores data with a nice stock price increase!",
      },
      {
        name: "Redis",
        desc: "RAM for databases might result in high-speed operations.",
      },
      {
        name: "Docker",
        desc: "A big whale that can store eveything and can be passed on for other to use and test.",
      },
      {
        name: "AWS",
        desc: "Amazon Web Services, a cloud computing platform providing a wide range of services like hosting and storage.",
      },
      {
        name: "Git",
        desc: "An other OG - a version control system, a place where all the code lives.",
      },
      {
        name: "K8s",
        desc: "Makes Deployments Oraganization so so much better",
      },
    ],
    Testing: [
      {
        name: "Unit Testing",
        desc: "The practice of testing individual components of an application to ensure they work correctly.",
      },
      {
        name: "RTL",
        desc: "React Testing Library, a tool for testing React components in a way that resembles how users interact with them.",
      },
      {
        name: "TDD",
        desc: "Test-Driven Development, a process where tests are written before the actual code to guide development.",
      },
    ],
  };

  const bookshelf = document.getElementById("bookshelf");
  const descriptionPanel = document.getElementById("skill-description-panel");
  const initialPanelText = descriptionPanel.innerHTML;

  const bookColors = [
    "#3498db",
    "#e74c3c",
    "#2ecc71",
    "#f1c40f",
    "#9b59b6",
    "#1abc9c",
    "#e67e22",
  ];
  let bookColorIndex = 0;
  let totalBookIndex = 0;

  for (const category in skillsData) {
    const shelfContainer = document.createElement("div");
    shelfContainer.className = "shelf-container";

    const shelfTitle = document.createElement("h3");
    shelfTitle.className = "shelf-title";
    shelfTitle.textContent = category;

    const shelf = document.createElement("div");
    shelf.className = "shelf";

    skillsData[category].forEach((skill) => {
      const book = document.createElement("div");
      book.className = "book";
      book.textContent = skill.name;
      book.style.setProperty(
        "--book-color",
        bookColors[bookColorIndex % bookColors.length]
      );
      book.style.animationDelay = `${totalBookIndex * 0.05}s`;

      book.addEventListener("mouseover", () => {
        descriptionPanel.innerHTML = `<span class="skill-name">${skill.name}</span>${skill.desc}`;
      });

      book.addEventListener("click", () => {
        const currentActive = document.querySelector(".book.is-active");
        if (currentActive) {
          currentActive.classList.remove("is-active");
        }
        book.classList.add("is-active");
      });

      shelf.appendChild(book);
      bookColorIndex++;
      totalBookIndex++;
    });

    shelfContainer.appendChild(shelfTitle);
    shelfContainer.appendChild(shelf);
    bookshelf.appendChild(shelfContainer);
  }

  bookshelf.addEventListener("mouseleave", () => {
    descriptionPanel.innerHTML = initialPanelText;
    const currentActive = document.querySelector(".book.is-active");
    if (currentActive) {
      currentActive.classList.remove("is-active");
    }
  });
});
