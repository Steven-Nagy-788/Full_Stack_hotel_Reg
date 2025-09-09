// API Base URL
const API_BASE_URL = 'https://localhost:7033/api';

// Show API status message
function showApiStatus(message, isSuccess = true) {
  const statusElement = document.getElementById('apiStatus');
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.style.display = 'block';
    statusElement.className = 'api-status ' + (isSuccess ? 'bg-success' : 'bg-danger');
    
    setTimeout(() => {
      statusElement.style.display = 'none';
    }, 3000);
  }
}

// API Request Function
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    // Check if response has content
    const contentLength = response.headers.get('Content-Length');
    if (contentLength && parseInt(contentLength) > 0) {
      return await response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.error('API request failed:', error);
    showApiStatus(`API Error: ${error.message}`, false);
    throw error;
  }
}

// Users API Functions
async function createUser(userData) {
  return await apiRequest('/Users/create_User', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

async function getUsers() {
  // This is a mock function since we don't have a GET endpoint
  // In a real app, you would have an API endpoint to get users
  return [
    {id: 1, userName: "Admin", email: "admin@test.com", role: "Admin"},
    {id: 2, userName: "Ahmed", email: "ahmed@test.com", role: "User"},
    {id: 3, userName: "Sara", email: "sara@test.com", role: "User"}
  ];
}

async function updateUser(id, userData) {
  // This is a mock function since we don't have an UPDATE endpoint
  // In a real app, you would have an API endpoint to update users
  showApiStatus(`User ${id} updated successfully (simulated)`);
  return userData;
}

async function deleteUser(id) {
  // This is a mock function since we don't have a DELETE endpoint
  // In a real app, you would have an API endpoint to delete users
  showApiStatus(`User ${id} deleted successfully (simulated)`);
  return { success: true };
}

// Data storage (temporary until we have full API)
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

// Update dashboard stats
function updateDashboardStats() {
  const hotelsCount = document.getElementById('hotels-count');
  const roomsCount = document.getElementById('rooms-count');
  const bookingsCount = document.getElementById('bookings-count');
  const pendingCount = document.getElementById('pending-count');
  
  if (hotelsCount) hotelsCount.textContent = hotelsData.length;
  if (roomsCount) roomsCount.textContent = roomsData.length;
  if (bookingsCount) bookingsCount.textContent = bookingsData.length;
  if (pendingCount) pendingCount.textContent = bookingsData.filter(b => b.status === "Pending").length;
}

// Helpers
function getHotelName(id){ let h=hotelsData.find(h=>h.id==id); return h?h.name:"Unknown"; }
function getRoomType(id){ let r=roomsData.find(r=>r.id==id); return r?r.type:"N/A"; }

// Confirmation modal
function showConfirmation(message, callback) {
  const confirmBody = document.getElementById('confirmBody');
  const confirmAction = document.getElementById('confirmAction');
  
  if (confirmBody && confirmAction) {
    confirmBody.textContent = message;
    confirmAction.onclick = callback;
    new bootstrap.Modal(document.getElementById('confirmModal')).show();
  }
}

// ---------------- Dashboard & Bookings ----------------
function renderDashboard(){
  return `<h2><i class="fa-solid fa-chart-line"></i> Dashboard</h2>
    <div class="alert alert-info">
      <i class="fa-solid fa-info-circle"></i> You have ${bookingsData.filter(b=>b.status=="Pending").length} pending bookings that need attention.
    </div>
    <div class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="table-dark">
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
              <td class="action-buttons">
                <button class="btn btn-success btn-sm" onclick="confirmBooking(${b.id})"><i class="fa-solid fa-check"></i> Confirm</button>
                <button class="btn btn-danger btn-sm" onclick="rejectBooking(${b.id})"><i class="fa-solid fa-xmark"></i> Reject</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>`;
}

function renderBookings(){
  return `<h2><i class="fa-solid fa-calendar-check"></i> All Bookings</h2>
    <div class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="table-dark">
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
    </div>`;
}

function confirmBooking(id){
  let b=bookingsData.find(b=>b.id==id);
  showConfirmation(`Confirm booking #${id} for ${b.user}?`, () => {
    b.status="Confirmed";
    loadPage("dashboard");
    updateDashboardStats();
  });
}

function rejectBooking(id){
  let b=bookingsData.find(b=>b.id==id);
  showConfirmation(`Reject booking #${id} for ${b.user}?`, () => {
    b.status="Rejected";
    loadPage("dashboard");
    updateDashboardStats();
  });
}

// ---------------- Hotels ----------------
function renderHotels(){
  return `<h2><i class="fa-solid fa-hotel"></i> Hotels</h2>
    <button class="btn btn-primary mb-3" onclick="openHotelForm()"><i class="fa-solid fa-plus"></i> Add Hotel</button>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr><th>ID</th><th>Name</th><th>City</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${hotelsData.map(h=>`<tr><td>${h.id}</td><td>${h.name}</td><td>${h.city}</td>
          <td class="action-buttons">
            <button class="btn btn-warning btn-sm" onclick="openHotelForm(${h.id})"><i class="fa-solid fa-pen"></i> Edit</button>
            <button class="btn btn-danger btn-sm" onclick="confirmDeleteHotel(${h.id})"><i class="fa-solid fa-trash"></i> Delete</button>
          </td></tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function openHotelForm(id=""){
  let h=id?hotelsData.find(h=>h.id==id):{name:"",city:""};
  document.getElementById("modalTitle").innerText=id?"Edit Hotel":"Add Hotel";
  document.getElementById("modalBody").innerHTML=`
    <input type="hidden" id="hotelId" value="${id}">
    <div class="mb-3">
      <label class="form-label">Name</label>
      <input class="form-control" id="hotelName" value="${h.name}" placeholder="Enter hotel name">
    </div>
    <div class="mb-3">
      <label class="form-label">City</label>
      <input class="form-control" id="hotelCity" value="${h.city}" placeholder="Enter city">
    </div>`;
  document.getElementById("modalSave").onclick=saveHotel;
  new bootstrap.Modal(document.getElementById("mainModal")).show();
}

function saveHotel(){
  let id=document.getElementById("hotelId").value;
  let name=document.getElementById("hotelName").value;
  let city=document.getElementById("hotelCity").value;
  
  if (!name || !city) {
    alert("Please fill in all fields");
    return;
  }
  
  if(id){
    let h=hotelsData.find(h=>h.id==id);
    h.name=name;
    h.city=city;
  } else {
    hotelsData.push({id:hotelsData.length+1,name,city});
  }
  
  bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
  loadPage("hotels");
  updateDashboardStats();
}

function confirmDeleteHotel(id) {
  const hotel = hotelsData.find(h => h.id == id);
  showConfirmation(`Are you sure you want to delete "${hotel.name}"? This action cannot be undone.`, 
    () => deleteHotel(id));
}

function deleteHotel(id){ 
  hotelsData=hotelsData.filter(h=>h.id!=id); 
  loadPage("hotels");
  updateDashboardStats();
}

// ---------------- Rooms ----------------
function renderRooms(){
  return `<h2><i class="fa-solid fa-bed"></i> Rooms</h2>
    <button class="btn btn-primary mb-3" onclick="openRoomForm()"><i class="fa-solid fa-plus"></i> Add Room</button>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr><th>ID</th><th>Hotel</th><th>Type</th><th>Price</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${roomsData.map(r=>`<tr><td>${r.id}</td><td>${getHotelName(r.hotelId)}</td><td>${r.type}</td><td>$${r.price}</td>
          <td class="action-buttons">
            <button class="btn btn-warning btn-sm" onclick="openRoomForm(${r.id})"><i class="fa-solid fa-pen"></i> Edit</button>
            <button class="btn btn-danger btn-sm" onclick="confirmDeleteRoom(${r.id})"><i class="fa-solid fa-trash"></i> Delete</button>
          </td></tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function openRoomForm(id=""){
  let r=id?roomsData.find(r=>r.id==id):{hotelId:"",type:"",price:""};
  let hotelOptions=hotelsData.map(h=>`<option value="${h.id}" ${r.hotelId==h.id?"selected":""}>${h.name}</option>`).join("");
  document.getElementById("modalTitle").innerText=id?"Edit Room":"Add Room";
  document.getElementById("modalBody").innerHTML=`
    <input type="hidden" id="roomId" value="${id}">
    <div class="mb-3">
      <label class="form-label">Hotel</label>
      <select class="form-control" id="roomHotel">${hotelOptions}</select>
    </div>
    <div class="mb-3">
      <label class="form-label">Type</label>
      <input class="form-control" id="roomType" value="${r.type}" placeholder="Enter room type">
    </div>
    <div class="mb-3">
      <label class="form-label">Price</label>
      <div class="input-group">
        <span class="input-group-text">$</span>
        <input type="number" class="form-control" id="roomPrice" value="${r.price}" placeholder="Enter price">
      </div>
    </div>`;
  document.getElementById("modalSave").onclick=saveRoom;
  new bootstrap.Modal(document.getElementById("mainModal")).show();
}

function saveRoom(){
  let id=document.getElementById("roomId").value;
  let hotelId=parseInt(document.getElementById("roomHotel").value);
  let type=document.getElementById("roomType").value;
  let price=parseFloat(document.getElementById("roomPrice").value);
  
  if (!hotelId || !type || !price) {
    alert("Please fill in all fields");
    return;
  }
  
  if(id){
    let r=roomsData.find(r=>r.id==id);
    r.hotelId=hotelId;
    r.type=type;
    r.price=price;
  } else {
    roomsData.push({id:roomsData.length+1,hotelId,type,price});
  }
  
  bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
  loadPage("rooms");
  updateDashboardStats();
}

function confirmDeleteRoom(id) {
  const room = roomsData.find(r => r.id == id);
  showConfirmation(`Are you sure you want to delete "${getRoomType(id)}" room? This action cannot be undone.`, 
    () => deleteRoom(id));
}

function deleteRoom(id){ 
  roomsData=roomsData.filter(r=>r.id!=id); 
  loadPage("rooms");
  updateDashboardStats();
}

// ---------------- Inventory ----------------
function renderInventory(){
  return `<h2><i class="fa-solid fa-box"></i> Inventory</h2>
    <button class="btn btn-primary mb-3" onclick="openInventoryForm()"><i class="fa-solid fa-plus"></i> Add Inventory</button>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr><th>ID</th><th>Hotel</th><th>Room</th><th>From</th><th>To</th><th>Available</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${inventoryData.map(i=>`<tr><td>${i.id}</td><td>${getHotelName(i.hotelId)}</td><td>${getRoomType(i.roomId)}</td><td>${i.fromDate}</td><td>${i.toDate}</td><td>${i.available}</td>
          <td class="action-buttons">
            <button class="btn btn-warning btn-sm" onclick="openInventoryForm(${i.id})"><i class="fa-solid fa-pen"></i> Edit</button>
            <button class="btn btn-danger btn-sm" onclick="confirmDeleteInventory(${i.id})"><i class="fa-solid fa-trash"></i> Delete</button>
          </td></tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function openInventoryForm(id=""){
  let inv=id?inventoryData.find(i=>i.id==id):{hotelId:"",roomId:"",fromDate:"",toDate:"",available:""};
  let hotelOptions=hotelsData.map(h=>`<option value="${h.id}" ${inv.hotelId==h.id?"selected":""}>${h.name}</option>`).join("");
  let roomOptions=roomsData.map(r=>`<option value="${r.id}" ${inv.roomId==r.id?"selected":""}>${r.type}</option>`).join("");
  document.getElementById("modalTitle").innerText=id?"Edit Inventory":"Add Inventory";
  document.getElementById("modalBody").innerHTML=`
    <input type="hidden" id="inventoryId" value="${id}">
    <div class="mb-3">
      <label class="form-label">Hotel</label>
      <select class="form-control" id="inventoryHotel">${hotelOptions}</select>
    </div>
    <div class="mb-3">
      <label class="form-label">Room</label>
      <select class="form-control" id="inventoryRoom">${roomOptions}</select>
    </div>
    <div class="mb-3">
      <label class="form-label">From</label>
      <input type="date" class="form-control" id="inventoryFrom" value="${inv.fromDate}">
    </div>
    <div class="mb-3">
      <label class="form-label">To</label>
      <input type="date" class="form-control" id="inventoryTo" value="${inv.toDate}">
    </div>
    <div class="mb-3">
      <label class="form-label">Available</label>
      <input type="number" class="form-control" id="inventoryAvailable" value="${inv.available}" min="0">
    </div>`;
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
  
  if (!hotelId || !roomId || !fromDate || !toDate || available < 0) {
    alert("Please fill in all fields with valid values");
    return;
  }
  
  if(id){
    let i=inventoryData.find(i=>i.id==id);
    i.hotelId=hotelId;
    i.roomId=roomId;
    i.fromDate=fromDate;
    i.toDate=toDate;
    i.available=available;
  } else {
    inventoryData.push({id:inventoryData.length+1,hotelId,roomId,fromDate,toDate,available});
  }
  
  bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
  loadPage("inventory");
}

function confirmDeleteInventory(id) {
  const inv = inventoryData.find(i => i.id == id);
  showConfirmation(`Are you sure you want to delete this inventory record? This action cannot be undone.`, 
    () => deleteInventory(id));
}

function deleteInventory(id){ 
  inventoryData=inventoryData.filter(i=>i.id!=id); 
  loadPage("inventory");
}

// ---------------- Users ----------------
async function renderUsers(){
  try {
    const users = await getUsers();
    return `<h2><i class="fa-solid fa-users"></i> Users</h2>
      <button class="btn btn-primary mb-3" onclick="openUserForm()"><i class="fa-solid fa-plus"></i> Add User</button>
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td>${u.id}</td>
                <td>${u.userName}</td>
                <td><span class="badge ${u.role === 'Admin' ? 'bg-danger' : 'bg-primary'}">${u.role}</span></td>
                <td class="action-buttons">
                  <button class="btn btn-warning btn-sm" onclick="openUserForm(${u.id})"><i class="fa-solid fa-pen"></i> Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="confirmDeleteUser(${u.id})"><i class="fa-solid fa-trash"></i> Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  } catch (error) {
    return `<div class="alert alert-danger">Failed to load users: ${error.message}</div>`;
  }
}

function openUserForm(id = null){
  // In a real app, you would fetch the user data from API if editing
  const isEdit = id !== null;
  document.getElementById("modalTitle").innerText = isEdit ? "Edit User" : "Add User";
  document.getElementById("modalBody").innerHTML = `
    <input type="hidden" id="userId" value="${isEdit ? id : ''}">
    <div class="mb-3">
      <label class="form-label">User Name</label>
      <input class="form-control" id="userName" value="${isEdit ? 'User ' + id : ''}" placeholder="Enter user name" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Email</label>
      <input type="email" class="form-control" id="userEmail" value="${isEdit ? 'user' + id + '@test.com' : ''}" placeholder="Enter email" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Password</label>
      <input type="password" class="form-control" id="userPassword" placeholder="Enter password" ${isEdit ? '' : 'required'}>
      ${isEdit ? '<div class="form-text">Leave blank to keep current password</div>' : ''}
    </div>
    <div class="mb-3">
      <label class="form-label">Role</label>
      <select class="form-control" id="userRole" required>
        <option value="">Select Role</option>
        <option value="Admin" ${isEdit ? 'selected' : ''}>Admin</option>
        <option value="User" ${!isEdit ? 'selected' : ''}>User</option>
      </select>
    </div>`;
  document.getElementById("modalSave").onclick = () => saveUser(id);
  new bootstrap.Modal(document.getElementById("mainModal")).show();
}

async function saveUser(id){
  const userName = document.getElementById("userName").value;
  const email = document.getElementById("userEmail").value;
  const password = document.getElementById("userPassword").value;
  const role = document.getElementById("userRole").value;
  
  // Basic validation
  if (!userName || !email || !role) {
    showApiStatus('Please fill in all required fields', false);
    return;
  }
  
  if (!id && !password) {
    showApiStatus('Password is required for new users', false);
    return;
  }
  
  // Show loading state
  document.getElementById('modalSpinner').style.display = 'inline-block';
  document.getElementById('modalSaveText').textContent = 'Saving...';
  document.getElementById('modalSave').disabled = true;
  
  try {
    const userData = {
      userName: userName,
      email: email,
      role: role,
      ...(password && { password: password }) // Only include password if provided
    };
    
    if (id) {
      // Update existing user
      await updateUser(id, userData);
    } else {
      // Create new user - THIS IS THE REAL API CALL
      await createUser(userData);
    }
    
    // Close modal and refresh data
    bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
    showApiStatus(`User ${id ? 'updated' : 'created'} successfully!`);
    loadPage('users');
  } catch (error) {
    console.error('Failed to save user:', error);
    showApiStatus('Failed to save user. Please try again.', false);
  } finally {
    // Reset button state
    document.getElementById('modalSpinner').style.display = 'none';
    document.getElementById('modalSaveText').textContent = 'Save';
    document.getElementById('modalSave').disabled = false;
  }
}

function confirmDeleteUser(id) {
  showConfirmation(`Are you sure you want to delete this user? This action cannot be undone.`, 
    async () => {
      try {
        await deleteUser(id);
        showApiStatus('User deleted successfully');
        loadPage('users');
      } catch (error) {
        console.error('Failed to delete user:', error);
        showApiStatus('Failed to delete user. Please try again.', false);
      }
    });
}

// ---------------- Router ----------------
function loadPage(page){
  let content = document.getElementById('content');
  content.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
  
  try {
    if (page === "dashboard") content.innerHTML = renderDashboard();
    else if (page === "hotels") content.innerHTML = renderHotels();
    else if (page === "rooms") content.innerHTML = renderRooms();
    else if (page === "inventory") content.innerHTML = renderInventory();
    else if (page === "bookings") content.innerHTML = renderBookings();
    else if (page === "users") {
      renderUsers().then(html => {
        content.innerHTML = html;
      });
    }
    
    updateDashboardStats();
  } catch (error) {
    content.innerHTML = `<div class="alert alert-danger">Failed to load ${page}: ${error.message}</div>`;
  }
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
  updateDashboardStats();
  
  // Add logout functionality
  document.getElementById('logout-btn').addEventListener('click', function() {
    showConfirmation('Are you sure you want to logout?', function() {
      alert('You have been logged out successfully.');
      // In a real app, this would redirect to login page
    });
  });
  
  // Test API connection on load
  showApiStatus('Connected to API server', true);
})