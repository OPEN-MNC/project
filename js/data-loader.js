// Data loading and management
class DataLoader {
    constructor() {
        this.cache = new Map();
        this.loading = new Set();
        this.baseUrl = './data/';
    }
    
    // Load JSON data with caching
    async loadJSON(filename) {
        // Check cache first
        if (this.cache.has(filename)) {
            return this.cache.get(filename);
        }
        
        // Check if already loading
        if (this.loading.has(filename)) {
            return new Promise((resolve) => {
                const checkLoaded = () => {
                    if (this.cache.has(filename)) {
                        resolve(this.cache.get(filename));
                    } else {
                        setTimeout(checkLoaded, 50);
                    }
                };
                checkLoaded();
            });
        }
        
        this.loading.add(filename);
        
        try {
            const response = await fetch(`${this.baseUrl}${filename}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}: ${response.statusText}`);
            }
            
            const data = await response.json();
            this.cache.set(filename, data);
            this.loading.delete(filename);
            
            return data;
        } catch (error) {
            this.loading.delete(filename);
            console.error(`Error loading ${filename}:`, error);
            throw error;
        }
    }
    
    // Load all data files
    async loadAllData() {
        try {
            const [config, skills, experience, education, projects, services] = await Promise.all([
                this.loadJSON('config.json'),
                this.loadJSON('skills.json'),
                this.loadJSON('experience.json'),
                this.loadJSON('education.json'),
                this.loadJSON('projects.json'),
                this.loadJSON('services.json')
            ]);
            
            return {
                config,
                skills,
                experience,
                education,
                projects,
                services
            };
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }
    
    // Get cached data
    getCachedData(filename) {
        return this.cache.get(filename);
    }
    
    // Clear cache
    clearCache() {
        this.cache.clear();
    }
    
    // Preload images
    async preloadImages(urls) {
        const promises = urls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(url);
                img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
                img.src = url;
            });
        });
        
        try {
            return await Promise.all(promises);
        } catch (error) {
            console.warn('Some images failed to preload:', error);
            return [];
        }
    }
}

// Content renderer
class ContentRenderer {
    constructor(dataLoader) {
        this.dataLoader = dataLoader;
        this.data = null;
    }
    
    // Initialize with data
    async init() {
        try {
            this.data = await this.dataLoader.loadAllData();
            this.updateDynamicContent();
            this.renderSkills();
            this.renderExperience();
            this.renderEducation();
            this.renderProjects();
            this.renderServices();
            return true;
        } catch (error) {
            console.error('Failed to initialize content renderer:', error);
            return false;
        }
    }
    
    // Update dynamic content (years of experience, etc.)
    updateDynamicContent() {
        if (!this.data?.config?.personal?.startDate) return;
        
        const yearsExp = window.config.calculateExperience(this.data.config.personal.startDate);
        
        // Update years of experience
        const experienceElements = document.querySelectorAll('#years-experience, #experience-years, #experience-badge');
        experienceElements.forEach(el => {
            el.textContent = `${yearsExp}+`;
        });
        
        // Update project count
        const projectCount = this.data?.projects?.statistics?.totalProjects || 4;
        const projectElements = document.querySelectorAll('#projects-count');
        projectElements.forEach(el => {
            el.textContent = `${projectCount}+`;
        });
        
        // Update current year
        const currentYear = new Date().getFullYear();
        const yearElements = document.querySelectorAll('#current-year');
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
        
        // Update personal info
        if (this.data.config?.personal) {
            const personal = this.data.config.personal;
            
            // Update hero content
            const heroName = document.querySelector('#hero-name');
            const heroRole = document.querySelector('#hero-role');
            const heroDescription = document.querySelector('#hero-description');
            
            if (heroName) heroName.textContent = personal.name;
            if (heroRole) heroRole.textContent = personal.title;
            if (heroDescription) {
                heroDescription.innerHTML = personal.description.replace(
                    /(\d+\+?\s*years?)/gi,
                    `<span id="years-experience">${yearsExp}+</span> years`
                );
            }
            
            // Update about section
            const aboutDescription = document.querySelector('#about-description');
            if (aboutDescription) {
                aboutDescription.textContent = personal.description;
            }
            
            // Update contact details
            const locationEl = document.querySelector('#location');
            const emailEl = document.querySelector('#email');
            const phoneEl = document.querySelector('#phone');
            const linkedinEl = document.querySelector('#linkedin');
            
            if (locationEl) locationEl.textContent = personal.location;
            if (emailEl) {
                emailEl.textContent = personal.email;
                emailEl.href = `mailto:${personal.email}`;
            }
            if (phoneEl) {
                phoneEl.textContent = personal.phone;
                phoneEl.href = `tel:${personal.phone}`;
            }
            if (linkedinEl) {
                linkedinEl.textContent = 'linkedin.com/in/amit-barai-developer';
                linkedinEl.href = personal.linkedin;
            }
        }
    }
    
