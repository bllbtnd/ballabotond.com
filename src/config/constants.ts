// Site-wide constants and configurations
export const SITE_CONFIG = {
    title: 'Balla Botond',
    url: 'https://ballabotond.com',
    author: 'Balla Botond',
    description: 'Personal website of Balla Botond - Software Engineer & Computer Science Student'
} as const;

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
        id: 'facebook',
        href: 'https://ballabotond.com/facebook',
        i18nKey: 'common.facebook'
    },
    {
        id: 'instagram',
        href: 'https://ballabotond.com/instagram',
        i18nKey: 'common.instagram'
    },
    {
        id: 'youtube',
        href: 'https://ballabotond.com/youtube',
        i18nKey: 'common.youtube'
    },
    {
        id: 'linkedin',
        href: 'https://linkedin.com/in/ballabotond',
        i18nKey: 'common.linkedin'
    },
    {
        id: 'twitter',
        href: 'https://ballabotond.com/x',
        i18nKey: 'common.twitter'
    }
] as const;

export const SCHEMA_SAME_AS_LINKS = [
    'https://github.com/bllbtnd',
    'https://www.facebook.com/balla.botond',
    'https://www.instagram.com/bllbtnd',
    'https://www.youtube.com/@bllbtnd',
    'https://linkedin.com/in/ballabotond'
] as const;
