// API Base URL
const API_BASE_URL = 'https://localhost:7033/api';

// Get auth token from localStorage
function getAuthToken() {
  let token = localStorage.getItem('token'); // Changed from 'authToken' to 'token'
  // Remove quotes if they exist around the token
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
    // Parse JWT token to check role
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
        // Redirect to login page
        window.location.href = '../login.html';
        return;
      }
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }
    
    // Check if response has content
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
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
    body: JSON.stringify({
      UserName: userData.userName,
      PassWord: userData.password,
      Email: userData.email,
      Role: userData.role
    })
  });
}

async function getUsers() {
  try {
    const users = await apiRequest('/Users/GetAllUsers');
    return users || [];
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}

async function updateUser(id, userData) {
  return await apiRequest(`/Users/UpdateUser_${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      UserName: userData.userName,
      Email: userData.email,
      Role: userData.role,
      ...(userData.password && { PassWord: userData.password })
    })
  });
}

async function deleteUser(id) {
  return await apiRequest(`/Users/${id}`, {
    method: 'DELETE'
  });
}

// Hotels API Functions
async function getHotels() {
  try {
    const hotels = await apiRequest('/Hotel');
    return hotels || [];
  } catch (error) {
    console.error('Failed to fetch hotels:', error);
    return [];
  }
}

async function createHotel(hotelData) {
  return await apiRequest('/Hotel', {
    method: 'POST',
    body: JSON.stringify({
      Name: hotelData.name,
      City: hotelData.city,
      Address: hotelData.address || '',
      Description: hotelData.description || '',
      Thumbnail_url: hotelData.thumbnail_url || '',
      Stars: hotelData.stars || 3
    })
  });
}

async function updateHotel(id, hotelData) {
  return await apiRequest(`/Hotel/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      Name: hotelData.name,
      City: hotelData.city,
      Address: hotelData.address || '',
      Description: hotelData.description || '',
      Thumbnail_url: hotelData.thumbnail_url || '',
      Stars: hotelData.stars || 3
    })
  });
}

async function deleteHotel(id) {
  return await apiRequest(`/Hotel/${id}`, {
    method: 'DELETE'
  });
}

// Room Types API Functions
async function getRoomTypes() {
  try {
    const response = await apiRequest('/RoomTypes/hetallrooms');
    // Handle the IResult response format
    return response || [];
  } catch (error) {
    console.error('Failed to fetch room types:', error);
    return [];
  }
}

async function createRoomType(roomData) {
  return await apiRequest('/RoomTypes/create new room', {
    method: 'POST',
    body: JSON.stringify({
      Name: roomData.type,
      Capacity: roomData.capacity || 2,
      Bed_type: roomData.bed_type || 'Queen',
      Base_Price: parseFloat(roomData.price),
      Description: roomData.description || '',
      HotelId: parseInt(roomData.hotelId)
    })
  });
}

async function updateRoomType(id, roomData) {
  return await apiRequest(`/RoomTypes/update ${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      Name: roomData.type,
      Capacity: roomData.capacity || 2,
      Bed_type: roomData.bed_type || 'Queen',
      Base_Price: parseFloat(roomData.price),
      Description: roomData.description || '',
      HotelId: parseInt(roomData.hotelId)
    })
  });
}

async function deleteRoomType(id) {
  return await apiRequest(`/RoomTypes/delete  ${id}`, {
    method: 'DELETE'
  });
}

// Bookings API Functions
async function getBookings() {
  try {
    const response = await apiRequest('/Bookings/getallbooking');
    return response || [];
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return [];
  }
}

async function updateBookingStatus(id, status) {
  return await apiRequest(`/Bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({
      Status: status
    })
  });
}

async function deleteBooking(id) {
  return await apiRequest(`/Bookings/${id}`, {
    method: 'DELETE'
  });
}

// Room Inventory API Functions
async function getRoomInventories() {
  try {
    const inventories = await apiRequest('/RoomInventories');
    return inventories || [];
  } catch (error) {
    console.error('Failed to fetch room inventories:', error);
    return [];
  }
}

