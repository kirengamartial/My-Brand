document.addEventListener('DOMContentLoaded', () => {
    const editForm = document.getElementById('edit-form') as HTMLFormElement;
    const titleInput = document.getElementById('title') as HTMLInputElement;
    const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
    const articleIdInput = document.getElementById('articleId') as HTMLInputElement;
    const loginDiv = document.querySelector('.nav__login') as HTMLElement;
    const Admin = document.querySelector('.admin') as HTMLElement;

    // Extract the id from the URL path
    const id = window.location.href.split("=")[1];
    console.log(id)

    // Fetch blog data by ID
    fetch(`https://my-brand-aqrf.onrender.com/api/blog/${id}`)
        .then(response => response.json())
        .then(blog => {
            titleInput.value = blog.title;
            descriptionInput.value = blog.description;
            articleIdInput.value = blog.id;
        })
        .catch(error => console.error('Error fetching blog data:', error));

    // Handle form submission
    editForm.addEventListener('submit', function(e)  {
        e.preventDefault();

        const formData = new FormData(this)

        // Send PUT request to update blog
        fetch(`https://my-brand-aqrf.onrender.com/blog/${id}`, {
            method: 'PUT',
            body: formData,
            credentials: 'include'
        })
        .then(response => response.json())
        .then(updatedBlog => {
            console.log('Blog updated:', updatedBlog);
            window.location.href = 'adminarticle.html'
        })
        .catch(error => console.error('Error updating blog:', error));
    });

    const updateUserUI = (user: any) => {
        if (user && user.username) {
            if (user.isAdmin === true) {
                Admin.innerHTML = `
                    <a href="#" class="nav__link">
                        Admin <i class="fas fa-chevron-down"></i>
                    </a>
                    <ul class="dropdown-content">
                        <li><a href="adminquery.html">Query</a></li>
                        <li><a href="adminarticle.html">Article</a></li>
                    </ul>
                `;
            } else {
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
        } else {
            loginDiv.innerHTML = `
                <a href="login.html" class="nav__link">
                    Sign in
                </a>
            `;
            Admin.innerHTML = '';
        }
    };

    document.addEventListener('click', async (e) => {
        if (e.target instanceof HTMLElement && e.target.id === 'logout') {
            e.preventDefault();
            updateUserUI(null); 
            document.cookie = `jwt=; max-age=0`;
            setTimeout(() => {
                window.location.href = 'register.html';
            }, 0); 
        }
    });
    
    const cookie = document.cookie.split('jwt=')[1]
    fetch('https://my-brand-aqrf.onrender.com/api/user', { 
        credentials: 'include',
        headers: {
            "Authorization": `Bearer ${cookie}`
        }
     })
    .then(response => response.json())
    .then(user =>  {
        if(user) {
            updateUserUI(user);
        }

    })
    .catch(error => console.error('Error fetching user data:', error));

});
