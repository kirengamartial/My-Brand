document.addEventListener('DOMContentLoaded', () => {
    const hamburger: HTMLElement | null = document.querySelector(".hamburger");
    const navMenu: HTMLElement | null = document.querySelector(".nav__list");
    const loginDiv: HTMLElement | null = document.querySelector('.nav__login');
    const Admin: HTMLElement | null = document.querySelector('.admin');

    if (hamburger && navMenu && loginDiv && Admin) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        const updateUserUI = (user: any) => {
           
            if (user) {

                if (user && user.username) {
                    if (user.isAdmin === true) {
                        Admin.innerHTML = `
                            <a href="#" class="nav__link">
                                Admin <i class="fas fa-chevron-down"></i>
                            </a>
                            <ul class="dropdown-content">
                                <li><a href="adminquery">Query</a></li>
                                <li><a href="adminarticle">Article</a></li>
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
                            <li><a id="logout" href="#">Logout</a></li>
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
            }
        };

        document.addEventListener('click', async (e) => {
            if (e.target instanceof HTMLElement && e.target.id === 'logout') {
                e.preventDefault();
                try {
                    await fetch('https://my-brand-aqrf.onrender.com/logout', {
                        method: 'POST', 
                        credentials: 'include' 
                    });
                    updateUserUI(null); 
                    document.cookie = `jwt=''; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
                    window.location.href = 'register.html'
                } catch (error) {
                    console.error('Error logging out:', error);
                }
            }
        });

        const cookie = document.cookie.split('jwt=')[1]
        console.log(cookie)
        fetch('https://my-brand-aqrf.onrender.com/api/user', { 
            credentials: 'include',
            headers: {
                "Authorization": `Bearer ${cookie}`
            }
         })
        .then(response => response.json())
        .then(user =>  {
            updateUserUI(user);


        })
        .catch(error => console.error('Error fetching user data:', error));
    }
});
