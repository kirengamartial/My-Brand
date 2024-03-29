document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector(".hamburger") as HTMLElement;
    const navMenu = document.querySelector(".nav__list") as HTMLElement;
    const Form = document.getElementById('login__form') as HTMLFormElement;
    const loginDiv = document.querySelector('.nav__login') as HTMLElement;
    const Admin = document.querySelector('.admin') as HTMLElement;
    const Errors = document.querySelector(".error") as HTMLElement;

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    Form.addEventListener('submit', async(e) => {
        e.preventDefault();

        const useremail = (document.getElementById('user_email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        try {
            const res = await fetch('/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: useremail,
                    password
                }),
                headers: {"Content-type": "application/json"},
                credentials: "include"
            })
            const data = await res.json()

            if(data.user) {
               location.assign('/')
            }

            if(data.message) {
                Errors.innerHTML = data.message
            }

        } catch (error) {
            console.log(error)
        }
    });
});
