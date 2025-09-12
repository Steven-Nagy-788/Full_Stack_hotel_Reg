// API Base URL
const API_BASE_URL = 'https://localhost:7033/api';

// Get auth token from localStorage
function getAuthToken() {
  let token = localStorage.getItem('token');
  if (token && token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
  }
  return token;
}

// Check if user is authenticated and has admin role
function isAdmin() {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const payload = parseJwt(token);
    const userRole = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role || 'guest';
    return userRole.toLowerCase() === 'admin';
  } catch (error) {
    console.error('Error parsing token:', error);
    return false;
  }
}

// Helper function to parse JWT token
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Failed to parse token', err);
    return {};
  }
}

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

// API Request Function with authentication
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        showApiStatus('Authentication required. Please login.', false);
        window.location.href = '../login.html';
        return;
      }
      const errorBody = await response.text();
      console.error('API Error Response:', errorBody);
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }
    
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('API request failed:', error);
    showApiStatus(`API Error: ${error.message}`, false);
    throw error;
  }
}

// --- API FUNCTIONS ---

// Users API Functions
async function createUser(userData) {
  return await apiRequest('/Users/create_User', {
    method: 'POST',
    body: JSON.stringify({
      name: userData.userName,
      password: userData.password,
      email: userData.email,
      role: userData.role
    })
  });
}

async function getUsers() {
  try {
    return await apiRequest('/Users/GetAllUsers') || [];
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}

async function updateUser(id, userData) {
  return await apiRequest(`/Users/UpdateUser/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: userData.userName,
      email: userData.email,
      role: userData.role,
      ...(userData.password && { password: userData.password })
    })
  });
}

async function deleteUser(id) {
  return await apiRequest(`/Users/${id}`, { method: 'DELETE' });
}

// Hotels API Functions
async function getHotels() {
  try {
    return await apiRequest('/Hotel') || [];
  } catch (error) {
    console.error('Failed to fetch hotels:', error);
    return [];
  }
}

async function createHotel(hotelData) {
  return await apiRequest('/Hotel', {
    method: 'POST',
    body: JSON.stringify(hotelData)
  });
}

async function updateHotel(id, hotelData) {
  return await apiRequest(`/Hotel/${id}`, {
    method: 'PUT',
    body: JSON.stringify(hotelData)
  });
}

async function deleteHotel(id) {
  return await apiRequest(`/Hotel/${id}`, { method: 'DELETE' });
}

// Room Types API Functions
async function getRoomTypes() {
  try {
    return await apiRequest('/RoomTypes/getallrooms') || [];
  } catch (error) {
    console.error('Failed to fetch room types:', error);
    return [];
  }
}

async function createRoomType(roomData) {
  return await apiRequest('/RoomTypes/create%20new%20room', {
    method: 'POST',
    body: JSON.stringify({
      name: roomData.type,
      capacity: roomData.capacity,
      base_price: parseFloat(roomData.price),
      description: roomData.description,
      hotelID: parseInt(roomData.hotelId)
    })
  });
}

async function updateRoomType(id, roomData) {
  return await apiRequest(`/RoomTypes/update%20${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      id: parseInt(id),
      name: roomData.type,
      capacity: roomData.capacity,
      base_Price: parseFloat(roomData.price),
      description: roomData.description,
      hotelId: parseInt(roomData.hotelId)
    })
  });
}

async function deleteRoomType(id) {
  return await apiRequest(`/RoomTypes/delete%20%20${id}`, { method: 'DELETE' });
}

// Bookings API Functions
async function getBookings() {
  try {
    return await apiRequest('/Bookings/getallbooking') || [];
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return [];
  }
}

async function updateBookingStatus(id, status) {
  const statusMap = { "PENDING": 0, "CONFIRMED": 1, "REJECTED": 2 };
  return await apiRequest(`/Bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: statusMap[status.toUpperCase()] })
  });
}

async function deleteBooking(id) {
  return await apiRequest(`/Bookings/${id}`, { method: 'DELETE' });
}

// Room Inventory API Functions
async function getRoomInventories() {
  try {
    return await apiRequest('/RoomInventories') || [];
  } catch (error) {
    console.error('Failed to fetch room inventories:', error);
    return [];
  }
}

async function createRoomInventory(inventoryData) {
  return await apiRequest('/RoomInventories', {
    method: 'POST',
    body: JSON.stringify({
      totalRooms: parseInt(inventoryData.available),
      roomTypeId: parseInt(inventoryData.roomId)
    })
  });
}

async function updateRoomInventory(id, inventoryData) {
  return await apiRequest(`/RoomInventories/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      totalRooms: parseInt(inventoryData.available),
      soldRooms: 0
    })
  });
}

