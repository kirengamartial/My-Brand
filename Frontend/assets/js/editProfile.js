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
    const Form = document.getElementById('edit__form');
    if (hamburger && navMenu && loginDiv && Admin) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
        const id = window.location.pathname.split('/').pop();
        Form.addEventListener('submit', function (e) {
            return __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                const Username = document.getElementById('user_name').value;
                const Email = document.getElementById('user_email').value;
                const Password = document.getElementById('password').value;
                // Create formData object with only non-empty fields
                const formData = {
                    username: Username,
                    email: Email,
                };
                // Add password field to formData only if it's not empty
                if (Password.trim() !== '') {
                    formData.password = Password;
                }
                try {
                    const response = yield fetch(`https://my-brand-aqrf.onrender.com/api/user/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify(formData),
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include'
                    });
                    const data = yield response.json();
                    if (data.msg) {
                        location.assign('/');
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
        });
        const updateUserUI = (user) => {
            if (user) {
                if (user && user.username) {
                    if (user.isAdmin === true) {
                        Admin.innerHTML = `
                            <a href="#" class="nav__link">
                                Admin <i class="fas fa-chevron-down"></i>
                            </a>
                            <ul class="dropdown-content">
                                <li><a href="/query">Query</a></li>
                                <li><a href="/article">Article</a></li>
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
                            <li><a id="logout" href="#">Logout</a></li>
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
            }
        };
        document.addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
            if (e.target instanceof HTMLElement && e.target.id === 'logout') {
                e.preventDefault();
                try {
                    yield fetch('https://my-brand-aqrf.onrender.com/logout', {
                        method: 'POST',
                        credentials: 'include'
                    });
                    updateUserUI(null);
                    window.location.href = 'register.html';
                }
                catch (error) {
                    console.error('Error logging out:', error);
                }
            }
        }));
        const cookie = document.cookie.split('jwt=')[1];
        fetch('https://my-brand-aqrf.onrender.com/api/user', {
            credentials: 'include',
            headers: {
                "Authorization": `Bearer ${cookie}`
            }
        })
            .then(response => response.json())
            .then(user => {
            updateUserUI(user);
            document.getElementById('user_name').value = user.username;
            document.getElementById('user_email').value = user.email;
        })
            .catch(error => console.error('Error fetching user data:', error));
    }
});
