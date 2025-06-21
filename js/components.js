// Components initialization
document.addEventListener('DOMContentLoaded', function() {
    // Load navbar and initialize mobile menu
    loadNavbar();
    
    // Load footer
    loadFooter();
    renderEcosystemSection();
});

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    if (!mobileMenuBtn || !navLinks || !navActions) return;

    function openMenu() {
        navLinks.classList.add('active');
        navActions.classList.add('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        const menuIcon = mobileMenuBtn.querySelector('i');
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
    }
    function closeMenu() {
        navLinks.classList.remove('active');
        navActions.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        const menuIcon = mobileMenuBtn.querySelector('i');
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        if (expanded) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
            closeMenu();
        }
    });
    // Auto-collapse menu after clicking a link (optional enhancement)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
        link.style.minHeight = '44px';
        link.style.lineHeight = '44px';
    });
}

// Load navbar
function loadNavbar() {
    const navbarContainer = document.getElementById('navbar');
    if (!navbarContainer) {
        console.error('Navbar container not found');
        return;
    }

    // Determine the correct path based on current page location
    const path = window.location.pathname.includes('/') ? '' : '../';
    
    fetch(path + 'elements/navbar.html')
        .then(response => response.text())
        .then(data => {
            navbarContainer.innerHTML = data;
            initializeMobileMenu();
            if (typeof initializeComingSoonAlerts === 'function') {
                initializeComingSoonAlerts();
            }
        })
        .catch(error => console.error('Error loading navbar:', error));
}

// Load footer
function loadFooter() {
    const footerContainer = document.getElementById('footer');
    if (!footerContainer) {
        console.error('Footer container not found');
        return;
    }

    // Determine the correct path based on current page location
    const path = window.location.pathname.includes('/') ? '' : '../';
    
    fetch(path + 'elements/footer.html')
        .then(response => response.text())
        .then(data => {
            footerContainer.innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Load ecosystem section dynamically from API
function renderEcosystemSection() {
  const section = document.getElementById('ecosystem-section');
  if (!section) return;
  // Add a container for the cards
  section.innerHTML = `
    <div class="container">
      <h2>NAIYO24 Ecosystem</h2>
      <p class="ecosystem-subtitle">Explore our family of innovative solutions</p>
      <div class="partner-grid" id="ecosystem-cards"></div>
    </div>
  `;
  // Fetch data from backend API (use full URL for dev)
  fetch('http://127.0.0.1:5000/api/ecosystem')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('ecosystem-cards');
      if (!container) return;
      data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'partner-card';
        card.innerHTML = `
          <i class="fas fa-${item.icon_name}"></i>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => {
      section.innerHTML += '<p style="color:red">Failed to load ecosystem data.</p>';
    });
}

// Expose infinite auto-scroll for .partner-grid as a function
window.initializePartnerGridAutoScroll = function() {
    const grid = document.querySelector('.partner-grid');
    if (!grid) return;
    let autoScroll = true;
    let scrollInterval;
    let scrollDirection = 1; // 1 for right, -1 for left
    const scrollSpeed = 1; // px per tick
    const scrollDelay = 20; // ms per tick
    const threshold = 2; // pixels from edge to trigger direction change

    function startAutoScroll() {
        if (scrollInterval) clearInterval(scrollInterval);
        scrollInterval = setInterval(() => {
            if (!autoScroll) return;
            
            const atEnd = grid.scrollLeft + grid.offsetWidth >= grid.scrollWidth - threshold;
            const atStart = grid.scrollLeft <= threshold;

            // Change direction when reaching edges
            if (atEnd && scrollDirection > 0) {
                scrollDirection = -1;
            } else if (atStart && scrollDirection < 0) {
                scrollDirection = 1;
            }

            // Apply scroll with current direction
            grid.scrollLeft += (scrollSpeed * scrollDirection);
        }, scrollDelay);
    }

    function stopAutoScroll() {
        if (scrollInterval) clearInterval(scrollInterval);
    }

    // Pause on hover or mousedown
    grid.addEventListener('mouseenter', () => {
        autoScroll = false;
    });

    // Resume on mouseleave
    grid.addEventListener('mouseleave', () => {
        autoScroll = true;
    });

    // Pause on mousedown (for manual scroll)
    grid.addEventListener('mousedown', () => {
        autoScroll = false;
    });

    // Resume on mouseup
    grid.addEventListener('mouseup', () => {
        autoScroll = true;
    });

    // Handle manual scroll without breaking auto-scroll
    let userScrolling = false;
    grid.addEventListener('scroll', () => {
        if (userScrolling || !autoScroll) return;
        
        // Don't reset scroll position during auto-scroll
        const atEnd = grid.scrollLeft + grid.offsetWidth >= grid.scrollWidth - threshold;
        const atStart = grid.scrollLeft <= threshold;

        if (atEnd && scrollDirection > 0) {
            scrollDirection = -1;
        } else if (atStart && scrollDirection < 0) {
            scrollDirection = 1;
        }
    });

    // Track manual scroll
    grid.addEventListener('scrollend', () => {
        userScrolling = false;
    });
    grid.addEventListener('scrollstart', () => {
        userScrolling = true;
    });

    startAutoScroll();
};

// Toast popup for liquor delivery (bonus)
window.showLiquorToast = function() {
    if (document.getElementById('liquor-toast')) return;
    const toast = document.createElement('div');
    toast.id = 'liquor-toast';
    toast.className = 'toast-popup';
    toast.innerHTML = '🍾 Liquor delivery now active 24x7!';
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
};

// Show toast after 5 seconds on homepage
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '/index.html') {
    setTimeout(() => {
        if (typeof window.showLiquorToast === 'function') window.showLiquorToast();
    }, 5000);
}
