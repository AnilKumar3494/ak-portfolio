var Typed = new Typed(".typing", {
  strings: [" ", "Web Developer", "Java Developer", "Content Writer"],
  typeSpeed: 100,
  backSpeed: 60,
  loop: true,
});

let nav_listEl = document.querySelector("#nav_list");
function asideNavBar() {
  nav_listEl.classList.toggle("nav_transform");
}

let nav_itemEL = document.querySelector("#nav_item");
function selected() {
  nav_itemEL.classList.toggle("active");
}

const activePage = window.location.pathname;
const navLinksEl = document
  .querySelectorAll(".aside .nav li a")
  .forEach((link) => {
    if (link.href.includes(`${activePage}`)) {
      link.classList.add("active");
    }
  });
