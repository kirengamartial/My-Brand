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
const commentForm = document.getElementById('CommentForm');
const hamburgerrr = document.querySelector(".hamburger");
const navMenuuu = document.querySelector(".nav__list");
const loginDivvv = document.querySelector('.nav__login');
const Adminnn = document.querySelector('.admin');
const blogDiv = document.querySelector('.blogii_container');
const commentDiv = document.querySelector('.holderr');
hamburgerrr.addEventListener("click", () => {
    hamburgerrr.classList.toggle("active");
    navMenuuu.classList.toggle("active");
});
const BlogId = window.location.href.split("=").pop();
console.log(BlogId);
fetch(`https://my-brand-aqrf.onrender.com/api/blog/${BlogId}`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
    blogDiv.innerHTML = `
<div class="image">
<img src="${data.photo.secure_url}" alt="">
</div>
<div>
<p>${data.description}</p>
</div>
`;
});
commentForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const commentInput = document.getElementById('comment');
    const comment = commentInput.value;
    try {
        const response = yield fetch('https://my-brand-aqrf.onrender.com/api/user', { credentials: 'include' });
        const user = yield response.json();
        if (user && user.username) {
            const res = yield fetch('https://my-brand-aqrf.onrender.com/comment', {
                method: 'POST',
                body: JSON.stringify({
                    blog_id: BlogId,
                    name: user.username,
                    comment
                }),
                headers: { "Content-type": "application/json" },
                credentials: 'include'
            });
            const data = yield res.json();
            if (data) {
                commentDiv.innerHTML += `
                    <div class='holder'>
                        <h5>Name: ${data.name}</h5> 
                        <p>${data.comment}</p>    
                    </div>
                `;
            }
        }
        else {
            alert("Please log in to submit a comment.");
        }
    }
    catch (error) {
        console.error('Error submitting comment:', error);
    }
}));
fetch('https://my-brand-aqrf.onrender.com/comment', { credentials: 'include' })
    .then(res => res.json())
    .then(datas => {
    datas.forEach((data) => {
        if (data.blog_id === BlogId) {
            commentDiv.innerHTML += `
                 <div class='holder'>   
                 <h5>Name: ${data.name}</h5> 
                 <p>${data.comment}</p>    
                </div>
    
                 `;
        }
    });
})
    .catch(err => console.log(err));
const updateUserUIII = (user) => {
    if (user && user.username) {
        if (user.isAdmin === true) {
            Adminnn.innerHTML = `
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
            Adminnn.innerHTML = '';
        }
        loginDivvv.innerHTML = `
            <a href="#" class="nav__link">
                ${user.username}
            </a>
            <ul class="dropdown-content">
                <li><a href="editProfile.html?=${user._id}">profile</a></li>
                <li ><a id="logout" href="#">Logout</a></li>
            </ul>
        `;
    }
    else {
        loginDivvv.innerHTML = `
            <a href="login.html" class="nav__link">
                Sign in
            </a>
        `;
        Adminnn.innerHTML = '';
    }
};
document.addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
    if (e.target instanceof HTMLElement && e.target.id === 'logout') {
        e.preventDefault();
        updateUserUIII(null);
        document.cookie = `jwt=; max-age=0`;
        setTimeout(() => {
            window.location.href = 'register.html';
        }, 0);
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
    if (user) {
        updateUserUIII(user);
    }
})
    .catch(error => console.error('Error fetching user data:', error));
