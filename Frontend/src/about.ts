document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector(".hamburger") as HTMLElement;
    const loginDiv = document.querySelector('.nav__login') as HTMLElement;
    const navMenu = document.querySelector(".nav__list") as HTMLElement;
    const Admin = document.querySelector('.admin') as HTMLElement;

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
    fetch('http://localhost:3000/api/user', { 
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
