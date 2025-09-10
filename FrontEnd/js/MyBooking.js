// MyBooking.js

// API Base URL (غيريه حسب الباك إند عندك)
const API_URL = "https://localhost:7033/api/Bookings";

// استرجاع إيميل اليوزر اللي عامل login
const userEmail = localStorage.getItem("email");
const payload = localStorage.getItem("payload") ? JSON.parse(localStorage.getItem("payload")) : null;
const userId = payload ? (
  payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
  payload.sub ||
  payload.id ||
  payload.nameid
) : null;
// Fetch bookings الخاصة باليوزر
async function fetchBookings() {
  try {
    const authToken = localStorage.getItem("token");
    console.log("Token:", authToken ? "Present" : "Missing");
    console.log("Payload:", payload);
    console.log("User ID:", userId);
    console.log("User Email:", userEmail);
    
    if (!authToken) {
      console.error("No token found in localStorage");
      alert("You need to login to view your bookings.");
      window.location = "login.html";
      return [];
    }
    
    if (!userId) {
      console.error("No user ID found in localStorage");
      alert("You need to login to view your bookings.");
      window.location = "login.html";
      return [];
    }

    const headers = {
      "Content-Type": "application/json",
    };
    
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${API_URL}/get_booking_by_user_id${userId}`, {
      headers: headers
    });

    if (!res.ok) throw new Error("Failed to fetch bookings");

    return await res.json();
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return [];
  }
}

// Fetch hotel details by ID
async function fetchHotelDetails(hotelId) {
  try {
    const res = await fetch(`https://localhost:7033/api/Hotels/${hotelId}`);
    if (!res.ok) return { name: `Hotel ID: ${hotelId}` };
    const hotel = await res.json();
    return hotel;
  } catch (err) {
    console.error("Error fetching hotel details:", err);
    return { name: `Hotel ID: ${hotelId}` };
  }
}

// Fetch room type details by ID
async function fetchRoomTypeDetails(roomTypeId) {
  try {
    const res = await fetch(`https://localhost:7033/api/RoomTypes/${roomTypeId}`);
    if (!res.ok) return { name: `Room Type ID: ${roomTypeId}` };
    const roomType = await res.json();
    return roomType;
  } catch (err) {
    console.error("Error fetching room type details:", err);
    return { name: `Room Type ID: ${roomTypeId}` };
  }
}

// Render bookings في الجدول
async function renderBookings() {
  const tbody = document.getElementById("myBookingsTable");
  tbody.innerHTML = `<tr><td colspan="9">Loading...</td></tr>`;

  const bookings = await fetchBookings();

  if (!bookings || bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9">No bookings found.</td></tr>`;
    return;
  }

  // Fetch hotel and room type details for all bookings
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
    case 2: return 'bg-danger';  // REJECTED
    case 3: return 'bg-secondary'; // CANCELLED
    case 4: return 'bg-info';    // COMPLETED
    default: return 'bg-secondary';
  }
}

// Helper function to get status text
function getStatusText(status) {
  switch(status) {
    case 0: return 'Pending';
    case 1: return 'Confirmed';
    case 2: return 'Rejected';
    case 3: return 'Cancelled';
    case 4: return 'Completed';
    default: return 'Unknown';
  }
}

// Cancel booking → API Request
async function cancelBooking(id) {
  try {
    const authToken = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${API_URL}/${id}/status`, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify({ status: 3 }) // 3 = CANCELLED
    });

    if (!res.ok) throw new Error("Failed to cancel booking");

    alert("Booking cancelled successfully!");
    renderBookings(); // إعادة تحميل الجدول
  } catch (err) {
    console.error("Error cancelling booking:", err);
    alert("Error cancelling booking");
  }
}

// أول ما الصفحة تفتح
document.addEventListener("DOMContentLoaded", renderBookings);
