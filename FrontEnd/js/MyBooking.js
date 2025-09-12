// MyBooking.js

// API Base URL
const API_URL = "https://localhost:7033/api";

// Helper function to decode JWT
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
        return null;
    }
}

// Get User ID from token in localStorage
function getUserId() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    const payload = parseJwt(token.replace(/^"(.*)"$/, '$1'));
    if (!payload) return null;
    
    // Look for the standard claim name for User ID
    return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
}

// Fetch bookings for the logged-in user
async function fetchBookings() {
  try {
    const authToken = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
    const userId = getUserId();
    
    if (!authToken || !userId) {
      alert("You need to be logged in to view your bookings.");
      window.location = "login.html";
      return [];
    }
    
    const res = await fetch(`${API_URL}/Bookings/get_booking_by_user_id${userId}`, {
      headers: {
        "Authorization": `Bearer ${authToken}`
      }
    });

    if (!res.ok) throw new Error(`Failed to fetch bookings. Status: ${res.status}`);

    return await res.json();
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return [];
  }
}

// Fetch hotel details by ID (CORRECTED ENDPOINT)
async function fetchHotelDetails(hotelId) {
  try {
    const res = await fetch(`${API_URL}/Hotel/${hotelId}`); // Corrected endpoint
    if (!res.ok) return { name: `Hotel ID: ${hotelId}` }; // Fallback
    const hotel = await res.json();
    return hotel;
  } catch (err) {
    console.error(`Error fetching hotel details for ID ${hotelId}:`, err);
    return { name: `Hotel ID: ${hotelId}` }; // Fallback
  }
}

// Fetch room type details by ID (CORRECTED ENDPOINT)
async function fetchRoomTypeDetails(roomTypeId) {
  try {
    // Corrected endpoint with URL encoding for the space
    const res = await fetch(`${API_URL}/RoomTypes/get%20room%20by%20id${roomTypeId}`); 
    if (!res.ok) return { name: `Room Type ID: ${roomTypeId}` }; // Fallback
    const roomType = await res.json();
    return roomType;
  } catch (err) {
    console.error(`Error fetching room type details for ID ${roomTypeId}:`, err);
    return { name: `Room Type ID: ${roomTypeId}` }; // Fallback
  }
}

// Render bookings in the table
async function renderBookings() {
  const tbody = document.getElementById("myBookingsTable");
  tbody.innerHTML = `<tr><td colspan="9" style="text-align: center;">Loading...</td></tr>`;

  const bookings = await fetchBookings();

  if (!bookings || bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center;">No bookings found.</td></tr>`;
    return;
  }

  // Fetch all details in parallel for better performance
  const bookingsWithDetails = await Promise.all(
    bookings.map(async (booking) => {
      const [hotel, roomType] = await Promise.all([
        fetchHotelDetails(booking.hotel_Id),
        fetchRoomTypeDetails(booking.roomType_Id)
      ]);
      
      return {
        ...booking,
        hotelName: hotel.name || `Hotel ID: ${booking.hotel_Id}`,
        roomTypeName: roomType.name || `Room Type ID: ${booking.roomType_Id}`
      };
    })
  );

  tbody.innerHTML = bookingsWithDetails.map(b => `
    <tr>
      <td>${b.id}</td>
      <td>${b.hotelName}</td>
      <td>${b.roomTypeName}</td>
      <td>${new Date(b.check_In).toLocaleDateString()}</td>
      <td>${new Date(b.check_Out).toLocaleDateString()}</td>
      <td>${b.nights} night${b.nights > 1 ? 's' : ''}</td>
      <td>$${b.total_Price}</td>
      <td>
        <span class="badge ${getStatusBadgeClass(b.status)}">
          ${getStatusText(b.status)}
        </span>
      </td>
      <td>
        ${b.status === 0 ? `<button class="btn btn-danger btn-sm" onclick="cancelBooking(${b.id})"><i class="fa-solid fa-xmark"></i> Cancel</button>` : ""}
      </td>
    </tr>
  `).join("");
}

// Helper function to get status badge class
function getStatusBadgeClass(status) {
  switch(status) {
    case 0: return 'bg-warning'; // PENDING
    case 1: return 'bg-success'; // CONFIRMED  
    case 2: return 'bg-danger';  // REJECTED/CANCELLED
    default: return 'bg-secondary';
  }
}

// Helper function to get status text
function getStatusText(status) {
  switch(status) {
    case 0: return 'Pending';
    case 1: return 'Confirmed';
    case 2: return 'Cancelled'; // Assuming 2 is Cancelled based on your admin panel
    default: return 'Unknown';
  }
}

// Cancel booking API Request
async function cancelBooking(id) {
    if (!confirm("Are you sure you want to cancel this booking?")) {
        return;
    }

    try {
        const authToken = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
        if (!authToken) {
            alert("Your session has expired. Please log in again.");
            return;
        }

        const res = await fetch(`${API_URL}/Bookings/${id}`, { // Assuming DELETE is used for cancellation
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${authToken}`
            },
        });

        if (!res.ok) throw new Error("Failed to cancel booking");

        alert("Booking cancelled successfully!");
        renderBookings();
    } catch (err) {
        console.error("Error cancelling booking:", err);
        alert("Error cancelling booking");
    }
}

// Run when the page loads
document.addEventListener("DOMContentLoaded", renderBookings);