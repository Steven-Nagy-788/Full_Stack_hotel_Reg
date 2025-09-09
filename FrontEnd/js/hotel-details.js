async function loadHotels() {
  try {
    const res = await fetch("https://localhost:7033/api/Hotel");
    if (!res.ok) throw new Error("Failed to fetch hotels");

    const hotels = await res.json();
    const hotelInfo = document.getElementById("hotel-info");

    hotelInfo.innerHTML = hotels.map(hotel => `
      <div class="hotel-card row align-items-center mb-4 p-3 shadow-lg rounded-lg bg-white animate-card">
        <!-- النص على الشمال -->
        <div class="col-md-7">
          <h2 class="hotel-title">${hotel.name}</h2>
          <p class="city text-muted"><i class="fas fa-map-marker-alt"></i> ${hotel.city}</p>
          <p>${hotel.description || "No description available."}</p>
          
          <div class="room-types mt-3">
            <h5>Available Rooms</h5>
            <div class="rooms-list">
              ${hotel.roomsTypes && hotel.roomsTypes.length > 0 
                ? hotel.roomsTypes.map(room => `
                  <div class="room-card p-2 border rounded mb-2 shadow-sm">
                    <strong>${room.type}</strong> - $${room.price} / night
                    <button class="btn btn-sm btn-primary ml-2">Book Now</button>
                  </div>
                `).join("")
                : "<p>No rooms available at the moment.</p>"
              }
            </div>
          </div>
        </div>

        <!-- الصورة على اليمين -->
        <div class="col-md-5 text-center">
          <img src="img/${hotel.thumbnail_url}" 
               alt="${hotel.name}" 
               class="hotel-img img-fluid rounded shadow-sm">
        </div>
      </div>
    `).join("");

  } catch (err) {
    console.error("Error loading hotels:", err);
    document.getElementById("hotel-info").innerHTML =
      `<p class="text-danger">Failed to load hotels.</p>`;
  }
}

loadHotels();
