// 404.js - Custom JS for 404 page

document.addEventListener('DOMContentLoaded', function() {
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
