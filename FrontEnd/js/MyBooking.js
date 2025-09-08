let myBookings = [
      {id:1, hotel:"Hilton Cairo", room:"Deluxe", checkin:"2025-09-10", checkout:"2025-09-15", status:"Pending"},
      {id:2, hotel:"Four Seasons", room:"Suite", checkin:"2025-09-20", checkout:"2025-09-25", status:"Confirmed"},
      {id:3, hotel:"Marriott", room:"Standard", checkin:"2025-08-01", checkout:"2025-08-05", status:"Rejected"}
    ];

    function renderBookings(){
      let tbody = document.getElementById("myBookingsTable");
      tbody.innerHTML = myBookings.map(b=>`
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

    function cancelBooking(id){
      let booking = myBookings.find(b=>b.id==id);
      if(booking){ booking.status="Cancelled"; renderBookings(); }
    }

    renderBookings();
