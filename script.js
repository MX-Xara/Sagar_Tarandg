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

  // Ensure persistent floating contact buttons exist across all pages
  if (!document.querySelector('.floating-contact')) {
    const contactDiv = document.createElement('div');
    contactDiv.className = 'floating-contact';
    contactDiv.setAttribute('aria-label', 'Quick contact options');
    contactDiv.innerHTML = `
      <a href="https://wa.me/919011087295?text=Hi%2C%20I%20would%20like%20to%20inquire%20about%20Sagar%20Tarang%20Beach%20Resort." target="_blank" rel="noopener noreferrer" class="floating-btn floating-whatsapp" aria-label="Chat on WhatsApp" title="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M12.031 2C6.496 2 2 6.485 2 12.01c0 1.997.591 3.864 1.616 5.441L2 22l4.707-1.577a9.98 9.98 0 0 0 5.324 1.543h.004c5.534 0 10.029-4.485 10.029-10.01 0-2.677-1.043-5.195-2.936-7.086A9.972 9.972 0 0 0 12.031 2zm0 18.283a8.27 8.27 0 0 1-4.223-1.153l-.303-.18-3.134 1.05.864-3.05-.198-.315a8.24 8.24 0 0 1-1.26-4.625c0-4.57 3.72-8.289 8.293-8.289 2.213 0 4.293.863 5.858 2.428a8.232 8.232 0 0 1 2.43 5.86c0 4.57-3.719 8.274-8.485 8.274zm4.542-6.195c-.249-.125-1.472-.726-1.7-.809-.228-.083-.395-.125-.561.125-.166.249-.644.809-.789.975-.145.166-.291.187-.54.062-.249-.125-1.051-.387-2.003-1.236-.74-.66-1.24-1.476-1.385-1.725-.145-.249-.015-.383.11-.507.112-.112.249-.291.374-.436.124-.145.166-.249.249-.415.083-.166.042-.312-.021-.436-.062-.125-.561-1.351-.769-1.85-.202-.486-.407-.42-.561-.428-.145-.008-.312-.01-.478-.01-.166 0-.436.062-.664.312-.229.249-.873.852-.873 2.078s.894 2.41 1.018 2.576c.125.166 1.758 2.684 4.258 3.764.595.257 1.06.41 1.423.525.597.19 1.141.163 1.571.099.479-.071 1.472-.602 1.68-1.184.208-.582.208-1.08.145-1.184-.062-.104-.228-.166-.477-.291z"/>
        </svg>
      </a>
      <a href="tel:+919011087295" class="floating-btn floating-call" aria-label="Call Sagar Tarang Resort" title="Call Us">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      </a>
    `;
    document.body.appendChild(contactDiv);
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
  const text = title.textContent.trim();

  title.innerHTML = text
    .split(/\s+/)
    .map(word =>
      `<span class="title-word" style="display:inline-block; white-space:nowrap;">${word
        .split("")
        .map(letter => `<span>${letter}</span>`)
        .join("")}</span>`
    )
    .join(" ");

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
  const attractionText = attractionTitle.textContent.trim();

  attractionTitle.innerHTML = attractionText
    .split(/\s+/)
    .map(word =>
      `<span class="title-word" style="display:inline-block; white-space:nowrap;">${word
        .split("")
        .map(letter => `<span>${letter}</span>`)
        .join("")}</span>`
    )
    .join(" ");

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