// Main JavaScript file for BHUKK website

// Wait for DOM to load
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Initialize mobile menu first
    initializeMobileMenu();
    
    // Initialize other features
    initializeTheme();
    initializeScrollAnimations();
    initializeAIAssistant();
    initializeNavbar();
    initializeGlassEffects();
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

// Mobile Menu Toggle
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksAnchors = document.querySelectorAll('.nav-links a');
    const icon = mobileMenuBtn.querySelector('i');
    let isMenuOpen = false;
    let isTransitioning = false;

    function toggleMenu(force = null) {
        if (isTransitioning) return;
        
        isTransitioning = true;
        isMenuOpen = force !== null ? force : !isMenuOpen;
        
        if (isMenuOpen) {
            navLinks.classList.add('active');
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.style.overflow = 'hidden';
        } else {
            navLinks.classList.remove('active');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }

        // Reset transitioning state after animation completes
        setTimeout(() => {
            isTransitioning = false;
        }, 400); // Match this with your CSS transition duration
    }
    
    // Menu button click
    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close menu when clicking nav links
    navLinksAnchors.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            toggleMenu(false);
            
            // Navigate after menu closes
            setTimeout(() => {
                if (href.startsWith('#')) {
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    window.location.href = href;
                }
            }, 400);
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && 
            !navLinks.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            toggleMenu(false);
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && isMenuOpen) {
                toggleMenu(false);
            }
        }, 100);
    });

    // Prevent clicks inside menu from closing it
    navLinks.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu(false);
        }
    });
}
