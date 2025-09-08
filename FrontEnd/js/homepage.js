let check_btn = document.getElementById("check_btn");

async function searchHotels() {
    const checkIn = document.getElementById('in').value;
    const checkOut = document.getElementById('out').value;
    const guests = document.getElementById('Guests').value;
    const rooms = document.getElementById('rooms').value;
    const city = document.getElementById("city").value;

    try {
        const res = await fetch("http://localhost:5000/api/hotels"); 
        const hotels = await res.json();

        const filteredHotels = hotels.filter(hotel => {
            return (!city || hotel.city.toLowerCase() === city.toLowerCase()) &&
                   (!guests || hotel.guests >= guests) &&
                   (!rooms || hotel.rooms >= rooms);
        });

        const results = document.getElementById("results");
        results.innerHTML = "";

        if (filteredHotels.length === 0) {
            results.innerHTML = `<p style="color:white;">No hotels found for your search.</p>`;
        } else {
            filteredHotels.forEach(hotel => {
                const card = `
                    <div class="hotel-card">
                        <img src="${hotel.image}" alt="${hotel.name}">
                        <h3>${hotel.name}</h3>
                        <p>City: ${hotel.city}</p>
                        <p>Guests: ${hotel.guests}</p>
                        <p>Rooms: ${hotel.rooms}</p>
                        <p>Check in: ${hotel.checkIn}</p>
                        <p>Check out: ${hotel.checkOut}</p>
                        <a href="hotel-details.html?id=${hotel.id}" class="btn btn-primary mt-2">View Details</a>
                    </div>
                `;
                results.innerHTML += card;
            });
        }

        results.scrollIntoView({ behavior: "smooth" });

    } catch (err) {
        console.error("Error fetching hotels:", err);
    }
}

// check login before using form
const inputs = document.querySelectorAll(".form input, .form select");
inputs.forEach(input => {
    input.addEventListener("input", function () {
        if (!localStorage.getItem("firstname")) {
            localStorage.setItem("redirectAfterLogin", "homepage.html");
            window.location = "login.html";
        } else {
            searchHotels();
        }
    });

    input.addEventListener("change", function () {
        if (!localStorage.getItem("firstname")) {
            localStorage.setItem("redirectAfterLogin", "homepage.html");
            window.location = "login.html";
        } else {
            searchHotels();
        }
    });
});

const form = document.querySelector('.form');
form.addEventListener('submit', function(e){
    e.preventDefault();  
    if (!localStorage.getItem("firstname")) {
        localStorage.setItem("redirectAfterLogin", "homepage.html");
        window.location = "login.html";
    } else {
        searchHotels();
    }
});

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

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();
