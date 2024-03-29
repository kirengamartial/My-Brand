const form = document.getElementById('contact-form') as HTMLFormElement;
const navMenuu = document.querySelector(".nav__list") as HTMLElement;
const hamburgerr: HTMLElement | null = document.querySelector(".hamburger");
const loginDiv = document.querySelector('.nav__login') as HTMLElement;
const Adminy: HTMLElement | null = document.querySelector('.admin');
const ErrorsContact: Element | null = document.querySelector(".contact-error");

hamburgerr?.addEventListener("click", () => {
    hamburgerr.classList.toggle("active");
    navMenuu.classList.toggle("active");
});

interface ContactResponse {
    error?: string;
    message?: string;
   
}
form.addEventListener('submit', async(e) => {
    e.preventDefault();
    const name = (document.getElementById('contact-name') as HTMLInputElement).value;
    const email = (document.getElementById('contact-email') as HTMLInputElement).value;
    const question = (document.getElementById('contact-question') as HTMLInputElement).value;
    const message = (document.getElementById('contact-message') as HTMLInputElement).value;


try {
    const res = await fetch('/contact', {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            email: email,
            question: question,
            description: message
        }),
        headers: { 'Content-type': 'application/json'}
    })
    const data: ContactResponse = await res.json();
    if(data.error) {
        if (ErrorsContact !== null) {
            ErrorsContact.innerHTML = data.error;
        }
    }
    if(data.message) {
     alert(data.message)
    }
} catch (error) {
    console.log(error)
}
 
    

  
});

const updateUserUI = (user: any) => {


    if (user && user.username) {
        if (user.isAdmin === true) {
            if (Adminy !== null) {
                Adminy.innerHTML = `
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
            if (Adminy !== null) {
                Adminy.innerHTML = '';
            }
        }
        loginDiv.innerHTML = `
            <a href="#" class="nav__link">
                ${user.username}
            </a>
            <ul class="dropdown-content">
                <li><a id="logout" href="#">Logout</a></li>
            </ul>
        `;
    } else {
        loginDiv.innerHTML = `
            <a href="/logins" class="nav__link">
                Sign in
            </a>
        `;
        if (Adminy !== null) {
            Adminy.innerHTML = '';
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
            updateUserUI(null); 
            location.assign('/register')
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }
});

fetch('/api/user', { credentials: 'include' })
.then(response => response.json())
.then(user => updateUserUI(user))
.catch(error => console.error('Error fetching user data:', error));

