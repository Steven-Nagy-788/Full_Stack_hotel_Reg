// اختيار العناصر من الـ DOM
let firstname = document.querySelector("#firstName");
let email = document.querySelector("#email");
let password = document.querySelector("#password");
let register_btn = document.querySelector("#sign_up");

register_btn.addEventListener("click", async function(e) {
    e.preventDefault(); // منع إعادة تحميل الصفحة عند الضغط على submit

    // التحقق من أن الحقول ليست فارغة
    if (firstname.value === "" || email.value === "" || password.value === "") {
        alert("Please fill all data");
        return;
    }

    // تجهيز البيانات للإرسال للـ API
    let userData = {
        userName: firstname.value,
        email: email.value,
        passWord: password.value
    };

    // إرسال البيانات للـ API
    // fetch('https://localhost:7033/api/Users/register', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(userData)
    // })
    await fetch('https://localhost:7033/api/Users/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: firstname.value,
        email: email.value,
        password: password.value
    })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to register user");
        }
        return response.text(); // بدل response.json() لأنه السيرفر بيرجع نص
    })
    .then(data => {
        console.log("Server response:", data); // optional: لتشوف الرد في الكونسل
        alert("Account created Successfully");
        setTimeout(() => {
            window.location = "login.html"; // تحويل للـ homepage بعد 1 ثانية
        }, 1000);
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Registration failed. Please try again.");
    });
});