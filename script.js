// Sagartarang Beach Resort — minimal interactions

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const heroMedia = document.querySelector('.hero-media');
  const heroVideo = document.querySelector('.hero-video');



  // Navbar background on scroll
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Booking Modal Logic
  const bookingModal = document.getElementById('bookingModal');
  if (bookingModal) {
    const closeBookingModal = document.getElementById('closeBookingModal');
    const bookRoomTypeInput = document.getElementById('bookRoomType');
    const modalRoomSubtitle = document.getElementById('modalRoomSubtitle');
    const bookingForm = document.getElementById('bookingForm');
    const bookNowTriggers = document.querySelectorAll('.book-now-trigger');
    const checkInInput = document.getElementById('bookCheckIn');
    const checkOutInput = document.getElementById('bookCheckOut');

    // Open Modal
    bookNowTriggers.forEach(button => {
      button.addEventListener('click', () => {
        const roomName = button.getAttribute('data-room');
        if (bookRoomTypeInput) {
          bookRoomTypeInput.value = roomName || '';
        }
        if (modalRoomSubtitle) {
          modalRoomSubtitle.textContent = roomName ? `Room: ${roomName}` : '';
        }
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        initCalendar(); // Prevent background scrolling
      });
    });

    // Close Modal
    const closeModal = () => {
      bookingModal.classList.remove('active');
      document.body.style.overflow = ''; // Restore background scrolling
    };

    if (closeBookingModal) {
      closeBookingModal.addEventListener('click', closeModal);
    }

    // Close Modal on clicking outside content area
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeModal();
      }
    });

    // Set min date for Check-in to today
    if (checkInInput && checkOutInput) {
      const today = new Date().toISOString().split('T')[0];
      checkInInput.min = today;
      
      checkInInput.addEventListener('change', () => {
        checkOutInput.min = checkInInput.value;
        if (checkOutInput.value && checkOutInput.value < checkInInput.value) {
          checkOutInput.value = checkInInput.value;
        }
      });
    }

    // Handle form submission
    /*if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Extract form values
        const roomType = bookRoomTypeInput ? bookRoomTypeInput.value : '';
        const name = document.getElementById('bookName').value;
        const phone = document.getElementById('bookPhone').value;
        const email = document.getElementById('bookEmail').value;
        const checkIn = checkInInput ? checkInInput.value : '';
        const checkOut = checkOutInput ? checkOutInput.value : '';
        const adults = document.getElementById('bookAdults').value;
        const children = document.getElementById('bookChildren').value;

        // Perform validation/submit action (e.g. log or show message)
        console.log('Booking submitted:', { roomType, name, phone, email, checkIn, checkOut, adults, children });
        
        alert(`Thank you, ${name}! Your booking request for the "${roomType}" room from ${checkIn} to ${checkOut} has been received. Proceeding to payment...`);
        
        closeModal();
        bookingForm.reset();
      });
    }*/
  }
});


const fadeElements = document.querySelectorAll('.fade-up');

function checkScroll() {
  fadeElements.forEach((element) => {
    const triggerPoint = window.innerHeight * 0.85;
    const elementTop = element.getBoundingClientRect().top;

    if (elementTop < triggerPoint) {
      element.classList.add('show');
    }
  });
}

window.addEventListener('scroll', checkScroll);

gsap.registerPlugin(ScrollTrigger);

/* scroll down text animation and click scroll */
const scrollText = document.querySelector(".scroll-text");
const scrollArrow = document.querySelector(".scroll-arrow");
const scrollBtn = document.getElementById("heroScroll");

if (scrollText) {
  const letters = scrollText.textContent
    .split("")
    .map(char => char === " " ? "<span>&nbsp;</span>" : `<span>${char}</span>`)
    .join("");
  scrollText.innerHTML = letters;

  // Animate the text letters and then arrow in a timeline
  const heroTimeline = gsap.timeline();
  
  heroTimeline.from(".hero-text", {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out"
  });

  heroTimeline.to(".scroll-text span", {
    y: 0,
    opacity: 1,
    stagger: 0.02,
    duration: 0.6,
    ease: "power2.out"
  }, "-=0.6"); // Start slightly before hero-text animation finishes

  heroTimeline.to(scrollArrow, {
    opacity: 1,
    duration: 0.5,
    onComplete: () => {
      scrollArrow.classList.add("animate");
    }
  }, "-=0.2");
} else {
  /* fallback hero text animation if scroll down element is missing */
  gsap.from(".hero-text", {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out"
  });
}

if (scrollBtn) {
  scrollBtn.addEventListener("click", () => {
    const target = document.getElementById("page-2");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
}


/* PAGE 3 TIMELINE — only on desktop */
if (window.matchMedia("(min-width: 769px)").matches) {

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".page-3",
    start: "top top",
    end: "+=3000",
    scrub: 1.8,
    pin: true
  }
});

/* resort image comes from below */
tl.from(".resort-image-wrapper", {
  y: 300,
  opacity: 0,
  duration: 1
});

/* title fades */
tl.to(".resort-title", {
  opacity: 0,
  y: -80,
  duration: 1.2
});

tl.to(".resort-subtitle", {
  opacity: 0,
  y: -80,
  duration: 1.2
});

