const commentForm = document.getElementById('CommentForm');
            const holderDiv = document.querySelector('.holderr2');
            const hamburger = document.querySelector(".hamburger")
            const navMenu = document.querySelector(".nav__list")
            const loginDiv = document.querySelector('.nav__login');
            const Admin = document.querySelector('.admin');


            hamburger.addEventListener("click", () => {
             hamburger.classList.toggle("active")
             navMenu.classList.toggle("active")
            })

            
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const comment = document.getElementById('comment').value;
        
                
                let existingComments2 = JSON.parse(localStorage.getItem('comments2')) || []
                const LoggedInUser = JSON.parse(localStorage.getItem('loginUser'))

                const comments = {
                    username: LoggedInUser.username,
                    comment: comment
                }

        
                if(LoggedInUser) {
                existingComments2.push(comments)
                alert('Comment Added')
               }
        
                localStorage.setItem('comments2', JSON.stringify(existingComments2))
               
        
                displayComments(existingComments2);
            });
        
            const displayComments = (comments) => {
               
                    holderDiv.innerHTML = '';
        
                   comments.forEach((comment) => {
                    holderDiv.innerHTML += `
                    <div class='holder'>
                      <h5>Name: ${comment.username}</h5> 
                      <p>${comment.comment}</p>    
                    </div>`;
                   });
                
               
            };
        
            const storedComments = JSON.parse(localStorage.getItem('comments2'))
        
            if (storedComments) {
                displayComments(storedComments);
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