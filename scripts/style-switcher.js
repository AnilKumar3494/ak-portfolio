const styleSwitcherToggle = document.querySelector(".style_switcher_toggler");
const styleSwitcher = document.querySelector(".style_switcher");
styleSwitcherToggle.addEventListener("click", () =>{
    styleSwitcher.classList.toggle("open");
})

window.addEventListener("scroll", () =>{
    if(styleSwitcher.classList.contains("open")){
        styleSwitcher.classList.remove("open")

    }
})


const alternativeStyles = document.querySelectorAll(".alternate_style");

function setActiveStyle(color){
    alternativeStyles.forEach((style) => {
        if(color === style.getAttribute("title")){
            style.removeAttribute("disabled");
        }
        else{
            style.setAttribute("disabled", "true");
        }

    })

}

const dayNight = document.querySelector(".day_night");

dayNight.addEventListener("click", () =>{
    dayNight.querySelector("i").classList.toggle("fa-sun");
    dayNight.querySelector("i").classList.toggle("fa-moon");
    document.body.classList.toggle("dark")

})

window.addEventListener("load", () => {
    if(document.body.classList.contains("dark")){
        dayNight.querySelector("i").classList.add("fa-sun");
    }
    else{
        dayNight.querySelector("i").classList.add("fa-moon");
    }
})