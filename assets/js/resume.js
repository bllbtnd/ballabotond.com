document.addEventListener('DOMContentLoaded', function() {
    // Handle loading overlay for resume page
    const loadingOverlay = document.getElementById('loading-overlay');
    const contentContainer = document.querySelector('.container');
    
    // Hide loading overlay after a short delay
    setTimeout(() => {
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
            if (contentContainer) {
                contentContainer.classList.add('loaded');
            }
            
            // Remove overlay from DOM after transition completes
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
            }, 600);
        }
    }, 1000);
    
    // PDF Download functionality
    const downloadPdfButton = document.getElementById('download-pdf');
    
    if (downloadPdfButton) {
        downloadPdfButton.addEventListener('click', function() {
            // Track the download event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download', {
                    'event_category': 'resume',
                    'event_label': 'pdf_download'
                });
            }
            
            // Get current language
            const currentLang = document.documentElement.getAttribute('data-language') || 'en';
            const isHungarian = currentLang === 'hu';
            
            // Set document title for PDF
            const originalTitle = document.title;
            document.title = isHungarian ? 'Balla Botond - Szakmai Önéletrajz' : 'Botond Balla - Professional Resume';
            
            // Prepare for printing
            const body = document.body;
            const resumeContent = document.getElementById('resume-content');
            
            // Add print-specific class
            body.classList.add('printing');
            
            // Use browser's print dialog which can save as PDF
            window.print();
            
            // Restore original title after printing
            setTimeout(() => {
                document.title = originalTitle;
                body.classList.remove('printing');
            }, 1000);
        });
    }
    
    // Update page title based on language
    function updatePageTitle() {
        const currentLang = document.documentElement.getAttribute('data-language') || 'en';
        const isHungarian = currentLang === 'hu';
        
        if (isHungarian) {
            document.title = 'Szakmai Önéletrajz | Balla Botond';
        } else {
            document.title = 'Resume | Balla Botond';
        }
    }
    
    // Listen for language changes
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            // Update title after language change
            setTimeout(updatePageTitle, 100);
        });
    }
    
    // Initialize page title
    updatePageTitle();
    
    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add animation classes when elements come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all resume sections
    document.querySelectorAll('.resume-section').forEach(section => {
        observer.observe(section);
    });
    
    // Enhanced print styles
    window.addEventListener('beforeprint', function() {
        // Ensure the correct language content is visible for print
        const currentLang = document.documentElement.getAttribute('data-language') || 'en';
        document.body.setAttribute('data-print-lang', currentLang);
    });
    
    // Add subtle animations
    const style = document.createElement('style');
    style.textContent = `
        .resume-section {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .resume-section.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .skill-tag {
            transition: all 0.3s ease;
        }
        
        .skill-tag:hover {
            transform: translateY(-2px);
        }
        
        .contact-item {
            transition: color 0.3s ease;
        }
        
        .contact-item:hover {
            color: var(--accent-color);
        }
        
        .experience-item,
        .education-item,
        .language-item {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .experience-item:hover,
        .education-item:hover,
        .language-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px var(--shadow-color);
        }
        
        @media print {
            .resume-section {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        }
    `;
    document.head.appendChild(style);
});
