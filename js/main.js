// Main JavaScript file for BHUKK website

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize AI chat assistant
    initializeAIAssistant();
    
    // Initialize navbar transparency
    initializeNavbar();
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
    const elements = document.querySelectorAll('.feature-card, .app-feature, .benefit, .partner-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// AI Chat Assistant
function initializeAIAssistant() {
    const aiToggle = document.querySelector('.ai-toggle');
    let chatOpen = false;
    
    aiToggle.addEventListener('click', function() {
        if (!chatOpen) {
            // Create chat interface
            const chatInterface = document.createElement('div');
            chatInterface.className = 'chat-interface';
            chatInterface.innerHTML = `
                <div class="chat-header">
                    <h3>BHUKK Assistant</h3>
                    <button class="close-chat">&times;</button>
                </div>
                <div class="chat-body">
                    <div class="chat-sidebar">
                        <h4>Topics</h4>
                        <ul class="faq-categories">
                            ${window.bhukkAssistant.getCategories().map(category => 
                                `<li class="faq-category" data-category="${category}">
                                    ${category.charAt(0).toUpperCase() + category.slice(1)}
                                </li>`
                            ).join('')}
                        </ul>
                    </div>
                    <div class="chat-main">
                        <div class="chat-messages"></div>
                        <div class="chat-input">
                            <input type="text" placeholder="Ask me anything...">
                            <button><i class="fas fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>
            `;
            
            document.querySelector('.ai-assistant').appendChild(chatInterface);
            chatOpen = true;

            // Add welcome message
            addMessage("Hi! I'm your BHUKK Assistant. I can help you with questions about ordering, liquor delivery, payments, and your account. What would you like to know about?", false);

            // Add event listeners
            const chatInput = chatInterface.querySelector('.chat-input input');
            const sendButton = chatInterface.querySelector('.chat-input button');
            const categories = chatInterface.querySelectorAll('.faq-category');            // Handle message sending
            function sendMessage() {
                const message = chatInput.value.trim();
                if (message) {
                    addMessage(message, true);
                    const response = window.bhukkAssistant.processMessage(message);
                    handleAssistantResponse(response);
                    chatInput.value = '';
                    chatInput.focus();
                }
            }

            // Send button click
            sendButton.addEventListener('click', sendMessage);

            // Enter key press
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });            // Category selection
            categories.forEach(category => {
                category.addEventListener('click', function() {
                    const categoryName = this.dataset.category;
                    const faqs = window.bhukkAssistant.getFAQsByCategory(categoryName);
                    
                    // Clear previous selection
                    categories.forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    
                    handleAssistantResponse({
                        type: 'category',
                        message: `Here are some common questions about ${categoryName}:`,
                        faqs: faqs
                    });
                });
            });

            // Close button
            chatInterface.querySelector('.close-chat').addEventListener('click', function() {
                chatInterface.remove();
                chatOpen = false;
            });

            // Focus input
            chatInput.focus();
        }
    });
}

// Add message to chat
function addMessage(message, isUser) {
    const messagesContainer = document.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${isUser ? 'user' : 'assistant'}`;
    
    if (typeof message === 'object' && message.nodeType === 1) {
        messageElement.appendChild(message);
    } else {
        messageElement.textContent = message;
    }
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add to history
    window.bhukkAssistant.addToHistory(message, isUser);
}

// Handle assistant responses
function handleAssistantResponse(response) {    switch (response.type) {
        case 'category':
            addMessage(response.message, false);
            const faqList = document.createElement('ul');
            faqList.className = 'faq-list';
            response.faqs.forEach(faq => {
                const li = document.createElement('li');
                li.className = 'faq-item';
                li.textContent = faq.question;
                li.addEventListener('click', () => {
                    addMessage(faq.question, true);
                    handleAssistantResponse({type: 'answer', message: faq.answer});
                });
                faqList.appendChild(li);
            });
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message assistant';
            messageDiv.appendChild(faqList);
            document.querySelector('.chat-messages').appendChild(messageDiv);
            break;
            
        case 'answer':
            addMessage(response.message, false);
            break;
            
        case 'help':
            addMessage(response.message, false);
            const categoryList = `<ul class="faq-list">
                ${response.categories.map(category => 
                    `<li class="faq-item" onclick="addMessage('Tell me about ${category}', true)">
                        ${category.charAt(0).toUpperCase() + category.slice(1)}
                    </li>`
                ).join('')}
            </ul>`;
            addMessage(categoryList, false);
            break;
    }
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
