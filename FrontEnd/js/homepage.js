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

// =================== Search & Display Hotels (REAL API) ===================
// =================== Search & Display Hotels (REAL API) ===================
// =================== Search & Display Hotels (REAL API) ===================
async function searchHotels() {
    const checkIn = document.getElementById('in').value;
    const checkOut = document.getElementById('out').value;
    const guests = document.getElementById('Guests').value;
    const rooms = document.getElementById('rooms').value;
    const city = document.getElementById("city").value;

    const results = document.getElementById("results");
    results.innerHTML = `<p style="color:white; font-size:18px;">Loading hotels...</p>`;

    try {
        let hotels = []; // outer variable

        await fetch('https://localhost:7033/api/Search/hotels', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            city: city,
            checkIn: checkIn,
            checkOut: checkOut,
            numberOfGuests: guests,
            roomTypeName: rooms
        })
        })
        .then(response => response.json()) // parse JSON
        .then(data => {
        console.log("Fetched data:", data);  // log data
        hotels = data;
        })
        .catch(error => console.error("Error fetching hotels:", error));


        if (!hotels || hotels.length === 0) {
            results.innerHTML = `<p style="color:white;">No hotels found for your search.</p>`;
            return;
        }

        // ✅ Use same layout as hotel-details.js
        // ✅ Use same layout as hotel-details.js
        results.innerHTML = hotels.map((hotel, hIndex) => `
        <div class="hotel-card row align-items-center mb-4 p-3 shadow-lg rounded-lg bg-white">
            
            <!-- الصورة -->
            <div class="col-md-5 text-center">
            <img src="img/${hotel.thumbnail_url}" 
                alt="${hotel.name}" 
                class="hotel-img img-fluid rounded shadow-sm">
            </div>

            <!-- التفاصيل -->
            <div class="col-md-7">
            <h2 class="hotel-title">${hotel.name}</h2>
            <p class="city text-muted"><i class="fas fa-map-marker-alt"></i> ${hotel.city}</p>
            <p>${hotel.description || "No description available."}</p>

            <div class="d-flex gap-2 mt-3">
                <a href="hotel-details.html?id=${hotel.id}" 
                class="btn btn-outline-primary mr-2">
                View Details
                </a>
                <button class="btn btn-success book-hotel-btn" 
                        data-hotel-index="${hIndex}">
                Book Now
                </button>
            </div>
            </div>
        </div>
        `).join("");
        // ✅ Add Book Now functionality
        document.querySelectorAll(".book-hotel-btn").forEach(btn => {
          btn.addEventListener("click", (e) => {
            const hIndex = e.target.getAttribute("data-hotel-index");
            const hotel = hotels[hIndex];

            let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
            bookings.push({ hotel, date: new Date().toLocaleString() });
            localStorage.setItem("bookings", JSON.stringify(bookings));

            window.location.href = "confirm.html";
          });
        });

        results.scrollIntoView({ behavior: "smooth" });

    } catch (err) {
        console.error("Error fetching hotels:", err);
        results.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    }
}



// =================== Check login before using form ===================
const inputs = document.querySelectorAll(".form input, .form select");
inputs.forEach(input => {
    input.addEventListener("input", function () {
        if (!localStorage.getItem("token")) {
            localStorage.setItem("redirectAfterLogin", "homepage.html");
            window.location = "login.html";
        }
        // ✅ No searchHotels() here
    });

    input.addEventListener("change", function () {
        if (!localStorage.getItem("token")) {
            localStorage.setItem("redirectAfterLogin", "homepage.html");
            window.location = "login.html";
        }
        // ✅ No searchHotels() here
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

// =================== Check Availability Button ===================
document.getElementById("check_btn").addEventListener("click", function (e) {
    e.preventDefault();

    if (!localStorage.getItem("token")) {
        localStorage.setItem("redirectAfterLogin", "homepage.html");
        window.location = "login.html";
    } else {
        saveBookingData(); 
        document.getElementById("results").scrollIntoView({ behavior: "smooth" });
        searchHotels();   // ⬅️ NOW only backend fetch
    }
});



