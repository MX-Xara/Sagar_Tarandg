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
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const loginSubmitBtn = document.getElementById('loginSubmitBtn');
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

  // --- Firebase Admin Role Authorization Helper ---
  async function verifyAdminRole(user) {
    if (!user || !db) return false;
    try {
      const adminDoc = await db.collection('admin').doc(user.uid).get();
      if (adminDoc.exists && adminDoc.data()?.role === 'admin') {
        return true;
      }
      return false;
    } catch (e) {
      console.error("Admin role verification error:", e);
      return false;
    }
  }

  let isFirebaseListenerInitialized = false;

  // --- Auth State Protection Listener ---
  function initAuthStateListener() {
    if (typeof auth === 'undefined' || !auth) {
      console.error("Firebase Auth is not loaded.");
      return;
    }

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const isAuthorizedAdmin = await verifyAdminRole(user);
        if (isAuthorizedAdmin) {
          if (loginGate) loginGate.style.display = 'none';
          if (dashboardApp) dashboardApp.style.display = 'block';
          if (loginErrorMsg) loginErrorMsg.style.display = 'none';
          if (!isFirebaseListenerInitialized) {
            initFirebaseListener();
            isFirebaseListenerInitialized = true;
          }
        } else {
          // Account exists in Auth but UID is not authorized in admins collection
          await auth.signOut();
          if (loginGate) loginGate.style.display = 'flex';
          if (dashboardApp) dashboardApp.style.display = 'none';
          if (loginErrorMsg) {
            loginErrorMsg.textContent = "You are not authorized to access the owner portal.";
            loginErrorMsg.style.display = 'block';
          }
        }
      } else {
        if (loginGate) loginGate.style.display = 'flex';
        if (dashboardApp) dashboardApp.style.display = 'none';
      }
    });
  }

  // Handle Firebase Email/Password Login submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      if (!email || !password) {
        if (loginErrorMsg) {
          loginErrorMsg.textContent = "Please enter both email and password.";
          loginErrorMsg.style.display = 'block';
        }
        return;
      }

      if (loginSubmitBtn) {
        loginSubmitBtn.disabled = true;
        loginSubmitBtn.textContent = "SIGNING IN...";
      }

      try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        const isAuthorizedAdmin = await verifyAdminRole(user);

        if (isAuthorizedAdmin) {
          if (loginErrorMsg) loginErrorMsg.style.display = 'none';
          if (passwordInput) passwordInput.value = '';
        } else {
          await auth.signOut();
          if (loginErrorMsg) {
            loginErrorMsg.textContent = "You are not authorized to access the owner portal.";
            loginErrorMsg.style.display = 'block';
          }
          if (passwordInput) passwordInput.value = '';
        }
      } catch (err) {
        console.error("Firebase Login Error:", err);
        await auth.signOut().catch(() => { });
        if (loginErrorMsg) {
          loginErrorMsg.textContent = "Invalid email or password.";
          loginErrorMsg.style.display = 'block';
        }
        if (passwordInput) {
          passwordInput.value = '';
          passwordInput.focus();
        }
      } finally {
        if (loginSubmitBtn) {
          loginSubmitBtn.disabled = false;
          loginSubmitBtn.textContent = "Sign In";
        }
      }
    });
  }

  // Handle Logout action
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        if (typeof auth !== 'undefined' && auth) {
          await auth.signOut();
        }
      } catch (e) {
        console.error("Logout error:", e);
      }
      window.location.reload();
    });
  }

  // --- Navigation & View Switching (Bookings vs Pricing) ---
  const bookingsTabBtn = document.getElementById('bookingsTabBtn');
  const pricingTabBtn = document.getElementById('pricingTabBtn');
  const bookingsView = document.getElementById('bookingsView');
  const pricingView = document.getElementById('pricingView');
  const pricingToast = document.getElementById('pricingToast');

  function switchTab(targetTab) {
    if (targetTab === 'pricing') {
      if (bookingsView) bookingsView.style.display = 'none';
      if (pricingView) pricingView.style.display = 'block';
      if (bookingsTabBtn) bookingsTabBtn.classList.remove('active');
      if (pricingTabBtn) pricingTabBtn.classList.add('active');
      loadRoomPricing();
      loadSpecialDates();
    } else {
      if (pricingView) pricingView.style.display = 'none';
      if (bookingsView) bookingsView.style.display = 'block';
      if (pricingTabBtn) pricingTabBtn.classList.remove('active');
      if (bookingsTabBtn) bookingsTabBtn.classList.add('active');
    }
  }

  if (bookingsTabBtn) {
    bookingsTabBtn.addEventListener('click', () => switchTab('bookings'));
  }
  if (pricingTabBtn) {
    pricingTabBtn.addEventListener('click', () => switchTab('pricing'));
  }

  // Check URL hash for direct navigation e.g. admin.html#pricing
  if (window.location.hash === '#pricing') {
    switchTab('pricing');
  }

  // Toast Helper
  function showPricingToast(message, isError = false) {
    if (!pricingToast) return;
    pricingToast.textContent = message;
    pricingToast.className = `toast-message ${isError ? 'toast-error' : 'toast-success'}`;
    pricingToast.style.display = 'flex';
    setTimeout(() => {
      pricingToast.style.display = 'none';
    }, 4000);
  }

  // --- ROOM PRICING ENGINE ---
  const ROOM_PRICING_CONFIG = {
    gardenFacing: { roomType: "Garden Facing", defaultWeekdays: 4500, defaultWeekends: 5500 },
    acDoublebed: { roomType: "AC Double Bed Room", defaultWeekdays: 7500, defaultWeekends: 8500 },
    seasideDeluxe: { roomType: "Sea Side Deluxe", defaultWeekdays: 6000, defaultWeekends: 7000 },
    executiveDeluxe: { roomType: "Executive Deluxe", defaultWeekdays: 5500, defaultWeekends: 6500 },
    superDeluxe: { roomType: "Super Deluxe", defaultWeekdays: 8000, defaultWeekends: 9000 }
  };

  async function loadRoomPricing() {
    if (!db) return;
    try {
      const snapshot = await db.collection('pricing').get();
      const pricingMap = {};
      snapshot.forEach(doc => {
        pricingMap[doc.id] = doc.data();
      });

      Object.keys(ROOM_PRICING_CONFIG).forEach(docId => {
        const config = ROOM_PRICING_CONFIG[docId];
        const data = pricingMap[docId] || {};

        const weekdaysInput = document.getElementById(`price-${docId}-weekdays`);
        const weekendsInput = document.getElementById(`price-${docId}-weekends`);

        const weekdaysVal = (typeof data.weekdays === 'number') ? data.weekdays : ((typeof data.weekday === 'number') ? data.weekday : config.defaultWeekdays);
        const weekendsVal = (typeof data.weekends === 'number') ? data.weekends : ((typeof data.weekend === 'number') ? data.weekend : config.defaultWeekends);

        if (weekdaysInput) {
          weekdaysInput.value = weekdaysVal;
        }
        if (weekendsInput) {
          weekendsInput.value = weekendsVal;
        }
      });
    } catch (e) {
      console.error("Error loading room pricing:", e);
      showPricingToast("Failed to load room prices from Firestore.", true);
    }
  }

  // Handle Room Pricing Forms Save
  const roomPricingForms = document.querySelectorAll('.room-pricing-form');
  roomPricingForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const docId = form.getAttribute('data-doc-id');
      const roomType = form.getAttribute('data-room-type');
      const submitBtn = form.querySelector('.save-price-btn');

      const weekdaysInput = document.getElementById(`price-${docId}-weekdays`);
      const weekendsInput = document.getElementById(`price-${docId}-weekends`);

      const weekdaysVal = parseInt(weekdaysInput.value, 10);
      const weekendsVal = parseInt(weekendsInput.value, 10);

      if (isNaN(weekdaysVal) || isNaN(weekendsVal) || weekdaysVal < 0 || weekendsVal < 0) {
        showPricingToast("Please enter valid prices.", true);
        return;
      }

      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "SAVING...";

      try {
        const updateData = {
          roomType: roomType,
          weekdays: weekdaysVal,
          weekends: weekendsVal
        };
        // Also include singular weekday/weekend for compatibility with existing acDoublebed docs
        if (docId === 'acDoublebed' || docId === 'acDoubleBed') {
          updateData.weekday = weekdaysVal;
          updateData.weekend = weekendsVal;
        }

        await db.collection('pricing').doc(docId).set(updateData, { merge: true });

        // Re-read saved document to ensure UI reflects database
        const updatedDoc = await db.collection('pricing').doc(docId).get();
        if (updatedDoc.exists) {
          const freshData = updatedDoc.data();
          const freshWeekdays = (typeof freshData.weekdays === 'number') ? freshData.weekdays : freshData.weekday;
          const freshWeekends = (typeof freshData.weekends === 'number') ? freshData.weekends : freshData.weekend;
          if (typeof freshWeekdays === 'number') weekdaysInput.value = freshWeekdays;
          if (typeof freshWeekends === 'number') weekendsInput.value = freshWeekends;
        }

        showPricingToast(`${roomType} pricing updated successfully.`);
      } catch (err) {
        console.error("Failed to save room pricing:", err);
        showPricingToast(`Error saving ${roomType} pricing: ${err.message}`, true);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  });

  // --- SPECIAL DATES MANAGEMENT ---
  const specialDateModal = document.getElementById('specialDateModal');
  const specialDateForm = document.getElementById('specialDateForm');
  const addSpecialDateBtn = document.getElementById('addSpecialDateBtn');
  const closeSpecialDateModal = document.getElementById('closeSpecialDateModal');
  const cancelSpecialDateBtn = document.getElementById('cancelSpecialDateBtn');
  const specialDatesTableBody = document.getElementById('specialDatesTableBody');
  const noSpecialDatesMsg = document.getElementById('noSpecialDatesMsg');
  const editingSpecialDateId = document.getElementById('editingSpecialDateId');
  const specialDateModalTitle = document.getElementById('specialDateModalTitle');

  let allSpecialDates = [];

  function loadSpecialDates() {
    if (!db) return;
    db.collection('specialDates').onSnapshot((snapshot) => {
      allSpecialDates = [];
      snapshot.forEach(doc => {
        allSpecialDates.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Sort special dates chronologically
      allSpecialDates.sort((a, b) => (a.date || a.id).localeCompare(b.date || b.id));

      renderSpecialDatesTable();
    }, (err) => {
      console.error("Special dates snapshot listener error:", err);
    });
  }

  function renderSpecialDatesTable() {
    if (!specialDatesTableBody) return;
    specialDatesTableBody.innerHTML = '';

    if (allSpecialDates.length === 0) {
      if (noSpecialDatesMsg) noSpecialDatesMsg.style.display = 'flex';
      return;
    }

    if (noSpecialDatesMsg) noSpecialDatesMsg.style.display = 'none';

    allSpecialDates.forEach(sd => {
      const tr = document.createElement('tr');
      const acPrice = sd.acDoublebed ?? sd.acDoubleBed ?? 0;
      tr.innerHTML = `
        <td style="font-weight: 600; color: var(--color-dark-taupe);">${formatHumanDate(sd.date || sd.id)}</td>
        <td class="text-right">${formatCurrency(sd.gardenFacing || 0)}</td>
        <td class="text-right">${formatCurrency(acPrice)}</td>
        <td class="text-right">${formatCurrency(sd.seasideDeluxe || 0)}</td>
        <td class="text-right">${formatCurrency(sd.executiveDeluxe || 0)}</td>
        <td class="text-right">${formatCurrency(sd.superDeluxe || 0)}</td>
        <td class="text-center">
          <button class="btn-icon edit-btn" data-id="${sd.id}">EDIT</button>
          <button class="btn-icon delete-btn" data-id="${sd.id}" data-date="${sd.date || sd.id}">DELETE</button>
        </td>
      `;
      specialDatesTableBody.appendChild(tr);
    });

    // Attach Event Listeners to Edit and Delete Buttons
    specialDatesTableBody.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openEditSpecialDateModal(id);
      });
    });

    specialDatesTableBody.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const dateStr = btn.getAttribute('data-date');
        deleteSpecialDate(id, dateStr);
      });
    });
  }

  function openAddSpecialDateModal() {
    if (!specialDateModal) return;
    specialDateForm.reset();
    editingSpecialDateId.value = '';
    const dateInput = document.getElementById('specialDateInput');
    if (dateInput) dateInput.readOnly = false;
    specialDateModalTitle.textContent = "Add Special Date";
    specialDateModal.style.display = 'flex';
  }

  function openEditSpecialDateModal(id) {
    const sd = allSpecialDates.find(item => item.id === id);
    if (!sd || !specialDateModal) return;

    specialDateForm.reset();
    editingSpecialDateId.value = sd.id;
    specialDateModalTitle.textContent = "Edit Special Date";

    const dateInput = document.getElementById('specialDateInput');
    if (dateInput) {
      dateInput.value = sd.date || sd.id;
      dateInput.readOnly = true; // Date key is fixed when editing
    }

    document.getElementById('sd-gardenFacing').value = sd.gardenFacing || '';
    const acEl = document.getElementById('sd-acDoublebed');
    if (acEl) acEl.value = sd.acDoublebed ?? sd.acDoubleBed ?? '';
    document.getElementById('sd-seasideDeluxe').value = sd.seasideDeluxe || '';
    document.getElementById('sd-executiveDeluxe').value = sd.executiveDeluxe || '';
    document.getElementById('sd-superDeluxe').value = sd.superDeluxe || '';

    specialDateModal.style.display = 'flex';
  }

  function closeSpecialDateModalFunc() {
    if (specialDateModal) specialDateModal.style.display = 'none';
  }

  if (addSpecialDateBtn) addSpecialDateBtn.addEventListener('click', openAddSpecialDateModal);
  if (closeSpecialDateModal) closeSpecialDateModal.addEventListener('click', closeSpecialDateModalFunc);
  if (cancelSpecialDateBtn) cancelSpecialDateBtn.addEventListener('click', closeSpecialDateModalFunc);

  if (specialDateForm) {
    specialDateForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const dateVal = document.getElementById('specialDateInput').value;
      const gfVal = parseInt(document.getElementById('sd-gardenFacing').value, 10);
      const acVal = parseInt(document.getElementById('sd-acDoublebed').value, 10);
      const ssVal = parseInt(document.getElementById('sd-seasideDeluxe').value, 10);
      const edVal = parseInt(document.getElementById('sd-executiveDeluxe').value, 10);
      const sdVal = parseInt(document.getElementById('sd-superDeluxe').value, 10);

      if (!dateVal || isNaN(gfVal) || isNaN(acVal) || isNaN(ssVal) || isNaN(edVal) || isNaN(sdVal)) {
        showPricingToast("Please fill in valid prices for all 5 room types.", true);
        return;
      }

      const saveBtn = document.getElementById('saveSpecialDateBtn');
      saveBtn.disabled = true;
      saveBtn.textContent = "SAVING...";

      try {
        const docId = dateVal; // Use date string YYYY-MM-DD as document ID
        await db.collection('specialDates').doc(docId).set({
          date: dateVal,
          gardenFacing: gfVal,
          acDoublebed: acVal,
          acDoubleBed: acVal,
          seasideDeluxe: ssVal,
          executiveDeluxe: edVal,
          superDeluxe: sdVal
        });

        showPricingToast(`Special date pricing for ${formatHumanDate(dateVal)} saved successfully.`);
        closeSpecialDateModalFunc();
      } catch (err) {
        console.error("Failed to save special date pricing:", err);
        showPricingToast(`Failed to save special date: ${err.message}`, true);
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save Special Date";
      }
    });
  }

  async function deleteSpecialDate(id, dateStr) {
    const formatted = formatHumanDate(dateStr);
    if (!confirm(`Are you sure you want to delete pricing for ${formatted}?`)) {
      return;
    }

    try {
      await db.collection('specialDates').doc(id).delete();
      showPricingToast(`Special date pricing for ${formatted} deleted successfully.`);
    } catch (err) {
      console.error("Failed to delete special date:", err);
      showPricingToast(`Error deleting special date: ${err.message}`, true);
    }
  }

  // Check auth state on initial load
  initAuthStateListener();
});

