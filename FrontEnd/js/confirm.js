document.addEventListener('DOMContentLoaded', function () {
  // Try to get booking data from localStorage
  const storedData = localStorage.getItem('bookingData');
  if (!storedData) {
    alert("No booking data found. Please start again.");
    window.location.href = "homepage.html"; // send back if missing
    return;
  }

  const bookingData = JSON.parse(storedData);

  // Pre-fill the form fields
  if (bookingData.fullName) document.getElementById("fullName").value = bookingData.fullName;
  if (bookingData.email) document.getElementById("email").value = bookingData.email;
  if (bookingData.phone) document.getElementById("phone").value = bookingData.phone;

  if (bookingData.checkIn) document.getElementById("checkin").value = bookingData.checkIn;
  if (bookingData.checkOut) document.getElementById("checkout").value = bookingData.checkOut;
  if (bookingData.guests) document.getElementById("guests").value = bookingData.guests;
  if (bookingData.rooms) document.getElementById("rooms").value = bookingData.rooms;

  // Just in case you also want city displayed later
  if (bookingData.city) {
    console.log("Selected city:", bookingData.city);
  }

  // Handle confirm submit
  document.getElementById("confirmForm").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Booking confirmed! (Next: send to backend)");
    
    // Optional: clear storage so old data doesn’t stick
    localStorage.removeItem('bookingData');
  });
});

