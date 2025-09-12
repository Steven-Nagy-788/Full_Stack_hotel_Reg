// =================== Set Default Dates ===================
function setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);
    
    const checkInInput = document.getElementById('in');
    const checkOutInput = document.getElementById('out');
    
    if (checkInInput) {
        checkInInput.value = tomorrow.toISOString().split('T')[0];
        // Set minimum date to today
        checkInInput.min = today.toISOString().split('T')[0];
    }
    if (checkOutInput) {
        checkOutInput.value = dayAfterTomorrow.toISOString().split('T')[0];
        // Set minimum date to tomorrow
        checkOutInput.min = tomorrow.toISOString().split('T')[0];
    }
}

// =================== Date Validation Functions ===================
function validateDates() {
    const checkInInput = document.getElementById('in');
    const checkOutInput = document.getElementById('out');
    
    if (!checkInInput || !checkOutInput) return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkInDate = new Date(checkInInput.value);
    const checkOutDate = new Date(checkOutInput.value);
    
    // Check if check-in is not in the past
    if (checkInDate < today) {
        alert("Check-in date cannot be in the past. Please select today or a future date.");
        checkInInput.focus();
        return false;
    }
    
    // Check if check-out is after check-in
    if (checkOutDate <= checkInDate) {
        alert("Check-out date must be after check-in date.");
        checkOutInput.focus();
        return false;
    }
    
    return true;
}

function onCheckInChange() {
    const checkInInput = document.getElementById('in');
    const checkOutInput = document.getElementById('out');
    
    if (!checkInInput || !checkOutInput) return;
    
    const checkInDate = new Date(checkInInput.value);
    const nextDay = new Date(checkInDate);
    nextDay.setDate(checkInDate.getDate() + 1);
    
    // Update check-out minimum date to be after check-in
    checkOutInput.min = nextDay.toISOString().split('T')[0];
    
    // If current check-out is not after check-in, update it
    const checkOutDate = new Date(checkOutInput.value);
    if (checkOutDate <= checkInDate) {
        checkOutInput.value = nextDay.toISOString().split('T')[0];
    }
}

function onCheckOutChange() {
    const checkInInput = document.getElementById('in');
    const checkOutInput = document.getElementById('out');
    
    if (!checkInInput || !checkOutInput) return;
    
    const checkInDate = new Date(checkInInput.value);
    const checkOutDate = new Date(checkOutInput.value);
    
    // If check-out is not after check-in, show warning
    if (checkOutDate <= checkInDate) {
        alert("Check-out date must be after check-in date.");
        const nextDay = new Date(checkInDate);
        nextDay.setDate(checkInDate.getDate() + 1);
        checkOutInput.value = nextDay.toISOString().split('T')[0];
    }
}

// =================== Make Booking API Call ===================
// Function to show booking confirmation modal
function showBookingModal(hotel, roomType, checkIn, checkOut, numberOfNights, totalPrice) {
    // Populate modal with booking details
    document.getElementById('modal-hotel-name').textContent = hotel.name;
    document.getElementById('modal-hotel-location').textContent = `${hotel.city}, ${hotel.address}`;
    document.getElementById('modal-room-type').textContent = `${roomType.name} (${roomType.capacity})`;
    document.getElementById('modal-checkin').textContent = checkIn;
    document.getElementById('modal-checkout').textContent = checkOut;
    document.getElementById('modal-nights').textContent = numberOfNights;
    document.getElementById('modal-total-price').textContent = totalPrice;
    
    // Store booking data for confirmation
    const modal = document.getElementById('bookingModal');
    modal.bookingData = {
        hotelId: hotel.id,
        roomTypeId: roomType.id,
        checkIn: checkIn,
        checkOut: checkOut,
        totalPrice: totalPrice,
        hotelName: hotel.name,
        roomTypeName: roomType.name
    };
    
    // Show the modal
    $('#bookingModal').modal('show');
}

// Function to handle booking confirmation
function confirmBooking() {
    const modal = document.getElementById('bookingModal');
    const bookingData = modal.bookingData;
    
    if (bookingData) {
        // Hide the modal first
        $('#bookingModal').modal('hide');
        
        // Make the booking API call
        makeBooking(
            bookingData.hotelId, 
            bookingData.roomTypeId, 
            bookingData.checkIn, 
            bookingData.checkOut, 
            bookingData.totalPrice, 
            bookingData.hotelName, 
            bookingData.roomTypeName
        );
    }
}

