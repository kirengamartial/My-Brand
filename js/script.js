const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav__list")

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
})