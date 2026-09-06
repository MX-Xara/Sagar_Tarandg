/* =========================================
   Restaurant Page — GSAP Entrance & 3D Door Scroll Transition
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const restaurantNavBtn = document.getElementById("restaurantNavBtn");
  const navLogo = document.getElementById("navLogo");
  const doorWrapper = document.getElementById("doorWrapper");
  const doorLeft = document.getElementById("doorLeft");
  const doorRight = document.getElementById("doorRight");
  const portalGlow = document.getElementById("portalGlow");
  const restaurantWorld = document.getElementById("restaurantWorld");
  const restaurantTransition = document.getElementById("restaurantTransition");
  const body = document.body;
  const restaurantBackground = document.querySelector(".restaurant-background");

  if (!restaurantNavBtn || !navLogo || !doorWrapper || !restaurantBackground) return;

  // Initial GSAP setup for door container (centered horizontally at left 50% + xPercent -50, hidden below screen)
  gsap.set(doorWrapper, {
    xPercent: -50,
    yPercent: 100,
    left: "50%",
    visibility: "visible"
  });

  let isAnimated = false;
  let isAnimating = false;
  let scrollTimeline = null;

  function initScrollAnimation() {
    if (scrollTimeline) return;

    // Enable vertical page scrolling ONLY after entrance animation completes
    body.style.overflowY = "auto";
    ScrollTrigger.refresh();

    scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: restaurantTransition,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        pin: "#pinnedScene",
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // Master Scroll Sequence:
    // 0% - 20%: Door begins opening in 3D
    // 20% - 50%: Door opens further, portal glow appears behind
    // 40% - 100%: World / background gradually zoom forward
    // 60% - 100%: Door reaches full opening (-80deg / +80deg)
    // 70% - 100%: Glow reaches strong daylight bloom (0.85 opacity)

    scrollTimeline
      .to(doorLeft, {
        rotationY: 80,
        ease: "none"
      }, 0)
      .to(doorRight, {
        rotationY: -80,
        ease: "none"
      }, 0)
      .to(portalGlow, {
        opacity: 0.85,
        ease: "none"
      }, 0.15)
      .to(restaurantWorld, {
        scale: 2.8,
        ease: "none"
      }, 0.25)
      .to(restaurantBackground, {
        scale: 1.5,
        ease: "none"
      }, 0.25)
      .to(doorWrapper, {
        opacity: 0,
        ease: "none"
      }, 0.75);
  }

  function runRestaurantTransition() {
    if (isAnimating || isAnimated) return;
    isAnimating = true;

    // Create synchronized GSAP Timeline for Entrance
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating = false;
        isAnimated = true;

        // Initialize scroll control after entrance animation completes
        initScrollAnimation();
      }
    });

    body.classList.add("restaurant-active");

    // 1. Background color changes to exactly #eadcbf
    tl.to(body, {
      backgroundColor: "#eadcbf",
      duration: 0.8,
      ease: "power2.out"
    }, 0);

    // 1.5 Background image appears late
    tl.to(restaurantBackground, {
      opacity: 1,
      duration: 1.2,
      ease: "power2.out"
    }, 1.1);

    // 2. Sagar Tarang logo rotates 360° and changes into Restaurant logo (logo.png) at 180°
    tl.to(navLogo, {
      rotationY: 360,
      duration: 1.4,
      scale: 2.5,
      ease: "power2.inOut",
      onUpdate: function () {
        if (this.progress() >= 0.5 && !navLogo.dataset.swapped) {
          navLogo.src = "assets/hotel/logo.png";
          navLogo.classList.add("restaurant-logo-swapped");
          navLogo.dataset.swapped = "true";
        }
      }
    }, 0);

    // 3. Door slides upward from bottom (FAST -> SLOW -> STOP) keeping horizontal center alignment
    tl.to(doorWrapper, {
      xPercent: -50,
      yPercent: 0,
      duration: 1.9,
      ease: "power3.out"
    }, 0);
  }

  // Trigger animation when user clicks the "Restaurant" navbar button
  restaurantNavBtn.addEventListener("click", (e) => {
    e.preventDefault();
    runRestaurantTransition();
  });

  // Handle direct navigation trigger (e.g., from other pages clicking Restaurant or direct URL visit)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("trigger") === "true" || window.location.hash === "#restaurant" || window.location.pathname.includes("hotel.html")) {
    runRestaurantTransition();
  }
});
