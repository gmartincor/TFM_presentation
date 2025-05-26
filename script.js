// Preloader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.preloader').classList.add('fade-out');
    }, 500);
});

// Navigation functionality
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile navigation menu
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when a nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Active navigation link highlighting based on scroll position
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// Progress indicator functionality
function updateProgressIndicator() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressFill = document.querySelector('.progress-fill-indicator');
    if (progressFill) {
        progressFill.style.width = scrolled + '%';
    }
}

window.addEventListener('scroll', updateProgressIndicator);

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const body = document.body;

// Check for saved theme preference and apply it
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// Handle theme toggle click
themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Update theme icon based on current theme
function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Intersection Observer for fade-in animations
const fadeInElements = document.querySelectorAll('.fade-in');

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Apply fade-in animation setup to all fade-in elements
fadeInElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    fadeInObserver.observe(element);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced scroll behavior for better UX
let isScrolling = false;

function handleScroll() {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            highlightNavLink();
            updateProgressIndicator();
            isScrolling = false;
        });
        isScrolling = true;
    }
}

window.addEventListener('scroll', handleScroll, { passive: true });

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
    
    // Theme toggle with keyboard shortcut (Ctrl/Cmd + Shift + T)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        themeToggle.click();
    }
});

// Handle resize events for responsive behavior
function handleResize() {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
}

window.addEventListener('resize', handleResize);

// Initialize page state
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active nav link
    highlightNavLink();
    
    // Initialize progress indicator
    updateProgressIndicator();
    
    // Add loading animation delay for better UX
    setTimeout(() => {
        fadeInElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.animationDelay = `${index * 0.1}s`;
            }, index * 50);
        });
    }, 100);
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounced scroll handling for better performance
const debouncedScrollHandler = debounce(() => {
    highlightNavLink();
    updateProgressIndicator();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler, { passive: true });

// Accessibility improvements
function enhanceAccessibility() {
    // Add proper ARIA labels for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [tabindex]');
    
    interactiveElements.forEach(element => {
        if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
            const icon = element.querySelector('i[class*="fa-"]');
            if (icon) {
                const iconClass = icon.className;
                if (iconClass.includes('fa-moon')) {
                    element.setAttribute('aria-label', 'Activar tema oscuro');
                } else if (iconClass.includes('fa-sun')) {
                    element.setAttribute('aria-label', 'Activar tema claro');
                } else if (iconClass.includes('fa-bars')) {
                    element.setAttribute('aria-label', 'Abrir menú de navegación');
                }
            }
        }
    });
    
    // Add proper focus management for mobile menu
    navToggle.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            const firstNavLink = navMenu.querySelector('.nav-link');
            if (firstNavLink) {
                setTimeout(() => firstNavLink.focus(), 100);
            }
        }
    });
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// Error handling for critical functionality
window.addEventListener('error', (e) => {
    console.error('JavaScript error occurred:', e.error);
    // Ensure basic functionality works even if some features fail
    if (e.error && e.error.message.includes('navigation')) {
        console.warn('Navigation error detected, falling back to basic functionality');
    }
});

// Ensure proper cleanup on page unload
window.addEventListener('beforeunload', () => {
    // Save current theme preference
    const currentTheme = body.getAttribute('data-theme');
    if (currentTheme) {
        localStorage.setItem('theme', currentTheme);
    }
});

// Service Worker registration for better performance (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Only register if service worker file exists
        fetch('/sw.js')
            .then(() => {
                navigator.serviceWorker.register('/sw.js')
                    .then(() => {
                        console.log('Service Worker registered successfully');
                    })
                    .catch(() => {
                        console.log('Service Worker registration failed (file not found)');
                    });
            })
            .catch(() => {
                // Service worker file doesn't exist, skip registration
                console.log('Service Worker file not found, skipping registration');
            });
    });
}
