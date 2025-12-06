// Utility functions for common tasks

/**
 * Formats a date to show only the year
 */
export function formatYear(date: Date): string {
    return date.getFullYear().toString();
}

/**
 * Formats a date to a more readable format
 */
export function formatDate(date: Date, locale: string = 'en'): string {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

/**
 * Generates an absolute URL from a path
 */
export function getAbsoluteUrl(path: string, siteUrl: string = 'https://ballabotond.com'): string {
    return new URL(path, siteUrl).toString();
}

/**
 * Resolves a project URL (handles relative, absolute, and domain-only URLs)
 */
export function resolveProjectUrl(url: string, fallbackId: string, pageUrl: string): string {
    if (!url) return `${pageUrl}#${fallbackId}`;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return getAbsoluteUrl(url);
    return `https://${url}`;
}

/**
 * Calculates animation delay based on index
 */
export function getAnimationDelay(index: number, baseDelay: number = 1.2, increment: number = 0.2): string {
    return `${baseDelay + index * increment}s`;
}

/**
 * Truncates text to a specified length
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Debounces a function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function (this: any, ...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func.apply(this, args);
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Checks if a code is a valid language code
 */
export function isValidLanguage(code: string, supportedLanguages: string[]): boolean {
    return supportedLanguages.includes(code);
}
