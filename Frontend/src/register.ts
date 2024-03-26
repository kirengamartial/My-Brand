const Form: HTMLElement | null = document.getElementById('form');
const Admin: Element | null = document.querySelector('.admin');
const SignDiv: Element | null = document.querySelector('.nav__login');
const hamburger: Element | null = document.querySelector(".hamburger");
const navMenu: Element | null = document.querySelector(".nav__list");
const ErrorsPassword: Element | null = document.querySelector(".error_password");
const ErrorsUsername: Element | null = document.querySelector(".error_username");
const ErrorsEmail: Element | null = document.querySelector(".error_email");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });
}

if (Form) {
    Form.addEventListener('submit', async(e: Event) => {
        e.preventDefault();
        const inputUsername: string = (document.getElementById('user_name') as HTMLInputElement).value;
        const inputUseremail: string = (document.getElementById('user_email') as HTMLInputElement).value;
        const inupUserpassword: string = (document.getElementById('password') as HTMLInputElement).value;
        const inputUserConfirmPassword: string = (document.getElementById('Confirm_password') as HTMLInputElement).value;


        if (ErrorsUsername) {
            ErrorsUsername.innerHTML = '';
        }
        if (ErrorsPassword) {
            ErrorsPassword.innerHTML = '';
        }

        if (ErrorsEmail) {
            ErrorsEmail.innerHTML = '';
        }

        try {
            if(inupUserpassword === inputUserConfirmPassword) {
                const res = await fetch('http://localhost:3000/users',{
                    method: 'POST',
                    body: JSON.stringify({ 
                        username: inputUsername,
                        email: inputUseremail,
                        password: inupUserpassword
                    }),
                    headers: { 'Content-type': 'application/json'}
                })
                const data = await res.json()
                console.log(data)
                if(data.err) {
                    if(data.err && ErrorsPassword) {
                        ErrorsPassword.innerHTML = data.err.password
                    }
                    if(data.err && ErrorsEmail) {
                        ErrorsEmail.innerHTML = data.err.email
                    }
                    if(data.err && ErrorsUsername) {
                        ErrorsUsername.innerHTML = data.err.username
                    }
                }
                if(data.user) {
                    location.assign('/');
                }
                
            } else {
                if(ErrorsPassword) {
                    ErrorsPassword.innerHTML = 'password do not match'
                }
            }
            
        } catch (error) {
            console.log(error)
        }
       

    });
}
