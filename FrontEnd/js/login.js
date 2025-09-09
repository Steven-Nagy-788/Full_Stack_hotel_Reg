// اختيار العناصر من الـ DOM
let email = document.querySelector("#email");
let password = document.querySelector("#password");
let loginBtn = document.querySelector("#Login");

loginBtn.addEventListener("click", function(e) {
    e.preventDefault();

    if (email.value === "" || password.value === "") {
        alert("Please fill in all data");
        return;
    }

    // تجهيز البيانات للإرسال للـ API
    let loginData = {
        email: email.value,
        passWord: password.value
    };

    // إرسال بيانات login للـ API
    fetch('https://localhost:7033/api/Users/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Invalid email or password");
        }
        return response.text(); // نفترض الـ API بيرجع Token كنص
    })
    .then(token => {
        console.log("JWT Token:", token);

        // حفظ التوكن في localStorage لو عايزة تستخدمينه في صفحات تانية
        localStorage.setItem("token", token);

        // Decode للـ JWT علشان نجيب firstname
        function parseJwt(token) {
            try {
                let base64Url = token.split('.')[1];
                let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                return JSON.parse(jsonPayload);
            } catch (err) {
                console.error("Failed to parse token", err);
                return {};
            }
        }

        let payload = parseJwt(token);
        let firstname = payload.firstname || "User"; // حسب اسم الحقل في الـ backend

        // عرض اسم المستخدم بجانب Hello
        let userInfo = document.querySelector("#user_info");
        let userD = document.querySelector("#user");
        let links = document.querySelector("#links");

        if (links) links.style.display = "none";     
        if (userInfo) userInfo.style.display = "block";
        if (userD) userD.innerHTML = "Hello, " + firstname;

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

    })
    .catch(error => {
        console.error("Error:", error);
        alert("Login failed. Invalid email or password.");
    });
});

// Logout functionality
document.addEventListener("DOMContentLoaded", function () {
    let logout_btn = document.querySelector("#Logout");

    if (logout_btn) {
        logout_btn.addEventListener("click", function () {
            localStorage.removeItem("token");
            window.location = "homepage.html";
        });
    }
});
