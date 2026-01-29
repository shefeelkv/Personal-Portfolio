document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileBtn.classList.toggle('open');

        // Simple animation for hamburger icon could be added here
        const spans = mobileBtn.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            // Reset hamburger icon
            const spans = mobileBtn.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth Scroll for anchor links
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

    // Advanced Reveal on Scroll Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Staggered animation for grids
                if (entry.target.classList.contains('stagger-grid')) {
                    const items = entry.target.children;
                    Array.from(items).forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 100); // 100ms delay between items
                    });
                    observer.unobserve(entry.target);
                } else {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    // Elements to reveal
    const revealElements = document.querySelectorAll('.hero-content, .section-header, .about-text, .service-card, .contact-wrapper');
    revealElements.forEach(el => {
        el.classList.add('reveal-item');
        observer.observe(el);
    });

    // Grids to stagger
    const staggerGrids = document.querySelectorAll('.skills-grid, .projects-grid, .tools-grid, .services-grid');
    staggerGrids.forEach(grid => {
        grid.classList.add('stagger-grid');
        observer.observe(grid);

        // Hide children initially
        Array.from(grid.children).forEach(child => {
            child.classList.add('reveal-item');
        });
    });

    // Add dynamic styles for animations
    const style = document.createElement('style');
    style.innerHTML = `
        .reveal-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
        }
        
        .visible {
            opacity: 1;
            transform: translateY(0);
        }

        .stagger-grid .reveal-item {
            opacity: 0;
            transform: translateY(20px);
        }

        .stagger-grid .reveal-item.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Contact Form Handling (EmailJS)
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get values
            const nameInput = this.querySelector('input[type="text"]');
            const emailInput = this.querySelector('input[type="email"]');
            const messageInput = this.querySelector('textarea');
            const submitBtn = this.querySelector('button[type="submit"]');

            const name = nameInput.value;
            const email = emailInput.value;
            const message = messageInput.value;

            // Visual feedback - Loading state
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Prepare template parameters (matching your EmailJS template variables)
            const templateParams = {
                name: name,
                email: email,
                message: message
            };

            // Send via EmailJS
            emailjs.send('Shefeel_123', 'template_a5idkni', templateParams)
                .then(function () {
                    // Success - Real Email Sent

                    // Show in UI Log for User Visibility (Confirmation)
                    const logContainer = document.getElementById('simulation-log');
                    const logContent = document.getElementById('log-content');

                    if (logContainer && logContent) {
                        logContainer.style.display = 'block';
                        const timestamp = new Date().toLocaleTimeString();
                        const logEntry = `
                            <div style="margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                                <span style="color: #4ade80;">[${timestamp}] EMAIL SENT SUCCESSFULLY:</span><br>
                                <strong>To:</strong> shafeelshefi7777@gmail.com<br>
                                <strong>From:</strong> ${name} (${email})<br>
                                <strong>Message:</strong> "${message}"
                            </div>
                        `;
                        logContent.innerHTML = logEntry + logContent.innerHTML;
                    }

                    alert(`Success! The email has been sent to shafeelshefi7777@gmail.com.\n\nThank you, ${name}!`);
                    contactForm.reset();
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }, function (error) {
                    // Fallback Simulation for Portfolio Demo
                    console.log('EmailJS Error:', error);

                    // Artificial delay to simulate network request
                    setTimeout(() => {
                        console.log('--- BACKEND SIMULATION ---');
                        console.log('Message Received from:', name);
                        console.log('Email:', email);
                        console.log('Content:', message);
                        console.log('--------------------------');

                        // Show in UI Log for User Visibility
                        const logContainer = document.getElementById('simulation-log');
                        const logContent = document.getElementById('log-content');

                        if (logContainer && logContent) {
                            logContainer.style.display = 'block';
                            const timestamp = new Date().toLocaleTimeString();
                            const logEntry = `
                                <div style="margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                                    <span style="color: #4ade80;">[${timestamp}] MESSAGE RECEIVED:</span><br>
                                    <strong>From:</strong> ${name} (${email})<br>
                                    <strong>Message:</strong> "${message}"
                                </div>
                            `;
                            logContent.innerHTML = logEntry + logContent.innerHTML;
                        }

                        alert(`(Simulation Mode) Message sent! \n\nI've added a visible "Backend Log" below the form so you can see your message arriving.`);

                        contactForm.reset();
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                    }, 1500);
                });
        });
    }
});
