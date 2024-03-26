const form = document.getElementById('contact-form')
const navMenu = document.querySelector(".nav__list")
const hamburger = document.querySelector(".hamburger")
const loginDiv = document.querySelector('.nav__login');
const Admin = document.querySelector('.admin');




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

const existingMessage = JSON.parse(localStorage.getItem('userMessage')) || []

const userMessage = {
name: name,
email: email,
question: question,
message: message
}
existingMessage.push(userMessage)

localStorage.setItem('userMessage', JSON.stringify(existingMessage))
console.log(existingMessage)
alert('message sent')
})







const updateUserUI = () => {
const currentUser = JSON.parse(localStorage.getItem('loginUser'));

if (currentUser && currentUser.username) {
if (currentUser.isAdmin === true) {
Admin.innerHTML = `
    <a href="#" class="nav__link">
        Admin <i class="fas fa-chevron-down"></i>
    </a>
    <ul class="dropdown-content">
        <li><a href="adminquery.html">Query</a></li>
        <li><a href="adminarticle.html">Article</a></li>
    </ul>
`;
} else {
Admin.innerHTML = '';
}
loginDiv.innerHTML = `
<a href="#" class="nav__link">
    ${currentUser.username}
</a>
<ul class="dropdown-content">
        <li ><a id="logout" href="#">Logout</a></li>
    </ul>
`;
} else {
loginDiv.innerHTML = `
<a href="login.html" class="nav__link">
    Sign in
</a>
`;
Admin.innerHTML = ''; 
}
};


document.addEventListener('click', (e) => {

if(e.target.id === 'logout'){
e.preventDefault()
localStorage.removeItem('loginUser');
window.location.href = "register.html"
updateUserUI();
}
})

   
    updateUserUI();