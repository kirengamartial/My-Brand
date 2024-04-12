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
    const editForm = document.getElementById('edit-form');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const articleIdInput = document.getElementById('articleId');
    const loginDiv = document.querySelector('.nav__login');
    const Admin = document.querySelector('.admin');
    // Extract the id from the URL path
    const id = window.location.pathname.split('/').pop();
    // Fetch blog data by ID
    fetch(`/api/blog/${id}`)
        .then(response => response.json())
        .then(blog => {
        // Populate form fields with blog data
        console.log(id);
        console.log(blog);
        titleInput.value = blog.title;
        descriptionInput.value = blog.description;
        articleIdInput.value = blog.id;
    })
        .catch(error => console.error('Error fetching blog data:', error));
    // Handle form submission
    editForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        // Send PUT request to update blog
        fetch(`/blog/${id}`, {
            method: 'PUT',
            body: formData,
            credentials: 'include'
        })
            .then(response => response.json())
            .then(updatedBlog => {
            console.log('Blog updated:', updatedBlog);
            location.assign('/article');
        })
            .catch(error => console.error('Error updating blog:', error));
    });
    const updateUserUI = (user) => {
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
                    <li ><a id="logout" href="#">Logout</a></li>
                </ul>
            `;
        }
        else {
            loginDiv.innerHTML = `
                <a href="/logins" class="nav__link">
                    Sign in
                </a>
            `;
            Admin.innerHTML = '';
        }
    };
    fetch('/api/user', { credentials: 'include' })
        .then(response => response.json())
        .then(user => updateUserUI(user))
        .catch(error => console.error('Error fetching user data:', error));
    document.addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
        if (e.target instanceof HTMLElement && e.target.id === 'logout') {
            e.preventDefault();
            try {
                yield fetch('/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                updateUserUI(null);
                location.assign('/register');
            }
            catch (error) {
                console.error('Error logging out:', error);
            }
        }
    }));
});
