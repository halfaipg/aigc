// AI General Concepts LTD - Main JavaScript

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

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
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
            
            if (isValid) {
                const formData = new FormData(contactForm);
                
                // Clear any previous status
                formStatus.className = 'form-status';
                formStatus.textContent = 'Sending your message...';
                formStatus.style.display = 'block';
                
                fetch(contactForm.action, {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (response.ok) {
                        formStatus.className = 'form-status success';
                        formStatus.textContent = 'Thank you! Your message has been sent.';
                        contactForm.reset();
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                })
                .catch(error => {
                    formStatus.className = 'form-status error';
                    formStatus.textContent = 'There was a problem sending your message. Please try again later.';
                    console.error('Error:', error);
                });
            } else {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please fill in all required fields correctly.';
                formStatus.style.display = 'block';
            }
        });
    }
}); 