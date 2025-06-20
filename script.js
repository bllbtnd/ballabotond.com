document.addEventListener('DOMContentLoaded', function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const contentContainer = document.querySelector('.container');
    
    // Initialize stories
    const storiesViewer = new StoriesViewer();
    
    // Start time to ensure minimum loading duration
    const startTime = Date.now();
    const minLoadTime = 1500; // Minimum loading time in ms
    
    // Function to hide loading overlay with minimum duration
    function hideLoadingOverlay() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);
        
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            contentContainer.classList.add('loaded');
            
            // Force social links to be visible
            document.querySelectorAll('.social-link').forEach(link => {
                link.style.opacity = '1';
            });
            
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
            // Use saved preference if available
            setTheme(savedTheme);
        } else {
            // Otherwise use OS preference
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
        // Only auto-change if user hasn't set a preference
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
    
    // Track loading states
    let locationLoaded = false;
    
    // Handle name and bio display based on location
    function setNameBasedOnLocation() {
        const nameDisplay = document.getElementById('name-display');
        nameDisplay.classList.add('loading');
        
        // Language toggle functionality
        const languageToggle = document.getElementById('language-toggle');
        
        // Function to set language
        function setLanguage(lang) {
            const primaryName = document.getElementById('primary-name');
            const alternateName = document.getElementById('alternate-name');
            const primaryBio = document.getElementById('primary-bio');
            const alternateBio = document.getElementById('alternate-bio');
            
            // Update the language toggle to show the opposite language
            function updateLanguageToggleText(lang) {
                const langIndicator = document.querySelector('.language-toggle .lang-indicator');
                if (langIndicator) {
                    // If current language is Hungarian (hu), show EN as the option
                    // If current language is English (en), show HU as the option
                    langIndicator.textContent = lang === 'hu' ? 'EN' : 'HU';
                }
            }
            
            if (lang === 'hu') {
                primaryName.textContent = 'Balla Botond';
                alternateName.textContent = 'Botond Balla';
                document.title = 'Balla Botond';
                
                if (primaryBio) primaryBio.style.display = 'none';
                if (alternateBio) alternateBio.style.display = 'block';
                
                document.documentElement.setAttribute('data-language', 'hu');
                updateLanguageToggleText('hu');
            } else {
                primaryName.textContent = 'Botond Balla';
                alternateName.textContent = 'Balla Botond';
                document.title = 'Botond Balla';
                
                if (primaryBio) primaryBio.style.display = 'block';
                if (alternateBio) alternateBio.style.display = 'none';
                
                document.documentElement.setAttribute('data-language', 'en');
                updateLanguageToggleText('en');
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
        
        // Use IP-based geolocation API if no user preference exists
        if (!userLanguage) {
            fetch('https://ipapi.co/json/')
                .then(response => response.json())
                .then(data => {
                    // If the user is in Hungary, display Hungarian name format and bio
                    if (data.country_code === 'HU') {
                        setLanguage('hu');
                    } else {
                        setLanguage('en');
                    }
                    
                    // Show the name with a fade-in effect once it's ready
                    setTimeout(() => {
                        nameDisplay.classList.remove('loading');
                        nameDisplay.classList.add('loaded');
                    }, 100);
                    
                    // Mark location as loaded
                    locationLoaded = true;
                    
                    // Check if all content is loaded
                    if (locationLoaded) {
                        hideLoadingOverlay();
                    }
                })
                .catch(error => {
                    console.error('Error detecting location:', error);
                    // Default to international format if there's an error
                    primaryName.textContent = 'Botond Balla';
                    alternateName.textContent = 'Balla Botond';
                    document.title = 'Botond Balla';
                    
                    // Default to English bio
                    if (primaryBio) primaryBio.style.display = 'block';
                    if (alternateBio) alternateBio.style.display = 'none';
                    
                    // Show the name even in case of error
                    setTimeout(() => {
                        nameDisplay.classList.remove('loading');
                        nameDisplay.classList.add('loaded');
                    }, 100);
                    
                    // Mark location as loaded even in case of error
                    locationLoaded = true;
                    
                    // Check if all content is loaded
                    if (locationLoaded) {
                        hideLoadingOverlay();
                    }
                });
        } else {
            // Use user's stored language preference
            setLanguage(userLanguage);
            
            // Show the name with a fade-in effect
            setTimeout(() => {
                nameDisplay.classList.remove('loading');
                nameDisplay.classList.add('loaded');
            }, 100);
            
            // Mark location loaded
            locationLoaded = true;
            
            // Check if all content is loaded
            if (locationLoaded) {
                hideLoadingOverlay();
            }
        }
    }
    
    // Call the function to set name based on location
    setNameBasedOnLocation();
    
    // More aggressive fallback in case something fails
    setTimeout(() => {
        if (!locationLoaded) {
            locationLoaded = true;
            hideLoadingOverlay();
            
            // Show default name if location failed
            const nameDisplay = document.getElementById('name-display');
            if (nameDisplay.classList.contains('loading')) {
                nameDisplay.classList.remove('loading');
                nameDisplay.classList.add('loaded');
            }
            
            // Force social links to be visible after delay
            document.querySelectorAll('.social-link').forEach(link => {
                link.style.opacity = '1';
            });
        }
    }, 3000); // Reduce fallback time from 5s to 3s for better user experience
    
    // Add subtle hover effect to social links
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Create a ripple effect when clicked
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for the alternate bio
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .alternate-bio {
                display: none;
            }
        </style>
    `);
});

// Stories functionality
class StoriesViewer {
    constructor() {
        this.stories = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.timer = null;
        this.progressInterval = null;
        this.storyDuration = 5000; // 5 seconds
        this.progressUpdateInterval = 50; // Update progress every 50ms
        
        this.modal = document.getElementById('stories-modal');
        this.currentStoryImg = document.getElementById('current-story');
        this.closeBtn = document.getElementById('stories-close');
        this.prevArea = document.getElementById('story-prev');
        this.nextArea = document.getElementById('story-next');
        this.progressBarsContainer = document.querySelector('.story-progress-bars');
        this.profileImage = document.getElementById('profile-image');
        
        this.init();
    }
    
    async init() {
        await this.loadStories();
        this.setupEventListeners();
        this.updateProfileImage();
    }
    
    async loadStories() {
        // In a real implementation, you would fetch this from an API
        // For now, we'll simulate loading stories from the stories folder
        const storyFiles = [
            'story1.svg',
            'story2.svg', 
            'story3.svg'
        ];
        
        // Filter out any files that don't exist and sort by creation date (newest first)
        this.stories = [];
        for (const file of storyFiles) {
            try {
                // Try to load the image to see if it exists
                const img = new Image();
                img.src = `src/stories/${file}`;
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    // Set a timeout to avoid hanging
                    setTimeout(reject, 2000);
                });
                this.stories.push({
                    src: `src/stories/${file}`,
                    filename: file
                });
            } catch (e) {
                console.log(`Story ${file} not found or failed to load`);
            }
        }
        
        // Sort stories by filename (assuming newer files have higher numbers)
        this.stories.sort((a, b) => b.filename.localeCompare(a.filename));
    }
    
    updateProfileImage() {
        // Keep original appearance - no visual changes to indicate stories
        // Stories are activated by clicking the profile image
    }
    
    setupEventListeners() {
        // Profile image click to open stories
        this.profileImage.addEventListener('click', () => {
            if (this.stories.length > 0) {
                this.openStories();
            }
        });
        
        // Close button
        this.closeBtn.addEventListener('click', () => {
            this.closeStories();
        });
        
        // Navigation areas
        this.prevArea.addEventListener('click', () => {
            this.previousStory();
        });
        
        this.nextArea.addEventListener('click', () => {
            this.nextStory();
        });
        
        // Hold to pause functionality
        let holdTimer;
        const holdEvents = ['mousedown', 'touchstart'];
        const releaseEvents = ['mouseup', 'touchend', 'mouseleave'];
        
        holdEvents.forEach(event => {
            this.currentStoryImg.addEventListener(event, (e) => {
                e.preventDefault();
                holdTimer = setTimeout(() => {
                    this.pauseStory();
                }, 100);
            });
        });
        
        releaseEvents.forEach(event => {
            this.currentStoryImg.addEventListener(event, (e) => {
                e.preventDefault();
                clearTimeout(holdTimer);
                if (!this.isPlaying) {
                    this.playStory();
                }
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.modal.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        this.closeStories();
                        break;
                    case 'ArrowLeft':
                        this.previousStory();
                        break;
                    case 'ArrowRight':
                        this.nextStory();
                        break;
                    case ' ':
                        e.preventDefault();
                        this.isPlaying ? this.pauseStory() : this.playStory();
                        break;
                }
            }
        });
        
        // Close on background click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeStories();
            }
        });
    }
    
    createProgressBars() {
        this.progressBarsContainer.innerHTML = '';
        this.stories.forEach((_, index) => {
            const progressBar = document.createElement('div');
            progressBar.className = 'story-progress-bar';
            progressBar.innerHTML = '<div class="story-progress-fill"></div>';
            this.progressBarsContainer.appendChild(progressBar);
        });
    }
    
    updateProgressBars() {
        const progressBars = this.progressBarsContainer.querySelectorAll('.story-progress-fill');
        progressBars.forEach((bar, index) => {
            if (index < this.currentIndex) {
                bar.style.width = '100%';
            } else if (index === this.currentIndex) {
                // This will be animated by the progress interval
            } else {
                bar.style.width = '0%';
            }
        });
    }
    
    openStories() {
        if (this.stories.length === 0) return;
        
        this.currentIndex = 0;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.createProgressBars();
        this.showStory(this.currentIndex);
        this.playStory();
    }
    
    closeStories() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.pauseStory();
        this.currentIndex = 0;
    }
    
    showStory(index) {
        if (index < 0 || index >= this.stories.length) return;
        
        this.currentIndex = index;
        this.currentStoryImg.src = this.stories[index].src;
        this.updateProgressBars();
    }
    
    playStory() {
        if (this.stories.length === 0) return;
        
        this.isPlaying = true;
        const currentProgressBar = this.progressBarsContainer.querySelectorAll('.story-progress-fill')[this.currentIndex];
        
        if (currentProgressBar) {
            currentProgressBar.style.transition = 'none';
            currentProgressBar.style.width = '0%';
            
            // Force reflow
            currentProgressBar.offsetHeight;
            
            currentProgressBar.style.transition = `width ${this.storyDuration}ms linear`;
            currentProgressBar.style.width = '100%';
        }
        
        this.timer = setTimeout(() => {
            this.nextStory();
        }, this.storyDuration);
    }
    
    pauseStory() {
        this.isPlaying = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        
        const currentProgressBar = this.progressBarsContainer.querySelectorAll('.story-progress-fill')[this.currentIndex];
        if (currentProgressBar) {
            const computedStyle = window.getComputedStyle(currentProgressBar);
            const currentWidth = computedStyle.width;
            currentProgressBar.style.transition = 'none';
            currentProgressBar.style.width = currentWidth;
        }
    }
    
    nextStory() {
        this.pauseStory();
        
        if (this.currentIndex < this.stories.length - 1) {
            this.showStory(this.currentIndex + 1);
            this.playStory();
        } else {
            this.closeStories();
        }
    }
    
    previousStory() {
        this.pauseStory();
        
        if (this.currentIndex > 0) {
            this.showStory(this.currentIndex - 1);
            this.playStory();
        } else {
            // If at first story, restart it
            this.showStory(0);
            this.playStory();
        }
    }
}
