document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav__list");
    const Form = document.getElementById('login__form');
    const loginDiv = document.querySelector('.nav__login');
    const Admin = document.querySelector('.admin')
    const Errors = document.querySelector(".error")

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    Form.addEventListener('submit', (e) => {
        e.preventDefault();

        const useremail = document.getElementById('user_email').value;
        const password = document.getElementById('password').value;

        const Users = JSON.parse(localStorage.getItem('user'));
       
        const loginUser =  Users.find(user => user.email === useremail && user.password === password)

        if(loginUser) {

        localStorage.setItem('loginUser', JSON.stringify(loginUser))
        displayUser()
        window.location.href="index.html"

        } else {
            Errors.innerHTML = `
                <p>Invalid Credentials</p>
                 `;


                setTimeout(() => {
                  Errors.innerHTML = '';
                }, 3000);
        }

        

        
    });

// const user = JSON.parse(localStorage.getItem('loginUser'));
// if(user.isLoggedIn) {
//  window.location.href = "index.html" 
// }

    const displayUser = () => {
        const currentUser = JSON.parse(localStorage.getItem('loginUser'));

        if (currentUser && currentUser.email) {
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
                    ${currentUser.email}
                </a>
                <ul class="dropdown-content">
                        <li ><a id="logout" href="#">Logout</a></li>
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
    };


    document.addEventListener('click', (e) => {
        
        if(e.target.id === 'logout'){
            e.preventDefault()
            localStorage.removeItem('loginUser');
            window.location.href = "register.html"
            displayUser()
        }
    })

    displayUser()

});
