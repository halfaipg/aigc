// AI General Concepts LTD - Main JavaScript

// Function to open email client
function openMailClient(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const company = document.getElementById('company').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Encode values for mailto link
    const subject = encodeURIComponent(`Contact from ${name} at ${company}`);
    const body = encodeURIComponent(`Message:\n${message}\n\nReply to: ${email}`);
    
    // Generate mailto link
    const mailtoLink = `mailto:contact@generalconcepts.ai?subject=${subject}&body=${body}`;
    
    // Update form status
    const formStatus = document.getElementById('formStatus');
    formStatus.className = 'form-status';
    formStatus.textContent = 'Opening your email client...';
    formStatus.style.display = 'block';
    
    // Open mailto link
    window.location.href = mailtoLink;
    
    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'var(--white)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // Contact form submission to Power Automate
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validation
            let isValid = true;
            const formElements = this.elements;
            
            for (let i = 0; i < formElements.length; i++) {
                if (formElements[i].hasAttribute('required') && !formElements[i].value.trim()) {
                    isValid = false;
                    formElements[i].style.borderColor = 'red';
                } else if (formElements[i].type === 'email' && formElements[i].value.trim()) {
                    // Simple email validation
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(formElements[i].value.trim())) {
                        isValid = false;
                        formElements[i].style.borderColor = 'red';
                    } else {
                        formElements[i].style.borderColor = 'var(--border-color)';
                    }
                } else {
                    formElements[i].style.borderColor = 'var(--border-color)';
                }
            }
            
            if (!isValid) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please fill in all required fields correctly.';
                formStatus.style.display = 'block';
                return;
            }
            
            // Prepare form data
            const formData = {
                name: document.getElementById('name').value,
                company: document.getElementById('company').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Show sending message
            formStatus.className = 'form-status';
            formStatus.textContent = 'Sending your message...';
            formStatus.style.display = 'block';
            
            // Send to Power Automate
            fetch(contactForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                // Power Automate might not return JSON
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json().then(data => {
                        return { success: true, message: data.message || 'Thank you! Your message has been sent.' };
                    });
                } else {
                    return { success: true, message: 'Thank you! Your message has been sent.' };
                }
            })
            .then(data => {
                formStatus.className = 'form-status success';
                formStatus.textContent = data.message;
                contactForm.reset();
            })
            .catch(error => {
                // Fallback to mailto if Power Automate fails
                formStatus.className = 'form-status error';
                formStatus.textContent = 'There was a problem with the form submission. Opening email client instead...';
                console.error('Error:', error);
                
                // Delay to let user see the message before opening mailto
                setTimeout(() => {
                    // Get form values for mailto fallback
                    const name = document.getElementById('name').value;
                    const company = document.getElementById('company').value;
                    const email = document.getElementById('email').value;
                    const message = document.getElementById('message').value;
                    
                    // Encode values for mailto link
                    const subject = encodeURIComponent(`Contact from ${name} at ${company}`);
                    const body = encodeURIComponent(`Message:\n${message}\n\nReply to: ${email}`);
                    
                    // Generate mailto link
                    const mailtoLink = `mailto:contact@generalconcepts.ai?subject=${subject}&body=${body}`;
                    
                    // Open mailto link
                    window.location.href = mailtoLink;
                }, 2000);
            });
        });
    }
}); 