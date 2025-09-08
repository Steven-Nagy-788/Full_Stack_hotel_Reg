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


// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();
