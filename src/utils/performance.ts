// Performance optimization utilities

/**
 * Lazy load an image when it enters viewport
 */
export function lazyLoadImage(img: HTMLImageElement) {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target as HTMLImageElement;
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove('lazy');
                        observer.unobserve(lazyImage);
                    }
                }
            });
        });
        observer.observe(img);
    } else {
        // Fallback for browsers without IntersectionObserver
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    }
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string, type?: string) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
}

/**
 * Defer non-critical script
 */
export function deferScript(src: string, callback?: () => void) {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    if (callback) script.onload = callback;
    document.body.appendChild(script);
}

/**
 * Request idle callback with fallback
 */
export function runWhenIdle(callback: () => void, timeout: number = 2000) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout });
    } else {
        setTimeout(callback, 1);
    }
}

/**
 * Optimized requestAnimationFrame helper
 */
export function raf(callback: () => void) {
    if ('requestAnimationFrame' in window) {
        requestAnimationFrame(callback);
    } else {
        setTimeout(callback, 16); // ~60fps fallback
    }
}

/**
 * Throttle function for better performance
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return function (this: any, ...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get connection speed estimate
 */
export function getConnectionSpeed(): 'slow' | 'medium' | 'fast' {
    // @ts-ignore - Navigator.connection is experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (!connection) return 'medium';

    const effectiveType = connection.effectiveType;

    if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
    if (effectiveType === '3g') return 'medium';
    return 'fast';
}

/**
 * Optimize animations based on device capabilities
 */
export function shouldUseComplexAnimations(): boolean {
    // Reduce animations on slow connections
    if (getConnectionSpeed() === 'slow') return false;

    // Respect user preference
    if (prefersReducedMotion()) return false;

    // Check hardware concurrency (CPU cores)
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        return false;
    }

    return true;
}

/**
 * Preconnect to external domains
 */
export function preconnect(url: string) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
}

/**
 * DNS prefetch for external domains
 */
export function dnsPrefetch(url: string) {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = url;
    document.head.appendChild(link);
}

/**
 * Measure and log performance metrics
 */
export function logPerformanceMetrics() {
    if ('performance' in window && performance.getEntriesByType) {
        runWhenIdle(() => {
            const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

            if (perfData) {
                const metrics = {
                    dns: perfData.domainLookupEnd - perfData.domainLookupStart,
                    tcp: perfData.connectEnd - perfData.connectStart,
                    request: perfData.responseStart - perfData.requestStart,
                    response: perfData.responseEnd - perfData.responseStart,
                    dom: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    load: perfData.loadEventEnd - perfData.loadEventStart,
                    total: perfData.loadEventEnd - perfData.fetchStart
                };

                console.log('📊 Performance Metrics:', metrics);
            }
        });
    }
}

/**
 * Critical CSS inline helper
 */
export function loadStylesheet(href: string) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.onload = function () {
        link.media = 'all';
    };
    document.head.appendChild(link);
}
