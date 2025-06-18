// Form Validation and Submission Handler
document.addEventListener('DOMContentLoaded', () => {
    // Form validation functions
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone) => {
        const re = /^[\d\s\+\-\(\)]{10,}$/;
        return re.test(phone);
    };

    const validateName = (name) => {
        return name.length >= 2 && /^[a-zA-Z\s\-\'\.]+$/.test(name);
    };

    const validateAge = (age) => {
        return age >= 18 && age <= 65;
    };

    // Form feedback UI functions
    const showFormError = (input, message) => {
        const errorDiv = input.parentElement.querySelector('.form-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        } else {
            const div = document.createElement('div');
            div.className = 'form-error';
            div.textContent = message;
            input.parentElement.appendChild(div);
        }
        input.classList.add('error');
    };

    const clearFormError = (input) => {
        const errorDiv = input.parentElement.querySelector('.form-error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        input.classList.remove('error');
    };

    const showLoadingState = (form) => {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            submitBtn.dataset.originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }
    };

    const hideLoadingState = (form) => {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = submitBtn.dataset.originalText;
        }
    };

    const showSuccessMessage = (form, message) => {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.textContent = message;
        form.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 5000);
        form.reset();
    };

    // Contact Form Handler
    const handleContactForm = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        try {
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            if (!validateName(name)) {
                showFormError(form.querySelector('[name="name"]'), 'Please enter a valid name');
                return;
            }
            if (!validateEmail(email)) {
                showFormError(form.querySelector('[name="email"]'), 'Please enter a valid email');
                return;
            }
            if (!subject || subject.length < 2) {
                showFormError(form.querySelector('[name="subject"]'), 'Subject is required');
                return;
            }
            if (!message || message.length < 10) {
                showFormError(form.querySelector('[name="message"]'), 'Please enter a detailed message');
                return;
            }

            showLoadingState(form);
            console.log('Sending contact form data:', { name, email, subject, message });

            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name, email, subject, message })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Contact form submitted successfully:', data);
                showSuccessMessage(form, 'Thank you for your message! We will get back to you soon.');
            } else {
                throw new Error(data.error || 'Failed to submit form');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showFormError(form.querySelector('[name="email"]'), 'Failed to send message. Please try again or contact support.');
        } finally {
            hideLoadingState(form);
        }
    };

    // Delivery Partner Form Handler
    const handleDeliveryPartnerForm = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        try {
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const age = parseInt(formData.get('age'));
            const vehicle = formData.get('vehicle');
            const license = formData.get('license');
            const experience = formData.get('experience');
            const city = formData.get('city');

            if (!validateName(name)) {
                showFormError(form.querySelector('[name="name"]'), 'Please enter a valid name');
                return;
            }
            if (!validateEmail(email)) {
                showFormError(form.querySelector('[name="email"]'), 'Please enter a valid email');
                return;
            }
            if (!validatePhone(phone)) {
                showFormError(form.querySelector('[name="phone"]'), 'Please enter a valid phone number');
                return;
            }
            if (!validateAge(age)) {
                showFormError(form.querySelector('[name="age"]'), 'Age must be between 18 and 65');
                return;
            }

            showLoadingState(form);
            console.log('Sending delivery partner form data:', {
                name, email, phone, age, vehicle, license, experience, city
            });

            const response = await fetch('http://localhost:5000/api/delivery-partner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone: phone.replace(/\D/g, ''),
                    age,
                    vehicle,
                    license,
                    experience: experience || '',
                    city
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Delivery partner form submitted successfully:', data);
                showSuccessMessage(form, 'Thank you for applying! We will review your application and contact you soon.');
            } else {
                throw new Error(data.error || 'Failed to submit form');
            }
        } catch (error) {
            console.error('Delivery partner form error:', error);
            showFormError(form.querySelector('[name="email"]'), 'Failed to submit application. Please try again or contact support.');
        } finally {
            hideLoadingState(form);
        }
    };

    // Restaurant Partner Form Handler
    const handleRestaurantPartnerForm = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        try {
            const contact_name = formData.get('contact_name');
            const email = formData.get('email');
            const phone_number = formData.get('phone_number');
            const restaurant_name = formData.get('restaurant_name');
            const type = formData.get('type');
            const additional_info = formData.get('additional_info');

            if (!validateName(contact_name)) {
                showFormError(form.querySelector('[name="contact_name"]'), 'Please enter a valid name');
                return;
            }
            if (!validateEmail(email)) {
                showFormError(form.querySelector('[name="email"]'), 'Please enter a valid email');
                return;
            }
            if (!validatePhone(phone_number)) {
                showFormError(form.querySelector('[name="phone_number"]'), 'Please enter a valid phone number');
                return;
            }
            if (!restaurant_name || restaurant_name.length < 2) {
                showFormError(form.querySelector('[name="restaurant_name"]'), 'Restaurant name is required');
                return;
            }

            showLoadingState(form);
            console.log('Sending restaurant partner form data:', {
                contact_name, email, phone_number, restaurant_name, type, additional_info
            });

            const response = await fetch('http://localhost:5000/api/restaurant-partner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    contact_name,
                    email,
                    phone_number: phone_number.replace(/\D/g, ''),
                    restaurant_name,
                    type,
                    additional_info: additional_info || ''
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Restaurant partner form submitted successfully:', data);
                showSuccessMessage(form, 'Thank you for your interest! Our team will review your application and contact you soon.');
            } else {
                throw new Error(data.error || 'Failed to submit form');
            }
        } catch (error) {
            console.error('Restaurant partner form error:', error);
            showFormError(form.querySelector('[name="email"]'), 'Failed to submit application. Please try again or contact support.');
        } finally {
            hideLoadingState(form);
        }
    };

    // Attach event listeners to forms
    const forms = {
        '#contact-form': handleContactForm,
        '#delivery-partner-form': handleDeliveryPartnerForm,
        '#restaurant-partner-form': handleRestaurantPartnerForm
    };

    Object.entries(forms).forEach(([selector, handler]) => {
        const form = document.querySelector(selector);
        if (form) {
            form.addEventListener('submit', handler);
        }
    });

    // Real-time validation on input fields
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            clearFormError(input);
        });
    });
});
