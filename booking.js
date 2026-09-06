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


        'Executive Deluxe': [

            'assets/Room Images/Executive Deluxe/IMG_8643.HEIC',

            'assets/Room Images/Executive Deluxe/IMG_8655.HEIC',

            'assets/Room Images/Executive Deluxe/IMG_8674.HEIC',

            'assets/Room Images/Executive Deluxe/IMG_8680.HEIC',

            'assets/Room Images/Executive Deluxe/IMG_8683.HEIC',

            'assets/resort image.webp'

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

            'assets/Room Images/Sea side Deluxe/278b48c3-d57e-4019-a305-e78c017e4b6c.jpg',

            'assets/Room Images/Sea side Deluxe/IMG_9341.HEIC',

            'assets/IMG_5835.JPG.webp'

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



    function resetAvailabilityStatus() {

        if (!availabilityStatus) return;


        availabilityStatus.textContent = '';


        availabilityStatus.className =
            'room-availability-status';

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
    // 5. PHYSICAL ROOM INVENTORY
    // ========================================================================

    // This tells our availability engine how many physical rooms exist
    // for each room TYPE.

    const ROOM_CAPACITY = {

        'Garden Facing': 4,

        'Executive Deluxe': 4,

        'Super Deluxe': 2,

        'Sea Side Deluxe': 2

    };



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

    async function getRoomsForType(roomType) {

        if (!db) {

            throw new Error(
                'Firebase database is not available.'
            );

        }


        const snapshot =
            await db
                .collection('rooms')
                .where(
                    'roomType',
                    '==',
                    roomType
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


        return rooms;

    }



    // ========================================================================
    // 9. GET EXISTING BOOKINGS FOR THIS ROOM TYPE
    // ========================================================================

    async function getBookingsForType(roomType) {

        if (!db) {

            throw new Error(
                'Firebase database is not available.'
            );

        }


        const snapshot =
            await db
                .collection('bookings')
                .where(
                    'roomType',
                    '==',
                    roomType
                )
                .get();


        const bookings = [];


        snapshot.forEach((doc) => {

            bookings.push({

                id: doc.id,

                ...doc.data()

            });

        });


        return bookings;

    }



    // ========================================================================
    // 10. MAIN AVAILABILITY ENGINE
    // ========================================================================

    async function getRoomAvailability(
        roomType,
        checkInStr,
        checkOutStr
    ) {

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


                            // Check availability.

                            checkSelectedDatesAvailability();

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



                const nights =
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
                // ROOM PRICES
                // ----------------------------------------------------------

                const roomPrices = {

                    'Garden Facing':
                        1,

                    'Executive Deluxe':
                        1,

                    'Super Deluxe':
                        1,

                    'Sea Side Deluxe':
                        1

                };



                const pricePerNight =
                    roomPrices[roomType] ||
                    5000;


                const amount =
                    nights *
                    pricePerNight;



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



                                // ------------------------------------------------
                                // SAVE BOOKING
                                // ------------------------------------------------
                                //
                                // The important fields are:
                                //
                                // roomType
                                // roomId
                                // roomNumber
                                //
                                // This tells Firebase exactly which physical
                                // room was assigned.
                                // ------------------------------------------------

                                await db
                                    .collection(
                                        'bookings'
                                    )
                                    .add({

                                        roomType:
                                            roomType,


                                        roomId:
                                            assignedRoom.id,


                                        roomNumber:
                                            assignedRoom.roomNumber,


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