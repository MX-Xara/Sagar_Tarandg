// Sagar Tarang Beach Resort — About Page Interactions & Scroll Animations

document.addEventListener('DOMContentLoaded', () => {
  // =========================================
  // Navbar Scroll & Toggle Functionality
  // =========================================
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initial load check

  // Mobile menu toggle open / close
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close menu when navigation links are clicked
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // =========================================
  // Intersection Observer: Scroll Reveal
  // =========================================
  const observerOptions = {
    root: null, // use viewport
    threshold: 0.12, // trigger when 12% of the element is visible
    rootMargin: '0px 0px -80px 0px' // offset bottom triggers slightly for better flow
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;

        if (target.classList.contains('reveal-parent')) {
          // Stagger reveal of child items
          const children = target.querySelectorAll('.reveal-child');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('revealed');
            }, index * 150); // Stagger by 0.15s as requested
          });
          // Also mark parent itself as revealed
          target.classList.add('revealed');
        } else {
          // Normal single item reveal
          target.classList.add('revealed');
        }

        // Unobserve once revealed to optimize performance
        observer.unobserve(target);
      }
    });
  }, observerOptions);

  // Register targets for reveal
  document.querySelectorAll('.reveal-item, .reveal-parent').forEach(element => {
    revealObserver.observe(element);
  });

  // Dynamic background texture scaling on scroll
  const upperContent = document.querySelector('.about-upper-content');
  if (upperContent) {
    const handleTextureScroll = () => {
      const rect = upperContent.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Progress calculation: 0 when section top is at bottom of viewport,
      // 1 when section top reaches the top of viewport.
      let progress = (viewportHeight - rect.top) / viewportHeight;
      progress = Math.max(0, Math.min(1, progress));
      
      upperContent.style.setProperty('--scroll-progress', progress);
    };
    
    window.addEventListener('scroll', handleTextureScroll, { passive: true });
    handleTextureScroll(); // Trigger initial state check
  }

  // No parallax background script is required as the final-banner-bg image is removed.
});
