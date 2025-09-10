// API Base URL
const API_BASE_URL = 'https://localhost:7033/api';

// Authentication token storage
let authToken = null;

// Get auth token from localStorage
function getAuthToken() {
  if (!authToken) {
    authToken = localStorage.getItem('authToken');
  }
  return authToken;
}

// Set auth token
function setAuthToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
}

// Check if user is authenticated
function isAuthenticated() {
  return !!getAuthToken();
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

// API Request Function
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Add authorization header if we have a token
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      headers,
      ...options
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired or invalid
        setAuthToken(null);
        throw new Error(`Authentication required (401)`);
      }
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

// Authentication functions
async function adminLogin(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/Users/Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });
    
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    
    const result = await response.json();
    if (result.token) {
      setAuthToken(result.token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

// Show login modal
function showLoginModal() {
  document.getElementById("modalTitle").innerText = "Admin Login";
  document.getElementById("modalBody").innerHTML = `
    <div class="mb-3">
      <label class="form-label">Email</label>
      <input type="email" class="form-control" id="loginEmail" placeholder="Enter admin email" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Password</label>
      <input type="password" class="form-control" id="loginPassword" placeholder="Enter password" required>
    </div>
    <div class="alert alert-info">
      <small>Please login with admin credentials to access protected features</small>
    </div>`;
  document.getElementById("modalSave").onclick = async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    
    if (!email || !password) {
      showApiStatus('Please enter both email and password', false);
      return;
    }
    
    try {
      await adminLogin(email, password);
      showApiStatus('Login successful!');
      bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
      await loadAllData();
      await updateDashboardStats();
      // Reset modal save button text
      document.getElementById("modalSave").textContent = "Save";
    } catch (error) {
      showApiStatus('Login failed: ' + error.message, false);
      // Reset modal save button text
      document.getElementById("modalSave").textContent = "Save";
    }
  };
  
  document.getElementById("modalSave").textContent = "Login";
  new bootstrap.Modal(document.getElementById("mainModal")).show();
}
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
  return await apiRequest('/Users/GetAllUsers');
}

async function updateUser(id, userData) {
  return await apiRequest(`/Users/UpdateUser/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: userData.userName,
      password: userData.password,
      email: userData.email,
      role: userData.role
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
  return await apiRequest('/Hotel');
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
  return await apiRequest(`/Hotel/${id}`, {
    method: 'DELETE'
  });
}

// Room Types API Functions
async function getRoomTypes() {
  return await apiRequest('/RoomTypes/getallrooms');
}

async function createRoomType(roomData) {
  return await apiRequest('/RoomTypes/create new room', {
    method: 'POST',
    body: JSON.stringify(roomData)
  });
}

async function updateRoomType(id, roomData) {
  return await apiRequest(`/RoomTypes/update ${id}`, {
    method: 'PUT',
    body: JSON.stringify(roomData)
  });
}

async function deleteRoomType(id) {
  return await apiRequest(`/RoomTypes/delete  ${id}`, {
    method: 'DELETE'
  });
}

// Bookings API Functions
async function getBookings() {
  return await apiRequest('/Bookings/getallbooking');
}

async function updateBookingStatus(id, status) {
  return await apiRequest(`/Bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: status })
  });
}

async function deleteBooking(id) {
  return await apiRequest(`/Bookings/${id}`, {
    method: 'DELETE'
  });
}

// Room Inventory API Functions
async function getRoomInventories() {
  return await apiRequest('/RoomInventories');
}

async function createRoomInventory(inventoryData) {
  return await apiRequest('/RoomInventories', {
    method: 'POST',
    body: JSON.stringify(inventoryData)
  });
}

