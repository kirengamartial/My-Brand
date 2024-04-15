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
const form = document.getElementById('contact-form');
const navMenuu = document.querySelector(".nav__list");
const hamburgerr = document.querySelector(".hamburger");
const loginDiv = document.querySelector('.nav__login');
const Adminy = document.querySelector('.admin');
const ErrorsContact = document.querySelector(".contact-error");
hamburgerr === null || hamburgerr === void 0 ? void 0 : hamburgerr.addEventListener("click", () => {
    hamburgerr.classList.toggle("active");
    navMenuu.classList.toggle("active");
});
form.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const question = document.getElementById('contact-question').value;
    const message = document.getElementById('contact-message').value;
    try {
        const res = yield fetch('https://my-brand-aqrf.onrender.com/contact', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                email: email,
                question: question,
                description: message
            }),
            headers: { 'Content-type': 'application/json' }
        });
        const data = yield res.json();
        if (data.error) {
            if (ErrorsContact !== null) {
                ErrorsContact.innerHTML = data.error;
            }
        }
        if (data.message) {
            alert(data.message);
        }
    }
    catch (error) {
        console.log(error);
    }
}));
const updateUserUII = (user) => {
    if (user && user.username) {
        if (user.isAdmin === true) {
            if (Adminy !== null) {
                Adminy.innerHTML = `
                    <a href="#" class="nav__link">
                        Admin <i class="fas fa-chevron-down"></i>
                    </a>
                    <ul class="dropdown-content">
                        <li><a href="/query">Query</a></li>
                        <li><a href="/article">Article</a></li>
                    </ul>
                `;
            }
        }
        else {
            if (Adminy !== null) {
                Adminy.innerHTML = '';
            }
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
            <a href="/logins" class="nav__link">
                Sign in
            </a>
        `;
        if (Adminy !== null) {
            Adminy.innerHTML = '';
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
            updateUserUII(null);
            location.assign('/register');
        }
        catch (error) {
            console.error('Error logging out:', error);
        }
    }
}));
fetch('https://my-brand-aqrf.onrender.com/api/user', { credentials: 'include' })
    .then(response => response.json())
    .then(user => updateUserUII(user))
    .catch(error => console.error('Error fetching user data:', error));
