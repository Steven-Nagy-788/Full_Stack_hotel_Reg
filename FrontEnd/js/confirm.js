// homepage.js — save booking choices and go to confirm page
document.addEventListener('DOMContentLoaded', function () {
  const bookingForm = document.querySelector('.form'); // your booking form
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault(); // stop the form from reloading the page

    const checkIn = document.getElementById('in') ? document.getElementById('in').value : '';
    const checkOut = document.getElementById('out') ? document.getElementById('out').value : '';
    const guests = document.getElementById('Guests') ? document.getElementById('Guests').value : '';
    const rooms = document.getElementById('rooms') ? document.getElementById('rooms').value : '';
    const city = document.getElementById('city') ? document.getElementById('city').value : '';

    // Save all homepage booking data in one object
    const bookingData = {
      checkIn,
      checkOut,
      guests,
      rooms,
      city
    };

    localStorage.setItem('bookingData', JSON.stringify(bookingData));

    // Go to the confirmation page
    window.location.href = 'confirm.html';
  });
});
