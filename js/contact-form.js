// Contact form handler
class ContactForm {
    constructor() {
        this.form = document.querySelector('#contact-form');
        this.statusElement = document.querySelector('#form-status');
        this.submitButton = null;
        this.originalButtonText = '';
        
        // EmailJS configuration (you'll need to set these up)
        this.emailJSConfig = {
            serviceId: 'your_service_id', // Replace with your EmailJS service ID
            templateId: 'your_template_id', // Replace with your EmailJS template ID
            publicKey: 'your_public_key' // Replace with your EmailJS public key
        };
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.submitButton = this.form.querySelector('button[type="submit"]');
        if (this.submitButton) {
            this.originalButtonText = this.submitButton.textContent;
        }
        
        this.setupEventListeners();
        this.setupValidation();
        this.loadEmailJS();
    }
    
    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }
    
    setupValidation() {
        // Add validation attributes if not present
        const emailInput = this.form.querySelector('input[type="email"]');
        if (emailInput && !emailInput.hasAttribute('pattern')) {
            emailInput.setAttribute('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$');
        }
        
        const requiredFields = this.form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.setAttribute('aria-required', 'true');
        });
    }
    
    async loadEmailJS() {
        try {
            // Load EmailJS library
            if (!window.emailjs) {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
                script.onload = () => {
                    emailjs.init(this.emailJSConfig.publicKey);
                };
                document.head.appendChild(script);
            }
        } catch (error) {
            console.warn('EmailJS not loaded. Form will use fallback method.');
        }
    }
    
    async handleSubmit() {
        if (!this.validateForm()) {
            return;
        }
        
        this.setLoading(true);
        
        try {
            const formData = this.getFormData();
            
            // Try EmailJS first, fallback to mailto
            if (window.emailjs && this.emailJSConfig.serviceId !== 'your_service_id') {
                await this.sendWithEmailJS(formData);
            } else {
                this.sendWithMailto(formData);
            }
            
            this.showStatus('success', 'Thank you! Your message has been sent successfully.');
            this.resetForm();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showStatus('error', 'Sorry, there was an error sending your message. Please try again or contact me directly.');
        } finally {
            this.setLoading(false);
        }
    }
    
    async sendWithEmailJS(formData) {
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_email: 'amitbarai.imt@gmail.com'
        };
        
        const response = await emailjs.send(
            this.emailJSConfig.serviceId,
            this.emailJSConfig.templateId,
            templateParams
        );
        
        if (response.status !== 200) {
            throw new Error('EmailJS send failed');
        }
    }
    
    sendWithMailto(formData) {
        const subject = encodeURIComponent(formData.subject);
        const body = encodeURIComponent(
            `Name: ${formData.name}\n` +
            `Email: ${formData.email}\n\n` +
            `Message:\n${formData.message}`
        );
        
        const mailtoLink = `mailto:amitbarai.imt@gmail.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(field)} is required.`;
        }
        
        // Email validation
        else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }
        
        // Length validation
        else if (value) {
            if (fieldName === 'name' && value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long.';
            } else if (fieldName === 'subject' && value.length < 5) {
                isValid = false;
                errorMessage = 'Subject must be at least 5 characters long.';
            } else if (fieldName === 'message' && value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long.';
            }
        }
        
        this.setFieldError(field, isValid ? '' : errorMessage);
        return isValid;
    }
    
    setFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        // Remove existing error
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error if message provided
        if (message) {
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            errorElement.style.cssText = `
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.25rem;
                display: block;
            `;
            
            formGroup.appendChild(errorElement);
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', `${field.id}-error`);
            errorElement.id = `${field.id}-error`;
        } else {
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
        }
    }
    
    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        const errorElement = formGroup.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
        }
    }
    
    getFieldLabel(field) {
        const label = field.closest('.form-group')?.querySelector('label');
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        return {
            name: formData.get('name')?.trim() || '',
            email: formData.get('email')?.trim() || '',
            subject: formData.get('subject')?.trim() || '',
            message: formData.get('message')?.trim() || ''
        };
    }
    
    setLoading(isLoading) {
        if (!this.submitButton) return;
        
        this.submitButton.disabled = isLoading;
        
        if (isLoading) {
            this.submitButton.innerHTML = `
                <div class="loading-spinner"></div>
                <span>Sending...</span>
            `;
        } else {
            this.submitButton.innerHTML = `
                <span>${this.originalButtonText}</span>
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                </svg>
            `;
        }
    }
    
    showStatus(type, message) {
        if (!this.statusElement) return;
        
        this.statusElement.className = `form-status ${type}`;
        this.statusElement.textContent = message;
        this.statusElement.style.display = 'block';
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                this.hideStatus();
            }, 5000);
        }
        
        // Scroll to status message
        this.statusElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }
    
    hideStatus() {
        if (this.statusElement) {
            this.statusElement.style.display = 'none';
        }
    }
    
    resetForm() {
        this.form.reset();
        
        // Clear any remaining errors
        const errorElements = this.form.querySelectorAll('.field-error');
        errorElements.forEach(error => error.remove());
        
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.removeAttribute('aria-invalid');
            input.removeAttribute('aria-describedby');
        });
    }
    
    // Public methods
    isValid() {
        return this.validateForm();
    }
    
    getData() {
        return this.getFormData();
    }
    
    reset() {
        this.resetForm();
        this.hideStatus();
    }
}

