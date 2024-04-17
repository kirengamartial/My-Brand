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
const Form = document.getElementById('form');
const Admin = document.querySelector('.admin');
const SignDiv = document.querySelector('.nav__login');
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav__list");
const ErrorsPassword = document.querySelector(".error_password");
const confirmErrorsPassword = document.querySelector(".errorconfirm_password");
const ErrorsUsername = document.querySelector(".error_username");
const ErrorsEmail = document.querySelector(".error_email");
if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });
}
if (Form) {
    Form.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const inputUsername = document.getElementById('user_name').value;
        const inputUseremail = document.getElementById('user_email').value;
        const inupUserpassword = document.getElementById('password').value;
        const inputUserConfirmPassword = document.getElementById('Confirm_password').value;
        if (ErrorsUsername) {
            ErrorsUsername.innerHTML = '';
        }
        if (ErrorsPassword) {
            ErrorsPassword.innerHTML = '';
        }
        if (ErrorsEmail) {
            ErrorsEmail.innerHTML = '';
        }
        try {
            const res = yield fetch('https://my-brand-aqrf.onrender.com/users', {
                method: 'POST',
                body: JSON.stringify({
                    username: inputUsername,
                    email: inputUseremail,
                    password: inupUserpassword,
                    confirmPassword: inputUserConfirmPassword
                }),
                headers: { 'Content-type': 'application/json' },
                credentials: 'include'
            });
            const data = yield res.json();
            console.log(data);
            if (data.error) {
                if (data.error && ErrorsPassword) {
                    ErrorsPassword.innerHTML = data.error.password;
                }
                if (data.error && confirmErrorsPassword) {
                    confirmErrorsPassword.innerHTML = data.error.confirmPassword;
                }
                if (data.error && ErrorsEmail) {
                    ErrorsEmail.innerHTML = data.error.email;
                }
                if (data.error && ErrorsUsername) {
                    ErrorsUsername.innerHTML = data.error.username;
                }
            }
            if (data.user) {
                const { token } = data;
                document.cookie = `jwt=${token}; path='/'; max-age= 3 * 24 * 60 * 60 * 1000`;
                location.assign('index.html');
            }
        }
        catch (error) {
            console.log(error);
        }
    }));
}
const cookieeee = document.cookie.split("=")[1];
if (cookieeee) {
    window.location.href = "index.html";
}
