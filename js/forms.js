// Form Validation and Submission Handler
document.addEventListener('DOMContentLoaded', function() {
    // Form validation functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^[\d\s\+\-\(\)]{10,}$/;
        return re.test(phone);
    }

    function validateName(name) {
        return name.length >= 2 && /^[a-zA-Z\s\-\'\.]+$/.test(name);
    }

    function validateFileSize(file, maxSizeMB = 5) {
        return file.size <= maxSizeMB * 1024 * 1024;
    }

    function validateFileType(file, allowedTypes = ['application/pdf']) {
        return allowedTypes.includes(file.type);
    }

    // Form feedback UI
    function showFormError(input, message) {
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
    }

    function clearFormError(input) {
        const errorDiv = input.parentElement.querySelector('.form-error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        input.classList.remove('error');
    }

    function showLoadingState(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            const originalText = submitBtn.textContent;
            submitBtn.dataset.originalText = originalText;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }
    }

    function hideLoadingState(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = submitBtn.dataset.originalText;
        }
    }

    function showSuccessMessage(form, message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.textContent = message;
        form.appendChild(successDiv);
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }    
    // Contact form handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            let hasError = false;

            // Get form fields
            const nameInput = this.querySelector('#name');
            const emailInput = this.querySelector('#email');
            const subjectInput = this.querySelector('#subject');
            const messageInput = this.querySelector('#message');

            // Clear previous errors
            [nameInput, emailInput, subjectInput, messageInput].forEach(input => clearFormError(input));

            // Validate name
            if (!validateName(nameInput.value)) {
                showFormError(nameInput, 'Please enter a valid name');
                hasError = true;
            }

            // Validate email
            if (!validateEmail(emailInput.value)) {
                showFormError(emailInput, 'Please enter a valid email address');
                hasError = true;
            }

            // Validate subject
            if (!subjectInput.value.trim()) {
                showFormError(subjectInput, 'Please enter a subject');
                hasError = true;
            }

            // Validate message
            if (!messageInput.value.trim()) {
                showFormError(messageInput, 'Please enter your message');
                hasError = true;
            }            if (!hasError) {
                showLoadingState(this);

                try {
                    console.log('Sending contact form data...');
                    // Send data to backend
                    const response = await fetch('http://127.0.0.1:5000/api/contact/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            name: nameInput.value,
                            email: emailInput.value,
                            subject: subjectInput.value,
                            message: messageInput.value
                        })
                    });
                    
                    console.log('Response status:', response.status);

                    const data = await response.json();                    if (response.ok) {
                        showSuccessMessage(this, `Thank you for contacting us! We'll respond to ${emailInput.value} shortly.`);
                        this.reset();
                    } else {
                        throw new Error(data.message || 'Failed to send message');
                    }
                } catch (error) {
                    showFormError(nameInput, error.message || 'Failed to send message. Please try again.');
                } finally {
                    hideLoadingState(this);
                }
            }
        });
    }

    // Career form handler
    const careerForm = document.querySelector('.career-form');
    if (careerForm) {
        careerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            let hasError = false;

            // Get form fields
            const nameInput = this.querySelector('#career-name');
            const emailInput = this.querySelector('#career-email');
            const resumeInput = this.querySelector('#resume');

            // Clear previous errors
            [nameInput, emailInput, resumeInput].forEach(input => clearFormError(input));

            // Validate name
            if (!validateName(nameInput.value)) {
                showFormError(nameInput, 'Please enter a valid name');
                hasError = true;
            }

            // Validate email
            if (!validateEmail(emailInput.value)) {
                showFormError(emailInput, 'Please enter a valid email address');
                hasError = true;
            }

            // Validate resume file
            if (resumeInput.files.length > 0) {
                const file = resumeInput.files[0];
                if (!validateFileType(file)) {
                    showFormError(resumeInput, 'Please upload a PDF file');
                    hasError = true;
                }
                if (!validateFileSize(file)) {
                    showFormError(resumeInput, 'File size should be less than 5MB');
                    hasError = true;
                }
            } else {
                showFormError(resumeInput, 'Please upload your resume');
                hasError = true;
            }

            if (!hasError) {
                showLoadingState(this);

                try {
                    // Here you would typically send data to your backend
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
                    
                    showSuccessMessage(this, 'Thank you for your application! We will review it and get back to you soon.');
                    this.reset();
                } catch (error) {
                    showFormError(resumeInput, 'Failed to submit application. Please try again.');
                } finally {
                    hideLoadingState(this);
                }
            }
        });
    }

    // Newsletter form handler
    //const newsletterForm = document.querySelector('.newsletter-form');
    //if (newsletterForm) {
    //    newsletterForm.addEventListener('submit', async function(e) {
    //        e.preventDefault();
    //        let hasError = false;
