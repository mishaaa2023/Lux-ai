// Initialize AOS (Animate On Scroll) library
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
    
    // Initialize all components
    initNavigation();
    initModal();
    initSmoothScrolling();
    initCarousel();
    initFormHandler();
    initScrollEffects();
    initInteractiveElements();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Modal functionality
function initModal() {
    const modal = document.getElementById('contact-modal');
    const modalTriggers = document.querySelectorAll('a[href="#contact"]');
    const closeBtn = document.querySelector('.close');
    
    // Open modal when clicking CTA buttons
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Track analytics (placeholder for real implementation)
            trackEvent('modal_opened', {
                source: this.textContent.trim(),
                section: getClosestSection(this)
            });
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        closeModal();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if it's a modal trigger
            if (this.getAttribute('href') === '#contact') {
                return;
            }
            
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Solution preview carousel
function initCarousel() {
    const carousel = document.querySelector('.preview-carousel');
    const slides = document.querySelectorAll('.preview-slide');
    
    if (!carousel || slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Auto-rotate carousel every 4 seconds
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % totalSlides;
        slides[currentSlide].classList.add('active');
    }, 4000);
    
    // Add hover pause functionality
    carousel.addEventListener('mouseenter', () => {
        carousel.style.animationPlayState = 'paused';
    });
    
    carousel.addEventListener('mouseleave', () => {
        carousel.style.animationPlayState = 'running';
    });
}

// Form submission handler
function initFormHandler() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Add loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scheduling...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate required fields
        if (!validateForm(data)) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            return;
        }
        
        // Simulate form submission (replace with real endpoint)
        setTimeout(() => {
            // Success state
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Call Scheduled!';
            submitBtn.style.background = '#10B981';
            
            // Track successful submission
            trackEvent('form_submitted', data);
            
            // Show success message
            showSuccessMessage();
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                document.getElementById('contact-modal').style.display = 'none';
                document.body.style.overflow = 'auto';
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.style.background = '';
            }, 2000);
            
        }, 1500); // Simulate network delay
    });
}

// Form validation
function validateForm(data) {
    const requiredFields = ['name', 'email', 'company', 'position', 'revenue'];
    const errors = [];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
    });
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormErrors(errors) {
    // Remove existing error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // Show new errors
    errors.forEach(error => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #DC2626;
            background: #FEE2E2;
            padding: 0.5rem;
            border-radius: 4px;
            margin-bottom: 1rem;
            font-size: 0.875rem;
        `;
        errorDiv.textContent = error;
        
        const form = document.getElementById('contact-form');
        form.insertBefore(errorDiv, form.firstChild);
    });
    
    // Auto-remove errors after 5 seconds
    setTimeout(() => {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
    }, 5000);
}

function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <strong>Success!</strong> Your strategy call has been scheduled. Check your email for details.
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Scroll effects
function initScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero-section');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (hero && heroVisual) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (scrolled < hero.offsetHeight) {
                heroVisual.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    // Header shadow on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
    
    // Progress indicator
    const progressBar = createProgressBar();
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--gold-beige), var(--deep-teal));
        z-index: 1000;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);
    return progressBar;
}

// Interactive elements
function initInteractiveElements() {
    // Floating animation for product images
    const floatingElements = document.querySelectorAll('.floating-product, .gallery-item');
    
    floatingElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.05) translateY(-10px)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
        });
    });
    
    // Value items interactive hover
    const valueItems = document.querySelectorAll('.value-item');
    
    valueItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.borderLeftWidth = '8px';
            item.style.transform = 'translateX(5px) translateY(-5px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.borderLeftWidth = '4px';
            item.style.transform = '';
        });
    });
    
    // Timeline items sequential animation on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease-out';
        timelineObserver.observe(item);
    });
    
    // Statistics counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target);
            }
        });
    });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateStatNumber(element) {
    const text = element.textContent;
    const hasPercent = text.includes('%');
    const hasX = text.includes('x');
    const number = parseInt(text.replace(/[^\d]/g, ''));
    
    if (isNaN(number)) return;
    
    let current = 0;
    const increment = number / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        if (hasPercent) {
            displayValue += '%';
        } else if (hasX) {
            displayValue += 'x';
        } else if (text === 'Global') {
            displayValue = 'Global';
        }
        
        element.textContent = displayValue;
    }, 40);
}

// Utility functions
function getClosestSection(element) {
    let current = element;
    while (current && current !== document.body) {
        if (current.tagName === 'SECTION' && current.id) {
            return current.id;
        }
        current = current.parentElement;
    }
    return 'unknown';
}

function trackEvent(eventName, data) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, data);
    
    // In a real implementation, you would send this to your analytics service
    // Example: gtag('event', eventName, data);
    // Example: analytics.track(eventName, data);
}

// Performance optimization: Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    // Tab navigation for modal
    if (e.key === 'Tab') {
        const modal = document.getElementById('contact-modal');
        if (modal.style.display === 'block') {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Add CSS class for scroll animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'https://pixabay.com/get/ge2befc08d0a9854ab5a3f10697a34c5a4199ba5a1c36f3176df65ac066009f0150740edcc4cc86a14148a78e750d02ef66541cd021de6e6670f6a1221d526071_1280.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadImages();
