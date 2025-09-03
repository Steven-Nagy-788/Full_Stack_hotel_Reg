let loginBtn = document.getElementById("Login");
let registerBtn = document.getElementById("Register");
loginBtn.addEventListener("click", function(e) {
    setTimeout(() => {
        window.location = "login.html"
    }, 100)

})

registerBtn.addEventListener("click", function(e) {
    setTimeout(() => {
        window.location = "register.html"
    }, 100)

})
let userInfo = document.querySelector("#user_info")
let userD = document.querySelector("#user")
let links = document.querySelector("#links")
let logout_btn = document.querySelector("#Logout")

if (localStorage.getItem("firstname")) {
    links.remove()
    userInfo.style.display = "block"
    userD.innerHTML = "Hello," + localStorage.getItem("firstname").toString()
}
