// Components initialization
document.addEventListener('DOMContentLoaded', function() {
    // Load navbar
    loadNavbar().then(() => {
        // Initialize coming soon alerts after navbar is loaded
        if (typeof initializeComingSoonAlerts === 'function') {
            initializeComingSoonAlerts();
        }
    });

    // Load footer
    loadFooter();
});

// Load navbar
function loadNavbar() {
    return fetch('../elements/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
        })
        .catch(error => console.error('Error loading navbar:', error));
}

// Load footer
function loadFooter() {
    return fetch('../elements/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}