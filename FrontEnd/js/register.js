let firstname = document.querySelector("#firstName") 
let lastname = document.querySelector("#lastName")
let email = document.querySelector("#email")
let password = document.querySelector("#password")

let register_btn = document.querySelector("#sign_up")

register_btn.addEventListener("click", function(e) {
    e.preventDefault()
    if (lastname.value === "" || firstname.value === "" || email.value === "" || password.value === "") {
        alert("please fill data")
    } else {
        // حفظ بيانات اليوزر
        localStorage.setItem("firstname", firstname.value);
        localStorage.setItem("lastname", lastname.value);
        localStorage.setItem("email", email.value);
        localStorage.setItem("password", password.value);

        // ✅ login أوتوماتيك بعد التسجيل
        setTimeout(() => {
            alert("Account created Successfully");

            // redirect للـ homepage
            window.location = "homepage.html";
        }, 1000)
    }
})
