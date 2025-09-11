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
        "Build Mobile Apps",
        "Vibe Code",
        "do Software Engineering??",
        "ohhh .. you still waiting😏😏 ",
        "Join your team!",
        "Build Software and Products!",
      ],
      typeSpeed: 50,
      backSpeed: 40,
      loop: true,
      loopCount: 2,


      onComplete: (self) => {

        typingElement.addEventListener("mouseover", () => restartTypingAnimation(self));
        typingElement.addEventListener("click", () => restartTypingAnimation(self));
      },
    });
  }
});