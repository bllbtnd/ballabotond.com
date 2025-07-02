// Projects configuration
// Add your projects here and they will automatically appear on the projects page

window.PROJECTS_CONFIG = [
    {
        id: 'minecraft-server',
        category: {
            en: 'Gaming',
            hu: 'Játékok'
        },
        title: {
            en: 'Minecraft Server',
            hu: 'Minecraft Szerver'
        },
        description: {
            en: 'Private survival server for friends with custom plugins and a welcoming community.',
            hu: 'Privát túlélő szerver barátoknak egyedi bővítményekkel és barátságos közösséggel.'
        },
        buttonText: {
            en: 'Join Server',
            hu: 'Csatlakozás'
        },
        url: '#', // Replace with your server IP or info page
        icon: 'fas fa-cube',
        status: 'coming-soon', // 'active', 'coming-soon', 'maintenance'
        image: null, // Optional: path to image
        enabled: true
    },
    {
        id: 'web-portfolio',
        category: {
            en: 'Web Applications',
            hu: 'Webalkalmazások'
        },
        title: {
            en: 'Personal Portfolio',
            hu: 'Személyes Portfólió'
        },
        description: {
            en: 'A showcase of my development projects, skills, and professional experience.',
            hu: 'Fejlesztési projektjeim, készségeim és szakmai tapasztalataim bemutatása.'
        },
        buttonText: {
            en: 'View Portfolio',
            hu: 'Portfólió Megtekintése'
        },
        url: '#',
        icon: 'fas fa-code',
        status: 'coming-soon',
        image: null,
        enabled: true
    },
    {
        id: 'task-manager',
        category: {
            en: 'Tools & Utilities',
            hu: 'Eszközök & Segédprogramok'
        },
        title: {
            en: 'Task Manager App',
            hu: 'Feladatkezelő Alkalmazás'
        },
        description: {
            en: 'A clean and efficient task management application with priority sorting and deadline tracking.',
            hu: 'Tiszta és hatékony feladatkezelő alkalmazás prioritás rendezéssel és határidő követéssel.'
        },
        buttonText: {
            en: 'Try It Out',
            hu: 'Kipróbálás'
        },
        url: '#',
        icon: 'fas fa-tasks',
        status: 'coming-soon',
        image: null,
        enabled: true
    },
    {
        id: 'github-profile',
        category: {
            en: 'Additional Links',
            hu: 'További Linkek'
        },
        title: {
            en: 'GitHub Repositories',
            hu: 'GitHub Tárolók'
        },
        description: {
            en: 'Explore my open-source projects and contributions on GitHub.',
            hu: 'Fedezd fel nyílt forráskódú projektjeimet és hozzájárulásaimat a GitHubon.'
        },
        buttonText: {
            en: 'View on GitHub',
            hu: 'Megtekintés GitHubon'
        },
        url: 'https://github.com/bllbtnd',
        icon: 'fab fa-github',
        status: 'active',
        image: null,
        enabled: true
    },
    {
        id: 'blog',
        category: {
            en: 'Additional Links',
            hu: 'További Linkek'
        },
        title: {
            en: 'Development Blog',
            hu: 'Fejlesztői Blog'
        },
        description: {
            en: 'Technical insights, tutorials, and thoughts on modern web development.',
            hu: 'Technikai betekintések, oktatóanyagok és gondolatok a modern webfejlesztésről.'
        },
        buttonText: {
            en: 'Read Blog',
            hu: 'Blog Olvasása'
        },
        url: '#',
        icon: 'fas fa-blog',
        status: 'coming-soon',
        image: null,
        enabled: false // Set to false to hide this card
    }
];

// Status configurations
window.STATUS_CONFIG = {
    'active': {
        en: 'Live',
        hu: 'Elérhető',
        class: 'active',
        color: '#28a745'
    },
    'coming-soon': {
        en: 'Coming Soon',
        hu: 'Hamarosan',
        class: 'coming-soon',
        color: '#ffc107'
    },
    'maintenance': {
        en: 'Maintenance',
        hu: 'Karbantartás',
        class: 'maintenance',
        color: '#dc3545'
    }
};