    // Render skills section
    renderSkills() {
        const skillsContainer = document.querySelector('#skills-content');
        if (!skillsContainer || !this.data?.skills?.categories) return;
        
        skillsContainer.innerHTML = '';
        
        this.data.skills.categories.forEach((category, index) => {
            const categoryElement = this.createSkillCategory(category);
            categoryElement.classList.add('scroll-animate');
            categoryElement.style.animationDelay = `${index * 0.1}s`;
            skillsContainer.appendChild(categoryElement);
        });
    }
    
    createSkillCategory(category) {
        const categoryDiv = utils.createElement('div', { className: 'skill-category' });
        
        // Category header
        const header = utils.createElement('div', { className: 'category-header' });
        const icon = utils.createElement('div', { 
            className: 'category-icon',
            textContent: category.icon 
        });
        const title = utils.createElement('h3', { 
            className: 'category-title',
            textContent: category.name 
        });
        
        header.appendChild(icon);
        header.appendChild(title);
        categoryDiv.appendChild(header);
        
        // Skills grid
        const skillsGrid = utils.createElement('div', { className: 'skills-grid' });
        
        category.skills.forEach(skill => {
            const skillItem = this.createSkillItem(skill);
            skillsGrid.appendChild(skillItem);
        });
        
        categoryDiv.appendChild(skillsGrid);
        return categoryDiv;
    }
    
    createSkillItem(skill) {
        const skillDiv = utils.createElement('div', { className: 'skill-item' });
        
        // Skill header
        const header = utils.createElement('div', { className: 'skill-header' });
        const name = utils.createElement('span', { 
            className: 'skill-name',
            textContent: skill.name 
        });
        const level = utils.createElement('span', { 
            className: 'skill-level',
            textContent: `${skill.level}%` 
        });
        
        header.appendChild(name);
        header.appendChild(level);
        skillDiv.appendChild(header);
        
        // Skill bar
        const skillBar = utils.createElement('div', { className: 'skill-bar' });
        const skillProgress = utils.createElement('div', { 
            className: 'skill-progress',
            'data-level': skill.level
        });
        
        skillBar.appendChild(skillProgress);
        skillDiv.appendChild(skillBar);
        
        // Skill description
        if (skill.description) {
            const description = utils.createElement('p', { 
                className: 'skill-description',
                textContent: skill.description 
            });
            skillDiv.appendChild(description);
        }
        
        return skillDiv;
    }
    
    // Render experience section
    renderExperience() {
        const experienceContainer = document.querySelector('#experience-timeline');
        if (!experienceContainer || !this.data?.experience?.experiences) return;
        
        experienceContainer.innerHTML = '';
        
        this.data.experience.experiences.forEach((exp, index) => {
            const expElement = this.createExperienceItem(exp, index);
            experienceContainer.appendChild(expElement);
        });
    }
    
