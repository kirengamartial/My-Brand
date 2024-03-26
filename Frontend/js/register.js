const Form = document.getElementById('form')
const Admin = document.querySelector('.admin')
const SignDiv = document.querySelector('.nav__login')
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav__list")
const Errors = document.querySelector(".error")


hamburger.addEventListener("click", () => {
hamburger.classList.toggle("active")
navMenu.classList.toggle("active")
})

Form.addEventListener('submit', (e) => {
   e.preventDefault()
   const inputUsername = document.getElementById('user_name').value
   const inputUseremail = document.getElementById('user_email').value
   const inupUserpassword = document.getElementById('password').value
   const inputUserConfirmPassword = document.getElementById('Confirm_password').value

   const existingUser = JSON.parse(localStorage.getItem('user')) ||  []

   const User = {
       username: inputUsername,
       useremail: inputUseremail,
       password: inupUserpassword,
       isAdmin: false,
       isLoggedIn: true
   }
      
   const userExists = existingUser.some(user => user.useremail === inputUseremail);
   if (userExists) {
  Errors.innerHTML = `<p>User with this email already exists</p>`;
      setTimeout(() => {
    Errors.innerHTML = '';
     }, 3000);
   return;
}

   if (inupUserpassword !== inputUserConfirmPassword) {
       Errors.innerHTML = `<p>Passwords do not match</p>`;
       setTimeout(() => {
           Errors.innerHTML = '';
       }, 3000);
       return; 
   }

   if (inupUserpassword.length < 6) {
        Errors.innerHTML = `<p>Password must be at least 6 characters long</p>`;
        setTimeout(() => {
            Errors.innerHTML = '';
        }, 3000);
        return; 
   }

    
   if (!/\d/.test(inupUserpassword)) {
       Errors.innerHTML = `<p>Password must contain numbers</p>`;
       setTimeout(() => {
           Errors.innerHTML = '';
       }, 3000);
       return;
   }


   existingUser.push(User);
   localStorage.setItem('user', JSON.stringify(existingUser));
   const loginUser = existingUser.find(user => user.username === User.username && user.password === User.password);
   localStorage.setItem('loginUser', JSON.stringify(loginUser));
   window.location.href = "index.html";
})


const user = JSON.parse(localStorage.getItem('loginUser'));
 if(user.isLoggedIn) {
  window.location.href = "index.html" 
  }