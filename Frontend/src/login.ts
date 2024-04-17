document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector(".hamburger") as HTMLElement;
    const navMenu = document.querySelector(".nav__list") as HTMLElement;
    const Form = document.getElementById('login__form') as HTMLFormElement;
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
            const res = await fetch('https://my-brand-aqrf.onrender.com/login', {
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
                const { token } = data
                document.cookie= `jwt=${token}; path='/'; max-age= 3 * 24 * 60 * 60 * 1000`                
                window.location.href = 'index.html'
            }

            if(data.message) {
                Errors.innerHTML = data.message
            }

        } catch (error) {
            console.log(error)
        }
    });
    
});
