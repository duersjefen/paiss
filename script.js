// =============================================================================
// PAISS - JavaScript Animations and Interactions
// AI-Native Development Showcase
// =============================================================================

// Console Easter Egg
console.log(`
%c🤖 PAISS - AI-Native Development Showcase
%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

%cBuild Stats:
%c  Build Time:     ~30 minutes
  AI Tool:        Claude Code (Sonnet 4.5)
  Method:         AI-assisted development
  Lines of Code:  ~1,200
  Test Coverage:  Manual (visual QA)

%cSpeed Comparison:
%c  Traditional:    8+ hours
  AI-Native:      30 minutes
  Efficiency:     16x faster 🚀

%cWant to build this fast?
%c  👉 Get in touch: info@paiss.me
  👉 Website: https://paiss.me

%cView source for AI collaboration markers! 👀
`,
'color: #06b6d4; font-size: 16px; font-weight: bold;',
'color: #64748b;',
'color: #8b5cf6; font-weight: bold;',
'color: #64748b;',
'color: #8b5cf6; font-weight: bold;',
'color: #64748b;',
'color: #8b5cf6; font-weight: bold;',
'color: #06b6d4; font-weight: bold;',
'color: #94a3b8; font-style: italic;'
);

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initCounters();
    initSmoothScroll();
    initMobileMenu();
    initScrollProgress();
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

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
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

    if (!menuToggle || !navLinks) return;

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
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-open');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('mobile-open');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
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
