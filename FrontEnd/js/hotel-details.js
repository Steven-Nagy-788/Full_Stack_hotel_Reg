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

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

loadHotelDetails();
