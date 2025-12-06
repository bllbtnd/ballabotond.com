// Shared TypeScript types and interfaces

export interface SocialLink {
    id: string;
    href: string;
    icon: string;
    i18nKey: string;
    external: boolean;
}

export interface Project {
    id: string;
    category: string;
    title: string;
    description: string;
    buttonText: string;
    url: string;
    icon: string;
    status: 'active' | 'coming-soon' | 'maintenance' | 'past';
    copyToClipboard?: boolean;
}

export interface ProjectSchema {
    '@type': string;
    [key: string]: any;
}

export interface StatusBadge {
    text: string;
    class: string;
    color: string;
}

export interface ContributionDay {
    date: string;
    count: number;
    level: number;
}

export interface GitHubStats {
    total: number;
    max: number;
    avgPerWeek: number;
    currentStreak: number;
    longestStreak: number;
    activeDays: number;
    quietDays: number;
    dailyAvg: string;
    bestDay: string;
    bestDayCount: number;
    bestMonth: string;
    bestMonthCount: number;
    distribution: {
        light: number;
        moderate: number;
        heavy: number;
        intense: number;
    };
    lightPct: string;
    moderatePct: string;
    heavyPct: string;
    intensePct: string;
    bestWeek: number;
    activeWeeks: number;
}

export interface SEOMetadata {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
    ogImage: string;
    author?: string;
    locale?: string;
}

export interface BreadcrumbItem {
    position: number;
    name: string;
    item: string;
}

export type Language = 'en' | 'hu' | 'it' | 'zh' | 'ja';

export interface TranslationFunction {
    (key: string): string;
}

export interface SchemaOrgPerson {
    '@type': 'Person';
    '@id': string;
    name: string;
    alternateName?: string[];
    description?: string;
    url: string;
    image?: string;
    sameAs?: string[];
    jobTitle?: string;
    alumniOf?: any;
    nationality?: any;
    knowsLanguage?: any[];
    hasOccupation?: any;
    worksFor?: any;
}

export interface SchemaOrgWebsite {
    '@type': 'WebSite';
    '@id': string;
    name: string;
    url: string;
    description: string;
    inLanguage?: string[];
    publisher?: { '@id': string };
    creator?: { '@id': string };
    sameAs?: string[];
}
