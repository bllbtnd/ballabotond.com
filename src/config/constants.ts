// Site-wide constants and configurations

// Cloudflare Web Analytics beacon token (cookieless, no consent banner needed).
// Get it at: Cloudflare dashboard → Analytics & Logs → Web Analytics → Add site.
// Leave empty to disable analytics entirely.
export const CF_ANALYTICS_TOKEN = '3afcbc1aee4b46c88af0d4b8b3b1ecfd';

export const SITE_CONFIG = {
    title: 'Balla Botond',
    url: 'https://ballabotond.com',
    author: 'Balla Botond',
    description: 'Personal website of Balla Botond - Software Engineer'
} as const;

// Channels rendered in the footer; other profiles live in SCHEMA_SAME_AS_LINKS.
export const SOCIAL_LINKS = [
    {
        id: 'email',
        href: 'mailto:contact@ballabotond.com',
        i18nKey: 'common.email'
    },
    {
        id: 'github',
        href: 'https://ballabotond.com/github',
        i18nKey: 'common.github'
    },
    {
        id: 'linkedin',
        href: 'https://linkedin.com/in/ballabotond',
        i18nKey: 'common.linkedin'
    }
] as const;

export const SCHEMA_SAME_AS_LINKS = [
    'https://github.com/bllbtnd',
    'https://www.facebook.com/balla.botond',
    'https://www.instagram.com/bllbtnd',
    'https://www.youtube.com/@bllbtnd',
    'https://linkedin.com/in/ballabotond'
] as const;
