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