async function deleteRoomInventory(id) {
  return await apiRequest(`/RoomInventories/${id}`, { method: 'DELETE' });
}

// --- DATA HANDLING & UI RENDERING ---
let hotelsData = [], roomsData = [], bookingsData = [], inventoryData = [];

async function loadInitialData() {
  try {
    showApiStatus('Loading data...', true);
    [hotelsData, roomsData, bookingsData, inventoryData] = await Promise.all([
      getHotels(), getRoomTypes(), getBookings(), getRoomInventories()
    ]);
  } catch (error) {
    showApiStatus('Failed to load data from server', false);
  }
}

// --- HELPERS ---
function getHotelName(id) { 
  const h = hotelsData.find(h => (h.id || h.ID) == id); 
  return h ? (h.name || h.Name) : "Unknown"; 
}
function getRoomType(id) { 
  const r = roomsData.find(r => (r.id || r.ID) == id); 
  return r ? (r.name || r.Name) : "N/A"; 
}

function showConfirmation(message, callback) {
  const confirmBody = document.getElementById('confirmBody');
  const confirmAction = document.getElementById('confirmAction');
  
  if (confirmBody && confirmAction) {
    confirmBody.textContent = message;
    confirmAction.onclick = () => {
        callback();
        bootstrap.Modal.getInstance(document.getElementById("confirmModal")).hide();
    };
    new bootstrap.Modal(document.getElementById('confirmModal')).show();
  }
}

// ---------------- Dashboard & Bookings (MODIFIED) ----------------
async function renderDashboard(){
  await loadInitialData();
  const bookingStatusMap = { 0: 'PENDING', 1: 'CONFIRMED', 2: 'REJECTED' };
  const pendingBookings = bookingsData.filter(b => b.status === 0);
  
  return `<h2><i class="fa-solid fa-chart-line"></i> Dashboard</h2>
    <div class="alert alert-info">
      <i class="fa-solid fa-info-circle"></i> You have ${pendingBookings.length} pending bookings that need attention.
    </div>
    <div class="row mt-4">
        <div class="col-md-3 mb-3"><div class="card stats-card bg-primary text-white text-center"><div class="card-body"><h5><i class="fa-solid fa-hotel"></i> Hotels</h5><h3>${hotelsData.length}</h3></div></div></div>
        <div class="col-md-3 mb-3"><div class="card stats-card bg-success text-white text-center"><div class="card-body"><h5><i class="fa-solid fa-bed"></i> Rooms</h5><h3>${roomsData.length}</h3></div></div></div>
        <div class="col-md-3 mb-3"><div class="card stats-card bg-info text-white text-center"><div class="card-body"><h5><i class="fa-solid fa-calendar-check"></i> Bookings</h5><h3>${bookingsData.length}</h3></div></div></div>
        <div class="col-md-3 mb-3"><div class="card stats-card bg-warning text-dark text-center"><div class="card-body"><h5><i class="fa-solid fa-clock"></i> Pending</h5><h3>${pendingBookings.length}</h3></div></div></div>
    </div>
    <div class="table-responsive mt-4">
      <table class="table table-bordered table-hover">
        <thead class="table-dark">
          <tr><th>ID</th><th>User ID</th><th>Hotel</th><th>Room</th><th>Check In</th><th>Check Out</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${pendingBookings.map(b=>`
            <tr>
              <td>${b.id}</td>
              <td>${b.user_Id}</td>
              <td>${getHotelName(b.hotel_Id)}</td>
              <td>${getRoomType(b.roomType_Id)}</td>
              <td>${new Date(b.check_In).toLocaleDateString()}</td>
              <td>${new Date(b.check_Out).toLocaleDateString()}</td>
              <td><span class="badge bg-warning">${bookingStatusMap[b.status]}</span></td>
              <td class="action-buttons">
                <button class="btn btn-success btn-sm" onclick="confirmBooking(${b.id})"><i class="fa-solid fa-check"></i> Confirm</button>
                <button class="btn btn-danger btn-sm" onclick="rejectBooking(${b.id})"><i class="fa-solid fa-xmark"></i> Reject</button>
              </td>
            </tr>`).join("") || `<tr><td colspan="8" class="text-center">No pending bookings.</td></tr>`}
        </tbody>
      </table>
    </div>`;
}

