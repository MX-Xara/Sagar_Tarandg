// Sagartarang Beach Resort — minimal interactions

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const heroMedia = document.querySelector('.hero-media');
  const heroVideo = document.querySelector('.hero-video');

  // Handle local file:// protocol fallback for YouTube video embed if YouTube blocks file:// origin
  if (window.location.protocol === 'file:') {
    const container = document.getElementById('youtubeVideoContainer');
    if (container) {
      container.innerHTML = `
        <video controls poster="assets/resort image.webp" style="width:100%; height:100%; object-fit:cover; display:block;">
          <source src="assets/hero-video.mp4" type="video/mp4">
        </video>
      `;
    }
  }



  // Navbar background on scroll
  const handleScroll = () => {
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  };
  if (navbar) {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  }

  // Mobile menu toggle (Universal across all pages)
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
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

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navToggle.classList.contains('open')) {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
          navToggle.classList.remove('open');
          navLinks.classList.remove('open');
        }
      }
    });

    // Reset menu state if resized to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

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


/* PAGE 3 TIMELINE */

let mm = gsap.matchMedia();

mm.add("(min-width: 769px)", () => {
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
});

mm.add("(max-width: 768px)", () => {
  const panels = [".resort-panel", ".pool-panel", ".beach-panel", ".food-panel"];
  panels.forEach((panel) => {
    if (document.querySelector(panel)) {
      gsap.from(panel, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: panel,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    }
  });
});



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


// Note: Booking submission and availability engine are fully managed in booking.js