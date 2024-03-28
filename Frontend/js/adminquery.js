const storedMessageData = localStorage.getItem('userMessage');
            const hamburger = document.querySelector(".hamburger")
            const navMenu = document.querySelector(".nav__list")
            const loginDiv = document.querySelector('.nav__login');
            const Admin = document.querySelector('.admin');


            hamburger.addEventListener("click", () => {
             hamburger.classList.toggle("active")
             navMenu.classList.toggle("active")
            })
    
            if (storedMessageData) {
                const userMessage = JSON.parse(storedMessageData);
                console.log(userMessage)
                displayUserMessage(userMessage);
            }
    
            function displayUserMessage(userMessage) {
                const adminQueryDiv = document.getElementById('admin-query');

                       let htmlContent = `
                        <tr>
                            <th>Email</th>
                            <th>Question</th>
                            <th>Description</th>
                               </tr>
                           `;

                userMessage.forEach(element => {
                    htmlContent += `
                        <tr>
                            <td>${element.email}</td>
                            <td>${element.question}</td>
                            <td>${element.message}</td>
                        </tr>
                    `;
                });

                 adminQueryDiv.innerHTML = htmlContent;
              
            }


    
                const updateUserUI = () => {
    const currentUser = JSON.parse(localStorage.getItem('loginUser'));

    if (currentUser && currentUser.username) {
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
                ${currentUser.username}
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
            updateUserUI();
        }
    })
    
               
                updateUserUI();


               
     
     