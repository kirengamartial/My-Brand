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
            if (inupUserpassword === inputUserConfirmPassword) {
                const res = yield fetch('http://localhost:3000/users', {
                    method: 'POST',
                    body: JSON.stringify({
                        username: inputUsername,
                        email: inputUseremail,
                        password: inupUserpassword
                    }),
                    headers: { 'Content-type': 'application/json' }
                });
                const data = yield res.json();
                console.log(data);
                if (data.err) {
                    if (data.err && ErrorsPassword) {
                        ErrorsPassword.innerHTML = data.err.password;
                    }
                    if (data.err && ErrorsEmail) {
                        ErrorsEmail.innerHTML = data.err.email;
                    }
                    if (data.err && ErrorsUsername) {
                        ErrorsUsername.innerHTML = data.err.username;
                    }
                }
                if (data.user) {
                    location.assign('/');
                }
            }
            else {
                if (ErrorsPassword) {
                    ErrorsPassword.innerHTML = 'password do not match';
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }));
}
