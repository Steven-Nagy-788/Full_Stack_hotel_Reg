// =================== JWT Decode Function ===================
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

// =================== Show Hello + Logout ===================
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    let firstname = "User";

    if (token) {
        const payload = parseJwt(token);
        firstname = payload.firstname || "User";

        const userInfo = document.querySelector("#user_info");
        const userD = document.querySelector("#user");
        const links = document.querySelector("#links");

        if (links) links.style.display = "none";     
        if (userInfo) userInfo.style.display = "block";
        if (userD) userD.innerHTML = "Hello, " + firstname;
    }

    const logout_btn = document.querySelector("#Logout");
    if (logout_btn) {
        logout_btn.addEventListener("click", function () {
            localStorage.removeItem("token");
            window.location = "homepage.html";
        });
    }
});

// =================== Booking Data ===================
function saveBookingData() {
    const checkIn = document.getElementById("in").value;
    const checkOut = document.getElementById("out").value;
    const guests = document.getElementById("Guests").value;
    const rooms = document.getElementById("rooms").value;
    const city = document.getElementById("city").value;

    const bookingData = { checkIn, checkOut, guests, rooms, city };
    localStorage.setItem("bookingData", JSON.stringify(bookingData));
}

// =================== Search Hotels ===================
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

// =================== Check login before using form ===================
const inputs = document.querySelectorAll(".form input, .form select");
inputs.forEach(input => {
    input.addEventListener("input", function () {
        if (!localStorage.getItem("token")) {
            localStorage.setItem("redirectAfterLogin", "homepage.html");
            window.location = "login.html";
        } else {
            searchHotels();
        }
    });

    input.addEventListener("change", function () {
        if (!localStorage.getItem("token")) {
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
    if (!localStorage.getItem("token")) {
        localStorage.setItem("redirectAfterLogin", "homepage.html");
        window.location = "login.html";
    } else {
        saveBookingData();
        searchHotels();
        window.location.href = "confirm.html";
    }
});

// =================== Set current year in footer ===================
document.getElementById("year").textContent = new Date().getFullYear();

// =================== Save Booking Button ===================
document.getElementById("check_btn").addEventListener("click", function(e) {
    e.preventDefault(); 
    if (!localStorage.getItem("token")) {
        localStorage.setItem("redirectAfterLogin", "homepage.html");
        window.location = "login.html";
    } else {
        saveBookingData();
        window.location.href = "confirm.html";
    }
});
