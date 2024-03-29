"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const editForm = document.getElementById('edit-form');
    const photoInput = document.getElementById('photo');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const articleIdInput = document.getElementById('articleId');
    // Extract the id from the URL path
    const id = window.location.pathname.split('/').pop();
    // Fetch blog data by ID
    fetch(`/api/blog/${id}`)
        .then(response => response.json())
        .then(blog => {
        // Populate form fields with blog data
        console.log(id);
        console.log(blog);
        photoInput.value = blog.photo;
        titleInput.value = blog.title;
        descriptionInput.value = blog.description;
        articleIdInput.value = blog.id;
    })
        .catch(error => console.error('Error fetching blog data:', error));
    // Handle form submission
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            photo: photoInput.value,
            title: titleInput.value,
            description: descriptionInput.value
        };
        // Send PUT request to update blog
        fetch(`/blog/${id}`, {
            method: 'PUT',
            body: JSON.stringify(formData),
            headers: { 'Content-type': 'application/json' },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(updatedBlog => {
            console.log('Blog updated:', updatedBlog);
            location.assign('/article');
        })
            .catch(error => console.error('Error updating blog:', error));
    });
});
