const lenis = new Lenis({
  duration: 1.2,
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.5
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
















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
  const restaurantInterior = document.getElementById("restaurantInterior");
  const interiorImage = restaurantInterior
  ? restaurantInterior.querySelector("img")
  : null;
  const restaurantInteriorImg = document.querySelector("#restaurantInterior img");

  const doorSideLeft = document.getElementById("doorSideLeft");
  const doorSideRight = document.getElementById("doorSideRight");

  if (!restaurantNavBtn || !navLogo || !doorWrapper || !restaurantBackground || !restaurantInterior) return;

    // =========================================
  // FULL SCREEN INTERIOR IMAGE REVEAL
  // =========================================

  const interiorRevealSection =
    document.getElementById("interiorRevealSection");

  const interiorRevealImage =
    document.getElementById("interiorRevealImage");

  if (interiorRevealSection && interiorRevealImage) {

  gsap.fromTo(
    interiorRevealImage,
    {
      clipPath: "inset(15% 15% 15% 15%)"
    },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      ease: "none",

      scrollTrigger: {
        trigger: interiorRevealSection,
        start: "top top",
        end: "+=20%",
        scrub: true,
        pin: true,
        anticipatePin: 1
      }
    }
  );

}

  // Helper function to split text in .door-side-text into individual .word and .char spans
  function prepareLetterAnimation() {
    const lineSpans = document.querySelectorAll(".door-side-text .side-text-content span");
    lineSpans.forEach((span) => {
      if (!span || span.dataset.split) return;
      span.dataset.split = "true";
      const text = span.textContent.trim();
      if (!text) return;

      const words = text.split(/\s+/);
      span.innerHTML = words
        .map((word) => {
          const chars = Array.from(word)
            .map((char) => `<span class="char">${char}</span>`)
            .join("");
          return `<span class="word">${chars}</span>`;
        })
        .join(" ");
    });
  }

  prepareLetterAnimation();

  const sideChars = document.querySelectorAll(".door-side-text .char");
  const sideDecorations = document.querySelectorAll(".side-text-line, .side-text-waves");

  // Initial GSAP setup for door container (centered horizontally at left 50% + xPercent -50, hidden below screen)
  gsap.set(doorWrapper, {
    xPercent: -50,
    yPercent: 100,
    left: "50%",
    visibility: "visible"
  });

  // Initial GSAP setup for each individual letter (hidden with soft blur & drop offset)
  if (sideChars.length > 0) {
    gsap.set(sideChars, {
      opacity: 0,
      filter: "blur(12px)",
      y: -22
    });
  }

  if (sideDecorations.length > 0) {
    gsap.set(sideDecorations, {
      opacity: 0,
      filter: "blur(8px)",
      y: -10
    });
  }

  let isAnimated = false;
  let isAnimating = false;
  let scrollTimeline = null;

  function initScrollAnimation() {
    if (scrollTimeline) return;

    // Enable vertical page scrolling ONLY after entrance animation completes
    body.style.overflowY = "auto";
    

    scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: restaurantTransition,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        
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

    gsap.set(restaurantInterior, {
    yPercent: 100,
    opacity: 0
});

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
      }, 0.75)

      .to(restaurantInterior, {
    opacity: 1,
    yPercent: 0,
    ease: "none",
    duration: 0.35
}, 1.30) 
.to(restaurantInteriorImg, {
    yPercent: 10,
    ease: "none",
    duration: 0.35
}, 1.30);

    if (sideChars.length > 0) {
      scrollTimeline.to([...sideChars, ...sideDecorations], {
        opacity: 0,
        ease: "none"
      }, 0.45);
    }

    // Initialize Post-Door Scroll Animations (Interior Image & Reference Headline)
    initPostDoorAnimations();
    
    
  }

  // Universal Helper function to split text into .word and .char elements while preserving <br> breaks
  function splitTextIntoChars(element) {
    if (!element || element.dataset.split) return;
    element.dataset.split = "true";

    const childNodes = Array.from(element.childNodes);
    element.innerHTML = "";

    childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "BR") {
        element.appendChild(document.createElement("br"));
      } else {
        const text = node.textContent;
        if (!text) return;

        const words = text.split(/(\s+)/);
        words.forEach((word) => {
          if (/^\s+$/.test(word)) {
            element.appendChild(document.createTextNode(word));
          } else if (word.length > 0) {
            const wordSpan = document.createElement("span");
            wordSpan.className = "word";
            Array.from(word).forEach((char) => {
              const charSpan = document.createElement("span");
              charSpan.className = "char";
              charSpan.textContent = char;
              wordSpan.appendChild(charSpan);
            });
            element.appendChild(wordSpan);
          }
        });
      }
    });
  }

  // Helper function to setup Post-Door Content Animations
  function initPostDoorAnimations() {
    // 1. Restaurant Intro Title & Label Letter Drop Blur Animation
    const introLabel = document.querySelector(".restaurant-intro-label");
    const introTitle = document.querySelector(".restaurant-intro-title");

    if (introLabel) splitTextIntoChars(introLabel);
    if (introTitle) splitTextIntoChars(introTitle);

    const introChars = document.querySelectorAll(".restaurant-intro-label .char, .restaurant-intro-title .char");

    if (introChars.length > 0) {
      gsap.set(introChars, {
        opacity: 0,
        filter: "blur(14px)",
        y: -24
      });

      gsap.to(introChars, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.75,
        stagger: 0.015,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".restaurant-intro",
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    }

    // 2. Reference Section (Dessert Speciality) Animations
    const refEyebrow = document.getElementById("referenceEyebrow");
    const refCategory = document.getElementById("referenceCategory");
    const refTitle = document.getElementById("referenceTitle");
    const refDesc = document.getElementById("referenceDesc");
    const refLine = document.getElementById("referenceLine");
    const refImgCard = document.getElementById("referenceImgCard");

    if (refEyebrow) splitTextIntoChars(refEyebrow);
    if (refCategory) splitTextIntoChars(refCategory);
    if (refTitle) splitTextIntoChars(refTitle);
    if (refDesc) splitTextIntoChars(refDesc);

    const refChars = document.querySelectorAll("#referenceTextContent .char");

    if (refChars.length > 0) {
      gsap.set(refChars, {
        opacity: 0,
        filter: "blur(14px)",
        y: -22
      });
    }

    if (refLine) {
      gsap.set(refLine, {
        opacity: 0,
        scaleX: 0,
        transformOrigin: "left center"
      });
    }

    if (refImgCard) {
      gsap.set(refImgCard, {
        opacity: 0,
        y: 50,
        filter: "blur(8px)"
      });
    }

    const refTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#referenceSection",
        start: "top 78%",
        toggleActions: "play none none reverse"
      }
    });

    if (refImgCard) {
      refTl.to(refImgCard, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power2.out"
      }, 0);
    }

    if (refLine) {
      refTl.to(refLine, {
        opacity: 1,
        scaleX: 1,
        duration: 0.5,
        ease: "power2.out"
      }, 0.2);
    }

    if (refChars.length > 0) {
      refTl.to(refChars, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.65,
        stagger: 0.012,
        ease: "power2.out"
      }, 0.3);
    }

    // 3. Philosophy Reference Section Animations
    const philLabel = document.getElementById("philosophyLabel");
    const philTitle = document.getElementById("philosophyTitle");
    const philDesc = document.getElementById("philosophyDesc");
    const philImgCard = document.getElementById("philosophyImgCard");

    if (philLabel) splitTextIntoChars(philLabel);
    if (philTitle) splitTextIntoChars(philTitle);
    if (philDesc) splitTextIntoChars(philDesc);

    const philChars = document.querySelectorAll("#philosophyTextContent .char");

    if (philChars.length > 0) {
      gsap.set(philChars, {
        opacity: 0,
        filter: "blur(14px)",
        y: -24
      });
    }

    if (philImgCard) {
      gsap.set(philImgCard, {
        opacity: 0,
        y: 50,
        filter: "blur(8px)"
      });
    }

    const philTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#philosophySection",
        start: "top 78%",
        toggleActions: "play none none reverse"
      }
    });

    if (philImgCard) {
      philTl.to(philImgCard, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power2.out"
      }, 0);
    }

    if (philChars.length > 0) {
      philTl.to(philChars, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.65,
        stagger: 0.012,
        ease: "power2.out"
      }, 0.2);
    }

    // 4. From The Kitchen (Coastal On A Plate) Section Animations
    const kitLabel = document.getElementById("kitchenLabel");
    const kitTitle = document.getElementById("kitchenTitle");
    const kitSubtitle = document.getElementById("kitchenSubtitle");
    const kitItem1Title = document.getElementById("kitchenItem1Title");
    const kitItem1Desc = document.getElementById("kitchenItem1Desc");
    const kitItem2Title = document.getElementById("kitchenItem2Title");
    const kitItem2Desc = document.getElementById("kitchenItem2Desc");
    const kitItem3Title = document.getElementById("kitchenItem3Title");
    const kitItem3Desc = document.getElementById("kitchenItem3Desc");

    const kitCards = [
      document.getElementById("kitchenBigCard"),
      document.getElementById("kitchenCardTop"),
      document.getElementById("kitchenCardBottom")
    ].filter(Boolean);

    [kitLabel, kitTitle, kitSubtitle, kitItem1Title, kitItem1Desc, kitItem2Title, kitItem2Desc, kitItem3Title, kitItem3Desc].forEach((el) => {
      if (el) splitTextIntoChars(el);
    });

    const kitChars = document.querySelectorAll("#kitchenSection .char");

    if (kitChars.length > 0) {
      gsap.set(kitChars, {
        opacity: 0,
        filter: "blur(14px)",
        y: -24
      });
    }

    if (kitCards.length > 0) {
      gsap.set(kitCards, {
        opacity: 0,
        y: 40,
        filter: "blur(8px)"
      });
    }

    const kitTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#kitchenSection",
        start: "top 78%",
        toggleActions: "play none none reverse"
      }
    });

    if (kitCards.length > 0) {
      kitTl.to(kitCards, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.85,
        stagger: 0.15,
        ease: "power2.out"
      }, 0);
    }

    if (kitChars.length > 0) {
      kitTl.to(kitChars, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.6,
        stagger: 0.008,
        ease: "power2.out"
      }, 0.15);
    }
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
        ScrollTrigger.refresh();
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

    // 4. Staggered letter-by-letter drop blur-to-clear animation
    if (sideChars.length > 0) {
      tl.to(sideChars, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.75,
        stagger: 0.025,
        ease: "power2.out"
      }, 0.65);
    }

    if (sideDecorations.length > 0) {
      tl.to(sideDecorations, {
        opacity: 0.65,
        filter: "blur(0px)",
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.3");
    }
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

window.addEventListener("load", () => {
    requestAnimationFrame(() => {
        if (typeof ScrollTrigger !== "undefined") {
            ScrollTrigger.refresh();
        }
    });
});
