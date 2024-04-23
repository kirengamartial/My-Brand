const form = document.getElementById('contact-form') as HTMLFormElement;
const navMenuu = document.querySelector(".nav__list") as HTMLElement;
const hamburgerr: HTMLElement | null = document.querySelector(".hamburger");
const loginDiv = document.querySelector('.nav__login') as HTMLElement;
const Adminy: HTMLElement | null = document.querySelector('.admin');
const ErrorsContact: Element | null = document.querySelector(".contact-error");
const popupp = document.querySelector('.triall') as HTMLElement


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
    const res = await fetch('https://my-brand-backend-h88y.onrender.com/contact', {
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

    interface ContactMessage {
        name: string;
        email: string;
        question: string;
        description: string;
        _id: string;
    }
    
    if (typeof data.message === 'string') {
        console.error('Received unexpected data format:', data.message);
    } else if (typeof data.message === 'object' && data.message !== null) {
        const message = data.message as ContactMessage;
         // @ts-ignore
        Email.send({
            Host : "smtp.elasticemail.com",
            Username : "martialkirenga22@gmail.com",
            Password : "766FDE5253FFABFF459C844A91B8A207C77A",
            To : `martialkirenga22@gmail.com`,
            From : `martialkirenga22@gmail.com`,
            Subject : "Portfolio Contact Message",
            Body : `
            <b>Name: </b>${message.name}
            <br>
            <b>Email: </b>${message.email}
            <br>
            <b>Question: </b>${message.question} -
            <br>
            <b>Description: </b>${message.description}
            `
        }).then((res: any) => {
            popupp.innerHTML = `
            <div class="popup-container">
            <div id="popup" class="popupp">
             Message Sent Successfully
            </div>
            `}
        )
        .catch((err:any) => {
            popupp.innerHTML = `
            <div class="popup-container">
            <div id="popup" class="popup">
             ${err}
            </div>
            `
        })
    } else {
        console.error('Received unexpected data format');
    }
    
} catch (error) {
    console.log(error)
}
 
    

  
});

const updateUserUII  = (user: any) => {


    if (user && user.username) {
        if (user.isAdmin === true) {
            if (Adminy !== null) {
                Adminy.innerHTML = `
                    <a href="#" class="nav__link">
                        Admin <i class="fas fa-chevron-down"></i>
                    </a>
                    <ul class="dropdown-content">
                        <li><a href="adminquery.html">Query</a></li>
                        <li><a href="adminarticle.html">Article</a></li>
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
        if (Adminy !== null) {
            Adminy.innerHTML = '';
        }
    }
};

document.addEventListener('click', async (e) => {
    if (e.target instanceof HTMLElement && e.target.id === 'logout') {
        e.preventDefault();
        updateUserUII(null); 
        document.cookie = `jwt=; max-age=0`;
        setTimeout(() => {
            window.location.href = 'register.html';
        }, 0); 
    }
});

const cookiee = document.cookie.split('jwt=')[1]
fetch('https://my-brand-backend-h88y.onrender.com/api/user', { 
    credentials: 'include',
    headers: {
        "Authorization": `Bearer ${cookiee}`
    }
 })
.then(response => response.json())
.then(user =>  {
    if(user) {
        updateUserUII(user);
    }

})
.catch(error => console.error('Error fetching user data:', error));

