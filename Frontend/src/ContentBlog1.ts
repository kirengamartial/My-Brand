const commentForm = document.getElementById('CommentForm') as HTMLFormElement;
const hamburgerrr = document.querySelector(".hamburger") as HTMLElement;
const navMenuuu = document.querySelector(".nav__list") as HTMLElement;
const loginDivvv = document.querySelector('.nav__login') as HTMLElement;
const Adminnn = document.querySelector('.admin') as HTMLElement;
const blogDiv = document.querySelector('.blogii_container') as HTMLElement
const commentDiv = document.querySelector('.holderr') as HTMLElement

hamburgerrr.addEventListener("click", () => {
    hamburgerrr.classList.toggle("active");
    navMenuuu.classList.toggle("active");
});

const BlogId = window.location.pathname.split('/').pop()
fetch(`/api/blog/${BlogId}`, {credentials: 'include'})
.then(res => res.json())
.then(data => {
blogDiv.innerHTML = `
<div class="image">
<img src="${data.photo}" alt="">
</div>
<div>
<p>${data.description}</p>
</div>
`
})



commentForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    const commentInput = document.getElementById('comment') as HTMLInputElement;
    const comment = commentInput.value;

    try {
        const response = await fetch('/api/user', { credentials: 'include' });
        const user = await response.json();
        if (user && user.username) {
            const res = await fetch('/comment', {
                method: 'POST',
                body: JSON.stringify({
                    blog_id: BlogId,
                    name: user.username,
                    comment
                }),
                headers: { "Content-type": "application/json" },
                credentials: 'include'
            });
            const data = await res.json();
            if (data) {
                commentDiv.innerHTML += `
                    <div class='holder'>
                        <h5>Name: ${data.name}</h5> 
                        <p>${data.comment}</p>    
                    </div>
                `;
            }
        } else {
            alert("Please log in to submit a comment.");
        }
    } catch (error) {
        console.error('Error submitting comment:', error);
    }
});

    fetch('/comment', {credentials: 'include'})
    .then(res => res.json())
    .then(datas => {
        datas.forEach((data: any) => {
    
            if(data.blog_id === BlogId ) {
                 commentDiv.innerHTML += `
                 <div class='holder'>   
                 <h5>Name: ${data.name}</h5> 
                 <p>${data.comment}</p>    
                </div>
    
                 `
            }
        })
    })
    .catch(err => console.log(err))




const updateUserUIII = (user: any) => {
    
    if (user && user.username) {
        if (user.isAdmin === true) {
            Adminnn.innerHTML = `
                <a href="#" class="nav__link">
                    Admin <i class="fas fa-chevron-down"></i>
                </a>
                <ul class="dropdown-content">
                    <li><a href="/query">Query</a></li>
                    <li><a href="/article">Article</a></li>
                </ul>
            `;
        } else {
            Adminnn.innerHTML = '';
        }
        loginDivvv.innerHTML = `
            <a href="#" class="nav__link">
                ${user.username}
            </a>
            <ul class="dropdown-content">
                <li ><a id="logout" href="#">Logout</a></li>
            </ul>
        `;
    } else {
        loginDivvv.innerHTML = `
            <a href="/logins" class="nav__link">
                Sign in
            </a>
        `;
        Adminnn.innerHTML = '';
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
            updateUserUIII (null); 
            location.assign('/register')
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }
});

fetch('/api/user', { credentials: 'include' })
.then(response => response.json())
.then(user => updateUserUIII (user))
.catch(error => console.error('Error fetching user data:', error));;
