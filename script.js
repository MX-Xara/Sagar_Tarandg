// Sagartarang Beach Resort — minimal interactions

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const heroMedia = document.querySelector('.hero-media');
  const heroVideo = document.querySelector('.hero-video');

  // Hide fallback image once the video has enough data to play smoothly
  if (heroVideo) {
    heroVideo.addEventListener('canplay', () => {
      heroMedia.classList.add('video-ready');
    });

    // If the video source fails to load, keep the fallback image visible
    heroVideo.addEventListener('error', () => {
      heroMedia.classList.remove('video-ready');
    });
  }

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

/* hero text animation */
gsap.from(".hero-text", {
  y: 100,
  opacity: 0,
  duration: 1.5,
  ease: "power3.out"
});

/* PAGE 3 TIMELINE */
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

//aminities fade in

const title = document.querySelector(".title-amenities");

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


// Popular Attractions title animation

const attractionTitle = document.querySelector(".title-popular-attractions");

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

// Attractions cards animation

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
