// Array of portfolio items data
const portfolioItems = [
    {
        title: "Auth App",
        link: "https://github.com/AnilKumar3494/auth-app",
        description:
            "Developing a MERN stack application implementing Hooks, State Management, OAuth, and Tailwind CSS",
        languages: "React, Tailwind CSS, OAuth",
    },
    {
        title: "Bus Reservation System",
        link: "https://github.com/veerendra3/brs-frontend",
        description:
            "Worked on a Full Stack application as a team lead that has admin and user modules, business implementation, live tracking, and updates.",
        languages: "ReactJs, CSS3, JSX",
    },
    {
        title: "Bank Management System",
        link: "https://github.com/AnilKumar3494/ATM",
        description:
            "A desktop-based Java application that functions similarly to an ATM. For new users, it can create an ATM card number and PIN, while existing users may deposit and withdraw money utilising options such as quick fast-cash and withdraw. Clients may also review their transactions and get a mini-statement.",
        languages: "Java, MySQL",
    },
    {
        title: "JS DOM Manipulation",
        link: "https://github.com/AnilKumar3494/JS-DOM-Manipulation",
        description:
            "Used JavaScript to do DOM Manipulation and designed efficent and Responsive Desgins.",
        languages: "HTML5, CSS3, JS",
    },
    {
        title: "Imaginnovate Home Page",
        link: "https://anilkumar3494.github.io/Imaginnovate/",
        description:
            "I designed a resposive home page using HTML, CSS and JS for Imaginnovate. Implemented CSS to add more asthetics and made the website responsive.",
        languages: "HTML5, CSS3, JS",
    },
    {
        title: "e-commerce website",
        link: "https://anilkumar3494.github.io/ak-ecommerce/",
        description:
            "It is an online shopping platform where clients can order clothes. It is still being developed.",
        languages: "HTML5, CSS3, JS",
    },
];

// Function to create and populate portfolio items
function populatePortfolioItems() {
    const portfolioRow = document.getElementById("portfolioRow");

    portfolioItems.forEach((item) => {
        const portfolioItem = document.createElement("div");
        portfolioItem.classList.add("portfolio_item");
        portfolioItem.innerHTML = `
            <div class="portfolio_item_inner shadow_dark">
              <a href="${item.link}" target="_blank">
                <span class="link"></span>
              </a>
              <h4 class="padd_15">${item.title}</h4>
              <p class="padd_15">${item.description}</p>
              <p class="padd_15">
                <br />
                <span>Programming Languages Used:</span> ${item.languages}
              </p>
            </div>
          `;
        portfolioRow.appendChild(portfolioItem);
    });
}

// Call the function to populate portfolio items
populatePortfolioItems();