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
    if (hamburger && navMenu && loginDiv && Admin) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
        const updateUserUI = (user) => {
            if (user) {
                if (user && user.username) {
                    if (user.isAdmin === true) {
                        Admin.innerHTML = `
                            <a href="#" class="nav__link">
                                Admin <i class="fas fa-chevron-down"></i>
                            </a>
                            <div class="tesi">
                            <ul class="dropdown-content">
                            <li><a href="adminquery">Query</a></li>
                            <li><a href="adminarticle">Article</a></li>
                        </ul>
                            </div>
                           
                        `;
                    }
                    else {
                        Admin.innerHTML = '';
                    }
                    loginDiv.innerHTML = `
                        <a href="#" class="nav__link">
                            ${user.username}
                        </a>
                        <div class="tesi">
                        <ul class="dropdown-content">
                        <li><a href="editProfile.html?=${user._id}">profile</a></li>
                        <li><a id="logout" href="#">Logout</a></li>
                    </ul>
                        </div>
                       
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
                updateUserUI(null);
                document.cookie = `jwt=; max-age=0`;
                setTimeout(() => {
                    window.location.href = 'register.html';
                }, 0);
            }
        }));
        const cookie = document.cookie.split('jwt=')[1];
        fetch('https://my-brand-backend-flax.vercel.app/api/user', {
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
    }
});
