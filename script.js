// =============================================================================
// PAISS - JavaScript Animations and Interactions
// =============================================================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initCounters();
    initTypingAnimation();
    initSmoothScroll();
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
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
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

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// =============================================================================
// Typing Animation
// =============================================================================
function initTypingAnimation() {
    const textElement = document.getElementById('dynamic-text');
    if (!textElement) return;

    const texts = [
        'Pragmatic AI',
        'Modern Web Apps',
        'Cloud Infrastructure',
        'Intelligent Systems'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
        const currentText = texts[textIndex];

        if (isPaused) {
            setTimeout(type, 2000); // Pause for 2 seconds
            isPaused = false;
            return;
        }

        if (isDeleting) {
            textElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500); // Brief pause before typing next text
                return;
            }
        } else {
            textElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentText.length) {
                isDeleting = true;
                isPaused = true;
            }
        }

        const speed = isDeleting ? 50 : 100;
        setTimeout(type, speed);
    }

    // Start typing animation
    type();
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
            }
        });
    });
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
