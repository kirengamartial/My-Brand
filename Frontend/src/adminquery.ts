const hamburgerElement: Element | null = document.querySelector(".hamburger");
const navMenuElement: Element | null = document.querySelector(".nav__list");
const loginDivElement: Element | null = document.querySelector('.nav__login');
const adminElement: Element | null = document.querySelector('.admin');

if (hamburgerElement instanceof Element && navMenuElement instanceof Element && loginDivElement instanceof Element && adminElement instanceof Element) {
    hamburgerElement.addEventListener("click", () => {
        hamburgerElement.classList.toggle("active");
        navMenuElement.classList.toggle("active");
    });
}

function displayUserMessage(userMessage: any): void {
    const adminQueryDivElement: HTMLElement | null = document.getElementById('admin-query');

    if (adminQueryDivElement) {
        let htmlContent: string = `
            <tr>
                <th>Email</th>
                <th>Question</th>
                <th>Description</th>
            </tr>
        `;

        userMessage.forEach((element: any) => {
            htmlContent += `
                <tr>
                    <td>${element.email}</td>
                    <td>${element.question}</td>
                    <td>${element.description}</td>
                </tr>
            `;
        });

        adminQueryDivElement.innerHTML = htmlContent;
    }
}


fetch('/contact/message')
.then(res => res.json())
.then(data => displayUserMessage(data))
.catch(error => console.log(error))

const updateUserUiInfo = (user: any) => {


    if (user && user.username) {
        if (user.isAdmin === true) {
            if (adminElement !== null) {
                adminElement.innerHTML = `
                    <a href="#" class="nav__link">
                        Admin <i class="fas fa-chevron-down"></i>
                    </a>
                    <ul class="dropdown-content">
                        <li><a href="/query">Query</a></li>
                        <li><a href="/article">Article</a></li>
                    </ul>
                `;
            }
        } else {
            if (adminElement !== null) {
                adminElement.innerHTML = '';
            }
        }
        if( loginDivElement !== null) {
            loginDivElement.innerHTML = `
            <a href="#" class="nav__link">
                ${user.username}
            </a>
            <ul class="dropdown-content">
                <li><a id="logout" href="#">Logout</a></li>
            </ul>
        `;
        }
       
    } else {
        if(loginDivElement !== null) {
            loginDivElement.innerHTML = `
            <a href="login.html" class="nav__link">
                Sign in
            </a>
        `;
        }
        
        if (adminElement !== null) {
            adminElement.innerHTML = '';
        }
    }
};


document.addEventListener('click', async (e) => {
    if (e.target instanceof HTMLElement && e.target.id === 'logout') {
        e.preventDefault();
        try {
            await fetch('/logout', {
                method: 'POST', 
                credentials: 'include' 
            });
            updateUserUiInfo(null); 
            location.assign('/register')
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }
});


fetch('/api/user', { credentials: 'include' })
.then(response => response.json())
.then(user => updateUserUiInfo(user))
.catch(error => console.error('Error fetching user data:', error));