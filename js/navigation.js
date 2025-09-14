// Navigation controller
class NavigationController {
    constructor() {
        this.navbar = document.querySelector('#navbar');
        this.navToggle = document.querySelector('#nav-toggle');
        this.navMenu = document.querySelector('#nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.backToTop = document.querySelector('#back-to-top');
        
        this.isMenuOpen = false;
        this.currentSection = 'home';
        this.scrollThreshold = 100;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupScrollSpy();
        this.setupSmoothScroll();
        this.setupBackToTop();
        this.updateActiveSection();
    }
    
    setupEventListeners() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.closeMobileMenu();
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Scroll events
        window.addEventListener('scroll', window.config.throttle(() => {
            this.handleScroll();
        }, 16));
        
        // Resize events
        window.addEventListener('resize', window.config.debounce(() => {
            this.handleResize();
        }, 250));
    }
    
    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateActiveNavLink(sectionId);
                    this.currentSection = sectionId;
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -80px 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    setupSmoothScroll() {
        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link && link.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            }
        });
    }
    
    setupBackToTop() {
        if (this.backToTop) {
            this.backToTop.addEventListener('click', () => {
                this.scrollToTop();
            });
        }
    }
    
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.navToggle) {
            this.navToggle.classList.toggle('active', this.isMenuOpen);
        }
        
        if (this.navMenu) {
            this.navMenu.classList.toggle('active', this.isMenuOpen);
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
        
        // Update ARIA attributes
        if (this.navToggle) {
            this.navToggle.setAttribute('aria-expanded', this.isMenuOpen.toString());
        }
    }
    
    closeMobileMenu() {
        if (this.isMenuOpen) {
            this.isMenuOpen = false;
            
            if (this.navToggle) {
                this.navToggle.classList.remove('active');
                this.navToggle.setAttribute('aria-expanded', 'false');
            }
            
            if (this.navMenu) {
                this.navMenu.classList.remove('active');
            }
            
            document.body.style.overflow = '';
        }
    }
    
    scrollToSection(sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (!targetElement) return;
        
        const navbarHeight = this.navbar ? this.navbar.offsetHeight : 80;
        const targetPosition = targetElement.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Update URL without triggering scroll
        if (history.replaceState) {
            history.replaceState(null, null, `#${sectionId}`);
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    updateActiveNavLink(sectionId) {
        this.navLinks.forEach(link => {
            const linkTarget = link.getAttribute('href').substring(1);
            link.classList.toggle('active', linkTarget === sectionId);
        });
    }
    
    updateActiveSection() {
        // Check URL hash on load
        const hash = window.location.hash.substring(1);
        if (hash) {
            setTimeout(() => {
                this.scrollToSection(hash);
            }, 100);
        }
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        
        // Update navbar appearance
        if (this.navbar) {
            this.navbar.classList.toggle('scrolled', scrollY > this.scrollThreshold);
        }
        
        // Update back to top button
        if (this.backToTop) {
            this.backToTop.classList.toggle('visible', scrollY > this.scrollThreshold * 3);
        }
        
        // Close mobile menu on scroll
        if (this.isMenuOpen && scrollY > 50) {
            this.closeMobileMenu();
        }
    }
    
    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth >= window.config.breakpoints.tablet && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }
    
    // Public methods for external use
    navigateTo(sectionId) {
        this.scrollToSection(sectionId);
    }
    
    getCurrentSection() {
        return this.currentSection;
    }
    
    isMenuVisible() {
        return this.isMenuOpen;
    }
}

// Project filter controller
class ProjectFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.currentFilter = 'all';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                this.filterProjects(filter);
                this.updateActiveButton(button);
            });
        });
    }
    
    filterProjects(filter) {
        this.currentFilter = filter;
        
        this.projectCards.forEach((card, index) => {
            const category = card.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
    
    updateActiveButton(activeButton) {
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
    
    getCurrentFilter() {
        return this.currentFilter;
    }
}

// Keyboard navigation
class KeyboardNavigation {
    constructor(navigationController) {
        this.nav = navigationController;
        this.focusableElements = [];
        this.currentFocusIndex = -1;
        
        this.init();
    }
    
    init() {
        this.updateFocusableElements();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });
        
        // Update focusable elements when DOM changes
        const observer = new MutationObserver(() => {
            this.updateFocusableElements();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    updateFocusableElements() {
        const selector = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
        this.focusableElements = Array.from(document.querySelectorAll(selector))
            .filter(el => !el.disabled && el.offsetParent !== null);
    }
    
    handleKeyDown(e) {
        switch (e.key) {
            case 'Tab':
                this.handleTabNavigation(e);
                break;
            case 'Enter':
            case ' ':
                this.handleActivation(e);
                break;
            case 'Escape':
                this.handleEscape(e);
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                this.handleArrowNavigation(e);
                break;
            case 'Home':
                this.handleHome(e);
                break;
            case 'End':
                this.handleEnd(e);
                break;
        }
    }
    
    handleTabNavigation(e) {
        // Custom tab navigation logic if needed
        // Default browser behavior is usually sufficient
    }
    
    handleActivation(e) {
        const activeElement = document.activeElement;
        
        // Handle space key for buttons
        if (e.key === ' ' && activeElement.tagName === 'BUTTON') {
            e.preventDefault();
            activeElement.click();
        }
    }
    
    handleEscape(e) {
        // Close mobile menu
        if (this.nav.isMenuVisible()) {
            this.nav.closeMobileMenu();
            this.nav.navToggle?.focus();
        }
        
        // Remove focus from current element
        if (document.activeElement !== document.body) {
            document.activeElement.blur();
        }
    }
    
    handleArrowNavigation(e) {
        // Handle arrow navigation in specific contexts
        const activeElement = document.activeElement;
        const parent = activeElement.closest('.nav-menu, .projects-filter');
        
        if (parent) {
            e.preventDefault();
            const siblings = Array.from(parent.querySelectorAll('a, button'));
            const currentIndex = siblings.indexOf(activeElement);
            
            let nextIndex;
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : siblings.length - 1;
            } else {
                nextIndex = currentIndex < siblings.length - 1 ? currentIndex + 1 : 0;
            }
            
            siblings[nextIndex]?.focus();
        }
    }
    
    handleHome(e) {
        if (e.ctrlKey) {
            e.preventDefault();
            this.nav.scrollToTop();
        }
    }
    
    handleEnd(e) {
        if (e.ctrlKey) {
            e.preventDefault();
            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Initialize navigation controllers
document.addEventListener('DOMContentLoaded', () => {
    window.navigationController = new NavigationController();
    window.projectFilter = new ProjectFilter();
    window.keyboardNavigation = new KeyboardNavigation(window.navigationController);
});

// Export classes
window.NavigationController = NavigationController;
window.ProjectFilter = ProjectFilter;
window.KeyboardNavigation = KeyboardNavigation;