async function makeBooking(hotelId, roomTypeId, checkIn, checkOut, totalPrice, hotelName, roomTypeName) {
    try {
        console.log("Making booking request:", {
            hotel_Id: hotelId,
            roomType_Id: roomTypeId,
            check_In: checkIn,
            check_Out: checkOut
        });

        // Get the authentication token
        const token = localStorage.getItem("token");
        
        if (!token) {
            alert("You must be logged in to make a booking.");
            window.location = "login.html";
            return;
        }

        const cleanToken = token.replace(/^"(.*)"$/, '$1');

        const requestHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cleanToken}`
        };
        
        const response = await fetch('https://localhost:7033/api/Bookings', {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify({
                hotel_Id: hotelId,
                roomType_Id: roomTypeId,
                check_In: checkIn,
                check_Out: checkOut
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Booking successful:", result);
            window.location.href = "MyBooking.html";
        } else {
            const error = await response.text();
            console.error("Booking failed:", error);
            alert(`❌ Booking Failed!\n\nError: ${error}\n\nPlease try again or contact support.`);
        }
    } catch (err) {
        console.error("Error making booking:", err);
        alert(`❌ Booking Error!\n\nThere was a problem processing your booking: ${err.message}\n\nPlease check your internet connection and try again.`);
    }
}

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
// =================== THIS IS THE CORRECTED FUNCTION =======================
let isSearching = false; // Guard to prevent multiple simultaneous searches

async function searchHotels() {
    if (isSearching) {
        console.log("Search already in progress, skipping...");
        return;
    }
    
    isSearching = true;
    console.log("searchHotels function called");
    
    const checkIn = document.getElementById('in').value;
    const checkOut = document.getElementById('out').value;
    const guests = document.getElementById('Guests').value;
    const rooms = document.getElementById('rooms').value;
    const city = document.getElementById("city").value;

    if (!checkIn || !checkOut || !validateDates()) {
        isSearching = false;
        return;
    }

    const results = document.getElementById("results");
    results.innerHTML = `<p style="color:white; font-size:18px;">Loading hotels...</p>`;

    try {
        const response = await fetch('https://localhost:7033/api/Search/hotels', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                City: city,
                CheckIn: checkIn,
                CheckOut: checkOut,
                NumberOfGuests: guests,
                RoomTypeName: rooms
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const hotels = await response.json();
        console.log("Fetched data:", hotels);

        if (!hotels || hotels.length === 0) {
            results.innerHTML = `<p style="color:white;">No hotels found for your search.</p>`;
            return;
        }

        results.innerHTML = hotels.map((hotel, hIndex) => {
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);
            const timeDiff = checkOutDate - checkInDate;
            const numberOfNights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            
            const availableRoomTypes = hotel.roomTypes.filter(roomType => {
                if (!roomType.roomInventories || roomType.roomInventories.length === 0) return true;
                return roomType.roomInventories.every(inventory => inventory.availableRooms > 0);
            });
            
            // <<< FIX START: Group room types by name to prevent duplicates >>>
            const uniqueRoomTypes = {};

            availableRoomTypes.forEach(roomType => {
                const minAvailableForThisEntry = (!roomType.roomInventories || roomType.roomInventories.length === 0)
                    ? Infinity // Represents unlimited availability if no inventory data
                    : Math.min(...roomType.roomInventories.map(inv => inv.availableRooms));

                if (!uniqueRoomTypes[roomType.name]) {
                    // First time seeing this room type name, add it
                    uniqueRoomTypes[roomType.name] = {
                        ...roomType, // Copy all properties from the first instance
                        totalAvailable: minAvailableForThisEntry
                    };
                } else {
                    // Room type already exists, aggregate the availability
                    if (uniqueRoomTypes[roomType.name].totalAvailable !== Infinity) {
                        uniqueRoomTypes[roomType.name].totalAvailable += minAvailableForThisEntry;
                    }
                }
            });

            const aggregatedRoomTypes = Object.values(uniqueRoomTypes);
            // <<< FIX END >>>

            if (aggregatedRoomTypes.length === 0) return '';
            
            // Loop over the new aggregated array
            return aggregatedRoomTypes.map((roomType) => {
                const totalPrice = roomType.base_Price * numberOfNights;
                
                let availabilityText;
                if (roomType.totalAvailable === Infinity) {
                    availabilityText = "Available";
                } else {
                    const minAvailableRooms = roomType.totalAvailable;
                    availabilityText = `${minAvailableRooms} room${minAvailableRooms > 1 ? 's' : ''} available`;
                }
                
                return `
                <div class="hotel-card row align-items-center mb-4 p-3 shadow-lg rounded-lg bg-white">
                    <div class="col-md-4 text-center">
                        ${hotel.thumbnail_url && hotel.thumbnail_url !== 'null' ? 
                            `<img src="img/${hotel.thumbnail_url}" alt="${hotel.name}" class="hotel-img img-fluid rounded shadow-sm">` : 
                            '<div class="no-image-placeholder p-4 bg-light rounded text-muted">No Image Available</div>'
                        }
                    </div>
                    <div class="col-md-8">
                        <div class="row">
                            <div class="col-md-8">
                                <h3 class="hotel-title mb-1">${hotel.name}</h3>
                                <p class="city text-muted mb-2"><i class="fas fa-map-marker-alt"></i> ${hotel.city}, ${hotel.address}</p>
                                <div class="room-info mb-3">
                                    <h5 class="room-type mb-1">${roomType.name} Room</h5>
                                    <p class="room-capacity mb-1"><i class="fas fa-users"></i> ${roomType.capacity}</p>
                                    <p class="room-description">${roomType.description || 'No description available'}</p>
                                </div>
                                <div class="booking-dates mb-2">
                                    <small class="text-muted"><i class="fas fa-calendar"></i> ${checkIn} to ${checkOut} (${numberOfNights} night${numberOfNights > 1 ? 's' : ''})</small>
                                </div>
                                <div class="availability-info mb-2">
                                    <small class="text-success"><i class="fas fa-check-circle"></i> ${availabilityText}</small>
                                </div>
                            </div>
                            <div class="col-md-4 text-right">
                                <div class="pricing mb-3">
                                    <p class="price-per-night mb-1"><small>Per night:</small><br><strong>$${roomType.base_Price}</strong></p>
                                    <p class="total-price mb-2"><small>Total (${numberOfNights} nights):</small><br><span class="h4 text-success"><strong>$${totalPrice}</strong></span></p>
                                </div>
                                <button class="btn btn-success btn-block book-hotel-btn" 
                                        data-hotel-index="${hIndex}"
                                        data-room-id="${roomType.id}">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }).join('');
        }).filter(Boolean).join("");
        
        if (results.innerHTML.trim() === "") {
             results.innerHTML = `
                <div class="no-availability-message p-4 bg-warning text-dark rounded">
                    <h4><i class="fas fa-exclamation-triangle"></i> No Available Rooms</h4>
                    <p>Sorry, there are no available rooms for your selected dates (${checkIn} to ${checkOut}).</p>
                    <p>Please try different dates or adjust your search criteria.</p>
                </div>
            `;
        }

        document.querySelectorAll(".book-hotel-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                
                const hIndex = e.currentTarget.getAttribute("data-hotel-index");
                const roomId = e.currentTarget.getAttribute("data-room-id");
                
                const hotel = hotels[hIndex];
                // Find the original roomType object to get accurate data for booking
                const roomType = hotel.roomTypes.find(rt => rt.id == roomId);
                
                if (!hotel || !roomType) {
                    console.error("Could not find hotel or room type for booking.");
                    alert("An error occurred. Please try again.");
                    return;
                }
                
                const checkInDate = new Date(checkIn);
                const checkOutDate = new Date(checkOut);
                const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
                const totalPrice = roomType.base_Price * numberOfNights;

                showBookingModal(hotel, roomType, checkIn, checkOut, numberOfNights, totalPrice);
            });
        });

    } catch (err) {
        console.error("Error fetching hotels:", err);
        results.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    } finally {
        isSearching = false;
        console.log("Search completed, guard reset");
    }
}