async function renderBookings(){
  await loadInitialData();
  const bookingStatusMap = { 0: 'PENDING', 1: 'CONFIRMED', 2: 'REJECTED' };
  const statusClassMap = { 0: 'bg-warning', 1: 'bg-success', 2: 'bg-danger' };

  return `<h2><i class="fa-solid fa-calendar-check"></i> All Bookings</h2>
    <div class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="table-dark">
          <tr><th>ID</th><th>User ID</th><th>Hotel</th><th>Room</th><th>Check In</th><th>Check Out</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${bookingsData.map(b=>`
            <tr>
              <td>${b.id}</td>
              <td>${b.user_Id}</td>
              <td>${getHotelName(b.hotel_Id)}</td>
              <td>${getRoomType(b.roomType_Id)}</td>
              <td>${new Date(b.check_In).toLocaleDateString()}</td>
              <td>${new Date(b.check_Out).toLocaleDateString()}</td>
              <td><span class="badge ${statusClassMap[b.status]}">${bookingStatusMap[b.status]}</span></td>
              <td>
                <select class="form-select form-select-sm" onchange="handleStatusChange(this)" data-booking-id="${b.id}">
                    <option value="PENDING" ${bookingStatusMap[b.status] === 'PENDING' ? 'selected' : ''}>Pending</option>
                    <option value="CONFIRMED" ${bookingStatusMap[b.status] === 'CONFIRMED' ? 'selected' : ''}>Confirmed</option>
                    <option value="REJECTED" ${bookingStatusMap[b.status] === 'REJECTED' ? 'selected' : ''}>Rejected</option>
                </select>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>`;
}

async function handleStatusChange(selectElement) {
    const bookingId = selectElement.dataset.bookingId;
    const newStatus = selectElement.value;

    try {
        await updateBookingStatus(bookingId, newStatus);
        showApiStatus('Booking status updated successfully!');
        loadPage('bookings'); // Refresh the page to show the updated status
    } catch (error) {
        console.error('Failed to update status:', error);
        showApiStatus('Failed to update status', false);
    }
}

async function confirmBooking(id){
  try {
    await updateBookingStatus(id, "CONFIRMED");
    showApiStatus('Booking confirmed successfully!');
    loadPage("dashboard");
  } catch (error) {
    showApiStatus('Failed to confirm booking', false);
  }
}

async function rejectBooking(id){
  try {
    await updateBookingStatus(id, "REJECTED");
    showApiStatus('Booking rejected successfully!');
    loadPage("dashboard");
  } catch (error) {
    showApiStatus('Failed to reject booking', false);
  }
}

// ---------------- Hotels ----------------
async function renderHotels(){
  await loadInitialData();
  return `<h2><i class="fa-solid fa-hotel"></i> Hotels</h2>
    <button class="btn btn-primary mb-3" onclick="openHotelForm()"><i class="fa-solid fa-plus"></i> Add Hotel</button>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr><th>ID</th><th>Name</th><th>City</th><th>Address</th><th>Stars</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${hotelsData.map(h=>`<tr>
            <td>${h.id || h.ID}</td>
            <td>${h.name || h.Name}</td>
            <td>${h.city || h.City}</td>
            <td>${h.address || h.Address || 'N/A'}</td>
            <td>${h.stars || h.Stars || 'N/A'}</td>
            <td class="action-buttons">
              <button class="btn btn-warning btn-sm" onclick="openHotelForm(${h.id || h.ID})"><i class="fa-solid fa-pen"></i> Edit</button>
              <button class="btn btn-danger btn-sm" onclick="confirmDeleteHotel(${h.id || h.ID})"><i class="fa-solid fa-trash"></i> Delete</button>
            </td></tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function openHotelForm(id=""){
  let h = id ? hotelsData.find(h=>(h.id || h.ID)==id) : {name:"",city:"",address:"",description:"",thumbnail_url:"",stars:3};
  if (!h) h = {name:"",city:"",address:"",description:"",thumbnail_url:"",stars:3};
  
  const currentCity = h.city || h.City || '';
  const cities = ["Cairo", "Alexandria", "Sharm El-Sheikh", "Hurghada", "Luxor", "Aswan", "Giza"];

  document.getElementById("modalTitle").innerText=id?"Edit Hotel":"Add Hotel";
  document.getElementById("modalBody").innerHTML=`
    <input type="hidden" id="hotelId" value="${id}">
    <div class="mb-3"><label class="form-label">Name</label><input class="form-control" id="hotelName" value="${h.name || h.Name || ''}" required></div>
    <div class="mb-3"><label class="form-label">City</label><select id="hotelCity" class="form-control" required><option value="">Select a city</option>${cities.map(city => `<option value="${city}" ${currentCity === city ? 'selected' : ''}>${city}</option>`).join('')}</select></div>
    <div class="mb-3"><label class="form-label">Address</label><input class="form-control" id="hotelAddress" value="${h.address || h.Address || ''}"></div>
    <div class="mb-3"><label class="form-label">Description</label><textarea class="form-control" id="hotelDescription">${h.description || h.Description || ''}</textarea></div>
    <div class="mb-3"><label class="form-label">Thumbnail URL</label><input class="form-control" id="hotelThumbnail" value="${h.thumbnail_url || h.Thumbnail_url || ''}"></div>
    <div class="mb-3"><label class="form-label">Stars</label><select class="form-control" id="hotelStars">${[1,2,3,4,5].map(s => `<option value="${s}" ${ (h.stars || h.Stars)==s ? "selected" : ""}>${s} Star${s>1?'s':''}</option>`).join('')}</select></div>`;
  document.getElementById("modalSave").onclick=saveHotel;
  new bootstrap.Modal(document.getElementById("mainModal")).show();
}

async function saveHotel(){
  let id = document.getElementById("hotelId").value;
  const hotelData = {
    name: document.getElementById("hotelName").value.trim(),
    city: document.getElementById("hotelCity").value,
    address: document.getElementById("hotelAddress").value.trim(),
    description: document.getElementById("hotelDescription").value.trim(),
    thumbnail_url: document.getElementById("hotelThumbnail").value.trim(),
    stars: parseInt(document.getElementById("hotelStars").value)
  };
  
  if (!hotelData.name || !hotelData.city) {
    showApiStatus("Name and City are required", false);
    return;
  }
  
  const saveBtn = document.getElementById('modalSave');
  saveBtn.disabled = true;
  saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';
  
  try {
    if(id){ await updateHotel(id, hotelData); } else { await createHotel(hotelData); }
    showApiStatus(`Hotel ${id ? 'updated' : 'created'} successfully!`);
    bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
    loadPage("hotels");
  } catch (error) {
    showApiStatus('Failed to save hotel', false);
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = 'Save';
  }
}

function confirmDeleteHotel(id) {
  const hotel = hotelsData.find(h => (h.id||h.ID) == id);
  const hotelName = hotel ? (hotel.name || hotel.Name) : 'this hotel';
  showConfirmation(`Are you sure you want to delete "${hotelName}"?`, () => deleteHotelRecord(id));
}

async function deleteHotelRecord(id){ 
  try {
    await deleteHotel(id);
    showApiStatus('Hotel deleted successfully!');
    loadPage("hotels");
  } catch (error) {
    showApiStatus('Failed to delete hotel', false);
  }
}

// ---------------- Rooms ----------------
async function renderRooms(){
  await loadInitialData();
  return `<h2><i class="fa-solid fa-bed"></i> Room Types</h2>
    <button class="btn btn-primary mb-3" onclick="openRoomForm()"><i class="fa-solid fa-plus"></i> Add Room Type</button>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr><th>ID</th><th>Hotel</th><th>Name</th><th>Capacity</th><th>Price</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${roomsData.map(r=>`<tr>
            <td>${r.id || r.ID}</td>
            <td>${getHotelName(r.hotelId || r.HotelId)}</td>
            <td>${r.name || r.Name}</td>
            <td>${r.capacity || r.Capacity || 'N/A'}</td>
            <td>$${r.base_Price || r.Base_Price}</td>
            <td class="action-buttons">
              <button class="btn btn-warning btn-sm" onclick="openRoomForm(${r.id || r.ID})"><i class="fa-solid fa-pen"></i> Edit</button>
              <button class="btn btn-danger btn-sm" onclick="confirmDeleteRoom(${r.id || r.ID})"><i class="fa-solid fa-trash"></i> Delete</button>
            </td></tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function openRoomForm(id=""){
  let r = id ? roomsData.find(r=>(r.id||r.ID)==id) : {};
  if (!r) r = {};
  
  let hotelOptions = hotelsData.map(h => `<option value="${h.id || h.ID}" ${(r.hotelId || r.HotelId)==(h.id || h.ID)?"selected":""}>${h.name || h.Name}</option>`).join("");

  const capacityOptions = ["1 Adult", "2 Adults", "2 Adults + 1 kid", "2 Adults + 2 kids", "2 Adults + 3 kids", "3 Adults + 4 kids", "4 Adults + 4 kids", "4 Adults + 5 kids"];
  const currentCapacity = r.capacity || r.Capacity || '2 Adults';
  const roomTypeOptions = ["Single", "Double"];
  const currentRoomType = r.name || r.Name || '';
  
  document.getElementById("modalTitle").innerText=id?"Edit Room Type":"Add Room Type";
  document.getElementById("modalBody").innerHTML=`
    <input type="hidden" id="roomId" value="${id}">
    <div class="mb-3"><label class="form-label">Hotel</label><select class="form-control" id="roomHotel" required><option value="">Select Hotel</option>${hotelOptions}</select></div>
    <div class="mb-3"><label class="form-label">Room Type Name</label><select class="form-control" id="roomType" required><option value="">Select Room Type</option>${roomTypeOptions.map(opt => `<option value="${opt}" ${currentRoomType === opt ? 'selected' : ''}>${opt}</option>`).join('')}</select></div>
    <div class="mb-3"><label class="form-label">Capacity</label><select class="form-control" id="roomCapacity" required>${capacityOptions.map(opt => `<option value="${opt}" ${currentCapacity === opt ? 'selected' : ''}>${opt}</option>`).join('')}</select></div>
    <div class="mb-3"><label class="form-label">Base Price</label><div class="input-group"><span class="input-group-text">$</span><input type="number" class="form-control" id="roomPrice" value="${r.base_Price || r.Base_Price || ''}" min="0" step="0.01" required></div></div>
    <div class="mb-3"><label class="form-label">Description</label><textarea class="form-control" id="roomDescription">${r.description || r.Description || ''}</textarea></div>`;
  document.getElementById("modalSave").onclick=saveRoom;
  new bootstrap.Modal(document.getElementById("mainModal")).show();
}

async function saveRoom(){
  let id = document.getElementById("roomId").value;
  const roomData = {
      hotelId: document.getElementById("roomHotel").value,
      type: document.getElementById("roomType").value,
      capacity: document.getElementById("roomCapacity").value,
      price: parseFloat(document.getElementById("roomPrice").value),
      description: document.getElementById("roomDescription").value.trim()
  };
  
  if (!roomData.hotelId || !roomData.type || !roomData.capacity || isNaN(roomData.price)) {
    showApiStatus("Please fill all required fields", false); return;
  }
  
  const saveBtn = document.getElementById('modalSave');
  saveBtn.disabled = true;
  saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';
  
  try {
    if(id){ await updateRoomType(id, roomData); } else { await createRoomType(roomData); }
    showApiStatus(`Room type ${id ? 'updated' : 'created'} successfully!`);
    bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
    loadPage("rooms");
  } catch (error) {
    showApiStatus('Failed to save room type', false);
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = 'Save';
  }
}

function confirmDeleteRoom(id) {
  const room = roomsData.find(r => (r.id||r.ID) == id);
  const roomName = room ? (room.name || room.Name) : 'this room';
  showConfirmation(`Are you sure you want to delete "${roomName}"?`, () => deleteRoomRecord(id));
}

async function deleteRoomRecord(id){ 
  try {
    await deleteRoomType(id);
    showApiStatus('Room type deleted successfully!');
    loadPage("rooms");
  } catch (error) {
    showApiStatus('Failed to delete room type', false);
  }
}

// ---------------- Inventory ----------------
async function renderInventory(){
  await loadInitialData();
  return `<h2><i class="fa-solid fa-box"></i> Room Inventory</h2>
    <button class="btn btn-primary mb-3" onclick="openInventoryForm()"><i class="fa-solid fa-plus"></i> Add Inventory</button>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr><th>ID</th><th>Room Type</th><th>Total Rooms</th><th>Sold Rooms</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${inventoryData.map(i => `<tr>
            <td>${i.id || i.ID}</td>
            <td>${getRoomType(i.roomTypeId || i.RoomTypeId || i.roomType_ID)}</td> 
            <td>${i.totalRooms || i.TotalRooms || i.total_Rooms || 0}</td>
            <td>${i.soldRooms || i.SoldRooms || i.sold_Rooms || 0}</td>
            <td class="action-buttons">
              <button class="btn btn-warning btn-sm" onclick="openInventoryForm(${i.id || i.ID})"><i class="fa-solid fa-pen"></i> Edit</button>
              <button class="btn btn-danger btn-sm" onclick="confirmDeleteInventory(${i.id || i.ID})"><i class="fa-solid fa-trash"></i> Delete</button>
            </td></tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function openInventoryForm(id=""){
  let inv = id ? inventoryData.find(i => (i.id || i.ID) == id) : {};
  if (!inv) inv = {};
  
  let roomOptions = roomsData.map(r => `<option value="${r.id || r.ID}" ${ (inv.roomTypeId || inv.RoomTypeId || inv.roomType_ID) == (r.id || r.ID) ? "selected" : ""}>${r.name || r.Name} (${getHotelName(r.hotelId || r.HotelId)})</option>`).join("");
  
  document.getElementById("modalTitle").innerText=id?"Edit Inventory":"Add Inventory";
  document.getElementById("modalBody").innerHTML=`
    <input type="hidden" id="inventoryId" value="${id}">
    <div class="mb-3"><label class="form-label">Room Type</label><select class="form-control" id="inventoryRoom" required><option value="">Select Room Type</option>${roomOptions}</select></div>
    <div class="mb-3"><label class="form-label">Total Rooms</label><input type="number" class="form-control" id="inventoryAvailable" value="${inv.totalRooms || inv.TotalRooms || inv.total_Rooms || 1}" min="0" required></div>`;
  
  document.getElementById("modalSave").onclick=saveInventory;
  new bootstrap.Modal(document.getElementById("mainModal")).show();
}

async function saveInventory(){
  let id = document.getElementById("inventoryId").value;
  const inventoryData = {
      roomId: document.getElementById("inventoryRoom").value,
      available: parseInt(document.getElementById("inventoryAvailable").value)
  };
  
  if (!inventoryData.roomId || isNaN(inventoryData.available) || inventoryData.available < 0) {
    showApiStatus("Please fill all fields correctly", false); return;
  }
  
  const saveBtn = document.getElementById('modalSave');
  saveBtn.disabled = true;
  saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';
  
  try {
    if(id){ await updateRoomInventory(id, inventoryData); } else { await createRoomInventory(inventoryData); }
    showApiStatus(`Inventory ${id ? 'updated' : 'created'} successfully!`);
    bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
    loadPage("inventory");
  } catch (error) {
    showApiStatus('Failed to save inventory', false);
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = 'Save';
  }
}

function confirmDeleteInventory(id) {
  showConfirmation(`Are you sure you want to delete this inventory record?`, () => deleteInventoryRecord(id));
}

async function deleteInventoryRecord(id){ 
  try {
    await deleteRoomInventory(id);
    showApiStatus('Inventory deleted successfully!');
    loadPage("inventory");
  } catch (error) {
    showApiStatus('Failed to delete inventory', false);
  }
}

// ---------------- Users ----------------
async function renderUsers(){
  const users = await getUsers();
  return `<h2><i class="fa-solid fa-users"></i> Users</h2>
    <button class="btn btn-primary mb-3" onclick="openUserForm()"><i class="fa-solid fa-plus"></i> Add User</button>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${users.map(u => `
            <tr>
              <td>${u.id}</td>
              <td>${u.name || u.userName}</td>
              <td>${u.email}</td>
              <td><span class="badge ${ (u.role || '').toLowerCase() === 'admin' ? 'bg-danger' : 'bg-primary'}">${u.role}</span></td>
              <td class="action-buttons">
                <button class="btn btn-warning btn-sm" onclick='openUserForm(${JSON.stringify(u)})'><i class="fa-solid fa-pen"></i> Edit</button>
                <button class="btn btn-danger btn-sm" onclick="confirmDeleteUser(${u.id})"><i class="fa-solid fa-trash"></i> Delete</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function openUserForm(user = null){
  const userData = user || {};
  document.getElementById("modalTitle").innerText = user ? "Edit User" : "Add User";
  document.getElementById("modalBody").innerHTML = `
    <input type="hidden" id="userId" value="${userData.id || ''}">
    <div class="mb-3"><label class="form-label">User Name</label><input class="form-control" id="userName" value="${userData.name || userData.userName || ''}" required></div>
    <div class="mb-3"><label class="form-label">Email</label><input type="email" class="form-control" id="userEmail" value="${userData.email || ''}" required></div>
    <div class="mb-3"><label class="form-label">Password</label><input type="password" class="form-control" id="userPassword" placeholder="${user ? 'Leave blank to keep current' : 'Enter password'}" ${user ? '' : 'required'}></div>
    <div class="mb-3"><label class="form-label">Role</label><select class="form-control" id="userRole" required><option value="">Select Role</option><option value="Admin" ${ (userData.role || '').toLowerCase() === 'admin' ? 'selected' : ''}>Admin</option><option value="guest" ${ (userData.role || '').toLowerCase() === 'guest' ? 'selected' : ''}>Guest</option></select></div>`;
  document.getElementById("modalSave").onclick = () => saveUser(userData.id || null);
  new bootstrap.Modal(document.getElementById("mainModal")).show();
}

async function saveUser(id){
  const userData = {
      userName: document.getElementById("userName").value.trim(),
      email: document.getElementById("userEmail").value.trim(),
      password: document.getElementById("userPassword").value,
      role: document.getElementById("userRole").value
  };
  
  if (!userData.userName || !userData.email || !userData.role || (!id && !userData.password)) {
    showApiStatus('Please fill all required fields', false); return;
  }
  
  const saveBtn = document.getElementById('modalSave');
  saveBtn.disabled = true;
  saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';
  
  try {
    if (id) { await updateUser(id, userData); } else { await createUser(userData); }
    showApiStatus(`User ${id ? 'updated' : 'created'} successfully!`);
    bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
    loadPage('users');
  } catch (error) {
    showApiStatus('Failed to save user.', false);
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = 'Save';
  }
}

function confirmDeleteUser(id) {
  showConfirmation(`Are you sure you want to delete this user?`, () => deleteUserRecord(id));
}

async function deleteUserRecord(id) {
    try {
        await deleteUser(id);
        showApiStatus('User deleted successfully');
        loadPage('users');
    } catch (error) {
        showApiStatus('Failed to delete user.', false);
    }
}

// ---------------- Router & Initialization ----------------
async function loadPage(page){
  let content = document.getElementById('content');
  content.innerHTML = '<div class="text-center p-5"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
  
  try {
    const pageRenderers = {
      dashboard: renderDashboard, hotels: renderHotels, rooms: renderRooms,
      inventory: renderInventory, bookings: renderBookings, users: renderUsers
    };
    if (pageRenderers[page]) {
      content.innerHTML = await pageRenderers[page]();
    }
  } catch (error) {
    console.error(`Failed to load page: ${page}`, error);
    content.innerHTML = `<div class="alert alert-danger">Failed to load ${page}: ${error.message}</div>`;
  }
}

function checkAdminAccess() {
  const token = getAuthToken();
  if (!token) {
    window.location.href = '../login.html';
    return false;
  }
  
  try {
    const payload = parseJwt(token);
    const userRole = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (!userRole || userRole.toLowerCase() !== 'admin') {
      alert('Access denied. Admin privileges required.');
      window.location.href = '../homepage.html';
      return false;
    }
    return true;
  } catch (error) {
    console.error('Invalid token:', error);
    window.location.href = '../login.html';
    return false;
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  if (!checkAdminAccess()) return;
  
  await loadPage('dashboard');
  
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    showConfirmation('Are you sure you want to logout?', () => {
      localStorage.clear();
      window.location.href = '../login.html';
    });
  });
});