// Components initialization
document.addEventListener('DOMContentLoaded', function() {
    // Load navbar and initialize mobile menu
    loadNavbar();
    
    // Load footer
    loadFooter();
});

// Initialize mobile menu functionality
function initializeMobileMenu() {
    console.log('Initializing mobile menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    if (!mobileMenuBtn || !navLinks || !navActions) {
        console.error('Mobile menu elements not found');
        return;
    }

    // Toggle menu on button click
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('Menu button clicked');
        
        navLinks.classList.toggle('show');
        navActions.classList.toggle('show');
        
        // Toggle menu icon
        const menuIcon = this.querySelector('i');
        menuIcon.classList.toggle('fa-bars');
        menuIcon.classList.toggle('fa-times');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
            navLinks.classList.remove('show');
            navActions.classList.remove('show');
            const menuIcon = mobileMenuBtn.querySelector('i');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
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