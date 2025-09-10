//async function loadHotels() {
//  try {
//    const res = await fetch("https://localhost:7033/api/Hotel");
//    if (!res.ok) throw new Error("Failed to fetch hotels");

//    const hotels = await res.json();
//    const hotelInfo = document.getElementById("hotel-info");

//    hotelInfo.innerHTML = hotels.map(hotel => `
//      <div class="hotel-card mb-4 p-3 border rounded shadow-sm">
//        <div class="row">
          
//          <!-- الصورة على اليمين -->
//          <div class="col-md-5 text-center">
//            <img src="img/${hotel.thumbnail_url}" class="hotel-img">
//          </div>

//          <!-- التفاصيل على الشمال -->
//          <div class="col-md-7 d-flex flex-column justify-content-between">
//            <div>
//              <h2>${hotel.name}</h2>
//              <p class="city"><i class="fas fa-map-marker-alt"></i> ${hotel.city}</p>
//              <p>${hotel.description || "No description available."}</p>
//            </div>

//            <div class="room-types mt-3">
//              <h5>Available Rooms</h5>
//              <div class="rooms-list">
//                ${
//                  hotel.roomsTypes && hotel.roomsTypes.length > 0
//                    ? hotel.roomsTypes.map(room => `
//                      <div class="room-card p-2 border rounded mb-2 d-flex justify-content-between align-items-center">
//                        <div>
//                          <strong>${room.type}</strong> - $${room.price} / night
//                        </div>
//                        <button class="btn btn-sm btn-primary book-btn"
//                                data-hotel='${JSON.stringify(hotel)}'
//                                data-room='${JSON.stringify(room)}'>
//                          Book Now
//                        </button>
//                      </div>
//                    `).join("")
//                    : "<p>No rooms available at the moment.</p>"
//                }
//              </div>
//            </div>
//          </div>

//        </div>
//      </div>
//    `).join("");

//    // ✅ Book Now functionality
//    document.querySelectorAll(".book-btn").forEach(btn => {
//      btn.addEventListener("click", (e) => {
//        const hotel = JSON.parse(e.target.getAttribute("data-hotel"));
//        const room = JSON.parse(e.target.getAttribute("data-room"));

//        // تخزين الحجز في localStorage
//        let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
//        bookings.push({ hotel, room, date: new Date().toLocaleString() });
//        localStorage.setItem("bookings", JSON.stringify(bookings));

//        // تحويل لصفحة MyBooking.html
//        window.location.href = "MyBooking.html";
//      });
//    });

//  } catch (err) {
//    console.error("Error loading hotels:", err);
//    document.getElementById("hotel-info").innerHTML =
//      `<p class="text-danger">Failed to load hotels.</p>`;
//  }
//}

//loadHotels();


//async function loadHotels() {
//  try {
//    const res = await fetch("https://localhost:7033/api/Hotel");
//    if (!res.ok) throw new Error("Failed to fetch hotels");

//    const hotels = await res.json();
//    const hotelInfo = document.getElementById("hotel-info");

//    hotelInfo.innerHTML = hotels.map((hotel, hIndex) => `
//      <div class="hotel-card d-flex mb-4 p-3 shadow-sm">
        
//        <!-- الصورة -->
//        <div class="hotel-img-container">
//          <img src="img/${hotel.thumbnail_url}" class="hotel-img">
//        </div>

//        <!-- التفاصيل -->
//        <div class="hotel-details-text pl-4 flex-grow-1">
//          <h2>${hotel.name}</h2>
//          <p class="city"><i class="fas fa-map-marker-alt"></i> ${hotel.city}</p>
//          <p>${hotel.description || "No description available."}</p>

//          <div class="room-types mt-3">
//            <h5>Available Rooms</h5>
//            <div class="rooms-list">
//              ${
//                hotel.roomsTypes && hotel.roomsTypes.length > 0
//                  ? hotel.roomsTypes.map((room, rIndex) => `
//                    <div class="room-card d-flex justify-content-between align-items-center p-2 mb-2 border rounded">
//                      <span><strong>${room.type}</strong> - $${room.price} / night</span>
//                      <button class="btn btn-primary book-btn"
//                              data-hotel-index="${hIndex}"
//                              data-room-index="${rIndex}">
//                        Book Now
//                      </button>
//                    </div>
//                  `).join("")
//                  : "<p>No rooms available at the moment.</p>"
//              }
//            </div>
//          </div>
//        </div>
//      </div>
//    `).join("");

//    // ✅ Book Now functionality
//    document.querySelectorAll(".book-btn").forEach(btn => {
//      btn.addEventListener("click", (e) => {
//        const hIndex = e.target.getAttribute("data-hotel-index");
//        const rIndex = e.target.getAttribute("data-room-index");
//        const hotel = hotels[hIndex];
//        const room = hotel.roomsTypes[rIndex];

//        // تخزين الحجز في localStorage
//        let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
//        bookings.push({ hotel, room, date: new Date().toLocaleString() });
//        localStorage.setItem("bookings", JSON.stringify(bookings));

//        // تحويل لصفحة MyBooking.html
//        window.location.href = "MyBooking.html";
//      });
//    });

//  } catch (err) {
//    console.error("Error loading hotels:", err);
//    document.getElementById("hotel-info").innerHTML =
//      `<p class="text-danger">Failed to load hotels.</p>`;
//  }
//}

//loadHotels();


async function loadHotels() {
  try {
    const res = await fetch("https://localhost:7033/api/Hotel");
    if (!res.ok) throw new Error("Failed to fetch hotels");

    const hotels = await res.json();
    const hotelInfo = document.getElementById("hotel-info");

    hotelInfo.innerHTML = hotels.map((hotel, hIndex) => `
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

        </div>
      </div>
    `).join("");

    // ✅ Book Now functionality
    document.querySelectorAll(".book-hotel-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const hIndex = e.target.getAttribute("data-hotel-index");
        const hotel = hotels[hIndex];

        // تخزين الحجز في localStorage
        let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        bookings.push({ hotel, date: new Date().toLocaleString() });
        localStorage.setItem("bookings", JSON.stringify(bookings));

        // تحويل لصفحة MyBooking.html
        window.location.href = "confirm.html";
      });
    });

  } catch (err) {
    console.error("Error loading hotels:", err);
    document.getElementById("hotel-info").innerHTML =
      `<p class="text-danger">Failed to load hotels.</p>`;
  }
}

loadHotels();
