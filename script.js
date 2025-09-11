var Typed = new Typed(".typing", {
  strings: ["Build Mobile Apps", "Vibe Code", "I guess do Software Engineering??", "ohhh .. you still waiting😏😏 ", "then do Rubber Duck 🦆 Debugging as well!"],
  typeSpeed: 50,
  backSpeed: 40,
  loop: true,
});

let nav_listEl = document.querySelector("#nav_list");
function asideNavBar() {
  nav_listEl.classList.toggle("nav_transform");
}

const blob = document.getElementById("blob");

window.onpointermove = (event) => {
  const { clientX, clientY } = event;

  blob.animate(
    {
      left: `${clientX}px`,
      top: `${clientY}px`,
    },
    { duration: 300, fill: "forwards" }
  );
};