async function updateRoomInventory(id, inventoryData) {
  return await apiRequest(`/RoomInventories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(inventoryData)
  });
}

async function deleteRoomInventory(id) {
  return await apiRequest(`/RoomInventories/${id}`, {
    method: 'DELETE'
  });
}

// Data storage (cache for current session)
let hotelsData = [];
let roomsData = [];
let bookingsData = [];
let inventoryData = [];
let usersData = [];

// Load all data from API (with fallback for unauthorized endpoints)
async function loadAllData() {
  try {
    // Load data that doesn't require authentication first
    const [hotels, rooms, inventory] = await Promise.all([
      getHotels().catch(err => {
        console.warn('Failed to load hotels:', err);
        return [];
      }),
      getRoomTypes().catch(err => {
        console.warn('Failed to load room types:', err);
        return [];
      }),
      getRoomInventories().catch(err => {
        console.warn('Failed to load inventory:', err);
        return [];
      })
    ]);
    
    hotelsData = hotels || [];
    roomsData = rooms || [];
    inventoryData = inventory || [];
    
    // Try to load protected data (users and bookings) - these require authentication
    let users = [];
    let bookings = [];
    
    if (isAuthenticated()) {
      try {
        users = await getUsers() || [];
      } catch (err) {
        console.warn('Failed to load users (authentication required):', err);
        showApiStatus('Some admin features require authentication', false);
      }
      
      try {
        bookings = await getBookings() || [];
      } catch (err) {
        console.warn('Failed to load bookings (authentication required):', err);
      }
    } else {
      console.warn('Not authenticated - skipping protected endpoints');
    }
    
    usersData = users;
    bookingsData = bookings;
    
    console.log('Data loaded successfully');
  } catch (error) {
    console.error('Error loading data:', error);
    showApiStatus('Failed to load some data from server', false);
  }
}

// Update dashboard stats
async function updateDashboardStats() {
  try {
    await loadAllData();
    
    const hotelsCount = document.getElementById('hotels-count');
    const roomsCount = document.getElementById('rooms-count');
    const bookingsCount = document.getElementById('bookings-count');
    const pendingCount = document.getElementById('pending-count');
    
    if (hotelsCount) hotelsCount.textContent = hotelsData.length;
    if (roomsCount) roomsCount.textContent = roomsData.length;
    if (bookingsCount) bookingsCount.textContent = bookingsData.length;
    if (pendingCount) {
      const pendingBookings = bookingsData.filter(b => 
        b.status === "Pending" || b.status === "pending" || b.status === 0
      );
      pendingCount.textContent = pendingBookings.length;
    }
  } catch (error) {
    console.error('Error updating dashboard stats:', error);
    showApiStatus('Failed to update dashboard statistics', false);
  }
}

// Helpers
function getHotelName(id) { 
  let h = hotelsData.find(h => h.id == id || h.Id == id); 
  return h ? (h.name || h.Name) : "Unknown"; 
}

function getRoomType(id) { 
  let r = roomsData.find(r => r.id == id || r.Id == id); 
  return r ? (r.type || r.name || r.Name) : "N/A"; 
}

function getRoomPrice(id) {
  let r = roomsData.find(r => r.id == id || r.Id == id);
  return r ? (r.price || r.base_Price || r.Base_Price || 0) : 0;
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
  await loadAllData();
  
  const pendingBookings = bookingsData.filter(b => 
    b.status === "Pending" || b.status === "pending" || b.status === 0
  );
  
  // Show login prompt if not authenticated and no data
  const authWarning = !isAuthenticated() ? 
    `<div class="alert alert-warning">
      <i class="fa-solid fa-exclamation-triangle"></i> 
      <strong>Limited Access:</strong> Please <button class="btn btn-link p-0" onclick="showLoginModal()">login</button> to access all admin features including bookings and user management.
    </div>` : '';
  
  return `<h2><i class="fa-solid fa-chart-line"></i> Dashboard</h2>
    ${authWarning}
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card text-white bg-primary">
          <div class="card-body">
            <h5 class="card-title">Total Hotels</h5>
            <h3>${hotelsData.length}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-white bg-success">
          <div class="card-body">
            <h5 class="card-title">Total Rooms</h5>
            <h3>${roomsData.length}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-white bg-info">
          <div class="card-body">
            <h5 class="card-title">Total Bookings</h5>
            <h3>${bookingsData.length}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-white bg-warning">
          <div class="card-body">
            <h5 class="card-title">Pending Bookings</h5>
            <h3>${pendingBookings.length}</h3>
          </div>
        </div>
      </div>
    </div>
    ${pendingBookings.length > 0 ? `
    <div class="alert alert-info">
      <i class="fa-solid fa-info-circle"></i> You have ${pendingBookings.length} pending bookings that need attention.
    </div>
    <div class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Hotel</th>
            <th>Room Type</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${pendingBookings.map(b=>`
            <tr>
              <td>${b.id || b.Id}</td>
              <td>${b.user?.name || b.User?.Name || 'N/A'}</td>
              <td>${getHotelName(b.hotel_Id || b.Hotel_Id)}</td>
              <td>${getRoomType(b.roomType_Id || b.RoomType_Id)}</td>
              <td>${b.check_In || b.Check_In}</td>
              <td>${b.check_Out || b.Check_Out}</td>
              <td><span class="badge bg-warning">${b.status}</span></td>
              <td class="action-buttons">
                <button class="btn btn-success btn-sm" onclick="confirmBooking(${b.id || b.Id})"><i class="fa-solid fa-check"></i> Confirm</button>
                <button class="btn btn-danger btn-sm" onclick="rejectBooking(${b.id || b.Id})"><i class="fa-solid fa-xmark"></i> Reject</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>` : (!isAuthenticated() ? 
      '<div class="alert alert-secondary">Login to view pending bookings</div>' : 
      '<div class="alert alert-success">No pending bookings at this time</div>')}`;
}

async function renderBookings(){
  if (!isAuthenticated()) {
    return `<h2><i class="fa-solid fa-calendar-check"></i> All Bookings</h2>
      <div class="alert alert-warning">
        <i class="fa-solid fa-lock"></i> Authentication required to view bookings.
        <button class="btn btn-primary ms-2" onclick="showLoginModal()">Login</button>
      </div>`;
  }
  
  await loadAllData();
  
  return `<h2><i class="fa-solid fa-calendar-check"></i> All Bookings</h2>
    <div class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Hotel</th>
            <th>Room Type</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Rooms Count</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${bookingsData.length > 0 ? bookingsData.map(b=>`
            <tr>
              <td>${b.id || b.Id}</td>
              <td>${b.user?.name || b.User?.Name || 'N/A'}</td>
              <td>${getHotelName(b.hotel_Id || b.Hotel_Id)}</td>
              <td>${getRoomType(b.roomType_Id || b.RoomType_Id)}</td>
              <td>${b.check_In || b.Check_In}</td>
              <td>${b.check_Out || b.Check_Out}</td>
              <td>${b.roomsCount || b.RoomsCount || 1}</td>
              <td><span class="badge ${getStatusBadgeClass(b.status)}">${b.status}</span></td>
              <td class="action-buttons">
                <button class="btn btn-danger btn-sm" onclick="confirmDeleteBooking(${b.id || b.Id})"><i class="fa-solid fa-trash"></i> Delete</button>
              </td>
            </tr>
          `).join("") : '<tr><td colspan="9" class="text-center">No bookings found</td></tr>'}
        </tbody>
      </table>
    </div>`;
}

function getStatusBadgeClass(status) {
  switch(status?.toLowerCase()) {
    case 'pending': case '0': return 'bg-warning';
    case 'confirmed': case '1': return 'bg-success';
    case 'rejected': case '2': return 'bg-danger';
    case 'cancelled': case '3': return 'bg-secondary';
    default: return 'bg-info';
  }
}

async function confirmBooking(id){
  const booking = bookingsData.find(b => (b.id || b.Id) == id);
  const userName = booking?.user?.name || booking?.User?.Name || 'Unknown User';
  
  showConfirmation(`Confirm booking #${id} for ${userName}?`, async () => {
    try {
      await updateBookingStatus(id, 1); // 1 = Confirmed
      showApiStatus('Booking confirmed successfully');
      await loadPage("dashboard");
    } catch (error) {
      console.error('Error confirming booking:', error);
      showApiStatus('Failed to confirm booking', false);
    }
  });
}

async function rejectBooking(id){
  const booking = bookingsData.find(b => (b.id || b.Id) == id);
  const userName = booking?.user?.name || booking?.User?.Name || 'Unknown User';
  
  showConfirmation(`Reject booking #${id} for ${userName}?`, async () => {
    try {
      await updateBookingStatus(id, 2); // 2 = Rejected
      showApiStatus('Booking rejected successfully');
      await loadPage("dashboard");
    } catch (error) {
      console.error('Error rejecting booking:', error);
      showApiStatus('Failed to reject booking', false);
    }
  });
}

async function confirmDeleteBooking(id) {
  showConfirmation(`Are you sure you want to delete booking #${id}? This action cannot be undone.`, async () => {
    try {
      await deleteBooking(id);
      showApiStatus('Booking deleted successfully');
      await loadPage("bookings");
    } catch (error) {
      console.error('Error deleting booking:', error);
      showApiStatus('Failed to delete booking', false);
    }
  });
}

// ---------------- Hotels ----------------
async function renderHotels(){
  await loadAllData();
  
  return `<h2><i class="fa-solid fa-hotel"></i> Hotels</h2>
    <button class="btn btn-primary mb-3" onclick="openHotelForm()"><i class="fa-solid fa-plus"></i> Add Hotel</button>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr><th>ID</th><th>Name</th><th>City</th><th>Address</th><th>Stars</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${hotelsData.map(h=>`<tr>
            <td>${h.id || h.Id}</td>
            <td>${h.name || h.Name}</td>
            <td>${h.city || h.City}</td>
            <td>${h.address || h.Address || 'N/A'}</td>
            <td>${'★'.repeat(h.stars || h.Stars || 0)}</td>
            <td class="action-buttons">
              <button class="btn btn-warning btn-sm" onclick="openHotelForm(${h.id || h.Id})"><i class="fa-solid fa-pen"></i> Edit</button>
              <button class="btn btn-danger btn-sm" onclick="confirmDeleteHotel(${h.id || h.Id})"><i class="fa-solid fa-trash"></i> Delete</button>
            </td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

async function openHotelForm(id=""){
  let h = {name:"",city:"",address:"",description:"",thumbnail_url:"",stars:3};
  
  if(id) {
    // Find hotel in cached data
    const hotel = hotelsData.find(h => (h.id || h.Id) == id);
    if(hotel) {
      h = {
        name: hotel.name || hotel.Name || "",
        city: hotel.city || hotel.City || "",
        address: hotel.address || hotel.Address || "",
        description: hotel.description || hotel.Description || "",
        thumbnail_url: hotel.thumbnail_url || hotel.Thumbnail_url || "",
        stars: hotel.stars || hotel.Stars || 3
      };
    }
  }
  
  document.getElementById("modalTitle").innerText = id ? "Edit Hotel" : "Add Hotel";
  document.getElementById("modalBody").innerHTML = `
    <input type="hidden" id="hotelId" value="${id}">
    <div class="mb-3">
      <label class="form-label">Name *</label>
      <input class="form-control" id="hotelName" value="${h.name}" placeholder="Enter hotel name" required>
    </div>
    <div class="mb-3">
      <label class="form-label">City *</label>
      <input class="form-control" id="hotelCity" value="${h.city}" placeholder="Enter city" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Address</label>
      <input class="form-control" id="hotelAddress" value="${h.address}" placeholder="Enter address">
    </div>
    <div class="mb-3">
      <label class="form-label">Description</label>
      <textarea class="form-control" id="hotelDescription" rows="3" placeholder="Enter description">${h.description}</textarea>
    </div>
    <div class="mb-3">
      <label class="form-label">Thumbnail URL</label>
      <input class="form-control" id="hotelThumbnail" value="${h.thumbnail_url}" placeholder="Enter image URL">
    </div>
    <div class="mb-3">
      <label class="form-label">Stars</label>
      <select class="form-control" id="hotelStars">
        <option value="1" ${h.stars==1?"selected":""}>1 Star</option>
        <option value="2" ${h.stars==2?"selected":""}>2 Stars</option>
        <option value="3" ${h.stars==3?"selected":""}>3 Stars</option>
        <option value="4" ${h.stars==4?"selected":""}>4 Stars</option>
        <option value="5" ${h.stars==5?"selected":""}>5 Stars</option>
      </select>
    </div>`;
  document.getElementById("modalSave").onclick = saveHotel;
  // Reset modal save button text
  document.getElementById("modalSave").textContent = "Save";
  new bootstrap.Modal(document.getElementById("mainModal")).show();
}

async function saveHotel(){
  const id = document.getElementById("hotelId").value;
  const name = document.getElementById("hotelName").value;
  const city = document.getElementById("hotelCity").value;
  const address = document.getElementById("hotelAddress").value;
  const description = document.getElementById("hotelDescription").value;
  const thumbnail_url = document.getElementById("hotelThumbnail").value;
  const stars = parseInt(document.getElementById("hotelStars").value);
  
  if (!name || !city) {
    showApiStatus("Please fill in required fields (Name and City)", false);
    return;
  }
  
  const hotelData = {
    Name: name,
    City: city,
    Address: address,
    Description: description,
    Thumbnail_url: thumbnail_url,
    Stars: stars
  };
  
  try {
    if(id) {
      await updateHotel(id, hotelData);
      showApiStatus('Hotel updated successfully');
    } else {
      await createHotel(hotelData);
      showApiStatus('Hotel created successfully');
    }
    
    bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
    await loadPage("hotels");
  } catch (error) {
    console.error('Error saving hotel:', error);
    showApiStatus('Failed to save hotel', false);
  }
}

async function confirmDeleteHotel(id) {
  const hotel = hotelsData.find(h => (h.id || h.Id) == id);
  const hotelName = hotel ? (hotel.name || hotel.Name) : 'Unknown Hotel';
  
  showConfirmation(`Are you sure you want to delete "${hotelName}"? This action cannot be undone.`, 
    async () => {
      try {
        await deleteHotel(id);
        showApiStatus('Hotel deleted successfully');
        await loadPage("hotels");
      } catch (error) {
        console.error('Error deleting hotel:', error);
        showApiStatus('Failed to delete hotel', false);
      }
    });
}

// ---------------- Rooms ----------------
async function renderRooms(){
  await loadAllData();
  
  return `<h2><i class="fa-solid fa-bed"></i> Room Types</h2>
    <button class="btn btn-primary mb-3" onclick="openRoomForm()"><i class="fa-solid fa-plus"></i> Add Room Type</button>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr><th>ID</th><th>Hotel</th><th>Name</th><th>Capacity</th><th>Price</th><th>Description</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${roomsData.map(r=>`<tr>
            <td>${r.id || r.Id}</td>
            <td>${getHotelName(r.hotelID || r.HotelID || r.hotel_Id)}</td>
            <td>${r.name || r.Name || r.type}</td>
            <td>${r.capacity || r.Capacity}</td>
            <td>$${r.base_price || r.Base_Price || r.price || 0}</td>
            <td>${r.description || r.Description || 'N/A'}</td>
            <td class="action-buttons">
              <button class="btn btn-warning btn-sm" onclick="openRoomForm(${r.id || r.Id})"><i class="fa-solid fa-pen"></i> Edit</button>
              <button class="btn btn-danger btn-sm" onclick="confirmDeleteRoom(${r.id || r.Id})"><i class="fa-solid fa-trash"></i> Delete</button>
            </td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

async function openRoomForm(id=""){
  await loadAllData();
  
  let r = {hotelID:"",name:"",capacity:"",base_price:"",description:""};
  
  if(id) {
    const room = roomsData.find(r => (r.id || r.Id) == id);
    if(room) {
      r = {
        hotelID: room.hotelID || room.HotelID || room.hotel_Id || "",
        name: room.name || room.Name || room.type || "",
        capacity: room.capacity || room.Capacity || "",
        base_price: room.base_price || room.Base_Price || room.price || "",
        description: room.description || room.Description || ""
      };
    }
  }
  
  let hotelOptions = hotelsData.map(h => 
    `<option value="${h.id || h.Id}" ${r.hotelID == (h.id || h.Id) ? "selected" : ""}>${h.name || h.Name}</option>`
  ).join("");
  
  document.getElementById("modalTitle").innerText = id ? "Edit Room Type" : "Add Room Type";
  document.getElementById("modalBody").innerHTML = `
    <input type="hidden" id="roomId" value="${id}">
    <div class="mb-3">
      <label class="form-label">Hotel *</label>
      <select class="form-control" id="roomHotel" required>
        <option value="">Select Hotel</option>
        ${hotelOptions}
      </select>
    </div>
    <div class="mb-3">
      <label class="form-label">Room Type Name *</label>
      <input class="form-control" id="roomName" value="${r.name}" placeholder="Enter room type name" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Capacity *</label>
      <input class="form-control" id="roomCapacity" value="${r.capacity}" placeholder="e.g., 2 Adults" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Base Price *</label>
      <div class="input-group">
        <span class="input-group-text">$</span>
        <input type="number" class="form-control" id="roomPrice" value="${r.base_price}" placeholder="Enter base price" step="0.01" required>
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">Description</label>
      <textarea class="form-control" id="roomDescription" rows="3" placeholder="Enter room description">${r.description}</textarea>
    </div>`;
  document.getElementById("modalSave").onclick = saveRoom;
  // Reset modal save button text
  document.getElementById("modalSave").textContent = "Save";
  new bootstrap.Modal(document.getElementById("mainModal")).show();
}

async function saveRoom(){
  const id = document.getElementById("roomId").value;
  const hotelID = parseInt(document.getElementById("roomHotel").value);
  const name = document.getElementById("roomName").value;
  const capacity = document.getElementById("roomCapacity").value;
  const base_price = parseFloat(document.getElementById("roomPrice").value);
  const description = document.getElementById("roomDescription").value;
  
  if (!hotelID || !name || !capacity || !base_price) {
    showApiStatus("Please fill in all required fields", false);
    return;
  }
  
  const roomData = {
    name: name,
    Capacity: capacity,
    Base_price: base_price,
    Description: description,
    HotelID: hotelID
  };
  
  try {
    if(id) {
      await updateRoomType(id, roomData);
      showApiStatus('Room type updated successfully');
    } else {
      await createRoomType(roomData);
      showApiStatus('Room type created successfully');
    }
    
    bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
    await loadPage("rooms");
  } catch (error) {
    console.error('Error saving room type:', error);
    showApiStatus('Failed to save room type', false);
  }
}

async function confirmDeleteRoom(id) {
  const room = roomsData.find(r => (r.id || r.Id) == id);
  const roomName = room ? (room.name || room.Name || room.type || 'Unknown Room') : 'Unknown Room';
  
  showConfirmation(`Are you sure you want to delete "${roomName}" room type? This action cannot be undone.`, 
    async () => {
      try {
        await deleteRoomType(id);
        showApiStatus('Room type deleted successfully');
        await loadPage("rooms");
      } catch (error) {
        console.error('Error deleting room type:', error);
        showApiStatus('Failed to delete room type', false);
      }
    });
}

// ---------------- Inventory ----------------
async function renderInventory(){
  await loadAllData();
  
  return `<h2><i class="fa-solid fa-box"></i> Room Inventory</h2>
    <button class="btn btn-primary mb-3" onclick="openInventoryForm()"><i class="fa-solid fa-plus"></i> Add Inventory</button>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr><th>ID</th><th>Room Type</th><th>Hotel</th><th>From Date</th><th>To Date</th><th>Available Rooms</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${inventoryData.map(i=>`<tr>
            <td>${i.id || i.Id}</td>
            <td>${getRoomType(i.roomType_Id || i.RoomType_Id)}</td>
            <td>${getHotelName(i.hotel_Id || i.Hotel_Id)}</td>
            <td>${i.from_date || i.From_date}</td>
            <td>${i.to_date || i.To_date}</td>
            <td>${i.available_rooms || i.Available_rooms}</td>
            <td class="action-buttons">
              <button class="btn btn-warning btn-sm" onclick="openInventoryForm(${i.id || i.Id})"><i class="fa-solid fa-pen"></i> Edit</button>
              <button class="btn btn-danger btn-sm" onclick="confirmDeleteInventory(${i.id || i.Id})"><i class="fa-solid fa-trash"></i> Delete</button>
            </td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

async function openInventoryForm(id=""){
  await loadAllData();
  
  let inv = {roomType_Id:"",from_date:"",to_date:"",available_rooms:""};
  
  if(id) {
    const inventory = inventoryData.find(i => (i.id || i.Id) == id);
    if(inventory) {
      inv = {
        roomType_Id: inventory.roomType_Id || inventory.RoomType_Id || "",
        from_date: inventory.from_date || inventory.From_date || "",
        to_date: inventory.to_date || inventory.To_date || "",
        available_rooms: inventory.available_rooms || inventory.Available_rooms || ""
      };
    }
  }
  
  let roomOptions = roomsData.map(r => 
    `<option value="${r.id || r.Id}" ${inv.roomType_Id == (r.id || r.Id) ? "selected" : ""}>${(r.name || r.Name || r.type)} - ${getHotelName(r.hotelID || r.HotelID || r.hotel_Id)}</option>`
  ).join("");
  
  document.getElementById("modalTitle").innerText = id ? "Edit Inventory" : "Add Inventory";
  document.getElementById("modalBody").innerHTML = `
    <input type="hidden" id="inventoryId" value="${id}">
    <div class="mb-3">
      <label class="form-label">Room Type *</label>
      <select class="form-control" id="inventoryRoomType" required>
        <option value="">Select Room Type</option>
        ${roomOptions}
      </select>
    </div>
    <div class="mb-3">
      <label class="form-label">From Date *</label>
      <input type="date" class="form-control" id="inventoryFrom" value="${inv.from_date}" required>
    </div>
    <div class="mb-3">
      <label class="form-label">To Date *</label>
      <input type="date" class="form-control" id="inventoryTo" value="${inv.to_date}" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Available Rooms *</label>
      <input type="number" class="form-control" id="inventoryAvailable" value="${inv.available_rooms}" min="0" required>
    </div>`;
  document.getElementById("modalSave").onclick = saveInventory;
  // Reset modal save button text
  document.getElementById("modalSave").textContent = "Save";
  new bootstrap.Modal(document.getElementById("mainModal")).show();
}

async function saveInventory(){
  const id = document.getElementById("inventoryId").value;
  const roomType_Id = parseInt(document.getElementById("inventoryRoomType").value);
  const from_date = document.getElementById("inventoryFrom").value;
  const to_date = document.getElementById("inventoryTo").value;
  const available_rooms = parseInt(document.getElementById("inventoryAvailable").value);
  
  if (!roomType_Id || !from_date || !to_date || available_rooms < 0) {
    showApiStatus("Please fill in all required fields with valid values", false);
    return;
  }
  
  const inventoryData = {
    RoomType_Id: roomType_Id,
    From_date: from_date,
    To_date: to_date,
    Available_rooms: available_rooms
  };
  
  try {
    if(id) {
      await updateRoomInventory(id, inventoryData);
      showApiStatus('Inventory updated successfully');
    } else {
      await createRoomInventory(inventoryData);
      showApiStatus('Inventory created successfully');
    }
    
    bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
    await loadPage("inventory");
  } catch (error) {
    console.error('Error saving inventory:', error);
    showApiStatus('Failed to save inventory', false);
  }
}

async function confirmDeleteInventory(id) {
  showConfirmation(`Are you sure you want to delete this inventory record? This action cannot be undone.`, 
    async () => {
      try {
        await deleteRoomInventory(id);
        showApiStatus('Inventory deleted successfully');
        await loadPage("inventory");
      } catch (error) {
        console.error('Error deleting inventory:', error);
        showApiStatus('Failed to delete inventory', false);
      }
    });
}

// ---------------- Users ----------------
async function renderUsers(){
  if (!isAuthenticated()) {
    return `<h2><i class="fa-solid fa-users"></i> Users</h2>
      <div class="alert alert-warning">
        <i class="fa-solid fa-lock"></i> Authentication required to view users.
        <button class="btn btn-primary ms-2" onclick="showLoginModal()">Login</button>
      </div>`;
  }
  
  try {
    await loadAllData();
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
            ${usersData.length > 0 ? usersData.map(u => `
              <tr>
                <td>${u.id || u.Id}</td>
                <td>${u.name || u.Name}</td>
                <td>${u.email || u.Email}</td>
                <td><span class="badge ${(u.role || u.Role) === 'Admin' ? 'bg-danger' : 'bg-primary'}">${u.role || u.Role}</span></td>
                <td class="action-buttons">
                  <button class="btn btn-warning btn-sm" onclick="openUserForm(${u.id || u.Id})"><i class="fa-solid fa-pen"></i> Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="confirmDeleteUser(${u.id || u.Id})"><i class="fa-solid fa-trash"></i> Delete</button>
                </td>
              </tr>
            `).join('') : '<tr><td colspan="5" class="text-center">No users found</td></tr>'}
          </tbody>
        </table>
      </div>`;
  } catch (error) {
    return `<div class="alert alert-danger">Failed to load users: ${error.message}</div>`;
  }
}

function openUserForm(id = null){
  let userData = {name:"",email:"",role:"User"};
  
  if(id) {
    const user = usersData.find(u => (u.id || u.Id) == id);
    if(user) {
      userData = {
        name: user.name || user.Name || "",
        email: user.email || user.Email || "",
        role: user.role || user.Role || "User"
      };
    }
  }
  
  const isEdit = id !== null;
  document.getElementById("modalTitle").innerText = isEdit ? "Edit User" : "Add User";
  document.getElementById("modalBody").innerHTML = `
    <input type="hidden" id="userId" value="${isEdit ? id : ''}">
    <div class="mb-3">
      <label class="form-label">User Name *</label>
      <input class="form-control" id="userName" value="${userData.name}" placeholder="Enter user name" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Email *</label>
      <input type="email" class="form-control" id="userEmail" value="${userData.email}" placeholder="Enter email" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Password ${isEdit ? '' : '*'}</label>
      <input type="password" class="form-control" id="userPassword" placeholder="Enter password" ${isEdit ? '' : 'required'}>
      ${isEdit ? '<div class="form-text">Leave blank to keep current password</div>' : ''}
    </div>
    <div class="mb-3">
      <label class="form-label">Role *</label>
      <select class="form-control" id="userRole" required>
        <option value="">Select Role</option>
        <option value="Admin" ${userData.role === 'Admin' ? 'selected' : ''}>Admin</option>
        <option value="User" ${userData.role === 'User' ? 'selected' : ''}>User</option>
      </select>
    </div>`;
  document.getElementById("modalSave").onclick = () => saveUser(id);
  // Reset modal save button text
  document.getElementById("modalSave").textContent = "Save";
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
      showApiStatus('User updated successfully');
    } else {
      // Create new user
      await createUser(userData);
      showApiStatus('User created successfully');
    }
    
    // Close modal and refresh data
    bootstrap.Modal.getInstance(document.getElementById("mainModal")).hide();
    await loadPage('users');
  } catch (error) {
    console.error('Failed to save user:', error);
    showApiStatus('Failed to save user. Please try again.', false);
  }
}

async function confirmDeleteUser(id) {
  showConfirmation(`Are you sure you want to delete this user? This action cannot be undone.`, 
    async () => {
      try {
        await deleteUser(id);
        showApiStatus('User deleted successfully');
        await loadPage('users');
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
    if (page === "dashboard") {
      content.innerHTML = await renderDashboard();
    } else if (page === "hotels") {
      content.innerHTML = await renderHotels();
    } else if (page === "rooms") {
      content.innerHTML = await renderRooms();
    } else if (page === "inventory") {
      content.innerHTML = await renderInventory();
    } else if (page === "bookings") {
      content.innerHTML = await renderBookings();
    } else if (page === "users") {
      content.innerHTML = await renderUsers();
    }
    
    await updateDashboardStats();
  } catch (error) {
    console.error(`Error loading ${page}:`, error);
    content.innerHTML = `<div class="alert alert-danger">Failed to load ${page}: ${error.message}</div>`;
  }
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', async function() {
  // Load initial data and update dashboard stats
  await updateDashboardStats();
  
  // Add logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      showConfirmation('Are you sure you want to logout?', function() {
        setAuthToken(null);
        showApiStatus('You have been logged out successfully.');
        // Reload the page to reset the interface
        location.reload();
      });
    });
  }
  
  // Add login button functionality if not authenticated
  if (!isAuthenticated()) {
    // Add login button to navbar or show login modal immediately
    const navbarContent = document.querySelector('.navbar-nav');
    if (navbarContent) {
      const loginBtn = document.createElement('li');
      loginBtn.className = 'nav-item';
      loginBtn.innerHTML = '<a class="nav-link" href="#" onclick="showLoginModal()"><i class="fa-solid fa-sign-in-alt"></i> Login</a>';
      navbarContent.appendChild(loginBtn);
    }
  }
  
  // Test API connection on load
  try {
    await loadAllData();
    const authStatus = isAuthenticated() ? 'authenticated' : 'guest mode';
    showApiStatus(`Connected to API server (${authStatus})`, true);
  } catch (error) {
    showApiStatus('Failed to connect to API server', false);
  }
})