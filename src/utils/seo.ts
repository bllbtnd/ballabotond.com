// SEO and Schema.org utilities

import { SITE_CONFIG, SCHEMA_SAME_AS_LINKS } from '../config/constants';

interface SchemaOrgPerson {
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

interface SchemaOrgWebsite {
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

function generatePersonSchema(): SchemaOrgPerson {
    return {
        '@type': 'Person',
        '@id': `${SITE_CONFIG.url}#person`,
        name: SITE_CONFIG.title,
        alternateName: ['Botond Balla', 'bllbtnd'],
        description: SITE_CONFIG.description,
        url: SITE_CONFIG.url,
        image: `${SITE_CONFIG.url}/assets/images/profile.webp`,
        sameAs: [...SCHEMA_SAME_AS_LINKS],
        jobTitle: 'Software Engineer',
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
            name: 'Software Engineer',
            occupationLocation: {
                '@type': 'Country',
                name: 'Hungary'
            }
        },
        worksFor: {
            '@type': 'Organization',
            name: 'Tresorit',
            url: 'https://tresorit.com'
        }
    };
}

function generateWebsiteSchema(languages: string[]): SchemaOrgWebsite {
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
 * Locale mapping for og:locale
 */
export const LOCALE_MAP: Record<string, string> = {
    en: 'en_US',
    hu: 'hu_HU',
    it: 'it_IT'
};

/**
 * Hreflang mapping
 */
export const HREFLANG_MAP: Record<string, string> = {
    en: 'en-US',
    hu: 'hu-HU',
    it: 'it-IT'
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
