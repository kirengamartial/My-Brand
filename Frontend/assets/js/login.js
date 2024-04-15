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
    const Form = document.getElementById('login__form');
    const Errors = document.querySelector(".error");
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });
    Form.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const useremail = document.getElementById('user_email').value;
        const password = document.getElementById('password').value;
        try {
            const res = yield fetch('https://my-brand-aqrf.onrender.com/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: useremail,
                    password
                }),
                headers: { "Content-type": "application/json" },
                credentials: "include"
            });
            const data = yield res.json();
            if (data.user) {
                location.assign('./index.html');
            }
            if (data.message) {
                Errors.innerHTML = data.message;
            }
        }
        catch (error) {
            console.log(error);
        }
    }));
});
