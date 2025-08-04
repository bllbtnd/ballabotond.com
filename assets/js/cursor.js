// Custom Cursor Functionality
// This script creates a luxury custom cursor with golden accent color
// Author: Balla Botond

(function() {
    'use strict';
    
    let cursor = null;
    let cursorHover = null;
    let mouseX = 0;
    let mouseY = 0;
    let isInitialized = false;
    
    // Initialize custom cursor when DOM is ready
    function initCustomCursor() {
        // Prevent multiple initializations
        if (isInitialized) return;
        
        // Check if device supports hover (not touch devices)
        const supportsHover = window.matchMedia('(hover: hover)').matches;
        
        if (!supportsHover) {
            console.log('Custom cursor disabled on touch device');
            return;
        }
        
        console.log('Initializing custom cursor...');
        
        createCursors();
        setupEventListeners();
        enableCursorHiding();
        
        isInitialized = true;
        console.log('Custom cursor initialized successfully');
    }
    
    // Create cursor elements
    function createCursors() {
        // Remove any existing cursors first
        removeCursors();
        
        // Main cursor
        cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 8px;
            height: 8px;
            background: #d4af37;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            mix-blend-mode: difference;
            opacity: 0.9;
        `;
        
        // Hover cursor (larger)
        cursorHover = document.createElement('div');
        cursorHover.className = 'custom-cursor-hover';
        cursorHover.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 12px;
            height: 12px;
            background: #d4af37;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%) scale(0.8);
            transition: all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            mix-blend-mode: difference;
            opacity: 0;
        `;
        
        document.body.appendChild(cursor);
        document.body.appendChild(cursorHover);
    }
    
    // Remove cursor elements
    function removeCursors() {
        const existingCursors = document.querySelectorAll('.custom-cursor, .custom-cursor-hover');
        existingCursors.forEach(el => el.remove());
        cursor = null;
        cursorHover = null;
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Mouse move event
        document.addEventListener('mousemove', updateCursor, { passive: true });
        
        // Hover detection with separate events for better control
        document.addEventListener('mouseover', handleMouseOver, { passive: true });
        document.addEventListener('mouseout', handleMouseOut, { passive: true });
        
        // Hide cursor when mouse leaves window
        document.addEventListener('mouseleave', hideCursor, { passive: true });
        
        // Show cursor when mouse enters window
        document.addEventListener('mouseenter', showCursor, { passive: true });
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Watch for dynamically added elements and apply cursor hiding
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Apply cursor hiding to new elements
                            if (node.style) {
                                node.style.cursor = 'none';
                            }
                            // Apply to child elements too
                            const childElements = node.querySelectorAll && node.querySelectorAll('*');
                            if (childElements) {
                                childElements.forEach(child => {
                                    if (child.style) {
                                        child.style.cursor = 'none';
                                    }
                                });
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Store observer for cleanup
        window._cursorObserver = observer;
    }
    
    // Update cursor position
    function updateCursor(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (cursor) {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        }
        if (cursorHover) {
            cursorHover.style.left = mouseX + 'px';
            cursorHover.style.top = mouseY + 'px';
        }
    }
    
    // Handle hover states for interactive elements
    function handleMouseOver(e) {
        const isInteractive = e.target.matches(`
            a, button, input, textarea, select, 
            .clickable, [onclick], [role="button"],
            .social-link, .stories-close, 
            .story-nav-left, .story-nav-right,
            .story-navigation, .story-nav-area,
            #profile-image, .profile-image, .profile-image img,
            .language-toggle, .home-button, .download-pdf,
            .current-story, .project-card,
            .skill-tag, .contact-item a,
            .experience-header a, .education-header a,
            .resume-header, .back-button,
            img[onclick], img[style*="cursor"], 
            .loader-image, .stories-modal img
        `) || e.target.closest(`
            a, button, .clickable, [onclick], 
            .social-link, .project-card,
            .profile-image, .stories-close
        `);
        
        if (isInteractive) {
            if (cursor) cursor.style.opacity = '0.5';
            if (cursorHover) {
                cursorHover.style.opacity = '1';
                cursorHover.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        }
    }
    
    function handleMouseOut(e) {
        // Always reset to default state when not hovering
        if (cursor) cursor.style.opacity = '0.9';
        if (cursorHover) {
            cursorHover.style.opacity = '0';
            cursorHover.style.transform = 'translate(-50%, -50%) scale(0.8)';
        }
    }
    
    function hideCursor() {
        if (cursor) cursor.style.opacity = '0';
        if (cursorHover) cursorHover.style.opacity = '0';
    }
    
    function showCursor() {
        if (cursor) cursor.style.opacity = '0.9';
    }
    
    function handleVisibilityChange() {
        if (document.hidden) {
            hideCursor();
        } else {
            showCursor();
        }
    }
    
    // Enable cursor hiding for default cursor
    function enableCursorHiding() {
        // Add styles to hide default cursor
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                cursor: none !important;
            }
            body, html {
                cursor: none !important;
            }
            /* Specifically target elements that might override cursor */
            a, button, input, textarea, select, 
            .clickable, [onclick], [role="button"],
            .social-link, .stories-close,
            .story-nav-left, .story-nav-right,
            #profile-image, .profile-image, .profile-image img,
            .language-toggle, .home-button, .download-pdf,
            .current-story, .project-card,
            .skill-tag, .contact-item a,
            .experience-header a, .education-header a,
            .resume-header, .back-button,
            /* Stories specific elements */
            .stories-modal, .stories-container, .stories-content,
            .story-navigation, .story-nav-area, .story-prev, .story-next,
            /* Image elements */
            img, .loader-image {
                cursor: none !important;
            }
            /* Override any inline styles */
            [style*="cursor"] {
                cursor: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Cleanup function
    function cleanup() {
        document.removeEventListener('mousemove', updateCursor);
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('mouseout', handleMouseOut);
        document.removeEventListener('mouseleave', hideCursor);
        document.removeEventListener('mouseenter', showCursor);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        
        // Disconnect mutation observer
        if (window._cursorObserver) {
            window._cursorObserver.disconnect();
            window._cursorObserver = null;
        }
        
        removeCursors();
        isInitialized = false;
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCustomCursor);
    } else {
        // DOM is already ready
        initCustomCursor();
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
    
    // Expose cleanup function globally if needed
    window.cleanupCustomCursor = cleanup;
    
})();
