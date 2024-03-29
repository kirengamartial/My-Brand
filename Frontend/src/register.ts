const Form: HTMLElement | null = document.getElementById('form');
const Admin: Element | null = document.querySelector('.admin');
const SignDiv: Element | null = document.querySelector('.nav__login');
const hamburger: Element | null = document.querySelector(".hamburger");
const navMenu: Element | null = document.querySelector(".nav__list");
const ErrorsPassword: Element | null = document.querySelector(".error_password");
const confirmErrorsPassword: Element | null = document.querySelector(".errorconfirm_password");
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
                const res = await fetch('http://localhost:3000/users',{
                    method: 'POST',
                    body: JSON.stringify({ 
                        username: inputUsername,
                        email: inputUseremail,
                        password: inupUserpassword,
                        confirmPassword: inputUserConfirmPassword 

                    }),
                    headers: { 'Content-type': 'application/json'},
                    credentials: 'include' 
                })
                const data = await res.json()
                console.log(data)
                if(data.error) {
                    if(data.error && ErrorsPassword) {
                        ErrorsPassword.innerHTML = data.error.password
                    }
                    if(data.error && confirmErrorsPassword) {
                        confirmErrorsPassword.innerHTML = data.error.confirmPassword
                    }
                    if(data.error && ErrorsEmail) {
                        ErrorsEmail.innerHTML = data.error.email
                    }
                    if(data.error && ErrorsUsername) {
                        ErrorsUsername.innerHTML = data.error.username
                    }
                   
                }
                if(data.user) {
                    location.assign('/');
                }
                
           
            
        } catch (error) {
            console.log(error)
        }
       

    });
}
