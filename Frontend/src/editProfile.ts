document.addEventListener('DOMContentLoaded', () => {
    const hamburger: HTMLElement | null = document.querySelector(".hamburger");
    const navMenu: HTMLElement | null = document.querySelector(".nav__list");
    const loginDiv: HTMLElement | null = document.querySelector('.nav__login');
    const Admin: HTMLElement | null = document.querySelector('.admin');
    const Form = document.getElementById('edit__form') as HTMLFormElement

    if (hamburger && navMenu && loginDiv && Admin) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        const id = window.location.href.split("=").pop()
        console.log(id)

        Form.addEventListener('submit', async function(e) {
            e.preventDefault();
        
            const Username = (document.getElementById('user_name') as HTMLInputElement).value;
            const Email = (document.getElementById('user_email') as HTMLInputElement).value;
            const Password = (document.getElementById('password') as HTMLInputElement).value;
        
            // Create formData object with only non-empty fields
            const formData: any = {
                username: Username,
                email: Email,
            };
        
            // Add password field to formData only if it's not empty
            if (Password.trim() !== '') {
                formData.password = Password;
            }
        
            try {
                const response = await fetch(`https://my-brand-aqrf.onrender.com/api/user/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData),
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.msg) {
                     window.location.href = 'index.html'
                }
            } catch (error) {
                console.log(error);
            }
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
                    window.location.href = 'register.html'
                } catch (error) {
                    console.error('Error logging out:', error);
                }
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
        .then(user => {
            updateUserUI(user);
           (document.getElementById('user_name') as HTMLInputElement).value = user.username;
           (document.getElementById('user_email') as HTMLInputElement).value = user.email;
            
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
});
