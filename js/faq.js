// FAQ System for BHUKK Assistant
const faqs = {
    ordering: [
        {
            question: "How do I place an order?",
            answer: "You can place an order through our app or website. Simply select your items, add them to cart, and follow the checkout process. We'll handle the rest!"
        },
        {
            question: "What is the minimum order value?",
            answer: "Our minimum order value varies by location. You can check the exact amount during checkout for your area."
        },
        {
            question: "How do I track my order?",
            answer: "Once your order is confirmed, you can track it in real-time through our app or website. You'll receive live updates on your order status."
        }
    ],
    liquor: [
        {
            question: "Is liquor delivery available 24/7?",
            answer: "Yes, we offer 24/7 liquor delivery service. However, deliveries are subject to local regulations and age verification."
        },
        {
            question: "What documents are required for liquor delivery?",
            answer: "You need to provide a valid government ID proving you're above the legal drinking age. This will be verified at delivery."
        },
        {
            question: "Can I schedule a liquor delivery?",
            answer: "Yes, you can schedule liquor deliveries in advance through our app or website."
        }
    ],
    payment: [
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit/debit cards, UPI, digital wallets, and cash on delivery."
        },
        {
            question: "Is online payment safe?",
            answer: "Yes, all our online payments are secured with industry-standard encryption."
        },
        {
            question: "How do I apply a coupon code?",
            answer: "You can enter your coupon code during checkout in the 'Apply Coupon' field."
        }
    ],
    account: [
        {
            question: "How do I create an account?",
            answer: "You can create an account by downloading our app or visiting our website and clicking on 'Sign Up'."
        },
        {
            question: "How do I earn BHUKK Rewards?",
            answer: "You automatically earn BHUKK Rewards points on every order. Points vary based on order value and member status."
        },
        {
            question: "How do I reset my password?",
            answer: "Click on 'Forgot Password' on the login screen and follow the instructions sent to your registered email."
        }
    ]
};

// Initialize chat functionality
document.addEventListener('DOMContentLoaded', () => {
    const assistant = document.querySelector('.bhukk-assistant');
    const toggleBtn = assistant.querySelector('.assistant-toggle');
    const chatContainer = assistant.querySelector('.chat-container');
    const closeBtn = assistant.querySelector('.chat-close');
    const chatInput = assistant.querySelector('.chat-input');
    const sendBtn = assistant.querySelector('.chat-send');
    const messagesContainer = assistant.querySelector('.chat-messages');
    const categoriesList = assistant.querySelector('.faq-categories');

    // Initialize categories
    function initializeCategories() {
        Object.keys(faqs).forEach(category => {
            const li = document.createElement('li');
            li.className = 'faq-category';
            li.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            li.dataset.category = category;
            categoriesList.appendChild(li);
        });
    }

    // Add message to chat
    function addMessage(text, isUser = false) {
        const message = document.createElement('div');
        message.className = `message ${isUser ? 'user' : 'assistant'}`;
        message.textContent = text;
        messagesContainer.appendChild(message);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Process user message
    function processMessage(text) {
        const lowerText = text.toLowerCase();
        
        // Check categories
        for (const category of Object.keys(faqs)) {
            if (lowerText.includes(category.toLowerCase())) {
                const categoryFaqs = faqs[category];
                addMessage(`Here are some common questions about ${category}:`, false);
                categoryFaqs.forEach(faq => {
                    addMessage(`• ${faq.question}`, false);
                });
                return;
            }
        }

        // Check for specific questions
        for (const category of Object.keys(faqs)) {
            const foundFaq = faqs[category].find(faq => 
                lowerText.includes(faq.question.toLowerCase()) ||
                lowerText.split(' ').filter(word => 
                    faq.question.toLowerCase().includes(word)
                ).length >= 3
            );
            
            if (foundFaq) {
                addMessage(foundFaq.answer, false);
                return;
            }
        }

        // Default response
        addMessage("I can help you with questions about ordering, liquor delivery, payments, and your account. Please choose a topic or ask a specific question!", false);
    }

    // Toggle chat
    toggleBtn.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
        if (chatContainer.classList.contains('active')) {
            chatInput.focus();
            if (!messagesContainer.hasChildNodes()) {
                addMessage("Hi! I'm your BHUKK Assistant. How can I help you today?", false);
            }
        }
    });

    // Close chat
    closeBtn.addEventListener('click', () => {
        chatContainer.classList.remove('active');
    });

    // Send message on button click
    sendBtn.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            processMessage(message);
            chatInput.value = '';
            chatInput.focus();
        }
    });

    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = chatInput.value.trim();
            if (message) {
                addMessage(message, true);
                processMessage(message);
                chatInput.value = '';
            }
        }
    });

    // Handle category clicks
    categoriesList.addEventListener('click', (e) => {
        const category = e.target.closest('.faq-category');
        if (category) {
            document.querySelectorAll('.faq-category').forEach(cat => 
                cat.classList.remove('active')
            );
            category.classList.add('active');
            const categoryName = category.dataset.category;
            processMessage(categoryName);
        }
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
        if (chatContainer.classList.contains('active') &&
            !assistant.contains(e.target)) {
            chatContainer.classList.remove('active');
        }
    });

    // Initialize categories
    initializeCategories();
});

