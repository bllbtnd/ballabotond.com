// Project-related utilities

import type { Project, StatusBadge } from '../types';

/**
 * Gets status badge configuration for a project
 */
export function getStatusBadge(
    status: Project['status'],
    t: (key: string) => string
): StatusBadge {
    switch (status) {
        case 'active':
            return {
                text: t('projects.status.live'),
                class: 'bg-green-500',
                color: '#28a745'
            };
        case 'coming-soon':
            return {
                text: t('projects.status.coming'),
                class: 'bg-yellow-500',
                color: '#ffc107'
            };
        case 'maintenance':
            return {
                text: t('projects.status.maintenance'),
                class: 'bg-red-500',
                color: '#dc3545'
            };
        case 'past':
            return {
                text: t('projects.status.past'),
                class: 'bg-gray-500',
                color: '#6c757d'
            };
        default:
            return {
                text: 'Unknown',
                class: 'bg-gray-500',
                color: '#6c757d'
            };
    }
}

/**
 * Checks if a project button should be disabled
 */
export function isProjectButtonDisabled(project: Project): boolean {
    const isPast = project.status === 'past';
    const isComingSoon = project.status === 'coming-soon';
    return isPast || (isComingSoon && !project.url);
}

/**
 * Gets the onclick handler for a project button
 */
export function getProjectButtonClick(
    project: Project,
    disabled: boolean,
    lang: string
): string {
    if (disabled) return '';

    if (project.copyToClipboard) {
        const messages: Record<string, string> = {
            hu: 'Szerver IP másolva a vágólapra!',
            it: 'IP server copiato negli appunti!',
            en: 'Server IP copied to clipboard!'
        };
        const message = messages[lang] || messages.en;
        return `navigator.clipboard.writeText('${project.url}'); alert('${message}');`;
    }

    return `window.open('${project.url}', '_blank')`;
}

/**
 * Generates project schema for SEO
 */
export function generateProjectSchema(
    project: Project,
    projectUrl: string,
    lang: string,
    siteUrl: string,
    schemaDetails: Record<string, any> = {}
): any {
    const details = schemaDetails[project.id] || { '@type': 'CreativeWork' };
    const { '@type': detailType = 'CreativeWork', ...rest } = details;

    return {
        '@context': 'https://schema.org',
        '@type': detailType,
        '@id': `${projectUrl}#schema`,
        name: project.title,
        description: project.description,
        url: projectUrl,
        inLanguage: lang,
        identifier: project.id,
        image: `${siteUrl}/assets/images/projects-og.png`,
        author: {
            '@id': `${siteUrl}#person`
        },
        ...rest
    };
}

/**
 * Default project schema details
 */
export const PROJECT_SCHEMA_DETAILS: Record<string, Record<string, unknown>> = {
    'vortex-chat': {
        '@type': 'SoftwareApplication',
        applicationCategory: 'CommunicationApplication',
        operatingSystem: ['Android', 'iOS'],
        downloadUrl: 'https://vortex.ballabotond.com/',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
        }
    },
    'kki-calculator': {
        '@type': 'WebApplication',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
        }
    },
    'finance-tracker': {
        '@type': 'SoftwareApplication',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        downloadUrl: 'https://github.com/apptrackit/finance',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
        }
    },
    'trackit-app': {
        '@type': 'SoftwareApplication',
        applicationCategory: 'HealthApplication',
        operatingSystem: ['Android', 'iOS'],
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/PreOrder'
        }
    },
    'minecraft-server': {
        '@type': 'VideoGame',
        applicationCategory: 'Game',
        gamePlatform: ['PC', 'Raspberry Pi'],
        gameServer: {
            '@type': 'GameServer',
            serverStatus: 'https://schema.org/OfflineTemporarily',
            playersOnline: 0
        }
    }
};
