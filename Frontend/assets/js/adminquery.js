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
const hamburgerElement = document.querySelector(".hamburger");
const navMenuElement = document.querySelector(".nav__list");
const loginDivElement = document.querySelector('.nav__login');
const adminElement = document.querySelector('.admin');
if (hamburgerElement instanceof Element && navMenuElement instanceof Element && loginDivElement instanceof Element && adminElement instanceof Element) {
    hamburgerElement.addEventListener("click", () => {
        hamburgerElement.classList.toggle("active");
        navMenuElement.classList.toggle("active");
    });
}
function displayUserMessage(userMessage) {
    const adminQueryDivElement = document.getElementById('admin-query');
    if (adminQueryDivElement) {
        let htmlContent = `
            <tr>
                <th>Email</th>
                <th>Question</th>
                <th>Description</th>
            </tr>
        `;
        userMessage.forEach((element) => {
            htmlContent += `
                <tr>
                    <td>${element.email}</td>
                    <td>${element.question}</td>
                    <td>${element.description}</td>
                </tr>
            `;
        });
        adminQueryDivElement.innerHTML = htmlContent;
    }
}
fetch('https://my-brand-aqrf.onrender.com/contact/message')
    .then(res => res.json())
    .then(data => displayUserMessage(data))
    .catch(error => console.log(error));
const updateUserUiInfo = (user) => {
    if (user && user.username) {
        if (user.isAdmin === true) {
            if (adminElement !== null) {
                adminElement.innerHTML = `
                    <a href="#" class="nav__link">
                        Admin <i class="fas fa-chevron-down"></i>
                    </a>
                    <ul class="dropdown-content">
                        <li><a href="adminquery.html">Query</a></li>
                        <li><a href="adminarticle.html">Article</a></li>
                    </ul>
                `;
            }
        }
        else {
            if (adminElement !== null) {
                adminElement.innerHTML = '';
            }
        }
        if (loginDivElement !== null) {
            loginDivElement.innerHTML = `
            <a href="#" class="nav__link">
                ${user.username}
            </a>
            <ul class="dropdown-content">
            <li><a href="editProfile.html?=${user._id}">profile</a></li>
                <li><a id="logout" href="#">Logout</a></li>
            </ul>
        `;
        }
    }
    else {
        if (loginDivElement !== null) {
            loginDivElement.innerHTML = `
            <a href="login.html" class="nav__link">
                Sign in
            </a>
        `;
        }
        if (adminElement !== null) {
            adminElement.innerHTML = '';
        }
    }
};
document.addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
    if (e.target instanceof HTMLElement && e.target.id === 'logout') {
        e.preventDefault();
        updateUserUiInfo(null);
        document.cookie = `jwt=; max-age=0`;
        setTimeout(() => {
            window.location.href = 'register.html';
        }, 0);
    }
}));
const cookieee = document.cookie.split('jwt=')[1];
fetch('https://my-brand-aqrf.onrender.com/api/user', {
    credentials: 'include',
    headers: {
        "Authorization": `Bearer ${cookieee}`
    }
})
    .then(response => response.json())
    .then(user => {
    if (!user.isAdmin) {
        window.location.assign(document.referrer);
    }
    else {
        updateUserUiInfo(user);
    }
})
    .catch(error => console.error('Error fetching user data:', error));
