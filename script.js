// =============================================================================
// PAISS - JavaScript Animations and Interactions
// AI-Native Development Showcase
// =============================================================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initCounters();
    initSmoothScroll();
    initMobileMenu();
    initScrollProgress();
    initHeaderScroll();
    initContactForm();
    initHeroTyping();

    // Only enable heavy animations on desktop
    if (window.innerWidth > 768) {
        initFloatingCTA();
        initParallaxHero();
        initTextReveal();
    }

    // Section nav works on all devices (needed for button navigation)
    initSectionNav();
});

// =============================================================================
// Scroll Animations
// =============================================================================
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.scroll-animate');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// =============================================================================
// Animated Counters
// =============================================================================
function initCounters() {
    // Select all elements with data-target attribute (numeric counters only)
    const counters = document.querySelectorAll('[data-target]');
    let hasAnimated = false;

    const animateCounter = (counter) => {
        const targetValue = counter.getAttribute('data-target');
        const target = parseInt(targetValue);

        // Only animate if target is a valid number
        if (isNaN(target)) {
            return;
        }

        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const stepTime = duration / steps;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                setTimeout(updateCounter, stepTime);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counters.forEach(counter => {
                    animateCounter(counter);
                });
            }
        });
    }, {
        threshold: 0.5
    });

    const heroSection = document.querySelector('.hero-split');
    if (heroSection) {
        observer.observe(heroSection);
    }
}


// =============================================================================
// Smooth Scroll
// =============================================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') return;

            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();

                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Focus contact form if scrolling to contact section
                if (href === '#contact-form') {
                    // Wait for smooth scroll to FULLY complete, THEN zoom
                    setTimeout(() => {
                        const contactForm = document.querySelector('.contact-form');
                        if (contactForm) {
                            contactForm.classList.add('form-zoom-in');

                            // Remove class after animation completes
                            setTimeout(() => {
                                contactForm.classList.remove('form-zoom-in');
                            }, 700);
                        }
                    }, 800); // Wait for full scroll completion

                    // Focus input after scroll + zoom animation
                    setTimeout(() => {
                        const nameInput = document.getElementById('name');
                        if (nameInput) {
                            nameInput.focus();
                        }
                    }, 1500); // Wait for scroll + zoom to complete
                }
            }
        });
    });
}

// =============================================================================
// Mobile Menu Toggle
// =============================================================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const headerCta = document.querySelector('.header-cta');

    if (!menuToggle || !navLinks) return;

    const closeMenu = () => {
        navLinks.classList.remove('mobile-open');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    };

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');

        // Animate hamburger icon
        const spans = menuToggle.querySelectorAll('span');
        if (navLinks.classList.contains('mobile-open')) {
            spans[0].style.transform = 'rotate(45deg) translateY(7px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking on header CTA
    if (headerCta) {
        headerCta.addEventListener('click', closeMenu);
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInside = navLinks.contains(e.target) ||
                              menuToggle.contains(e.target) ||
                              (headerCta && headerCta.contains(e.target));

        if (!isClickInside) {
            closeMenu();
        }
    });
}

