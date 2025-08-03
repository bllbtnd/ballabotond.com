document.addEventListener('DOMContentLoaded', function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const contentContainer = document.querySelector('.container');
    
    // Start time to ensure minimum loading duration
    const startTime = Date.now();
    const minLoadTime = 800;
    
    // Function to hide loading overlay
    function hideLoadingOverlay() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);
        
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            contentContainer.classList.add('loaded');
            
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
            }, 600);
        }, remainingTime);
    }
    
    // Language handling
    const languageToggle = document.getElementById('language-toggle');
    let currentLanguage = 'en';
    
    function setLanguage(lang) {
        currentLanguage = lang;
        document.documentElement.setAttribute('data-language', lang);
        
        document.title = lang === 'hu' ? 'Projektek | Balla Botond' : 'Projects | Balla Botond';
        localStorage.setItem('language', lang);
        
        // Regenerate projects with new language
        generateProjects();
    }
    
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            setLanguage(currentLanguage === 'en' ? 'hu' : 'en');
        });
    }
    
    // Initialize language
    const userLanguage = localStorage.getItem('language');
    if (userLanguage) {
        setLanguage(userLanguage);
        // Generate projects immediately since language is set
        setTimeout(() => {
            generateProjects();
            hideLoadingOverlay();
        }, 100);
    } else {
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                setLanguage(data.country_code === 'HU' ? 'hu' : 'en');
                // Generate projects after language is set
                setTimeout(() => {
                    generateProjects();
                    hideLoadingOverlay();
                }, 100);
            })
            .catch(() => {
                setLanguage('en');
                // Generate projects after language is set
                setTimeout(() => {
                    generateProjects();
                    hideLoadingOverlay();
                }, 100);
            });
    }
    
    // Profile image home navigation functionality
    const profileHomeLink = document.getElementById('profile-home-link');
    if (profileHomeLink) {
        profileHomeLink.addEventListener('click', function() {
            gtag('event', 'click', { 'event_category': 'navigation', 'event_label': 'home_from_projects' });
            window.location.href = '/';
        });
    }
    
    // Project generation
    function generateProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid || !window.PROJECTS_CONFIG) return;
        
        // Clear existing content
        projectsGrid.innerHTML = '';
        
        // Group projects by category
        const categories = {};
        window.PROJECTS_CONFIG.forEach(project => {
            if (!project.enabled) return;
            
            const categoryName = project.category[currentLanguage] || project.category.en;
            if (!categories[categoryName]) {
                categories[categoryName] = [];
            }
            categories[categoryName].push(project);
        });
        
        // Generate HTML for each category
        let animationDelay = 0.1;
        Object.entries(categories).forEach(([categoryName, projects]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'project-category';
            categoryDiv.style.animationDelay = `${animationDelay}s`;
            animationDelay += 0.1;
            
            // Category header
            const categoryHeader = document.createElement('h2');
            categoryHeader.textContent = categoryName;
            categoryDiv.appendChild(categoryHeader);
            
            // Project links container
            const projectLinksDiv = document.createElement('div');
            projectLinksDiv.className = 'project-links';
            
            // Generate each project card
            projects.forEach(project => {
                const projectCard = createProjectCard(project);
                projectLinksDiv.appendChild(projectCard);
            });
            
            categoryDiv.appendChild(projectLinksDiv);
            projectsGrid.appendChild(categoryDiv);
        });
        
        // Add event listeners to new project cards
        addProjectEventListeners();
    }
    
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        // Determine if the project should be disabled
        const isDisabled = project.status === 'coming-soon' || project.status === 'maintenance';
        if (isDisabled) {
            card.classList.add('disabled');
        }
        
        // Project image (optional)
        let imageHTML = '';
        if (project.image) {
            imageHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title[currentLanguage] || project.title.en}" loading="lazy">
                </div>
            `;
        }
        
        // Status configuration
        const statusConfig = window.STATUS_CONFIG[project.status] || window.STATUS_CONFIG['coming-soon'];
        const statusText = statusConfig[currentLanguage] || statusConfig.en;
        
        card.innerHTML = `
            ${imageHTML}
            <div class="project-content">
                <div class="project-header">
                    <div class="project-icon">
                        <i class="${project.icon}"></i>
                    </div>
                    <div class="project-info">
                        <h3 class="project-title">${project.title[currentLanguage] || project.title.en}</h3>
                        <p class="project-description">${project.description[currentLanguage] || project.description.en}</p>
                    </div>
                </div>
                <div class="project-footer">
                    <span class="project-status ${statusConfig.class}" style="--status-color: ${statusConfig.color}">
                        ${statusText}
                    </span>
                    <button class="project-button ${isDisabled ? 'disabled' : ''}" 
                            data-url="${project.url}" 
                            data-project-id="${project.id}"
                            data-copy-to-clipboard="${project.copyToClipboard || false}"
                            ${isDisabled ? 'disabled' : ''}>
                        ${project.buttonText[currentLanguage] || project.buttonText.en}
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    function addProjectEventListeners() {
        const projectButtons = document.querySelectorAll('.project-button:not(.disabled)');
        
        projectButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const url = this.dataset.url;
                const projectId = this.dataset.projectId;
                const copyToClipboard = this.dataset.copyToClipboard === 'true';
                
                // Analytics tracking
                gtag('event', 'click', { 
                    'event_category': 'projects', 
                    'event_label': projectId 
                });
                
                // Add ripple effect
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.4);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
                
                // Handle action after animation
                setTimeout(() => {
                    if (copyToClipboard && url) {
                        // Copy to clipboard
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            navigator.clipboard.writeText(url).then(() => {
                                showNotification(getLocalizedText('serverIpCopied', 'Server IP copied to clipboard!'), 'success');
                            }).catch(() => {
                                fallbackCopyToClipboard(url);
                            });
                        } else {
                            fallbackCopyToClipboard(url);
                        }
                    } else if (url && url !== '#') {
                        // Normal navigation
                        if (url.startsWith('http')) {
                            window.open(url, '_blank');
                        } else {
                            window.location.href = url;
                        }
                    }
                }, 200);
            });
        });
        
        // Add hover effects to project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            if (!card.classList.contains('disabled')) {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            }
        });
    }
    
    // Helper function for fallback clipboard functionality
    function fallbackCopyToClipboard(text) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                showNotification(getLocalizedText('serverIpCopied', 'Server IP copied to clipboard!'), 'success');
            } else {
                showNotification(getLocalizedText('copyFailed', 'Failed to copy to clipboard'), 'error');
            }
        } catch (err) {
            showNotification(getLocalizedText('copyFailed', 'Failed to copy to clipboard'), 'error');
        }
    }
    
    // Helper function to show notifications
    function showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#8b1a2a'; // Use burgundy color matching the theme
                break;
            case 'error':
                notification.style.backgroundColor = '#dc3545';
                break;
            default:
                notification.style.backgroundColor = '#007bff';
        }
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Helper function to get localized text
    function getLocalizedText(key, fallback) {
        const currentLanguage = localStorage.getItem('language') || 'en';
        const localizedTexts = {
            serverIpCopied: {
                en: 'Server IP copied to clipboard!',
                hu: 'Szerver IP vágólapra másolva!'
            },
            copyFailed: {
                en: 'Failed to copy to clipboard',
                hu: 'Vágólapra másolás sikertelen'
            }
        };
        
        return localizedTexts[key] && localizedTexts[key][currentLanguage] || fallback;
    }
    
    // Add CSS for ripple animation and project cards
    if (!document.getElementById('dynamic-project-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-project-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
});
