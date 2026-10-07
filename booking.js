// ============================================================================
// SAGARTARANG BEACH RESORT — BOOKING PAGE
// 12-PHYSICAL-ROOM AVAILABILITY ENGINE
// ============================================================================
//
// FIRESTORE ROOM INVENTORY:
//
// Garden Facing:
// G-01, G-02, G-03, G-04
//
// Executive Deluxe:
// ED-01, ED-02, ED-03, ED-04
//
// Super Deluxe:
// SD-01, SD-02
//
// Sea Side Deluxe:
// SS-01, SS-02
//
// IMPORTANT:
// We DO NOT disable an entire date when one room is booked.
// Instead, we check which physical rooms are occupied.
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {

    // ========================================================================
    // 1. NAVBAR
    // ========================================================================

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navbar) {

        const handleScroll = () => {

            if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

        };

        window.addEventListener('scroll', handleScroll);

        handleScroll();
    }

    if (navToggle && navLinks) {

        navToggle.addEventListener('click', () => {

            navToggle.classList.toggle('open');
            navLinks.classList.toggle('open');

        });

        navLinks.querySelectorAll('a').forEach((link) => {

            link.addEventListener('click', () => {

                navToggle.classList.remove('open');
                navLinks.classList.remove('open');

            });

        });

    }


    // ========================================================================
    // 2. ROOM IMAGE DATA
    // ========================================================================

    const roomImagesData = {

        'Garden Facing': [

            'assets/Room Images/Garden Facing/IMG_9490.WEBP',

            'assets/Room Images/Garden Facing/IMG_9491.WEBP',

            'assets/Room Images/Garden Facing/IMG_9492.WEBP'

        ],


        'AC Double Bed Room': [

            'assets/Room Images/Super deluxe/fd516d8c-b05a-47e8-9332-5fec5f778823.jpg',

            'assets/Room Images/Super deluxe/95e8672d-913b-47f4-b3be-338cc99d9463.jpg',

            'assets/resort image.webp'

        ],


        'Executive Deluxe': [
            'assets/Room Images/Executive Deluxe/1.webp',
            'assets/Room Images/Executive Deluxe/2.webp',
            'assets/Room Images/Executive Deluxe/3.webp',
            'assets/Room Images/Executive Deluxe/4.webp',
            'assets/Room Images/Executive Deluxe/5.webp'
        ],


        'Super Deluxe': [

            'assets/Room Images/Super deluxe/fd516d8c-b05a-47e8-9332-5fec5f778823.jpg',

            'assets/Room Images/Super deluxe/95e8672d-913b-47f4-b3be-338cc99d9463.jpg',

            'assets/Room Images/Super deluxe/IMG_1944.WEBP',

            'assets/Room Images/Super deluxe/IMG_9487.JPG',

            'assets/Room Images/Super deluxe/IMG_9488.WEBP',

            'assets/Room Images/Super deluxe/PHOTO-2026-05-18-11-39-56.jpg'

        ],


        'Sea Side Deluxe': [

            'assets/Room Images/Sea side Deluxe/1.webp',

            'assets/Room Images/Sea side Deluxe/2.webp',



        ]

    };


    // Fallback image if an image cannot load.

    const fallbackImage =
        'assets/resort image.webp';



    // ========================================================================
    // 3. CAROUSEL
    // ========================================================================

    const carouselTrack =
        document.getElementById('modalCarouselTrack');

    const carouselDotsContainer =
        document.getElementById('modalCarouselDots');

    const carouselRoomTag =
        document.getElementById('modalCarouselTag');

    const prevBtn =
        document.getElementById('modalCarouselPrev');

    const nextBtn =
        document.getElementById('modalCarouselNext');


    let currentSlideIndex = 0;

    let totalSlides = 0;

    let autoSlideTimer = null;


    function loadRoomCarousel(roomName) {

        if (!carouselTrack) return;


        const images =
            roomImagesData[roomName] ||
            roomImagesData['Super Deluxe'] ||
            [fallbackImage];


        currentSlideIndex = 0;

        totalSlides = images.length;


        if (carouselRoomTag) {

            carouselRoomTag.textContent =
                roomName || 'Room Gallery';

        }


        carouselTrack.innerHTML = '';


        images.forEach((imgSrc) => {

            const slide =
                document.createElement('div');

            slide.className =
                'carousel-slide';


            const img =
                document.createElement('img');

            img.src = imgSrc;

            img.alt =
                `${roomName} image`;


            // If image fails, use fallback.

            img.onerror = () => {

                img.onerror = null;

                img.src = fallbackImage;

            };


            slide.appendChild(img);

            carouselTrack.appendChild(slide);

        });


        // Create carousel dots.

        if (carouselDotsContainer) {

            carouselDotsContainer.innerHTML = '';


            images.forEach((_, index) => {

                const dot =
                    document.createElement('div');


                dot.className =
                    `carousel-dot ${index === 0 ? 'active' : ''
                    }`;


                dot.addEventListener(
                    'click',
                    () => goToSlide(index)
                );


                carouselDotsContainer.appendChild(dot);

            });

        }


        updateSlidePosition();

        startAutoSlide();

    }


    function updateSlidePosition() {

        if (!carouselTrack) return;


        carouselTrack.style.transform =
            `translateX(-${currentSlideIndex * 100}%)`;


        if (carouselDotsContainer) {

            const dots =
                carouselDotsContainer.querySelectorAll(
                    '.carousel-dot'
                );


            dots.forEach((dot, index) => {

                dot.classList.toggle(
                    'active',
                    index === currentSlideIndex
                );

            });

        }

    }


    function goToSlide(index) {

        if (totalSlides === 0) return;


        currentSlideIndex =
            (index + totalSlides) % totalSlides;


        updateSlidePosition();

        resetAutoSlide();

    }


    function nextSlide() {

        goToSlide(
            currentSlideIndex + 1
        );

    }


    function prevSlide() {

        goToSlide(
            currentSlideIndex - 1
        );

    }


    if (prevBtn) {

        prevBtn.addEventListener(
            'click',
            prevSlide
        );

    }


    if (nextBtn) {

        nextBtn.addEventListener(
            'click',
            nextSlide
        );

    }


    function startAutoSlide() {

        stopAutoSlide();


        if (totalSlides > 1) {

            autoSlideTimer =
                setInterval(
                    nextSlide,
                    4500
                );

        }

    }


    function stopAutoSlide() {

        if (autoSlideTimer) {

            clearInterval(autoSlideTimer);

            autoSlideTimer = null;

        }

    }


    function resetAutoSlide() {

        stopAutoSlide();

        startAutoSlide();

    }



    // ========================================================================
    // 4. BOOKING MODAL
    // ========================================================================

    const bookingModal =
        document.getElementById('bookingModal');


    const closeBookingModal =
        document.getElementById('closeBookingModal');


    const bookRoomTypeInput =
        document.getElementById('bookRoomType');


    const modalRoomSubtitle =
        document.getElementById('modalRoomSubtitle');


    const bookNowTriggers =
        document.querySelectorAll(
            '.book-now-trigger'
        );


    const availabilityStatus =
        document.getElementById(
            'roomAvailabilityStatus'
        );


    const bookingSubmitBtn =
        document.getElementById(
            'booking-modal-submit-btn'
        );



    // ========================================================================
    // DYNAMIC PRICING ENGINE & PRICE BREAKDOWN
    // ========================================================================

    const PRICING_DOCUMENTS = {
        "Garden Facing": "gardenFacing",
        "AC Double Bed Room": "acDoubleBed",
        "Executive Deluxe": "executiveDeluxe",
        "Super Deluxe": "superDeluxe",
        "Sea Side Deluxe": "seasideDeluxe"
    };

    let cachedPricing = null;
    let cachedSpecialDates = {};

    async function fetchPricingSetup() {
        if (!db) return null;
        try {
            const pricingSnapshot = await db.collection('pricing').get();
            const pricingData = {};
            pricingSnapshot.forEach(doc => {
                pricingData[doc.id] = doc.data();
            });

            const specialDatesSnapshot = await db.collection('specialDates').get();
            const specialDatesData = {};
            specialDatesSnapshot.forEach(doc => {
                specialDatesData[doc.id] = doc.data();
            });

            cachedPricing = pricingData;
            cachedSpecialDates = specialDatesData;
            return { pricing: pricingData, specialDates: specialDatesData };
        } catch (e) {
            console.error("Failed to fetch pricing setup from Firestore:", e);
            return null;
        }
    }

    const DEFAULT_ROOM_PRICES = {
        gardenFacing: { weekdays: 4500, weekends: 5500 },
        acDoubleBed: { weekdays: 7500, weekends: 8500 },
        seasideDeluxe: { weekdays: 6000, weekends: 7000 },
        executiveDeluxe: { weekdays: 5500, weekends: 6500 },
        superDeluxe: { weekdays: 8000, weekends: 9000 }
    };

    // Update room starting prices on room cards (e.g. "₹8,000 Onwards")
    async function updateRoomCardPrices() {
        await fetchPricingSetup();

        const roomCards = document.querySelectorAll('.room-card');
        roomCards.forEach(card => {
            const titleEl = card.querySelector('.room-title');
            const priceEl = card.querySelector('.room-price');
            if (titleEl && priceEl) {
                const roomName = titleEl.textContent.trim();
                const normName = normalizeRoomType(roomName);
                const docId = PRICING_DOCUMENTS[normName];

                let startingPrice = (DEFAULT_ROOM_PRICES[docId] && DEFAULT_ROOM_PRICES[docId].weekdays) || 4500;
                const doc = cachedPricing && (cachedPricing[docId] || cachedPricing['acDoublebed'] || cachedPricing['acDoubleBed']);
                if (doc) {
                    const priceVal = (typeof doc.weekdays === 'number') ? doc.weekdays : ((typeof doc.weekday === 'number') ? doc.weekday : null);
                    if (priceVal && priceVal > 0) {
                        startingPrice = priceVal;
                    }
                }
                priceEl.textContent = `₹${startingPrice.toLocaleString('en-IN')} Onwards`;
            }
        });
    }

    // Initial call to update card starting prices
    updateRoomCardPrices();

    /**
     * Calculates nightly stay pricing following priority:
     * 1. SPECIAL DATE
     * 2. WEEKEND
     * 3. WEEKDAY
     */
    async function calculateStayPricing(roomType, checkInStr, checkOutStr) {
        if (!roomType || !checkInStr || !checkOutStr) return null;

        const normType = normalizeRoomType(roomType);
        const docId = PRICING_DOCUMENTS[normType];
        if (!docId) return null;

        if (!cachedPricing) {
            await fetchPricingSetup();
        }

        const defaults = {
            gardenFacing: { weekdays: 4500, weekends: 5500 },
            acDoubleBed: { weekdays: 7500, weekends: 8500 },
            seasideDeluxe: { weekdays: 6000, weekends: 7000 },
            executiveDeluxe: { weekdays: 5500, weekends: 6500 },
            superDeluxe: { weekdays: 8000, weekends: 9000 }
        };

        const roomPricingDoc = (cachedPricing && (cachedPricing[docId] || cachedPricing['acDoublebed'] || cachedPricing['acDoubleBed'])) || defaults[docId] || { weekdays: 4500, weekends: 5500 };
        const weekdayPrice = (typeof roomPricingDoc.weekdays === 'number') ? roomPricingDoc.weekdays : ((typeof roomPricingDoc.weekday === 'number') ? roomPricingDoc.weekday : 4500);
        const weekendPrice = (typeof roomPricingDoc.weekends === 'number') ? roomPricingDoc.weekends : ((typeof roomPricingDoc.weekend === 'number') ? roomPricingDoc.weekend : 5500);

        const checkIn = parseHotelDate(checkInStr);
        const checkOut = parseHotelDate(checkOutStr);

        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkOut <= checkIn) {
            return null;
        }

        const monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const breakdown = [];
        let totalAmount = 0;

        let current = new Date(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate());

        while (current < checkOut) {
            const yyyy = current.getFullYear();
            const mm = String(current.getMonth() + 1).padStart(2, '0');
            const dd = String(current.getDate()).padStart(2, '0');
            const dateKey = `${yyyy}-${mm}-${dd}`;
            const dayOfWeek = current.getDay();

            let nightPrice = 0;
            let rateType = '';

            // Priority 1: Special Date
            if (cachedSpecialDates && cachedSpecialDates[dateKey]) {
                const sd = cachedSpecialDates[dateKey];
                const specialVal = sd[docId] ?? sd.acDoublebed ?? sd.acDoubleBed;
                if (typeof specialVal === 'number' && specialVal > 0) {
                    nightPrice = specialVal;
                    rateType = 'Special Date';
                }
            }

            // Priority 2: Weekend (Sat/Sun)
            if (!nightPrice) {
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    nightPrice = weekendPrice;
                    rateType = 'Weekend';
                } else {
                    // Priority 3: Weekday
                    nightPrice = weekdayPrice;
                    rateType = 'Weekday';
                }
            }

            const dayName = current.toLocaleDateString('en-US', { weekday: 'short' });
            const monthName = monthShortNames[current.getMonth()];
            const formattedDate = `${current.getDate()} ${monthName} (${dayName})`;

            breakdown.push({
                dateKey,
                formattedDate,
                price: nightPrice,
                rateType
            });

            totalAmount += nightPrice;
            current.setDate(current.getDate() + 1);
        }

        return {
            totalAmount,
            nightsCount: breakdown.length,
            breakdown
        };
    }

    const priceBreakdownContainer = document.getElementById('priceBreakdownContainer');

    function resetPriceBreakdown() {
        if (!priceBreakdownContainer) return;
        priceBreakdownContainer.innerHTML = '';
        priceBreakdownContainer.style.display = 'none';
    }

    async function updatePriceBreakdownDisplay() {
        if (!priceBreakdownContainer) return;

        const roomType = bookRoomTypeInput?.value || '';
        const checkIn = document.getElementById('bookCheckIn')?.value || '';
        const checkOut = document.getElementById('bookCheckOut')?.value || '';

        if (!roomType || !checkIn || !checkOut) {
            resetPriceBreakdown();
            return;
        }

        try {
            const pricing = await calculateStayPricing(roomType, checkIn, checkOut);
            if (!pricing || !pricing.breakdown || pricing.breakdown.length === 0) {
                resetPriceBreakdown();
                return;
            }

            priceBreakdownContainer.style.display = 'block';
            priceBreakdownContainer.innerHTML = `
                <div class="breakdown-card">
                    <div class="breakdown-header">Price Breakdown</div>
                    <ul class="breakdown-list">
                        ${pricing.breakdown.map(item => `
                            <li class="breakdown-item">
                                <span class="breakdown-date">${item.formattedDate}</span>
                                <span class="breakdown-rate-badge ${item.rateType === 'Special Date' ? 'rate-special' : (item.rateType === 'Weekend' ? 'rate-weekend' : '')}">${item.rateType}</span>
                                <span class="breakdown-price">₹${item.price.toLocaleString('en-IN')}</span>
                            </li>
                        `).join('')}
                    </ul>
                    <div class="breakdown-total-row">
                        <span>${pricing.nightsCount} Night${pricing.nightsCount > 1 ? 's' : ''} Total:</span>
                        <span class="breakdown-total-amount">₹${pricing.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            `;
        } catch (e) {
            console.error("Failed to display price breakdown:", e);
            resetPriceBreakdown();
        }
    }

    function resetAvailabilityStatus() {

        if (!availabilityStatus) return;


        availabilityStatus.textContent = '';


        availabilityStatus.className =
            'room-availability-status';

        resetPriceBreakdown();
    }



    function openModal(roomName) {

        if (!bookingModal) return;


        const form =
            document.getElementById(
                'bookingForm'
            );


        // Clear old form data.

        if (form) {

            form.reset();

        }


        // form.reset() also clears hidden room type,
        // therefore set it again AFTER reset.

        if (bookRoomTypeInput) {

            bookRoomTypeInput.value =
                roomName || '';

        }


        if (modalRoomSubtitle) {

            modalRoomSubtitle.textContent =
                roomName
                    ? `ROOM: ${roomName}`
                    : '';

        }


        resetAvailabilityStatus();


        if (bookingSubmitBtn) {

            bookingSubmitBtn.disabled = false;

            bookingSubmitBtn.textContent =
                'PAY NOW';

        }


        loadRoomCarousel(roomName);


        bookingModal.classList.add('active');

        document.body.style.overflow =
            'hidden';


        // Create the date pickers.

        initCalendar();

    }



    function closeModal() {

        if (!bookingModal) return;


        bookingModal.classList.remove('active');


        document.body.style.overflow =
            '';


        stopAutoSlide();


        resetAvailabilityStatus();

    }




    // BOOK NOW buttons.

    bookNowTriggers.forEach((button) => {

        button.addEventListener(
            'click',
            (event) => {

                event.preventDefault();


                const roomName =
                    button.getAttribute(
                        'data-room'
                    );


                openModal(roomName);

            }
        );

    });



    // Close button.

    if (closeBookingModal) {

        closeBookingModal.addEventListener(
            'click',
            closeModal
        );

    }



    // Close by clicking outside modal.

    if (bookingModal) {

        bookingModal.addEventListener(
            'click',
            (event) => {

                if (
                    event.target === bookingModal
                ) {

                    closeModal();

                }

            }
        );

    }



    // ========================================================================
    // 5. PHYSICAL ROOM INVENTORY & ROOM CAPACITY CONTROL
    // ========================================================================
    //
    // 💡 HOW TO CONTROL THE NUMBER OF ROOMS FOR EACH ROOM TYPE:
    // Simply change the numbers in ROOM_CAPACITY below!
    //
    // EXAMPLES:
    // - If you set 'Garden Facing': 5, then 5 customers can book Garden Facing rooms for the same date.
    // - If you set 'Garden Facing': 2, then ONLY 2 customers can book Garden Facing rooms for the same date.
    // - If you set 'Super Deluxe': 5, then 5 customers can book Super Deluxe rooms for the same date.
    //
    // The system automatically calculates room availability and room numbering
    // (e.g. G-01, G-02, G-03...) directly from the numbers defined below.
    // ========================================================================

    const CANONICAL_ROOM_TYPES = {
        'Garden Facing': 'Garden Facing',
        'Deluxe Garden View Rooms': 'Garden Facing',
        'Garden View': 'Garden Facing',
        'AC Double Bed Room': 'AC Double Bed Room',
        'AC Double Bed': 'AC Double Bed Room',
        'Double Bed': 'AC Double Bed Room',
        'Executive Deluxe': 'Executive Deluxe',
        'Executive Deluxe Rooms': 'Executive Deluxe',
        'Super Deluxe': 'Super Deluxe',
        'Super Deluxe Rooms': 'Super Deluxe',
        'Sea Side Deluxe': 'Sea Side Deluxe',
        'Deluxe Sea Side Rooms': 'Sea Side Deluxe',
        'Sea Side': 'Sea Side Deluxe',
        'Seaside Deluxe': 'Sea Side Deluxe'
    };

    function normalizeRoomType(rawType) {
        if (!rawType) return 'Garden Facing';
        const trimmed = String(rawType).trim();
        if (CANONICAL_ROOM_TYPES[trimmed]) {
            return CANONICAL_ROOM_TYPES[trimmed];
        }
        if (trimmed.includes('Double')) return 'AC Double Bed Room';
        if (trimmed.includes('Garden')) return 'Garden Facing';
        if (trimmed.includes('Executive')) return 'Executive Deluxe';
        if (trimmed.includes('Sea Side') || trimmed.includes('Seaside')) return 'Sea Side Deluxe';
        if (trimmed.includes('Super')) return 'Super Deluxe';
        return trimmed;
    }

    const ROOM_CAPACITY = {
        'Garden Facing': 3,
        'AC Double Bed Room': 1,
        'Executive Deluxe': 4,
        'Super Deluxe': 2,
        'Sea Side Deluxe': 2
    };

    const ROOM_PREFIXES = {
        'Garden Facing': 'G',
        'AC Double Bed Room': 'AC',
        'Executive Deluxe': 'ED',
        'Super Deluxe': 'SD',
        'Sea Side Deluxe': 'SS'
    };

    function generateDefaultPhysicalRooms(normType) {
        const capacity = ROOM_CAPACITY[normType] || 0;
        const prefix = ROOM_PREFIXES[normType] || 'R';
        const rooms = [];
        for (let i = 1; i <= capacity; i++) {
            const numStr = String(i).padStart(2, '0');
            const idStr = `${prefix}-${numStr}`;
            rooms.push({
                id: idStr,
                roomNumber: idStr,
                roomType: normType
            });
        }
        return rooms;
    }



    // ========================================================================
    // 6. DATE HELPER
    // ========================================================================

    function parseHotelDate(dateString) {

        // We manually split YYYY-MM-DD.
        //
        // This avoids timezone problems where JavaScript can otherwise
        // shift a date by one day.

        const [
            year,
            month,
            day
        ] =
            String(dateString)
                .split('-')
                .map(Number);


        return new Date(
            year,
            month - 1,
            day
        );

    }



    // ========================================================================
    // 7. CHECK WHETHER TWO BOOKINGS OVERLAP
    // ========================================================================

    function datesOverlap(
        requestedCheckIn,
        requestedCheckOut,
        bookingCheckIn,
        bookingCheckOut
    ) {

        // Example:
        //
        // Booking A:
        // 10 -> 12
        //
        // Booking B:
        // 12 -> 15
        //
        // These DO NOT overlap.
        //
        // The first guest leaves on the 12th and the second guest
        // can arrive on the 12th.

        return (
            requestedCheckIn < bookingCheckOut &&
            requestedCheckOut > bookingCheckIn
        );

    }



    // ========================================================================
    // 8. GET PHYSICAL ROOMS FROM FIRESTORE
    // ========================================================================

    async function getRoomsForType(rawRoomType) {
        const normType = normalizeRoomType(rawRoomType);

        if (!db) {
            return generateDefaultPhysicalRooms(normType);
        }

        try {
            const snapshot =
                await db
                    .collection('rooms')
                    .where(
                        'roomType',
                        '==',
                        normType
                    )
                    .where(
                        'active',
                        '==',
                        true
                    )
                    .get();

            const rooms = [];
            snapshot.forEach((doc) => {
                rooms.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            if (rooms.length === 0) {
                return generateDefaultPhysicalRooms(normType);
            }

            return rooms;
        } catch (e) {
            console.error('Error fetching rooms from Firestore, using default physical rooms fallback:', e);
            return generateDefaultPhysicalRooms(normType);
        }
    }



    // ========================================================================
    // 9. GET EXISTING BOOKINGS FOR THIS ROOM TYPE
    // ========================================================================

    async function getBookingsForType(rawRoomType) {
        const targetNorm = normalizeRoomType(rawRoomType);

        if (!db) return [];

        try {
            const snapshot =
                await db
                    .collection('bookings')
                    .get();

            const bookings = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.bookingStatus === 'cancelled') return;
                const bNorm = normalizeRoomType(data.roomType);
                if (bNorm === targetNorm) {
                    bookings.push({
                        id: doc.id,
                        ...data
                    });
                }
            });

            return bookings;
        } catch (e) {
            console.error('Error fetching bookings from Firestore:', e);
            return [];
        }
    }



    // ========================================================================
    // 10. MAIN AVAILABILITY ENGINE
    // ========================================================================

    async function getRoomAvailability(
        rawRoomType,
        checkInStr,
        checkOutStr
    ) {

        const roomType = normalizeRoomType(rawRoomType);

        if (
            !roomType ||
            !checkInStr ||
            !checkOutStr
        ) {

            return null;

        }


        const checkIn =
            parseHotelDate(
                checkInStr
            );


        const checkOut =
            parseHotelDate(
                checkOutStr
            );


        if (
            Number.isNaN(
                checkIn.getTime()
            ) ||
            Number.isNaN(
                checkOut.getTime()
            ) ||
            checkOut <= checkIn
        ) {

            return {

                available: false,

                availableCount: 0,

                totalRooms:
                    ROOM_CAPACITY[roomType] || 0,

                freeRooms: [],

                occupiedRoomIds:
                    new Set()

            };

        }



        // Get rooms AND bookings at the same time.

        const [
            rooms,
            bookings
        ] =
            await Promise.all([

                getRoomsForType(
                    roomType
                ),

                getBookingsForType(
                    roomType
                )

            ]);



        // Number of rooms physically present in Firebase.

        const totalRooms =
            rooms.length ||
            ROOM_CAPACITY[roomType] ||
            0;



        // Set containing valid room IDs.

        const validRoomIds =
            new Set(
                rooms.map(
                    room => room.id
                )
            );



        // This will contain rooms that are occupied.

        const occupiedRoomIds =
            new Set();



        // Old bookings may not have roomId.
        //
        // We still count them as occupying one room.

        let anonymousOverlappingBookings = 0;



        // Check every booking.

        bookings.forEach((booking) => {

            // Ignore incomplete booking records.

            if (
                !booking.checkIn ||
                !booking.checkOut
            ) {

                return;

            }


            const bookingCheckIn =
                parseHotelDate(
                    booking.checkIn
                );


            const bookingCheckOut =
                parseHotelDate(
                    booking.checkOut
                );


            // Is this booking active during the requested dates?

            if (
                !datesOverlap(
                    checkIn,
                    checkOut,
                    bookingCheckIn,
                    bookingCheckOut
                )
            ) {

                return;

            }



            // --------------------------------------------------------------
            // NEW BOOKING WITH PHYSICAL ROOM ID
            // --------------------------------------------------------------

            if (booking.roomId) {

                // Only count the room if it belongs to this room category.

                if (
                    validRoomIds.has(
                        booking.roomId
                    )
                ) {

                    occupiedRoomIds.add(
                        booking.roomId
                    );

                }

            }


            // --------------------------------------------------------------
            // OLD BOOKING WITHOUT ROOM ID
            // --------------------------------------------------------------

            else {

                anonymousOverlappingBookings++;

            }

        });



        // Find rooms that are not occupied.

        let freeRooms =
            rooms.filter(
                room =>
                    !occupiedRoomIds.has(
                        room.id
                    )
            );



        // Old bookings without roomId still consume capacity.

        if (
            anonymousOverlappingBookings > 0
        ) {

            freeRooms =
                freeRooms.slice(
                    anonymousOverlappingBookings
                );

        }



        const occupiedCount =
            occupiedRoomIds.size +
            anonymousOverlappingBookings;



        const availableCount =
            Math.max(
                0,
                totalRooms -
                occupiedCount
            );



        return {

            available:
                availableCount > 0,

            availableCount:

                availableCount,

            totalRooms:

                totalRooms,

            occupiedCount:

                occupiedCount,

            freeRooms:

                freeRooms,

            occupiedRoomIds:

                occupiedRoomIds

        };

    }



    // ========================================================================
    // 11. DISPLAY AVAILABILITY MESSAGE
    // ========================================================================

    function showAvailabilityStatus(
        state,
        message
    ) {

        if (!availabilityStatus) return;


        availabilityStatus.className =
            `room-availability-status ${state}`;


        availabilityStatus.textContent =
            message;

    }



    // ========================================================================
    // 12. CHECK AVAILABILITY WHEN DATES ARE SELECTED
    // ========================================================================

    async function checkSelectedDatesAvailability() {

        const roomType =
            bookRoomTypeInput?.value ||
            '';


        const checkIn =
            document.getElementById(
                'bookCheckIn'
            )?.value ||
            '';


        const checkOut =
            document.getElementById(
                'bookCheckOut'
            )?.value ||
            '';



        // Don't check until both dates exist.

        if (
            !roomType ||
            !checkIn ||
            !checkOut
        ) {

            resetAvailabilityStatus();

            return null;

        }



        showAvailabilityStatus(
            'checking',
            'Checking room availability...'
        );



        try {

            const result =
                await getRoomAvailability(
                    roomType,
                    checkIn,
                    checkOut
                );



            if (!result) {

                resetAvailabilityStatus();

                return null;

            }



            // --------------------------------------------------------------
            // NO ROOMS
            // --------------------------------------------------------------

            if (
                result.availableCount === 0
            ) {

                showAvailabilityStatus(

                    'full',

                    `✕ ${roomType} is fully booked for these dates.`

                );

            }



            // --------------------------------------------------------------
            // ONLY ONE ROOM LEFT
            // --------------------------------------------------------------

            else if (
                result.availableCount === 1
            ) {

                showAvailabilityStatus(

                    'limited',

                    `⚠ Only 1 ${roomType} room is remaining.`

                );

            }



            // --------------------------------------------------------------
            // MULTIPLE ROOMS LEFT
            // --------------------------------------------------------------

            else {

                showAvailabilityStatus(

                    'available',

                    `✓ ${result.availableCount} ${roomType} rooms are available.`

                );

            }



            return result;

        }



        catch (error) {

            console.error(
                'Availability check failed:',
                error
            );


            showAvailabilityStatus(

                'full',

                'Unable to check availability. Please try again.'

            );


            return null;

        }

    }



    // ========================================================================
    // 13. CALENDAR
    // ========================================================================
    //
    // IMPORTANT:
    //
    // We are NOT doing this anymore:
    //
    // disable: bookedDates
    //
    // Because that would make one booked room block the entire room type.
    //
    // Instead:
    //
    // User selects dates
    //       ↓
    // Availability engine checks physical rooms
    //       ↓
    // Shows available room count
    //
    // ========================================================================

    let checkInPicker = null;

    let checkOutPicker = null;



    function initCalendar() {

        // Destroy old calendars first.

        if (checkInPicker) {

            checkInPicker.destroy();

            checkInPicker = null;

        }


        if (checkOutPicker) {

            checkOutPicker.destroy();

            checkOutPicker = null;

        }



        if (
            typeof flatpickr === 'undefined'
        ) {

            console.error(
                'Flatpickr is not loaded.'
            );

            return;

        }



        // --------------------------------------------------------------
        // CHECK-IN
        // --------------------------------------------------------------

        checkInPicker =
            flatpickr(
                '#bookCheckIn',
                {

                    minDate: 'today',

                    dateFormat: 'Y-m-d',

                    placeholder:
                        'Select Check-In Date',


                    onChange:
                        function (selectedDates) {

                            if (
                                selectedDates[0] &&
                                checkOutPicker
                            ) {

                                // Checkout cannot be before check-in.

                                checkOutPicker.set(
                                    'minDate',
                                    selectedDates[0]
                                );

                            }


                            // Check availability and update breakdown.

                            checkSelectedDatesAvailability();

                            updatePriceBreakdownDisplay();

                        }

                }
            );



        // --------------------------------------------------------------
        // CHECK-OUT
        // --------------------------------------------------------------

        checkOutPicker =
            flatpickr(
                '#bookCheckOut',
                {

                    minDate: 'today',

                    dateFormat: 'Y-m-d',

                    placeholder:
                        'Select Check-Out Date',


                    onChange:
                        function () {

                            // Check availability after checkout
                            // date has been selected.

                            checkSelectedDatesAvailability();

                            updatePriceBreakdownDisplay();

                        }

                }
            );

    }



    // ========================================================================
    // 14. PAYMENT + FINAL ROOM ASSIGNMENT
    // ========================================================================
    //
    // We check availability one MORE TIME immediately before payment.
    //
    // This is important because another customer may have booked a room
    // after the first availability check.
    //
    // The first free physical room is assigned.
    //
    // Example:
    //
    // G-01 = booked
    // G-02 = free
    // G-03 = free
    // G-04 = free
    //
    // New customer gets:
    //
    // G-02
    //
    // ========================================================================

    if (bookingSubmitBtn) {

        bookingSubmitBtn.addEventListener(
            'click',
            async function () {

                // ----------------------------------------------------------
                // GET FORM VALUES
                // ----------------------------------------------------------

                const name =
                    document.getElementById(
                        'bookName'
                    )?.value.trim();


                const phone =
                    document.getElementById(
                        'bookPhone'
                    )?.value.trim();


                const email =
                    document.getElementById(
                        'bookEmail'
                    )?.value.trim();


                const checkInStr =
                    document.getElementById(
                        'bookCheckIn'
                    )?.value;


                const checkOutStr =
                    document.getElementById(
                        'bookCheckOut'
                    )?.value;


                const adults =
                    document.getElementById(
                        'bookAdults'
                    )?.value;


                const children =
                    document.getElementById(
                        'bookChildren'
                    )?.value;


                const roomType =
                    bookRoomTypeInput?.value ||
                    '';



                // ----------------------------------------------------------
                // BASIC VALIDATION
                // ----------------------------------------------------------

                if (
                    !name ||
                    !phone ||
                    !email
                ) {

                    alert(
                        'Please fill in your contact information.'
                    );

                    return;

                }



                if (
                    !checkInStr ||
                    !checkOutStr
                ) {

                    alert(
                        'Please select your check-in and check-out dates.'
                    );

                    return;

                }



                if (!roomType) {

                    alert(
                        'Please select a room type.'
                    );

                    return;

                }



                // ----------------------------------------------------------
                // CHECK DATES
                // ----------------------------------------------------------

                const checkInDate =
                    parseHotelDate(
                        checkInStr
                    );


                const checkOutDate =
                    parseHotelDate(
                        checkOutStr
                    );



                if (
                    checkOutDate <=
                    checkInDate
                ) {

                    alert(
                        'Check-out date must be after check-in date.'
                    );

                    return;

                }



                let nights =
                    Math.round(

                        (
                            checkOutDate -
                            checkInDate
                        ) /
                        (
                            1000 *
                            60 *
                            60 *
                            24
                        )

                    );



                // ----------------------------------------------------------
                // FINAL AVAILABILITY CHECK
                // ----------------------------------------------------------
                //
                // NEVER trust the previous availability message alone.
                //
                // Ask Firebase again before starting payment.
                // ----------------------------------------------------------

                bookingSubmitBtn.disabled =
                    true;


                bookingSubmitBtn.textContent =
                    'CHECKING...';



                let availability;


                try {

                    availability =
                        await checkSelectedDatesAvailability();

                }

                catch (error) {

                    console.error(error);

                    alert(
                        'Could not check room availability. Please try again.'
                    );

                    bookingSubmitBtn.disabled =
                        false;

                    bookingSubmitBtn.textContent =
                        'PAY NOW';

                    return;

                }



                // No room available.

                if (
                    !availability ||
                    availability.availableCount <= 0 ||
                    !availability.freeRooms ||
                    availability.freeRooms.length === 0
                ) {

                    alert(

                        `Sorry, ${roomType} is fully booked for the selected dates.`

                    );


                    bookingSubmitBtn.disabled =
                        false;


                    bookingSubmitBtn.textContent =
                        'PAY NOW';


                    return;

                }



                // ----------------------------------------------------------
                // ASSIGN FIRST FREE PHYSICAL ROOM
                // ----------------------------------------------------------

                const assignedRoom =
                    availability.freeRooms[0];



                console.log(
                    'Assigned physical room:',
                    assignedRoom
                );



                // ----------------------------------------------------------
                // DYNAMIC ROOM PRICE CALCULATION
                // ----------------------------------------------------------

                const pricingResult =
                    await calculateStayPricing(
                        roomType,
                        checkInStr,
                        checkOutStr
                    );


                if (
                    !pricingResult ||
                    pricingResult.totalAmount <= 0
                ) {

                    alert(
                        'Could not calculate price for selected stay dates. Please reselect dates and try again.'
                    );

                    bookingSubmitBtn.disabled =
                        false;

                    bookingSubmitBtn.textContent =
                        'PAY NOW';

                    return;

                }


                const amount =
                    pricingResult.totalAmount;


                nights =
                    pricingResult.nightsCount;



                // ----------------------------------------------------------
                // RAZORPAY CHECK
                // ----------------------------------------------------------

                if (
                    typeof Razorpay ===
                    'undefined'
                ) {

                    alert(

                        `Availability confirmed!\n\n` +

                        `Room: ${roomType}\n` +

                        `Assigned Room: ${assignedRoom.roomNumber}\n` +

                        `Nights: ${nights}\n` +

                        `Total: ₹${amount.toLocaleString('en-IN')}\n\n` +

                        `Razorpay is unavailable.`

                    );


                    bookingSubmitBtn.disabled =
                        false;


                    bookingSubmitBtn.textContent =
                        'PAY NOW';


                    return;

                }



                bookingSubmitBtn.textContent =
                    'OPENING PAYMENT...';



                // ----------------------------------------------------------
                // RAZORPAY OPTIONS
                // ----------------------------------------------------------

                const options = {

                    key:
                        'rzp_test_T2KlsbDebXkyv9',


                    amount:
                        amount * 100,


                    currency:
                        'INR',


                    name:
                        'Sagar Taranga',


                    description:

                        `${roomType} - ${assignedRoom.roomNumber} ` +

                        `(${nights} night${nights > 1 ? 's' : ''})`,



                    // ------------------------------------------------------
                    // PAYMENT SUCCESS
                    // ------------------------------------------------------

                    handler:
                        async function (response) {

                            try {

                                if (
                                    typeof firebase ===
                                    'undefined' ||
                                    !firebase.apps.length ||
                                    !db
                                ) {

                                    throw new Error(
                                        'Firebase is not available.'
                                    );

                                }

                                const normRoomType = normalizeRoomType(roomType);

                                // Live double-check room availability right before saving (prevents overbooking race conditions)
                                const finalCheck = await getRoomAvailability(normRoomType, checkInStr, checkOutStr);
                                let finalAssignedRoom = assignedRoom;
                                if (finalCheck && finalCheck.availableCount > 0 && finalCheck.freeRooms && finalCheck.freeRooms.length > 0) {
                                    finalAssignedRoom = finalCheck.freeRooms[0];
                                } else {
                                    alert(
                                        `Payment processed (Payment ID: ${response.razorpay_payment_id}), but the last remaining ${normRoomType} room was booked by another customer. Please contact resort management with your Payment ID.`
                                    );
                                    return;
                                }

                                await db
                                    .collection(
                                        'bookings'
                                    )
                                    .add({

                                        roomType:
                                            normRoomType,


                                        roomId:
                                            finalAssignedRoom.id,


                                        roomNumber:
                                            finalAssignedRoom.roomNumber,


                                        name:
                                            name,


                                        phone:
                                            phone,


                                        email:
                                            email,


                                        checkIn:
                                            checkInStr,


                                        checkOut:
                                            checkOutStr,


                                        adults:
                                            Number(adults) ||
                                            1,


                                        children:
                                            Number(children) ||
                                            0,


                                        nights:
                                            nights,


                                        amount:
                                            amount,


                                        paymentId:
                                            response.razorpay_payment_id,


                                        bookingStatus:
                                            'confirmed',


                                        bookedAt:
                                            new Date().toISOString()

                                    });



                                // ------------------------------------------------
                                // SUCCESS MESSAGE
                                // ------------------------------------------------

                                alert(

                                    `Payment successful!\n\n` +

                                    `Room: ${roomType}\n` +

                                    `Room Number: ${assignedRoom.roomNumber}\n` +

                                    `Check-in: ${checkInStr}\n` +

                                    `Check-out: ${checkOutStr}\n\n` +

                                    `Your booking is confirmed.`

                                );



                                closeModal();



                                const form =
                                    document.getElementById(
                                        'bookingForm'
                                    );


                                if (form) {

                                    form.reset();

                                }



                            }

                            catch (error) {

                                console.error(
                                    'Booking save failed:',
                                    error
                                );


                                alert(

                                    'Payment went through, but the booking could not be saved automatically.\n\n' +

                                    'Please keep this Payment ID:\n' +

                                    response.razorpay_payment_id

                                );

                            }



                            finally {

                                bookingSubmitBtn.disabled =
                                    false;


                                bookingSubmitBtn.textContent =
                                    'PAY NOW';

                            }

                        },



                    // ------------------------------------------------------
                    // RAZORPAY PREFILL
                    // ------------------------------------------------------

                    prefill: {

                        name:
                            name,

                        email:
                            email,

                        contact:
                            phone

                    },



                    // ------------------------------------------------------
                    // RAZORPAY THEME
                    // ------------------------------------------------------

                    theme: {

                        color:
                            '#1582B0'

                    }

                };



                // ----------------------------------------------------------
                // OPEN RAZORPAY
                // ----------------------------------------------------------

                const rzp =
                    new Razorpay(
                        options
                    );



                // If payment fails, allow the user to try again.

                rzp.on(
                    'payment.failed',
                    function () {

                        bookingSubmitBtn.disabled =
                            false;

                        bookingSubmitBtn.textContent =
                            'PAY NOW';

                    }
                );



                rzp.open();



                // Re-enable button after Razorpay opens.

                bookingSubmitBtn.disabled =
                    false;

                bookingSubmitBtn.textContent =
                    'PAY NOW';

            }
        );

    }

});