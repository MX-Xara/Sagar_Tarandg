document.addEventListener('DOMContentLoaded', () => {
  // =========================================
  // Mobile Navbar Toggle
  // =========================================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  // =========================================
  // Header Scroll adaptation
  // =========================================
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger immediately on load


  // ==========================================================================
  // GALLERY IMAGES CONFIGURATION (WEB PLAYABLE ONLY)
  // ==========================================================================
  // To change, add, or remove images in your infinite marquee gallery:
  // 1. Place your new webp image files inside the "assets/photos" or "assets" folder.
  // 2. Add or modify the relative paths in the "images" array below.
  // 3. Keep the format exactly as: 'assets/photos/filename.webp'
  // 4. The gallery automatically distributes these images across 4 rows.
  // ==========================================================================
  const images = [
    'assets/photos/beach1.webp',
    'assets/photos/beach2.webp',
    'assets/photos/beach3.webp',
    'assets/photos/beach4.webp',
    'assets/photos/food1.webp',
    'assets/photos/food2.webp',
    'assets/photos/food3.webp',
    'assets/photos/food4.webp',
    'assets/photos/food6.webp',
    'assets/photos/food7.webp',
    'assets/photos/food8.webp',
    'assets/photos/food9.webp',
    'assets/photos/sunset vibes.webp',
    'assets/photos/Luminous Ribbons.webp',
    'assets/photos/abstract.webp',
    'assets/photos/banner.webp',
    'assets/photos/download.webp',
    'assets/photos/fent.webp',
    'assets/IMG_5835.JPG.webp',
    'assets/end.webp',
    'assets/resort image.webp',
    'assets/sharks.webp'
  ];

  // ==========================================================================
  // Marquee Tracks Initialization
  // ==========================================================================
  const initializeMarquee = () => {
    const columns = [
      document.querySelector('#col1 .gallery-track-vertical'),
      document.querySelector('#col2 .gallery-track-vertical')
    ];

    // Distribute images evenly across the 2 columns
    const colImages = [[], []];
    images.forEach((img, index) => {
      const colIndex = index % 2;
      colImages[colIndex].push(img);
    });

    // Populate each column track
    columns.forEach((track, colIndex) => {
      if (!track) return;

      const imgList = colImages[colIndex];
      if (imgList.length === 0) return;

      // Ensure we have at least 8 images in the base set to span beyond 100vh on all screens
      let baseList = [...imgList];
      while (baseList.length < 8) {
        baseList = baseList.concat(imgList);
      }

      // Create image helper function
      const createImgElement = (src) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Resort Gallery Photo';
        img.className = 'gallery-image';
        img.draggable = false;
        return img;
      };

      // Append the first half (base set)
      baseList.forEach(src => {
        track.appendChild(createImgElement(src));
      });

      // Append the second half (duplicate set for seamless marquee loop)
      baseList.forEach(src => {
        track.appendChild(createImgElement(src));
      });
    });
  };

  // Build the tracks
  initializeMarquee();
});
