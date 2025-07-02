// Projects configuration
// Add your projects here and they will automatically appear on the projects page

window.PROJECTS_CONFIG = [
    {
        id: 'kki-calculator',
        category: {
            en: 'Web Apps',
            hu: 'Webalkalmazások'
        },
        title: {
            en: 'KKI calculator',
            hu: 'KKI kalkulátor'
        },
        description: {
            en: 'A simple KKI calculator that helps with KKI calculations.',
            hu: 'Egy egyszerű KKI kalkulátor, amely segít a KKI számításokban.'
        },
        buttonText: {
            en: 'Try it out',
            hu: 'Próbáld ki'
        },
        url: 'https://kki.ballabotond.com', // Replace with your server IP or info page
        icon: 'fas fa-brain',
        status: 'active',
        image: null, // Optional: path to image
        enabled: true
    },
    {
        id: 'trackit-app',
        category: {
            en: 'Health and Fitness',
            hu: 'Egészség és Fitnesz'
        },
        title: {
            en: 'TrackIt',
            hu: 'TrackIt'
        },
        description: {
            en: 'A fitness tracking app for monitoring workouts and progress.',
            hu: 'Egy fitnesz nyomkövető alkalmazás az edzések és a fejlődés nyomon követésére.'
        },
        buttonText: {
            en: 'Get in touch',
            hu: 'Kapcsolódj'
        },
        url: 'https://trackit.31b4.com/', // Replace with your server IP or info page
        icon: 'fas fa-weight',
        status: 'active',
        image: null,
        enabled: true
    },
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
            en: 'Copy Server IP',
            hu: 'IP Másolása'
        },
        url: 'mcserver.ballabotond.com', // Replace with your server IP or info page
        icon: 'fas fa-cube',
        status: 'active', // 'active', 'coming-soon', 'maintenance'
        image: null, // Optional: path to image
        enabled: true,
        copyToClipboard: true
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
