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
            
            if (lang === 'hu') {
                primaryName.textContent = 'Balla Botond';
                alternateName.textContent = 'Botond Balla';
                document.title = 'Balla Botond';
                
                if (primaryBio) primaryBio.style.display = 'none';
                if (alternateBio) alternateBio.style.display = 'block';
                
                document.documentElement.setAttribute('data-language', 'hu');
            } else {
                primaryName.textContent = 'Botond Balla';
                alternateName.textContent = 'Balla Botond';
                document.title = 'Botond Balla';
                
                if (primaryBio) primaryBio.style.display = 'block';
                if (alternateBio) alternateBio.style.display = 'none';
                
                document.documentElement.setAttribute('data-language', 'en');
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
        this.storyStartTime = 0; // When the current story started
        this.pausedTime = 0; // How much time was already elapsed when paused
        
        this.modal = document.getElementById('stories-modal');
        this.currentStoryImg = document.getElementById('current-story');
        this.closeBtn = document.getElementById('stories-close');
        this.prevArea = document.getElementById('story-prev');
        this.nextArea = document.getElementById('story-next');
        this.progressBarsContainer = document.querySelector('.story-progress-bars');
        this.storyDateElement = document.getElementById('story-date');
        this.profileImage = document.getElementById('profile-image');
        
        this.init();
    }
    
    async init() {
        this.setupEventListeners();
        this.updateProfileImage();
        
        // Load stories in the background after page is ready
        setTimeout(() => {
            this.loadStories();
        }, 100);
    }
    
    async loadStories() {
        // Get story filenames from the configuration file
        const storyFilenames = window.STORY_FILENAMES || [];
        
        if (storyFilenames.length === 0) {
            return;
        }
        
        // Create story objects immediately without waiting for images to load
        this.stories = storyFilenames.map(filename => ({
            src: `assets/images/stories/${filename}`,
            filename: filename,
            loaded: false,
            loading: false,
            imageElement: null,
            naturalWidth: 0,
            naturalHeight: 0
        }));
        
        // Start loading the first image immediately
        if (this.stories.length > 0) {
            this.preloadImage(0);
        }
        
        // Sort stories by date (newest to oldest), then by image number (highest to lowest)
        this.stories.sort((a, b) => {
            // Extract date and image number from filename (yyyy-mm-dd-n)
            const parseFilename = (filename) => {
                const match = filename.match(/(\d{4})-(\d{2})-(\d{2})-(\d+)/);
                if (match) {
                    const [, year, month, day, imageNum] = match;
                    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    return {
                        date: date,
                        imageNum: parseInt(imageNum),
                        timestamp: date.getTime()
                    };
                }
                return { date: new Date(0), imageNum: 0, timestamp: 0 };
            };
            
            const aInfo = parseFilename(a.filename);
            const bInfo = parseFilename(b.filename);
            
            // First sort by date (newest first)
            if (bInfo.timestamp !== aInfo.timestamp) {
                return bInfo.timestamp - aInfo.timestamp;
            }
            
            // If same date, sort by image number (highest first)
            return bInfo.imageNum - aInfo.imageNum;
        });
    }
    
    extractDateFromFilename(filename) {
        const match = filename.match(/(\d{4})-(\d{2})-(\d{2})-\d+/);
        if (match) {
            const [, year, month, day] = match;
            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            
            // Format the date in a readable way
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            return date.toLocaleDateString('en-US', options);
        }
        return '';
    }

    updateProfileImage() {
        // Keep original appearance - no visual changes to indicate stories
        // Stories are activated by clicking the profile image
    }
    
    applySmartCropping(img) {
        const container = img.parentElement;
        const containerAspectRatio = container.clientWidth / container.clientHeight;
        const imageAspectRatio = img.naturalWidth / img.naturalHeight;
        
        // Reset any previous styling
        img.style.width = '';
        img.style.height = '';
        img.style.objectFit = 'cover';
        img.style.objectPosition = 'center';
        
        if (imageAspectRatio > containerAspectRatio) {
            // Image is wider than container - use 100% height, crop sides
            img.style.height = '100%';
            img.style.width = 'auto';
        } else {
            // Image is taller than container - use 100% width, crop top/bottom
            img.style.width = '100%';
            img.style.height = 'auto';
        }
    }
    
    async preloadImage(index) {
        if (index < 0 || index >= this.stories.length) return;
        
        const story = this.stories[index];
        if (story.loaded || story.loading) return;
        
        story.loading = true;
        
        return new Promise((resolve) => {
            const img = new Image();
            
            img.onload = () => {
                story.loaded = true;
                story.loading = false;
                story.imageElement = img;
                story.naturalWidth = img.naturalWidth;
                story.naturalHeight = img.naturalHeight;
                resolve(true);
            };
            
            img.onerror = () => {
                story.loading = false;
                resolve(false);
            };
            
            img.src = story.src;
        });
    }
    
    preloadAdjacentImages(currentIndex) {
        // Preload next and previous images in background
        const preloadIndexes = [];
        
        // Prioritize next image
        if (currentIndex + 1 < this.stories.length) {
            preloadIndexes.push(currentIndex + 1);
        }
        
        // Then previous image
        if (currentIndex - 1 >= 0) {
            preloadIndexes.push(currentIndex - 1);
        }
        
        // Then next few images
        for (let i = currentIndex + 2; i < Math.min(currentIndex + 4, this.stories.length); i++) {
            preloadIndexes.push(i);
        }
        
        // Load them in background without blocking
        preloadIndexes.forEach(index => {
            setTimeout(() => this.preloadImage(index), 100);
        });
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
        
        // Navigation areas with hold-to-pause functionality
        let holdTimer;
        let isHolding = false;
        const holdEvents = ['mousedown', 'touchstart'];
        const releaseEvents = ['mouseup', 'touchend', 'mouseleave', 'touchcancel'];
        
        // Previous area (left side)
        holdEvents.forEach(event => {
            this.prevArea.addEventListener(event, (e) => {
                e.preventDefault();
                isHolding = true;
                holdTimer = setTimeout(() => {
                    if (isHolding) {
                        this.pauseStory();
                    }
                }, 150); // Slightly longer delay to distinguish from click
            });
        });
        
        releaseEvents.forEach(event => {
            this.prevArea.addEventListener(event, (e) => {
                e.preventDefault();
                if (holdTimer) {
                    clearTimeout(holdTimer);
                }
                
                if (isHolding) {
                    // If it was a short press (not a hold), navigate
                    if (!this.isPlaying) {
                        this.playStory(); // Resume if paused
                    } else {
                        // Short press = navigation
                        setTimeout(() => {
                            this.previousStory();
                        }, 10);
                    }
                }
                isHolding = false;
            });
        });
        
        // Next area (right side)
        holdEvents.forEach(event => {
            this.nextArea.addEventListener(event, (e) => {
                e.preventDefault();
                isHolding = true;
                holdTimer = setTimeout(() => {
                    if (isHolding) {
                        this.pauseStory();
                    }
                }, 150); // Slightly longer delay to distinguish from click
            });
        });
        
        releaseEvents.forEach(event => {
            this.nextArea.addEventListener(event, (e) => {
                e.preventDefault();
                if (holdTimer) {
                    clearTimeout(holdTimer);
                }
                
                if (isHolding) {
                    // If it was a short press (not a hold), navigate
                    if (!this.isPlaying) {
                        this.playStory(); // Resume if paused
                    } else {
                        // Short press = navigation
                        setTimeout(() => {
                            this.nextStory();
                        }, 10);
                    }
                }
                isHolding = false;
            });
        });
        
        // Story image hold-to-pause (center area)
        holdEvents.forEach(event => {
            this.currentStoryImg.addEventListener(event, (e) => {
                e.preventDefault();
                isHolding = true;
                holdTimer = setTimeout(() => {
                    if (isHolding) {
                        this.pauseStory();
                    }
                }, 150);
            });
        });
        
        releaseEvents.forEach(event => {
            this.currentStoryImg.addEventListener(event, (e) => {
                e.preventDefault();
                if (holdTimer) {
                    clearTimeout(holdTimer);
                }
                
                if (isHolding && !this.isPlaying) {
                    this.playStory(); // Resume if paused
                }
                isHolding = false;
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
    
    async openStories() {
        gtag('event', 'click', { 'event_category': 'stories', 'event_label': 'stories_opened' });
        if (this.stories.length === 0) return;
        
        this.currentIndex = 0;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.createProgressBars();
        await this.showStory(this.currentIndex);
        this.playStory();
    }
    
    closeStories() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.pauseStory();
        this.currentIndex = 0;
    }
    
    async showStory(index) {
        if (index < 0 || index >= this.stories.length) return;
        
        this.currentIndex = index;
        const story = this.stories[index];
        
        // Update the story date display
        const formattedDate = this.extractDateFromFilename(story.filename);
        if (this.storyDateElement && formattedDate) {
            this.storyDateElement.textContent = formattedDate;
            this.storyDateElement.style.display = 'block';
        } else if (this.storyDateElement) {
            this.storyDateElement.style.display = 'none';
        }
        
        // Show loading state
        this.currentStoryImg.style.opacity = '0.5';
        this.currentStoryImg.style.filter = 'blur(2px)';
        
        // Ensure current image is loaded
        if (!story.loaded && !story.loading) {
            await this.preloadImage(index);
        }
        
        // Wait for image to be loaded if it's still loading
        if (story.loading) {
            const checkLoaded = () => {
                return new Promise((resolve) => {
                    const check = () => {
                        if (story.loaded || !story.loading) {
                            resolve();
                        } else {
                            setTimeout(check, 50);
                        }
                    };
                    check();
                });
            };
            await checkLoaded();
        }
        
        // Set the image source
        if (story.loaded && story.imageElement) {
            this.currentStoryImg.src = story.imageElement.src;
            
            // Apply smart cropping
            this.currentStoryImg.onload = () => {
                this.applySmartCropping(this.currentStoryImg);
                // Remove loading state
                this.currentStoryImg.style.opacity = '1';
                this.currentStoryImg.style.filter = 'none';
            };
            
            // If image is already loaded, apply immediately
            if (this.currentStoryImg.complete) {
                this.applySmartCropping(this.currentStoryImg);
                this.currentStoryImg.style.opacity = '1';
                this.currentStoryImg.style.filter = 'none';
            }
        } else {
            // Fallback if image failed to load
            this.currentStoryImg.src = story.src;
            this.currentStoryImg.style.opacity = '1';
            this.currentStoryImg.style.filter = 'none';
        }
        
        // Reset timing for new story only
        this.pausedTime = 0;
        this.storyStartTime = 0;
        
        this.updateProgressBars();
        
        // Preload adjacent images in background
        this.preloadAdjacentImages(index);
    }
    
    playStory() {
        if (this.stories.length === 0) return;
        
        this.isPlaying = true;
        this.storyStartTime = Date.now(); // Always update start time when resuming
        
        const currentProgressBar = this.progressBarsContainer.querySelectorAll('.story-progress-fill')[this.currentIndex];
        
        if (currentProgressBar) {
            const remainingTime = Math.max(0, this.storyDuration - this.pausedTime);
            const progressPercentage = (this.pausedTime / this.storyDuration) * 100;
            
            // Set current progress
            currentProgressBar.style.transition = 'none';
            currentProgressBar.style.width = `${progressPercentage}%`;
            
            // Force reflow
            currentProgressBar.offsetHeight;
            
            // Animate remaining progress
            if (remainingTime > 0) {
                currentProgressBar.style.transition = `width ${remainingTime}ms linear`;
                currentProgressBar.style.width = '100%';
                
                this.timer = setTimeout(() => {
                    this.nextStory();
                }, remainingTime);
            } else {
                // Already completed, move to next
                currentProgressBar.style.width = '100%';
                this.nextStory();
            }
        }
    }
    
    pauseStory() {
        this.isPlaying = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        
        // Calculate how much time has elapsed since last resume
        if (this.storyStartTime > 0) {
            const now = Date.now();
            const sessionElapsed = now - this.storyStartTime;
            this.pausedTime = Math.min(this.pausedTime + sessionElapsed, this.storyDuration);
        }
        
        const currentProgressBar = this.progressBarsContainer.querySelectorAll('.story-progress-fill')[this.currentIndex];
        if (currentProgressBar) {
            // Stop the animation at current position
            const computedStyle = window.getComputedStyle(currentProgressBar);
            const currentWidth = computedStyle.width;
            currentProgressBar.style.transition = 'none';
            currentProgressBar.style.width = currentWidth;
        }
    }
    
    async nextStory() {
        this.pauseStory();
        
        if (this.currentIndex < this.stories.length - 1) {
            await this.showStory(this.currentIndex + 1);
            this.playStory();
        } else {
            this.closeStories();
        }
    }
    
    async previousStory() {
        this.pauseStory();
        
        if (this.currentIndex > 0) {
            await this.showStory(this.currentIndex - 1);
            this.playStory();
        } else {
            // If at first story, restart it
            await this.showStory(0);
            this.playStory();
        }
    }
}
