gsap.registerPlugin(ScrollTrigger);

// Set initial off-screen state for the reveal image
gsap.set(".events-image-reveal", {
    y: "100vh",
    opacity: 0,
    scale: 0.92
});

// Set initial hidden state for text content
gsap.set(".reveal-text-container", {
    opacity: 0
});

gsap.set(".reveal-heading", {
    y: 40,
    opacity: 0
});

gsap.set(".reveal-body", {
    y: 30,
    opacity: 0
});

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".events-hero",
        start: "top top",
        end: "+=900",
        pin: true,
        scrub: 1,
        anticipatePin: 1
    }
});

/* =========================================
   ANIMATION TIMELINE:
   1. Initial hero text goes UP and fades out
   2. Image comes from BELOW to its position
   3. Text appears beside image as image stops
========================================= */

// Hero header text sliding up together
tl.to(".hero-title", {
    y: -350,
    opacity: 0,
    duration: 1.2,
    ease: "power2.inOut"
}, 0)
    .to(".hero-ticket", {
        y: -300,
        opacity: 0,
        duration: 1.2,
        ease: "power2.inOut"
    }, 0.05)
    .to([".info-left", ".info-center", ".info-right"], {
        y: -250,
        opacity: 0,
        duration: 1.1,
        ease: "power2.inOut"
    }, 0.1)

    // Image coming from below to its position
    .to(".events-image-reveal", {
        y: "0vh",
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: "power2.out"
    }, 0)

    // Text beside image reveals as image arrives / stops
    .to(".reveal-text-container", {
        opacity: 1,
        duration: 0.1
    }, 0.8)
    .to(".reveal-heading", {
        y: 0,
        opacity: 1,
        duration: 1.0,
        ease: "power2.out"
    }, 0.85)
    .to(".reveal-body", {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power2.out"
    }, 1.1);



/* =========================================
HORIZONTAL EVENTS SCROLL
========================================= */

const eventsSection = document.querySelector(".events-showcase");
const eventsTrack = document.querySelector(".events-horizontal");

if (eventsSection && eventsTrack) {

    const getScrollAmount = () => {
        return eventsTrack.scrollWidth - window.innerWidth;
    };

    gsap.to(eventsTrack, {

        x: () => -getScrollAmount(),

        ease: "none",

        scrollTrigger: {

            trigger: eventsSection,

            start: "top top",

            end: () => `+=${getScrollAmount()}`,

            pin: true,

            scrub: 1,

            invalidateOnRefresh: true,

            anticipatePin: 1
        }
    });

}




