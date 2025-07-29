// 404.js - Custom JS for 404 page

document.addEventListener('DOMContentLoaded', function() {
    // Theme handling (match system or saved preference)
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme(prefersDarkScheme.matches ? 'dark' : 'light');
        }
    }
    prefersDarkScheme.addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
    initializeTheme();

    // Optionally, add a subtle fade-in effect
    const content = document.querySelector('.notfound-content');
    if (content) {
        content.style.opacity = 0;
        setTimeout(() => {
            content.style.transition = 'opacity 0.7s';
            content.style.opacity = 1;
        }, 100);
    }

    // Optionally, allow pressing 'Home' key to go to homepage
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Home') {
            window.location.href = '/';
        }
    });
});
