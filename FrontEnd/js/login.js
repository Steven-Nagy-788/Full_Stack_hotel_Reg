// اختيار العناصر من الـ DOM
let email = document.querySelector("#email");
let password = document.querySelector("#password");
let loginBtn = document.querySelector("#Login");

loginBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (email.value === "" || password.value === "") {
    alert("Please fill in all data");
    return;
  }

  // تجهيز البيانات للإرسال للـ API
  let loginData = {
    email: email.value,
    passWord: password.value,
  };

  // إرسال بيانات login للـ API
  fetch("https://localhost:7033/api/Users/Login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Invalid email or password");
      }
      return response.text(); // نفترض الـ API بيرجع Token كنص
    })
    .then((token) => {
      console.log("=== Login Success ===");
      console.log("JWT Token received:", token);

      // حفظ التوكن في localStorage
      localStorage.setItem("token", token);
      console.log("Token stored in localStorage");

      // Decode للـ JWT علشان نجيب البيانات
      function parseJwt(token) {
        try {
          let base64Url = token.split(".")[1];
          let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          let jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join("")
          );
          return JSON.parse(jsonPayload);
        } catch (err) {
          console.error("Failed to parse token", err);
          return {};
        }
      }

      let payload = parseJwt(token);
      console.log("JWT Payload parsed:", payload);
      console.log("Available keys in payload:", Object.keys(payload));

      localStorage.setItem("payload", JSON.stringify(payload));

      let firstname =
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        "User";

      let userEmail =
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
        email.value;

      localStorage.setItem("firstname", firstname);
      localStorage.setItem("email", userEmail);

      // check if admin by checking role from JWT payload
      let userRole = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 
                    payload.role || 
                    payload.Role ||
                    "guest";

      console.log("User role detected:", userRole);
      console.log("Is admin check:", userRole.toLowerCase() === "admin" || userRole.toLowerCase() === "administrator");

      if (userRole.toLowerCase() === "admin" || userRole.toLowerCase() === "administrator") {
        console.log("Redirecting to admin panel...");
        alert("Admin login successful! Redirecting to admin panel...");
        setTimeout(() => {
          window.location = "Admin/admin.html";
        }, 1000);
      } else {
        console.log("Redirecting to homepage...");
        setTimeout(() => {
          const redirectPage =
            localStorage.getItem("redirectAfterLogin") || "homepage.html";
          localStorage.removeItem("redirectAfterLogin");
          window.location = redirectPage;
        }, 1000);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Login failed. Invalid email or password.");
    });
});

// Logout functionality (لو فيه زرار logout في نفس الصفحة)
document.addEventListener("DOMContentLoaded", function () {
  let logout_btn = document.querySelector("#Logout");

  if (logout_btn) {
    logout_btn.addEventListener("click", function () {
      localStorage.removeItem("token");
      localStorage.removeItem("firstname");
      localStorage.removeItem("email");
      window.location = "homepage.html";
    });
  }
});
