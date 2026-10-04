/* =========================================
   SMOOTH MOMENTUM SCROLL
   ========================================= */

const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);


/* =========================================
   TEXT ANIMATION
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ELEMENTS — SECTION 1
       ========================================= */

    const label1 = document.getElementById("about2Label1");
    const title1 = document.getElementById("about2Title1");
    const subtitle1 = document.getElementById("about2Subtitle1");


    /* =========================================
       ELEMENTS — SECTION 2
       ========================================= */

    const title2 = document.getElementById("about2Title2");
    const subtitle2 = document.getElementById("about2Subtitle2");


    /* =========================================
       SPLIT TEXT INTO LETTERS
       ========================================= */

    function splitIntoLetters(element) {

        if (!element) return;

        const text = element.textContent.trim();

        element.textContent = "";

        [...text].forEach((character) => {

            const span = document.createElement("span");

            span.classList.add("letter");

            span.textContent =
                character === " " ? "\u00A0" : character;

            element.appendChild(span);

        });
    }


    /* Split Section 1 */

    splitIntoLetters(label1);
    splitIntoLetters(title1);
    splitIntoLetters(subtitle1);


    /* Split Section 2 */

    splitIntoLetters(title2);
    splitIntoLetters(subtitle2);


    /* =========================================
       SECTION 1 ANIMATION
       STARTS IMMEDIATELY AS PAGE LOADS
       ========================================= */

    setTimeout(() => {

        /* ABOUT US */
        if (label1) {
            label1.classList.add("animate");

            label1.querySelectorAll(".letter").forEach((letter, index) => {

                letter.style.transitionDelay =
                    `${index * 0.035}s`;

            });
        }


        /* BIG TITLE */
        if (title1) {
            title1.classList.add("animate");

            title1.querySelectorAll(".letter").forEach((letter, index) => {

                letter.style.transitionDelay =
                    `${0.2 + index * 0.025}s`;

            });
        }


        /* BODY TEXT */
        if (subtitle1) {
            subtitle1.classList.add("animate");

            subtitle1.querySelectorAll(".letter").forEach((letter, index) => {

                letter.style.transitionDelay =
                    `${0.65 + index * 0.012}s`;

            });
        }

    }, 100);


    /* =========================================
       SECTION 2 ANIMATION
       STARTS WHEN USER SCROLLS TO IT
       ========================================= */

    const secondSection =
        document.querySelector(".about-2-text-section");


    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    /* BIG TITLE */

                    title2.classList.add("animate");

                    title2.querySelectorAll(".letter").forEach((letter, index) => {

                        letter.style.transitionDelay =
                            `${index * 0.035}s`;

                    });


                    /* BODY TEXT */

                    subtitle2.classList.add("animate");

                    subtitle2.querySelectorAll(".letter").forEach((letter, index) => {

                        letter.style.transitionDelay =
                            `${0.9 + index * 0.018}s`;

                    });


                    observer.unobserve(secondSection);

                }

            });

        },
        {
            threshold: 0.35
        }
    );


    observer.observe(secondSection);


    /* =========================================
       ELEMENTS — SECTION 3
       ========================================= */

    const title3 = document.getElementById("about2Title3");
    const subtitle3 = document.getElementById("about2Subtitle3");
    const owner3 = document.getElementById("about2Owner3");

    /* Split Section 3 */
    splitIntoLetters(title3);
    splitIntoLetters(subtitle3);
    splitIntoLetters(owner3);

    /* =========================================
       SECTION 3 ANIMATION (SCROLL OBSERVER)
       ========================================= */

    const thirdSection = document.querySelector(".about-2-asymmetric-section");

    if (thirdSection) {
        const observer3 = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {

                        /* TITLE 3 */
                        if (title3) {
                            title3.classList.add("animate");
                            title3.querySelectorAll(".letter").forEach((letter, index) => {
                                letter.style.transitionDelay = `${index * 0.025}s`;
                            });
                        }

                        /* SUBTITLE 3 */
                        if (subtitle3) {
                            subtitle3.classList.add("animate");
                            subtitle3.querySelectorAll(".letter").forEach((letter, index) => {
                                letter.style.transitionDelay = `${0.6 + index * 0.018}s`;
                            });
                        }

                        /* OWNER 3 */
                        if (owner3) {
                            owner3.classList.add("animate");
                            owner3.querySelectorAll(".letter").forEach((letter, index) => {
                                letter.style.transitionDelay = `${1.1 + index * 0.018}s`;
                            });
                        }

                        observer3.unobserve(thirdSection);
                    }
                });
            },
            {
                threshold: 0.25
            }
        );

        observer3.observe(thirdSection);
    }


    /* =========================================
       SECTION 4 ANIMATION (PARAGRAPH BLOCKS)
       ========================================= */

    const fourthSection = document.querySelector(".about-2-asymmetric-section-4");
    const paras4 = document.querySelectorAll(".about-2-para-4");

    if (fourthSection && paras4.length > 0) {
        const observer4 = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        paras4.forEach((para, index) => {
                            para.style.transitionDelay = `${index * 0.25}s`;
                            para.classList.add("animate");
                        });

                        observer4.unobserve(fourthSection);
                    }
                });
            },
            {
                threshold: 0.25
            }
        );

        observer4.observe(fourthSection);
    }


    /* =========================================
       SECTION 5 ANIMATION (ALL HEADERS AT ONCE)
       ========================================= */

    const fifthSection = document.querySelector(".about-2-grid-section-5");
    const headers5 = document.querySelectorAll(".about-2-grid-header-5");

    if (fifthSection && headers5.length > 0) {
        const observer5 = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        /* Reveal all 3 header texts at the exact same time */
                        headers5.forEach((header) => {
                            header.classList.add("animate");
                        });

                        observer5.unobserve(fifthSection);
                    }
                });
            },
            {
                threshold: 0.25
            }
        );

        observer5.observe(fifthSection);
    }


    /* =========================================
       SECTION 6 ANIMATION (CTA BANNER CARD)
       ========================================= */

    const sixthSection = document.querySelector(".about-2-card-section-6");
    const cardContent6 = document.querySelector(".about-2-card-content-6");

    if (sixthSection && cardContent6) {
        const observer6 = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        cardContent6.classList.add("animate");
                        observer6.unobserve(sixthSection);
                    }
                });
            },
            {
                threshold: 0.25
            }
        );

        observer6.observe(sixthSection);
    }

});


