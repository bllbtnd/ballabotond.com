document.addEventListener('DOMContentLoaded', function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const projectsGrid = document.getElementById('projects-grid');
    
    // Start time to ensure minimum loading duration
    const startTime = Date.now();
    const minLoadTime = 1000; // Minimum loading time in ms
    
    // Function to hide loading overlay with minimum duration
    function hideLoadingOverlay() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);
        
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            
            // Remove overlay from DOM after transition completes
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
            }, 600);
        }, remainingTime);
    }
    
    // Theme handling
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Function to set the theme
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
    
    // Function to toggle the theme
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }
    
    // Initialize theme
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            if (prefersDarkScheme.matches) {
                setTheme('dark');
            } else {
                setTheme('light');
            }
        }
    }
    
    // Set up event listeners
    themeToggle.addEventListener('click', toggleTheme);
    
    // Listen for OS theme changes
    prefersDarkScheme.addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                setTheme('dark');
            } else {
                setTheme('light');
            }
        }
    });
    
    // Initialize theme on load
    initializeTheme();
    
    // Language handling
    const languageToggle = document.getElementById('language-toggle');
    
    function setLanguage(lang) {
        document.documentElement.setAttribute('data-language', lang);
        localStorage.setItem('language', lang);
        
        // Update title
        if (lang === 'hu') {
            document.title = 'Projektek | Balla Botond';
        } else {
            document.title = 'Projects | Botond Balla';
        }
    }
    
    // Add language toggle event listener
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            const currentLang = document.documentElement.getAttribute('data-language') || 'en';
            setLanguage(currentLang === 'en' ? 'hu' : 'en');
        });
    }
    
    // Initialize language
    let languageLoaded = false;
    let projectsLoaded = false;
    
    function checkAllLoaded() {
        if (languageLoaded && projectsLoaded) {
            hideLoadingOverlay();
        }
    }
    
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        setLanguage(savedLanguage);
        languageLoaded = true;
        checkAllLoaded();
    } else {
        // Try to detect from IP or default to English
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                setLanguage(data.country_code === 'HU' ? 'hu' : 'en');
                languageLoaded = true;
                checkAllLoaded();
            })
            .catch(() => {
                setLanguage('en');
                languageLoaded = true;
                checkAllLoaded();
            });
    }
    
    // Projects rendering
    function renderProjects() {
        if (typeof window.PROJECTS_CONFIG === 'undefined') {
            console.error('Projects configuration not loaded');
            return;
        }
        
        projectsGrid.innerHTML = '';
        
        window.PROJECTS_CONFIG.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.style.animationDelay = `${index * 0.1}s`;
            
            const statusClass = project.status.toLowerCase().replace(' ', '-');
            
            projectCard.innerHTML = `
                <div class="project-icon">
                    <i class="${project.icon}"></i>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.name}</h3>
                    <div class="project-category">
                        <span class="category-en">${project.category.en}</span>
                        <span class="category-hu">${project.category.hu}</span>
                    </div>
                    <p class="project-description">
                        <span class="desc-en">${project.description.en}</span>
                        <span class="desc-hu">${project.description.hu}</span>
                    </p>
                    <div class="project-status status-${statusClass}">
                        <span class="status-en">${project.status}</span>
                        <span class="status-hu">${project.statusHu || project.status}</span>
                    </div>
                    ${project.url ? `<a href="${project.url}" class="project-link" ${project.external ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                        ${project.linkText || 'Visit'}
                    </a>` : ''}
                </div>
            `;
            
            projectsGrid.appendChild(projectCard);
        });
        
        // Add click tracking
        projectsGrid.querySelectorAll('.project-link').forEach(link => {
            link.addEventListener('click', function() {
                const projectName = this.closest('.project-card').querySelector('.project-title').textContent;
                gtag('event', 'click', {
                    'event_category': 'projects',
                    'event_label': projectName
                });
            });
        });
    }
    
    // Load projects when config is ready
    if (typeof window.PROJECTS_CONFIG !== 'undefined') {
        renderProjects();
        projectsLoaded = true;
        checkAllLoaded();
    } else {
        // Wait for config to load
        const checkConfig = setInterval(() => {
            if (typeof window.PROJECTS_CONFIG !== 'undefined') {
                clearInterval(checkConfig);
                renderProjects();
                projectsLoaded = true;
                checkAllLoaded();
            }
        }, 100);
        
        // Fallback timeout
        setTimeout(() => {
            clearInterval(checkConfig);
            projectsLoaded = true;
            checkAllLoaded();
        }, 3000);
    }
});
