let email = document.querySelector("#email");
let password = document.querySelector("#password");
let loginBtn = document.querySelector("#Login");


function parseJwt(token) {
    try {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Invalid token", e);
        return null;
    }
}

// ✅ Login
loginBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (email.value === "" || password.value === "") {
        alert("Please fill in all data");
        return;
    }

    fetch('https://localhost:7033/api/Users/Login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email.value,
            passWord: password.value
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Server returned " + response.status);
        }
        return response.text();   
    })
    .then(token => {
        console.log("Raw token:", token);

        localStorage.setItem("token", token);

        let decoded = parseJwt(token);
        console.log("Decoded token:", decoded);

        if (decoded && decoded.username) {
            localStorage.setItem("firstname", decoded.username);
        } else {
            localStorage.setItem("firstname", "User");
        }

        localStorage.setItem("email", email.value);

     
        if (decoded && decoded.role && decoded.role.toLowerCase() === "admin") {
            window.location = "Admin/admin.html";
        } else {
            window.location = "homepage.html";
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Login failed ❌");
    });
});


// Hello + Logout
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
            localStorage.removeItem("username");
            localStorage.removeItem("email");
            localStorage.removeItem("token");
            window.location = "homepage.html";
        });
    }
});
