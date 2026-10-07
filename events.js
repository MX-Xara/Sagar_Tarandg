(function () {
    gsap.registerPlugin(ScrollTrigger);

    const eventsMm = gsap.matchMedia();

    // DESKTOP (>= 769px) — Full pinned animations & horizontal scroll
    eventsMm.add("(min-width: 769px)", () => {
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
            .to(".events-image-reveal", {
                y: "0vh",
                opacity: 1,
                scale: 1,
                duration: 1.4,
                ease: "power2.out"
            }, 0)
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
    });

    // MOBILE (<= 768px) — Clean layout reset for responsive vertical scrolling
    eventsMm.add("(max-width: 768px)", () => {
        gsap.set([".events-image-reveal", ".reveal-text-container", ".reveal-heading", ".reveal-body", ".hero-title", ".hero-ticket", ".info-left", ".info-center", ".info-right", ".events-horizontal"], {
            clearProps: "all"
        });
    });
})();






