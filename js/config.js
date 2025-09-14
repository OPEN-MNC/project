// Configuration and utility functions
class Config {
    constructor() {
        this.apiEndpoints = {
            emailJS: {
                serviceId: 'your_service_id',
                templateId: 'your_template_id',
                publicKey: 'your_public_key'
            }
        };
        
        this.animations = {
            duration: 800,
            easing: 'ease-out',
            staggerDelay: 100
        };
        
        this.breakpoints = {
            mobile: 576,
            tablet: 768,
            desktop: 992,
            large: 1200
        };
        
        this.settings = {
            smoothScroll: true,
            lazyLoading: true,
            animationsEnabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };
    }
    
    // Get current breakpoint
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width >= this.breakpoints.large) return 'large';
        if (width >= this.breakpoints.desktop) return 'desktop';
        if (width >= this.breakpoints.tablet) return 'tablet';
        return 'mobile';
    }
    
    // Check if mobile device
    isMobile() {
        return window.innerWidth < this.breakpoints.tablet;
    }
    
    // Calculate years of experience
    calculateExperience(startDate) {
        const start = new Date(startDate);
        const now = new Date();
        const diffTime = Math.abs(now - start);
        const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
        return diffYears;
    }
    
    // Format date
    formatDate(dateString, options = {}) {
        const date = new Date(dateString);
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
    }
    
    // Debounce function
    debounce(func, wait) {
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
    
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Generate unique ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    // Local storage helpers
    storage = {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('Failed to save to localStorage:', e);
                return false;
            }
        },
        
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.warn('Failed to read from localStorage:', e);
                return defaultValue;
            }
        },
        
        remove: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn('Failed to remove from localStorage:', e);
                return false;
            }
        }
    };
    
    // URL helpers
    url = {
        getParams: () => {
            const params = new URLSearchParams(window.location.search);
            const result = {};
            for (const [key, value] of params) {
                result[key] = value;
            }
            return result;
        },
        
        setParam: (key, value) => {
            const url = new URL(window.location);
            url.searchParams.set(key, value);
            window.history.replaceState({}, '', url);
        },
        
        removeParam: (key) => {
            const url = new URL(window.location);
            url.searchParams.delete(key);
            window.history.replaceState({}, '', url);
        }
    };
    
    // Performance helpers
    performance = {
        mark: (name) => {
            if (window.performance && window.performance.mark) {
                window.performance.mark(name);
            }
        },
        
        measure: (name, startMark, endMark) => {
            if (window.performance && window.performance.measure) {
                window.performance.measure(name, startMark, endMark);
                const measure = window.performance.getEntriesByName(name)[0];
                return measure ? measure.duration : 0;
            }
            return 0;
        }
    };
}

// Create global config instance
window.config = new Config();

// Utility functions
window.utils = {
    // DOM helpers
    $: (selector, context = document) => context.querySelector(selector),
    $$: (selector, context = document) => Array.from(context.querySelectorAll(selector)),
    
    // Create element with attributes
    createElement: (tag, attributes = {}, children = []) => {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key.startsWith('data-')) {
                element.setAttribute(key, value);
            } else {
                element[key] = value;
            }
        });
        
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        
        return element;
    },
    
    // Add event listener with cleanup
    addEvent: (element, event, handler, options = {}) => {
        element.addEventListener(event, handler, options);
        return () => element.removeEventListener(event, handler, options);
    },
    
    // Wait for element to exist
    waitForElement: (selector, timeout = 5000) => {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            
            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    },
    
    // Smooth scroll to element
    scrollTo: (element, offset = 0) => {
        const targetElement = typeof element === 'string' ? document.querySelector(element) : element;
        if (!targetElement) return;
        
        const targetPosition = targetElement.offsetTop - offset;
        
        if (window.config.settings.smoothScroll) {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo(0, targetPosition);
        }
    },
    
    // Check if element is in viewport
    isInViewport: (element, threshold = 0) => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top >= -threshold &&
            rect.left >= -threshold &&
            rect.bottom <= windowHeight + threshold &&
            rect.right <= windowWidth + threshold
        );
    },
    
    // Get element offset from top of page
    getOffset: (element) => {
        let offsetTop = 0;
        let offsetLeft = 0;
        
        while (element) {
            offsetTop += element.offsetTop;
            offsetLeft += element.offsetLeft;
            element = element.offsetParent;
        }
        
        return { top: offsetTop, left: offsetLeft };
    },
    
    // Format number with commas
    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    // Truncate text
    truncateText: (text, length, suffix = '...') => {
        if (text.length <= length) return text;
        return text.substring(0, length) + suffix;
    },
    
    // Validate email
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Copy to clipboard
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    },
    
    // Generate random color
    randomColor: () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    },
    
    // Convert hex to RGB
    hexToRgb: (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
};

// Initialize performance monitoring
window.config.performance.mark('config-loaded');