async function createRoomInventory(inventoryData) {
  return await apiRequest('/RoomInventories', {
    method: 'POST',
    body: JSON.stringify({
      HotelId: parseInt(inventoryData.hotelId),
      RoomTypeId: parseInt(inventoryData.roomId),
      FromDate: inventoryData.fromDate,
      ToDate: inventoryData.toDate,
      AvailableRooms: parseInt(inventoryData.available)
    })
  });
}

async function updateRoomInventory(id, inventoryData) {
  return await apiRequest(`/RoomInventories/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      ID: parseInt(id),
      HotelId: parseInt(inventoryData.hotelId),
      RoomTypeId: parseInt(inventoryData.roomId),
      FromDate: inventoryData.fromDate,
      ToDate: inventoryData.toDate,
      AvailableRooms: parseInt(inventoryData.available)
    })
  });
}

async function deleteRoomInventory(id) {
  return await apiRequest(`/RoomInventories/${id}`, {
    method: 'DELETE'
  });
}

// Data storage - will be replaced by API calls
let hotelsData = [];
let roomsData = [];
let bookingsData = [];
let inventoryData = [];

// Load initial data from API
async function loadInitialData() {
  try {
    showApiStatus('Loading data...', true);
    
    // Load data in parallel with error handling for each
    const dataPromises = [
      getHotels().catch(err => { console.error('Failed to load hotels:', err); return []; }),
      getRoomTypes().catch(err => { console.error('Failed to load room types:', err); return []; }),
      getBookings().catch(err => { console.error('Failed to load bookings:', err); return []; }),
      getRoomInventories().catch(err => { console.error('Failed to load inventories:', err); return []; })
    ];
    
    const [hotels, rooms, bookings, inventories] = await Promise.all(dataPromises);
    
    hotelsData = hotels || [];
    roomsData = rooms || [];
    bookingsData = bookings || [];
    inventoryData = inventories || [];
    
    updateDashboardStats();
    
    // Show success message only if we have some data
    const totalItems = hotelsData.length + roomsData.length + bookingsData.length + inventoryData.length;
    if (totalItems > 0) {
      showApiStatus(`Loaded ${totalItems} items successfully`, true);
    } else {
      showApiStatus('No data found - database may be empty', true);
    }
  } catch (error) {
    console.error('Failed to load initial data:', error);
    showApiStatus('Failed to load data from server', false);
    
    // Initialize with empty arrays to prevent errors
    hotelsData = [];
    roomsData = [];
    bookingsData = [];
    inventoryData = [];
  }
}

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
function getHotelName(id){ 
  let h=hotelsData.find(h=>h.id==id || h.ID==id); 
  return h ? (h.name || h.Name) : "Unknown"; 
}
function getRoomType(id){ 
  let r=roomsData.find(r=>r.id==id || r.ID==id); 
  return r ? (r.type || r.Name) : "N/A"; 
}

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
async function renderDashboard(){
  await loadInitialData(); // Refresh data
  return `<h2><i class="fa-solid fa-chart-line"></i> Dashboard</h2>
    <div class="alert alert-info">
      <i class="fa-solid fa-info-circle"></i> You have ${bookingsData.filter(b=>(b.status || b.Status)=="PENDING").length} pending bookings that need attention.
    </div>
    <div class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Hotel</th>
            <th>Room</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${bookingsData.filter(b=>(b.status || b.Status)=="PENDING").map(b=>`
            <tr>
              <td>${b.id || b.ID}</td>
              <td>${b.user || b.User || 'N/A'}</td>
              <td>${getHotelName(b.hotelId || b.Hotel_Id)}</td>
              <td>${getRoomType(b.roomId || b.RoomType_Id)}</td>
              <td>${b.checkIn || b.Check_In}</td>
              <td>${b.checkOut || b.Check_Out}</td>
              <td><span class="badge bg-warning">${b.status || b.Status}</span></td>
              <td class="action-buttons">
                <button class="btn btn-success btn-sm" onclick="confirmBooking(${b.id || b.ID})"><i class="fa-solid fa-check"></i> Confirm</button>
                <button class="btn btn-danger btn-sm" onclick="rejectBooking(${b.id || b.ID})"><i class="fa-solid fa-xmark"></i> Reject</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>`;
}

async function renderBookings(){
  await loadInitialData(); // Refresh data
  return `<h2><i class="fa-solid fa-calendar-check"></i> All Bookings</h2>
    <div class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>User</th>
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
              <td>${b.id || b.ID}</td>
              <td>${b.user || b.User || 'N/A'}</td>
              <td>${getHotelName(b.hotelId || b.Hotel_Id)}</td>
              <td>${getRoomType(b.roomId || b.RoomType_Id)}</td>
              <td>${b.checkIn || b.Check_In}</td>
              <td>${b.checkOut || b.Check_Out}</td>
              <td><span class="badge ${(b.status || b.Status)=="PENDING"?"bg-warning":(b.status || b.Status)=="CONFIRMED"?"bg-success":"bg-danger"}">${b.status || b.Status}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>`;
}

async function confirmBooking(id){
  try {
    await updateBookingStatus(id, "CONFIRMED");
    showApiStatus('Booking confirmed successfully!');
    loadPage("dashboard");
  } catch (error) {
    console.error('Failed to confirm booking:', error);
    showApiStatus('Failed to confirm booking', false);
  }
}

async function rejectBooking(id){
  try {
    await updateBookingStatus(id, "REJECTED");
    showApiStatus('Booking rejected successfully!');
    loadPage("dashboard");
  } catch (error) {
    console.error('Failed to reject booking:', error);
    showApiStatus('Failed to reject booking', false);
  }
}

// ---------------- Hotels ----------------
async function renderHotels(){
  await loadInitialData(); // Refresh data
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
  let h = id ? hotelsData.find(h=>(h.id||h.ID)==id) : {name:"",city:"",address:"",description:"",thumbnail_url:"",stars:3};
  if (id && !h) {
    h = {name:"",city:"",address:"",description:"",thumbnail_url:"",stars:3};
  }
  
  document.getElementById("modalTitle").innerText=id?"Edit Hotel":"Add Hotel";
  document.getElementById("modalBody").innerHTML=`
    <input type="hidden" id="hotelId" value="${id}">
    <div class="mb-3">
      <label class="form-label">Name</label>
      <input class="form-control" id="hotelName" value="${h.name || h.Name || ''}" placeholder="Enter hotel name" required>
    </div>
    <div class="mb-3">
      <label class="form-label">City</label>
      <input class="form-control" id="hotelCity" value="${h.city || h.City || ''}" placeholder="Enter city" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Address</label>
      <input class="form-control" id="hotelAddress" value="${h.address || h.Address || ''}" placeholder="Enter address">
    </div>
    <div class="mb-3">
      <label class="form-label">Description</label>
      <textarea class="form-control" id="hotelDescription" placeholder="Enter description">${h.description || h.Description || ''}</textarea>
    </div>
    <div class="mb-3">
      <label class="form-label">Thumbnail URL</label>
      <input class="form-control" id="hotelThumbnail" value="${h.thumbnail_url || h.Thumbnail_url || ''}" placeholder="Enter thumbnail URL">
    </div>
    <div class="mb-3">
      <label class="form-label">Stars</label>
      <select class="form-control" id="hotelStars">
        <option value="1" ${(h.stars || h.Stars)==1?"selected":""}>1 Star</option>
        <option value="2" ${(h.stars || h.Stars)==2?"selected":""}>2 Stars</option>
        <option value="3" ${(h.stars || h.Stars)==3?"selected":"selected"}>3 Stars</option>
        <option value="4" ${(h.stars || h.Stars)==4?"selected":""}>4 Stars</option>
        <option value="5" ${(h.stars || h.Stars)==5?"selected":""}>5 Stars</option>
      </select>
    </div>`;
  document.getElementById("modalSave").onclick=saveHotel;
  new bootstrap.Modal(document.getElementById("mainModal")).show();
}

async function saveHotel(){
  let id = document.getElementById("hotelId").value;
  let name = document.getElementById("hotelName").value.trim();
  let city = document.getElementById("hotelCity").value.trim();
  let address = document.getElementById("hotelAddress").value.trim();
  let description = document.getElementById("hotelDescription").value.trim();
  let thumbnail_url = document.getElementById("hotelThumbnail").value.trim();
  let stars = parseInt(document.getElementById("hotelStars").value);
  
  if (!name || !city) {
    showApiStatus("Please fill in all required fields", false);
    return;
  }
  
  const hotelData = {
    name, city, address, description, thumbnail_url, stars
  };
  
  try {
    // Show loading state
    document.getElementById('modalSave').disabled = true;
    document.getElementById('modalSave').innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Saving...';
    
    if(id){
      await updateHotel(id, hotelData);
      showApiStatus('Hotel updated successfully!');
    } else {
      await createHotel(hotelData);
      showApiStatus('Hotel created successfully!');
    }
    
    bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
    loadPage("hotels");
  } catch (error) {
    console.error('Failed to save hotel:', error);
    showApiStatus('Failed to save hotel', false);
  } finally {
    // Reset button state
    document.getElementById('modalSave').disabled = false;
    document.getElementById('modalSave').innerHTML = 'Save';
  }
}

function confirmDeleteHotel(id) {
  const hotel = hotelsData.find(h => (h.id||h.ID) == id);
  const hotelName = hotel ? (hotel.name || hotel.Name) : 'this hotel';
  showConfirmation(`Are you sure you want to delete "${hotelName}"? This action cannot be undone.`, 
    () => deleteHotelRecord(id));
}

async function deleteHotelRecord(id){ 
  try {
    await deleteHotel(id);
    showApiStatus('Hotel deleted successfully!');
    loadPage("hotels");
  } catch (error) {
    console.error('Failed to delete hotel:', error);
    showApiStatus('Failed to delete hotel', false);
  }
}

// ---------------- Rooms ----------------
async function renderRooms(){
  await loadInitialData(); // Refresh data
  return `<h2><i class="fa-solid fa-bed"></i> Room Types</h2>
    <button class="btn btn-primary mb-3" onclick="openRoomForm()"><i class="fa-solid fa-plus"></i> Add Room Type</button>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr><th>ID</th><th>Hotel</th><th>Name</th><th>Capacity</th><th>Bed Type</th><th>Price</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${roomsData.map(r=>`<tr>
            <td>${r.id || r.ID}</td>
            <td>${getHotelName(r.hotelId || r.HotelId)}</td>
            <td>${r.type || r.Name}</td>
            <td>${r.capacity || r.Capacity || 'N/A'}</td>
            <td>${r.bed_type || r.Bed_type || 'N/A'}</td>
            <td>$${r.price || r.Base_Price}</td>
            <td class="action-buttons">
              <button class="btn btn-warning btn-sm" onclick="openRoomForm(${r.id || r.ID})"><i class="fa-solid fa-pen"></i> Edit</button>
              <button class="btn btn-danger btn-sm" onclick="confirmDeleteRoom(${r.id || r.ID})"><i class="fa-solid fa-trash"></i> Delete</button>
            </td></tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function openRoomForm(id=""){
  let r = id ? roomsData.find(r=>(r.id||r.ID)==id) : {hotelId:"",type:"",capacity:2,bed_type:"Queen",price:"",description:""};
  if (id && !r) {
    r = {hotelId:"",type:"",capacity:2,bed_type:"Queen",price:"",description:""};
  }
  
  let hotelOptions = hotelsData.map(h => 
    `<option value="${h.id || h.ID}" ${(r.hotelId||r.HotelId)==(h.id||h.ID)?"selected":""}>${h.name || h.Name}</option>`
  ).join("");
  
  document.getElementById("modalTitle").innerText=id?"Edit Room Type":"Add Room Type";
  document.getElementById("modalBody").innerHTML=`
    <input type="hidden" id="roomId" value="${id}">
    <div class="mb-3">
      <label class="form-label">Hotel</label>
      <select class="form-control" id="roomHotel" required>
        <option value="">Select Hotel</option>
        ${hotelOptions}
      </select>
    </div>
    <div class="mb-3">
      <label class="form-label">Room Type Name</label>
      <input class="form-control" id="roomType" value="${r.type || r.Name || ''}" placeholder="Enter room type name" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Capacity</label>
      <input type="number" class="form-control" id="roomCapacity" value="${r.capacity || r.Capacity || 2}" min="1" max="10" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Bed Type</label>
      <select class="form-control" id="roomBedType" required>
        <option value="Single" ${(r.bed_type||r.Bed_type)=="Single"?"selected":""}>Single</option>
        <option value="Double" ${(r.bed_type||r.Bed_type)=="Double"?"selected":""}>Double</option>
        <option value="Queen" ${(r.bed_type||r.Bed_type)=="Queen"?"selected":"selected"}>Queen</option>
        <option value="King" ${(r.bed_type||r.Bed_type)=="King"?"selected":""}>King</option>
        <option value="Twin" ${(r.bed_type||r.Bed_type)=="Twin"?"selected":""}>Twin</option>
      </select>
    </div>
    <div class="mb-3">
      <label class="form-label">Base Price</label>
      <div class="input-group">
        <span class="input-group-text">$</span>
        <input type="number" class="form-control" id="roomPrice" value="${r.price || r.Base_Price || ''}" min="0" step="0.01" placeholder="Enter base price" required>
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">Description</label>
      <textarea class="form-control" id="roomDescription" placeholder="Enter description">${r.description || r.Description || ''}</textarea>
    </div>`;
  document.getElementById("modalSave").onclick=saveRoom;
  new bootstrap.Modal(document.getElementById("mainModal")).show();
}

async function saveRoom(){
  let id = document.getElementById("roomId").value;
  let hotelId = parseInt(document.getElementById("roomHotel").value);
  let type = document.getElementById("roomType").value.trim();
  let capacity = parseInt(document.getElementById("roomCapacity").value);
  let bed_type = document.getElementById("roomBedType").value;
  let price = parseFloat(document.getElementById("roomPrice").value);
  let description = document.getElementById("roomDescription").value.trim();
  
  if (!hotelId || !type || !capacity || !bed_type || !price) {
    showApiStatus("Please fill in all required fields", false);
    return;
  }
  
  const roomData = {
    hotelId, type, capacity, bed_type, price, description
  };
  
  try {
    // Show loading state
    document.getElementById('modalSave').disabled = true;
    document.getElementById('modalSave').innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Saving...';
    
    if(id){
      await updateRoomType(id, roomData);
      showApiStatus('Room type updated successfully!');
    } else {
      await createRoomType(roomData);
      showApiStatus('Room type created successfully!');
    }
    
    bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
    loadPage("rooms");
  } catch (error) {
    console.error('Failed to save room type:', error);
    showApiStatus('Failed to save room type', false);
  } finally {
    // Reset button state
    document.getElementById('modalSave').disabled = false;
    document.getElementById('modalSave').innerHTML = 'Save';
  }
}

function confirmDeleteRoom(id) {
  const room = roomsData.find(r => (r.id||r.ID) == id);
  const roomName = room ? (room.type || room.Name) : 'this room type';
  showConfirmation(`Are you sure you want to delete "${roomName}" room type? This action cannot be undone.`, 
    () => deleteRoomRecord(id));
}

async function deleteRoomRecord(id){ 
  try {
    await deleteRoomType(id);
    showApiStatus('Room type deleted successfully!');
    loadPage("rooms");
  } catch (error) {
    console.error('Failed to delete room type:', error);
    showApiStatus('Failed to delete room type', false);
  }
}

// ---------------- Inventory ----------------
async function renderInventory(){
  await loadInitialData(); // Refresh data
  return `<h2><i class="fa-solid fa-box"></i> Room Inventory</h2>
    <button class="btn btn-primary mb-3" onclick="openInventoryForm()"><i class="fa-solid fa-plus"></i> Add Inventory</button>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr><th>ID</th><th>Hotel</th><th>Room Type</th><th>From</th><th>To</th><th>Available</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${inventoryData.map(i=>`<tr>
            <td>${i.id || i.ID}</td>
            <td>${getHotelName(i.hotelId || i.HotelId)}</td>
            <td>${getRoomType(i.roomId || i.RoomTypeId)}</td>
            <td>${i.fromDate || i.FromDate}</td>
            <td>${i.toDate || i.ToDate}</td>
            <td>${i.available || i.AvailableRooms}</td>
            <td class="action-buttons">
              <button class="btn btn-warning btn-sm" onclick="openInventoryForm(${i.id || i.ID})"><i class="fa-solid fa-pen"></i> Edit</button>
              <button class="btn btn-danger btn-sm" onclick="confirmDeleteInventory(${i.id || i.ID})"><i class="fa-solid fa-trash"></i> Delete</button>
            </td></tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function openInventoryForm(id=""){
  let inv = id ? inventoryData.find(i=>(i.id||i.ID)==id) : {hotelId:"",roomId:"",fromDate:"",toDate:"",available:1};
  if (id && !inv) {
    inv = {hotelId:"",roomId:"",fromDate:"",toDate:"",available:1};
  }
  
  let hotelOptions = hotelsData.map(h => 
    `<option value="${h.id || h.ID}" ${(inv.hotelId||inv.HotelId)==(h.id||h.ID)?"selected":""}>${h.name || h.Name}</option>`
  ).join("");
  
  document.getElementById("modalTitle").innerText=id?"Edit Inventory":"Add Inventory";
  document.getElementById("modalBody").innerHTML=`
    <input type="hidden" id="inventoryId" value="${id}">
    <div class="mb-3">
      <label class="form-label">Hotel</label>
      <select class="form-control" id="inventoryHotel" required onchange="updateRoomOptions()">
        <option value="">Select Hotel</option>
        ${hotelOptions}
      </select>
    </div>
    <div class="mb-3">
      <label class="form-label">Room Type</label>
      <select class="form-control" id="inventoryRoom" required>
        <option value="">Select Room Type</option>
      </select>
    </div>
    <div class="mb-3">
      <label class="form-label">From Date</label>
      <input type="date" class="form-control" id="inventoryFrom" value="${inv.fromDate || inv.FromDate || ''}" required>
    </div>
    <div class="mb-3">
      <label class="form-label">To Date</label>
      <input type="date" class="form-control" id="inventoryTo" value="${inv.toDate || inv.ToDate || ''}" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Available Rooms</label>
      <input type="number" class="form-control" id="inventoryAvailable" value="${inv.available || inv.AvailableRooms || 1}" min="0" required>
    </div>`;
  
  // Populate room options after modal is shown
  setTimeout(() => {
    updateRoomOptions();
    // Set the selected room if editing
    if (id && (inv.roomId || inv.RoomTypeId)) {
      document.getElementById('inventoryRoom').value = inv.roomId || inv.RoomTypeId;
    }
  }, 100);
  
  document.getElementById("modalSave").onclick=saveInventory;
  new bootstrap.Modal(document.getElementById("mainModal")).show();
}

// Helper function to update room options based on selected hotel
function updateRoomOptions() {
  const hotelSelect = document.getElementById('inventoryHotel');
  const roomSelect = document.getElementById('inventoryRoom');
  
  if (!hotelSelect || !roomSelect) return;
  
  const selectedHotelId = hotelSelect.value;
  roomSelect.innerHTML = '<option value="">Select Room Type</option>';
  
  if (selectedHotelId) {
    const filteredRooms = roomsData.filter(r => 
      (r.hotelId || r.HotelId) == selectedHotelId
    );
    
    filteredRooms.forEach(r => {
      const option = document.createElement('option');
      option.value = r.id || r.ID;
      option.textContent = r.type || r.Name;
      roomSelect.appendChild(option);
    });
  }
}

async function saveInventory(){
  let id = document.getElementById("inventoryId").value;
  let hotelId = parseInt(document.getElementById("inventoryHotel").value);
  let roomId = parseInt(document.getElementById("inventoryRoom").value);
  let fromDate = document.getElementById("inventoryFrom").value;
  let toDate = document.getElementById("inventoryTo").value;
  let available = parseInt(document.getElementById("inventoryAvailable").value);
  
  if (!hotelId || !roomId || !fromDate || !toDate || available < 0) {
    showApiStatus("Please fill in all fields with valid values", false);
    return;
  }
  
  // Validate date range
  if (new Date(fromDate) >= new Date(toDate)) {
    showApiStatus("To date must be after from date", false);
    return;
  }
  
  const inventoryData = {
    hotelId, roomId, fromDate, toDate, available
  };
  
  try {
    // Show loading state
    document.getElementById('modalSave').disabled = true;
    document.getElementById('modalSave').innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Saving...';
    
    if(id){
      await updateRoomInventory(id, inventoryData);
      showApiStatus('Inventory updated successfully!');
    } else {
      await createRoomInventory(inventoryData);
      showApiStatus('Inventory created successfully!');
    }
    
    bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
    loadPage("inventory");
  } catch (error) {
    console.error('Failed to save inventory:', error);
    showApiStatus('Failed to save inventory', false);
  } finally {
    // Reset button state
    document.getElementById('modalSave').disabled = false;
    document.getElementById('modalSave').innerHTML = 'Save';
  }
}

function confirmDeleteInventory(id) {
  showConfirmation(`Are you sure you want to delete this inventory record? This action cannot be undone.`, 
    () => deleteInventoryRecord(id));
}

async function deleteInventoryRecord(id){ 
  try {
    await deleteRoomInventory(id);
    showApiStatus('Inventory deleted successfully!');
    loadPage("inventory");
  } catch (error) {
    console.error('Failed to delete inventory:', error);
    showApiStatus('Failed to delete inventory', false);
  }
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
  const userName = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
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
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showApiStatus('Please enter a valid email address', false);
    return;
  }
  
  // Show loading state
  const saveBtn = document.getElementById('modalSave');
  const originalText = saveBtn.innerHTML;
  saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Saving...';
  saveBtn.disabled = true;
  
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
      showApiStatus('User updated successfully!');
    } else {
      // Create new user - THIS IS THE REAL API CALL
      await createUser(userData);
      showApiStatus('User created successfully!');
    }
    
    // Close modal and refresh data
    bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
    loadPage('users');
  } catch (error) {
    console.error('Failed to save user:', error);
    showApiStatus('Failed to save user. Please try again.', false);
  } finally {
    // Reset button state
    saveBtn.innerHTML = originalText;
    saveBtn.disabled = false;
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
async function loadPage(page){
  let content = document.getElementById('content');
  content.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
  
  try {
    let html = '';
    if (page === "dashboard") html = await renderDashboard();
    else if (page === "hotels") html = await renderHotels();
    else if (page === "rooms") html = await renderRooms();
    else if (page === "inventory") html = await renderInventory();
    else if (page === "bookings") html = await renderBookings();
    else if (page === "users") html = await renderUsers();
    
    content.innerHTML = html;
    updateDashboardStats();
  } catch (error) {
    console.error('Failed to load page:', error);
    content.innerHTML = `<div class="alert alert-danger">Failed to load ${page}: ${error.message}</div>`;
  }
}

// Check if user is authenticated and is admin
function checkAdminAccess() {
  const token = getAuthToken();
  
  if (!token) {
    alert('Please login to access the admin panel');
    window.location.href = '../login.html';
    return false;
  }
  
  try {
    // Parse JWT token to check role
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    
    console.log('Admin check - JWT payload:', payload); // For debugging
    
    // Try different possible claim names for role
    const userRole = payload.role || 
                    payload.Role ||
                    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
                    payload["role"];
    
    console.log('Admin check - User role:', userRole); // For debugging
    
    if (!userRole || (userRole.toLowerCase() !== 'admin' && userRole.toLowerCase() !== 'administrator')) {
      alert('Access denied. Admin privileges required.');
      window.location.href = '../homepage.html';
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Invalid token:', error);
    alert('Invalid authentication token');
    window.location.href = '../login.html';
    return false;
  }
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', async function() {
  // Check admin access first
  if (!checkAdminAccess()) {
    return;
  }
  
  // Load initial data and update dashboard
  await loadInitialData();
  
  // Add logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      showConfirmation('Are you sure you want to logout?', function() {
        localStorage.clear(); // Clear all localStorage data
        window.location.href = '../login.html';
      });
    });
  }
  
  // Test API connection on load
  try {
    await getHotels(); // Test endpoint
    showApiStatus('Connected to API server', true);
  } catch (error) {
    showApiStatus('Failed to connect to API server', false);
  }
})