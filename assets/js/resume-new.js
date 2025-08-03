document.addEventListener('DOMContentLoaded', function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    console.log('Resume page: DOM loaded, loading overlay element:', loadingOverlay);
    
    // Start time to ensure minimum loading duration
    const startTime = Date.now();
    const minLoadTime = 1000; // Minimum loading time in ms
    let hideLoadingCalled = false; // Prevent multiple calls
    
    // Function to hide loading overlay with minimum duration
    function hideLoadingOverlay() {
        console.log('Resume page: hideLoadingOverlay called');
        
        if (hideLoadingCalled) {
            console.log('Resume page: hideLoadingOverlay already called, skipping');
            return;
        }
        hideLoadingCalled = true;
        
        if (!loadingOverlay) {
            console.error('Resume page: loading overlay element not found!');
            return;
        }
        
        // Check if already hidden
        if (loadingOverlay.classList.contains('hidden')) {
            console.log('Resume page: loading overlay already hidden');
            return;
        }
        
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);
        console.log('Resume page: elapsed time:', elapsedTime, 'remaining time:', remainingTime);
        
        setTimeout(() => {
            console.log('Resume page: adding hidden class to loading overlay');
            loadingOverlay.classList.add('hidden');
            
            // Force styles directly as backup
            loadingOverlay.style.opacity = '0';
            loadingOverlay.style.visibility = 'hidden';
            
            // Force a reflow to ensure the transition starts
            loadingOverlay.offsetHeight;
            
            // Remove overlay from DOM after transition completes
            setTimeout(() => {
                if (loadingOverlay && loadingOverlay.parentNode) {
                    console.log('Resume page: removing loading overlay from DOM');
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
            }, 1000); // Increased timeout to ensure transition completes
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
    
    // Initialize theme on load FIRST (before anything else)
    initializeTheme();
    
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
    
    // Set up event listeners
    themeToggle.addEventListener('click', toggleTheme);
    
    // Language handling
    const languageToggle = document.getElementById('language-toggle');
    
    function setLanguage(lang) {
        document.documentElement.setAttribute('data-language', lang);
        localStorage.setItem('language', lang);
        
        // Update title
        if (lang === 'hu') {
            document.title = 'Szakmai Önéletrajz | Balla Botond';
        } else {
            document.title = 'Resume | Botond Balla';
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
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        console.log('Resume page: using saved language:', savedLanguage);
        setLanguage(savedLanguage);
        // Hide loading overlay after language is set
        hideLoadingOverlay();
    } else {
        console.log('Resume page: detecting language from IP');
        // Try to detect from IP or default to English
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                console.log('Resume page: language detection successful:', data.country_code);
                setLanguage(data.country_code === 'HU' ? 'hu' : 'en');
                // Hide loading overlay after language is detected
                hideLoadingOverlay();
            })
            .catch((error) => {
                console.log('Resume page: language detection failed:', error);
                setLanguage('en');
                // Hide loading overlay even if detection fails
                hideLoadingOverlay();
            });
    }
    
    // PDF Download functionality
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            gtag('event', 'click', {
                'event_category': 'resume',
                'event_label': 'pdf_download'
            });
            
            // Create a print-friendly version
            window.print();
        });
    }
    
    // Home button functionality
    const homeButton = document.getElementById('home-button');
    if (homeButton) {
        homeButton.addEventListener('click', function() {
            window.location.href = '../';
        });
    }
    
    // Fallback timeout in case something goes wrong
    setTimeout(() => {
        hideLoadingOverlay();
    }, 3000);
});

// Print styles
const printStyles = `
    @media print {
        .main-nav,
        .loading-overlay {
            display: none !important;
        }
        
        .hero {
            padding-top: 0 !important;
            min-height: auto !important;
            page-break-after: avoid;
        }
        
        .resume-card {
            break-inside: avoid;
            box-shadow: none !important;
            border: 1px solid #ddd !important;
            margin-bottom: 1rem !important;
            padding: 1.5rem !important;
        }
        
        .resume-card::before {
            display: none !important;
        }
        
        body {
            background: white !important;
            color: black !important;
        }
        
        .tagline,
        .hero-title,
        .hero-subtitle {
            color: black !important;
        }
        
        .section-title {
            color: black !important;
        }
        
        .section-title::after {
            background: #d4af37 !important;
        }
        
        .timeline::before {
            background: #d4af37 !important;
        }
        
        .timeline-marker {
            background: #d4af37 !important;
            box-shadow: 0 0 0 2px #d4af37 !important;
        }
        
        .skill-tag {
            border: 1px solid #d4af37 !important;
            color: #d4af37 !important;
        }
        
        .contact-item i {
            color: #d4af37 !important;
        }
        
        .company {
            color: #d4af37 !important;
        }
        
        .university {
            color: #d4af37 !important;
        }
        
        .profile-image {
            border-color: #d4af37 !important;
        }
    }
`;

// Add print styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = printStyles;
document.head.appendChild(styleSheet);
