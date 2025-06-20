// Main JavaScript file for BHUKK website

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Initialize features that don't depend on navbar
    initializeTheme();
    initializeScrollAnimations();
    initializeAIAssistant();
    initializeGlassEffects();
    initializePartnerScroll();
    
    // We don't need to call initializeMobileMenu() here as it's called after navbar loads
});

// Theme toggling functionality
function initializeTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme based on user preference
    if (prefersDarkScheme.matches) {
        document.body.setAttribute('data-theme', 'dark');
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.body.removeAttribute('data-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
}

// Scroll animations
function initializeScrollAnimations() {
    // Regular fade-in animation for most elements
    const regularElements = document.querySelectorAll('.feature-card, .app-feature, .benefit');
    const partnerCards = document.querySelectorAll('.partner-card');
    
    // Regular fade animation for standard elements
    const standardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                standardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    regularElements.forEach(element => {
        standardObserver.observe(element);
    });    // Modern 3D animation for partner cards
    const partnerObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay based on index
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 150); // 150ms delay between each card
                
                // Enhanced hover effects with better animation
                entry.target.addEventListener('mouseenter', (e) => {
                    e.target.style.transform = 'translateY(-10px) scale(1.05)';
                });
                
                entry.target.addEventListener('mouseleave', (e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                });

                // Remove existing event listeners to prevent duplicates
                const card = entry.target;
                const newCard = card.cloneNode(true);
                card.parentNode.replaceChild(newCard, card);
                partnerObserver.observe(newCard);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '20px'
    });

    // Initialize partner cards with improved starting styles
    partnerCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        partnerObserver.observe(card);
    });
}


// Navbar transparency
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Initialize glass effects
function initializeGlassEffects() {
    const glassElements = document.querySelectorAll('.feature-card, .partner-card, .chat-container');
    glassElements.forEach(el => {
        el.classList.add('glass-animate');
    });
}

// Add loading states
function setLoading(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading-glass');
    } else {
        element.classList.remove('loading-glass');
    }
}

// Optimize backdrop-filter performance
const glassContainers = document.querySelectorAll('.feature-card, .partner-card, .chat-container');
const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
};

const glassObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.willChange = 'backdrop-filter';
        } else {
            entry.target.style.willChange = 'auto';
        }
    });
}, observerOptions);

glassContainers.forEach(container => {
    glassObserver.observe(container);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        if (email) {
            // Here you would typically send this to your backend
            alert('Thank you for subscribing!');
            this.reset();
        }
    });
}

// Coming soon alerts
function initializeComingSoonAlerts() {
    // Create alert elements if they don't exist
    if (!document.querySelector('.custom-alert-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';
        document.body.appendChild(overlay);

        const alertBox = document.createElement('div');
        alertBox.className = 'custom-alert';
        alertBox.innerHTML = `
            <h3>Coming Soon!</h3>
            <p></p>
            <button>Got it!</button>
        `;
        document.body.appendChild(alertBox);

        // Close alert on button click or overlay click
        alertBox.querySelector('button').addEventListener('click', hideAlert);
        overlay.addEventListener('click', hideAlert);
    }

    // Add click handlers to all elements with coming-soon class
    document.querySelectorAll('.coming-soon').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            let title = 'Coming Soon!';
            let message = '';
            
            // Customize message based on element type and content
            if (element.classList.contains('store-button')) {
                title = 'Mobile App Coming Soon!';
                message = 'Our mobile app is in development! Get ready for a seamless food ordering experience with exclusive app-only features.';
            } else if (element.textContent.trim().toLowerCase().includes('login')) {
                title = 'Login Coming Soon!';
                message = 'Our secure login system is under development. Stay tuned for personalized features and saved preferences!';
            } else if (element.textContent.trim().toLowerCase().includes('order')) {
                title = 'Online Ordering Coming Soon!';
                message = 'We\'re cooking up something special! Our online ordering system will be ready to serve you soon.';
            } else if (element.textContent.trim().toLowerCase().includes('liquor')) {
                title = '24x7 Liquor Coming Soon!';
                message = 'Our 24x7 liquor delivery service is coming soon! Get ready for convenient and responsible beverage delivery.';
            }
            
            showAlert(title, message);
        });
    });
}

function showAlert(title, message) {
    const alertBox = document.querySelector('.custom-alert');
    const overlay = document.querySelector('.custom-alert-overlay');
    
    alertBox.querySelector('h3').textContent = title;
    alertBox.querySelector('p').textContent = message;
    
    overlay.classList.add('show');
    alertBox.classList.add('show');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function hideAlert() {
    const alertBox = document.querySelector('.custom-alert');
    const overlay = document.querySelector('.custom-alert-overlay');
    
    overlay.classList.remove('show');
    alertBox.classList.remove('show');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Initialize Partner Section Scroll
function initializePartnerScroll() {
    const partnerGrid = document.querySelector('.partner-grid');
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');
    const scrollAmount = 300; // Amount to scroll by

    // --- Auto-scroll logic ---
    if (partnerGrid) {
        let autoScrollActive = true;
        let lastUserScroll = Date.now();
        setInterval(() => {
            // Debug: log scrollLeft and widths
            // Remove or comment out after confirming
            // console.log('Auto-scroll tick', partnerGrid.scrollLeft, partnerGrid.offsetWidth, partnerGrid.scrollWidth);
            if (!autoScrollActive) return;
            if (partnerGrid.scrollWidth > partnerGrid.offsetWidth) {
                if (partnerGrid.scrollLeft + partnerGrid.offsetWidth < partnerGrid.scrollWidth) {
                    partnerGrid.scrollLeft += 1;
                } else {
                    partnerGrid.scrollLeft = 0;
                }
            }
        }, 30);
        partnerGrid.addEventListener('scroll', () => {
            lastUserScroll = Date.now();
        });
    }
    // --- End auto-scroll logic ---

    if (partnerGrid && scrollLeftBtn && scrollRightBtn) {
        // Left scroll button
        scrollLeftBtn.addEventListener('click', () => {
            partnerGrid.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        // Right scroll button
        scrollRightBtn.addEventListener('click', () => {
            partnerGrid.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Show/hide buttons based on scroll position
        partnerGrid.addEventListener('scroll', () => {
            const isAtStart = partnerGrid.scrollLeft === 0;
            const isAtEnd = partnerGrid.scrollLeft + partnerGrid.offsetWidth >= partnerGrid.scrollWidth;

            scrollLeftBtn.style.opacity = isAtStart ? '0.5' : '1';
            scrollRightBtn.style.opacity = isAtEnd ? '0.5' : '1';
            
            scrollLeftBtn.style.pointerEvents = isAtStart ? 'none' : 'all';
            scrollRightBtn.style.pointerEvents = isAtEnd ? 'none' : 'all';
        });

        // Initial button state
        scrollLeftBtn.style.opacity = '0.5';
        scrollLeftBtn.style.pointerEvents = 'none';
    }
}