// Auto-resize textarea
class TextareaAutoResize {
    constructor() {
        this.textareas = document.querySelectorAll('textarea');
        this.init();
    }
    
    init() {
        this.textareas.forEach(textarea => {
            this.setupAutoResize(textarea);
        });
    }
    
    setupAutoResize(textarea) {
        // Set initial height
        this.resize(textarea);
        
        // Add event listeners
        textarea.addEventListener('input', () => {
            this.resize(textarea);
        });
        
        textarea.addEventListener('focus', () => {
            this.resize(textarea);
        });
    }
    
    resize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
}

// Form analytics (optional)
class FormAnalytics {
    constructor(contactForm) {
        this.form = contactForm;
        this.startTime = null;
        this.interactions = [];
    }
    
    init() {
        this.trackFormStart();
        this.trackFieldInteractions();
        this.trackFormSubmission();
    }
    
    trackFormStart() {
        const firstInput = this.form.form?.querySelector('input, textarea');
        if (firstInput) {
            firstInput.addEventListener('focus', () => {
                if (!this.startTime) {
                    this.startTime = Date.now();
                    this.logEvent('form_start');
                }
            }, { once: true });
        }
    }
    
    trackFieldInteractions() {
        const fields = this.form.form?.querySelectorAll('input, textarea');
        fields?.forEach(field => {
            field.addEventListener('focus', () => {
                this.logEvent('field_focus', { field: field.name });
            });
            
            field.addEventListener('blur', () => {
                this.logEvent('field_blur', { 
                    field: field.name,
                    hasValue: !!field.value.trim()
                });
            });
        });
    }
    
    trackFormSubmission() {
        this.form.form?.addEventListener('submit', () => {
            const timeSpent = this.startTime ? Date.now() - this.startTime : 0;
            this.logEvent('form_submit', { 
                timeSpent: Math.round(timeSpent / 1000),
                interactions: this.interactions.length
            });
        });
    }
    
    logEvent(event, data = {}) {
        this.interactions.push({
            event,
            timestamp: Date.now(),
            ...data
        });
        
        // Send to analytics service if available
        if (window.gtag) {
            window.gtag('event', event, data);
        }
        
        console.log('Form Analytics:', event, data);
    }
}

// Initialize contact form
document.addEventListener('DOMContentLoaded', () => {
    window.contactForm = new ContactForm();
    window.textareaAutoResize = new TextareaAutoResize();
    
    // Initialize analytics if form exists
    if (window.contactForm.form) {
        window.formAnalytics = new FormAnalytics(window.contactForm);
        window.formAnalytics.init();
    }
});

// Export classes
window.ContactForm = ContactForm;
window.TextareaAutoResize = TextareaAutoResize;
window.FormAnalytics = FormAnalytics;

// Add CSS for form components
const formStyles = `
    .loading-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-left-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 8px;
    }
    
    .field-error {
        animation: shake 0.3s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .form-group input:invalid,
    .form-group textarea:invalid {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .form-group input:valid,
    .form-group textarea:valid {
        border-color: #10b981;
    }
`;

// Inject form styles
const formStyleSheet = document.createElement('style');
formStyleSheet.textContent = formStyles;
document.head.appendChild(formStyleSheet);