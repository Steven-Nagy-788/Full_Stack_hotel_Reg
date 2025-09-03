### **Part 1: Backend Development (API & Business Logic)**
*(Primary Owner: Backend Developer)*

*   **Task 1.1: Implement Admin Hotels Management API**
    *   **Description:** Create secure API endpoints for Admins to perform CRUD (Create, Read, Update, Delete) operations on hotels.
    *   **Endpoints:** `POST`, `PUT`, `DELETE /api/admin/hotels`
    *   **Wireframe:** Hotels Management

*   **Task 1.2: Implement Admin Room Types Management API**
    *   **Description:** Create secure API endpoints for Admins to manage room types associated with a specific hotel.
    *   **Endpoints:** `POST`, `PUT`, `DELETE /api/admin/hotels/{id}/room-types`
    *   **Wireframe:** Room Types

*   **Task 1.3: Implement Admin Inventory Management API**
    *   **Description:** Create a secure API endpoint for Admins to set the number of available rooms (`total_rooms`) for a specific room type over a date range.
    *   **Endpoint:** `PUT /api/admin/room-inventory`
    *   **Wireframe:** Inventory Calendar

*   **Task 1.4: Implement Public Hotel Search & Details API**
    *   **Description:** Create public API endpoints for users to search for hotels by city and dates, and to retrieve the full details of a single hotel, including its available rooms.
    *   **Endpoints:** `GET /api/hotels`, `GET /api/hotels/{id}`
    *   **Wireframes:** Home Search, Results List, Hotel Details

*   **Task 1.5: Implement User Booking API**
    *   **Description:** Create secure API endpoints for authenticated users to submit a new reservation request (`PENDING`), view their booking history, and cancel a confirmed booking.
    *   **Endpoints:** `POST /api/bookings`, `GET /api/me/bookings`, `PATCH /api/bookings/{id}/cancel`
    *   **Wireframes:** Booking Flow, My Bookings

*   **Task 1.6: Implement Admin Booking Confirmation API**
    *   **Description:** Create secure API endpoints for Admins to list pending reservations and to either confirm or reject them. Confirming a booking should update the `sold_rooms` count in the inventory.
    *   **Endpoints:** `GET /api/admin/bookings?status=PENDING`, `PATCH /api/admin/bookings/{id}/confirm`, `PATCH /api/admin/bookings/{id}/reject`
    *   **Wireframes:** Dashboard, Booking Confirmation

---

### **Part 2: Frontend Development (User Interface)**
*(Primary Owner: Frontend / Full-Stack Developer)*

*   **Task 2.1: Build Main Layout & Navigation**    veronia
    *   **Description:** Create the main layout for the public-facing site, including the header (Logo, Hotels, My Bookings) and footer.
    *   **Wireframes:** Home Search, Hotel Details

*   **Task 2.2: Build Home Search & Results Page**   veronia
    *   **Description:** Develop the home page with the search form. Implement the functionality to call the search API and display the list of matching hotels.
    *   **Wireframes:** Home Search, Results List

*   **Task 2.3: Build Hotel Details Page**   veronia
    *   **Description:** Develop the page that shows details for a single hotel. This page must list available room types and prices for the user's selected dates and allow them to proceed to booking.
    *   **Wireframe:** Hotel Details

*   **Task 2.4: Build Booking Flow Page**  
    *   **Description:** Create the final booking form where a user confirms their details and submits the reservation request to the backend.
    *   **Wireframe:** Booking Flow

*   **Task 2.5: Build "My Bookings" Page**
    *   **Description:** Develop the page where logged-in users can see a list of their past and upcoming bookings, view their status, and access the cancel functionality.
    *   **Wireframe:** My Bookings

*   **Task 2.6: Style Authentication Pages**  veronia
    *   **Description:** Apply the project's CSS styling to the pre-built Login and Registration pages to ensure a consistent look and feel.

---

### **Part 3: Frontend Development (Admin Dashboard)**
*(Primary Owner: Frontend / Full-Stack Developer)*

*   **Task 3.1: Build Admin Layout & Navigation**   veronia 
    *   **Description:** Create a distinct layout for the admin section, featuring a sidebar for navigating between different management pages (Dashboard, Hotels, etc.).
    *   **Wireframe:** Dashboard

*   **Task 3.2: Build Admin Dashboard Home** veronia
    *   **Description:** Develop the main dashboard view that fetches and displays a list of all `PENDING` reservations, with buttons to trigger the confirm/reject API calls.
    *   **Wireframe:** Dashboard

*   **Task 3.3: Build Hotels Management Page**  
    *   **Description:** Create the UI for Admins to view a list of all hotels, and include forms (e.g., in modals) for adding, editing, and deleting hotels.
    *   **Wireframe:** Hotels Management

*   **Task 3.4: Build Room Types Management UI**
    *   **Description:** On the hotel management page, build the interface that allows Admins to manage the room types for the selected hotel.
    *   **Wireframe:** Room Types

*   **Task 3.5: Build Inventory Calendar UI**
    *   **Description:** Develop the calendar-based interface for Admins to manage room availability. This will require a date picker and a form to submit inventory updates.
    *   **Wireframe:** Inventory Calendar
