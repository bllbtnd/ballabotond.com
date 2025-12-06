// SEO and Schema.org utilities

import type {
    BreadcrumbItem,
    SchemaOrgPerson,
    SchemaOrgWebsite,
    Language
} from '../types';
import { SITE_CONFIG, SCHEMA_SAME_AS_LINKS } from '../config/constants';

/**
 * Generates breadcrumb structured data
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[], pageUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: items.map(item => ({
            '@type': 'ListItem',
            position: item.position,
            name: item.name,
            item: item.item
        }))
    };
}

/**
 * Generates Person schema
 */
export function generatePersonSchema(): SchemaOrgPerson {
    return {
        '@type': 'Person',
        '@id': `${SITE_CONFIG.url}#person`,
        name: SITE_CONFIG.title,
        alternateName: ['Botond Balla', 'bllbtnd'],
        description: SITE_CONFIG.description,
        url: SITE_CONFIG.url,
        image: `${SITE_CONFIG.url}/assets/images/image.png`,
        sameAs: [...SCHEMA_SAME_AS_LINKS],
        jobTitle: 'Software Developer',
        alumniOf: {
            '@type': 'EducationalOrganization',
            name: 'University of Pécs'
        },
        nationality: {
            '@type': 'Country',
            name: 'Hungary'
        },
        knowsLanguage: [
            {
                '@type': 'Language',
                name: 'Hungarian',
                alternateName: 'hu'
            },
            {
                '@type': 'Language',
                name: 'English',
                alternateName: 'en'
            }
        ],
        hasOccupation: {
            '@type': 'Occupation',
            name: 'Software Developer',
            occupationLocation: {
                '@type': 'Country',
                name: 'Hungary'
            }
        },
        worksFor: {
            '@type': 'Organization',
            name: 'LogiCloud KFT'
        }
    };
}

/**
 * Generates Website schema
 */
export function generateWebsiteSchema(languages: string[]): SchemaOrgWebsite {
    return {
        '@type': 'WebSite',
        '@id': `${SITE_CONFIG.url}#website`,
        name: SITE_CONFIG.title,
        url: SITE_CONFIG.url,
        description: SITE_CONFIG.description,
        inLanguage: languages,
        publisher: {
            '@id': `${SITE_CONFIG.url}#person`
        },
        creator: {
            '@id': `${SITE_CONFIG.url}#person`
        },
        sameAs: [...SCHEMA_SAME_AS_LINKS]
    };
}

/**
 * Generates base schema with person and website
 */
export function generateBaseSchema(languages: string[]) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            generatePersonSchema(),
            generateWebsiteSchema(languages)
        ]
    };
}

/**
 * Generates WebPage schema
 */
export function generateWebPageSchema(
    pageUrl: string,
    title: string,
    description: string,
    lang: Language,
    heroImage?: string
) {
    const schema: any = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        description,
        inLanguage: lang,
        isPartOf: {
            '@id': `${SITE_CONFIG.url}#website`
        },
        about: {
            '@id': `${SITE_CONFIG.url}#person`
        },
        mainEntity: {
            '@id': `${SITE_CONFIG.url}#person`
        }
    };

    if (heroImage) {
        schema.primaryImageOfPage = {
            '@type': 'ImageObject',
            '@id': `${heroImage}#primaryimage`,
            url: heroImage,
            width: 1200,
            height: 1200,
            caption: title
        };
    }

    return schema;
}

/**
 * Locale mapping for hreflang
 */
export const LOCALE_MAP: Record<string, string> = {
    en: 'en_US',
    hu: 'hu_HU',
    it: 'it_IT',
    zh: 'zh_CN',
    ja: 'ja_JP'
};

/**
 * Hreflang mapping
 */
export const HREFLANG_MAP: Record<string, string> = {
    en: 'en-US',
    hu: 'hu-HU',
    it: 'it-IT',
    zh: 'zh-CN',
    ja: 'ja-JP'
};

/**
 * Strips locale from path
 */
export function stripLocaleFromPath(pathname: string, supportedLocales: string[]): string {
    const segments = pathname.split('/');
    const potentialLocale = segments[1];

    if (potentialLocale && supportedLocales.includes(potentialLocale)) {
        const rest = segments.slice(2).join('/');
        return rest ? `/${rest}` : '/';
    }

    return pathname || '/';
}

/**
 * Generates alternate links for different languages
 */
export function generateAlternateLinks(
    pathname: string,
    supportedLocales: string[],
    siteUrl: string = SITE_CONFIG.url
) {
    const basePath = stripLocaleFromPath(pathname, supportedLocales);

    return supportedLocales.map((code) => {
        const localizedPath = code === 'en'
            ? basePath
            : `/${code}${basePath === '/' ? '' : basePath}`;

        return {
            code,
            href: new URL(localizedPath, siteUrl).toString(),
            hrefLang: HREFLANG_MAP[code] || code
        };
    });
}
