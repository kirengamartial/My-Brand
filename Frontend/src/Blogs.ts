document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector(".hamburger") as HTMLElement;
    const loginDiv = document.querySelector('.nav__login') as HTMLElement;
    const navMenu = document.querySelector(".nav__list") as HTMLElement;
    const Admin = document.querySelector('.admin') as HTMLElement;
    const blogDiv = document.querySelector('.Blog__container') as HTMLElement

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
                        <li><a href="/query">Query</a></li>
                        <li><a href="/article">Article</a></li>
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

    fetch('https://my-brand-aqrf.onrender.com/blog', {credentials: 'include'})
    .then(res => res.json())
    .then(datas => {
      datas.forEach((data: any) => {
        blogDiv.innerHTML += `
          
        <a href="/blogss/${data._id}" class="Blog__content">
                    <div class="image-container">
                        <img src="${data.photo.secure_url}" alt="">
                    </div>
                
                    <div class="content-container">
                        <h5>${data.title}</h5>
                        <p>${data.description}</p>
                    </div>
                </a>
                `
      })
    })
    .catch(err => console.log(err))

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
