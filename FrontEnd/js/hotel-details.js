// Helper function to generate star icons
function generateStarsHtml(stars) {
    if (!stars || stars <= 0) {
        return '';
    }
    let starsHtml = '';
    for (let i = 0; i < stars; i++) {
        starsHtml += '<i class="fas fa-star text-warning"></i> ';
    }
    return `<div class="stars mb-2">${starsHtml}</div>`;
}

async function loadHotels() {
  try {
    const res = await fetch("https://localhost:7033/api/Hotel");
    if (!res.ok) throw new Error("Failed to fetch hotels");

    const hotels = await res.json();
    const hotelInfo = document.getElementById("hotel-info");

    hotelInfo.innerHTML = hotels.map((hotel, hIndex) => `
      <div class="hotel-card row align-items-center mb-4 p-3 shadow-lg rounded-lg bg-white">
        
        <!-- Hotel Image -->
        <div class="col-md-5 text-center">
          <img src="img/${hotel.thumbnail_url}" 
               alt="${hotel.name}" 
               class="hotel-img img-fluid rounded shadow-sm">
        </div>

        <!-- Hotel Details -->
        <div class="col-md-7">
          <h2 class="hotel-title">${hotel.name}</h2>
          
          <!-- STAR RATING -->
          ${generateStarsHtml(hotel.stars || hotel.Stars)}
          
          <!-- CITY AND ADDRESS -->
          <p class="city text-muted">
            <i class="fas fa-map-marker-alt"></i> 
            ${hotel.city}, ${hotel.address || hotel.Address || ''}
          </p>
          
          <p>${hotel.description || "No description available."}</p>

        </div>
      </div>
    `).join("");

  } catch (err) {
    console.error("Error loading hotels:", err);
    document.getElementById("hotel-info").innerHTML =
      `<p class="text-danger">Failed to load hotels.</p>`;
  }
}

// Load hotels when the page loads
loadHotels();