// AI General Concepts LTD - Main JavaScript

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mobile navigation toggle
    var header = document.querySelector('.header');
    var navToggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('siteNav');

    if (navToggle && header && nav) {
        navToggle.addEventListener('click', function () {
            var isOpen = header.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                header.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Scroll reveal (IntersectionObserver; degrades to visible)
    var revealEls = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

        var revealInView = function () {
            revealEls.forEach(function (el) {
                if (el.classList.contains('is-visible')) { return; }
                var rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add('is-visible');
                    revealObserver.unobserve(el);
                }
            });
        };

        revealEls.forEach(function (el) { revealObserver.observe(el); });

        // Anchor deep-links scroll the page outside the observer's notice
        // (the browser jumps to the fragment after load), so re-check
        // whenever a jump can have happened.
        revealInView();
        window.addEventListener('load', revealInView);
        window.addEventListener('hashchange', revealInView);
        window.addEventListener('scroll', revealInView, { passive: true });
    }

    // Scrollspy: highlight the nav link for the section in view
    var navLinks = document.querySelectorAll('.nav a[href^="#"]:not(.btn)');
    if ('IntersectionObserver' in window && navLinks.length) {
        var linkById = {};
        navLinks.forEach(function (link) {
            linkById[link.getAttribute('href').slice(1)] = link;
        });
        var spyObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var link = linkById[entry.target.id];
                if (!link) { return; }
                if (entry.isIntersecting) {
                    navLinks.forEach(function (l) { l.classList.remove('active'); });
                    link.classList.add('active');
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        Object.keys(linkById).forEach(function (id) {
            var section = document.getElementById(id);
            if (section) { spyObserver.observe(section); }
        });
    }

    // Contact form: POSTs JSON to the contact relay worker
    var contactForm = document.getElementById('contactForm');
    var formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Inline validation
            var isValid = true;
            var fields = contactForm.querySelectorAll('input[required], textarea[required]');
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            fields.forEach(function (field) {
                var value = field.value.trim();
                var fieldValid = value.length > 0;
                if (fieldValid && field.type === 'email') {
                    fieldValid = emailPattern.test(value);
                }
                field.classList.toggle('invalid', !fieldValid);
                if (!fieldValid) { isValid = false; }
            });

            if (!isValid) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please fill in all required fields correctly.';
                formStatus.style.display = 'block';
                return;
            }

            var formData = {
                site: 'generalconcepts.ai',
                name: document.getElementById('name').value,
                company: document.getElementById('company').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                website: contactForm.querySelector('input[name="website"]') ? contactForm.querySelector('input[name="website"]').value : ''
            };

            var submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) { submitBtn.disabled = true; }

            formStatus.className = 'form-status sending';
            formStatus.textContent = 'Sending your message...';
            formStatus.style.display = 'block';

            fetch(contactForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                var contentType = response.headers.get('content-type');
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    return response.json().then(function (data) {
                        return { message: data.message || 'Thank you. Your message has been sent.' };
                    });
                }
                return { message: 'Thank you. Your message has been sent.' };
            })
            .then(function (data) {
                formStatus.className = 'form-status success';
                formStatus.textContent = data.message;
                contactForm.reset();
            })
            .catch(function (error) {
                formStatus.className = 'form-status error';
                formStatus.textContent = "We couldn't send your message. Please try again, or email contact@generalconcepts.ai directly.";
                console.error('Error:', error);
            })
            .finally(function () {
                if (submitBtn) { submitBtn.disabled = false; }
            });
        });
    }
});
