// Advanced SEO configuration and keywords

import { SITE_CONFIG } from './constants';

// Primary keywords for different pages
export const SEO_KEYWORDS = {
    global: [
        'Balla Botond',
        'bllbtnd',
        'software developer',
        'web developer',
        'computer science',
        'full stack developer',
        'Hungary developer',
        'Pécs developer',
        'portfolio'
    ],
    home: [
        'software engineer portfolio',
        'web development portfolio',
        'computer science student',
        'junior developer',
        'programming portfolio',
        'tech portfolio',
        'developer showcase',
        'coding projects'
    ],
    projects: [
        'web applications',
        'mobile apps',
        'software projects',
        'GitHub projects',
        'open source projects',
        'developer portfolio projects',
        'React projects',
        'full stack projects',
        'programming showcase'
    ],
    resume: [
        'software developer resume',
        'web developer CV',
        'computer science resume',
        'programming experience',
        'technical skills',
        'developer qualifications',
        'software engineer CV',
        'coding experience'
    ]
} as const;

// Enhanced meta descriptions with keywords
export const SEO_DESCRIPTIONS = {
    home: {
        en: 'Balla Botond - Software Developer & Computer Science Student. Explore my web development portfolio, projects, and technical expertise. Available for freelance work and collaboration.',
        hu: 'Balla Botond - Szoftverfejlesztő és Programtervező Informatikus. Fedezd fel webfejlesztési portfoliómat, projektjeimet és szakmai tapasztalatomat. Elérhető szabadúszó munkára.',
        it: 'Balla Botond - Sviluppatore Software e Studente di Informatica. Esplora il mio portfolio di sviluppo web, progetti e competenze tecniche.',
        zh: 'Balla Botond - 软件开发人员和计算机科学学生。探索我的网页开发作品集、项目和技术专长。',
        ja: 'Balla Botond - ソフトウェア開発者およびコンピューターサイエンス学生。Webデベロップメントポートフォリオ、プロジェクト、技術的専門知識をご覧ください。'
    },
    projects: {
        en: 'Browse Balla Botond\'s software projects including web applications, mobile apps, and open-source contributions. View live demos and GitHub repositories of full-stack development work.',
        hu: 'Böngészd Balla Botond szoftverprojektjeit, beleértve webalkalmazásokat, mobilappokat és open-source közreműködéseket. Nézd meg az élő demókat és GitHub projekteket.',
        it: 'Sfoglia i progetti software di Balla Botond, inclusi applicazioni web, app mobili e contributi open-source. Visualizza demo dal vivo e repository GitHub.',
        zh: 'Balla Botond的软件项目，包括Web应用程序、移动应用程序和开源贡献。查看全栈开发工作的实时演示和GitHub存储库。',
        ja: 'Balla BotondのWebアプリケーション、モバイルアプリ、オープンソース貢献を含むソフトウェアプロジェクトをご覧ください。'
    },
    resume: {
        en: 'Balla Botond\'s professional resume and CV. View education, work experience, technical skills, and qualifications as a software developer and computer science student.',
        hu: 'Balla Botond szakmai életrajza és CV-je. Tekintsd meg végzettségemet, munkatapasztalatomat, technikai készségeimet szoftverfejlesztőként.',
        it: 'Curriculum professionale e CV di Balla Botond. Visualizza istruzione, esperienza lavorativa, competenze tecniche come sviluppatore software.',
        zh: 'Balla Botond的专业简历。查看软件开发人员和计算机科学学生的教育、工作经验、技术技能和资格。',
        ja: 'Balla Botondの専門的な履歴書とCV。ソフトウェア開発者およびコンピューターサイエンス学生としての教育、職歴、技術スキルをご覧ください。'
    }
} as const;

