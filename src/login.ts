    const hamburgerrrr = document.querySelector(".hamburger") as HTMLElement;
    const navMenuuuu = document.querySelector(".nav__list") as HTMLElement;
    const  Formm = document.getElementById('login__form') as HTMLFormElement;
    const Errors = document.querySelector(".error") as HTMLElement;

    hamburgerrrr.addEventListener("click", () => {
        hamburgerrrr.classList.toggle("active");
        navMenuuuu.classList.toggle("active");
    });

     Formm .addEventListener('submit', async(e) => {
        e.preventDefault();

        const useremail = (document.getElementById('user_email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        try {
            const res = await fetch('https://my-brand-backend-flax.vercel.app/login', {
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
    
const cookieeeee = document.cookie.split("=")[1]
console.log(cookieeeee)
if(cookieeeee) {
    window.location.href = "index.html"
}

