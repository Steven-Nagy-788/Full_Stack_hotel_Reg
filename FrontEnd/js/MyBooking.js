// MyBooking.js

// API Base URL (غيريه حسب الباك إند عندك)
const API_URL = "http://localhost:5000/api/bookings";

// استرجاع إيميل اليوزر اللي عامل login
const userEmail = localStorage.getItem("email");

// Fetch bookings الخاصة باليوزر
async function fetchBookings() {
  try {
    if (!userEmail) {
      alert("You need to login to view your bookings.");
      window.location = "login.html";
      return [];
    }

    const res = await fetch(`${API_URL}?email=${encodeURIComponent(userEmail)}`, {
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!res.ok) throw new Error("Failed to fetch bookings");

    return await res.json();
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return [];
  }
}

// Render bookings في الجدول
async function renderBookings() {
  const tbody = document.getElementById("myBookingsTable");
  tbody.innerHTML = `<tr><td colspan="7">Loading...</td></tr>`;

  const bookings = await fetchBookings();

  if (!bookings || bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">No bookings found.</td></tr>`;
    return;
  }

  tbody.innerHTML = bookings.map(b => `
    <tr>
      <td>${b.id}</td>
      <td>${b.hotel}</td>
      <td>${b.room}</td>
      <td>${b.checkin}</td>
      <td>${b.checkout}</td>
      <td>
        <span class="badge ${b.status=="Pending"?"bg-warning":b.status=="Confirmed"?"bg-success":"bg-danger"}">
          ${b.status}
        </span>
      </td>
      <td>
        ${b.status=="Pending" ? `<button class="btn btn-danger btn-sm" onclick="cancelBooking(${b.id})"><i class="fa-solid fa-xmark"></i> Cancel</button>` : ""}
      </td>
    </tr>
  `).join("");
}

// Cancel booking → API Request
async function cancelBooking(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT", // أو DELETE حسب الباك إند
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Cancelled" })
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
