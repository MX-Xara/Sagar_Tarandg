// =================================================================
// Sagar Taranga Resort - Owner Booking Dashboard Controller
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const totalBookingsCountEl = document.getElementById('totalBookingsCount');
  const todayCheckinsCountEl = document.getElementById('todayCheckinsCount');
  const totalRevenueAmountEl = document.getElementById('totalRevenueAmount');
  const currentDateLabelEl = document.getElementById('currentDateLabel');
  
  const guestSearchInput = document.getElementById('guestSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const visibleEntriesLabel = document.getElementById('visibleEntriesLabel');
  
  const tableLoader = document.getElementById('tableLoader');
  const emptyState = document.getElementById('emptyState');
  const tableContainer = document.getElementById('tableContainer');
  const bookingsTableBody = document.getElementById('bookingsTableBody');

  // --- Login DOM Elements ---
  const loginGate = document.getElementById('loginGate');
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('usernameInput');
  const passwordInput = document.getElementById('passwordInput');
  const loginErrorMsg = document.getElementById('loginErrorMsg');
  const dashboardApp = document.getElementById('dashboardApp');
  const logoutBtn = document.getElementById('logoutBtn');

  // Cache list of all bookings fetched from Firebase
  let allBookings = [];

  // --- Date Helpers ---
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper to format date string (YYYY-MM-DD) to "17 June 2026"
  function formatHumanDate(dateStr) {
    if (!dateStr) return "-";
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        // Correctly parse local date without timezone shifts
        const year = parseInt(parts[0], 10);
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        return `${day} ${monthNames[monthIndex]} ${year}`;
      }
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    } catch (e) {
      return dateStr;
    }
  }

  // Helper to format booking creation timestamp (ISO) to "17 June 2026, 09:30 AM"
  function formatHumanDateTime(dateStr) {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      
      const day = d.getDate();
      const month = monthNames[d.getMonth()];
      const year = d.getFullYear();
      
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 hour should be 12
      
      return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
    } catch (e) {
      return dateStr;
    }
  }

  // Format currency to Indian Rupees (INR) format (e.g. ₹1,24,500)
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  }

  // Dynamic date calculation for status badge (Upcoming, Active, Completed)
  function calculateBookingStatus(checkInStr, checkOutStr) {
    if (!checkInStr || !checkOutStr) {
      return { label: 'Unknown', className: 'status-completed' };
    }
    try {
      const now = new Date();
      // Current date at midnight
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      
      const checkInParts = checkInStr.split('-');
      const checkOutParts = checkOutStr.split('-');
      
      // Check-in and out dates at midnight
      const checkIn = new Date(
        parseInt(checkInParts[0], 10),
        parseInt(checkInParts[1], 10) - 1,
        parseInt(checkInParts[2], 10)
      ).getTime();
      
      const checkOut = new Date(
        parseInt(checkOutParts[0], 10),
        parseInt(checkOutParts[1], 10) - 1,
        parseInt(checkOutParts[2], 10)
      ).getTime();
      
      if (today < checkIn) {
        return { label: 'Upcoming', className: 'status-upcoming' };
      } else if (today >= checkIn && today <= checkOut) {
        return { label: 'Checked In', className: 'status-active' };
      } else {
        return { label: 'Completed', className: 'status-completed' };
      }
    } catch (e) {
      return { label: 'Error', className: 'status-completed' };
    }
  }

  // Set the description of today's check-ins with the current local date
  function updateTodayLabel() {
    const today = new Date();
    const formatted = `${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;
    if (currentDateLabelEl) {
      currentDateLabelEl.textContent = `For today: ${formatted}`;
    }
  }
  updateTodayLabel();

  // --- Real-time updates from Firebase ---
  function initFirebaseListener() {
    // Enable offline persistence if available, ignore errors
    try {
      db.settings({ cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED });
    } catch (e) {
      // settings already initialized or not supported
    }

    // Attach real-time snapshot listener on the 'bookings' collection
    db.collection("bookings").onSnapshot((snapshot) => {
      allBookings = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        allBookings.push({
          id: doc.id,
          name: data.name || 'No Name',
          phone: data.phone || 'N/A',
          email: data.email || 'N/A',
          checkIn: data.checkIn || '',
          checkOut: data.checkOut || '',
          roomType: data.roomType || 'N/A',
          adults: parseInt(data.adults, 10) || 0,
          children: parseInt(data.children, 10) || 0,
          nights: parseInt(data.nights, 10) || 0,
          amount: parseFloat(data.amount) || 0,
          paymentId: data.paymentId || 'N/A',
          bookedAt: data.bookedAt || ''
        });
      });

      // Sort: Newest booking first (using 'bookedAt' field, falling back to 'checkIn')
      allBookings.sort((a, b) => {
        const valA = a.bookedAt || a.checkIn || '';
        const valB = b.bookedAt || b.checkIn || '';
        return valB.localeCompare(valA);
      });

      // Recalculate and update top statistics
      updateDashboardStats();

      // Render bookings to table list
      filterAndRenderBookings();
      
      // Hide loader once the first sync completes
      if (tableLoader) {
        tableLoader.style.display = 'none';
      }
    }, (error) => {
      console.error("Firestore real-time sync failed:", error);
      alert("Error syncing bookings: " + error.message);
      if (tableLoader) {
        tableLoader.innerHTML = `<p class="loader-text" style="color: red;">Failed to sync data. Please check your Firebase config.</p>`;
      }
    });
  }

  // --- Render & UI Refresh Logic ---
  function updateDashboardStats() {
    const total = allBookings.length;
    
    // Find Today's Check-ins (matches YYYY-MM-DD local format)
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    
    const todayCheckinsCount = allBookings.filter(b => b.checkIn === todayStr).length;
    
    // Sum total revenue
    const revenue = allBookings.reduce((sum, b) => sum + b.amount, 0);

    // Apply values to DOM
    if (totalBookingsCountEl) totalBookingsCountEl.textContent = total;
    if (todayCheckinsCountEl) todayCheckinsCountEl.textContent = todayCheckinsCount;
    if (totalRevenueAmountEl) totalRevenueAmountEl.textContent = formatCurrency(revenue);
  }

  function filterAndRenderBookings() {
    const query = guestSearchInput.value.trim().toLowerCase();
    
    // Filter bookings based on Search Text (matches guest name or phone number)
    const filtered = allBookings.filter(booking => {
      const matchName = booking.name.toLowerCase().includes(query);
      const matchPhone = booking.phone.toLowerCase().includes(query);
      return matchName || matchPhone;
    });

    // Toggle empty states or table view
    if (allBookings.length === 0) {
      emptyState.style.display = 'flex';
      tableContainer.style.display = 'none';
      visibleEntriesLabel.textContent = "Showing 0 entries";
    } else if (filtered.length === 0) {
      emptyState.style.display = 'flex';
      tableContainer.style.display = 'none';
      visibleEntriesLabel.textContent = `No matches for "${guestSearchInput.value}"`;
    } else {
      emptyState.style.display = 'none';
      tableContainer.style.display = 'block';
      visibleEntriesLabel.textContent = `Showing ${filtered.length} of ${allBookings.length} entries`;
      
      // Build rows
      bookingsTableBody.innerHTML = '';
      filtered.forEach(booking => {
        const row = document.createElement('tr');
        
        // Calculate status dynamic badge
        const status = calculateBookingStatus(booking.checkIn, booking.checkOut);

        row.innerHTML = `
          <td class="guest-name-cell">${escapeHTML(booking.name)}</td>
          <td>${escapeHTML(booking.phone)}</td>
          <td>${escapeHTML(booking.email)}</td>
          <td>${formatHumanDate(booking.checkIn)}</td>
          <td>${formatHumanDate(booking.checkOut)}</td>
          <td>${escapeHTML(booking.roomType)}</td>
          <td class="text-center">${booking.adults}</td>
          <td class="text-center">${booking.children}</td>
          <td class="text-center">${booking.nights}</td>
          <td class="text-right" style="font-weight: 500;">${formatCurrency(booking.amount)}</td>
          <td style="font-family: monospace; font-size: 13px; color: var(--color-text-muted);">${escapeHTML(booking.paymentId)}</td>
          <td style="font-size: 13px; color: var(--color-text-muted);">${formatHumanDateTime(booking.bookedAt)}</td>
          <td class="text-center">
            <span class="status-badge ${status.className}">${status.label}</span>
          </td>
        `;
        bookingsTableBody.appendChild(row);
      });
    }
  }

  // Prevent HTML injection from input data
  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // --- Search Input Listeners ---
  guestSearchInput.addEventListener('input', () => {
    if (guestSearchInput.value.length > 0) {
      clearSearchBtn.style.display = 'inline-block';
    } else {
      clearSearchBtn.style.display = 'none';
    }
    filterAndRenderBookings();
  });

  clearSearchBtn.addEventListener('click', () => {
    guestSearchInput.value = '';
    clearSearchBtn.style.display = 'none';
    guestSearchInput.focus();
    filterAndRenderBookings();
  });

  // --- Basic Security Gate Initialization ---
  function checkLoginState() {
    const isLoggedIn = sessionStorage.getItem('resortOwnerLoggedIn') === 'true';
    if (isLoggedIn) {
      if (loginGate) loginGate.style.display = 'none';
      if (dashboardApp) dashboardApp.style.display = 'block';
      // Load Firestore stream only after successful authentication
      initFirebaseListener();
    } else {
      if (loginGate) loginGate.style.display = 'flex';
      if (dashboardApp) dashboardApp.style.display = 'none';
    }
  }

  // Handle Login submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = usernameInput.value.trim();
      const password = passwordInput.value;

      if (username === 'sagartarang123' && password === 'sagartarang0000') {
        sessionStorage.setItem('resortOwnerLoggedIn', 'true');
        if (loginErrorMsg) loginErrorMsg.style.display = 'none';
        checkLoginState();
      } else {
        if (loginErrorMsg) {
          loginErrorMsg.style.display = 'block';
        }
        passwordInput.value = '';
        passwordInput.focus();
      }
    });
  }

  // Handle Logout action
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('resortOwnerLoggedIn');
      window.location.reload();
    });
  }

  // Check login state on initial load
  checkLoginState();
});
