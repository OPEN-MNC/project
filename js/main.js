
// Main application controller
class App {
    constructor() {
        this.isInitialized = false;
        this.components = {};
        this.performance = {
            startTime: performance.now(),
            loadTime: null,
            renderTime: null
        };
        
        this.init();
    }
    
    async init() {
        console.log("Application starting...");
        try {
            // Mark performance start
            window.config.performance.mark('app-init-start');
            
            // Show loading screen
            if (window.loadingScreen) {
                window.loadingScreen.show();
                await window.loadingScreen.simulate();
            }
            
            // Initialize components in order
            await this.initializeComponents();
            
            // Load and render content
            await this.loadContent();
            
            // Setup global event listeners
            this.setupGlobalEvents();
            
            // Mark as initialized
            this.isInitialized = true;
            
            // Calculate performance metrics
            this.calculatePerformance();
            
            // Dispatch ready event
            this.dispatchReadyEvent();
            
            console.log('🚀 Portfolio application initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.handleInitializationError(error);
        }
    }
    
    async initializeComponents() {
        // Initialize data loader and content renderer
        if (window.contentRenderer) {
            const success = await window.contentRenderer.init();
            if (!success) {
                throw new Error('Failed to initialize content renderer');
            }
            this.components.contentRenderer = window.contentRenderer;
        }
        
        // Initialize animation controller
        if (window.animationController) {
            this.components.animationController = window.animationController;
        }
        
        // Initialize navigation controller
        if (window.navigationController) {
            this.components.navigationController = window.navigationController;
        }
        
        // Initialize contact form
        if (window.contactForm) {
            this.components.contactForm = window.contactForm;
        }
        
        // Initialize project filter
        if (window.projectFilter) {
            this.components.projectFilter = window.projectFilter;
        }
    }
    
    async loadContent() {
        // Content is loaded by contentRenderer.init()
        // Additional content loading can be done here
        
        // Preload images
        if (window.dataLoader) {
            const projectsData = window.dataLoader.getCachedData('projects.json');
            if (projectsData?.projects) {
                const imageUrls = projectsData.projects
                    .map(project => project.image)
                    .filter(Boolean);
                
                try {
                    await window.dataLoader.preloadImages(imageUrls);
                } catch (error) {
                    console.warn('Some images failed to preload:', error);
                }
            }
        }
    }
    
    setupGlobalEvents() {
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onPageHidden();
            } else {
                this.onPageVisible();
            }
        });
        
        // Handle online/offline status
        window.addEventListener('online', () => {
            this.onOnline();
        });
        
        window.addEventListener('offline', () => {
            this.onOffline();
        });
        
        // Handle unload
        window.addEventListener('beforeunload', () => {
            this.onBeforeUnload();
        });
        
        // Handle errors
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event.error);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.handleGlobalError(event.reason);
        });
        
        // Handle resize
        window.addEventListener('resize', window.config.debounce(() => {
            this.onResize();
        }, 250));
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.onOrientationChange();
            }, 100);
        });
    }
    
    calculatePerformance() {
        window.config.performance.mark('app-init-end');
        
        this.performance.loadTime = window.config.performance.measure(
            'app-load-time',
            'app-init-start',
            'app-init-end'
        );
        
        // Log performance metrics
        console.log('📊 Performance Metrics:', {
            loadTime: `${this.performance.loadTime.toFixed(2)}ms`,
            domContentLoaded: `${(performance.now() - this.performance.startTime).toFixed(2)}ms`
        });
        
        // Send to analytics if available
        if (window.gtag) {
            window.gtag('event', 'timing_complete', {
                name: 'app_load',
                value: Math.round(this.performance.loadTime)
            });
        }
    }
    
    dispatchReadyEvent() {
        const readyEvent = new CustomEvent('app:ready', {
            detail: {
                loadTime: this.performance.loadTime,
                components: Object.keys(this.components)
            }
        });
        
        document.dispatchEvent(readyEvent);
        if (window.loadingScreen) {
            window.loadingScreen.hide();
        }
    }
    
    handleInitializationError(error) {
        // Hide loading screen
        if (window.loadingScreen) {
            window.loadingScreen.hide();
        }
        
        // Show error message
        this.showErrorMessage('Failed to load the application. Please refresh the page.');
        
        // Log error
        console.error('Initialization error:', error);
        
        // Send to error tracking service if available
        if (window.gtag) {
            window.gtag('event', 'exception', {
                description: error.message,
                fatal: true
            });
        }
    }
    
    handleGlobalError(error) {
        console.error('Global error:', error);
        
        // Send to error tracking service if available
        if (window.gtag) {
            window.gtag('event', 'exception', {
                
                description: error.message || error.toString(),
                fatal: false
            });
        }
    }
    
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'global-error';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h3>Oops! Something went wrong</h3>
                <p>${message}</p>
                <button onclick="window.location.reload()" class="btn btn-primary">
                    Refresh Page
                </button>
            </div>
        `;
        
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            text-align: center;
            padding: 2rem;
        `;
        
        document.body.appendChild(errorDiv);
    }
    
    // Event handlers
    onPageHidden() {
        // Pause animations or reduce activity
        if (this.components.animationController) {
            // Pause non-essential animations
        }
    }
    
    onPageVisible() {
        // Resume animations
        if (this.components.animationController) {
            // Resume animations
        }
    }
    
    onOnline() {
        console.log('📶 Connection restored');
        // Handle reconnection
    }
    
    onOffline() {
        console.log('📵 Connection lost');
        // Handle offline state
    }
    
    onResize() {
        // Handle responsive changes
        if (this.components.animationController) {
            this.components.animationController.refresh();
        }
    }
    
    onOrientationChange() {
        // Handle orientation changes
        this.onResize();
    }
    
    onBeforeUnload() {
        // Cleanup before page unload
        this.cleanup();
    }
    
    // Public methods
    getComponent(name) {
        return this.components[name];
    }
    
    isReady() {
        return this.isInitialized;
    }
    
    getPerformanceMetrics() {
        return { ...this.performance };
    }
    
    // Cleanup
    cleanup() {
        // Cleanup components
        Object.values(this.components).forEach(component => {
            if (component.cleanup && typeof component.cleanup === 'function') {
                component.cleanup();
            }
        });
        
        // Clear caches
        if (window.dataLoader) {
            window.dataLoader.clearCache();
        }
    }
    
    // Development helpers
    debug() {
        return {
            isInitialized: this.isInitialized,
            components: Object.keys(this.components),
            performance: this.performance,
            config: window.config,
            utils: window.utils
        };
    }
}

