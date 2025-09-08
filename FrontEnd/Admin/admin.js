// ---------------- Initial Data ----------------
let hotelsData = [
  {id:1,name:"Hilton Cairo",city:"Cairo"},
  {id:2,name:"Four Seasons",city:"Alexandria"},
  {id:3,name:"Marriott",city:"Giza"}
];
let roomsData = [
  {id:1,hotelId:1,type:"Deluxe",price:120},
  {id:2,hotelId:2,type:"Suite",price:250},
  {id:3,hotelId:3,type:"Standard",price:90}
];
let bookingsData = [
  {id:1,user:"Ahmed",phone:"01012345678",email:"ahmed@test.com",hotelId:1,roomId:1,checkIn:"2025-09-10",checkOut:"2025-09-12",status:"Pending"},
  {id:2,user:"Sara",phone:"01198765432",email:"sara@test.com",hotelId:2,roomId:2,checkIn:"2025-09-15",checkOut:"2025-09-18",status:"Pending"},
  {id:3,user:"Omar",phone:"01255555555",email:"omar@test.com",hotelId:3,roomId:3,checkIn:"2025-09-20",checkOut:"2025-09-22",status:"Confirmed"}
];

let inventoryData = [
  {id:1,hotelId:1,roomId:1,fromDate:"2025-09-10",toDate:"2025-09-20",available:5},
  {id:2,hotelId:2,roomId:2,fromDate:"2025-09-15",toDate:"2025-09-25",available:2}
];
let usersData = [
  {id:1, name:"Admin", email:"admin@test.com", role:1, password:"admin123"},
  {id:2, name:"Ahmed", email:"ahmed@test.com", role:0, password:"ahmed123"},
  {id:3, name:"Sara", email:"sara@test.com", role:0, password:"sara123"}
];



// Helpers
function getHotelName(id){ let h=hotelsData.find(h=>h.id==id); return h?h.name:"Unknown"; }
function getRoomType(id){ let r=roomsData.find(r=>r.id==id); return r?r.type:"N/A"; }

// ---------------- Hotels ----------------
function renderHotels(){
  return `<h2><i class="fa-solid fa-hotel"></i> Hotels</h2>
    <button class="btn btn-primary mb-2" onclick="openHotelForm()"><i class="fa-solid fa-plus"></i> Add Hotel</button>
    <table class="table table-striped"><thead>
    <tr><th>ID</th><th>Name</th><th>City</th><th>Actions</th></tr></thead>
    <tbody>${hotelsData.map(h=>`<tr><td>${h.id}</td><td>${h.name}</td><td>${h.city}</td>
    <td><button class="btn btn-warning btn-sm" onclick="openHotelForm(${h.id})"><i class="fa-solid fa-pen"></i></button>
    <button class="btn btn-danger btn-sm" onclick="deleteHotel(${h.id})"><i class="fa-solid fa-trash"></i></button></td></tr>`).join("")}</tbody></table>`;
}
function openHotelForm(id=""){
  let h=id?hotelsData.find(h=>h.id==id):{name:"",city:""};
  document.getElementById("modalTitle").innerText=id?"Edit Hotel":"Add Hotel";
  document.getElementById("modalBody").innerHTML=`
    <input type="hidden" id="hotelId" value="${id}">
    <div class="mb-3"><label>Name</label><input class="form-control" id="hotelName" value="${h.name}"></div>
    <div class="mb-3"><label>City</label><input class="form-control" id="hotelCity" value="${h.city}"></div>`;
  document.getElementById("modalSave").onclick=saveHotel;
  new bootstrap.Modal(document.getElementById("mainModal")).show();
}
function saveHotel(){
  let id=document.getElementById("hotelId").value;
  let name=document.getElementById("hotelName").value;
  let city=document.getElementById("hotelCity").value;
  if(id){let h=hotelsData.find(h=>h.id==id);h.name=name;h.city=city;}
  else{hotelsData.push({id:hotelsData.length+1,name,city});}
  bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
  loadPage("hotels");
}
function deleteHotel(id){ hotelsData=hotelsData.filter(h=>h.id!=id); loadPage("hotels"); }

