

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

        // Scroll smoothly to results
        results.scrollIntoView({ behavior: "smooth" });

    } catch (err) {
        console.error("Error fetching hotels:", err);
    }

}


const inputs = document.querySelectorAll(".form input, .form select");
inputs.forEach(input => {
    input.addEventListener("input", searchHotels);
    input.addEventListener("change", searchHotels);
});


const form = document.querySelector('.form');
form.addEventListener('submit', function(e){
    e.preventDefault();  
    searchHotels();
});

let loginBtn = document.getElementById("Login");
let registerBtn = document.getElementById("Register");
loginBtn.addEventListener("click", function(e) {
    setTimeout(() => {
        window.location = "login.html"
    }, 100)

})

registerBtn.addEventListener("click", function(e) {
    setTimeout(() => {
        window.location = "register.html"
    }, 100)

})
let userInfo = document.querySelector("#user_info")
let userD = document.querySelector("#user")
let links = document.querySelector("#links")
let logout_btn = document.querySelector("#Logout")

if (localStorage.getItem("firstname")) {
    links.remove()
    userInfo.style.display = "block"
    userD.innerHTML = "Hello," + localStorage.getItem("firstname").toString()
}

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();