//
    //        // Get form fields
    //        const emailInput = this.querySelector('input[type="email"]');
//
    //        // Clear previous errors
    //        clearFormError(emailInput);
//
    //        // Validate email
    //        if (!validateEmail(emailInput.value)) {
    //            showFormError(emailInput, 'Please enter a valid email address');
    //            hasError = true;
    //        }
//
    //        if (!hasError) {
    //            showLoadingState(this);
//
    //            try {
    //                // Here you would typically send data to your backend
    //                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
    //                
    //                showSuccessMessage(this, 'Thank you for subscribing to our newsletter!');
    //                this.reset();
    //            } catch (error) {
    //                showFormError(emailInput, 'Failed to subscribe. Please try again.');
    //            } finally {
    //                hideLoadingState(this);
    //            }
    //        }
    //    });
    //}

    // Partner registration form handler
    const partnerForm = document.querySelector('.contact-form');
    if (partnerForm) {
        partnerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            let hasError = false;

            // Get form fields
            const restaurantNameInput = this.querySelector('#restaurant-name');
            const contactNameInput = this.querySelector('#contact-name');
            const emailInput = this.querySelector('#email');
            const phoneInput = this.querySelector('#phone');
            const restaurantTypeInput = this.querySelector('#restaurant-type');
            const messageInput = this.querySelector('#message');

            // Clear previous errors
            [restaurantNameInput, contactNameInput, emailInput, phoneInput, restaurantTypeInput, messageInput]
                .forEach(input => clearFormError(input));

            // Validate restaurant name
            if (!validateName(restaurantNameInput.value)) {
                showFormError(restaurantNameInput, 'Please enter a valid restaurant name');
                hasError = true;
            }

            // Validate contact name
            if (!validateName(contactNameInput.value)) {
                showFormError(contactNameInput, 'Please enter a valid contact name');
                hasError = true;
            }

            // Validate email
            if (!validateEmail(emailInput.value)) {
                showFormError(emailInput, 'Please enter a valid email address');
                hasError = true;
            }

            // Validate phone
            if (!validatePhone(phoneInput.value)) {
                showFormError(phoneInput, 'Please enter a valid phone number');
                hasError = true;
            }

            // Validate restaurant type
            if (!restaurantTypeInput.value) {
                showFormError(restaurantTypeInput, 'Please select a restaurant type');
                hasError = true;
            }

            if (!hasError) {
                showLoadingState(this);

                try {                    
                    // Send data to backend
                    const response = await fetch('http://127.0.0.1:5000/api/partner/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            restaurant_name: restaurantNameInput.value,
                            contact_name: contactNameInput.value,
                            email: emailInput.value,
                            phone: phoneInput.value,
                            restaurant_type: restaurantTypeInput.value,
                            additional_info: messageInput.value
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        showSuccessMessage(this, 'Thank you for registering! We will get in touch with you shortly.');
                        this.reset();
                    } else {
                        throw new Error(data.message || 'Failed to submit registration');
                    }
                } catch (error) {
                    showFormError(restaurantNameInput, error.message || 'Failed to submit registration. Please try again.');
                } finally {
                    hideLoadingState(this);
                }
            }
        });
    }

    // Real-time validation on input fields
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function() {
            clearFormError(this);
        });
    });
});
