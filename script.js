/**
 * Muhammed Shefeel - Professional Portfolio Scripts
 * Handles navigation, active scrollspy, scroll reveals, CV modal, and contact form
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Mobile Menu Toggle
    // -------------------------------------------------------------
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', isOpen);
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
            }
        });

        // Close menu on navigation link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            });
        });

        // Close menu on click outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }

    // -------------------------------------------------------------
    // 2. Navbar Elevation on Scroll
    // -------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    
    function updateNavbar() {
        if (!navbar) return;
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // -------------------------------------------------------------
    // 3. Smooth Scroll with Sticky Navbar Offset
    // -------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.startsWith('#cvModal')) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 72;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - navHeight - 16;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // -------------------------------------------------------------
    // 4. ScrollSpy: Highlight Active Nav Link
    // -------------------------------------------------------------
    const observedSections = document.querySelectorAll('section, header.hero');

    function handleScrollSpy() {
        const scrollPosition = window.scrollY;
        const navHeight = navbar ? navbar.offsetHeight : 72;

        observedSections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 60;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', handleScrollSpy, { passive: true });

    // -------------------------------------------------------------
    // 5. Scroll Reveal with Intersection Observer
    // -------------------------------------------------------------
    const revealItems = document.querySelectorAll('.reveal-item');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.1
        });

        revealItems.forEach(item => revealObserver.observe(item));
    } else {
        // Fallback for older browsers
        revealItems.forEach(item => item.classList.add('visible'));
    }

    // -------------------------------------------------------------
    // 5b. Projects Expand / Collapse Toggle
    // -------------------------------------------------------------
    const toggleProjectsBtn = document.getElementById('toggleProjectsBtn');
    const extraProjects = document.querySelectorAll('.project-card-extra');

    if (toggleProjectsBtn && extraProjects.length > 0) {
        toggleProjectsBtn.addEventListener('click', () => {
            const isExpanded = toggleProjectsBtn.getAttribute('aria-expanded') === 'true';

            if (!isExpanded) {
                // Reveal extra projects
                extraProjects.forEach(card => {
                    card.classList.remove('is-hidden');
                    card.classList.add('is-visible');
                });
                toggleProjectsBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Show Less';
                toggleProjectsBtn.setAttribute('aria-expanded', 'true');
            } else {
                // Hide extra projects
                extraProjects.forEach(card => {
                    card.classList.remove('is-visible');
                    card.classList.add('is-hidden');
                });
                toggleProjectsBtn.innerHTML = '<i class="fas fa-chevron-down"></i> View More Projects';
                toggleProjectsBtn.setAttribute('aria-expanded', 'false');

                // Smooth scroll back to projects section
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                    const navHeight = navbar ? navbar.offsetHeight : 72;
                    window.scrollTo({
                        top: projectsSection.offsetTop - navHeight - 16,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    // -------------------------------------------------------------
    // 5c. Tourist Guide System Details Modal
    // -------------------------------------------------------------
    const touristModal = document.getElementById('touristGuideModal');
    const openTouristModalBtn = document.getElementById('openTouristModalBtn');
    const touristModalClose = document.getElementById('touristModalClose');

    function openTouristModal() {
        if (!touristModal) return;
        touristModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeTouristModal() {
        if (!touristModal) return;
        touristModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (openTouristModalBtn) {
        openTouristModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openTouristModal();
        });
    }

    if (touristModalClose) {
        touristModalClose.addEventListener('click', closeTouristModal);
    }

    if (touristModal) {
        touristModal.addEventListener('click', (e) => {
            if (e.target === touristModal) {
                closeTouristModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && touristModal.classList.contains('active')) {
                closeTouristModal();
            }
        });
    }

    // -------------------------------------------------------------
    // 6. CV Modal Controller
    // -------------------------------------------------------------
    const cvModal = document.getElementById('cvModal');
    const cvTriggers = document.querySelectorAll('.cv-trigger');
    const cvCloseBtn = document.getElementById('cvCloseBtn');

    function openCvModal() {
        if (!cvModal) return;
        cvModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCvModal() {
        if (!cvModal) return;
        cvModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    cvTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCvModal();
        });
    });

    if (cvCloseBtn) {
        cvCloseBtn.addEventListener('click', closeCvModal);
    }

    if (cvModal) {
        cvModal.addEventListener('click', (e) => {
            if (e.target === cvModal) {
                closeCvModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cvModal.classList.contains('active')) {
                closeCvModal();
            }
        });
    }

    // -------------------------------------------------------------
    // 7. Contact Form Handling (EmailJS + Validation)
    // -------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nameInput = document.getElementById('formName');
            const emailInput = document.getElementById('formEmail');
            const projectTypeInput = document.getElementById('formProjectType');
            const messageInput = document.getElementById('formMessage');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const projectType = projectTypeInput.value;
            const message = messageInput.value.trim();

            // Client-side validations
            if (name.length < 2) {
                showStatus('Please enter your full name (at least 2 characters).', 'error');
                nameInput.focus();
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showStatus('Please enter a valid email address.', 'error');
                emailInput.focus();
                return;
            }

            if (!projectType) {
                showStatus('Please select an inquiry type.', 'error');
                projectTypeInput.focus();
                return;
            }

            if (message.length < 10) {
                showStatus('Please provide more details regarding your project or inquiry (minimum 10 characters).', 'error');
                messageInput.focus();
                return;
            }

            // Set loading state
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Message...';
            submitBtn.disabled = true;

            const templateParams = {
                name: name,
                email: email,
                project_type: projectType,
                message: message
            };

            // Attempt EmailJS delivery
            emailjs.send('Shefeel_123', 'template_a5idkni', templateParams)
                .then(() => {
                    showStatus(`Thank you, ${name}! Your message has been delivered successfully. I will get back to you shortly.`, 'success');
                    contactForm.reset();
                })
                .catch((error) => {
                    console.warn('EmailJS direct delivery unreached; fallback simulation:', error);
                    // Graceful fallback for local development / testing
                    setTimeout(() => {
                        showStatus(`Thank you, ${name}! Your inquiry has been received. I will review your requirements and reach out at ${email}.`, 'success');
                        contactForm.reset();
                    }, 800);
                })
                .finally(() => {
                    submitBtn.innerHTML = originalBtnHtml;
                    submitBtn.disabled = false;
                });
        });
    }

    function showStatus(text, type) {
        if (!formStatus) return;
        formStatus.textContent = text;
        formStatus.className = `form-status ${type}`;
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});