// ---------------- Rooms ----------------
function renderRooms(){
  return `<h2><i class="fa-solid fa-bed"></i> Rooms</h2>
    <button class="btn btn-primary mb-2" onclick="openRoomForm()"><i class="fa-solid fa-plus"></i> Add Room</button>
    <table class="table table-striped"><thead>
    <tr><th>ID</th><th>Hotel</th><th>Type</th><th>Price</th><th>Actions</th></tr></thead>
    <tbody>${roomsData.map(r=>`<tr><td>${r.id}</td><td>${getHotelName(r.hotelId)}</td><td>${r.type}</td><td>${r.price}$</td>
    <td><button class="btn btn-warning btn-sm" onclick="openRoomForm(${r.id})"><i class="fa-solid fa-pen"></i></button>
    <button class="btn btn-danger btn-sm" onclick="deleteRoom(${r.id})"><i class="fa-solid fa-trash"></i></button></td></tr>`).join("")}</tbody></table>`;
}
function openRoomForm(id=""){
  let r=id?roomsData.find(r=>r.id==id):{hotelId:"",type:"",price:""};
  let hotelOptions=hotelsData.map(h=>`<option value="${h.id}" ${r.hotelId==h.id?"selected":""}>${h.name}</option>`).join("");
  document.getElementById("modalTitle").innerText=id?"Edit Room":"Add Room";
  document.getElementById("modalBody").innerHTML=`
    <input type="hidden" id="roomId" value="${id}">
    <div class="mb-3"><label>Hotel</label><select class="form-control" id="roomHotel">${hotelOptions}</select></div>
    <div class="mb-3"><label>Type</label><input class="form-control" id="roomType" value="${r.type}"></div>
    <div class="mb-3"><label>Price</label><input type="number" class="form-control" id="roomPrice" value="${r.price}"></div>`;
  document.getElementById("modalSave").onclick=saveRoom;
  new bootstrap.Modal(document.getElementById("mainModal")).show();
}
function saveRoom(){
  let id=document.getElementById("roomId").value;
  let hotelId=parseInt(document.getElementById("roomHotel").value);
  let type=document.getElementById("roomType").value;
  let price=parseFloat(document.getElementById("roomPrice").value);
  if(id){let r=roomsData.find(r=>r.id==id);r.hotelId=hotelId;r.type=type;r.price=price;}
  else{roomsData.push({id:roomsData.length+1,hotelId,type,price});}
  bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
  loadPage("rooms");
}
function deleteRoom(id){ roomsData=roomsData.filter(r=>r.id!=id); loadPage("rooms"); }

// ---------------- Inventory ----------------
function renderInventory(){
  return `<h2><i class="fa-solid fa-box"></i> Inventory</h2>
    <button class="btn btn-primary mb-2" onclick="openInventoryForm()"><i class="fa-solid fa-plus"></i> Add Inventory</button>
    <table class="table table-striped"><thead>
    <tr><th>ID</th><th>Hotel</th><th>Room</th><th>From</th><th>To</th><th>Available</th><th>Actions</th></tr></thead>
    <tbody>${inventoryData.map(i=>`<tr><td>${i.id}</td><td>${getHotelName(i.hotelId)}</td><td>${getRoomType(i.roomId)}</td><td>${i.fromDate}</td><td>${i.toDate}</td><td>${i.available}</td>
    <td><button class="btn btn-warning btn-sm" onclick="openInventoryForm(${i.id})"><i class="fa-solid fa-pen"></i></button>
    <button class="btn btn-danger btn-sm" onclick="deleteInventory(${i.id})"><i class="fa-solid fa-trash"></i></button></td></tr>`).join("")}</tbody></table>`;
}

function openInventoryForm(id=""){
  let inv=id?inventoryData.find(i=>i.id==id):{hotelId:"",roomId:"",fromDate:"",toDate:"",available:""};
  let hotelOptions=hotelsData.map(h=>`<option value="${h.id}" ${inv.hotelId==h.id?"selected":""}>${h.name}</option>`).join("");
  let roomOptions=roomsData.map(r=>`<option value="${r.id}" ${inv.roomId==r.id?"selected":""}>${r.type}</option>`).join("");
  document.getElementById("modalTitle").innerText=id?"Edit Inventory":"Add Inventory";
  document.getElementById("modalBody").innerHTML=`
    <input type="hidden" id="inventoryId" value="${id}">
    <div class="mb-3"><label>Hotel</label><select class="form-control" id="inventoryHotel">${hotelOptions}</select></div>
    <div class="mb-3"><label>Room</label><select class="form-control" id="inventoryRoom">${roomOptions}</select></div>
    <div class="mb-3"><label>From</label><input type="date" class="form-control" id="inventoryFrom" value="${inv.fromDate}"></div>
    <div class="mb-3"><label>To</label><input type="date" class="form-control" id="inventoryTo" value="${inv.toDate}"></div>
    <div class="mb-3"><label>Available</label><input type="number" class="form-control" id="inventoryAvailable" value="${inv.available}"></div>`;
  document.getElementById("modalSave").onclick=saveInventory;
  new bootstrap.Modal(document.getElementById("mainModal")).show();
}

function saveInventory(){
  let id=document.getElementById("inventoryId").value;
  let hotelId=parseInt(document.getElementById("inventoryHotel").value);
  let roomId=parseInt(document.getElementById("inventoryRoom").value);
  let fromDate=document.getElementById("inventoryFrom").value;
  let toDate=document.getElementById("inventoryTo").value;
  let available=parseInt(document.getElementById("inventoryAvailable").value);
  if(id){let i=inventoryData.find(i=>i.id==id);i.hotelId=hotelId;i.roomId=roomId;i.fromDate=fromDate;i.toDate=toDate;i.available=available;}
  else{inventoryData.push({id:inventoryData.length+1,hotelId,roomId,fromDate,toDate,available});}
  bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
  loadPage("inventory");
}

