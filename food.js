document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navbar Toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  // Header Scroll adaptation
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

  // Intersection Observer for Reveal animations
  const revealElements = document.querySelectorAll('.reveal-parent');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // =========================================
  // Menu Dataset & Dynamic Marquee Showcase
  // =========================================

  const menuData = {
    breakfast: [
      { name: "Poha", price: 65, description: "Flattened rice seasoned with onions, mustard seeds, curry leaves, and turmeric.", image: "assets/food/food1.webp" },
      { name: "Upma", price: 65, description: "Savory semolina porridge cooked with fresh vegetables and aromatic spices.", image: "assets/food/food2.webp" },
      { name: "Sheera", price: 70, description: "Sweet semolina pudding roasted in pure ghee and topped with cardamoms.", image: "assets/food/food3.webp" },
      { name: "Ghavan Chutney*", price: 90, description: "Soft, lacy Konkani rice crepes served with freshly ground coconut chutney.", image: "assets/food/food1.webp" },
      { name: "Thalipeeth", price: 90, description: "Spiced multi-grain savory flatbread made with roasted flour and herbs.", image: "assets/food/food2.webp" },
      { name: "Bhajani Vada (4 pcs.)", price: 90, description: "Deep-fried savory multi-grain dumplings, crisp outside and soft inside.", image: "assets/food/food3.webp" },
      { name: "Misal Pav", price: 90, description: "Sprouted moth bean curry topped with spicy farsan, served with soft pav.", image: "assets/food/food1.webp" },
      { name: "Sabudana Khichadi", price: 80, description: "Sago pearls sautéed with roasted peanuts, cumin, green chillies, and ghee.", image: "assets/food/food2.webp" },
      { name: "Sabudana Vada", price: 90, description: "Deep-fried crispy sago and potato patties seasoned with peanut powder.", image: "assets/food/food3.webp" },
      { name: "Batata Vada (3 pcs.)", price: 60, description: "Spiced mashed potato balls coated in gram flour batter and fried golden.", image: "assets/food/food1.webp" },
      { name: "Omelet Double", price: 90, description: "Fluffy double eggs whisked with onions, green chillies, and fresh coriander.", image: "assets/food/food6.webp" },
      { name: "Omelet Single", price: 45, description: "Single farm-fresh egg omelet seasoned with salt and spices.", image: "assets/food/food6.webp" },
      { name: "Boiled Egg", price: 20, description: "Simple farm-fresh egg hard-boiled to perfection.", image: "assets/food/food6.webp" },
      { name: "Bhurji Pav", price: 90, description: "Scrambled eggs cooked with chopped onions, tomatoes, and spicy masalas.", image: "assets/food/food6.webp" },
      { name: "Sandwich", price: 70, description: "Classic toasted bread layered with butter, cucumber, and tomatoes.", image: "assets/food/food1.webp" },
      { name: "Cheese Sandwich", price: 85, description: "Toasted sandwich loaded with melted cheese and fresh vegetable slices.", image: "assets/food/food2.webp" },
      { name: "Bread Butter Toast", price: 50, description: "Crispy toasted bread slices served with premium dairy butter.", image: "assets/food/food3.webp" },
      { name: "Bread Butter Jam", price: 60, description: "Toasted bread slices layered with rich butter and sweet mixed fruit jam.", image: "assets/food/food1.webp" },
      { name: "Kanda Bhaji", price: 70, description: "Crispy deep-fried onion fritters in seasoned chickpea batter.", image: "assets/food/food2.webp" },
      { name: "Batata Bhaji", price: 70, description: "Crispy deep-fried potato slices dipped in a spiced chickpea batter.", image: "assets/food/food3.webp" },
      { name: "Wangyache Kap*", price: 150, description: "Shallow-fried eggplant slices coated in spicy rava (semolina) and herbs.", image: "assets/food/food1.webp" },
      { name: "French Fries", price: 100, description: "Golden-fried crispy potato batons sprinkled with sea salt.", image: "assets/food/food2.webp" },
      { name: "Maggie", price: 50, description: "Quick-cooked instant noodles prepared plain and simple.", image: "assets/food/food3.webp" },
      { name: "Masala Maggie", price: 60, description: "Quick-cooked noodles tossed with aromatic Indian spices and vegetables.", image: "assets/food/food1.webp" },
      { name: "Extra Pav", price: 5, description: "Soft buttered bakery bread slice to accompany your snack.", image: "assets/food/food2.webp" }
    ],
    sides: [
      { name: "Green Salad", price: 80, description: "Freshly sliced cucumber, carrots, tomatoes, onions, and green chillies.", image: "assets/food/food2.webp" },
      { name: "Papad", price: 10, description: "Crispy roasted or deep-fried lentil flatbread.", image: "assets/food/food1.webp" },
      { name: "Masala Papad", price: 40, description: "Crisp fried papad topped with a tangy mix of onions, tomatoes, and chaat masala.", image: "assets/food/food2.webp" },
      { name: "Curd", price: 40, description: "Creamy, cooling freshly set yogurt.", image: "assets/food/food3.webp" }
    ],
    "veg-main": [
      { name: "Veg Thali", price: 240, description: "A balanced meal of two seasonal veg curries, dal, rice, chapati, papad, and pickle.", image: "assets/food/food3.webp" },
      { name: "Pithla Thali", price: 160, description: "Traditional gram flour curry (Pithla) served with bhakri/chapati, rice, and condiments.", image: "assets/food/food2.webp" },
      { name: "Kulith Pithla Thali", price: 150, description: "Nutritious horse gram flour curry thali, a local Konkani specialty.", image: "assets/food/food3.webp" },
      { name: "Vanga Bharta Thali", price: 235, description: "Traditional roasted eggplant mash curry thali cooked with garlic and spring onions.", image: "assets/food/food2.webp" },
      { name: "Bhaji Chapati", price: 120, description: "Simple comfort plate of freshly cooked dry vegetable curry served with soft chapatis.", image: "assets/food/food3.webp" },
      { name: "Usal Chapati", price: 120, description: "Flavorful sprouted beans curry (Usal) served with hand-rolled chapatis.", image: "assets/food/food2.webp" },
      { name: "Dal Tadka", price: 100, description: "Yellow lentils tempered with cumin, minced garlic, dried red chillies, and pure ghee.", image: "assets/food/food3.webp" },
      { name: "Chapati", price: 20, description: "Soft, hot hand-rolled wheat flatbread cooked on the griddle.", image: "assets/food/food2.webp" },
      { name: "Bhakari", price: 25, description: "Traditional rustic flatbread prepared from rice flour or jowar.", image: "assets/food/food3.webp" }
    ],
    "non-veg-main": [
      { name: "Pomfret Thali", price: 525, description: "Crispy pomfret fry, flavorful fish curry, solkadhi, rice, and bhakri.", image: "assets/food/food9.webp" },
      { name: "Surmai Thali", price: 575, description: "Premium kingfish fry, authentic fish curry, solkadhi, rice, and bhakri/chapati.", image: "assets/food/food7.webp" },
      { name: "Prawns Thali", price: 525, description: "Crispy golden prawns fry, thick prawn masala gravy, solkadhi, rice, and bhakri.", image: "assets/food/food8.webp" },
      { name: "Chicken Thali", price: 375, description: "Spicy local chicken curry, dry chicken sukka, solkadhi, rice, and bhakri.", image: "assets/food/food6.webp" },
      { name: "Mutton Thali", price: 580, description: "Slow-cooked tender mutton curry, dry mutton sukka, solkadhi, rice, and bhakri.", image: "assets/food/food6.webp" },
      { name: "Anda Thali", price: 200, description: "Rich egg curry, boiled egg half, solkadhi, steamed rice, and chapati.", image: "assets/food/food6.webp" },
      { name: "Crab Thali", price: 525, description: "Fresh crabs cooked in a fiery coconut-based masala curry, served with solkadhi and bhakri.", image: "assets/food/seefood.jpeg" },
      { name: "Sukat Fry & Bhakri", price: 170, description: "Stir-fried dry baby shrimp cooked with onions, spices, and served with bhakri.", image: "assets/food/food8.webp" },
      { name: "Jawla Fry & Bhakri", price: 170, description: "Flavorful dried tiny fish stir-fry with local masalas, served with hot rice flatbread.", image: "assets/food/food7.webp" },
      { name: "Kalwa Masala & Bhakri", price: 250, description: "Fresh local oysters simmered in an aromatic, rich coconut coastal gravy.", image: "assets/food/seefood.jpeg" },
      { name: "Shivlya Masala & Bhakri", price: 250, description: "Fresh clams cooked in their shells in a highly seasoned traditional black masala gravy.", image: "assets/food/seefood.jpeg" },
      { name: "Prawn Masala & Bhakri", price: 360, description: "Succulent prawns cooked in a thick spicy onion-tomato masala, served with bhakri.", image: "assets/food/food8.webp" },
      { name: "Jawla Bhaji", price: 100, description: "Rustic stir-fry of baby dried fish cooked with spices and spring onions.", image: "assets/food/food7.webp" }
    ],
    fried: [
      { name: "Pomfret Fry", price: 300, description: "Whole pomfret marinated in coastal spices, coated in rava, and crisp-fried.", image: "assets/food/food9.webp" },
      { name: "Surmai Fry", price: 300, description: "Thick slices of fresh kingfish, rava-fried with a crispy outer shell and tender inside.", image: "assets/food/food7.webp" },
      { name: "Prawns Fry", price: 320, description: "Fresh juicy prawns marinated in spice blend and pan-fried with semolina coating.", image: "assets/food/food8.webp" },
      { name: "Bangda Fry", price: 200, description: "Fresh mackerel stuffed with local green herbs and spices, fried crisp.", image: "assets/food/seefood.jpeg" },
      { name: "Bombil Fry", price: 200, description: "Famous Bombay Duck fish, pressed dry, spiced, and rava-fried extra crunchy.", image: "assets/food/food7.webp" },
      { name: "Mandeli Fry", price: 175, description: "Crispy golden deep-fried baby anchovies, an addictive coastal appetizer.", image: "assets/food/food8.webp" },
      { name: "Kanda Sukat Fry", price: 100, description: "Pan-fried dry baby shrimp cooked with lots of chopped onions and chillies.", image: "assets/food/food7.webp" },
      { name: "Kanda Prawns Fry", price: 345, description: "Fresh prawns fried with caramelized onions, green chillies, and Konkani spices.", image: "assets/food/food8.webp" },
      { name: "Sukhe Bombil Fry", price: 150, description: "Pan-fried sun-dried Bombay Duck strips tossed with onions and masalas.", image: "assets/food/food7.webp" },
      { name: "Kalwa Fry", price: 200, description: "Golden pan-fried spiced fresh oysters coated in breadcrumbs or semolina.", image: "assets/food/seefood.jpeg" },
      { name: "Ravas Fry", price: 245, description: "Tender Indian Salmon fish fillet, spiced and pan-fried with rava.", image: "assets/food/food9.webp" },
      { name: "Chicken Sukka Fry", price: 240, description: "Pan-fried seasoned chicken pieces cooked dry with freshly grated roasted coconut.", image: "assets/food/food6.webp" },
      { name: "Mutton Sukka Fry", price: 375, description: "Pan-fried seasoned mutton pieces cooked dry with freshly grated roasted coconut.", image: "assets/food/food6.webp" },
      { name: "Bheja Fry", price: 315, description: "Rich scrambled goat brain sautéed with green herbs, onions, and spices.", image: "assets/food/food6.webp" }
    ],
    rice: [
      { name: "Plain Rice", price: 50, description: "Steamed premium long-grain rice, fluffy and hot.", image: "assets/food/food3.webp" },
      { name: "Jeera Rice", price: 100, description: "Fluffy rice tossed with aromatic cumin seeds and pure ghee.", image: "assets/food/food9.webp" },
      { name: "Dal Rice", price: 120, description: "Hearty yellow lentils served over steaming plain rice.", image: "assets/food/food3.webp" },
      { name: "Dal Khichadi", price: 170, description: "One-pot comfort meal of rice and yellow lentils cooked soft and tempered with garlic ghee.", image: "assets/food/food3.webp" },
      { name: "Kadhi Khichadi / Koshimbir", price: 175, description: "Comforting khichadi served with a tangy spiced yogurt curry and fresh salad.", image: "assets/food/food2.webp" },
      { name: "Masale Bhat*", price: 300, description: "Spicy, aromatic rice cooked with mixed vegetables and traditional Goda masala.", image: "assets/food/food3.webp" },
      { name: "Kolambi Bhat*", price: 370, description: "Fragrant coastal prawns rice cooked with ginger-garlic paste and fresh green herbs.", image: "assets/food/seefood.jpeg" },
      { name: "Chicken Rice", price: 240, description: "Rice cooked with spiced chicken pieces and regional spices.", image: "assets/food/food6.webp" }
    ],
    desserts: [
      { name: "Ukadiche Modak* (1 pc.)", price: 35, description: "Steamed rice-flour dumpling stuffed with fresh grated coconut and jaggery, served with ghee.", image: "assets/food/food2.webp" },
      { name: "Shrikhand Wati", price: 50, description: "Sweet, thick cardamon-infused strained yogurt dessert.", image: "assets/food/food3.webp" },
      { name: "Amrakhand Wati", price: 60, description: "Thick strained yogurt blended with pure sweet Alphonso mango pulp.", image: "assets/food/food2.webp" },
      { name: "Kheer Wati", price: 50, description: "Rich sweet milk pudding cooked with rice, saffron, almonds, and pistachios.", image: "assets/food/food3.webp" },
      { name: "Sheera Wati", price: 50, description: "Small bowl of sweet semolina pudding roasted in pure ghee.", image: "assets/food/food3.webp" },
      { name: "Aamras Wati (Seasonal)", price: 50, description: "Pure sweet pulp extracted from ripe Alphonso mangoes.", image: "assets/food/food2.webp" }
    ],
    beverages: [
      { name: "Tea", price: 15, description: "Freshly brewed milk tea infused with cardamom and ginger.", image: "assets/food/food4.webp" },
      { name: "Black Tea", price: 15, description: "Hot tea brewed plain without milk.", image: "assets/food/food4.webp" },
      { name: "Coffee", price: 25, description: "Brewed milk coffee, rich and aromatic.", image: "assets/food/food4.webp" },
      { name: "Black Coffee", price: 20, description: "Hot espresso brewed plain without milk.", image: "assets/food/food4.webp" },
      { name: "Milk", price: 25, description: "Hot glass of milk sweetened with sugar.", image: "assets/food/food4.webp" },
      { name: "Bournvita", price: 30, description: "Hot chocolate malt milk beverage.", image: "assets/food/food4.webp" },
      { name: "Taak", price: 20, description: "Cooling spiced buttermilk seasoned with roasted cumin and coriander.", image: "assets/food/food4.webp" },
      { name: "Sol Kadhi*", price: 35, description: "Refreshing pink beverage made from kokum extract and fresh coconut milk.", image: "assets/food/food4.webp" },
      { name: "Limbu Sarbat", price: 25, description: "Freshly squeezed lime juice cooler, sweet and salty.", image: "assets/food/food4.webp" },
      { name: "Kokum Sarbat", price: 25, description: "Tangy-sweet coastal kokum syrup cooling cooler.", image: "assets/food/food4.webp" },
      { name: "Water Bottle", price: 20, description: "Purified packaged mineral drinking water.", image: "assets/food/food4.webp" }
    ]
  };

  // Function to build and populate scroller rows
  function populateMarquees(category) {
    const items = menuData[category] || [];
    if (items.length === 0) return;

    const trackLtr = document.getElementById('trackLtr');
    const trackRtl = document.getElementById('trackRtl');

    if (!trackLtr || !trackRtl) return;

    // Reset scrollers content
    trackLtr.innerHTML = '';
    trackRtl.innerHTML = '';

    // Split items into row 1 and row 2
    const half = Math.ceil(items.length / 2);
    const row1Items = items.slice(0, half);
    const row2Items = items.slice(half);

    // Populate LTR Row
    buildSingleTrack(trackLtr, row1Items);
    // Populate RTL Row
    buildSingleTrack(trackRtl, row2Items);
  }

  function buildSingleTrack(container, items) {
    if (items.length === 0) return;

    // We want at least 10 cards inside the track before duplicating to ensure standard dense scroller look
    const targetMinLength = 10;
    let repeatCount = Math.ceil(targetMinLength / items.length);
    if (repeatCount < 1) repeatCount = 1;

    // Create the base repeated array
    let baseList = [];
    for (let i = 0; i < repeatCount; i++) {
      baseList = baseList.concat(items);
    }

    // Duplicate array once for the infinite loop layout shift trick
    const fullList = baseList.concat(baseList);

    // Build DOM elements
    fullList.forEach(item => {
      const card = document.createElement('div');
      card.className = 'marquee-card';

      card.innerHTML = `
        <div class="marquee-img-wrapper">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        <div class="marquee-info">
          <h3 class="marquee-name">${item.name}</h3>
          <p class="marquee-desc">${item.description}</p>
          <span class="marquee-price">₹${item.price}</span>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Hook tab click events
  const tabs = document.querySelectorAll('.category-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from current tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Add active to clicked tab
      tab.classList.add('active');

      const selectedCategory = tab.getAttribute('data-category');

      // Add a quick fade out/in effect for content transition
      const container = document.querySelector('.showcase-container');
      container.style.opacity = '0.3';
      container.style.transition = 'opacity 0.2s ease';

      setTimeout(() => {
        populateMarquees(selectedCategory);
        container.style.opacity = '1';
      }, 200);
    });
  });

  // Initial load
  populateMarquees('breakfast');
});
