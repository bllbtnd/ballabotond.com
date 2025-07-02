document.addEventListener('DOMContentLoaded', function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const contentContainer = document.querySelector('.container');
    
    // Start time to ensure minimum loading duration
    const startTime = Date.now();
    const minLoadTime = 800; // Shorter loading time for projects page
    
    // Function to hide loading overlay
    function hideLoadingOverlay() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);
        
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            contentContainer.classList.add('loaded');
            
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
    
    // Set up theme event listeners
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
    
    // Function to set language
    function setLanguage(lang) {
        document.documentElement.setAttribute('data-language', lang);
        
        // Update the language toggle to show the opposite language
        const langIndicator = document.querySelector('.language-toggle .lang-indicator');
        if (langIndicator) {
            langIndicator.textContent = lang === 'hu' ? 'EN' : 'HU';
        }
        
        // Update page title
        if (lang === 'hu') {
            document.title = 'Projektek | Balla Botond';
        } else {
            document.title = 'Projects | Balla Botond';
        }
        
        // Store the user's language preference
        localStorage.setItem('language', lang);
    }
    
    // Check for user's language preference
    const userLanguage = localStorage.getItem('language');
    
    // Add language toggle event listener
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            const currentLang = document.documentElement.getAttribute('data-language') || 'en';
            setLanguage(currentLang === 'en' ? 'hu' : 'en');
        });
    }
    
    // Initialize language
    if (userLanguage) {
        setLanguage(userLanguage);
    } else {
        // Use IP-based geolocation for new users
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                if (data.country_code === 'HU') {
                    setLanguage('hu');
                } else {
                    setLanguage('en');
                }
            })
            .catch(error => {
                console.error('Error detecting location:', error);
                setLanguage('en');
            });
    }
    
    // Home button functionality
    const homeButton = document.getElementById('home-button');
    if (homeButton) {
        homeButton.addEventListener('click', function() {
            gtag('event', 'click', { 'event_category': 'navigation', 'event_label': 'home_from_projects' });
            window.location.href = '/';
        });
    }
    
    // Hide loading overlay after everything is set up
    hideLoadingOverlay();
    
    // Add hover effects to project links
    const projectLinks = document.querySelectorAll('.project-link');
    
    projectLinks.forEach(link => {
        // Add ripple effect on click for enabled links
        if (!link.classList.contains('disabled')) {
            link.addEventListener('click', function(e) {
                // Create a ripple effect when clicked
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
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
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        }
        
        // Prevent default action for disabled links
        if (link.classList.contains('disabled')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                return false;
            });
        }
    });
    
    // Add CSS for the ripple animation
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            .project-link {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }
});
