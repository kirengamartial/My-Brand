"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav__list");
    const loginDiv = document.querySelector('.nav__login');
    const Admin = document.querySelector('.admin');
    const displayDiv = document.getElementById('article__grid');
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });
    const updateUserUI = (user) => {
        if (user && user.username) {
            if (user.isAdmin === true) {
                Admin.innerHTML = `
                    <a href="#" class="nav__link">
                        Admin <i class="fas fa-chevron-down"></i>
                    </a>
                    <ul class="dropdown-content">
                        <li><a href="adminquery.html">Query</a></li>
                        <li><a href="adminarticle.html">Article</a></li>
                    </ul>
                `;
            }
            else {
                Admin.innerHTML = '';
            }
            loginDiv.innerHTML = `
                <a href="#" class="nav__link">
                    ${user.username}
                </a>
                <ul class="dropdown-content">
                    <li><a href="/profile/${user._id}">profile</a></li>
                    <li ><a id="logout" href="#">Logout</a></li>
                </ul>
            `;
        }
        else {
            loginDiv.innerHTML = `
                <a href="login.html" class="nav__link">
                    Sign in
                </a>
            `;
            Admin.innerHTML = '';
        }
    };
    document.addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
        if (e.target instanceof HTMLElement && e.target.id === 'logout') {
            e.preventDefault();
            updateUserUI(null);
            document.cookie = `jwt=; max-age=0`;
            setTimeout(() => {
                window.location.href = 'register.html';
            }, 0);
        }
    }));
    const displayArticle = (articles) => {
        displayDiv.innerHTML = '';
        articles.forEach((article) => {
            const articleDiv = document.createElement('div');
            articleDiv.classList.add('article', 'grid');
            articleDiv.innerHTML = `
                <div class="article__img">
                    <img src="${article.photo.secure_url}"  alt="">
                </div>
                <p>${article.title}</p>
                <div>
                    <a href="/blogs/${article._id}" ">
                        <img class="article__icon" src="assets/img/Rectangle 57.png" alt="">
                    </a>
                    <a href="#" class="article__delete" data-article-id="${article._id}">
                        <img class="article__icon" src="assets/img/Rectangle 58.png" alt="">
                    </a>
                </div>
            `;
            displayDiv.appendChild(articleDiv);
            // Attach event listener to delete button
            const deleteButton = articleDiv.querySelector('.article__delete');
            deleteButton.addEventListener('click', () => {
                const articleId = deleteButton.getAttribute('data-article-id');
                if (articleId) {
                    deleteArticle(articleId);
                }
            });
        });
    };
    const deleteArticle = (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch(`/blog/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                console.log(`Article with ID ${id} deleted successfully`);
                fetch('/blog', { credentials: 'include' })
                    .then(res => res.json())
                    .then(data => displayArticle(data))
                    .catch(err => console.log(err));
            }
            else {
                console.error('Error deleting article:', response.statusText);
            }
        }
        catch (error) {
            console.error('Error deleting article:', error);
        }
    });
    fetch('/blog', { credentials: 'include' })
        .then(res => res.json())
        .then(data => displayArticle(data))
        .catch(err => console.log(err));
    const cookie = document.cookie.split('jwt=')[1];
    fetch('https://my-brand-aqrf.onrender.com/api/user', {
        credentials: 'include',
        headers: {
            "Authorization": `Bearer ${cookie}`
        }
    })
        .then(response => response.json())
        .then(user => {
        if (user) {
            updateUserUI(user);
        }
    })
        .catch(error => console.error('Error fetching user data:', error));
});
