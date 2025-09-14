// Animation controller
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        if (this.isReducedMotion) {
            document.body.classList.add('reduced-motion');
            return;
        }
        
        this.setupScrollAnimations();
        this.setupSkillBars();
        this.setupCounters();
        this.setupParallax();
        this.setupHoverEffects();
    }
    
    // Setup scroll-triggered animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all elements with scroll animation classes
        const animateElements = document.querySelectorAll('.scroll-animate, .fade-in, .slide-in-left, .slide-in-right, .scale-in');
        animateElements.forEach(el => observer.observe(el));
        
        this.observers.set('scroll', observer);
    }
    
    // Animate element based on its classes
    animateElement(element) {
        if (element.classList.contains('scroll-animate')) {
            element.classList.add('animate');
        }
        
        if (element.classList.contains('fade-in')) {
            element.classList.add('visible');
        }
        
        if (element.classList.contains('slide-in-left')) {
            element.classList.add('visible');
        }
        
        if (element.classList.contains('slide-in-right')) {
            element.classList.add('visible');
        }
        
        if (element.classList.contains('scale-in')) {
            element.classList.add('visible');
        }
        
        // Stagger child animations
        if (element.classList.contains('stagger-container')) {
            this.staggerChildAnimations(element);
        }
    }
    
    // Stagger animations for child elements
    staggerChildAnimations(container) {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('animate');
            }, index * 100);
        });
    }
    
    // Setup skill bar animations
    setupSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const level = progressBar.dataset.level;
                    
                    setTimeout(() => {
                        progressBar.style.width = `${level}%`;
                    }, 300);
                    
                    observer.unobserve(progressBar);
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => observer.observe(bar));
        this.observers.set('skillBars', observer);
    }
    
    // Setup counter animations
    setupCounters() {
        const counters = document.querySelectorAll('.stat-number, .badge-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
        this.observers.set('counters', observer);
    }
    
    // Animate counter from 0 to target value
    animateCounter(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const targetValue = parseInt(text.replace(/[^\d]/g, ''));
        
        if (isNaN(targetValue)) return;
        
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(targetValue * easeOut);
            
            element.textContent = hasPlus ? `${currentValue}+` : currentValue.toString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    // Setup parallax effects
    setupParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        if (parallaxElements.length === 0) return;
        
        const handleScroll = window.config.throttle(() => {
            const scrollY = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 16);
        
        window.addEventListener('scroll', handleScroll);
    }
    
    // Setup hover effects
    setupHoverEffects() {
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('.btn, .project-link, .social-link');
        buttons.forEach(button => {
            button.addEventListener('click', this.createRipple.bind(this));
        });
        
        // Add magnetic effect to cards
        const cards = document.querySelectorAll('.project-card, .service-card, .skill-category');
        cards.forEach(card => {
            this.addMagneticEffect(card);
        });
    }
    
    // Create ripple effect on click
    createRipple(event) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Add magnetic effect to element
    addMagneticEffect(element) {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.1;
            const moveY = y * 0.1;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    }
    
    // Animate page transitions
    animatePageTransition(callback) {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            z-index: 9999;
            transform: translateX(-100%);
            transition: transform 0.5s ease-in-out;
        `;
        
        document.body.appendChild(overlay);
        
        // Animate in
        requestAnimationFrame(() => {
            overlay.style.transform = 'translateX(0)';
        });
        
        setTimeout(() => {
            if (callback) callback();
            
            // Animate out
            overlay.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                overlay.remove();
            }, 500);
        }, 500);
    }
    
    // Typewriter effect
    typeWriter(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }
    
    // Reveal text animation
    revealText(element, delay = 0) {
        const text = element.textContent;
        const words = text.split(' ');
        
        element.innerHTML = words.map(word => 
            `<span class="word" style="opacity: 0; transform: translateY(20px);">${word}</span>`
        ).join(' ');
        
        const wordElements = element.querySelectorAll('.word');
        
        wordElements.forEach((word, index) => {
            setTimeout(() => {
                word.style.transition = 'all 0.6s ease-out';
                word.style.opacity = '1';
                word.style.transform = 'translateY(0)';
            }, delay + (index * 100));
        });
    }
    
    // Cleanup observers
    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animatedElements.clear();
    }
    
    // Refresh animations (useful for dynamic content)
    refresh() {
        this.cleanup();
        this.init();
    }
}

// Loading screen animation
class LoadingScreen {
    constructor() {
        this.element = document.querySelector('#loading-screen');
        this.progress = this.element?.querySelector('.loading-progress');
        this.message = this.element?.querySelector('.loading-message');
        this.currentProgress = 0;
    }
    
    show() {
        if (this.element) {
            this.element.classList.remove('hidden');
        }
    }
    
    hide() {
        if (this.element) {
            this.element.classList.add('hidden');
            setTimeout(() => {
                this.element.style.display = 'none';
            }, 500);
        }
    }
    
    updateProgress(progress, message) {
        this.currentProgress = Math.min(progress, 100);
        
        if (this.progress) {
            this.progress.style.width = `${this.currentProgress}%`;
        }
        
        if (this.message && message) {
            this.message.textContent = message;
        }
    }
    
    async simulate() {
        const steps = [
            { progress: 20, message: 'Loading configuration...', delay: 300 },
            { progress: 40, message: 'Loading content...', delay: 400 },
            { progress: 60, message: 'Initializing components...', delay: 300 },
            { progress: 80, message: 'Setting up animations...', delay: 200 },
            { progress: 100, message: 'Ready!', delay: 300 }
        ];
        
        for (const step of steps) {
            await new Promise(resolve => {
                setTimeout(() => {
                    this.updateProgress(step.progress, step.message);
                    resolve();
                }, step.delay);
            });
        }
        
        setTimeout(() => {
            this.hide();
        }, 500);
    }
}

// Initialize animation controller and loading screen
window.animationController = new AnimationController();
window.loadingScreen = new LoadingScreen();

// Export classes
window.AnimationController = AnimationController;
window.LoadingScreen = LoadingScreen;

// Add CSS for animations that need to be defined in JS
const animationStyles = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    .page-transition-overlay {
        pointer-events: none;
    }
    
    .word {
        display: inline-block;
        margin-right: 0.25em;
    }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);