// Theme controller
class ThemeController {
    constructor() {
        this.currentTheme = 'dark';
        this.themes = {
            dark: {
                '--bg-primary': '#0f172a',
                '--bg-secondary': '#1e293b',
                '--text-primary': '#f8fafc',
                '--text-secondary': '#cbd5e1'
            },
            light: {
                '--bg-primary': '#ffffff',
                '--bg-secondary': '#f8fafc',
                '--text-primary': '#1e293b',
                '--text-secondary': '#475569'
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadSavedTheme();
        this.setupEventListeners();
    }
    
    loadSavedTheme() {
        const savedTheme = window.config.storage.get('theme', 'dark');
        this.setTheme(savedTheme);
    }
    
    setupEventListeners() {
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (!window.config.storage.get('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    setTheme(theme) {
        if (!this.themes[theme]) return;
        
        this.currentTheme = theme;
        const themeVars = this.themes[theme];
        
        Object.entries(themeVars).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
        
        document.body.setAttribute('data-theme', theme);
        window.config.storage.set('theme', theme);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
    
    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    window.themeController = new ThemeController();
});

// Export classes
window.App = App;
window.ThemeController = ThemeController;

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global JavaScript error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('📈 Page Performance:', {
                domContentLoaded: `${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`,
                loadComplete: `${perfData.loadEventEnd - perfData.loadEventStart}ms`,
                totalTime: `${perfData.loadEventEnd - perfData.navigationStart}ms`
            });
        }, 0);
    });
}

// Service Worker registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => {
        //         console.log('SW registered: ', registration);
        //     })
        //     .catch(registrationError => {
        //         console.log('SW registration failed: ', registrationError);
        //     });
    });
}

// Expose app instance globally for debugging
window.portfolio = {
    app: () => window.app,
    config: () => window.config,
    utils: () => window.utils,
    debug: () => window.app?.debug(),
    version: '1.0.0'
};

console.log('🎨 Amit Barai Portfolio v1.0.0 - Built with modern web technologies');
