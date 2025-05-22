// Animations JavaScript file

// Parallax effect for images
document.addEventListener('DOMContentLoaded', function() {
    initializeParallax();
    initializeMicrointeractions();
});

function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', function() {
        parallaxElements.forEach(element => {
            const distance = window.pageYOffset;
            element.style.transform = `translateY(${distance * 0.5}px)`;
        });
    });
}

// Micro-interactions
function initializeMicrointeractions() {
    // Feature cards hover effect
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('i').style.transform = 'scale(1.2) rotate(10deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('i').style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Partner cards hover effect
    const partnerCards = document.querySelectorAll('.partner-card');
    partnerCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Scroll reveal animations
document.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('visible');
        }
    });
});

// Utility function to check if element is in viewport
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Loading animations
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Animate nav items sequentially
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach((link, index) => {
        setTimeout(() => {
            link.style.opacity = '1';
        }, 100 * index);
    });
});

// Smooth transitions for theme toggle
function handleThemeTransition() {
    document.body.classList.add('theme-transition');
    window.setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 1000);
}

// Add event listener to theme toggle button
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', handleThemeTransition);
}
