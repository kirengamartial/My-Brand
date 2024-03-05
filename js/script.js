const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav__list")
const form = document.getElementById('contact-form')

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
})

form.addEventListener('submit', (e) => {
e.preventDefault()
const name = document.getElementById('contact-name').value
const email = document.getElementById('contact-email').value
const question = document.getElementById('contact-question').value
const message = document.getElementById('contact-message').value


const userMessage = {
    name: name,
    email: email,
    question: question,
    message: message
}
localStorage.setItem('userMessage', JSON.stringify(userMessage))
console.log(userMessage)
})


