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
const hamburgerrrr = document.querySelector(".hamburger");
const navMenuuuu = document.querySelector(".nav__list");
const Formm = document.getElementById('login__form');
const Errors = document.querySelector(".error");
hamburgerrrr.addEventListener("click", () => {
    hamburgerrrr.classList.toggle("active");
    navMenuuuu.classList.toggle("active");
});
Formm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const useremail = document.getElementById('user_email').value;
    const password = document.getElementById('password').value;
    try {
        const res = yield fetch('https://my-brand-backend-flax.vercel.app/login', {
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
            const { token } = data;
            document.cookie = `jwt=${token}; path='/'; max-age= 3 * 24 * 60 * 60 * 1000`;
            window.location.href = 'index.html';
        }
        if (data.message) {
            Errors.innerHTML = data.message;
        }
    }
    catch (error) {
        console.log(error);
    }
}));
const cookieeeee = document.cookie.split("=")[1];
console.log(cookieeeee);
if (cookieeeee) {
    window.location.href = "index.html";
}
