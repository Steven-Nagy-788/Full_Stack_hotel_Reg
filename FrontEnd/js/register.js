let firstname = document.querySelector("#firstName");  // This is the username input
let email = document.querySelector("#email");          // This is the email input
let password = document.querySelector("#password");    // This is the password input
let register_btn = document.querySelector("#sign_up"); // This is the register button

register_btn.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent the form from refreshing the page

    // Check if any input fields are empty
    if (firstname.value === "" || email.value === "" || password.value === "") {
        alert("Please fill in all fields");
        return;
    }

    // Prepare the user data to send to the API
    let userData = {
        userName: firstname.value,
        passWord: password.value,
        email: email.value
    };

    // Send request to the API
    fetch('https://localhost:7033/api/Users/register', {
        method: "POST", // The request type is POST
        headers: {
            "Content-Type": "application/json" // Data format is JSON
        },
        body: JSON.stringify(userData) // Convert data to JSON string
    })
    .then(response => {
    console.log("Full response:", response); 
    if (!response.ok) {
        throw new Error("Server returned " + response.status);
    }
    return response.text();
})
 // Convert the API response to JavaScript object
    .then(data => {
        alert("Account created successfully");

        console.log("API response:", data); // Show the API response in console

        // Save token or userId if available in response
        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        if (data.userId) {
            localStorage.setItem("userId", data.userId);
        }

        // Redirect to homepage after successful registration
        window.location = "login.html";
    })
    .catch(error => {
        console.error("Error:", error); // Show any error in the console
        alert("Registration failed ❌");
    });
});