    createExperienceItem(experience, index) {
        const expDiv = utils.createElement('div', { className: 'experience-item scroll-animate' });
        expDiv.style.animationDelay = `${index * 0.2}s`;
        
        // Experience content
        const content = utils.createElement('div', { className: 'experience-content' });
        
        // Company header
        const header = utils.createElement('div', { className: 'company-header' });
        const icon = utils.createElement('div', { className: 'company-icon' });
        icon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
        `;
        
        const info = utils.createElement('div', { className: 'company-info' });
        const position = utils.createElement('h3', { textContent: experience.position });
        const company = utils.createElement('div', { 
            className: 'company-name',
            textContent: experience.company 
        });
        const period = utils.createElement('div', { 
            className: 'job-period',
            textContent: this.formatExperiencePeriod(experience) 
        });
        
        info.appendChild(position);
        info.appendChild(company);
        info.appendChild(period);
        
        header.appendChild(icon);
        header.appendChild(info);
        content.appendChild(header);
        
        // Job description
        if (experience.description) {
            const description = utils.createElement('p', { 
                className: 'job-description',
                textContent: experience.description 
            });
            content.appendChild(description);
        }
        
        // Responsibilities
        if (experience.responsibilities?.length) {
            const responsibilities = utils.createElement('ul', { className: 'responsibilities' });
            experience.responsibilities.forEach(resp => {
                const li = utils.createElement('li', { textContent: resp });
                responsibilities.appendChild(li);
            });
            content.appendChild(responsibilities);
        }
        
        // Technologies
        if (experience.technologies?.length) {
            const techTags = utils.createElement('div', { className: 'tech-tags' });
            experience.technologies.forEach(tech => {
                const tag = utils.createElement('span', { 
                    className: 'tech-tag',
                    textContent: tech 
                });
                techTags.appendChild(tag);
            });
            content.appendChild(techTags);
        }
        
        // Experience dot
        const dot = utils.createElement('div', { className: 'experience-dot' });
        
        expDiv.appendChild(content);
        expDiv.appendChild(dot);
        
        return expDiv;
    }
    
    formatExperiencePeriod(experience) {
        const startDate = new Date(experience.startDate);
        const endDate = experience.current ? new Date() : new Date(experience.endDate);
        
        const startMonth = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const endMonth = experience.current ? 'Present' : endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        return `${startMonth} - ${endMonth}`;
    }
    
    // Render education section
    renderEducation() {
        const educationContainer = document.querySelector('#education-content');
        if (!educationContainer || !this.data?.education?.education) return;
        
        educationContainer.innerHTML = '';
        
        this.data.education.education.forEach((edu, index) => {
            const eduElement = this.createEducationItem(edu, index);
            educationContainer.appendChild(eduElement);
        });
    }
    
    createEducationItem(education, index) {
        const eduDiv = utils.createElement('div', { className: 'education-item scroll-animate' });
        eduDiv.style.animationDelay = `${index * 0.2}s`;
        
        // Education header
        const header = utils.createElement('div', { className: 'education-header' });
        const icon = utils.createElement('div', { className: 'education-icon' });
        icon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
        `;
        
        const info = utils.createElement('div', { className: 'education-info' });
        const degree = utils.createElement('h3', { textContent: education.degree });
        const institution = utils.createElement('div', { 
            className: 'institution-name',
            textContent: education.institution 
        });
        const period = utils.createElement('div', { 
            className: 'education-period',
            textContent: this.formatEducationPeriod(education) 
        });
        
        info.appendChild(degree);
        info.appendChild(institution);
        info.appendChild(period);
        
        header.appendChild(icon);
        header.appendChild(info);
        eduDiv.appendChild(header);
        
        // Education description
        if (education.description) {
            const description = utils.createElement('p', { 
                className: 'education-description',
                textContent: education.description 
            });
            eduDiv.appendChild(description);
        }
        
        // Coursework
        if (education.coursework?.length) {
            const coursework = utils.createElement('div', { className: 'coursework' });
            const title = utils.createElement('h4', { textContent: 'Key Coursework' });
            const list = utils.createElement('div', { className: 'coursework-list' });
            
            education.coursework.forEach(course => {
                const item = utils.createElement('div', { 
                    className: 'coursework-item',
                    textContent: course 
                });
                list.appendChild(item);
            });
            
            coursework.appendChild(title);
            coursework.appendChild(list);
            eduDiv.appendChild(coursework);
        }
        
        return eduDiv;
    }
    
    formatEducationPeriod(education) {
        const startYear = new Date(education.startDate).getFullYear();
        const endYear = education.current ? 'Present' : new Date(education.endDate).getFullYear();
        
        return `${startYear} - ${endYear}`;
    }
    
    // Render projects section
    renderProjects() {
        const projectsContainer = document.querySelector('#projects-grid');
        if (!projectsContainer || !this.data?.projects?.projects) return;
        
        projectsContainer.innerHTML = '';
        
        this.data.projects.projects.forEach((project, index) => {
            const projectElement = this.createProjectCard(project, index);
            projectsContainer.appendChild(projectElement);
        });
    }
    
