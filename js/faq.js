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

class BhukkAssistant {
    constructor() {
        this.currentCategory = null;
        this.chatHistory = [];
    }

    // Get FAQ categories
    getCategories() {
        return Object.keys(faqs);
    }

    // Get FAQs for a specific category
    getFAQsByCategory(category) {
        return faqs[category] || [];
    }

    // Process user message
    processMessage(message) {
        message = message.toLowerCase();
        
        // Check for category matches
        for (const category of this.getCategories()) {
            if (message.includes(category)) {
                this.currentCategory = category;
                return {
                    type: 'category',
                    message: `Here are some common questions about ${category}:`,
                    faqs: this.getFAQsByCategory(category)
                };
            }
        }

        // Check for direct question matches
        for (const category of this.getCategories()) {
            const categoryFaqs = this.getFAQsByCategory(category);
            for (const faq of categoryFaqs) {
                if (message.includes(faq.question.toLowerCase())) {
                    return {
                        type: 'answer',
                        message: faq.answer
                    };
                }
            }
        }

        // Default response
        return {
            type: 'help',
            message: "I can help you with questions about ordering, liquor delivery, payments, and your account. What would you like to know about?",
            categories: this.getCategories()
        };
    }

    // Add message to chat history
    addToHistory(message, isUser = false) {
        this.chatHistory.push({
            message,
            isUser,
            timestamp: new Date()
        });
    }

    // Get chat history
    getHistory() {
        return this.chatHistory;
    }
}

// Initialize BHUKK Assistant
const bhukkAssistant = new BhukkAssistant();

// Export for use in main.js
window.bhukkAssistant = bhukkAssistant;
