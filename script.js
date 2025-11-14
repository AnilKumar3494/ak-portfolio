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
        "working on CI/CD Pipelines with Jenkins and EKS",
        "that ohhh .. you still here 🤩🤩 ",
        "building products that  make a postive impact and I can work hard :-)",
      ],
      typeSpeed: 50,
      backSpeed: 40,
      loop: true,
      loopCount: 2,

      onComplete: (self) => {
        typingElement.addEventListener("mouseover", () =>
          restartTypingAnimation(self)
        );
        typingElement.addEventListener("click", () =>
          restartTypingAnimation(self)
        );
      },
    });
  }
});