function deleteInventory(id){ inventoryData=inventoryData.filter(i=>i.id!=id); loadPage("inventory"); }

// ---------------- Dashboard & Bookings ----------------
function renderDashboard(){
  return `<h2><i class="fa-solid fa-chart-line"></i> Dashboard (Pending)</h2>
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Hotel</th>
            <th>Room</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${bookingsData.filter(b=>b.status=="Pending").map(b=>`
            <tr>
              <td>${b.id}</td>
              <td>${b.user}</td>
              <td>${b.phone}</td>
              <td>${b.email}</td>
              <td>${getHotelName(b.hotelId)}</td>
              <td>${getRoomType(b.roomId)}</td>
              <td>${b.checkIn}</td>
              <td>${b.checkOut}</td>
              <td><span class="badge bg-warning">${b.status}</span></td>
              <td>
                <button class="btn btn-success btn-sm" onclick="confirmBooking(${b.id})"><i class="fa-solid fa-check"></i></button>
                <button class="btn btn-danger btn-sm" onclick="rejectBooking(${b.id})"><i class="fa-solid fa-xmark"></i></button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>`
}


function renderBookings(){
  return `<h2><i class="fa-solid fa-calendar-check"></i> All Bookings</h2>
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Hotel</th>
            <th>Room</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${bookingsData.map(b=>`
            <tr>
              <td>${b.id}</td>
              <td>${b.user}</td>
              <td>${b.phone}</td>
              <td>${b.email}</td>
              <td>${getHotelName(b.hotelId)}</td>
              <td>${getRoomType(b.roomId)}</td>
              <td>${b.checkIn}</td>
              <td>${b.checkOut}</td>
              <td><span class="badge ${b.status=="Pending"?"bg-warning":b.status=="Confirmed"?"bg-success":"bg-danger"}">${b.status}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>`
}
function renderUsers(){
  return `<h2><i class="fa-solid fa-users"></i> Users</h2>
    <button class="btn btn-primary mb-2" onclick="openUserForm()"><i class="fa-solid fa-plus"></i> Add User</button>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${usersData.map(u=>`
            <tr>
              <td>${u.id}</td>
              <td>${u.name}</td>
              <td>${u.email}</td>
              <td>${u.role==1?"Admin":"User"}</td>
              <td>
                <button class="btn btn-warning btn-sm" onclick="openUserForm(${u.id})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})"><i class="fa-solid fa-trash"></i></button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>`
}


function openUserForm(id=""){
  let u = id ? usersData.find(u=>u.id==id) : {name:"",email:"",role:0,password:""};
  document.getElementById("modalTitle").innerText = id ? "Edit User" : "Add User";
  document.getElementById("modalBody").innerHTML = `
    <input type="hidden" id="userId" value="${id}">
    <div class="mb-3"><label>Name</label><input class="form-control" id="userName" value="${u.name}"></div>
    <div class="mb-3"><label>Email</label><input type="email" class="form-control" id="userEmail" value="${u.email}"></div>
    <div class="mb-3"><label>Password</label><input type="password" class="form-control" id="userPassword" value="${u.password}"></div>
    <div class="mb-3"><label>Role</label>
      <select class="form-control" id="userRole">
        <option value="0" ${u.role==0?"selected":""}>User</option>
        <option value="1" ${u.role==1?"selected":""}>Admin</option>
      </select>
    </div>`;
  document.getElementById("modalSave").onclick = saveUser;
  new bootstrap.Modal(document.getElementById("mainModal")).show();
}


function saveUser(){
  let id = document.getElementById("userId").value;
  let name = document.getElementById("userName").value;
  let email = document.getElementById("userEmail").value;
  let password = document.getElementById("userPassword").value;
  let role = parseInt(document.getElementById("userRole").value);

  if(id){
    let u = usersData.find(u=>u.id==id);
    u.name = name; 
    u.email = email; 
    u.password = password; 
    u.role = role;
  } else {
    usersData.push({id: usersData.length+1, name, email, role, password});
  }

  bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
  loadPage("users");
}


function deleteUser(id){
  usersData = usersData.filter(u=>u.id!=id);
  loadPage("users");
}



function confirmBooking(id){let b=bookingsData.find(b=>b.id==id);b.status="Confirmed";loadPage("dashboard");}
function rejectBooking(id){let b=bookingsData.find(b=>b.id==id);b.status="Rejected";loadPage("dashboard");}

// ---------------- Router ----------------
function loadPage(page){
  let content=document.getElementById('content');
  if(page==="dashboard") content.innerHTML=renderDashboard();
  else if(page==="hotels") content.innerHTML=renderHotels();
  else if(page==="rooms") content.innerHTML=renderRooms();
  else if(page==="inventory") content.innerHTML=renderInventory();
  else if(page==="bookings") content.innerHTML=renderBookings();
  else if(page==="users") content.innerHTML=renderUsers();

}
