// old login/register buttons
let loginBtn = document.getElementById("Login");
let registerBtn = document.getElementById("Register");
if (loginBtn) {
    loginBtn.addEventListener("click", function(e) {
        setTimeout(() => {
            window.location = "login.html"
        }, 100)
    })
}
if (registerBtn) {
    registerBtn.addEventListener("click", function(e) {
        setTimeout(() => {
            window.location = "register.html"
        }, 100)
    })
}

// show username + logout
document.addEventListener("DOMContentLoaded", function () {
    let userInfo = document.querySelector("#user_info");
    let userD = document.querySelector("#user");
    let links = document.querySelector("#links");
    let logout_btn = document.querySelector("#Logout");

    if (localStorage.getItem("firstname")) {
        if (links) links.style.display = "none";
        if (userInfo) userInfo.style.display = "block";
        if (userD) userD.innerHTML = "Hello, " + localStorage.getItem("firstname");
    } else {
        if (links) links.style.display = "flex";
        if (userInfo) userInfo.style.display = "none";
    }

    if (logout_btn) {
        logout_btn.addEventListener("click", function () {
            localStorage.removeItem("firstname");
            localStorage.removeItem("lastname");
            localStorage.removeItem("email");
            localStorage.removeItem("password");
            window.location = "homepage.html";
        });
    }
});
