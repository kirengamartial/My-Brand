document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector(".hamburger") as HTMLElement;
    const navMenu = document.querySelector(".nav__list") as HTMLElement;
    const loginDiv = document.querySelector('.nav__login') as HTMLElement;
    const Admin = document.querySelector('.admin') as HTMLElement;
    const displayDiv = document.getElementById('article__grid') as HTMLElement;

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
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
                <li><a href="editProfile.html?=${user._id}">profile</a></li>
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
    

    const displayArticle = (articles: any) => {
        displayDiv.innerHTML = '';

        articles.forEach((article: any) => {
            const articleDiv = document.createElement('div');
            articleDiv.classList.add('article', 'grid');
            articleDiv.innerHTML = `
                <div class="article__img">
                    <img src="${article.photo.secure_url}"  alt="">
                </div>
                <p>${article.title}</p>
                <div>
                    <a href="admineditarticle.html?=${article._id}" ">
                        <img class="article__icon" src="assets/img/Rectangle 57.png" alt="">
                    </a>
                    <a href="#" class="article__delete" data-article-id="${article._id}">
                        <img class="article__icon" src="assets/img/Rectangle 58.png" alt="">
                    </a>
                </div>
            `;
            displayDiv.appendChild(articleDiv);

            // Attach event listener to delete button
            const deleteButton = articleDiv.querySelector('.article__delete') as HTMLElement;
            deleteButton.addEventListener('click', () => {
                const articleId = deleteButton.getAttribute('data-article-id');
                if (articleId) {
                    
                    deleteArticle(articleId);
                }
            });
        });
    };

    const deleteArticle = async (id: any) => {
        try {
            const response = await fetch(`https://my-brand-backend-flax.vercel.app/blog/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                console.log(`Article with ID ${id} deleted successfully`);
                fetch('https://my-brand-backend-flax.vercel.app/blog', { credentials: 'include' })
                    .then(res => res.json())
                    .then(data => displayArticle(data))
                    .catch(err => console.log(err));
            } else {
                console.error('Error deleting article:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };

    fetch('https://my-brand-backend-flax.vercel.app/blog', { credentials: 'include' })
        .then(res => res.json())
        .then(data => displayArticle(data))
        .catch(err => console.log(err));

        const cookie = document.cookie.split('jwt=')[1]
        fetch('https://my-brand-backend-flax.vercel.app/api/user', { 
            credentials: 'include',
            headers: {
                "Authorization": `Bearer ${cookie}`
            }
         })
        .then(response => response.json())
        .then(user =>  {
            if(!user.isAdmin) {
                window.location.href = "index.html"
            }else {
                updateUserUI(user);
        
            }
    
        })
        .catch(error => console.error('Error fetching user data:', error));
});