// =================== Event Listeners Setup ===================
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoaded event fired - setting up event listeners");
    
    // Set default dates
    setDefaultDates();
    
    // Add date validation event listeners
    const checkInInput = document.getElementById('in');
    const checkOutInput = document.getElementById('out');
    
    if (checkInInput) {
        checkInInput.addEventListener('change', onCheckInChange);
    }
    
    if (checkOutInput) {
        checkOutInput.addEventListener('change', onCheckOutChange);
    }
    
    const checkLoggedIn = () => {
        if (!localStorage.getItem("token")) {
            localStorage.setItem("redirectAfterLogin", "homepage.html");
            window.location = "login.html";
            return false;
        }
        return true;
    };

    const inputs = document.querySelectorAll(".form input, .form select");
    inputs.forEach(input => {
        input.addEventListener("focus", checkLoggedIn);
    });

    const form = document.querySelector('.form');
    if (form) {
        form.addEventListener('submit', function(e){
            e.preventDefault();  
            if (checkLoggedIn()) {
                if (validateDates()) {
                    saveBookingData();
                    searchHotels();
                }
            }
        });
    }

    // Check Availability Button
    const checkBtn = document.getElementById("check_btn");
    if (checkBtn) {
        checkBtn.addEventListener("click", function (e) {
            e.preventDefault();
            if (checkLoggedIn()) {
                if (validateDates()) {
                    saveBookingData(); 
                    searchHotels();
                }
            }
        });
    }
    
    // Set current year in footer
    const yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});