// Enhanced titles with keywords
export const SEO_TITLES = {
    home: {
        en: 'Balla Botond | Software Developer & Web Development Portfolio',
        hu: 'Balla Botond | Szoftverfejlesztő & Webfejlesztési Portfólió',
        it: 'Balla Botond | Sviluppatore Software & Portfolio Sviluppo Web',
        zh: 'Balla Botond | 软件开发人员和网页开发作品集',
        ja: 'Balla Botond | ソフトウェア開発者＆Web開発ポートフォリオ'
    },
    projects: {
        en: 'Projects | Balla Botond - Web & Mobile Development Portfolio',
        hu: 'Projektek | Balla Botond - Web & Mobil Fejlesztési Portfólió',
        it: 'Progetti | Balla Botond - Portfolio Sviluppo Web e Mobile',
        zh: '项目 | Balla Botond - Web和移动开发作品集',
        ja: 'プロジェクト | Balla Botond - WebとMobile開発ポートフォリオ'
    },
    resume: {
        en: 'Resume | Balla Botond - Software Developer CV & Experience',
        hu: 'Önéletrajz | Balla Botond - Szoftverfejlesztő CV & Tapasztalat',
        it: 'Curriculum | Balla Botond - CV Sviluppatore Software ed Esperienza',
        zh: '简历 | Balla Botond - 软件开发人员简历和经验',
        ja: '履歴書 | Balla Botond - ソフトウェア開発者CVと経験'
    }
} as const;

// Geo-targeting for local SEO
export const GEO_TARGETING = {
    country: 'Hungary',
    region: 'HU-BA', // Baranya county
    city: 'Pécs',
    coordinates: {
        latitude: 46.0727,
        longitude: 18.2328
    }
} as const;

// Professional profiles for SEO
export const PROFESSIONAL_PROFILES = {
    github: 'https://github.com/bllbtnd',
    linkedin: 'https://www.linkedin.com/in/ballabotond/', // Update if you have LinkedIn
    stackoverflow: '', // Add if you have Stack Overflow
    devto: '', // Add if you have Dev.to
    medium: '', // Add if you have Medium
    twitter: 'https://twitter.com/bllbtnd',
} as const;

// Skills for SEO and schema
export const TECHNICAL_SKILLS = {
    languages: [
        'JavaScript',
        'TypeScript',
        'Python',
        'Java',
        'HTML5',
        'CSS3',
        'SQL'
    ],
    frameworks: [
        'React',
        'Astro',
        'Node.js',
        'Express',
        'Tailwind CSS',
        'Vue.js'
    ],
    tools: [
        'Git',
        'GitHub',
        'VS Code',
        'Docker',
        'Linux',
        'Figma'
    ],
    concepts: [
        'Web Development',
        'Full Stack Development',
        'Responsive Design',
        'RESTful APIs',
        'Database Design',
        'Version Control',
        'Agile Development',
        'UI/UX Design'
    ]
} as const;

// Rich snippets data
export const FAQ_ITEMS = [
    {
        question: 'Who is Balla Botond?',
        answer: 'Balla Botond is a software developer and computer science student from Hungary, specializing in web development and full-stack applications.'
    },
    {
        question: 'What programming languages does Balla Botond know?',
        answer: 'Balla Botond is proficient in JavaScript, TypeScript, Python, Java, and has experience with modern web technologies like React, Astro, and Node.js.'
    },
    {
        question: 'Is Balla Botond available for freelance work?',
        answer: 'Yes, Balla Botond is available for freelance web development projects and collaborations. Contact via email for inquiries.'
    },
    {
        question: 'Where is Balla Botond located?',
        answer: 'Balla Botond is based in Pécs, Hungary, and works on projects both locally and remotely.'
    }
] as const;

// Organization schema for business/professional sites
export const ORGANIZATION_INFO = {
    type: 'Person', // or 'Organization' if you have a company
    name: 'Balla Botond',
    alternateName: 'bllbtnd',
    description: 'Software Developer & Computer Science Student',
    email: 'contact@ballabotond.com', // Update with real email
    telephone: '', // Add if public
    address: {
        addressCountry: 'HU',
        addressRegion: 'Komárom-Esztergom',
        addressLocality: 'Esztergom'
    }
} as const;