/* image fullscreen */
tl.to(".resort-image-wrapper", {
  width: "100vw",
  height: "100vh",
  borderRadius: "0px",
  top: "0%",
  duration: 1.5
});

/* horizontal scroll to pool */
tl.to(".horizontal-wrapper", {
  x: "-300vw",
  duration: 2
});


tl.to(".food-image", {
  width: "70%",
  height: "200px",

  top: "28%",
  left: "50%",

  x: "-50%",

  borderRadius: "0px",

  duration: 1
});

} // end desktop-only block


//aminities fade in

//aminities fade in

const title = document.querySelector(".title-amenities");

if (title) {
  const text = title.textContent;

  title.innerHTML = text
    .split("")
    .map(letter =>
      letter === " "
        ? " "
        : `<span>${letter}</span>`
    )
    .join("");

  gsap.to(".title-amenities span", {
    y: 0,
    opacity: 1,

    stagger: 0.04,

    duration: 1,

    ease: "power3.out",

    scrollTrigger: {
      trigger: ".title-amenities",
      start: "top 80%"
    }
  });
}


// Popular Attractions title animation

const attractionTitle = document.querySelector(".title-popular-attractions");

if (attractionTitle) {
  const attractionText = attractionTitle.textContent;

  attractionTitle.innerHTML = attractionText
    .split("")
    .map(letter =>
      letter === " "
        ? " "
        : `<span>${letter}</span>`
    )
    .join("");

  gsap.to(".title-popular-attractions span", {
    y: 0,
    opacity: 1,

    stagger: 0.04,

    duration: 1,

    ease: "power3.out",

    scrollTrigger: {
      trigger: ".title-popular-attractions",
      start: "top 80%"
    }
  });
}

// Attractions cards animation

if (document.querySelector(".attraction-card")) {
  gsap.to(".attraction-card", {
    y: 0,
    opacity: 1,

    stagger: 0.08,

    duration: 1,

    ease: "power3.out",

    scrollTrigger: {
      trigger: ".attractions-container",
      start: "top 80%"
    }
  });
}


/*initializing firebase*/

async function getBookedDates() {
  const bookedDates = [];
  const snapshot = await db.collection("bookings").get();
  snapshot.forEach(doc => {
    const data = doc.data();
    let current = new Date(data.checkIn);
    const end = new Date(data.checkOut);
    while (current < end) {
      bookedDates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
  });
  return bookedDates;
}

async function initCalendar() {
  const bookedDates = await getBookedDates();

  flatpickr("#bookCheckIn", {
    minDate: "today",
    disable: bookedDates,
    dateFormat: "Y-m-d",
    onChange: function(selectedDates) {
      checkOutPicker.set("minDate", selectedDates[0]);
    }
  });

  const checkOutPicker = flatpickr("#bookCheckOut", {
    minDate: "today",
    disable: bookedDates,
    dateFormat: "Y-m-d"
  });
}



document.getElementById("booking-modal-submit-btn").addEventListener("click", function () {

  // Grab form values up front, before Razorpay opens
  const name = document.getElementById('bookName').value;
  const phone = document.getElementById('bookPhone').value;
  const email = document.getElementById('bookEmail').value;
  const checkInStr = document.getElementById('bookCheckIn').value;
  const checkOutStr = document.getElementById('bookCheckOut').value;
  const adults = document.getElementById('bookAdults').value;
  const children = document.getElementById('bookChildren').value;
  const roomType = document.getElementById('bookRoomType').value;

  if (!checkInStr || !checkOutStr) {
    alert("Please select your check-in and check-out dates first.");
    return;
  }

  const checkInDate = new Date(checkInStr);
  const checkOutDate = new Date(checkOutStr);
  const nights = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

  const roomPrices = {
    "Super Deluxe Rooms": 6000,
    "Deluxe Sea Side Rooms": 6000,
    "Executive Deluxe Rooms": 5500,
    "Deluxe Garden View Rooms": 4500
  };
  const pricePerNight = roomPrices[roomType] || 5000;
  const amount = nights * pricePerNight;

  const options = {
    key: "rzp_test_T2KlsbDebXkyv9",
    amount: amount * 100,
    currency: "INR",
    name: "Sagar Taranga",
    description: "Room Booking",

    handler: function (response) {
      // Payment confirmed — now save the booking
      db.collection("bookings").add({
        roomType: roomType,
        name: name,
        phone: phone,
        email: email,
        checkIn: checkInStr,
        checkOut: checkOutStr,
        adults: Number(adults),
        children: Number(children),
        nights: nights,
        amount: amount,
        paymentId: response.razorpay_payment_id,
        bookedAt: new Date().toISOString()
      })
      .then(() => {
        alert("Payment successful! Your booking is confirmed.");
        document.getElementById('bookingModal').classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('bookingForm').reset();
      })
      .catch((error) => {
        console.error("Booking save failed:", error);
        alert("Payment went through, but we couldn't save your booking automatically. Please save this Payment ID and contact us: " + response.razorpay_payment_id);
      });
    },

    prefill: {
      name: name,
      email: email,
      contact: phone
    },
    theme: {
      color: "#9b8f85"
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
});