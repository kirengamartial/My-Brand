document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector(".hamburger");
    const loginDiv = document.querySelector('.nav__login');
    const navMenu = document.querySelector(".nav__list")
    const Admin = document.querySelector('.admin');

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
});