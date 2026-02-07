// Site-wide constants and configurations
export const SITE_CONFIG = {
    title: 'Balla Botond',
    url: 'https://ballabotond.com',
    author: 'Balla Botond',
    description: 'Personal website of Balla Botond - Software Developer & Computer Science Student',
    github: {
        username: 'bllbtnd',
        apiUrl: 'https://github-contributions-api.jogruber.de/v4'
    }
} as const;

export const DESIGN_TOKENS = {
    colors: {
        luxuryGold: '#c9a96b',
        luxuryGoldLight: '#e8c474',
        luxuryGray: '#b4b4b6',
        luxuryGrayDark: '#8e8e93'
    },
    gradients: {
        main: 'linear-gradient(135deg, #0b0b0f 0%, #1a1a20 50%, #0b0b0f 100%)',
        pattern: 'radial-gradient(circle at 20% 20%, rgba(201, 169, 107, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(201, 169, 107, 0.08) 0%, transparent 50%)'
    },
    animation: {
        fadeDelayIncrement: 0.3, // seconds
        scrollFadeStart: 100, // pixels
        scrollFadeEnd: 300 // pixels
    }
} as const;

export const SOCIAL_LINKS = [
    {
        id: 'email',
        href: 'https://ballabotond.com/email',
        icon: 'fas fa-envelope',
        i18nKey: 'common.email',
        external: false
    },
    {
        id: 'signal',
        href: 'https://signal.me/#eu/botond.25',
        icon: 'fa-brands fa-signal-messenger',
        i18nKey: 'common.signal',
        external: true
    },
    {
        id: 'github',
        href: 'https://ballabotond.com/github',
        icon: 'fab fa-github',
        i18nKey: 'common.github',
        external: true
    },
    {
        id: 'facebook',
        href: 'https://ballabotond.com/facebook',
        icon: 'fab fa-facebook',
        i18nKey: 'common.facebook',
        external: true
    },
    {
        id: 'instagram',
        href: 'https://ballabotond.com/instagram',
        icon: 'fab fa-instagram',
        i18nKey: 'common.instagram',
        external: true
    },
    {
        id: 'youtube',
        href: 'https://ballabotond.com/youtube',
        icon: 'fab fa-youtube',
        i18nKey: 'common.youtube',
        external: true
    },
    {
        id: 'linkedin',
        href: 'https://linkedin.com/in/ballabotond',
        icon: 'fab fa-linkedin',
        i18nKey: 'common.linkedin',
        external: true
    },
    {
        id: 'twitter',
        href: 'https://ballabotond.com/x',
        icon: 'fa-brands fa-x-twitter',
        i18nKey: 'common.twitter',
        external: true
    }
] as const;

export const SCHEMA_SAME_AS_LINKS = [
    'https://github.com/bllbtnd',
    'https://www.facebook.com/balla.botond',
    'https://www.instagram.com/bllbtnd',
    'https://www.youtube.com/@bllbtnd',
    'https://linkedin.com/in/ballabotond'
] as const;

// Project IDs for easy reference
export const PROJECT_IDS = {
    VORTEX_CHAT: 'vortex-chat',
    KKI_CALCULATOR: 'kki-calculator',
    FINANCE_TRACKER: 'finance-tracker',
    TRACKIT_APP: 'trackit-app',
    MINECRAFT_SERVER: 'minecraft-server'
} as const;
