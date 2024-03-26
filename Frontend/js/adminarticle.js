document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav__list")
    const loginDiv = document.querySelector('.nav__login');
    const Admin = document.querySelector('.admin');
    const displayDiv = document.getElementById('article__grid')

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

updateUserUI()
document.addEventListener('click', (e) => {

if(e.target.id === 'logout'){
e.preventDefault()
localStorage.removeItem('loginUser');
window.location.href = "register.html"
updateUserUI();
}
})

const displayArticle = (articles) => {
displayDiv.innerHTML = '';

articles.forEach(article => {
displayDiv.innerHTML += `
    <div class="article grid">
        <div class="article__img">
            <img src="${article.photo}"  alt="">
        </div>
        <p>${article.description}</p>
        <div>
            <a href="#" onclick="openEditModal(${article.id}, '${article.title}', '${article.description}')">
            <img class="article__icon" src="assets/img/Rectangle 57.png" alt="">
            </a>

            <a href="#" onclick="deleteArticle(${article.id})">
                <img class="article__icon" src="assets/img/Rectangle 58.png" alt="">
            </a>
        </div>
    </div>
`;
});
};

window.deleteArticle = (id) => {
let articles = JSON.parse(localStorage.getItem('article'));
articles = articles.filter(article => article.id !== id); 
localStorage.setItem('article', JSON.stringify(articles));
console.log('Article deleted');
displayArticle(articles);
};

window.openEditModal = (id, title, description) => {
const editIdInput = document.getElementById('editId');
const editTitleInput = document.getElementById('editTitle');
const editDescInput = document.getElementById('editDesc');

editIdInput.value = id;
editTitleInput.value = title;
editDescInput.value = description;

const editModal = document.getElementById('editModal');
editModal.style.display = 'block';
};         

const handleEditFormSubmit = (e, articleId) => {
e.preventDefault();

const updatedTitle = document.getElementById('editTitle').value;
const updatedDesc = document.getElementById('editDesc').value;
const updatedPhoto = document.getElementById('editPhoto').files[0];

let articles = JSON.parse(localStorage.getItem('article'));

const index = articles.findIndex(article => article.id === parseInt(articleId));

articles[index].title = updatedTitle;
articles[index].description = updatedDesc;

if (updatedPhoto) {

const reader = new FileReader();
reader.onload = function(event) {
    const photoDataUrl = event.target.result;
    articles[index].photo = photoDataUrl;

    localStorage.setItem('article', JSON.stringify(articles));

    closeModal();

    displayArticle(articles);
};
reader.readAsDataURL(updatedPhoto);
} else {
localStorage.setItem('article', JSON.stringify(articles));

closeModal();
displayArticle(articles);
}
};

window.closeModal = () => {
const editModal = document.getElementById('editModal');
editModal.style.display = 'none';
};

document.getElementById('editForm').addEventListener('submit', (e) => {
const articleId = document.getElementById('editId').value;
handleEditFormSubmit(e, articleId);
});

const articles = JSON.parse(localStorage.getItem('article'));
displayArticle(articles);

const user = JSON.parse(localStorage.getItem('loginUser'));
if (!user || (!user.isLoggedIn || !user.isAdmin)) {
window.location.href = "index.html";
}
});