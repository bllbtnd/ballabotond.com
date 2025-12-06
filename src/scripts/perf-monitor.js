// Inline performance monitoring script (minified version)
// Add to <head> for early metrics collection

(function () {
    // Mark script start
    performance.mark('script-start');

    // Store initial metrics
    window.__perf = {
        start: Date.now(),
        marks: {}
    };

    // Quick feature detection
    const supports = {
        webp: document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0,
        intersection: 'IntersectionObserver' in window,
        idle: 'requestIdleCallback' in window
    };

    window.__supports = supports;

    // Prefetch DNS for external resources
    ['fonts.googleapis.com', 'cdnjs.cloudflare.com'].forEach(function (domain) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = '//' + domain;
        document.head.appendChild(link);
    });

    // Early loading screen removal
    window.addEventListener('load', function () {
        requestAnimationFrame(function () {
            document.body.classList.remove('loading');
            performance.mark('page-interactive');
        });
    });

    // Log metrics when idle
    if (supports.idle) {
        requestIdleCallback(function () {
            var perfData = performance.getEntriesByType('navigation')[0];
            if (perfData && console.table) {
                console.table({
                    'DNS': Math.round(perfData.domainLookupEnd - perfData.domainLookupStart) + 'ms',
                    'TCP': Math.round(perfData.connectEnd - perfData.connectStart) + 'ms',
                    'DOM': Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart) + 'ms',
                    'Load': Math.round(perfData.loadEventEnd - perfData.fetchStart) + 'ms'
                });
            }
        });
    }
})();
