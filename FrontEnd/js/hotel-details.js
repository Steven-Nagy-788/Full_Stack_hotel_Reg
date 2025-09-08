// Read hotelId from URL
const qs = new URLSearchParams(window.location.search);
const hotelId = qs.get("id");

async function loadHotelDetails() {
  try {
    const res = await fetch(`http://localhost:5000/api/hotels/${hotelId}`);
    const hotel = await res.json();

    const hotelInfo = document.getElementById("hotel-info");

    hotelInfo.innerHTML = `
      <div class="hotel-header">
        <img src="${hotel.image}" alt="${hotel.name}" class="hotel-img">
        <div class="hotel-text">
          <h2>${hotel.name}</h2>
          <p class="city"><i class="fas fa-map-marker-alt"></i> ${hotel.city}</p>
          <p>${hotel.description || "No description available."}</p>
        </div>
      </div>

      <div class="room-types mt-4">
        <h3>Available Rooms</h3>
        <div class="rooms-list">
          ${hotel.roomsTypes.map(room => `
            <div class="room-card">
              <h4>${room.type}</h4>
              <p>Price: $${room.price} / night</p>
              <button class="btn btn-primary">Book Now</button>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Error loading hotel details:", err);
  }
}

// Login / Logout + Hello username
document.addEventListener("DOMContentLoaded", function () {
    let userInfo = document.querySelector("#user_info");
    let userD = document.querySelector("#user");
    let logout_btn = document.querySelector("#Logout");
    let links = document.querySelector("#links"); // لو عندك div فيه login/register buttons

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

    // Set current year in footer
    const yearSpan = document.getElementById("year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

// Load hotel details
loadHotelDetails();
