document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // Gallery Dataset & Categorized Images
  // All images strictly sourced from assets/GALLERY/
  // ==========================================================================
  const galleryData = {
    food: {
      folderName: 'FOOD',
      displayName: 'Coastal Delights & Dining',
      tagline: 'CULINARY EXCELLENCE',
      caption: 'A sensory journey of authentic coastal delicacies, fresh catch curries, and poolside refreshments.',
      images: [
        'assets/GALLERY/FOOD/Copy-of-IMG_5780.jpg-1024x683-1-jpeg.webp',
        'assets/GALLERY/FOOD/Copy-of-IMG_5867.jpg-1024x683-1-jpeg.webp',
        'assets/GALLERY/FOOD/Copy-of-IMG_5884.jpg-1024x683-1-jpeg.webp',
        'assets/GALLERY/FOOD/Copy-of-IMG_5886.jpg-1024x683-1-jpeg.webp',
        'assets/GALLERY/FOOD/Copy-of-IMG_5890.jpg-1024x683-1-jpeg 2.webp',
        'assets/GALLERY/FOOD/Copy-of-IMG_5925.jpg-1024x683-1-jpeg.webp',
        'assets/GALLERY/FOOD/Copy-of-IMG_5940.jpg-1024x683-1-jpeg.webp',
        'assets/GALLERY/FOOD/Copy-of-IMG_5953.jpg-1024x683-1-jpeg.webp',
        'assets/GALLERY/FOOD/Copy-of-IMG_5780.jpg-1024x683-1-jpeg 2.webp',
        'assets/GALLERY/FOOD/Copy-of-IMG_5867.jpg-1024x683-1-jpeg 2.webp',
        'assets/GALLERY/FOOD/Copy-of-IMG_5867.jpg-1024x683-1-jpeg 3.webp',
        'assets/GALLERY/FOOD/Copy-of-IMG_5884.jpg-1024x683-1-jpeg 2.webp',
        'assets/GALLERY/FOOD/Copy-of-IMG_5884.jpg-1024x683-1-jpeg 3.webp',
        'assets/GALLERY/FOOD/Copy-of-IMG_5940.jpg-1024x683-1-jpeg 2.webp',
        'assets/GALLERY/FOOD/Copy-of-IMG_5953.jpg-1024x683-1-jpeg 2.webp'
      ]
    },
    amenities: {
      folderName: 'AMENITIES',
      displayName: 'Facade & Architecture',
      tagline: 'SERENE SURROUNDINGS',
      caption: 'Lush tropical grounds, sunlit verandas, and peaceful spaces designed for your ultimate beach getaway.',
      images: [
        'assets/GALLERY/FACADE AND AMENITIES/IMG_1943.WEBP',
        'assets/GALLERY/FACADE AND AMENITIES/IMG_1941.JPG',
        'assets/GALLERY/FACADE AND AMENITIES/IMG_9485.WEBP',
        'assets/GALLERY/FACADE AND AMENITIES/IMG_1945.JPG',
        'assets/GALLERY/FACADE AND AMENITIES/IMG_9501.JPG',
        'assets/GALLERY/FACADE AND AMENITIES/IMG_9503.JPG',
        'assets/GALLERY/FACADE AND AMENITIES/IMG_9504.JPG',
        'assets/GALLERY/FACADE AND AMENITIES/IMG_9507.WEBP'
      ]
    },
    rooms: {
      folderName: 'ROOMS',
      displayName: 'Luxury Rooms & Suites',
      tagline: 'SANCTUARY OF COMFORT',
      caption: 'Comfortable living with serene garden vistas, plush beds, and refreshing coastal breezes.',
      images: [
        'assets/GALLERY/ROOM IMAGES/Super deluxe/fd516d8c-b05a-47e8-9332-5fec5f778823.jpg',
        'assets/GALLERY/ROOM IMAGES/Executive Deluxe/1.webp',
        'assets/GALLERY/ROOM IMAGES/Super deluxe/95e8672d-913b-47f4-b3be-338cc99d9463.jpg',
        'assets/GALLERY/ROOM IMAGES/Garden Facing/IMG_9490.WEBP',
        'assets/GALLERY/ROOM IMAGES/Super deluxe/PHOTO-2026-05-18-11-39-56.jpg',
        'assets/GALLERY/ROOM IMAGES/Executive Deluxe/2.webp',
        'assets/GALLERY/ROOM IMAGES/Garden Facing/IMG_9491.WEBP',
        'assets/GALLERY/ROOM IMAGES/Super deluxe/IMG_1944.WEBP',
        'assets/GALLERY/ROOM IMAGES/Executive Deluxe/3.webp',
        'assets/GALLERY/ROOM IMAGES/Sea side Deluxe/278b48c3-d57e-4019-a305-e78c017e4b6c.jpg',
        'assets/GALLERY/ROOM IMAGES/Executive Deluxe/4.webp',
        'assets/GALLERY/ROOM IMAGES/Garden Facing/IMG_9492.WEBP',
        'assets/GALLERY/ROOM IMAGES/Super deluxe/IMG_9488.WEBP',
        'assets/GALLERY/ROOM IMAGES/Super deluxe/IMG_9487.JPG',
        'assets/GALLERY/ROOM IMAGES/Executive Deluxe/5.webp'
      ]
    },
    pool: {
      folderName: 'POOL',
      displayName: 'Tropical Pool Oasis',
      tagline: 'AZURE TRANQUILITY',
      caption: 'Sparkling waters framed by swaying coconut palms, offering hours of relaxation under the sun.',
      images: [
        'assets/GALLERY/POOL/pool1.jpg',
        'assets/GALLERY/POOL/pool2.jpg',
        'assets/GALLERY/POOL/pool3.jpg',
        'assets/GALLERY/POOL/pool4.jpg',
        'assets/GALLERY/POOL/pool5.jpg',
        'assets/GALLERY/POOL/pool6.jpeg',
        'assets/GALLERY/POOL/IMG_4609.JPG',
        'assets/GALLERY/POOL/IMG_1942.WEBP',
        'assets/GALLERY/POOL/IMG_9486.WEBP'
      ]
    }
  };

  const categoryOrder = ['food', 'amenities', 'rooms', 'pool'];
  let currentCarouselIndex = 0;
  let autoRotateTimer = null;
  const ROTATE_INTERVAL = 4000; // 4 seconds auto-rotation

  // ==========================================================================
  // DOM Elements
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const pillButtons = document.querySelectorAll('.gallery-pill-nav .pill-btn[data-category]');
  const viewMoreBtn = document.getElementById('viewMoreBtn');

  const carouselCards = Array.from(document.querySelectorAll('.carousel-card'));
  const carouselPrevBtn = document.getElementById('carouselPrevBtn');
  const carouselNextBtn = document.getElementById('carouselNextBtn');
  const carouselDots = Array.from(document.querySelectorAll('.carousel-dots .dot'));
  const carouselSection = document.getElementById('carouselSection');
  const fullscreenToggleBtn = document.getElementById('fullscreenToggleBtn');

  // Collage View Elements
  const collageModalView = document.getElementById('collageModalView');
  const collageBackBtn = document.getElementById('collageBackBtn');
  const collageCloseX = document.getElementById('collageCloseX');
  const returnShowcaseBtn = document.getElementById('returnShowcaseBtn');
  const collageBadgeTag = document.getElementById('collageBadgeTag');
  const collageTitleText = document.getElementById('collageTitleText');
  const collageCountBadge = document.getElementById('collageCountBadge');
  const collageCaptionText = document.getElementById('collageCaptionText');
  const asymmetricCollageGrid = document.getElementById('asymmetricCollageGrid');
  const collageScrollContainer = document.getElementById('collageScrollContainer');
  const collageCategoryTabs = document.querySelectorAll('.collage-category-tabs .tab-btn');

  // Lightbox Elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxActiveImg = document.getElementById('lightboxActiveImg');
  const lightboxCategoryName = document.getElementById('lightboxCategoryName');
  const lightboxCounter = document.getElementById('lightboxCounter');

  let activeCollageCategory = 'food';
  let lightboxCurrentList = [];
  let lightboxActiveIndex = 0;

  // ==========================================================================
  // Navbar Mobile Toggle & Scroll Behavior
  // ==========================================================================
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ==========================================================================
  // 3D Rotating Carousel Logic
  // ==========================================================================
  const updateCarousel = (newIndex) => {
    const total = categoryOrder.length;
    currentCarouselIndex = (newIndex + total) % total;

    // Distribute 3D positions for all cards relative to currentCarouselIndex
    carouselCards.forEach((card) => {
      const cardIndex = parseInt(card.getAttribute('data-index'), 10);
      
      // Calculate signed circular offset (-1, 0, 1, 2)
      let diff = (cardIndex - currentCarouselIndex) % total;
      if (diff < -Math.floor(total / 2)) diff += total;
      if (diff > Math.floor((total - 1) / 2)) diff -= total;

      // Remove existing position classes
      card.classList.remove('card-active', 'card-next', 'card-prev', 'card-far-right', 'card-far-left');

      if (diff === 0) {
        card.classList.add('card-active');
        card.setAttribute('aria-hidden', 'false');
      } else if (diff === 1) {
        card.classList.add('card-next');
        card.setAttribute('aria-hidden', 'true');
      } else if (diff === -1) {
        card.classList.add('card-prev');
        card.setAttribute('aria-hidden', 'true');
      } else if (diff >= 2) {
        card.classList.add('card-far-right');
        card.setAttribute('aria-hidden', 'true');
      } else {
        card.classList.add('card-far-left');
        card.setAttribute('aria-hidden', 'true');
      }
    });

    // Update active pill button
    const activeCategoryKey = categoryOrder[currentCarouselIndex];
    pillButtons.forEach((btn) => {
      const cat = btn.getAttribute('data-category');
      btn.classList.toggle('active', cat === activeCategoryKey);
    });

    // Update dots
    carouselDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentCarouselIndex);
    });
  };

  // Next / Prev rotations
  const rotateNext = () => updateCarousel(currentCarouselIndex + 1);
  const rotatePrev = () => updateCarousel(currentCarouselIndex - 1);

  carouselNextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    rotateNext();
    resetAutoRotate();
  });

  carouselPrevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    rotatePrev();
    resetAutoRotate();
  });

  // Dots click
  carouselDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      updateCarousel(idx);
      resetAutoRotate();
    });
  });

  // Pill navigation buttons click
  // "AFTER CLICKING THE RESPECTIVE CARD WILL BE ON TOP"
  pillButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      const targetIndex = categoryOrder.indexOf(category);
      if (targetIndex !== -1) {
        if (targetIndex === currentCarouselIndex) {
          // If already on top, clicking the pill opens the collage!
          openCollage(category);
        } else {
          updateCarousel(targetIndex);
          resetAutoRotate(7000); // give ample time to stay on top
        }
      }
    });
  });

  // Clicking directly on carousel cards
  // If active card clicked -> opens asymmetric collage!
  // If "Open Collage" button clicked on any card -> opens that collage!
  // If side card clicked -> rotates that card to front!
  carouselCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      const category = card.getAttribute('data-category');
      const cardIndex = parseInt(card.getAttribute('data-index'), 10);
      const isHintClicked = e.target.closest('.card-action-hint');

      if (cardIndex === currentCarouselIndex || isHintClicked) {
        // User clicked the front card or Open Collage badge -> open collage!
        openCollage(category);
      } else {
        // User clicked a background card -> bring to top
        updateCarousel(cardIndex);
        resetAutoRotate(7000);
      }
    });

    // Keyboard accessibility for cards
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const category = card.getAttribute('data-category');
        const cardIndex = parseInt(card.getAttribute('data-index'), 10);
        if (cardIndex === currentCarouselIndex) {
          openCollage(category);
        } else {
          updateCarousel(cardIndex);
          resetAutoRotate(7000);
        }
      }
    });
  });

  // "Explore Collage" pill button opens currently active category collage
  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', () => {
      const activeCat = categoryOrder[currentCarouselIndex];
      openCollage(activeCat);
    });
  }

  // Auto-rotation timer
  const startAutoRotate = (interval = ROTATE_INTERVAL) => {
    if (autoRotateTimer) clearInterval(autoRotateTimer);
    autoRotateTimer = setInterval(() => {
      rotateNext();
    }, interval);
  };

  const stopAutoRotate = () => {
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
  };

  const resetAutoRotate = (initialDelay = ROTATE_INTERVAL) => {
    stopAutoRotate();
    if (!collageModalView.classList.contains('open')) {
      if (initialDelay !== ROTATE_INTERVAL) {
        autoRotateTimer = setTimeout(() => {
          rotateNext();
          startAutoRotate();
        }, initialDelay);
      } else {
        startAutoRotate();
      }
    }
  };

  // Pause carousel auto-rotation on mouse hover
  if (carouselSection) {
    carouselSection.addEventListener('mouseenter', stopAutoRotate);
    carouselSection.addEventListener('mouseleave', () => {
      if (!collageModalView.classList.contains('open')) {
        startAutoRotate();
      }
    });
  }

  // ==========================================================================
  // Touch / Swipe Navigation for Carousel
  // ==========================================================================
  let touchStartX = 0;
  let touchEndX = 0;

  carouselSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carouselSection.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleCarouselSwipe();
  }, { passive: true });

  const handleCarouselSwipe = () => {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      rotateNext();
      resetAutoRotate();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      rotatePrev();
      resetAutoRotate();
    }
  };

  // ==========================================================================
  // Fullscreen Toggle (Like reference bottom-right expand icon)
  // ==========================================================================
  if (fullscreenToggleBtn) {
    fullscreenToggleBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn(`Fullscreen request error: ${err.message}`);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });

    document.addEventListener('fullscreenchange', () => {
      const isFullscreen = !!document.fullscreenElement;
      const expandIcon = fullscreenToggleBtn.querySelector('.icon-expand');
      const collapseIcon = fullscreenToggleBtn.querySelector('.icon-collapse');
      if (expandIcon && collapseIcon) {
        expandIcon.style.display = isFullscreen ? 'none' : 'block';
        collapseIcon.style.display = isFullscreen ? 'block' : 'none';
      }
    });
  }

  // ==========================================================================
  // Asymmetric Collage Modal Logic
  // Animation: "IMAGES COMING FROM DOWNWARD PUSHING ALL THE IMAGES TO UPWARD SIDE"
  // Layout: "ASEMETRIC COLLAGE AND ROUNDED CORNERS NOT MUCH MEDIUM SIZED NO BORDER"
  // ==========================================================================
  const asymmetricSpanRhythm = [
    'span-tall',     // 0: Tall vertical
    'span-wide',     // 1: Wide horizontal
    'span-standard', // 2: Medium standard
    'span-grand',    // 3: Large 2x2 hero feature
    'span-standard', // 4: Medium standard
    'span-tall',     // 5: Tall vertical
    'span-wide',     // 6: Wide horizontal
    'span-standard', // 7: Medium standard
    'span-tall',     // 8: Tall vertical
    'span-standard', // 9: Medium standard
    'span-wide',     // 10: Wide horizontal
    'span-grand',    // 11: Large 2x2
    'span-standard', // 12: Medium standard
    'span-tall',     // 13: Tall vertical
    'span-wide'      // 14: Wide horizontal
  ];

  const openCollage = (categoryKey) => {
    const data = galleryData[categoryKey];
    if (!data) return;

    activeCollageCategory = categoryKey;
    stopAutoRotate();

    // Sync carousel to this category as well
    const catIdx = categoryOrder.indexOf(categoryKey);
    if (catIdx !== -1) {
      updateCarousel(catIdx);
    }

    // Set Header Data
    collageBadgeTag.textContent = `${data.folderName} COLLECTION`;
    collageTitleText.textContent = data.displayName;
    collageCountBadge.textContent = `${data.images.length} Photos`;
    collageCaptionText.textContent = data.caption;

    // Update in-collage category tabs
    collageCategoryTabs.forEach((tab) => {
      const cat = tab.getAttribute('data-cat');
      tab.classList.toggle('active', cat === categoryKey);
    });

    // Populate Asymmetric Collage Grid with Upward Staggered Push Animation
    renderCollageImages(data.images, data.folderName);

    // Open Modal with smooth sliding animation
    collageModalView.classList.add('open');
    collageModalView.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scroll
    collageScrollContainer.scrollTop = 0;
  };

  const renderCollageImages = (imgList, folderName) => {
    asymmetricCollageGrid.innerHTML = '';
    lightboxCurrentList = [...imgList];

    imgList.forEach((src, index) => {
      const spanClass = asymmetricSpanRhythm[index % asymmetricSpanRhythm.length];
      
      const item = document.createElement('div');
      item.className = `collage-item ${spanClass}`;
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', `View ${folderName} image ${index + 1}`);

      // Upward push stagger animation delay
      const delay = (index * 0.055).toFixed(3);
      item.style.animationDelay = `${delay}s`;

      item.innerHTML = `
        <img class="collage-img" src="${encodeURI(src)}" alt="${folderName} moment ${index + 1}" loading="lazy" />
        <div class="collage-hover-overlay">
          <span class="collage-hover-label">${folderName} #${index + 1}</span>
          <div class="collage-hover-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </div>
        </div>
      `;

      // Trigger the upward push animation
      requestAnimationFrame(() => {
        item.classList.add('push-up-active');
      });

      // Click to view in Lightbox
      item.addEventListener('click', () => {
        openLightbox(index);
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });

      asymmetricCollageGrid.appendChild(item);
    });
  };

  const closeCollage = () => {
    collageModalView.classList.remove('open');
    collageModalView.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    startAutoRotate();
  };

  // Close collage events
  if (collageBackBtn) collageBackBtn.addEventListener('click', closeCollage);
  if (collageCloseX) collageCloseX.addEventListener('click', closeCollage);
  if (returnShowcaseBtn) returnShowcaseBtn.addEventListener('click', closeCollage);

  // In-collage category switcher tabs
  collageCategoryTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const selectedCat = tab.getAttribute('data-cat');
      if (selectedCat && selectedCat !== activeCollageCategory) {
        openCollage(selectedCat);
      }
    });
  });

  // ==========================================================================
  // Lightbox Modal Logic
  // ==========================================================================
  const openLightbox = (index) => {
    lightboxActiveIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
  };

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
  };

  const updateLightboxContent = () => {
    if (!lightboxCurrentList.length) return;
    const src = lightboxCurrentList[lightboxActiveIndex];
    lightboxActiveImg.src = encodeURI(src);
    lightboxCategoryName.textContent = activeCollageCategory.toUpperCase();
    lightboxCounter.textContent = `${lightboxActiveIndex + 1} / ${lightboxCurrentList.length}`;
  };

  const lightboxNext = () => {
    if (!lightboxCurrentList.length) return;
    lightboxActiveIndex = (lightboxActiveIndex + 1) % lightboxCurrentList.length;
    updateLightboxContent();
  };

  const lightboxPrev = () => {
    if (!lightboxCurrentList.length) return;
    lightboxActiveIndex = (lightboxActiveIndex - 1 + lightboxCurrentList.length) % lightboxCurrentList.length;
    updateLightboxContent();
  };

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', lightboxNext);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', lightboxPrev);

  // Keyboard navigation for Lightbox and Escape for Collage
  document.addEventListener('keydown', (e) => {
    if (lightboxModal.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') lightboxNext();
      if (e.key === 'ArrowLeft') lightboxPrev();
    } else if (collageModalView.classList.contains('open')) {
      if (e.key === 'Escape') closeCollage();
    } else {
      if (e.key === 'ArrowRight') rotateNext();
      if (e.key === 'ArrowLeft') rotatePrev();
    }
  });

  // ==========================================================================
  // Initialize Carousel on Load
  // ==========================================================================
  updateCarousel(0);
  startAutoRotate();

});