    createProjectCard(project, index) {
        const cardDiv = utils.createElement('div', { 
            className: 'project-card scroll-animate',
            'data-category': project.category
        });
        cardDiv.style.animationDelay = `${index * 0.1}s`;
        
        // Project image
        const imageDiv = utils.createElement('div', { className: 'project-image' });
        const img = utils.createElement('img', { 
            src: project.image,
            alt: project.title,
            loading: 'lazy'
        });
        
        // Project overlay with links
        const overlay = utils.createElement('div', { className: 'project-overlay' });
        const links = utils.createElement('div', { className: 'project-links' });
        
        if (project.links?.playStore) {
            const playStoreLink = utils.createElement('a', { 
                href: project.links.playStore,
                className: 'project-link',
                target: '_blank',
                rel: 'noopener noreferrer',
                'aria-label': 'View on Play Store'
            });
            playStoreLink.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
            `;
            links.appendChild(playStoreLink);
        }
        
        if (project.links?.appStore) {
            const appStoreLink = utils.createElement('a', { 
                href: project.links.appStore,
                className: 'project-link',
                target: '_blank',
                rel: 'noopener noreferrer',
                'aria-label': 'View on App Store'
            });
            appStoreLink.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.19 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                </svg>
            `;
            links.appendChild(appStoreLink);
        }
        
        overlay.appendChild(links);
        imageDiv.appendChild(img);
        imageDiv.appendChild(overlay);
        cardDiv.appendChild(imageDiv);
        
        // Project content
        const content = utils.createElement('div', { className: 'project-content' });
        
        // Project header
        const header = utils.createElement('div', { className: 'project-header' });
        const title = utils.createElement('h3', { 
            className: 'project-title',
            textContent: project.title 
        });
        const type = utils.createElement('div', { 
            className: 'project-type',
            textContent: project.type 
        });
        
        header.appendChild(title);
        header.appendChild(type);
        content.appendChild(header);
        
        // Project description
        const description = utils.createElement('p', { 
            className: 'project-description',
            textContent: project.description 
        });
        content.appendChild(description);
        
        // Technologies
        if (project.technologies?.length) {
            const techDiv = utils.createElement('div', { className: 'project-tech' });
            project.technologies.forEach(tech => {
                const badge = utils.createElement('span', { 
                    className: 'tech-badge',
                    textContent: tech 
                });
                techDiv.appendChild(badge);
            });
            content.appendChild(techDiv);
        }
        
        // Platforms
        if (project.platforms?.length) {
            const platformsDiv = utils.createElement('div', { className: 'project-platforms' });
            project.platforms.forEach(platform => {
                const badge = utils.createElement('span', { 
                    className: 'platform-badge',
                    textContent: platform 
                });
                platformsDiv.appendChild(badge);
            });
            content.appendChild(platformsDiv);
        }
        
        cardDiv.appendChild(content);
        return cardDiv;
    }
    
    // Render services section
    renderServices() {
        const servicesContainer = document.querySelector('#services-grid');
        if (!servicesContainer || !this.data?.services?.services) return;
        
        servicesContainer.innerHTML = '';
        
        this.data.services.services.forEach((service, index) => {
            const serviceElement = this.createServiceCard(service, index);
            servicesContainer.appendChild(serviceElement);
        });
    }
    
    createServiceCard(service, index) {
        const cardDiv = utils.createElement('div', { className: 'service-card scroll-animate' });
        cardDiv.style.animationDelay = `${index * 0.1}s`;
        
        // Service header
        const header = utils.createElement('div', { className: 'service-header' });
        const icon = utils.createElement('div', { 
            className: 'service-icon',
            textContent: service.icon 
        });
        
        const info = utils.createElement('div', { className: 'service-info' });
        const title = utils.createElement('h3', { textContent: service.title });
        const price = utils.createElement('div', { 
            className: 'service-price',
            textContent: `Starting at $${service.price.starting}` 
        });
        
        info.appendChild(title);
        info.appendChild(price);
        
        header.appendChild(icon);
        header.appendChild(info);
        cardDiv.appendChild(header);
        
        // Service description
        const description = utils.createElement('p', { 
            className: 'service-description',
            textContent: service.description 
        });
        cardDiv.appendChild(description);
        
        // Service features
        if (service.features?.length) {
            const features = utils.createElement('ul', { className: 'service-features' });
            service.features.slice(0, 5).forEach(feature => {
                const li = utils.createElement('li', { textContent: feature });
                features.appendChild(li);
            });
            cardDiv.appendChild(features);
        }
        
        // CTA button
        const cta = utils.createElement('div', { className: 'service-cta' });
        const button = utils.createElement('a', { 
            href: '#contact',
            className: 'btn btn-primary',
            textContent: 'Get Started'
        });
        cta.appendChild(button);
        cardDiv.appendChild(cta);
        
        return cardDiv;
    }
}

// Initialize data loader and content renderer
window.dataLoader = new DataLoader();
window.contentRenderer = new ContentRenderer(window.dataLoader);

// Export for use in other modules
window.DataLoader = DataLoader;
window.ContentRenderer = ContentRenderer;