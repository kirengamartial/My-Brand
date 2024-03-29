document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav__list")
    const loginDiv = document.querySelector('.nav__login');
    const Admin = document.querySelector('.admin');
    const Form = document.getElementById('form')

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });


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

let i = parseInt(localStorage.getItem('articleId')) || 0;


const generateId = () => {
localStorage.setItem('articleId', ++i);
return i;
};

Form.addEventListener('submit', (e) => {
e.preventDefault();

const inputPhoto = document.getElementById('photo').value;
const inputTitle = document.getElementById('title').value;
const inputDescription = document.getElementById('desc').value;




const articleStore = {
id: generateId(),
photo: inputPhoto,
title: inputTitle,
description: inputDescription
};

const articles = JSON.parse(localStorage.getItem('article')) || [];
articles.push(articleStore);
localStorage.setItem('article', JSON.stringify(articles));
window.location.href = "adminarticle.html";


});



});