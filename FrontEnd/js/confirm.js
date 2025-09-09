 // confirm.js
document.addEventListener("DOMContentLoaded", function () {
  const bookingDataStr = localStorage.getItem("bookingData");
  if (bookingDataStr) {
    const bookingData = JSON.parse(bookingDataStr);
    document.getElementById("checkin").value = bookingData.checkIn || "";
    document.getElementById("checkout").value = bookingData.checkOut || "";
    document.getElementById("guests").value = bookingData.guests || "";
    document.getElementById("rooms").value = bookingData.rooms || "";
    document.getElementById("city").value = bookingData.city || "";
  }
});

    const form = document.getElementById("confirmForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const checkIn = document.getElementById("checkin").value;
        const checkOut = document.getElementById("checkout").value;
        const guests = document.getElementById("guests").value;
        const rooms = document.getElementById("rooms").value;
        const city = document.getElementById("city").value;

        if (!username || !email || !phone || !checkIn || !checkOut) {
            alert("⚠️ Please fill in all required fields.");
            return;
        }

        // Save confirmed booking (optional)
        const confirmedBooking = {
            username,
            email,
            phone,
            checkIn,
            checkOut,
            guests,
            rooms,
            city
        };
        localStorage.setItem("confirmedBooking", JSON.stringify(confirmedBooking));

        // Simple confirmation
        alert(`✅ Booking confirmed for ${username} in ${city}!`);
    });
  