// =============================================================================
// Scroll Progress Indicator
// =============================================================================
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    const updateProgress = () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${Math.min(scrolled, 100)}%`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // Initial call
}

// =============================================================================
// Floating CTA Button
// =============================================================================
function initFloatingCTA() {
    const floatingCTA = document.querySelector('.floating-cta');
    if (!floatingCTA) return;

    const showCTA = () => {
        const scrollY = window.scrollY;
        const triggerPoint = 500; // Show after scrolling 500px

        if (scrollY > triggerPoint) {
            floatingCTA.classList.add('visible');
        } else {
            floatingCTA.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', showCTA, { passive: true });
    showCTA(); // Initial check
}

// =============================================================================
// Dynamic Background Shapes (optional enhancement)
// =============================================================================
function initDynamicBackground() {
    const shapes = document.querySelectorAll('.shape');

    shapes.forEach((shape, index) => {
        // Add random movement variations
        const randomX = Math.random() * 200 - 100;
        const randomY = Math.random() * 200 - 100;

        shape.style.setProperty('--random-x', `${randomX}px`);
        shape.style.setProperty('--random-y', `${randomY}px`);
    });
}

// Initialize dynamic background
initDynamicBackground();

// =============================================================================
// Parallax Hero Effect
// =============================================================================
function initParallaxHero() {
    const heroStat = document.querySelector('.hero-stat-giant');
    const heroContent = document.querySelector('.hero-content');

    if (!heroStat || window.innerWidth < 768) return; // Desktop only

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
        // Smooth easing
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        // Apply parallax transform
        const moveX = currentX * 30; // 30px max movement
        const moveY = currentY * 30;

        heroStat.style.transform = `translate(${moveX}px, ${moveY}px)`;

        // Opposite direction for content (subtle)
        const contentMoveX = currentX * -10;
        const contentMoveY = currentY * -10;
        heroContent.style.transform = `translate(${contentMoveX}px, ${contentMoveY}px)`;

        requestAnimationFrame(animate);
    }

    animate();
}

// =============================================================================
// Custom Cursor
// =============================================================================
function initCustomCursor() {
    if (window.innerWidth < 768 || 'ontouchstart' in window) return; // Desktop only

    // Create cursor elements
    const cursor = document.createElement('div');
    const cursorDot = document.createElement('div');

    cursor.className = 'custom-cursor';
    cursorDot.className = 'custom-cursor-dot';

    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Smooth follow for outer cursor
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        // Faster follow for dot
        dotX += (mouseX - dotX) * 0.3;
        dotY += (mouseY - dotY) * 0.3;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Magnetic effect on interactive elements
    const magneticElements = document.querySelectorAll('a, button, .btn, .project-card');

    magneticElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorDot.classList.add('cursor-hover');
        });

        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorDot.classList.remove('cursor-hover');
        });
    });
}

// =============================================================================
// Section Navigation Dots
// =============================================================================
function initSectionNav() {
    const sectionNav = document.querySelector('.section-nav');
    const navDots = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('section[id]');

    if (!sectionNav || window.innerWidth < 768) return;

    // Show navigation after scrolling past hero
    const showNav = () => {
        if (window.scrollY > 600) {
            sectionNav.classList.add('visible');
        } else {
            sectionNav.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', showNav, { passive: true });
    showNav();

    // Update active dot based on scroll position
    const updateActiveDot = () => {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === currentSection) {
                dot.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveDot, { passive: true });
    updateActiveDot();
}

// =============================================================================
// Text Reveal Animation
// =============================================================================
function initTextReveal() {
    const titles = document.querySelectorAll('.section-title');

    titles.forEach(title => {
        // Split text into individual letters wrapped in spans
        const text = title.textContent;
        title.innerHTML = '';

        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'letter';
            span.textContent = char === ' ' ? '\u00A0' : char; // Preserve spaces
            title.appendChild(span);
        });
    });

    // Trigger reveal on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-text');
            }
        });
    }, {
        threshold: 0.3
    });

    titles.forEach(title => {
        observer.observe(title);
    });
}

// =============================================================================
// Header Scroll Effect
// =============================================================================
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
}

// =============================================================================
// Contact Form Handling
// =============================================================================
function initContactForm() {
    const form = document.getElementById('mainContactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);

        // Get all selected project types
        const projectTypes = Array.from(formData.getAll('project-type'));

        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            projectType: projectTypes,
            message: formData.get('message')
        };

        // Basic client-side validation
        if (!data.name || data.name.length < 2) {
            showFormError('Please enter your name');
            return;
        }

        if (!data.email || !isValidEmail(data.email)) {
            showFormError('Please enter a valid email address');
            return;
        }

        if (!data.message || data.message.length < 10) {
            showFormError('Please enter a message (at least 10 characters)');
            return;
        }

        // Disable submit button
        const submitButton = form.querySelector('.form-submit');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Sending...</span>';

        try {
            // Get API URL from environment (injected by SST at build time)
            const apiUrl = import.meta.env.VITE_API_URL;

            if (!apiUrl) {
                console.error('API URL not configured');
                throw new Error('API URL not configured');
            }

            // Send to backend API
            const response = await fetch(`${apiUrl}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to send message');
            }

            // Show success message
            showFormSuccess();

            // Reset form
            form.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            showFormError(error.message || 'Something went wrong. Please email me directly at info@paiss.me');
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormSuccess() {
    const successMessage = document.querySelector('.form-success');
    const errorMessage = document.querySelector('.form-error-message');

    if (successMessage) {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'flex';

        // Hide after 10 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 10000);
    }
}

function showFormError(message) {
    const errorMessage = document.querySelector('.form-error-message');
    const successMessage = document.querySelector('.form-success');

    if (errorMessage) {
        successMessage.style.display = 'none';
        errorMessage.querySelector('p').textContent = message;
        errorMessage.style.display = 'flex';

        // Hide after 8 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 8000);
    }
}

// =============================================================================
// Hero Typing Animation
// =============================================================================
function initHeroTyping() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const phrases = [
        'Ship solutions in days, not months',
        'AI-native development at scale',
        '30x faster than traditional dev',
        'Production-ready from day one'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isPaused) {
            isPaused = false;
            setTimeout(type, 2000); // Pause for 2 seconds before deleting
            return;
        }

        if (isDeleting) {
            // Backspace
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, 500); // Brief pause before typing next phrase
                return;
            }
        } else {
            // Type forward
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentPhrase.length) {
                isDeleting = true;
                isPaused = true;
                setTimeout(type, 100);
                return;
            }
        }

        // Typing speed: slower when typing, faster when deleting
        const speed = isDeleting ? 30 : 60;
        setTimeout(type, speed);
    }

    // Start typing animation
    type();
}

