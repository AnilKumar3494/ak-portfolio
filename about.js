// intro
document.addEventListener("DOMContentLoaded", () => {
    const introElement = document.getElementById("intro");
    if (!introElement) return;

    const letters = "ANIL";
    let interval = null;

    const runAnimation = (event) => {
        let iteration = 0;
        const originalText = event.target.dataset.value;

        clearInterval(interval);

        interval = setInterval(() => {
            event.target.innerText = originalText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return originalText[index];
                    }

                    if (letter === " ") {
                        return " ";
                    }

                    return letters[Math.floor(Math.random() * 26)];
                })
                .join("");

            if (iteration >= originalText.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3;
        }, 30);
    };

    introElement.addEventListener("mouseover", runAnimation);
    introElement.addEventListener("click", runAnimation);
});

// words
document.addEventListener("DOMContentLoaded", function () {
    const buildButton = document.getElementById("buildButton");
    const breakButton = document.getElementById("breakButton");
    const targetWord = document.getElementById("targetWord");

    if (!buildButton || !breakButton || !targetWord) return;

    const originalWord = targetWord.textContent;
    let isBroken = false;

    // Function to break the word apart
    breakButton.addEventListener("click", () => {
        if (isBroken) return; // Don't break it if it's already broken
        isBroken = true;

        let lettersHTML = "";
        // Wrap each letter in a span
        for (const letter of originalWord) {
            lettersHTML += `<span class="letter">${letter}</span>`;
        }
        targetWord.innerHTML = lettersHTML;

        // Animate each letter to a random position
        const letters = targetWord.querySelectorAll(".letter");
        letters.forEach((letter) => {
            const x = (Math.random() - 0.5) * 80;
            const y = (Math.random() - 0.5) * 80;
            const rot = (Math.random() - 0.5) * 360;

            // Use a short delay to ensure the DOM has updated before transforming
            setTimeout(() => {
                letter.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
                letter.style.opacity = "0";
            }, 10);
        });
    });

    buildButton.addEventListener("click", () => {
        if (!isBroken) return;
        isBroken = false;

        const letters = targetWord.querySelectorAll(".letter");
        letters.forEach((letter) => {
            letter.style.transform = "translate(0, 0) rotate(0deg)";
            letter.style.opacity = "1";
        });
        setTimeout(() => {
            targetWord.innerHTML = originalWord;
        }, 600);
    });
});


// center a div
document.addEventListener("DOMContentLoaded", function () {
    const theDiv = document.getElementById("theDivBox");
    const divJokeContainer = document.querySelector(".div-joke");

    const successMsg = document.getElementById("centerSuccessMsg");

    if (theDiv && divJokeContainer && successMsg) {
        divJokeContainer.style.position = "relative";

        theDiv.addEventListener("click", () => {
            theDiv.classList.toggle("centered");

            if (theDiv.classList.contains("centered")) {
                theDiv.textContent = "WOW Centered! or is it?";

                successMsg.textContent = "Woooah, you did it!";
                successMsg.classList.add("visible");
            } else {
                theDiv.textContent = "----click to save me---";

                successMsg.textContent = "";
                successMsg.classList.remove("visible");
            }
        });
    }
});



// email copy
document.addEventListener("DOMContentLoaded", function () {
    const emailLink = document.getElementById("emailLink");
    const copyTooltip = document.getElementById("copyTooltip");

    if (emailLink) {
        emailLink.addEventListener("click", function (event) {

            event.preventDefault();
            const emailAddress = emailLink.getAttribute("data-email");


            navigator.clipboard
                .writeText(emailAddress)
                .then(() => {

                    copyTooltip.classList.add("show");


                    setTimeout(() => {
                        copyTooltip.classList.remove("show");
                    }, 2000);
                })
                .catch((err) => {
                    console.error("Failed to copy email: ", err);

                });
        });
    }
});


// grad cap interation
document.addEventListener("DOMContentLoaded", function () {
    const degreeInteraction = document.getElementById("degreeInteraction");
    const infoLine = document.querySelector(".info-line");

    if (degreeInteraction && infoLine) {
        degreeInteraction.addEventListener("click", (event) => {
            event.preventDefault();
            createConfetti(degreeInteraction);
        });
    }

    function createConfetti(element) {
        const rect = element.getBoundingClientRect();
        const containerRect = infoLine.getBoundingClientRect();

        // Calculate position relative to the .info-line container
        const x = rect.left + rect.width / 2 - containerRect.left;
        const y = rect.top + rect.height / 2 - containerRect.top;

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement("div");
            particle.classList.add("confetti-particle");

            const colors = ["#f1c40f", "#e67e22", "#f39c12", "#ffde00"];
            particle.style.background =
                colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;

            // Randomize the explosion direction and distance
            const angle = Math.random() * 360;
            const distance = Math.random() * 60 + 20;
            const translateX = Math.cos(angle) * distance;
            const translateY = Math.sin(angle) * distance;


            particle.style.setProperty("--translateX", `${translateX}px`);
            particle.style.setProperty("--translateY", `${translateY}px`);


            particle.animate(
                [
                    {
                        transform: `translate(0, 0)`,
                        opacity: 1,
                    },
                    {
                        transform: `translate(${translateX}px, ${translateY}px)`,
                        opacity: 0,
                    },
                ],
                {
                    duration: Math.random() * 800 + 500,
                    easing: "cubic-bezier(0.1, 0.9, 0.2, 1)",
                    fill: "forwards",
                }
            );

            infoLine.appendChild(particle);


            setTimeout(() => {
                particle.remove();
            }, 1300);
        }
    }
});