document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('open');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileBtn.classList.remove('open');
            });
        });
    }

    // Navbar Scroll Effect (Glass backdrop enhancement)
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.startsWith('#cv-modal')) return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navbarHeight = navbar ? navbar.clientHeight : 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Spy for active navigation highlighting
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-links a:not(.cv-trigger)');

    function scrollSpy() {
        let currentSectionId = 'home';
        const navbarHeight = navbar ? navbar.clientHeight : 80;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 20;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', scrollSpy);
    scrollSpy(); // Initial run

    // Intersection Observer for Reveal on Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Staggered animation for grid children
                if (entry.target.classList.contains('stagger-grid')) {
                    const items = entry.target.children;
                    Array.from(items).forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 80); // Stagger interval
                    });
                    observer.unobserve(entry.target);
                } else {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    // Elements to reveal
    const revealElements = document.querySelectorAll(
        '.hero-content, .section-header, .about-text, .stat-item, .service-card, .contact-wrapper, .timeline-item, .featured-project-card, .cv-card'
    );
    
    revealElements.forEach(el => {
        el.classList.add('reveal-item');
        observer.observe(el);
    });

    // Grids to stagger
    const staggerGrids = document.querySelectorAll('.skills-category-grid, .projects-grid, .services-grid');
    staggerGrids.forEach(grid => {
        grid.classList.add('stagger-grid');
        observer.observe(grid);

        // Hide children initially
        Array.from(grid.children).forEach(child => {
            child.classList.add('reveal-item');
        });
    });

    // Contact Form Handling (EmailJS with Client-Side Validation)
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Form Fields
            const nameInput = this.querySelector('input[type="text"]');
            const emailInput = this.querySelector('input[type="email"]');
            const projectSelect = this.querySelector('select');
            const messageInput = this.querySelector('textarea');
            const submitBtn = this.querySelector('button[type="submit"]');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const projectType = projectSelect.value;
            const message = messageInput.value.trim();

            // Client-Side Validation
            if (name.length < 2) {
                alert('Please enter a valid name (at least 2 characters).');
                nameInput.focus();
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                emailInput.focus();
                return;
            }

            if (!projectType) {
                alert('Please select a project type.');
                projectSelect.focus();
                return;
            }

            if (message.length < 10) {
                alert('Please tell me a bit more about your project (at least 10 characters).');
                messageInput.focus();
                return;
            }

            // Disable submit button and show loading state
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending Message...';
            submitBtn.disabled = true;

            // EmailJS Parameters
            const templateParams = {
                name: name,
                email: email,
                project_type: projectType,
                message: message
            };

            // Send Email using EmailJS
            emailjs.send('Shefeel_123', 'template_a5idkni', templateParams)
                .then(() => {
                    // Success callback
                    showSimulationLog(name, email, projectType, message, true);
                    alert(`Thank you, ${name}! Your message has been sent successfully. I will get back to you shortly.`);
                    contactForm.reset();
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                })
                .catch((error) => {
                    // Failure Callback (Simulation fallback for testing/demo)
                    console.warn('EmailJS delivery failed, fallback to local simulator:', error);
                    
                    // Simulate network delay
                    setTimeout(() => {
                        showSimulationLog(name, email, projectType, message, false);
                        alert(`Message received! (Simulator Mode)\n\nThank you, ${name}. I've logged the submission in the debug console below the form.`);
                        contactForm.reset();
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                    }, 1200);
                });
        });
    }

    // Helper to display submission log in the UI for validation
    function showSimulationLog(name, email, projectType, message, isReal) {
        const logContainer = document.getElementById('simulation-log');
        const logContent = document.getElementById('log-content');

        if (logContainer && logContent) {
            logContainer.style.display = 'block';
            const timestamp = new Date().toLocaleTimeString();
            const statusLabel = isReal ? 'DELIVERED (EmailJS)' : 'SIMULATED (Fallback)';
            const statusColor = isReal ? '#4ade80' : '#fbbf24';

            const logEntry = `
                <div style="margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1rem;">
                    <span style="color: ${statusColor}; font-weight: bold;">[${timestamp}] CONTACT INQUIRY - ${statusLabel}:</span><br>
                    <strong>Name:</strong> ${name}<br>
                    <strong>Email:</strong> ${email}<br>
                    <strong>Project Type:</strong> ${projectType}<br>
                    <strong>Message:</strong> "${message}"
                </div>
            `;
            logContent.innerHTML = logEntry + logContent.innerHTML;
            
            // Scroll to the simulation log so the user can verify
            logContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }

    // CV Modal functionality
    const cvModal = document.getElementById('cv-modal');
    const cvTriggers = document.querySelectorAll('.cv-trigger');
    const cvCloseBtn = document.querySelector('.cv-modal-close');

    if (cvModal && cvTriggers.length > 0) {
        cvTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                cvModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock background scrolling
            });
        });
    }

    if (cvCloseBtn && cvModal) {
        cvCloseBtn.addEventListener('click', () => {
            cvModal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore background scrolling
        });

        cvModal.addEventListener('click', (e) => {
            if (e.target === cvModal) {
                cvModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cvModal.classList.contains('active')) {
                cvModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});
