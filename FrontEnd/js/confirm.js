// confirm.js
document.addEventListener("DOMContentLoaded", function () {
    // Get booking data from localStorage
    const bookingData = JSON.parse(localStorage.getItem("bookingData"));

    if (bookingData) {
        // Fill form with booking data
        document.getElementById("checkin").value = bookingData.checkIn || "";
        document.getElementById("checkout").value = bookingData.checkOut || "";
        document.getElementById("guests").value = bookingData.guests || "";
        document.getElementById("rooms").value = bookingData.rooms || "";
        document.getElementById("city").value = bookingData.city || "";
    }

    const form = document.getElementById("confirmForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const checkIn = document.getElementById("checkin").value;
        const checkOut = document.getElementById("checkout").value;
        const guests = document.getElementById("guests").value;
        const rooms = document.getElementById("rooms").value;
        const city = document.getElementById("city").value;

        if (!fullName || !email || !phone || !checkIn || !checkOut) {
            alert("⚠️ Please fill in all required fields.");
            return;
        }

        // Save confirmed booking (optional)
        const confirmedBooking = {
            fullName,
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
        alert(`✅ Booking confirmed for ${fullName} in ${city}!`);
    });
});
