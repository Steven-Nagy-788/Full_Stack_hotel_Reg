let email = document.querySelector("#email");
let password = document.querySelector("#password");
let loginBtn = document.querySelector("#Login");

loginBtn.addEventListener("click", function(e) {
    e.preventDefault();


    let getUser = localStorage.getItem("email");
    let getPassword = localStorage.getItem("password");
    let getFirstname = localStorage.getItem("firstname") || "User"; 

    if (email.value === "" || password.value === "") {
        alert("Please fill in all data");
        return;
    }

    if ((getUser && getUser.trim() === email.value && getPassword && getPassword === password.value)) {
        // تخزين firstname و email لتظهر في homepage
        localStorage.setItem("firstname", getFirstname);
        localStorage.setItem("email", email.value);

        // check if admin
        if (email.value.toLowerCase() === "admin@admin.com" && password.value === "admin123") {
            setTimeout(() => {
                window.location = "Admin/admin.html";
            }, 1000);
        } else {
            setTimeout(() => {
                const redirectPage = localStorage.getItem("redirectAfterLogin") || "homepage.html";
                localStorage.removeItem("redirectAfterLogin");
                window.location = redirectPage;
            }, 1000);
        }

    } else {
        alert("Username or password is incorrect!");
    }
});

// show Hello username + Logout if logged in
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

