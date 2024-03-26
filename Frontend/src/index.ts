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

        const updateUserUI = () => {
            const currentUserStr = localStorage.getItem('loginUser');
            if (currentUserStr) {
                const currentUser = JSON.parse(currentUserStr);
                if (currentUser && currentUser.username) {
                    if (currentUser.isAdmin === true) {
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
                            ${currentUser.username}
                        </a>
                        <ul class="dropdown-content">
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

        document.addEventListener('click', (e) => {
            if (e.target instanceof HTMLElement && e.target.id === 'logout') {
                e.preventDefault();
                localStorage.removeItem('loginUser');
                window.location.href = "register.html";
                updateUserUI();
            }
        });

        updateUserUI();
    }
});
